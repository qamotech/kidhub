// Cloud messages: the composer asks for the email address, remembers it per device, FormSubmit delivery, activation, dedupe, SOS, offline.
const { chromium } = require('playwright'); const assert = require('assert');
(async () => {
  const b = await chromium.launch({ channel: 'msedge' }); const ctx = await b.newContext({ viewport: { width: 1280, height: 900 } }); const page = await ctx.newPage(); const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  const sent = []; let mode = 'ok';
  await ctx.route('https://formsubmit.co/**', r => { sent.push({ url: r.request().url(), body: r.request().postDataJSON() }); const body = mode === 'ok' ? { success: 'true', message: 'The form was submitted successfully.' } : { success: 'false', message: "This form needs Activation. We've sent you an email containing an 'Activate Form' link." }; r.fulfill({ status: 200, headers: { 'access-control-allow-origin': '*', 'content-type': 'application/json' }, body: JSON.stringify(body) }); });
  const url = 'file:///' + process.cwd().split(require('path').sep).join('/') + '/studio.html';
  const openCloud = async () => { await page.locator('#cwBtn').click({ force: true }); await page.locator('#cwPanel.open').waitFor(); };
  const to = u => decodeURIComponent(u.split('/ajax/')[1]);
  await page.goto(url); await openCloud();

  // nothing is hard-coded: the composer asks for the address
  assert.deepEqual(await page.evaluate(() => kidCloud.state.contacts.map(c => c.email)), ['', ''], 'no built-in inbox');
  assert.equal(await page.inputValue('#cwTo'), '');
  await page.fill('#cwMsg', 'Hello'); await page.locator('#cwSend').click();
  assert.equal(await page.evaluate(() => kidCloud.state.outbox.length), 0, 'asks for an address instead of sending');
  assert.equal(await page.evaluate(() => document.activeElement.id), 'cwTo', 'focuses the email field');
  await page.fill('#cwTo', 'not-an-email'); await page.locator('#cwSend').click();
  assert.equal(await page.evaluate(() => kidCloud.state.outbox.length), 0, 'invalid address is rejected');

  // first message to a new address: FormSubmit asks for activation; retry must not resend it
  mode = 'activate'; await page.fill('#cwTo', 'family.test@example.com'); await page.fill('#cwMsg', 'Hello from the test'); await page.locator('#cwSend').click();
  await page.waitForFunction(() => kidCloud.state.outbox.at(-1).status !== 'sending');
  assert.equal(await page.evaluate(() => kidCloud.state.outbox.at(-1).status), 'activate');
  assert.equal(sent.length, 1); assert.equal(to(sent[0].url), 'family.test@example.com'); assert.equal(sent[0].body.message, 'Hello from the test');
  mode = 'ok'; await page.locator('#cwPanel [data-t="out"]').click(); await page.locator('#cwRetry').click(); await page.waitForTimeout(300);
  assert.equal(sent.length, 1, 'held messages are delivered by FormSubmit after activation, not sent twice');

  // after activation it sends, and the device remembers the address
  await page.locator('#cwPanel [data-t="msg"]').click(); assert.equal(await page.inputValue('#cwTo'), 'family.test@example.com');
  await page.fill('#cwMsg', 'Second hello'); await page.locator('#cwSend').click();
  await page.waitForFunction(() => kidCloud.state.outbox.at(-1).status === 'sent');
  assert(/KidHub message from/.test(sent.at(-1).body._subject));
  await page.reload(); await openCloud();
  assert.equal(await page.inputValue('#cwTo'), 'family.test@example.com', 'autofilled on this device');

  // grown-up settings still work; the same address is emailed once, not twice
  await page.locator('#cwPanel [data-t="set"]').click(); const q = await page.locator('#cwBody p').first().innerText(); const [x, y] = q.match(/(\d+) × (\d+)/).slice(1).map(Number); await page.fill('#cwGate', String(x * y)); await page.locator('#cwGo').click();
  await page.fill('[data-m="0"]', 'family.test@example.com'); await page.fill('[data-m="1"]', 'not-an-email'); await page.locator('#cwSave').click();
  assert.equal(await page.evaluate(() => kidCloud.state.contacts[1].email), '', 'invalid contact email rejected');
  await page.fill('[data-m="1"]', 'dad.test@example.com'); await page.locator('#cwSave').click();
  await page.locator('#cwPanel [data-t="msg"]').click(); await page.locator('#cwBody [data-c="c2"]').click();
  const n0 = sent.length; await page.fill('#cwMsg', 'To both'); await page.locator('#cwSend').click();
  await page.waitForFunction(() => kidCloud.state.outbox.at(-1).status === 'sent');
  assert.deepEqual(sent.slice(n0).map(s => to(s.url)).sort(), ['dad.test@example.com', 'family.test@example.com'], 'one email per address');

  // SOS subject + offline queue
  await page.locator('#cwSos').click(); await page.locator('#cwSos').click();
  await page.waitForFunction(() => kidCloud.state.outbox.at(-1).sos && kidCloud.state.outbox.at(-1).status === 'sent'); assert(/URGENT/.test(sent.at(-1).body._subject));
  await ctx.setOffline(true); await page.fill('#cwMsg', 'offline hi'); await page.locator('#cwSend').click(); await page.waitForFunction(() => kidCloud.state.outbox.at(-1).status === 'queued');
  await ctx.setOffline(false); await page.waitForFunction(() => kidCloud.state.outbox.every(m => !['queued', 'sending'].includes(m.status)));

  // one-time cleanup of the short-lived shared Mom/Dad default
  await page.evaluate(() => localStorage.setItem('kidHubCloud', JSON.stringify({ contacts: [{ id: 'c1', name: 'Mom', emoji: '👩', email: 'shared@example.com' }, { id: 'c2', name: 'Dad', emoji: '👨', email: 'shared@example.com' }] })));
  await page.reload();
  assert.deepEqual(await page.evaluate(() => kidCloud.state.contacts.map(c => c.email)), ['', ''], 'old shared default is cleared');

  assert.deepEqual(errors, []);
  console.log('PASS cloud email: asks for the address, remembers it per device, invalid rejected, activation not resent, one email per address, SOS subject, offline queue, old default cleared');
  await b.close();
})().catch(e => { console.error(e); process.exit(1); });
