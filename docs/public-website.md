# Menu Matrix Public Website

The public homepage is authored in `home.html`, `landing.css`, and `landing.js`.
Feature and guide copy lives in `content/public-pages.js`.

Run `npm run site:build` to prepare `site-release`, or use the existing Firebase
deploy scripts, which now prepare it automatically. Firebase Hosting serves
the homepage at `/`, the app at `/app` (also reachable through `/app.html`),
and static feature and guide pages at their canonical paths. Unknown paths
return a real 404 rather than the login page.

The root `index.html` and `web-release/index.html` remain the app entry points.
Capacitor continues to use `web-release`, so Android opens the app directly.
The public website and its marketing assets are not included in the Android bundle.

Legacy homepage invitation and Firebase action parameters are forwarded to
the app, preserving their query string and hash. Public CTA links use the
app's `action=demo`, `action=register`, and `action=code` entry points.

## Search Metadata

- Public pages have unique titles, descriptions, and canonical URLs.
- The homepage includes WebSite and SoftwareApplication structured data.
- Social sharing metadata uses a screenshot of the actual demo app.
- `robots.txt` permits crawling, so the app's `noindex` directive can be read.
- The sitemap lists only public homepage, feature, guide, and privacy pages.
- Restaurant menus, shared codes, and staff results are not listed in the sitemap.
- No ratings, testimonials, customer counts, prices, or ranking guarantees were invented.

## Search Account Setup Still Required

1. Verify `mymenumatrix.com` in Google Search Console using the owner's account.
   A domain property typically requires adding the verification TXT record at Namecheap.
2. Submit `https://mymenumatrix.com/sitemap.xml` and inspect the homepage URL.
3. Verify the site in Bing Webmaster Tools and submit the same sitemap.
4. Review indexing, search queries, impressions, and clicks as data becomes available.

Account verification and sitemap submissions have not been completed by this release.
They require the owner's search-console account access; creating SEO files does not
automatically verify ownership or guarantee indexing or rankings.

## Visual Assets

- `assets/website/menu-desktop.jpg`: screenshot of the actual public demo menu.
- `assets/website/quiz-phone.jpg`: screenshot of demo quiz setup.
- `assets/website/flashcards-phone.jpg`: screenshot of demo flashcards.
- `assets/website/kitchen-pass.jpg`: current homepage hero, generated with the built-in image generation tool and optimized as JPEG. Hands plating food on a kitchen pass, with no faces. Responsive cropping is applied without added blur.
- `assets/website/hero-photo.webp`: previously supplied black-and-white photo, retained but no longer displayed.
- `assets/website/kitchen.jpg`: previous generated kitchen hero, retained but no longer displayed.

The previous kitchen image was generated using the built-in image generation tool.
It is illustrative, not a photograph of a customer restaurant.

Final generation prompt:

> Use case: photorealistic-natural. Asset type: wide website hero background for restaurant staff menu training software. Create a realistic editorial photograph inside a bright modern professional restaurant kitchen at service: a chef and front-of-house server collaboratively discussing a plated dish at a stainless steel pass, clear ingredients and fresh herbs, brushed metal, soft daylight mixed with practical kitchen lighting. The people and plated dish occupy the right half; the left half has a quieter natural kitchen workspace with usable space for white website copy overlay. Landscape 16:9 framing, premium but believable hospitality photography, natural skin texture, crisp details, moderate depth of field. Neutral whites, stainless silver, restrained green herbs, small red food accents. No text, no logos, no watermark, no dramatic darkness or artificial decorative blur.

## Verification

Current kitchen-pass generation prompt:

> Use case: photorealistic-natural. Asset type: wide landscape 16:9 homepage hero background for Menu Matrix restaurant staff training software. A refined realistic editorial photograph at a working professional restaurant kitchen pass. ONLY hands and forearms of two chefs visible, one carefully placing a fresh herb garnish with plating tweezers and the other finishing a sauce, assembling a beautiful contemporary plated dish on a white ceramic plate on a brushed stainless steel pass. Frame entirely below shoulder level or from an oblique overhead angle; ABSOLUTELY NO faces, heads, portraits, or reflections of faces anywhere. Main plate and hands on the right half of the composition, clear visible appetizing food: seared fish, bright seasonal vegetables, small dots of herb sauce. Left third is quieter stainless steel work surface for headline overlay, but retain realistic kitchen detail. In the background a few orderly prep containers and folded towels, clean professional service environment. Natural warm-neutral practical kitchen light, crisp and believable culinary detail, no orange color cast, no excessive blur, restrained muted greens and stainless silver. Premium hospitality photography, authentic and composed. No text, no logos, no watermarks.

Run `node scripts/preview-site.js` after preparing the site. The local preview
uses port 4186. Then run `node --test tests/public-site.test.js`.
The browser checks cover static metadata, canonical links, sitemap membership,
internal links, 404 responses, phone/tablet/desktop overflow, image decoding,
FAQ interaction, scroll reveal, reduced motion, and app entry actions.

The local browser tests deliberately block external Firebase requests in app
entry tests. They do not perform real account registrations or send emails.
