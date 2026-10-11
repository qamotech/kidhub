// "Cloud messages work now" popup: shown once per browser in the topmost KidHub page, opens Cloud.
const { chromium } = require('playwright'); const assert = require('assert');
const BASE = process.env.BASE_URL || 'http://127.0.0.1:8000';
const asPerson = ctx => ctx.addInitScript(() => Object.defineProperty(Navigator.prototype, 'webdriver', { get: () => false, configurable: true }));

(async () => {
  const b = await chromium.launch({ channel: 'msedge' });
  const errors = [];

  // dashboard: one popup in the dashboard itself (not inside the KidHub frame)
  const ctx = await b.newContext({ viewport: { width: 1280, height: 800 } }); await asPerson(ctx);
  const page = await ctx.newPage(); page.on('pageerror', e => errors.push(e.message));
  await page.goto(BASE + '/index.html');
  await page.locator('#kh-news[open]').waitFor({ timeout: 8000 });
  assert.match(await page.locator('#kh-news').innerText(), /Cloud messages work now/);
  const frame = await (await page.$('#app-0')).contentFrame();
  assert.equal(await frame.locator('#kh-news').count(), 0, 'only one popup, in the dashboard');
  assert.equal(await page.evaluate(() => document.activeElement && document.activeElement.className), 'kn-go', 'focus starts on the main action');
  await page.click('#kh-news .kn-go');
  await page.waitForTimeout(400);
  assert.equal(await page.locator('#kh-news').count(), 0, 'popup closes');
  assert(await page.evaluate(() => document.getElementById('app-0').classList.contains('active')), 'KidHub app is shown');
  assert(await frame.evaluate(() => document.getElementById('cwPanel').classList.contains('open')), 'Cloud panel opens');
  await page.reload(); await page.waitForTimeout(2200);
  assert.equal(await page.locator('#kh-news').count(), 0, 'shown only once per browser');

  // standalone KidHub: popup in the page, Esc dismisses for good
  const solo = await b.newContext({ viewport: { width: 390, height: 844 } }); await asPerson(solo);
  const s = await solo.newPage(); s.on('pageerror', e => errors.push(e.message));
  await s.goto(BASE + '/studio.html');
  await s.locator('#kh-news[open]').waitFor({ timeout: 8000 });
  const box = await s.locator('#kh-news').boundingBox();
  assert(box.x >= 0 && box.x + box.width <= 390, 'fits a phone screen');
  await s.keyboard.press('Escape'); await s.waitForTimeout(300);
  assert.equal(await s.locator('#kh-news').count(), 0, 'Esc closes it');
  await s.reload(); await s.waitForTimeout(2200);
  assert.equal(await s.locator('#kh-news').count(), 0, 'stays dismissed');

  // automated browsers (every other suite) never see it
  const bot = await b.newPage(); await bot.goto(BASE + '/index.html'); await bot.waitForTimeout(2200);
  assert.equal(await bot.locator('#kh-news').count(), 0, 'automation skips the popup');

  await b.close();
  assert.deepEqual(errors, [], 'page errors: ' + errors.join(' | '));
  console.log('PASS announce: cloud popup once per browser, dashboard-level, Try it now opens Cloud, Esc dismisses, phone fit, skipped in automation');
})().catch(e => { console.error(e.message); process.exit(1); });
