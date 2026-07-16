const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");

const root = path.resolve(__dirname, "..");
const outputRoot = path.join(root, "play-store-assets");
const appUrl = process.env.MENU_MATRIX_STORE_URL || "http://127.0.0.1:4173/?v=demo-menu-guide";

const screenshotSets = [
  {
    folder: "phone",
    viewport: { width: 432, height: 768 },
    deviceScaleFactor: 2.5,
    shots: ["login", "demo-overview", "item-details", "flashcards"]
  },
  {
    folder: "tablet-7-inch",
    viewport: { width: 960, height: 600 },
    deviceScaleFactor: 2,
    shots: ["demo-overview", "filters", "quiz"]
  },
  {
    folder: "tablet-10-inch",
    viewport: { width: 1280, height: 800 },
    deviceScaleFactor: 2,
    shots: ["login", "item-details", "flashcards"]
  }
];

function ensureDir(directory) {
  fs.mkdirSync(directory, { recursive: true });
}

function edgeExecutablePath() {
  const candidates = [
    "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
    "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe"
  ];

  return candidates.find((candidate) => fs.existsSync(candidate));
}

function copyIcon() {
  const source = path.join(root, "assets", "app-icon-playstore.png");
  const destination = path.join(outputRoot, "app-icon-512.png");
  fs.copyFileSync(source, destination);
  return destination;
}

async function captureFeatureGraphic(browser) {
  const context = await browser.newContext({
    viewport: { width: 1024, height: 500 },
    deviceScaleFactor: 1
  });
  const page = await context.newPage();
  const iconBase64 = fs.readFileSync(path.join(root, "assets", "app-icon-playstore.png")).toString("base64");
  await page.setContent(
    `<!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        <style>
          * { box-sizing: border-box; }
          body {
            width: 1024px;
            height: 500px;
            margin: 0;
            overflow: hidden;
            font-family: Inter, Arial, sans-serif;
            color: #fffdfa;
            background:
              radial-gradient(circle at 82% 22%, rgba(217, 157, 43, 0.36), transparent 230px),
              radial-gradient(circle at 8% 86%, rgba(49, 124, 142, 0.36), transparent 260px),
              linear-gradient(135deg, #19211d 0%, #263931 48%, #101714 100%);
          }
          .wrap {
            position: relative;
            display: grid;
            grid-template-columns: 1fr 340px;
            gap: 40px;
            width: 100%;
            height: 100%;
            padding: 58px 70px;
            align-items: center;
          }
          .badge {
            width: max-content;
            border: 1px solid rgba(255, 255, 255, 0.24);
            border-radius: 999px;
            padding: 10px 16px;
            background: rgba(255, 255, 255, 0.08);
            color: #f2c766;
            font-size: 18px;
            font-weight: 900;
            letter-spacing: 0.09em;
            text-transform: uppercase;
          }
          h1 {
            margin: 22px 0 14px;
            font-family: Georgia, serif;
            font-size: 78px;
            line-height: 0.92;
            letter-spacing: 0;
          }
          p {
            max-width: 560px;
            margin: 0;
            color: rgba(255, 253, 250, 0.86);
            font-size: 28px;
            line-height: 1.22;
            font-weight: 750;
          }
          .chips {
            display: flex;
            gap: 12px;
            margin-top: 30px;
          }
          .chips span {
            border-radius: 999px;
            padding: 10px 14px;
            background: rgba(255, 255, 255, 0.13);
            color: #fffdfa;
            font-size: 18px;
            font-weight: 850;
          }
          .device {
            position: relative;
            display: grid;
            place-items: center;
            min-height: 330px;
          }
          .device::before {
            position: absolute;
            inset: 10px 0 0 36px;
            border-radius: 44px;
            background: rgba(0, 0, 0, 0.22);
            content: "";
            filter: blur(18px);
          }
          .phone {
            position: relative;
            width: 230px;
            height: 360px;
            border: 10px solid rgba(255, 255, 255, 0.16);
            border-radius: 42px;
            padding: 22px;
            background: rgba(251, 250, 246, 0.94);
            box-shadow: 0 28px 70px rgba(0, 0, 0, 0.34);
          }
          .phone img {
            width: 92px;
            height: 92px;
            display: block;
            margin: 4px auto 24px;
            border-radius: 24px;
            box-shadow: 0 14px 28px rgba(25, 33, 29, 0.18);
          }
          .row {
            height: 40px;
            margin-top: 12px;
            border-radius: 8px;
            background: #fffdfa;
            box-shadow: 0 8px 18px rgba(25, 33, 29, 0.12);
          }
          .row:nth-child(3) { background: #edf5ef; }
          .row:nth-child(4) { background: #eaf4f6; }
        </style>
      </head>
      <body>
        <main class="wrap">
          <section>
            <div class="badge">Restaurant training</div>
            <h1>Menu Matrix</h1>
            <p>Menus, allergens, ingredients, flash cards, and quizzes for confident service.</p>
            <div class="chips">
              <span>Build</span>
              <span>Study</span>
              <span>Share</span>
            </div>
          </section>
          <section class="device" aria-hidden="true">
            <div class="phone">
              <img src="data:image/png;base64,${iconBase64}" />
              <div class="row"></div>
              <div class="row"></div>
              <div class="row"></div>
              <div class="row"></div>
            </div>
          </section>
        </main>
      </body>
    </html>`,
    { waitUntil: "load" }
  );

  await page.screenshot({
    path: path.join(outputRoot, "feature-graphic-1024x500.jpg"),
    type: "jpeg",
    quality: 94
  });
  await context.close();
}

