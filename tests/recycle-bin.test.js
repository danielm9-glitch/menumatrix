const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const source = fs.readFileSync(require('node:path').join(__dirname, '../app.js'), 'utf8');

function setup() {
  const menu = { deletedItems: [] };
  const context = {
    menuItems: [{ id: 'soup', name: 'Soup', category: 'soups', images: ['https://example.com/soup.jpg'] }],
    state: { sharedMenu: null, openItems: new Set(['soup']) },
    window: { confirm: () => true },
    getActiveRestaurantMenu: () => menu,
    getActiveUser: () => ({ username: 'editor' }),
    canEditCategory: () => true,
    normalizeMenuItem: (item) => ({ ...item }),
    getTimestampMs: (value) => Date.parse(value) || 0,
    captureMenuScrollSnapshot: () => ({}),
    getCategoryLabel: (value) => value,
    recentlyDeletedMessage: { textContent: '' }
  };
  for (const name of ['markLocalItemDelete', 'markLocalItemEdit', 'addActiveMenuNotification', 'saveMenuItems', 'renderAllergyChips', 'renderIngredientChips', 'renderMenu', 'renderRecentlyDeleted']) context[name] = () => {};
  vm.createContext(context);
  for (const name of ['normalizeDeletedItems', 'mergeDeletedItems', 'deleteMenuItemById', 'restoreDeletedItem']) {
    const start = source.indexOf(`function ${name}(`);
    const end = source.indexOf('\nfunction ', start + 1);
    vm.runInContext(source.slice(start, end), context);
  }
  return { context, menu };
}

test('cancel leaves the item untouched; confirm preserves photos in the bin; restore removes it from the active bin', () => {
  const { context, menu } = setup();
  context.window.confirm = () => false;
  assert.equal(context.deleteMenuItemById('soup'), false);
  assert.equal(context.menuItems.length, 1);
  assert.equal(menu.deletedItems.length, 0);
  context.window.confirm = () => true;
  assert.equal(context.deleteMenuItemById('soup'), true);
  assert.equal(context.menuItems.length, 0);
  assert.equal(menu.deletedItems[0].item.images.length, 1);
  context.restoreDeletedItem('soup');
  assert.equal(context.menuItems.length, 1);
  assert.ok(menu.deletedItems[0].restoredAt);
  context.restoreDeletedItem('soup');
  assert.equal(context.menuItems.length, 1);
});

test('category restrictions and shared views cannot delete or restore', () => {
  const { context, menu } = setup();
  context.canEditCategory = () => false;
  assert.equal(context.deleteMenuItemById('soup'), false);
  context.canEditCategory = () => true;
  context.deleteMenuItemById('soup');
  context.canEditCategory = () => false;
  context.restoreDeletedItem('soup');
  assert.equal(context.menuItems.length, 0);
  assert.equal(menu.deletedItems[0].restoredAt, '');
  context.canEditCategory = () => true;
  context.state.sharedMenu = {};
  context.restoreDeletedItem('soup');
  assert.equal(context.menuItems.length, 0);
});

test('newer restore status wins over an older deleted snapshot', () => {
  const { context } = setup();
  const removed = { item: { id: 'soup' }, deletedAt: '2026-10-29T10:00:00Z', restoredAt: '' };
  const restored = { ...removed, restoredAt: '2026-10-30T10:00:00Z' };
  const merged = context.mergeDeletedItems([restored], [removed]);
  assert.equal(merged.length, 1);
  assert.equal(merged[0].restoredAt, restored.restoredAt);
});
