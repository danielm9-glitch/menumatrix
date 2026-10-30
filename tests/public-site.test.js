const { test } = require('node:test');
const assert = require('node:assert/strict');
const { chromium } = require('playwright');
const fs = require('node:fs');
const base = process.env.MENU_MATRIX_TEST_URL || 'http://localhost:4186';

test('public pages have distinct search metadata, valid internal links and a public-only sitemap', async () => {
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();
    const routes = ['/', ...require('../content/public-pages').map(p => p.path)];
    const titles = new Set();
    for (const route of routes) {
      const response = await page.goto(base + route);
      assert.equal(response.status(), 200);
      const title = await page.title();
      assert.ok(!titles.has(title));
      titles.add(title);
      assert.equal(await page.locator('h1').count(), 1);
      assert.ok((await page.locator('meta[name="description"]').getAttribute('content')).length > 50);
      assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'), 'https://mymenumatrix.com' + route);
      const links = await page.locator('a[href^="/"]').evaluateAll(els => [...new Set(els.map(el => el.getAttribute('href').split(/[?#]/)[0]))]);
      for (const link of links) assert.equal((await page.request.get(base + link)).status(), 200, link);
    }
    const sitemap = await (await page.request.get(base + '/sitemap.xml')).text();
    assert.equal((sitemap.match(/<loc>/g) || []).length, 6);
    assert.ok(!sitemap.includes('/app'));
    assert.ok((await (await page.request.get(base + '/robots.txt')).text()).startsWith('User-agent:'));
    assert.equal((await page.request.get(base + '/missing-page-for-seo-test')).status(), 404);
  } finally { await browser.close(); }
});

test('homepage fits small phones and desktop; FAQ, reveal motion and reduced motion work', async () => {
  const browser = await chromium.launch();
  try {
    fs.mkdirSync('test-artifacts', { recursive: true });
    for (const [label, width, height] of [['small', 320, 667], ['phone', 390, 844], ['tablet', 768, 1024], ['desktop', 1440, 1000]]) {
      const page = await browser.newPage({ viewport: { width, height } });
      await page.goto(base + '/');
      await page.evaluate(() => document.fonts.ready);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
      await page.locator('.faq-list summary').first().click();
      assert.ok(await page.locator('.faq-list details').first().getAttribute('open') !== null);
      await page.locator('.resource-related').scrollIntoViewIfNeeded();
      await page.waitForFunction(() => document.querySelector('.resource-related').classList.contains('is-visible'));
      await page.evaluate(async () => {
        for (const image of document.images) { image.loading = 'eager'; await image.decode(); }
        document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible'));
        scrollTo(0, 0);
      });
      await page.addStyleTag({ content: '.reveal { transition: none !important; }' });
      await page.screenshot({ path: `test-artifacts/public-${label}.png`, fullPage: true });
      await page.close();
    }
    const page = await browser.newPage({ reducedMotion: 'reduce' });
    await page.goto(base + '/');
    assert.equal(await page.locator('.will-reveal').count(), 0);
    await page.close();
  } finally { await browser.close(); }
});

test('demo, registration, code entry and legacy invite links reach the app', async () => {
  const browser = await chromium.launch();
  try {
    for (const [action, visible] of [['demo', '#menuPage'], ['register', '#registerPage'], ['code', '#codeLoginForm']]) {
      const page = await browser.newPage();
      await page.route('https://**/*', route => new URL(route.request().url()).origin === new URL(base).origin ? route.continue() : route.abort());
      await page.goto(base + '/app.html?action=' + action);
      await page.locator(visible).waitFor({ state: 'visible' });
      assert.equal(await page.locator('meta[name="robots"]').getAttribute('content'), 'noindex, follow');
      await page.close();
    }
    const page = await browser.newPage();
    await page.route('https://**/*', route => new URL(route.request().url()).origin === new URL(base).origin ? route.continue() : route.abort());
    await page.goto(base + '/?invite=example&mode=verifyEmail&oobCode=example');
    await page.waitForURL(url => /^\/app(?:\.html)?$/.test(url.pathname) && url.searchParams.get('invite') === 'example' && url.searchParams.get('oobCode') === 'example');
  } finally { await browser.close(); }
});
