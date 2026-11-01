const { test } = require('node:test');
const assert = require('node:assert/strict');
const { chromium } = require('playwright');
const fs = require('node:fs');
const base = process.env.MENU_MATRIX_TEST_URL || 'http://localhost:4186';

async function setup(browser, mobile = false) {
  const page = await browser.newPage({ viewport: mobile ? { width: 390, height: 844 } : { width: 1440, height: 1000 } });
  page.setDefaultTimeout(8000);
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.route('https://**/*', route => new URL(route.request().url()).origin === new URL(base).origin ? route.continue() : route.abort());
  await page.goto(base + '/app');
  await page.evaluate(() => {
    window.trainingTestUser = { username: 'admin', role: 'admin', firebaseUid: 'test-uid', status: 'active' };
    getActiveUser = () => window.trainingTestUser;
    canUserAccessMenu = () => true;
    queueFeatureAnnouncement = () => {};
    users = [normalizeUser(window.trainingTestUser), normalizeUser({ username: 'staff', role: 'viewer', status: 'active', firebaseUid: 'staff-uid' })];
    document.querySelectorAll('dialog[open]').forEach(d => d.close());
    const menu = createDemoRestaurantMenu();
    menu.owner = 'admin'; menu.id = 'training-test'; menu.restaurantId = 'test-restaurant';
    menu.items[0].pairings = ['Pinot Noir']; menu.items[0].recommendation = 'Describe the roast and the fruit in the pairing.';
    menu.items[1].pairings = ['Riesling'];
    restaurantMenus = [menu]; getVisibleRestaurantMenus = () => restaurantMenus;
    state.sharedMenu = null; state.demoMode = false; state.activeRestaurantMenu = menu.id; state.category = 'all'; menuItems = menu.items;
    window.trainingTestDb = { 'menus/main': { menus: structuredClone(restaurantMenus) } };
    const ref = path => ({ path, collection: name => ref(path + '/' + name), doc: id => ref(path + '/' + id), where() { return this; }, orderBy() { return this; }, limit() { return this; }, onSnapshot() { return () => {}; }, async get() { return { exists: Boolean(window.trainingTestDb[path]), data: () => structuredClone(window.trainingTestDb[path]) }; } });
    const db = {
      collection: name => ref(name),
      async runTransaction(callback) {
        return callback({
          get: reference => reference.get(),
          set: (reference, value, options) => { window.trainingTestDb[reference.path] = options?.merge ? { ...window.trainingTestDb[reference.path], ...structuredClone(value) } : structuredClone(value); },
          update: (reference, value) => { window.trainingTestDb[reference.path] = { ...window.trainingTestDb[reference.path], ...structuredClone(value) }; }
        });
      }
    };
    window.menuMatrixFirebase.auth = { currentUser: { uid: 'test-uid' } };
    getFirebaseDb = () => db;
    showScreen('menu'); renderActiveMenuHeader(); renderMenu();
  });
  await page.locator('#trainingHubButton').click();
  return { page, errors };
}

async function completeQuiz(page) {
  await page.locator('#quizTakerName').fill('Daniel Muhaj');
  await page.locator('#quizSetupForm button[type=submit]').click();
  for (let i = 0; i < 5; i++) {
    await page.evaluate(() => {
      const expected = state.quiz.answers;
      document.querySelectorAll('#quizOptions input').forEach(input => { input.checked = expected.includes(input.value); });
    });
    await page.locator('#quizCheckButton').click();
    if (i < 4) await page.locator('#quizNewQuestionButton').click();
  }
  await page.waitForFunction(() => state.quizSession.saved);
}

