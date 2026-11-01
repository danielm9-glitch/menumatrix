const { test } = require('node:test');
const assert = require('node:assert/strict');
const { chromium } = require('playwright');
const fs = require('node:fs');
const base = process.env.MENU_MATRIX_TEST_URL || 'http://localhost:4186';

async function setup(browser, options = {}) {
  const page = await browser.newPage({ viewport: options.mobile ? { width: 390, height: 844 } : { width: 1280, height: 900 }, hasTouch: Boolean(options.mobile) });
  await page.route('https://**/*', route => new URL(route.request().url()).origin === new URL(base).origin ? route.continue() : route.abort());
  await page.goto(base + '/app');
  await page.evaluate((restricted) => {
    const user = { username: 'admin', role: 'admin', menuIds: [], menuPermissions: {} };
    getActiveUser = () => user;
    window.arrangeTestRestricted = restricted;
    canEditCategory = category => !window.arrangeTestRestricted || category === 'starters';
    canEditAnyCategory = () => true;
    queueFeatureAnnouncement = () => {};
    document.querySelectorAll('dialog[open]').forEach(dialog => dialog.close());
    const items = [
      { id: 'a', name: 'First dish', category: 'starters' },
      { id: 'locked', name: 'Main dish', category: 'mains' },
      { id: 'b', name: 'Second dish', category: 'starters' },
      { id: 'c', name: 'Third dish with a longer menu item name', category: 'starters' }
    ].map(item => normalizeMenuItem({ ...item, allergens: [], ingredients: [], price: 10 }));
    restaurantMenus = [normalizeRestaurantMenu({ id: 'arrange-test', name: 'Arrangement test menu', owner: 'admin', categories: ['starters', 'mains'], items })];
    getVisibleRestaurantMenus = () => restaurantMenus;
    state.sharedMenu = null;
    state.activeRestaurantMenu = 'arrange-test';
    state.editing = false;
    state.category = 'all';
    state.query = '';
    menuItems = restaurantMenus[0].items;
    state.openItems.clear();
    showScreen('menu');
    renderActiveMenuHeader();
    renderMenu();
  }, Boolean(options.restricted));
  await page.locator('#quickEditModeButton').click();
  await page.locator('#arrangeItemsButton').click();
  return page;
}

const draft = page => page.locator('.arrange-row').evaluateAll(rows => rows.map(row => row.dataset.id));
const active = page => page.evaluate(() => menuItems.map(item => item.id));

test('cancel and Escape discard drafts, reset restores original order, save survives storage normalization and stale cloud snapshots', async () => {
  const browser = await chromium.launch();
  try {
    const page = await setup(browser);
    const original = await active(page);
    await page.locator('[data-id="a"] .arrange-move-button').last().click();
    assert.notDeepEqual(await draft(page), original);
    assert.deepEqual(await active(page), original);
    await page.locator('#cancelArrangeItemsButton').click();
    assert.deepEqual(await active(page), original);
    await page.evaluate(() => openArrangeItems());
    await page.locator('[data-id="a"] .arrange-move-button').last().click();
    await page.locator('#resetArrangeItemsButton').click();
    assert.deepEqual(await draft(page), original);
    await page.locator('[data-id="a"] .arrange-move-button').last().click();
    await page.keyboard.press('Escape');
    assert.deepEqual(await active(page), original);
    await page.evaluate(() => openArrangeItems());
    await page.locator('[data-id="a"] .arrange-move-button').last().click();
    const expected = await draft(page);
    await page.locator('#saveArrangeItemsButton').click();
    assert.deepEqual(await active(page), expected);
    const persisted = await page.evaluate(() => {
      const saved = JSON.parse(localStorage.getItem(getRestaurantMenusStorageKey()))[0];
      return normalizeRestaurantMenu(saved).items.map(item => item.id);
    });
    assert.deepEqual(persisted, expected);
    const merged = await page.evaluate(() => {
      const stale = structuredClone(restaurantMenus[0]);
      stale.itemOrder = []; stale.orderUpdatedAt = '';
      stale.items = ['a', 'locked', 'b', 'c'].map(id => stale.items.find(item => item.id === id));
      return mergeCloudMenusWithLocal([stale]).menus[0].items.map(item => item.id);
    });
    assert.deepEqual(merged, expected);
  } finally { await browser.close(); }
});