async function newAppPage(browser, viewport) {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    deviceScaleFactor: viewport.deviceScaleFactor || 1,
    locale: "en-US"
  });
  const page = await context.newPage();
  await page.goto(appUrl, { waitUntil: "domcontentloaded" });
  await page.waitForSelector("#demoMenuButton", { timeout: 15000 });
  await page.waitForTimeout(900);
  return { context, page };
}

async function openDemo(page) {
  await page.click("#demoMenuButton");
  await page.waitForSelector("#menuPage:not([hidden])", { timeout: 15000 });
  await page.waitForSelector(".menu-row", { timeout: 15000 });
  await page.waitForTimeout(1200);
}

async function screenshot(page, filePath) {
  await page.screenshot({
    path: filePath,
    type: "jpeg",
    quality: 90,
    fullPage: false
  });
}

async function showItemDetails(page) {
  await openDemo(page);
  await page.evaluate(() => document.querySelector(".matrix-card")?.scrollIntoView({ block: "start" }));
  await page.waitForTimeout(700);
  await page.locator(".menu-row .item-toggle").first().click();
  await page.waitForSelector(".item-details:not([hidden])", { timeout: 10000 });
  await page.waitForTimeout(700);
}

async function showFilters(page) {
  await openDemo(page);
  await page.evaluate(() => {
    document.querySelector(".allergy-panel").open = true;
    document.querySelector(".ingredient-panel").open = true;
    const gluten = [...document.querySelectorAll("#allergyChips button")].find((button) => button.textContent.trim() === "Gluten");
    const lobster = [...document.querySelectorAll("#ingredientChips button")].find((button) => button.textContent.trim() === "Lobster");
    gluten?.click();
    lobster?.click();
  });
  await page.waitForTimeout(900);
}

async function showFlashcards(page) {
  await openDemo(page);
  await page.click("#quickFlashcardButton");
  await page.waitForSelector("#flashcardPage:not([hidden])", { timeout: 15000 });
  await page.click("#flashcardNextButton");
  await page.waitForTimeout(500);
  await page.click("#flashcardFlipButton");
  await page.waitForTimeout(700);
}

async function showQuiz(page) {
  await openDemo(page);
  await page.click("#quickQuizButton");
  await page.waitForSelector("#quizPage:not([hidden])", { timeout: 15000 });
  await page.fill("#quizTakerName", "Alex");
  await page.click("#quizSetupForm button[type='submit']");
  await page.waitForSelector("#quizCard:not([hidden])", { timeout: 15000 });
  await page.waitForTimeout(800);
}

async function captureShot(browser, set, shot, index) {
  const { context, page } = await newAppPage(browser, {
    ...set.viewport,
    deviceScaleFactor: set.deviceScaleFactor
  });
  const folder = path.join(outputRoot, set.folder);
  const destination = path.join(folder, `${String(index + 1).padStart(2, "0")}-${shot}.jpg`);

  if (shot === "login") {
    await screenshot(page, destination);
  } else if (shot === "demo-overview") {
    await openDemo(page);
    await screenshot(page, destination);
  } else if (shot === "item-details") {
    await showItemDetails(page);
    await screenshot(page, destination);
  } else if (shot === "filters") {
    await showFilters(page);
    await screenshot(page, destination);
  } else if (shot === "flashcards") {
    await showFlashcards(page);
    await screenshot(page, destination);
  } else if (shot === "quiz") {
    await showQuiz(page);
    await screenshot(page, destination);
  }

  await context.close();
  return destination;
}

async function main() {
  ensureDir(outputRoot);
  screenshotSets.forEach((set) => ensureDir(path.join(outputRoot, set.folder)));
  copyIcon();

  const executablePath = edgeExecutablePath();
  const browser = await chromium.launch({
    headless: true,
    executablePath,
    channel: executablePath ? undefined : "msedge",
    args: ["--disable-gpu", "--no-sandbox"]
  });

  await captureFeatureGraphic(browser);

  const generated = [path.join(outputRoot, "app-icon-512.png"), path.join(outputRoot, "feature-graphic-1024x500.jpg")];
  for (const set of screenshotSets) {
    for (let index = 0; index < set.shots.length; index += 1) {
      generated.push(await captureShot(browser, set, set.shots[index], index));
    }
  }

  await browser.close();
  console.log("Generated Play Store assets:");
  generated.forEach((file) => console.log(`- ${path.relative(root, file)}`));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
