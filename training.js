(function (root) {
  'use strict';
  const text = (v, max = 2000) => String(v ?? '').slice(0, max);
  const esc = v => text(v, 10000).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');
  const list = v => Array.isArray(v) ? v : [];
  const stamp = v => Number.isFinite(Date.parse(v)) ? v : '';
  const now = () => new Date().toISOString();
  const topics = ['ingredients', 'allergies', 'pairings'];
  const storageKey = 'menu-matrix-training-v1';
  const count = v => Math.max(0, Number(v) || 0);
  const uid = () => `training-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  const termKey = v => text(v).trim().toLocaleLowerCase().replace(/\s+/g, ' ');
  const pairings = v => [...new Map((Array.isArray(v) ? v : text(v).split(/\r?\n/)).map(v => text(v, 250).trim()).filter(Boolean).map(v => [termKey(v), v])).values()].slice(0, 20);
  function timeZone(value) { if (typeof value !== 'string' || !value) return 'America/Los_Angeles'; try { new Intl.DateTimeFormat('en', { timeZone: value }).format(); return value; } catch { return 'America/Los_Angeles'; } }
  function dayKey(date = new Date(), zone = 'America/Los_Angeles') {
    const parts = new Intl.DateTimeFormat('en-US', { timeZone: timeZone(zone), year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date(date));
    const get = type => parts.find(p => p.type === type).value;
    return `${get('year')}-${get('month')}-${get('day')}`;
  }
  function normalize(value = {}) {
    const data = value && typeof value === 'object' ? value : {};
    const base = entry => ({ id: text(entry.id, 200), updatedAt: stamp(entry.updatedAt) || stamp(entry.createdAt), createdAt: stamp(entry.createdAt), archived: Boolean(entry.archived) });
    return {
      settings: { timeZone: timeZone(data.settings?.timeZone), updatedAt: stamp(data.settings?.updatedAt) },
      assignments: list(data.assignments).filter(e => e?.id).slice(0, 200).map(e => ({ ...base(e), title: text(e.title, 180), assignees: [...new Set(list(e.assignees).map(v => text(v, 120)))].slice(0, 150), dueDate: /^\d{4}-\d{2}-\d{2}$/.test(e.dueDate) ? e.dueDate : '', passPercent: Math.min(100, count(e.passPercent)), questionLimit: [5, 10, 15, 20].includes(Number(e.questionLimit)) ? Number(e.questionLimit) : 5, questionMode: ['all', ...topics].includes(e.questionMode) ? e.questionMode : 'all', category: text(e.category || 'all', 100) })),
      briefings: list(data.briefings).filter(e => e?.id).slice(0, 100).map(e => ({ ...base(e), title: text(e.title, 180), body: text(e.body, 4000), day: /^\d{4}-\d{2}-\d{2}$/.test(e.day) ? e.day : '', kind: ['special', 'unavailable', 'recipe', 'service'].includes(e.kind) ? e.kind : 'service', requiresAck: Boolean(e.requiresAck) })),
      acknowledgements: list(data.acknowledgements).filter(e => e?.id).slice(0, 1000).map(e => ({ ...base(e), briefingId: text(e.briefingId, 200), briefingVersion: stamp(e.briefingVersion), userKey: text(e.userKey, 200), username: text(e.username, 120), name: text(e.name, 120) })),
      rewards: list(data.rewards).filter(e => e?.id).slice(0, 100).map(e => ({ ...base(e), title: text(e.title, 180), description: text(e.description, 1500), points: Math.max(1, count(e.points)) })),
      claims: list(data.claims).filter(e => e?.id).slice(0, 500).map(e => ({ ...base(e), rewardId: text(e.rewardId, 200), userKey: text(e.userKey, 200), username: text(e.username, 120), name: text(e.name, 120), status: e.status === 'fulfilled' ? 'fulfilled' : 'requested' }))
    };
  }
  function merge(...values) {
    const sources = values.map(normalize);
    const result = normalize();
    for (const key of ['assignments', 'briefings', 'acknowledgements', 'rewards', 'claims']) {
      const entries = new Map();
      for (const source of sources) for (const entry of source[key]) {
        const previous = entries.get(entry.id);
        if (!previous || Date.parse(entry.updatedAt || 0) >= Date.parse(previous.updatedAt || 0)) entries.set(entry.id, entry);
      }
      result[key] = [...entries.values()].sort((a, b) => Date.parse(b.updatedAt || 0) - Date.parse(a.updatedAt || 0));
    }
    result.settings = sources.map(s => s.settings).sort((a, b) => (Date.parse(b.updatedAt) || 0) - (Date.parse(a.updatedAt) || 0))[0] || result.settings;
    return normalize(result);
  }
  function topicScores(value = {}) {
    return Object.fromEntries(topics.map(key => [key, { correct: Math.min(count(value?.[key]?.correct), count(value?.[key]?.total)), total: count(value?.[key]?.total) }]));
  }
  function normalizeQuestions(value) {
    return list(value).filter(q => q && typeof q === 'object').slice(0, 20).map(q => ({
      prompt: text(q.prompt, 800), topic: topics.includes(q.topic) ? q.topic : 'ingredients',
      options: list(q.options).slice(0, 10).map(o => ({ value: text(o.value, 250), label: text(o.label, 400) })),
      answers: list(q.answers).slice(0, 10).map(v => text(v, 250)), selected: list(q.selected).slice(0, 10).map(v => text(v, 250)),
      correct: Boolean(q.correct), explanation: text(q.explanation, 1500), answeredAt: stamp(q.answeredAt)
    }));
  }
  function compactResult(value) { const { questions, questionQueue, ...summary } = value; return summary; }
  function scoreTopics(questions) {
    const scores = topicScores();
    for (const q of normalizeQuestions(questions)) { scores[q.topic].total++; if (q.correct) scores[q.topic].correct++; }
    return scores;
  }
  function isFull(result) { return result.total >= result.questionLimit && result.total > 0; }
  function assignmentStatus(assignment, results, username, today) {
    const relevant = results.filter(r => r.assignmentId === assignment.id && r.takerUsername === username && isFull(r));
    const best = relevant.reduce((max, r) => Math.max(max, r.percent), -1);
    if (best >= assignment.passPercent) return { label: 'Passed', passed: true, best };
    if (relevant.length) return { label: assignment.dueDate && today > assignment.dueDate ? 'Overdue - retry needed' : 'Retry needed', passed: false, best };
    return { label: assignment.dueDate && today > assignment.dueDate ? 'Overdue' : 'Not started', passed: false, best: -1 };
  }
  function leaderboard(results, zone, since = '') {
    const best = new Map();
    for (const r of results) {
      if (!r.takerUsername || !r.userKey?.startsWith('account:') || !isFull(r) || !stamp(r.takenAt)) continue;
      const date = dayKey(r.takenAt, zone);
      if (since && date < since) continue;
      const key = `${r.userKey}|${r.menuId}|${date}`;
      const points = 20 + Math.round(r.percent);
      if (!best.has(key) || best.get(key).points < points) best.set(key, { ...r, points });
    }
    const rows = new Map();
    for (const r of best.values()) {
      const row = rows.get(r.userKey) || { userKey: r.userKey, username: r.takerUsername, points: 0, sessions: 0, correct: 0, total: 0 };
      row.points += r.points; row.sessions++; row.correct += r.score; row.total += r.total; rows.set(r.userKey, row);
    }
    return [...rows.values()].sort((a, b) => b.points - a.points || b.correct / b.total - a.correct / a.total || a.username.localeCompare(b.username));
  }
  function badges(results, key, zone) {
    const completed = results.filter(r => r.userKey === key && isFull(r));
    const days = [...new Set(completed.filter(r => stamp(r.takenAt)).map(r => dayKey(r.takenAt, zone)))].sort();
    let streak = 0, longest = 0, previous = '';
    for (const day of days) { streak = previous && Date.parse(day + 'T12:00:00Z') - Date.parse(previous + 'T12:00:00Z') === 86400000 ? streak + 1 : 1; longest = Math.max(longest, streak); previous = day; }
    return [{ title: 'First steps', earned: completed.length >= 1, progress: `${Math.min(1, completed.length)}/1 quiz` }, { title: 'Five strong', earned: completed.length >= 5, progress: `${Math.min(5, completed.length)}/5 quizzes` }, { title: 'Perfect plate', earned: completed.some(r => r.percent === 100), progress: 'One perfect quiz' }, { title: 'Three-day rhythm', earned: longest >= 3, progress: `${Math.min(3, longest)}/3 consecutive days` }];
  }
  function seeded(seed) { let n = 2166136261; for (const char of seed) n = Math.imul(n ^ char.charCodeAt(0), 16777619); return () => { n ^= n << 13; n ^= n >>> 17; n ^= n << 5; return (n >>> 0) / 4294967296; }; }
  function shuffle(values, random = Math.random) { const copy = [...values]; for (let i = copy.length - 1; i > 0; i--) { const j = Math.floor(random() * (i + 1)); [copy[i], copy[j]] = [copy[j], copy[i]]; } return copy; }
  function maskName(name, terms) {
    let value = text(name, 500);
    for (const term of terms) {
      const words = text(term).split(/[^\p{L}\p{N}]+/u).filter(w => w.length > 2);
      for (const word of words) value = value.replace(new RegExp(word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'), '...');
    }
    return value;
  }
  function dailyQuestions(menu, day) {
    const random = seeded(`${menu.id}|${day}`);
    const items = list(menu.items).filter(i => !i.deleted && !i.deletedAt && i.status !== 'deleted').sort((a, b) => String(a.id).localeCompare(String(b.id)));
    const facts = items.flatMap(item => topics.flatMap(topic => {
      const terms = topic === 'ingredients' ? list(item.ingredients) : topic === 'allergies' ? list(item.allergens) : pairings(item.pairings);
      return terms.filter(Boolean).map(term => ({ item, topic, term: text(term, 250) }));
    }));
    if (!facts.length) return [];
    return Array.from({ length: 5 }, (_, index) => {
      const fact = shuffle(facts, random)[index % facts.length];
      const valid = fact.topic === 'ingredients' ? list(fact.item.ingredients) : fact.topic === 'allergies' ? list(fact.item.allergens) : pairings(fact.item.pairings);
      const validKeys = new Set(valid.map(termKey));
      const wrong = [...new Map(facts.filter(f => f.topic === fact.topic).map(f => [termKey(f.term), f.term])).values()].filter(t => !validKeys.has(termKey(t)));
      const options = wrong.length ? shuffle([fact.term, ...shuffle(wrong, random).slice(0, 3)], random).map(value => ({ value, label: value })) : [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }];
      const label = { ingredients: 'ingredient', allergies: 'allergen note', pairings: 'approved pairing' }[fact.topic];
      return { typeLabel: fact.topic === 'pairings' ? 'Pairing challenge' : fact.topic === 'ingredients' ? 'Ingredient challenge' : 'Allergy challenge', topic: fact.topic, prompt: wrong.length ? `Which ${label} is listed for ${maskName(fact.item.name, valid)}?` : `Do the ${label} notes for ${maskName(fact.item.name, [fact.term])} list ${fact.term}?`, options, answers: [wrong.length ? fact.term : 'yes'], multiple: false, selected: [], explanation: `${fact.item.name}: ${valid.join(', ')}`, questionNumber: index + 1 };
    });
  }

  let panel = 'progress', pendingLaunch = null, lastMessage = '', unsub = null, subscriptionKey = '', subscriptionFailed = '', busy = false, retryTimer = null, retries = 0;
  let cache = { attempts: {}, pending: [], events: [] };
  if (root.localStorage) { try { cache = { ...cache, ...JSON.parse(root.localStorage.getItem(storageKey) || '{}') }; } catch {} }
  function persistCache() { try { root.localStorage?.setItem(storageKey, JSON.stringify(cache)); } catch { lastMessage = 'Device storage is full. Keep this window open until results finish syncing.'; } }
  function actor() {
    const user = getActiveUser();
    let guest = root.localStorage.getItem('menu-matrix-training-guest');
    if (!guest) { guest = uid(); root.localStorage.setItem('menu-matrix-training-guest', guest); }
    return { userKey: user ? `account:${user.username}` : `guest:${guest}`, username: user?.username || '', name: user?.fullName || user?.displayName || user?.username || 'Viewer', firebaseUid: root.menuMatrixFirebase?.auth?.currentUser?.uid || user?.firebaseUid || '' };
  }
  const activeMenu = () => getActiveRestaurantMenu();
  const workspace = menu => getWorkspaceDocumentIdForOwner(getMenuOwner(menu));
  function manage(menu = activeMenu()) { const user = getActiveUser(); return Boolean(user && menu && !state.sharedMenu && canUserAccessMenu(user, menu) && canRoleUseTrainingAdmin(user.role)); }
  function menusInRestaurant(menu = activeMenu()) {
    if (!menu) return [];
    if (state.sharedMenu) return [menu];
    return getVisibleRestaurantMenus().filter(m => m.id === menu.id || (menu.restaurantId && m.restaurantId === menu.restaurantId && getMenuOwner(m) === getMenuOwner(menu)));
  }
  function resultsFor(menu = activeMenu(), restaurant = false) {
    if (!menu) return [];
    const menus = restaurant ? menusInRestaurant(menu) : [menu];
    const ids = new Set(menus.map(m => m.id));
    const resultMap = new Map();
    [...menus.flatMap(m => list(m.quizResults)), ...Object.values(cache.attempts)].filter(r => ids.has(r.menuId) && (!r.owner || r.owner === getMenuOwner(menu))).forEach(r => resultMap.set(r.id, { ...r, ...resultMap.get(r.id), questions: r.questions?.length ? r.questions : resultMap.get(r.id)?.questions || [] }));
    return [...resultMap.values()].sort((a, b) => Date.parse(b.takenAt) - Date.parse(a.takenAt));
  }
  function attemptRef(menu, id) { return getFirebaseDb()?.collection('menus').doc(workspace(menu)).collection('trainingAttempts').doc(id); }
  async function writeAttempt(result) {
    const menu = activeMenu();
    const ref = attemptRef(menu, result.id);
    if (!ref || !root.menuMatrixFirebase?.auth?.currentUser) throw Error('Training cloud connection unavailable.');
    const doc = { ...result, firebaseUid: root.menuMatrixFirebase.auth.currentUser.uid, questions: normalizeQuestions(result.questions) };
    return getFirebaseDb().runTransaction(async tx => {
      const snapshot = await tx.get(ref);
      if (snapshot.exists && result.trainingKind === 'daily') return snapshot.data();
      tx.set(ref, doc, { merge: true });
      return doc;
    });
  }
  async function saveAttempt(result) {
    const menu = activeMenu();
    const full = { ...result, questions: normalizeQuestions(result.questions), workspaceDocId: workspace(menu) };
    cache.attempts[result.id] = full;
    if (state.demoMode) { persistCache(); return false; }
    cache.pending = [...list(cache.pending).filter(r => r.id !== full.id), full];
    const entries = Object.values(cache.attempts).sort((a, b) => Date.parse(b.takenAt) - Date.parse(a.takenAt));
    cache.attempts = Object.fromEntries(entries.slice(0, 250).map(r => [r.id, r]));
    persistCache();
    try {
      const stored = await writeAttempt(full);
      cache.attempts[result.id] = stored;
      if (stored.trainingKind === 'daily' && state.quizSession?.id === result.id) {
        Object.assign(result, stored);
        state.quizSession.answerHistory = stored.questions;
        state.quizScore.correct = stored.score;
        state.quizScore.total = stored.total;
      }
      cache.pending = cache.pending.filter(r => r.id !== full.id); persistCache(); return true;
    }
    catch { lastMessage = 'Detailed review is saved on this device; cloud sync is pending.'; scheduleRetry(); return false; }
  }
  function connectAttempts(menu) {
    const db = getFirebaseDb();
    if (!db || !menu || state.demoMode || !root.menuMatrixFirebase?.auth?.currentUser) return;
    const key = `${workspace(menu)}|${menu.id}`;
    if (key === subscriptionKey) return;
    unsub?.(); subscriptionKey = key;
    const collection = db.collection('menus').doc(workspace(menu)).collection('trainingAttempts');
    const accept = snapshot => {
      snapshot.docs.forEach(doc => { const value = doc.data(); cache.attempts[doc.id] = { ...value, questions: normalizeQuestions(value.questions) }; });
      persistCache(); subscriptionFailed = ''; render();
    };
    const fail = () => { subscriptionFailed = 'Detailed cloud history is unavailable. Saved scores and this device\'s reviews are still shown.'; render(); };
    unsub = collection.where('menuId', '==', menu.id).orderBy('takenAt', 'desc').limit(150).onSnapshot(accept, error => {
      if (error?.code === 'failed-precondition') {
        unsub = collection.where('menuId', '==', menu.id).limit(150).onSnapshot(accept, fail);
        root.setTimeout(() => { if (subscriptionKey === key) { subscriptionKey = ''; render(); } }, 60000);
      } else fail();
    });
  }
  async function flush() {
    if (busy || !getFirebaseDb() || !activeMenu()) return;
    busy = true;
    try {
      for (const result of [...list(cache.pending)]) {
        if (result.workspaceDocId !== workspace(activeMenu()) || result.menuId !== activeMenu().id || result.userKey !== actor().userKey) continue;
        await writeAttempt(result); cache.pending = cache.pending.filter(r => r.id !== result.id); persistCache();
      }
      for (const entry of [...list(cache.events)]) {
        if (entry.menuId !== activeMenu().id || entry.workspaceDocId !== workspace(activeMenu()) || entry.actorKey !== actor().userKey) continue;
        await writeEntry(entry); cache.events = cache.events.filter(e => e.queueId !== entry.queueId); persistCache();
      }
      if (!cache.pending.length && !cache.events.length) { retries = 0; lastMessage = ''; }
    } catch {} finally { busy = false; scheduleRetry(); render(); }
  }
  function scheduleRetry() {
    if (!root.document || retryTimer || retries >= 5 || (!list(cache.pending).length && !list(cache.events).length)) return;
    retryTimer = root.setTimeout(() => { retryTimer = null; retries++; flush(); }, 30000);
  }
  async function writeEntry(entry) {
    const db = getFirebaseDb();
    if (!db || !root.menuMatrixFirebase?.auth?.currentUser) throw Error('Training cloud connection unavailable.');
    const ref = db.collection('menus').doc(entry.workspaceDocId);
    await db.runTransaction(async tx => {
      const snapshot = await tx.get(ref);
      const data = snapshot.data();
      const menus = list(data?.menus);
      const menu = menus.find(m => m.id === entry.menuId);
      if (!menu) throw Error('Menu is unavailable.');
      menu.training = merge(menu.training, entry.change);
      tx.set(ref, { menus, updatedAt: now() }, { merge: true });
    });
    if (entry.code) {
      const share = getShareDocument(entry.code);
      await db.runTransaction(async tx => {
        const snapshot = await tx.get(share);
        if (!snapshot.exists) return;
        const data = snapshot.data();
        tx.update(share, { 'menu.training': merge(data.menu?.training, entry.change), updatedAt: now() });
      });
    }
  }
  async function changeTraining(key, record) {
    const menu = activeMenu();
    if (!menu || !(getActiveUser() || state.sharedMenu)) return;
    if (!['acknowledgements', 'claims'].includes(key) && !manage(menu)) throw Error('Training manager access is required.');
    const change = key === 'settings' ? { settings: record } : { [key]: [record] };
    menu.training = merge(menu.training, change);
    menu.updatedAt = now();
    const entry = { queueId: uid(), actorKey: actor().userKey, workspaceDocId: workspace(menu), menuId: menu.id, code: state.sharedCode || menu.shareCode || '', change };
    cache.events.push(entry); persistCache();
    if (!state.sharedMenu) saveRestaurantMenus();
    render();
    try { await writeEntry(entry); cache.events = cache.events.filter(e => e.queueId !== entry.queueId); persistCache(); lastMessage = 'Saved.'; }
    catch { lastMessage = 'Saved on this device. Cloud sync is pending.'; scheduleRetry(); }
    render();
  }
  function createPairingQuestion() {
    const items = getActiveStudyItems().filter(i => pairings(i.pairings).length);
    if (!items.length) return null;
    const item = items[Math.floor(Math.random() * items.length)];
    const valid = pairings(item.pairings), correct = valid[Math.floor(Math.random() * valid.length)];
    const validKeys = new Set(valid.map(termKey));
    const wrong = pairings(items.flatMap(i => pairings(i.pairings))).filter(p => !validKeys.has(termKey(p)));
    if (!wrong.length) return null;
    return { topic: 'pairings', typeLabel: 'Pairing practice', prompt: `Which pairing is approved in the menu notes for ${maskName(item.name, valid)}?`, options: shuffle([correct, ...shuffle(wrong).slice(0, 3)]).map(value => ({ value, label: value })), answers: [correct], multiple: false, explanation: `${item.name}: ${valid.join('; ')}.${item.recommendation ? ` ${item.recommendation}` : ''}` };
  }
  function clearLaunch() { pendingLaunch = null; }
  function prepareQuizStart(menu) {
    if (!pendingLaunch) return null;
    if (pendingLaunch.menuId !== menu.id) return { error: 'The menu changed. Reopen this training session.' };
    if (pendingLaunch.kind === 'assignment') {
      const assignment = normalize(menu.training).assignments.find(a => a.id === pendingLaunch.id && !a.archived);
      if (!assignment || !assignment.assignees.includes(actor().username)) return { error: 'This assignment is no longer available to your account.' };
      const eligible = list(menu.items).filter(i => assignment.category === 'all' || i.category === assignment.category);
      if (!eligible.length) return { error: 'There are no items in this assignment category. Ask your manager to update the assignment.' };
      if (assignment.questionMode === 'pairings' && pairings(eligible.flatMap(i => pairings(i.pairings))).length < 2) return { error: 'This assignment needs at least two different approved pairing notes. Ask your manager to add them.' };
      return { ...pendingLaunch, ...assignment, assignmentId: assignment.id, categoryFilter: assignment.category };
    }
    const date = dayKey(new Date(), normalize(menu.training).settings.timeZone);
    if (resultsFor(menu).some(r => r.userKey === actor().userKey && r.challengeDate === date && isFull(r))) return { error: 'You have already completed today\'s challenge.' };
    const queue = dailyQuestions(menu, date);
    if (!queue.length) return { error: 'Add ingredient or allergen notes to this menu before starting a daily challenge.' };
    return { ...pendingLaunch, questionLimit: 5, questionMode: 'all', challengeDate: date, questionQueue: queue, categoryFilter: 'all' };
  }
  function sessionFields(launch) {
    const who = actor();
    const dailyId = launch?.kind === 'daily' ? { id: `daily-${activeMenu().id}-${launch.challengeDate}-${encodeURIComponent(who.userKey)}` } : {};
    return { ...dailyId, userKey: who.userKey, takerUsername: who.username, firebaseUid: who.firebaseUid, trainingKind: launch?.kind || 'practice', assignmentId: launch?.assignmentId || '', challengeDate: launch?.challengeDate || '', categoryFilter: launch?.categoryFilter || 'all', questionQueue: launch?.questionQueue || null, answerHistory: [] };
  }
  function recordAnswer(question, selected, correct) {
    if (!state.quizSession) return;
    const topic = question.topic || (/allerg/i.test(question.typeLabel) ? 'allergies' : /pair/i.test(question.typeLabel) ? 'pairings' : 'ingredients');
    state.quizSession.answerHistory.push({ ...question, topic, selected: [...selected], correct, answeredAt: now() });
  }
  function resultFields(session) {
    return { userKey: session.userKey, takerUsername: session.takerUsername, firebaseUid: session.firebaseUid, trainingKind: session.trainingKind, assignmentId: session.assignmentId, challengeDate: session.challengeDate, categoryFilter: session.categoryFilter, questions: normalizeQuestions(session.answerHistory), topicScores: scoreTopics(session.answerHistory) };
  }
  function renderAnswerReview(container, result) {
    if (!container) return;
    const questions = normalizeQuestions(result.questions);
    container.innerHTML = `<h3>Answer review</h3>${questions.length ? questions.map((q, index) => {
      const label = values => values.map(v => q.options.find(o => o.value === v)?.label || v).join(', ');
      return `<details class="training-review-row"><summary><span>${index + 1}. ${esc(q.prompt)}</span><b class="${q.correct ? 'training-correct' : 'training-wrong'}">${q.correct ? 'Correct' : 'Incorrect'}</b></summary><p><strong>Your answer:</strong> ${esc(label(q.selected) || 'No answer')}</p><p><strong>Correct answer:</strong> ${esc(label(q.answers))}</p><p>${esc(q.explanation)}</p></details>`;
    }).join('') : '<p class="training-empty">Detailed answers were not recorded for this older attempt.</p>'}`;
  }
  function renderQuizSetup() {
    const banner = root.document.querySelector('#quizLaunchContext');
    if (!banner) return;
    banner.hidden = !pendingLaunch;
    banner.textContent = pendingLaunch ? (pendingLaunch.kind === 'daily' ? 'Daily challenge - 5 questions' : `Assignment: ${pendingLaunch.title}`) : '';
    const assignment = pendingLaunch?.kind === 'assignment' ? normalize(activeMenu()?.training).assignments.find(a => a.id === pendingLaunch.id) : null;
    root.document.querySelectorAll('#quizSetupForm fieldset input').forEach(input => {
      input.disabled = Boolean(pendingLaunch);
      if (pendingLaunch) input.checked = input.name === 'quizQuestionCount' ? input.value === String(assignment?.questionLimit || 5) : input.value === (assignment?.questionMode || 'all');
    });
  }
  function launch(kind, id = '') {
    const menu = activeMenu();
    const assignment = normalize(menu.training).assignments.find(a => a.id === id);
    if (kind === 'assignment' && (!assignment || !assignment.assignees.includes(actor().username))) return;
    pendingLaunch = { kind, id, title: assignment?.title || '', menuId: menu.id };
    root.document.querySelector('#trainingHubDialog').close();
    openQuizPage({ trainingLaunch: true });
  }

  const api = { normalize, merge, pairings, normalizeQuestions, topicScores, compactResult, scoreTopics, dayKey, assignmentStatus, leaderboard, badges, dailyQuestions, actor, manage, resultsFor, createPairingQuestion, clearLaunch, prepareQuizStart, sessionFields, recordAnswer, resultFields, renderAnswerReview, renderQuizSetup, saveAttempt };
  root.MenuTraining = api;
  if (typeof module !== 'undefined') module.exports = api;
  // The UI is registered below; pure data helpers are also used by the app's storage layer.
  let selectedProfile = '', rankingPeriod = '7';
  const button = (action, label, id = '', extra = '') => `<button type="button" class="action-button training-action" data-training-action="${action}" data-id="${esc(id)}" ${extra}>${label}</button>`;
  const dateLabel = value => stamp(value) ? new Date(value).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }) : 'Not recorded';
  const empty = message => `<p class="training-empty">${esc(message)}</p>`;
  function team(menu) { return users.filter(user => !isDeletedUser(user) && user.status === 'active' && canUserAccessMenu(user, menu)); }
  function daysAgo(n, zone) { const today = dayKey(new Date(), zone); return new Date(Date.parse(today + 'T12:00:00Z') - n * 86400000).toISOString().slice(0, 10); }
  function metrics(entries) {
    return { attempts: entries.length, average: entries.length ? Math.round(entries.reduce((sum, r) => sum + r.percent, 0) / entries.length) : 0, best: entries.reduce((max, r) => Math.max(max, r.percent), 0) };
  }
  function progressHtml(menu) {
    const who = actor(), all = resultsFor(menu), canManage = manage(menu);
    const key = canManage && selectedProfile ? selectedProfile : who.userKey;
    const mine = all.filter(r => r.userKey === key);
    const data = metrics(mine), zone = normalize(menu.training).settings.timeZone;
    const totals = mine.reduce((sum, r) => { const scores = topicScores(r.topicScores); for (const type of topics) { sum[type].correct += scores[type].correct; sum[type].total += scores[type].total; } return sum; }, topicScores());
    return `${canManage ? `<label class="training-filter">Team member<select data-training-profile><option value="${esc(who.userKey)}">My progress</option>${[...new Map(all.filter(r => r.userKey && r.userKey !== who.userKey).map(r => [r.userKey, r.takerUsername || r.takerName])).entries()].map(([id, name]) => `<option value="${esc(id)}" ${id === key ? 'selected' : ''}>${esc(name)}</option>`).join('')}</select></label>` : ''}
      <div class="training-metrics"><div><span>Quizzes</span><strong>${data.attempts}</strong></div><div><span>Average</span><strong>${data.average}%</strong></div><div><span>Best</span><strong>${data.best}%</strong></div><div><span>Recent change</span><strong>${mine.length > 1 ? `${mine[0].percent - mine[1].percent > 0 ? '+' : ''}${mine[0].percent - mine[1].percent}` : '—'}</strong></div></div>
      <section class="training-section"><h3>Knowledge by topic</h3>${topics.map(type => `<div class="training-topic"><span>${type[0].toUpperCase() + type.slice(1)}</span><progress max="100" value="${totals[type].total ? Math.round(totals[type].correct / totals[type].total * 100) : 0}"></progress><small>${totals[type].total ? `${totals[type].correct}/${totals[type].total} correct` : 'No answers yet'}</small></div>`).join('')}</section>
      <section class="training-section"><h3>Badges</h3><div class="training-badges">${badges(all, key, zone).map(b => `<div class="training-badge ${b.earned ? 'is-earned' : ''}"><span aria-hidden="true">${b.earned ? '&#10003;' : '&#9675;'}</span><strong>${b.title}</strong><small>${b.earned ? 'Earned' : b.progress}</small></div>`).join('')}</div></section>
      <section class="training-section"><h3>Quiz history</h3>${historyHtml(mine)}${canManage ? `<details class="training-disclosure" data-disclosure="all-results"><summary>All menu attempts (${all.length})</summary>${historyHtml(all)}</details>` : ''}</section>`;
  }
  function historyHtml(results) {
    if (!results.length) return empty('No completed quizzes recorded yet.');
    return `<div class="training-table-wrap"><table class="training-table"><thead><tr><th>Name / date</th><th>Focus</th><th>Score</th><th>Review</th></tr></thead><tbody>${results.slice(0, 50).map(r => `<tr><td><strong>${esc(r.takerUsername || r.takerName)}</strong><small>${dateLabel(r.takenAt)}</small></td><td>${esc(r.questionMode || 'all')}${r.challengeDate ? '<small>Daily challenge</small>' : r.assignmentId ? '<small>Assignment</small>' : ''}</td><td>${r.percent}%<small>${r.score}/${r.total}</small></td><td>${button('review', 'Review', r.id)}</td></tr>`).join('')}</tbody></table></div>`;
  }
  function assignmentsHtml(menu) {
    const data = normalize(menu.training), who = actor(), results = resultsFor(menu), today = dayKey(new Date(), data.settings.timeZone);
    const assignments = data.assignments.filter(a => !a.archived && (manage(menu) || a.assignees.includes(who.username)));
    return `<div class="training-section-head"><h3>Assigned training</h3>${manage(menu) ? '<span>Manage assignments in Setup</span>' : ''}</div>${assignments.length ? assignments.map(a => {
      const status = assignmentStatus(a, results, who.username, today);
      const assigned = a.assignees.includes(who.username);
      return `<details class="training-disclosure" data-disclosure="assignment-${esc(a.id)}"><summary><span><strong>${esc(a.title)}</strong><small>${a.questionLimit} questions · ${esc(a.questionMode)} · Pass ${a.passPercent}%${a.dueDate ? ` · Due ${a.dueDate}` : ''}</small></span><b class="training-status ${status.passed ? 'is-good' : ''}">${assigned ? status.label : `${a.assignees.length} assigned`}</b></summary>${assigned ? button('assignment', status.passed ? 'Practice again' : 'Start assignment', a.id) : ''}${manage(menu) ? `<div class="training-table-wrap"><table class="training-table"><thead><tr><th>Team member</th><th>Status</th><th>Best score</th></tr></thead><tbody>${a.assignees.map(username => { const s = assignmentStatus(a, results, username, today); return `<tr><td>${esc(username)}</td><td>${s.label}</td><td>${s.best < 0 ? '—' : `${s.best}%`}</td></tr>`; }).join('')}</tbody></table></div><div class="training-inline-actions">${button('edit-assignment', 'Edit', a.id)}${button('archive-assignment', 'Archive', a.id)}</div>` : ''}</details>`;
    }).join('') : empty(getActiveUser() ? 'No active assignments for this menu.' : 'Sign in with a team account to receive assignments.')}`;
  }
  function briefingsHtml(menu) {
    const data = normalize(menu.training), who = actor(), today = dayKey(new Date(), data.settings.timeZone);
    const entries = data.briefings.filter(b => !b.archived && (!b.day || b.day === today));
    return `<div class="training-section-head"><h3>Pre-shift briefing</h3><span>${today} · ${esc(data.settings.timeZone)}</span></div>${entries.length ? entries.map(b => {
      const acknowledged = data.acknowledgements.some(a => a.briefingId === b.id && a.briefingVersion === b.updatedAt && a.userKey === who.userKey);
      const acknowledgements = data.acknowledgements.filter(a => a.briefingId === b.id && a.briefingVersion === b.updatedAt);
      return `<article class="training-briefing"><div class="training-section-head"><span class="training-kind">${esc(b.kind)}</span><small>${dateLabel(b.updatedAt)}</small></div><h4>${esc(b.title)}</h4><p class="training-preserve-lines">${esc(b.body)}</p>${b.requiresAck ? button('acknowledge', acknowledged ? '&#10003; Read and understood' : 'Read and understood', b.id, acknowledged ? 'disabled' : '') : ''}${manage(menu) ? `<details class="training-disclosure"><summary>Acknowledgements (${acknowledgements.length})</summary>${team(menu).map(user => { const a = acknowledgements.find(a => a.username === user.username); return `<div class="training-ack-row"><span>${esc(user.username)}</span><small>${a ? dateLabel(a.updatedAt) : 'Not acknowledged'}</small></div>`; }).join('')}${acknowledgements.filter(a => !a.username).map(a => `<div class="training-ack-row"><span>Shared-code viewer</span><small>${dateLabel(a.updatedAt)}</small></div>`).join('')}</details><div class="training-inline-actions">${button('edit-briefing', 'Edit', b.id)}${button('archive-briefing', 'Archive', b.id)}</div>` : ''}</article>`;
    }).join('') : empty('No briefing published for this shift.')}`;
  }
  function leaderboardHtml(menu) {
    if (!getActiveUser()) return empty('Restaurant leaderboards are available to signed-in team members.');
    const zone = normalize(menu.training).settings.timeZone;
    const since = rankingPeriod === 'all' ? '' : daysAgo(Number(rankingPeriod) - 1, zone);
    const rows = leaderboard(resultsFor(menu, true), zone, since);
    return `<div class="training-section-head"><div><h3>${esc(menu.restaurantName || menu.name)} leaderboard</h3><small>Best quiz per person, menu, and day · 20 completion points + percentage score</small></div><select data-training-period aria-label="Leaderboard period">${[['7', 'Last 7 days'], ['30', 'Last 30 days'], ['all', 'Recorded history']].map(([value, label]) => `<option value="${value}" ${rankingPeriod === value ? 'selected' : ''}>${label}</option>`).join('')}</select></div>${rows.length ? `<div class="training-table-wrap"><table class="training-table"><thead><tr><th>Rank</th><th>Team member</th><th>Points</th><th>Accuracy</th></tr></thead><tbody>${rows.map((r, index) => `<tr class="${r.userKey === actor().userKey ? 'is-current-user' : ''}"><td>${index + 1}</td><td>${esc(r.username)}</td><td>${r.points}</td><td>${Math.round(r.correct / r.total * 100)}%</td></tr>`).join('')}</tbody></table></div>` : empty('No ranked account quizzes in this period.')}`;
  }
  function rewardsHtml(menu) {
    const data = normalize(menu.training), who = actor(), zone = data.settings.timeZone;
    const rows = leaderboard(resultsFor(menu, true), zone, daysAgo(29, zone));
    const points = rows.find(r => r.userKey === who.userKey)?.points || 0;
    return `<div class="training-section-head"><h3>Team rewards</h3><span>Your 30-day points: ${points}</span></div>${data.rewards.filter(r => !r.archived).map(r => {
      const claimed = data.claims.find(c => c.rewardId === r.id && c.userKey === who.userKey);
      return `<article class="training-reward"><h4>${esc(r.title)}</h4><p>${esc(r.description)}</p><small>${r.points} points in the last 30 days</small>${button('claim', claimed ? (claimed.status === 'fulfilled' ? 'Fulfilled' : 'Requested') : 'Request reward', r.id, !who.username || claimed || points < r.points ? 'disabled' : '')}${manage(menu) ? `<div>${button('archive-reward', 'Archive', r.id)}</div>` : ''}</article>`;
    }).join('') || empty('No manager rewards published yet.')}${manage(menu) ? `<section class="training-section"><h3>Reward requests</h3>${data.claims.map(c => `<div class="training-ack-row"><span><strong>${esc(c.username)}</strong><small>${esc(data.rewards.find(r => r.id === c.rewardId)?.title || 'Reward')}</small></span>${c.status === 'fulfilled' ? '<span class="training-status is-good">Fulfilled</span>' : button('fulfil', 'Mark fulfilled', c.id)}</div>`).join('') || empty('No reward requests.')}</section>` : ''}`;
  }
  function pairingHtml(menu) {
    const items = list(menu.items).filter(i => pairings(i.pairings).length || i.recommendation);
    const canQuiz = new Set(items.flatMap(i => pairings(i.pairings))).size >= 2;
    return `<div class="training-section-head"><h3>Pairings & recommendations</h3>${button('pairing-quiz', 'Practice pairings', '', canQuiz ? '' : 'disabled')}</div>${items.length ? items.map(item => `<details class="training-disclosure"><summary>${esc(item.name)}</summary>${pairings(item.pairings).length ? `<ul>${pairings(item.pairings).map(p => `<li>${esc(p)}</li>`).join('')}</ul>` : ''}${item.recommendation ? `<p class="training-preserve-lines">${esc(item.recommendation)}</p>` : ''}</details>`).join('') : empty('No approved pairing or guest recommendation notes yet. Menu editors can add them when editing an item.')}`;
  }
  function setupHtml(menu) {
    if (!manage(menu)) return empty('Training manager access is required.');
    const data = normalize(menu.training), members = team(menu);
    const categoryOptions = `<option value="all">All categories</option>${getUniqueCategories(menu.items.map(i => i.category)).map(c => `<option value="${esc(c)}">${esc(getCategoryLabel(c))}</option>`).join('')}`;
    return `<details class="training-disclosure" data-disclosure="setup-assignment"><summary>Create or edit an assignment</summary><form data-training-form="assignment" class="training-editor"><input name="id" type="hidden"><label>Title<input name="title" maxlength="180" required></label><div class="training-form-grid"><label>Questions<select name="questionLimit">${[5, 10, 15, 20].map(n => `<option>${n}</option>`).join('')}</select></label><label>Focus<select name="questionMode"><option value="all">All topics</option><option value="ingredients">Ingredients</option><option value="allergies">Allergies</option><option value="pairings">Pairings</option></select></label><label>Category<select name="category">${categoryOptions}</select></label><label>Pass percentage<input name="passPercent" type="number" min="0" max="100" value="80" required></label><label>Due date<input name="dueDate" type="date"></label></div><fieldset class="training-assignees"><legend>Team members</legend><label><input type="checkbox" data-training-select-all>Select all</label>${members.map(user => `<label><input type="checkbox" name="assignees" value="${esc(user.username)}">${esc(user.username)}</label>`).join('') || '<p>No team members have access to this menu yet.</p>'}</fieldset><div class="training-inline-actions"><button class="save-button" type="submit">Save assignment</button><button class="action-button" type="reset">Clear</button></div></form></details>
      <details class="training-disclosure" data-disclosure="setup-briefing"><summary>Publish or edit a briefing</summary><form data-training-form="briefing" class="training-editor"><input name="id" type="hidden"><label>Menu change<select data-training-note><option value="">New briefing</option>${list(menu.notifications).slice(0, 20).map(n => `<option value="${esc(n.id)}">${esc(n.title)} - ${esc(text(n.detail, 90))}</option>`).join('')}</select></label><label>Title<input name="title" maxlength="180" required></label><label>Briefing<textarea name="body" rows="5" maxlength="4000" required></textarea></label><div class="training-form-grid"><label>Type<select name="kind"><option value="service">Service notes</option><option value="special">Special</option><option value="unavailable">Unavailable item</option><option value="recipe">Recipe change</option></select></label><label>Shift date<input name="day" type="date"></label></div><label class="training-check"><input type="checkbox" name="requiresAck" checked>Require acknowledgement</label><div class="training-inline-actions"><button class="save-button" type="submit">Publish briefing</button><button class="action-button" type="reset">Clear</button></div></form></details>
      <details class="training-disclosure" data-disclosure="setup-reward"><summary>Create a team reward</summary><form data-training-form="reward" class="training-editor"><label>Reward title<input name="title" maxlength="180" required></label><label>Details<textarea name="description" rows="3" maxlength="1500" required></textarea></label><label>30-day points required<input name="points" type="number" min="1" max="100000" value="500" required></label><button class="save-button" type="submit">Publish reward</button></form></details>
      <details class="training-disclosure" data-disclosure="setup-zone"><summary>Training time zone</summary><form data-training-form="settings" class="training-editor"><label>Restaurant time zone<select name="timeZone">${[['America/Los_Angeles', 'Los Angeles / Las Vegas'], ['America/Denver', 'Denver'], ['America/Chicago', 'Chicago'], ['America/New_York', 'New York'], ['Europe/London', 'London'], ['Europe/Paris', 'Paris'], ['Asia/Dubai', 'Dubai'], ['Asia/Tokyo', 'Tokyo'], ['Australia/Sydney', 'Sydney'], ['UTC', 'UTC']].map(([value, label]) => `<option value="${value}" ${data.settings.timeZone === value ? 'selected' : ''}>${label}</option>`).join('')}</select></label><button class="save-button" type="submit">Save time zone</button></form></details>
      <details class="training-disclosure" data-disclosure="setup-archive"><summary>Briefing archive</summary>${data.briefings.map(b => `<div class="training-ack-row"><span>${esc(b.title)}<small>${esc(b.day || 'All shifts')}${b.archived ? ' · Archived' : ''}</small></span>${button('edit-briefing', 'Edit', b.id)}</div>`).join('') || empty('No briefings yet.')}</details>`;
  }
  function render(force = false) {
    if (!root.document || typeof getActiveRestaurantMenu === 'undefined') return;
    const menu = activeMenu();
    if (menu) {
      const pendingChanges = list(cache.events).filter(e => e.menuId === menu.id && e.workspaceDocId === workspace(menu)).map(e => e.change);
      if (pendingChanges.length) menu.training = merge(menu.training, ...pendingChanges);
    }
    const entryButton = root.document.querySelector('#trainingHubButton');
    if (menu && entryButton && (getActiveUser() || state.sharedMenu)) {
      const data = normalize(menu.training), who = actor(), date = dayKey(new Date(), data.settings.timeZone);
      const unread = data.briefings.filter(b => !b.archived && b.requiresAck && (!b.day || b.day === date) && !data.acknowledgements.some(a => a.briefingId === b.id && a.briefingVersion === b.updatedAt && a.userKey === who.userKey)).length;
      entryButton.textContent = unread ? `Training (${unread})` : 'Training';
    }
    const dialogOpen = root.document.querySelector('#trainingHubDialog')?.open;
    const dashboardOpen = state.screen === 'users' && state.dashboardTab === 'training';
    if (!dialogOpen && !dashboardOpen) return;
    for (const id of ['trainingMenuRoot', 'trainingDashboardRoot']) {
      const container = root.document.getElementById(id);
      if (!container || (id === 'trainingMenuRoot' ? !dialogOpen : !dashboardOpen)) continue;
      if (!force && container.querySelector('form[data-dirty="true"]')) continue;
      const open = [...container.querySelectorAll('details[open][data-disclosure]')].map(d => d.dataset.disclosure);
      const selector = id === 'trainingDashboardRoot' ? `<label class="training-filter">Menu<select data-training-menu>${getVisibleRestaurantMenus().map(m => `<option value="${esc(m.id)}" ${m.id === menu?.id ? 'selected' : ''}>${esc(m.restaurantName ? `${m.restaurantName} / ${m.name}` : m.name)}</option>`).join('')}</select></label>` : '';
      if (!menu) { container.innerHTML = selector + empty('Create or open a menu to begin training.'); continue; }
      connectAttempts(menu);
      const who = actor(), data = normalize(menu.training), date = dayKey(new Date(), data.settings.timeZone);
      const completedDaily = resultsFor(menu).find(r => r.userKey === who.userKey && r.challengeDate === date && isFull(r));
      const tabs = [['progress', 'My progress'], ['assignments', 'Assignments'], ['briefing', 'Pre-shift'], ['pairings', 'Pairings'], ...(getActiveUser() ? [['leaderboard', 'Leaderboard'], ['rewards', 'Rewards']] : []), ...(manage(menu) ? [['manage', 'Setup']] : [])];
      if (!tabs.some(([id]) => id === panel)) panel = 'progress';
      const content = { progress: progressHtml, assignments: assignmentsHtml, briefing: briefingsHtml, pairings: pairingHtml, leaderboard: leaderboardHtml, rewards: rewardsHtml, manage: setupHtml }[panel](menu);
      const pending = list(cache.pending).filter(r => r.userKey === who.userKey && r.menuId === menu.id).length + list(cache.events).filter(e => e.menuId === menu.id && e.actorKey === who.userKey).length;
      container.innerHTML = `${selector}<div class="training-title"><div><p class="kicker">${esc(menu.restaurantName || 'Menu training')}</p><h3>${esc(menu.name)}</h3></div>${button('refresh', '&#8635;', '', 'aria-label="Refresh training" title="Refresh training"')}</div><div class="training-daily"><div><strong>Daily challenge</strong><small>${date} · 5 questions${completedDaily ? ` · Completed: ${completedDaily.percent}%` : ''}</small></div>${completedDaily ? button('review', 'Review', completedDaily.id) : button('daily', 'Start challenge')}</div><div class="training-tabs" role="tablist">${tabs.map(([id, label]) => `<button type="button" role="tab" aria-selected="${panel === id}" class="${panel === id ? 'is-active' : ''}" data-training-tab="${id}">${label}</button>`).join('')}</div><p class="training-message" role="status">${esc(lastMessage || (pending ? `${pending} training record${pending === 1 ? '' : 's'} pending cloud sync.` : subscriptionFailed))}</p><div class="training-panel" role="tabpanel">${content}</div>`;
      container.querySelectorAll('details[data-disclosure]').forEach(d => { if (open.includes(d.dataset.disclosure)) d.open = true; });
    }
  }
  async function review(id) {
    const menu = activeMenu(), result = resultsFor(menu).find(r => r.id === id);
    if (!result || (!manage(menu) && result.userKey !== actor().userKey)) return;
    let full = cache.attempts[id] || result;
    if (!full.questions?.length) {
      try { const snapshot = await attemptRef(menu, id)?.get(); if (snapshot?.exists) { full = snapshot.data(); cache.attempts[id] = full; persistCache(); } } catch {}
    }
    const container = root.document.querySelector('#trainingReviewRoot');
    container.innerHTML = `<p><strong>${esc(full.takerName)}</strong> · ${full.percent}% · ${dateLabel(full.takenAt)}</p><div id="trainingHistoricalAnswers"></div>`;
    renderAnswerReview(container.querySelector('#trainingHistoricalAnswers'), full);
    root.document.querySelector('#trainingReviewDialog').showModal();
  }
  function editForm(kind, record) {
    panel = 'manage'; render(true);
    const container = root.document.querySelector('#trainingHubDialog').open ? root.document.querySelector('#trainingMenuRoot') : root.document.querySelector('#trainingDashboardRoot');
    const form = container.querySelector(`[data-training-form="${kind}"]`);
    if (!form) return;
    form.closest('details').open = true;
    for (const field of form.elements) {
      if (!field.name || record[field.name] === undefined) continue;
      if (field.type === 'checkbox') field.checked = Array.isArray(record[field.name]) ? record[field.name].includes(field.value) : Boolean(record[field.name]);
      else field.value = record[field.name];
    }
    form.dataset.dirty = 'true'; form.scrollIntoView({ block: 'nearest' });
  }
  async function handleAction(action, id) {
    const menu = activeMenu(); if (!menu) return;
    const data = normalize(menu.training), who = actor();
    lastMessage = '';
    if (action === 'review') return review(id);
    if (action === 'daily') return launch('daily');
    if (action === 'assignment') return launch('assignment', id);
    if (action === 'pairing-quiz') {
      clearLaunch(); root.document.querySelector('#trainingHubDialog').close(); openQuizPage();
      root.document.querySelector('#quizSetupForm input[value="pairings"]').checked = true; return;
    }
    if (action === 'refresh') { subscriptionKey = ''; subscriptionFailed = ''; flush(); render(true); return; }
    if (action === 'acknowledge') {
      const b = data.briefings.find(b => b.id === id && !b.archived);
      if (!b) return;
      return changeTraining('acknowledgements', { id: `${id}|${b.updatedAt}|${who.userKey}`, briefingId: id, briefingVersion: b.updatedAt, userKey: who.userKey, username: who.username, name: who.name, updatedAt: now(), createdAt: now() });
    }
    if (action === 'claim') {
      const reward = data.rewards.find(r => r.id === id && !r.archived);
      const points = leaderboard(resultsFor(menu, true), data.settings.timeZone, daysAgo(29, data.settings.timeZone)).find(r => r.userKey === who.userKey)?.points || 0;
      if (!who.username || !reward || points < reward.points || data.claims.some(c => c.rewardId === id && c.userKey === who.userKey)) return;
      return changeTraining('claims', { id: `${id}|${who.userKey}`, rewardId: id, userKey: who.userKey, username: who.username, name: who.name, status: 'requested', createdAt: now(), updatedAt: now() });
    }
    if (!manage(menu)) return;
    if (action === 'fulfil') { const claim = data.claims.find(c => c.id === id); if (claim) return changeTraining('claims', { ...claim, status: 'fulfilled', updatedAt: now() }); }
    const kinds = { assignment: 'assignments', briefing: 'briefings', reward: 'rewards' };
    const [verb, kind] = action.split('-'), key = kinds[kind];
    if (!key) return;
    const record = data[key].find(r => r.id === id); if (!record) return;
    if (verb === 'edit') return editForm(kind, { ...record, archived: false });
    if (verb === 'archive' && root.confirm(`Archive ${record.title}?`)) return changeTraining(key, { ...record, archived: true, updatedAt: now() });
  }
  async function submitForm(form) {
    if (!manage()) return;
    const values = new FormData(form), kind = form.dataset.trainingForm, menu = activeMenu(), data = normalize(menu.training);
    const string = key => String(values.get(key) || '').trim();
    const id = string('id') || uid(), createdAt = data[kind === 'assignment' ? 'assignments' : 'briefings'].find(r => r.id === id)?.createdAt || now();
    let key, record;
    if (kind === 'settings') { key = 'settings'; record = { timeZone: timeZone(string('timeZone')), updatedAt: now() }; }
    if (kind === 'assignment') {
      const allowed = new Set(team(menu).map(u => u.username));
      const assignees = values.getAll('assignees').filter(name => allowed.has(name));
      if (!assignees.length) throw Error('Select at least one team member.');
      key = 'assignments'; record = { id, title: string('title'), assignees, dueDate: string('dueDate'), passPercent: Number(string('passPercent')), questionLimit: Number(string('questionLimit')), questionMode: string('questionMode'), category: string('category'), createdAt, updatedAt: now(), archived: false };
    }
    if (kind === 'briefing') { key = 'briefings'; record = { id, title: string('title'), body: string('body'), day: string('day'), kind: string('kind'), requiresAck: values.has('requiresAck'), createdAt, updatedAt: now(), archived: false }; }
    if (kind === 'reward') { key = 'rewards'; record = { id, title: string('title'), description: string('description'), points: Number(string('points')), createdAt: now(), updatedAt: now(), archived: false }; }
    form.dataset.dirty = 'false';
    if (key) await changeTraining(key, record);
    render(true);
  }
  if (root.document) {
    root.document.addEventListener('click', event => {
      const open = event.target.closest('#trainingHubButton');
      if (open) { if (!activeMenu() || !(getActiveUser() || state.sharedMenu)) return; panel = 'progress'; selectedProfile = ''; lastMessage = ''; root.document.querySelector('#trainingHubDialog').showModal(); render(true); flush(); return; }
      const tab = event.target.closest('[data-training-tab]');
      if (tab) { panel = tab.dataset.trainingTab; lastMessage = ''; render(true); return; }
      const control = event.target.closest('[data-training-action]');
      if (control) handleAction(control.dataset.trainingAction, control.dataset.id).catch(error => { lastMessage = error.message; render(true); });
    });
    root.document.addEventListener('submit', event => {
      const form = event.target.closest('[data-training-form]'); if (!form) return;
      event.preventDefault();
      submitForm(form).catch(error => { lastMessage = error.message; form.dataset.dirty = 'false'; render(true); });
    });
    root.document.addEventListener('input', event => { const form = event.target.closest('[data-training-form]'); if (form) form.dataset.dirty = 'true'; });
    root.document.addEventListener('reset', event => { const form = event.target.closest('[data-training-form]'); if (form) { delete form.dataset.dirty; setTimeout(() => { for (const field of form.elements) if (field.name === 'id') field.value = ''; }, 0); } });
    root.document.addEventListener('change', event => {
      const field = event.target;
      if (field.matches('[data-training-menu]')) { if (!getVisibleRestaurantMenus().some(m => m.id === field.value)) return; state.activeRestaurantMenu = field.value; syncActiveRestaurantMenuData(); selectedProfile = ''; subscriptionKey = ''; render(true); }
      if (field.matches('[data-training-profile]')) { if (!manage()) return; selectedProfile = field.value; render(true); }
      if (field.matches('[data-training-period]')) { rankingPeriod = field.value; render(true); }
      if (field.matches('[data-training-select-all]')) field.closest('form').querySelectorAll('[name="assignees"]').forEach(input => { input.checked = field.checked; });
      if (field.matches('[data-training-note]')) { const note = activeMenu()?.notifications?.find(n => n.id === field.value); if (!note) return; const form = field.closest('form'); form.elements.title.value = note.title; form.elements.body.value = note.detail; form.elements.kind.value = 'recipe'; form.elements.requiresAck.checked = true; form.dataset.dirty = 'true'; }
    });
    root.document.addEventListener('keydown', event => {
      const current = event.target.closest('[data-training-tab]');
      if (!current || !['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      const tabs = [...current.parentElement.querySelectorAll('[data-training-tab]')];
      const index = tabs.indexOf(current);
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
      event.preventDefault();
      const id = tabs[next].dataset.trainingTab;
      tabs[next].click();
      const container = root.document.querySelector('#trainingHubDialog').open ? root.document.querySelector('#trainingMenuRoot') : root.document.querySelector('#trainingDashboardRoot');
      container.querySelector(`[data-training-tab="${id}"]`)?.focus();
    });
    root.addEventListener('online', () => { retries = 0; flush(); subscriptionKey = ''; render(); });
    root.document.addEventListener('DOMContentLoaded', () => flush());
  }
  api.render = render;
})(typeof window === 'undefined' ? globalThis : window);
