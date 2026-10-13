// Qamelot Tower Defense: drawn tower art, 5-level upgrades, immersive chrome, mouse + touch drag-and-drop.
const { chromium } = require('playwright'); const assert = require('assert'); const path = require('path');
const URL = process.env.BASE_URL ? process.env.BASE_URL + '/games/qamelot-tower-defense.html'
  : 'file:///' + path.resolve('games', 'qamelot-tower-defense.html').split(path.sep).join('/');
const SHOTS = process.env.QTD_SHOTS; // optional folder for screenshots

const freeSpot = (page, type) => page.evaluate(t => {
  for (let y = 90; y < 680; y += 23) for (let x = 60; x < 1240; x += 23) if (placementValid(t, { x, y })) return { x, y };
  return null;
}, type);
const toClient = (page, p) => page.evaluate(({ x, y }) => {
  const r = document.getElementById('game-canvas').getBoundingClientRect();
  return { x: r.left + x * r.width / 1280, y: r.top + y * r.height / 720 };
}, p);

(async () => {
  const b = await chromium.launch({ channel: 'msedge' });
  const errors = [];

  // ---- desktop: art, upgrades, chrome, mouse drag ----
  const page = await b.newPage({ viewport: { width: 1366, height: 768 } });
  page.on('pageerror', e => errors.push(e.message));
  await page.goto(URL); await page.waitForTimeout(600);
  const chrome = await page.evaluate(() => ['kh-kit', 'kh-practice-toggle'].map(id => {
    const el = document.getElementById(id); return el ? getComputedStyle(el).display : 'none';
  }));
  assert.deepEqual(chrome, ['none', 'none'], 'non-game buttons must be hidden');
  await page.click('#overlay-btn');
  await page.evaluate(() => { state.gold = 1e7; state.advancedUnlocked = true; updateUI(); });

  // every elemental tower reaches level 5 (Legend); C4 reaches 7
  for (let type = 0; type <= 7; type++) {
    const spot = await freeSpot(page, type); assert(spot, 'no free spot for type ' + type);
    const r = await page.evaluate(({ type, spot }) => {
      selectTower(type); handleCanvasClick(spot);
      const t = towers[towers.length - 1]; state.selectedTower = t;
      const levels = [];
      for (let i = 0; i < 10; i++) { upgradeTower(); levels.push(t.level); }
      updateUI();
      return { level: t.level, btn: document.getElementById('btn-d-upg').innerText, max: document.getElementById('upg-max').innerText };
    }, { type, spot });
    assert.equal(r.level, type === 7 ? 7 : 5, 'type ' + type + ' max level');
    assert.equal(r.btn, 'MAX LEVEL'); assert.equal(r.max, String(r.level));
  }

  // towers are drawn, not flat circles: a level-5 tower paints far more colours than a disc
  const art = await page.evaluate(() => {
    const c = document.createElement('canvas'); c.width = c.height = 120; const x = c.getContext('2d');
    const colours = lvl => { x.clearRect(0, 0, 120, 120); x.save(); x.translate(60, 70); drawTowerType(x, 1, lvl); x.restore();
      const d = x.getImageData(0, 0, 120, 120).data, set = new Set(); let top = 120;
      for (let i = 0; i < d.length; i += 4) if (d[i + 3] > 40) { set.add(d[i] >> 4 << 8 | d[i + 1] >> 4 << 4 | d[i + 2] >> 4); top = Math.min(top, (i / 4 / 120) | 0); }
      return { colours: set.size, height: 70 - top }; };
    return [1, 3, 5].map(colours);
  });
  assert(art[0].colours > 25, 'level 1 tower should be detailed art: ' + JSON.stringify(art));
  assert(art[2].height > art[0].height + 10, 'towers should grow with upgrades: ' + JSON.stringify(art));

  // mouse drag from the shop bar onto the board places a tower
  await page.evaluate(() => { towers = []; deselectAll(); });
  const spot = await freeSpot(page, 2), target = await toClient(page, spot);
  const btn = await page.locator('.shop-btn[data-type="2"]').boundingBox();
  await page.mouse.move(btn.x + btn.width / 2, btn.y + btn.height / 2); await page.mouse.down();
  await page.mouse.move(target.x, target.y, { steps: 12 }); await page.mouse.up();
  assert.equal(await page.evaluate(() => towers.length), 1, 'mouse drag-and-drop should place a tower');
  assert.equal(await page.evaluate(() => state.selectedShopType), null, 'shop selection clears after drop');

  // every shooting tower has a projectile you can see (no plain dots, no invisible shots)
  const sizes = await page.evaluate(() => {
    const c = document.createElement('canvas'); c.width = c.height = 80; const x = c.getContext('2d'); const out = {};
    [0, 1, 2, 3, 4, 5, 6, 9, 10, 11, 12, 13].forEach(type => {
      const p = { kind: projectileKind(type), color: TOWER_DEFS[type].color, level: 1, trail: [], spin: 0 };
      x.clearRect(0, 0, 80, 80); x.save(); x.translate(40, 40); drawProjectileBody(x, p); x.restore();
      const d = x.getImageData(0, 0, 80, 80).data; let n = 0; for (let i = 3; i < d.length; i += 4) if (d[i] > 90) n++;
      out[type + ':' + p.kind] = n;
    });
    return out;
  });
  for (const [k, n] of Object.entries(sizes)) assert(n >= 35, 'projectile too small to see: ' + k + ' = ' + n + 'px');

  // live fire at 8x: every shooting tower fires, and every landed shot leaves a visible trace
  const live = await page.evaluate(async () => {
    towers = []; projectiles = []; effectAnimations = []; enemies = []; state.wave = 0; state.waveActive = false; state.gold = 1e7; state.advancedUnlocked = true;
    const types = [0, 1, 2, 3, 4, 5, 6, 9, 10, 11, 12, 13];
    const a = pathNodes[0], b = pathNodes[1]; let placed = 0;
    for (let f = 0.05; f < 0.95 && placed < types.length; f += 0.03) for (const off of [62, -62, 90, -90]) {
      if (placed >= types.length) break;
      const len = Math.hypot(b.x - a.x, b.y - a.y), nx = -(b.y - a.y) / len, ny = (b.x - a.x) / len;
      const pos = { x: a.x + (b.x - a.x) * f + nx * off, y: a.y + (b.y - a.y) * f + ny * off };
      if (pos.x < 20 || pos.x > 1260 || pos.y < 20 || pos.y > 700) continue;
      if (placementValid(types[placed], pos)) { selectTower(types[placed]); handleCanvasClick(pos); placed++; }
    }
    const tough = createEnemyForWave; createEnemyForWave = function () { const e = tough.apply(this, arguments); e.hp = e.maxHp = 1e9; return e; };
    const fired = new Set(), traces = {}; const spawn = spawnProjectile, trace = addShotTrace, hurt = damageEnemy; let landed = 0, hits = 0;
    damageEnemy = function () { hits++; return hurt.apply(this, arguments); };
    spawnProjectile = function (t) { fired.add(t.type); return spawn.apply(this, arguments); };
    addShotTrace = function (p) { landed++; const before = effectAnimations.length; trace.apply(this, arguments); traces[p.kind] = (traces[p.kind] || 0) + (effectAnimations.length - before); };
    state.speed = 8; startWave();
    await new Promise(r => setTimeout(r, 3500));
    state.speed = 1; spawnProjectile = spawn; addShotTrace = trace; createEnemyForWave = tough; damageEnemy = hurt;
    return { placed, fired: [...fired].sort((x, y) => x - y), traces, muzzles: effectAnimations.filter(f => f.type === 'muzzle').length, landed, hits };
  });
  assert(live.hits >= live.landed * 0.5, 'shots actually hit at 8x (no overshoot): ' + live.hits + ' hits / ' + live.landed + ' landed');
  assert.equal(live.placed, 12, 'could not place every shooting tower near the path: ' + JSON.stringify(live));
  assert.deepEqual(live.fired, [0, 1, 2, 3, 4, 5, 6, 9, 10, 11, 12, 13], 'every shooting tower fires: ' + JSON.stringify(live));
  for (const kind of ['bolt', 'fireball', 'boulder', 'water', 'shard', 'gust', 'orb', 'bullet-pistol', 'bullet-smg', 'bullet-shotgun', 'bullet-rifle', 'bullet-sniper'])
    assert(live.traces[kind] > 0, 'landed shots leave a visible trace at 8x: ' + kind + ' ' + JSON.stringify(live.traces));
  await page.evaluate(() => { enemies = []; projectiles = []; state.waveActive = false; towers = []; deselectAll(); });

  // verify castle art and boss-only screen shake
  const checks = await page.evaluate(() => {
    const c = document.createElement('canvas'); c.width = c.height = 120; const x = c.getContext('2d');
    x.save(); x.translate(60, 60); drawHomeBase(x, 1.35); x.restore();
    const d = x.getImageData(0, 0, 120, 120).data, set = new Set();
    for (let i = 0; i < d.length; i += 4) if (d[i + 3] > 40) set.add(d[i] >> 4 << 8 | d[i + 1] >> 4 << 4 | d[i + 2] >> 4);

    state.screenShake = 0;
    enemies = [{ x: 500, y: 300, hp: 0, maxHp: 10, reward: 5, type: 'basic', pathIdx: 0, speed: 1 }];
    processCombat(1);
    const nonBossKillShake = state.screenShake;

    state.screenShake = 0;
    enemies = [{ x: 640, y: 380, hp: 10, maxHp: 10, reward: 5, type: 'basic', pathIdx: pathNodes.length - 1, speed: 1 }];
    processCombat(1);
    const leakShake = state.screenShake;

    state.screenShake = 0;
    const c4Def = TOWER_DEFS[7] || Object.values(TOWER_DEFS).find(def => def && def.tactical === 'c4');
    const dummyC4 = { x: 500, y: 300, level: 3, armed: true, range: 100, splash: 100, jamMult: 0.35 };
    enemies = [{ x: 500, y: 300, hp: 10, maxHp: 10, reward: 5, type: 'basic', pathIdx: 0, speed: 1 }];
    triggerTactical(dummyC4, c4Def);
    const c4Shake = state.screenShake;

    state.screenShake = 0;
    enemies = [{ x: 500, y: 300, hp: 0, maxHp: 100, reward: 50, type: 'boss', pathIdx: 0, speed: 0.5 }];
    processCombat(1);
    const bossKillShake = state.screenShake;

    enemies = [];
    return { castleColors: set.size, nonBossKillShake, leakShake, c4Shake, bossKillShake };
  });

  assert(checks.castleColors >= 20, 'castle in the middle should be richly detailed: ' + checks.castleColors + ' colors');
  assert.equal(checks.nonBossKillShake, 0, 'non-boss kill must not trigger screen shake');
  assert.equal(checks.leakShake, 0, 'base leaks must not trigger screen shake');
  assert.equal(checks.c4Shake, 0, 'tactical explosions must not trigger screen shake');
  assert(checks.bossKillShake > 0, 'boss kill must trigger screen shake: ' + checks.bossKillShake);

  // verify start menu sequence options and 4 board layout variations
  const menuChecks = await page.evaluate(() => {
    const layoutCount = typeof BOARD_LAYOUTS !== 'undefined' ? BOARD_LAYOUTS.length : 0;
    const names = BOARD_LAYOUTS.map(l => l.name);
    const initialNodes = pathNodes.length;

    // test switching to Dragon S-Curves (layout index 1)
    selectBoardLayout(1);
    const layout1Nodes = pathNodes.length;
    const layout1FirstX = pathNodes[0].x;
    const layout1LastX = pathNodes[pathNodes.length - 1].x;
    const layout1LastY = pathNodes[pathNodes.length - 1].y;

    // test switching to Iron Citadel Coils (layout index 2)
    selectBoardLayout(2);
    const layout2Nodes = pathNodes.length;

    // test switching to Valley of Knights (layout index 3)
    selectBoardLayout(3);
    const layout3Nodes = pathNodes.length;

    // test switching back to default Royal Spiral (index 0)
    selectBoardLayout(0);
    const defaultNodes = pathNodes.length;

    // test difficulty selection
    selectDifficulty('paladin');
    const paladinDiff = GAME_CONFIG.difficulty;
    selectDifficulty('cadet');
    const cadetDiff = GAME_CONFIG.difficulty;

    // test game mode selection
    selectGameMode('arsenal');
    const arsenalMode = GAME_CONFIG.mode;
    selectGameMode('standard');

    return {
      layoutCount,
      names,
      initialNodes,
      layout1Nodes,
      layout1FirstX,
      layout1LastX,
      layout1LastY,
      layout2Nodes,
      layout3Nodes,
      defaultNodes,
      paladinDiff,
      cadetDiff,
      arsenalMode
    };
  });

  assert.equal(menuChecks.layoutCount, 4, 'must provide 4 board layout variations (classic + 3 new)');
  assert.deepEqual(menuChecks.names, ['Royal Spiral', 'Dragon S-Curves', 'Iron Citadel Coils', 'Valley of Knights']);
  assert.equal(menuChecks.layout1LastX, 640, 'layout 1 must converge at the center castle core');
  assert.equal(menuChecks.layout1LastY, 380, 'layout 1 must converge at the center castle core');
  assert.equal(menuChecks.paladinDiff, 'paladin', 'difficulty selection must update config');
  assert.equal(menuChecks.cadetDiff, 'cadet', 'difficulty reset must update config');
  assert.equal(menuChecks.arsenalMode, 'arsenal', 'game mode selection must update config');

  if (SHOTS) {
    await page.evaluate(() => {
      towers = []; let i = 0;
      for (let lvl = 1; lvl <= 5; lvl++) for (let type = 0; type <= 6; type++) {
        const def = TOWER_DEFS[type];
        towers.push({ x: 180 + type * 150, y: 70 + lvl * 120, type, level: lvl, angle: 0, cooldown: 1e9, damage: 0, range: def.range, fireRate: 1e9, splash: 0, targetMode: 0 });
      }
      state.selectedTower = towers[34]; updateUI();
    });
    await page.waitForTimeout(300);
    await page.locator('#game-canvas').screenshot({ path: path.join(SHOTS, 'qtd-tiers.png') });
    await page.screenshot({ path: path.join(SHOTS, 'qtd-desktop.png') });
  }
  await page.close();

  // ---- tablet/phone: touch drag-and-drop and tap-to-place ----
  const ctx = await b.newContext({ viewport: { width: 915, height: 412 }, hasTouch: true, isMobile: true, deviceScaleFactor: 2 });
  const m = await ctx.newPage(); m.on('pageerror', e => errors.push(e.message));
  await m.goto(URL); await m.waitForTimeout(600);
  await m.tap('#overlay-btn'); await m.evaluate(() => { state.gold = 1e6; updateUI(); });
  const cdp = await ctx.newCDPSession(m);
  const touch = (type, x, y) => cdp.send('Input.dispatchTouchEvent', { type, touchPoints: type === 'touchEnd' ? [] : [{ x, y }] });

  const mSpot = await freeSpot(m, 0), lift = await m.evaluate(() => qtdLift()), mTarget = await toClient(m, { x: mSpot.x, y: mSpot.y + lift }); // finger sits below the lifted tower
  const mBtn = await m.locator('.shop-btn[data-type="0"]').boundingBox();
  const sx = mBtn.x + mBtn.width / 2, sy = mBtn.y + mBtn.height / 2;
  await touch('touchStart', sx, sy);
  for (let i = 1; i <= 15; i++) await touch('touchMove', sx + (mTarget.x - sx) * i / 15, sy + (mTarget.y - sy) * i / 15);
  const ghost = await m.evaluate(() => ({ active: pointer.active, sel: state.selectedShopType }));
  await touch('touchEnd');
  await m.waitForTimeout(150);
  const placed = await m.evaluate(() => towers.map(t => ({ type: t.type, x: Math.round(t.x), y: Math.round(t.y) })));
  assert(ghost.active && ghost.sel === 0, 'tower ghost follows the finger while dragging: ' + JSON.stringify(ghost));
  assert.equal(placed.length, 1, 'touch drag-and-drop should place a tower: ' + JSON.stringify(placed));
  assert(Math.abs(placed[0].y - mSpot.y) < 6, 'tower lands above the finger: ' + JSON.stringify({ placed, mSpot }));

  // tap shop, tap board
  const tSpot = await freeSpot(m, 3), tTarget = await toClient(m, tSpot);
  await m.tap('.shop-btn[data-type="3"]'); await m.touchscreen.tap(tTarget.x, tTarget.y); await m.waitForTimeout(150);
  const tapState = await m.evaluate(() => ({ towers: towers.map(t => [t.type, Math.round(t.x), Math.round(t.y)]), sel: state.selectedShopType, fct: fcts.map(f => f.text) }));
  assert.equal(tapState.towers.length, 2, 'tap-to-place should still work on touch: ' + JSON.stringify({ tapState, tSpot, tTarget }));
  // tapping a tower opens its upgrade panel
  await m.touchscreen.tap(tTarget.x, tTarget.y); await m.waitForTimeout(100);
  assert.equal(await m.evaluate(() => state.selectedTower && state.selectedTower.type), 3, 'tapping a tower selects it');
  if (SHOTS) await m.screenshot({ path: path.join(SHOTS, 'qtd-phone.png') });
  await ctx.close(); await b.close();

  assert.deepEqual(errors, [], 'page errors: ' + errors.join(' | '));
  console.log('PASS qtd: drawn towers grow over 5 levels (C4 7), 12 visible projectile types fire at 8x, chrome hidden, mouse + touch drag-and-drop, tap-to-place');
})().catch(e => { console.error(e.message); process.exit(1); });