test('category filter and restricted permissions keep other item positions fixed', async () => {
  const browser = await chromium.launch();
  try {
    const page = await setup(browser, { restricted: true, mobile: true });
    await page.locator('[data-id="a"] .arrange-move-button').last().click();
    assert.deepEqual(await draft(page), ['b', 'locked', 'a', 'c']);
    assert.equal(await page.locator('[data-id="locked"] .arrange-grip').isDisabled(), true);
    await page.locator('#arrangeCategorySelect').selectOption('starters');
    await page.locator('[data-id="a"] .arrange-move-button').last().click();
    assert.deepEqual(await draft(page), ['b', 'c', 'a']);
    await page.locator('#saveArrangeItemsButton').click();
    assert.deepEqual(await active(page), ['b', 'locked', 'c', 'a']);
    await page.evaluate(() => openArrangeItems());
    await page.locator('[data-id="b"] .arrange-grip').focus();
    await page.keyboard.press('End');
    assert.deepEqual(await draft(page), ['c', 'locked', 'a', 'b']);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    fs.mkdirSync('test-artifacts', { recursive: true });
    await page.screenshot({ path: 'test-artifacts/arrange-phone.png' });
  } finally { await browser.close(); }
});

test('mouse drag changes draft order and concurrent menu changes block saving', async () => {
  const browser = await chromium.launch();
  try {
    const page = await setup(browser);
    const first = await page.locator('[data-id="a"] .arrange-grip').boundingBox();
    const last = await page.locator('[data-id="c"]').boundingBox();
    await page.mouse.move(first.x + first.width / 2, first.y + first.height / 2);
    await page.mouse.down();
    await page.mouse.move(first.x + first.width / 2, last.y + last.height - 5, { steps: 25 });
    await page.mouse.up();
    await page.waitForFunction(() => arrangeSession.draftIds[0] !== 'a');
    assert.notDeepEqual(await draft(page), ['a', 'locked', 'b', 'c']);
    await page.evaluate(() => menuItems.push(normalizeMenuItem({ id: 'new', name: 'New item', category: 'starters' })));
    await page.locator('#saveArrangeItemsButton').click();
    assert.match(await page.locator('#arrangeItemsMessage').innerText(), /menu changed/i);
    assert.ok((await active(page)).includes('new'));
    await page.screenshot({ path: 'test-artifacts/arrange-desktop.png' });
  } finally { await browser.close(); }
});

test('touch dragging works on a phone and shared viewers cannot open the arranger', async () => {
  const browser = await chromium.launch();
  try {
    const page = await setup(browser, { mobile: true });
    const first = await page.locator('[data-id="a"] .arrange-grip').boundingBox();
    const target = await page.locator('[data-id="b"]').boundingBox();
    const session = await page.context().newCDPSession(page);
    const x = first.x + first.width / 2;
    const start = first.y + first.height / 2;
    await session.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y: start }] });
    for (let step = 1; step <= 16; step++) {
      await session.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x, y: start + (target.y + target.height - 5 - start) * step / 16 }] });
      await page.waitForTimeout(20);
    }
    await session.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    await page.waitForFunction(() => arrangeSession.draftIds[0] !== 'a');
    assert.notDeepEqual(await draft(page), ['a', 'locked', 'b', 'c']);
    await page.locator('#cancelArrangeItemsButton').click();
    await page.evaluate(() => { state.sharedMenu = { id: 'shared' }; openArrangeItems(); });
    assert.equal(await page.locator('#arrangeItemsDialog').evaluate(el => el.open), false);
  } finally { await browser.close(); }
});
