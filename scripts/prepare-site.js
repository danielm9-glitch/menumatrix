const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const output = path.join(root, 'site-release');
fs.mkdirSync(output, { recursive: true });
fs.cpSync(path.join(root, 'web-release'), output, { recursive: true });
fs.copyFileSync(path.join(root, 'index.html'), path.join(output, 'app.html'));
for (const file of ['landing.css', 'landing.js', 'robots.txt', 'sitemap.xml']) {
  fs.copyFileSync(path.join(root, file), path.join(output, file));
}
fs.copyFileSync(path.join(root, 'home.html'), path.join(output, 'index.html'));
fs.cpSync(path.join(root, 'assets', 'website'), path.join(output, 'assets', 'website'), { recursive: true });
const home = fs.readFileSync(path.join(root, 'home.html'), 'utf8');
const pages = require('../content/public-pages');
const escape = (value) => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const header = home.match(/<header class="site-header">[\s\S]*?<\/header>/)[0].replaceAll('href="#', 'href="/#');
const footer = home.match(/<footer class="site-footer[\s\S]*?<\/footer>/)[0];
for (const page of pages) {
  const target = path.join(output, page.path + '.html');
  fs.mkdirSync(path.dirname(target), { recursive: true });
  const content = `<!doctype html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${escape(page.title)}</title><meta name="description" content="${escape(page.description)}"><link rel="canonical" href="https://mymenumatrix.com${page.path}"><meta property="og:title" content="${escape(page.title)}"><meta property="og:description" content="${escape(page.description)}"><meta property="og:type" content="website"><meta property="og:url" content="https://mymenumatrix.com${page.path}"><meta property="og:image" content="https://mymenumatrix.com/assets/website/menu-desktop.jpg"><meta name="twitter:card" content="summary_large_image"><link rel="icon" type="image/svg+xml" href="/assets/app-icon.svg"><link rel="stylesheet" href="/landing.css?v=1"></head><body><a class="skip-link" href="#main">Skip to content</a>${header}<main id="main"><section class="resource-hero wrap"><a class="resource-back" href="/">Menu Matrix / Resources</a><p class="eyebrow">${escape(page.eyebrow)}</p><h1>${escape(page.heading)}</h1><p>${escape(page.intro)}</p><a class="button" href="/app.html?action=demo">Try the demo <span aria-hidden="true">&#8594;</span></a></section><div class="resource-layout wrap"><article class="resource-content">${page.sections.map(section => `<section><h2>${escape(section.heading)}</h2><p>${escape(section.text)}</p></section>`).join('')}</article><aside class="resource-aside"><img src="/assets/website/${page.image}" alt="${escape(page.alt)}" loading="lazy"><h2>Put it into practice.</h2><p>Explore the sample menu, try a quiz, and see how Menu Matrix fits your team.</p><a class="text-link" href="/app.html?action=register">Create an account &#8594;</a></aside></div><section class="resource-related wrap"><h2>Keep exploring</h2><div>${pages.filter(other => other.path !== page.path).map(other => `<a href="${other.path}">${escape(other.heading)} <span aria-hidden="true">&#8594;</span></a>`).join('')}</div></section></main>${footer}</body></html>`;
  fs.writeFileSync(target, content);
}
const urls = ['/', '/privacy', ...pages.map(page => page.path)];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(url => `  <url><loc>https://mymenumatrix.com${url}</loc></url>`).join('\n')}\n</urlset>\n`;
fs.writeFileSync(path.join(output, 'sitemap.xml'), sitemap);
console.log('Public website prepared; app available at /app.html.');