test('daily quiz saves detailed answers separately, reviews answers and links progress to account', async () => {
  const browser = await chromium.launch();
  try {
    const { page, errors } = await setup(browser, true);
    await page.locator('[data-training-action="daily"]').click();
    await completeQuiz(page);
    assert.equal(await page.locator('#quizAnswerReview .training-review-row').count(), 5);
    const recorded = await page.evaluate(() => {
      const attempt = Object.entries(window.trainingTestDb).find(([key]) => key.includes('/trainingAttempts/'))?.[1];
      return { questions: attempt?.questions.length, username: attempt?.takerUsername, userKey: attempt?.userKey, score: attempt?.percent, id: attempt?.id };
    });
    assert.equal(recorded.questions, 5); assert.equal(recorded.username, 'admin'); assert.equal(recorded.score, 100);
    assert.equal(recorded.userKey, 'account:admin'); assert.ok(recorded.id.startsWith('daily-'));
    await page.locator('#backFromQuizButton').click();
    await page.locator('#trainingHubButton').click();
    assert.equal(await page.locator('[data-training-action="daily"]').count(), 0);
    assert.ok((await page.locator('#trainingMenuRoot').innerText()).includes('Completed: 100%'));
    assert.ok((await page.locator('.training-badge.is-earned').count()) >= 2);
    const review = page.locator('[data-training-action="review"]').first(); await review.click();
    assert.equal(await page.locator('#trainingReviewDialog .training-review-row').count(), 5);
    await page.locator('#trainingReviewDialog form button').click();
    fs.mkdirSync('test-artifacts', { recursive: true });
    await page.screenshot({ path: 'test-artifacts/training-progress-phone.png' });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    assert.deepEqual(errors, []);
  } finally { await browser.close(); }
});

test('manager assignments, staff completion, briefings and versioned acknowledgements work', async () => {
  const browser = await chromium.launch();
  try {
    const { page, errors } = await setup(browser);
    await page.locator('[data-training-tab="manage"]').click();
    await page.locator('[data-disclosure="setup-assignment"] > summary').click();
    const form = page.locator('[data-training-form="assignment"]');
    await form.locator('[name="title"]').fill('Ingredient knowledge');
    await form.locator('[name="questionMode"]').selectOption('ingredients');
    await form.locator('[name="assignees"][value="staff"]').check();
    await form.locator('button[type=submit]').click();
    await page.waitForFunction(() => getActiveRestaurantMenu().training.assignments.length === 1);
    await page.locator('[data-disclosure="setup-briefing"] > summary').click();
    const briefing = page.locator('[data-training-form="briefing"]');
    await briefing.locator('[name="title"]').fill('New sauce notes');
    await briefing.locator('[name="body"]').fill('Check the latest kitchen-approved sauce ingredients before service.');
    await briefing.locator('button[type=submit]').click();
    await page.waitForFunction(() => getActiveRestaurantMenu().training.briefings.length === 1);
    await page.evaluate(() => { window.trainingTestUser = { username: 'staff', role: 'viewer', status: 'active', firebaseUid: 'staff-uid' }; window.menuMatrixFirebase.auth.currentUser.uid = 'staff-uid'; MenuTraining.render(true); });
    assert.equal(await page.locator('[data-training-tab="manage"]').count(), 0);
    await page.locator('[data-training-tab="assignments"]').click();
    await page.locator('[data-disclosure^="assignment-"] > summary').click();
    await page.locator('[data-training-action="assignment"]').click();
    await completeQuiz(page);
    assert.ok(await page.evaluate(() => Boolean(getCurrentQuizResult().assignmentId)));
    await page.locator('#backFromQuizButton').click(); await page.locator('#trainingHubButton').click();
    await page.locator('[data-training-tab="assignments"]').click();
    assert.ok((await page.locator('#trainingMenuRoot').innerText()).includes('Passed'));
    await page.locator('[data-training-tab="briefing"]').click();
    await page.locator('[data-training-action="acknowledge"]').click();
    await page.waitForFunction(() => getActiveRestaurantMenu().training.acknowledgements.length === 1);
    assert.equal(await page.locator('[data-training-action="acknowledge"]').isDisabled(), true);
    const versioned = await page.evaluate(() => { const menu = getActiveRestaurantMenu(); const b = menu.training.briefings[0]; return menu.training.acknowledgements[0].briefingVersion === b.updatedAt; });
    assert.equal(versioned, true);
    await page.evaluate(() => { window.trainingTestUser = { username: 'admin', role: 'admin', status: 'active' }; MenuTraining.render(true); });
    await page.locator('[data-training-action="edit-briefing"]').click();
    const edited = page.locator('[data-training-form="briefing"]');
    await edited.locator('[name="body"]').fill('Updated sauce note: confirm the revised ingredients with the kitchen.');
    await edited.locator('button[type=submit]').click();
    await page.evaluate(() => { window.trainingTestUser = { username: 'staff', role: 'viewer', status: 'active' }; MenuTraining.render(true); });
    await page.locator('[data-training-tab="briefing"]').click();
    assert.equal(await page.locator('[data-training-action="acknowledge"]').isDisabled(), false);
    await page.evaluate(() => { window.connectedTrainingDb = getFirebaseDb; getFirebaseDb = () => null; });
    await page.locator('[data-training-action="acknowledge"]').click();
    await page.waitForFunction(() => getActiveRestaurantMenu().training.acknowledgements.length === 2);
    assert.ok((await page.locator('.training-message').innerText()).includes('pending'));
    await page.evaluate(() => { getFirebaseDb = window.connectedTrainingDb; dispatchEvent(new Event('online')); });
    await page.waitForFunction(() => window.trainingTestDb['menus/main'].menus[0].training.acknowledgements.length === 2);
    await page.screenshot({ path: 'test-artifacts/training-briefing-desktop.png' });
    assert.deepEqual(errors, []);
  } finally { await browser.close(); }
});

