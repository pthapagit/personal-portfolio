/**
 * Manual verification walkthrough (not a test suite).
 * Drives the dev server with system Chrome, saves screenshots to /tmp/pshots,
 * and prints console errors + step results.
 *
 * Usage: node scripts/e2e-check.mjs
 */
import puppeteer from "puppeteer-core";
import fs from "node:fs";

const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const URL = "http://localhost:3000";
const OUT = "/tmp/pshots";
fs.mkdirSync(OUT, { recursive: true });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const results = [];
const consoleErrors = [];

function step(name, ok, note = "") {
  results.push({ name, ok, note });
  console.log(`${ok ? "PASS" : "FAIL"} — ${name}${note ? ` (${note})` : ""}`);
}

async function shot(page, name) {
  await page.screenshot({ path: `${OUT}/${name}.png` });
  console.log(`  shot: ${OUT}/${name}.png`);
}

async function clickByText(page, text, tag = "button") {
  const [el] = await page.$$(`${tag} ::-p-text(${text})`);
  if (!el) throw new Error(`no ${tag} with text "${text}"`);
  await el.click();
  return el;
}

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  args: ["--window-size=1440,900", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"],
  defaultViewport: { width: 1440, height: 900 },
});

try {
  const page = await browser.newPage();
  page.on("console", (m) => {
    if (m.type() === "error") consoleErrors.push(m.text());
  });
  page.on("pageerror", (e) => consoleErrors.push(`pageerror: ${e.message}`));

  await page.goto(URL, { waitUntil: "networkidle2", timeout: 60000 });
  await page.evaluate(() => localStorage.removeItem("portfolio-mode"));
  await page.reload({ waitUntil: "networkidle2" });

  // 0. Entry gate
  try {
    await page.waitForSelector("button ::-p-text(Report to your desk)", { timeout: 20000 });
    await shot(page, "live-gate");
    await clickByText(page, "Report to your desk");
    step("entry gate shows and accepts click", true);
  } catch (e) {
    step("entry gate shows and accepts click", false, e.message);
  }

  // 1. Intro begins
  try {
    await page.waitForSelector("button ::-p-text(Skip intro)", { timeout: 30000 });
    await sleep(3500);
    await shot(page, "live-intro");
    step("intro starts with skip button", true);
  } catch (e) {
    step("intro starts with skip button", false, e.message);
  }

  // 2. Skip → overview
  try {
    await clickByText(page, "Skip intro");
    await sleep(2000);
    await shot(page, "live-overview");
    const hud = await page.$("button ::-p-text(Directory)");
    step("overview + HUD after skip", Boolean(hud));
  } catch (e) {
    step("overview + HUD after skip", false, e.message);
  }

  // 3. Directory → Current Projects panel
  try {
    await clickByText(page, "Directory");
    await sleep(400);
    await shot(page, "live-menu");
    await clickByText(page, "Current Projects");
    await sleep(2000);
    await shot(page, "live-projects-panel");
    const close = await page.$('button[aria-label="Close Current Projects"]');
    step("projects panel opens", Boolean(close));
    if (close) await close.click();
    await sleep(1500);
  } catch (e) {
    step("projects panel opens", false, e.message);
  }

  // 4. Hover the mug area → label
  try {
    let found = false;
    // sweep a grid over the desk area
    const pts = [];
    for (let x = 700; x <= 1050; x += 50) for (let y = 460, yMax = 620; y <= yMax; y += 40) pts.push([x, y]);
    for (const [x, y] of pts) {
      await page.mouse.move(x, y);
      await sleep(350);
      const label = await page.evaluate(() => document.body.innerText.includes("CURRENT PROJECTS") || document.body.innerText.includes("COFFEE MUG"));
      if (label) { found = true; break; }
    }
    await shot(page, "live-hover");
    step("hover label appears over desk objects", found, found ? "" : "sweep did not hit the mug — check manually");
  } catch (e) {
    step("hover label appears over desk objects", false, e.message);
  }

  // 5. Terminal via Directory → About Me
  try {
    await clickByText(page, "Directory");
    await sleep(400);
    await clickByText(page, "About Me");
    await sleep(2500);
    await shot(page, "live-terminal-boot");
    for (const cmd of ["HELP", "PROJECTS", "ASK who are you"]) {
      await page.keyboard.type(cmd, { delay: 25 });
      await page.keyboard.press("Enter");
      await sleep(2200);
    }
    await shot(page, "live-terminal-output");
    const hasOffline = await page.evaluate(() => document.body.innerText.includes("ASSISTANT STATUS: OFFLINE"));
    step("terminal commands + ASK stub", hasOffline);
    await page.keyboard.type("EXIT", { delay: 25 });
    await page.keyboard.press("Enter");
    await sleep(2000);
    const dialogGone = !(await page.$('[aria-label="Personnel terminal"]'));
    step("terminal EXIT closes", dialogGone);
  } catch (e) {
    step("terminal commands + ASK stub", false, e.message);
  }

  // 6. 2D mode
  try {
    await clickByText(page, "2D view");
    await sleep(1000);
    await shot(page, "live-2d");
    const has = await page.evaluate(() => document.body.innerText.includes("WORK EXPERIENCE"));
    step("2D directory renders", has);
    await clickByText(page, "Enter the 3D office");
    await sleep(1500);
    const loading = await page.evaluate(() => document.body.innerText.length > 0);
    step("switch back to 3D", loading);
  } catch (e) {
    step("2D directory renders", false, e.message);
  }

  // 7. Mobile viewport → defaults to 2D
  try {
    const mp = await browser.newPage();
    await mp.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
    await mp.goto(URL, { waitUntil: "networkidle2" });
    await mp.evaluate(() => localStorage.removeItem("portfolio-mode"));
    await mp.reload({ waitUntil: "networkidle2" });
    await sleep(1200);
    await mp.screenshot({ path: `${OUT}/live-mobile.png` });
    console.log(`  shot: ${OUT}/live-mobile.png`);
    const is2d = await mp.evaluate(() => document.body.innerText.includes("PERSONNEL FILE"));
    step("mobile defaults to 2D", is2d);
    await mp.close();
  } catch (e) {
    step("mobile defaults to 2D", false, e.message);
  }
} finally {
  await browser.close();
}

console.log("\n--- console errors ---");
console.log(consoleErrors.length ? consoleErrors.join("\n") : "(none)");
const failed = results.filter((r) => !r.ok).length;
console.log(`\n${results.length - failed}/${results.length} steps passed`);
process.exit(failed ? 1 : 0);
