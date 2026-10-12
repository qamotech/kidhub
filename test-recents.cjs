// Dashboard "Recent" menu: 3 most recently used KidHub apps at the top of the sidebar, above Applications.
const { chromium } = require('playwright'); const assert = require('assert');
const BASE = process.env.BASE_URL || 'http://127.0.0.1:8000';

const recent = page => page.$$eval('#nav-recent [data-recent]', bs => bs.map(b => b.dataset.recent));

(async () => {
  const b = await chromium.launch({ channel: 'msedge' });
  const errors = [];
  const ctx = await b.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await ctx.newPage();
  page.on('pageerror', e => errors.push(e.message));
  await page.goto(BASE + '/index.html');
  await page.evaluate(() => localStorage.removeItem('kidHubPortalV1'));
  await page.reload(); await page.waitForTimeout(800);

  // placement: Applications group, then Recent, then Resources
  const order = await page.evaluate(() => [...document.querySelector('nav.sidebar').children].map(el => el.id === 'nav-recent' ? '[recent]' : el.textContent.trim()).filter(Boolean));
  const at = t => order.findIndex(x => x.includes(t));
  assert(at('Recent') === 0 && order.indexOf('[recent]') === 1 && at('Applications') === 2 && at('KidHub') === 3, 'Recent on top, then Applications starting with KidHub: ' + JSON.stringify(order));
  assert.deepEqual(order.slice(4, 10).map(t => t.replace(/\s*\d+$/, '')), ['📚 Learn', '🎨 Create', '🎲 Play', '💚 Wellbeing', '🧰 Helpers', '🗂️ All applications'], 'category links follow KidHub');
  assert(at('Resources') > at('All applications'), 'Resources below Applications');
  const labels = await page.$$eval('nav.sidebar > *:not(#nav-recent)', els => els.map(e => e.textContent.trim()).filter(Boolean));
  for (const t of labels) assert(/^\p{Extended_Pictographic}/u.test(t), 'menu item without an emoji: ' + t);
  assert.equal(await page.locator('.nav-count[data-count="Create"]').innerText(), '16', 'category counts come from the catalog');
  assert.deepEqual(await recent(page), [], 'starts empty');
  assert(await page.isVisible('#nav-recent .nav-recent-empty'), 'empty state explains what will appear');

  // sidebar apps, studio activities and toolbox tools all count
  await page.click('.nav-cat[data-category="Create"]');
  assert.equal(await page.inputValue('#app-category'), 'Create', 'category link opens the library filtered');
  assert.equal(await page.locator('.nav-cat.active').getAttribute('data-category'), 'Create', 'open category is highlighted');
  await page.locator('[data-launch="suite-1"]').first().click();
  assert(await page.evaluate(() => document.getElementById('app-1').classList.contains('active')), 'KidsBeat opens from its category');
  assert.deepEqual(await recent(page), ['suite-1']);
  const recentEmoji = await page.$$eval('#nav-recent .nav-btn', bs => bs.every(b => /^\p{Extended_Pictographic}/u.test(b.textContent.trim())));
  assert(recentEmoji, 'recent items show their emoji');
  await page.click('.nav-btn[data-target="app-0"]');
  const studio = await (await page.$('#app-0')).contentFrame();
  await studio.locator(`[onclick="app.show('draw')"]`).first().click();
  await page.waitForTimeout(100);
  assert.deepEqual(await recent(page), ['core-draw', 'suite-1'], 'activities inside KidHub are recorded (the KidHub button itself is not)');
  await studio.evaluate(() => { app.show('tools'); });
  const toolId = await studio.evaluate(() => { const t = document.querySelector('#tools-root [data-t]'); t.click(); return t.dataset.t; });
  await page.waitForTimeout(100);
  const three = await recent(page);
  assert.deepEqual(three, ['tool-' + toolId, 'core-draw', 'suite-1'], 'only the 3 most recent show: ' + JSON.stringify(three));
  assert.equal(await page.locator('#nav-recent .nav-recent-empty').count(), 0, 'empty hint goes away');

  // a recent entry launches the app and moves to the top
  await page.click('#nav-recent [data-recent="core-draw"]');
  await page.waitForTimeout(200);
  assert.equal(await studio.evaluate(() => app.current), 'draw', 'clicking a recent opens it');
  assert.deepEqual((await recent(page))[0], 'core-draw');

  // it persists, and the library's own "recent" view agrees
  await page.reload(); await page.waitForTimeout(800);   // reload re-applies #app=0&screen=draw; that is not a new use
  assert.deepEqual(await recent(page), ['core-draw', 'tool-' + toolId, 'suite-1'], 'recents persist across reloads');
  assert.deepEqual(await page.evaluate(() => KidHubPortal.recent().slice(0, 3)), ['core-draw', 'tool-' + toolId, 'suite-1']);

  // standalone KidHub and arcade launches feed the same list
  const solo = await ctx.newPage();   // same context = same localStorage
  solo.on('pageerror', e => errors.push(e.message));
  await solo.goto(BASE + '/studio.html'); await solo.waitForTimeout(600);
  await solo.locator(`[onclick="app.show('math')"]`).first().click();
  await solo.evaluate(() => app.show('arcade'));
  await Promise.all([solo.waitForURL(/games\/neon-pong\.html/), solo.click('.ar-tile[data-slug="neon-pong"]')]);
  await solo.close();
  await page.reload(); await page.waitForTimeout(800);
  const soloList = await recent(page);
  assert.deepEqual(soloList, ['game-neon-pong', 'core-math', 'core-draw'], 'standalone studio + arcade are recorded: ' + JSON.stringify(soloList));

  // phones: the recent buttons ride along in the horizontal menu
  const phone = await ctx.newPage(); await phone.setViewportSize({ width: 390, height: 844 });
  phone.on('pageerror', e => errors.push(e.message));
  await phone.goto(BASE + '/index.html'); await phone.waitForTimeout(800);
  assert(await phone.isVisible('#nav-recent [data-recent="game-neon-pong"]'), 'recents visible in the phone menu');
  await phone.close();

  await b.close();
  assert.deepEqual(errors, [], 'page errors: ' + errors.join(' | '));
  console.log('PASS recents: 3 recent apps at the top of the menu, above Applications; sidebar, activities, tools, arcade, standalone; launch, persist, phone');
})().catch(e => { console.error(e.message); process.exit(1); });