test('approved pairing quiz and manager rewards with fulfilment are available', async () => {
  const browser = await chromium.launch();
  try {
    const { page, errors } = await setup(browser);
    await page.locator('[data-training-tab="pairings"]').click();
    assert.ok((await page.locator('#trainingMenuRoot').innerText()).includes('Signature Peking Duck'));
    await page.locator('[data-training-action="pairing-quiz"]').click(); await completeQuiz(page);
    assert.equal(await page.evaluate(() => getCurrentQuizResult().topicScores.pairings.total), 5);
    await page.locator('#backFromQuizButton').click(); await page.locator('#trainingHubButton').click();
    await page.locator('[data-training-tab="leaderboard"]').click();
    assert.ok((await page.locator('#trainingMenuRoot').innerText()).includes('120'));
    await page.locator('[data-training-tab="manage"]').click();
    await page.locator('[data-disclosure="setup-reward"] > summary').click();
    const form = page.locator('[data-training-form="reward"]');
    await form.locator('[name="title"]').fill('Team recognition'); await form.locator('[name="description"]').fill('Recognition at the next pre-shift briefing.'); await form.locator('[name="points"]').fill('100');
    await form.locator('button[type=submit]').click();
    await page.locator('[data-training-tab="rewards"]').click();
    await page.locator('[data-training-action="claim"]').click();
    await page.locator('[data-training-action="fulfil"]').click();
    await page.waitForFunction(() => getActiveRestaurantMenu().training.claims[0].status === 'fulfilled');
    assert.ok((await page.locator('#trainingMenuRoot').innerText()).includes('Fulfilled'));
    assert.deepEqual(errors, []);
  } finally { await browser.close(); }
});

test('restarting during a delayed quiz save does not overwrite the new session or crash', async () => {
  const browser = await chromium.launch();
  try {
    const { page, errors } = await setup(browser);
    await page.locator('[data-training-action="daily"]').click();
    await page.locator('#quizTakerName').fill('Daniel Muhaj');
    await page.locator('#quizSetupForm button[type=submit]').click();
    for (let i = 0; i < 5; i++) {
      await page.evaluate(() => {
        document.querySelectorAll('#quizOptions input').forEach(input => { input.checked = state.quiz.answers.includes(input.value); });
      });
      if (i === 4) await page.evaluate(() => {
        const db = getFirebaseDb(), original = db.runTransaction;
        db.runTransaction = async callback => {
          await new Promise(resolve => { window.releaseTrainingSave = resolve; });
          return original(callback);
        };
      });
      await page.locator('#quizCheckButton').click();
      if (i < 4) await page.locator('#quizNewQuestionButton').click();
    }
    await page.waitForFunction(() => Boolean(window.releaseTrainingSave));
    await page.locator('#quizStartOverButton').click();
    await page.evaluate(() => window.releaseTrainingSave());
    await page.waitForFunction(() => Object.keys(window.trainingTestDb).some(key => key.includes('/trainingAttempts/')));
    assert.equal(await page.evaluate(() => state.quizSession), null);
    assert.deepEqual(errors, []);
  } finally { await browser.close(); }
});
