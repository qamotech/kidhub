# 🗓️ Changelog

## 2026-10-21 00:05 — Solid glass, shadow tokens, list markers & notch-safe Library

- **Style:** If the device is set to reduce transparency, the studio and the Library swap frosted-glass blur for solid surfaces, so text over panels stays crisp.
- **Organization:** Library shadows come from two `portal.css` tokens (`--p-shadow` at rest, `--p-shadow-lg` on hover), so cards and feature panels sit on one consistent shadow.
- **Style:** Bullets and numbers in lists take the theme color in the studio and the Library (seasonal themes recolor them too).
- **UI:** On notched phones turned sideways, the Library page and its header stay clear of rounded corners and the camera cut-out.

## 2026-10-20 23:10 — Underlines, readable tables & spacing tokens

- **Style:** Text links in the studio and the Library get an underline that sits clear of letters like g and y and thickens on hover (buttons and pills are unchanged).
- **UI:** The Library's tables (backup guide, entry points) have a tinted header row and soft striped rows, so long rows are easier to follow; seasonal themes recolor them too.
- **UI:** The studio keeps room for its scrollbar, so opening a panel that locks scrolling no longer nudges the page sideways.
- **Organization:** Library spacing comes from two `portal.css` tokens (`--p-gap` 8px, `--p-gap-lg` 14px) shared by tabs, toolbars, action rows, labels and the card grid.

## 2026-10-20 22:50 — Contained scrolling, dark native controls & clear disabled states

- **UI:** Scrolling to the end of a side panel, the cloud panel, paint toolbars or the music grid no longer drags the whole page along with it (the Library's wide tables too).
- **Style:** In the dark Halloween, Thanksgiving and Christmas themes, the Library's date pickers, dropdown lists and scrollbars turn dark to match instead of flashing bright white.
- **UI:** Unavailable Library buttons and fields look dimmed, show a "not allowed" pointer and no longer light up on hover.
- **Organization:** The README's "🏗️ Project structure" table now lists `src/` modules, `build.py`, `resources.html`/`portal.css`, `games/`, `tools/` and the `test-*.cjs` suites.

## 2026-10-20 22:40 — Readable hints, tappable sections & print-ready pages

- **Style:** Placeholder hints in text boxes use the theme's muted ink (in the studio and the Library), so they stay readable in dark and seasonal themes instead of faint browser grey.
- **UI:** Every collapsible section header ("details" summary, including Music's) is now a 44px tap target with a pointer cursor, so it's obvious it can be opened.
- **UI:** Printing a page leaves out the floating cloud and back-to-top buttons, toasts and sky effects, prints on plain white, and keeps each card on one page.
- **Organization:** The README's "♿ Comfort settings" section now explains printing.

## 2026-10-20 22:10 — Snappy taps, phone fit & jump glow

- **UI:** Buttons, links, cards and pills respond to taps right away on phones and tablets (no double-tap-zoom delay), and the grey tap flash is gone because buttons already sink when pressed.
- **UI:** On phones, long words and links wrap inside cards, empty states and toasts instead of pushing the page sideways, and turning the phone sideways no longer inflates the text size.
- **Style:** When a link jumps to a card or heading, it glows once in the theme color so you can see where you landed (in the studio and the Library; off with reduced motion).
- **Organization:** Library motion comes from two `portal.css` tokens (`--p-dur`, `--p-ease`), so card lifts and the new jump glow share one timing and easing curve.

## 2026-10-20 21:30 — Radius tokens, highlights & scrollbars

- **Organization:** Library corner radii come from two `portal.css` tokens (`--p-r` 12px, `--p-r-lg` 18px) instead of five hand-typed sizes, so cards, fields, notes and panels match.
- **Style:** Selecting text in the studio or the Library highlights it in the theme color with white text instead of the browser's default blue.
- **Style:** Page scrollbars (and the Library's wide-table scrollers) take a soft theme tint; seasonal themes keep their own colors.
- **UI:** Jump links and deep links stop 16px below the top edge, so the heading you jumped to isn't jammed against the screen edge.

## 2026-10-20 21:05 — Press feedback & steady numbers

- **UI:** Buttons, pills, tools and round icon buttons sink slightly while pressed, so taps feel answered; hover lifts still work and the effect turns off with reduced motion.
- **Style:** Checkboxes, sliders, radio buttons and the typing cursor take the theme's accent color (and the seasonal color in Halloween, Thanksgiving and Christmas) instead of the browser's default blue.
- **Style:** Scores, timers, the adventure count and stats use equal-width digits, so numbers no longer jiggle as they change.
- **UI:** Unavailable buttons and fields show a "not allowed" pointer, and anything marked busy shows a "working" pointer.

## 2026-10-20 20:45 — Comfort modes & docs map

- **Style:** If the device is set to reduce motion, KidHub now stops animations, transitions and smooth scrolling automatically, just like the in-app Reduce motion switch (which also stops looping animations now).
- **Style:** If the device is set to increase contrast, card borders turn thicker and darker, matching the in-app High contrast switch.
- **Style:** Windows High Contrast (forced colors) keeps cards, pills and buttons outlined, uses the system highlight color for the keyboard focus ring, and hides the dark-theme dim layer and seasonal sky effects.
- **Organization:** The README starts with an "On this page" quick-nav and has a new "♿ Comfort settings" section explaining these modes.

## 2026-10-20 19:58 — Library focus, hover & skip link

- **Style:** The Library's keyboard focus ring comes from a `--p-focus` token, so it shows as bright gold on the dark Halloween, Thanksgiving and Christmas themes instead of a dim purple.
- **Style:** Library buttons darken their own theme color on hover (no more purple flash in seasonal themes), and cards lift gently on hover or keyboard focus; the lift turns off with reduced motion.
- **Organization:** The "Open …" buttons on Library cards are styled by `portal.css` (`.kh-portal a.primary`, 44px tall) instead of an inline style repeated on all 115 cards.
- **UI:** `resources.html` starts with a "Skip to content" link that appears on Tab and jumps straight to the library without changing the page section.

## 2026-10-20 19:29 — Touch, tokens & tidy empty states

- **UI:** Round icon buttons, phone-sized top pills, Library tabs and the "new KidHub is ready" Refresh button are now at least 44px tall, so they're easy to tap.
- **Style:** Empty lists ("Your latest activities will appear here", saved art) show as a soft dashed card with a ✨ instead of tiny grey text.
- **Style:** Headings balance their line breaks and paragraphs avoid a lonely last word.
- **Organization:** `portal.css` colors now come from `--p-*` tokens (link, line, field, muted), so the Halloween, Thanksgiving and Christmas themes recolor Library cards, buttons, inputs, tabs, notes and tables instead of leaving them white.

## 2026-10-12 — Project: Shadow Chassis (new arcade game)

- **🤖 Project: Shadow Chassis** (`games/shadow-chassis.html`): single-file Midnight Mecha action-ARPG, all graphics and audio generated in code. Swap between the **Shinobi** bipedal rig (3-stage HF blade combo with a 120 ms deflect window, thermal shurikens that bounce and embed, phase dash with decoy, optical cloak 3x crit) and the **Cruiser** (drift physics at 2.5x speed, ramming, rotary autocannons with heat, 4-target micro-torpedo swarm).
- Hound packs, shielded Vanguards, Siege Mortar Crawlers, Sniper Valkyries, then the **Goliath-01** two-phase boss (EMP floor grid, armor jettison, ram charges). Four sectors with blast doors, severable power conduits, coolant tanks and fuel cells; salvage terminal offers 3 hardware upgrades after each sector.
- Fixed-step 60 Hz loop, spatial-hash collisions, high-DPI canvas, procedural Web Audio SFX and a tactical soundtrack; pause menu has volume and screen-shake sliders. Immersive like Tower Defense (own back-to-KidHub and fullscreen buttons, shared chrome hidden). Keyboard + mouse.
- Registered in `games/games.json`, practice-kit goals (`tools/practice_kits.py`), and the immersive lists in `test-games.cjs` / `test-adventures.cjs`.

## 2026-10-12 — Cloud messages ask for the address + audit fixes

**Cloud messages** (`src/cloud.html`, popup in `src/zzzzzz-announce.html`)
- The message screen asks for the email address to send to and remembers it on that device; nothing is built in. A one-time cleanup clears the short-lived shared Mom/Dad default. Each address gets one email even if several contacts share it, and messages waiting for FormSubmit activation are no longer sent twice (FormSubmit delivers them after the Activate click).
- Popup re-shown once with accurate wording, read fully by screen readers, and always opens in the dashboard (never trapped inside the KidHub frame on a slow first load). README and PRIVACY updated.

**Tower Defense**
- Shots no longer overshoot at high game speeds (hit rate at 8x went from ~0 to normal). Fire tower level 4 now gains its extra shot.
- ⬅️ back to KidHub and ⛶ fullscreen buttons in the game bar; leaving fullscreen on purpose is respected; "turn your device sideways" screen for phones held upright.
- Space/Enter no longer hijack focused buttons and don't start waves while paused; delayed volley shots stop while paused; effects and floating text are capped and glow is dropped when the sky is full.
- Touch drags lift the tower a fixed 64 screen pixels; the Prime Bomb is aimed (tap or drag to a spot) instead of firing at the centre; C4 levels 6–7 cost less and show their own blast names.

**Menu**: arcade "🎲 Random game" works inside the dashboard; Random game and Toolbox "Surprise me" count as recent; the KidHub button no longer takes a Recent slot; categories stay in the URL and highlight when changed inside the library or when KidsBeat/Mathcore/Stix is open; focus stays on Recent items; "Open KidHub directly" hides when it should; section headings for screen readers; phone menu shows Recent items after the main links.

**Reliability**: the service worker fetches scripts/styles fresh (cache only offline), so a new deploy can't run with old dashboard code; `npm run import:games` keeps games without an N8DEV source (NeuroPulse); README counts updated (114 entries, 14 games, 22 suites).


## 2026-10-11 — Organized menu + cloud messages popup

- **Main menu**: 🕘 Recent sits at the top (last 3 apps used). 🚀 Applications now has 🎮 KidHub followed by category links that open the library already filtered: 📚 Learn, 🎨 Create, 🎲 Play, 💚 Wellbeing, 🧰 Helpers and 🗂️ All applications, each with a live count. The open category is highlighted, the filter is kept in the URL (`#library=applications&category=Play`), and every menu item has an emoji.
- **"Cloud messages work now!" popup** (`src/zzzzzz-announce.html`): shown once per browser in the dashboard (or in KidHub when opened on its own). "☁️ Try it now" opens the Cloud panel, "Got it" or Esc dismisses it for good. Automated test browsers skip it; `test-announce.cjs` turns it back on.
- **NeuroPulse practice kit loads**: its Content-Security-Policy blocked the shared `activity-kit.js`; `script-src` now allows `'self'`.
- Tests updated for the new menu (`test-recents`, `test-resources`, `test-adventures`); `test-adventures` allows immersive games that hide the practice button.
- **Cloud messages reach the family inbox out of the box**: Mom and Dad default to the family email in `src/cloud.html` (existing contacts without an email get it too; an address a grown-up clears stays cleared).
- Test hardening: tests block FormSubmit so a run can never email the real inbox (`test-cloud-arcade`), the email test waits for the back-online retry before counting sends, and the Toolbox search check waits for the debounced filter (`test-plus`).

## 2026-10-11 — KidsBeat Interactive Piano Roll & 24 Songs Library

- Streamlined KidsBeat from a complex multi-track DAW into an intuitive, kid-friendly interactive piano roll with vertical falling notes (Synthesia-style).
- 24 complete, accurately transcribed songs across Nursery, Folk, and Classical categories (e.g. Twinkle Twinkle, Mary Had a Little Lamb, Ode to Joy, Happy Birthday, Canon in D, Fur Elise).
- 4 interactive play modes: "Guide Me" (Wait-for-Me note learning with glowing keys and star rewards), "Listen & Watch" (automatic demo playback), "Play Along" (arcade rhythm game with hit scoring), and "Free Play".
- 6 instrument synthesizers (Grand Piano, Magic Music Box, Wooden Marimba, 8-Bit Chiptune, Soft Flute, Toy Brass) and 3 drum backing beats.
- Accessible pitch labels (Letters, Numbers, Solfège), adjustable tempo (Slow, Normal, Fast), responsive QWERTY keyboard mapping, and touch support.

## 2026-10-11 — Tower Defense makeover + Recent menu

Shipped inside the NeuroPulse commit (`68ef5a5`); recorded here so the work is findable.

**Qamelot Tower Defense** (`games/qamelot-tower-defense.html`)
- Real tower art again: the old image files were never in the repo, so every tower fell back to a coloured circle. Towers are now drawn in code and change with each upgrade: wooden hut → stone keep → battlements → gold-trimmed Champion with banners → crowned Legend with orbiting sparks. Each element has its own crown (tesla coil, brazier, boulders, fountain, ice crystals, windmill, magnet); gun towers get an upgrading mount.
- Two more upgrades for every tower: levels 4 (Champion) and 5 (Legend) add damage, range and an extra shot each (and speed, except the Ice tower). C4 goes to level 7 (Seismic, Doomsday); C4 and Flashbang keep their charge artwork at every level.
- Every shooting tower fires a projectile you can see (C4 and Flashbang are path charges that explode instead): fireballs, tumbling boulders, water drops, ice shards, wind swirls, magnet orbs, electric bolts and tracer bullets, plus muzzle flashes and impact streaks that stay visible at 16x/32x speed.
- Always fullscreen and game-only: fills the screen, enters fullscreen on the first tap (and again after an accidental exit), keeps the screen awake, hides the KidHub/Practice buttons, and slims the bars on landscape phones.
- Drag and drop on phones and tablets (towers ride above the finger so they stay visible), plus tap-to-place and mouse drag.
- Eight more improvements: green/red placement preview, range ring on the selected tower, level pips, next-tier name and price on the upgrade button, keyboard shortcuts (1–7, Space, U, T, P, Esc), auto-pause when the app is hidden, haptic buzz on place/upgrade, and multi-shot volleys that no longer fire from sold towers or at defeated enemies.

**Dashboard Recent menu** (`index.html`, `dashboard-shell.js`, `portal.js`, `src/zzzzz-recents.html`)
- The three most recently used apps (applications, activities, toolbox tools, arcade games) sit in the sidebar (now at the top, above Applications), using the library's existing recent list. Studio screens count only when a child opens them, not on deep links or restores.

Tests: `test-qtd.cjs`, `test-recents.cjs`; `test-games.cjs` allows games that hide the KidHub chrome on purpose.

## 2026-10-11 — NeuroPulse Cyberdeck

- Added NeuroPulse Cyberdeck (`games/neuropulse.html`) to the KidHub Arcade and application catalog (114 verified entries).
- Full studio-grade polyphonic dual-oscillator synthesizer, analog drum machine, 16-step polyrhythmic matrix sequencer, and audio-reactive 3D holographic vector/particle engine with 6 visualization modes and lossless 16-bit WAV export.
- Included KidHub fullscreen navigation chrome and custom practice kit companion with tailored experimentation goals.

## 2026-10-10 — Seasonal Swap (40 holiday edits)

New `src/seasons.html` module: 40 decoration slots (logo, subtitle, greeting, banner, countdown, falling particles, cursor trail, click bursts, garland, corners, hidden-item hunt + badge, art stickers/prompts/palette, catch + memory collections, jokes, mascot tune, tips, colors, footer, confetti, sky, ground and more) refilled automatically by date: Halloween (Oct) → Thanksgiving (Nov) → Christmas (Dec 1–26) → New Year → Valentine's → St. Patrick's → Spring → Garden → Summer → Fireworks → Late Summer → Back to School. Settings has a season picker (Auto / any season / Off). Respects reduced motion. Test: `test-seasons.cjs`.

## 2026-10-01 — Complete Applications & Resources

- Completed the searchable 113-entry library, guides, six printables, planner, backup/import, help, privacy and developer pages; verified all 96 core/tool routes and companion drawing/export.
- Matched catalog counts to the current 13-game manifest and retained the pending N8 SHIFT replacement.
- Preserved keyboard focus after favorites and planner changes; rejected malformed imports, confirmed replacement, and surfaced storage failures.
- Installed offline support from the dashboard/library; retained cache writes and asset refreshes, handled server failures, and showed an explicit uncached-page fallback.
- Made normal builds local and reproducible with content-based cache versions; isolated sibling-source game import as an optional command.
- Fixed duplicate fullscreen requests and duplicate successful webhook delivery during email retries; made activation manual and partial delivery explicit.
- Added a self-contained test runner and reliability checks using intercepted messaging requests; updated data-handling documentation.

## 2026-09-30 — Every activity expansion

Added 18 guided trails, separate journals for all 80 tools, 14 arcade practice companions, and three embedded-app practice companions. Expanded stories, spelling, coding, math, memory, catching, music sequencing, and storybook capacity. Added practice questions, a rhythm builder, an imagination mixer, and an SVG quilt export. Preserved saved eight-step songs during migration and made memory restart timers safe.


## 2026-09-29 — PopStorm: Glow Guardians
- New featured Arcade game: PopStorm (3,090-line single-file roguelite for ages 8+).
- Motion polish: gated hovers, transform-based bars, stacked toasts, and a reduced-motion default.

## 2026-09-29 — Beats, themes & polish
- Beat Coach: auto-fix sequencer, cohesive melody tuning, auto-tune, live drum recording, 2–4 octave keyboard, octaves 0–7.
- 8 working themes with dark-mode dimming; the cloud widget menu now fits every screen.
- 40 improvements: routing, offline service worker, manifest, a11y, performance.
- Arcade (13 games), KidsBeat 24-instrument engine, Cloud widget, friendly voice, KidHub rename.

## 2026-09-28 — KidHub Plus
- Added Toolbox with 80 tools across 8 categories.
- Added 80 features, including 10 activities that replace the loading placeholders.
- Added 10 badges, integrated with the existing badge shelf and certificate.
- 80 improvements (listed in-app): accessibility, performance, robustness, and validation.

## Art Studio expansion — 2026-09-28

### ✨ Added

Sixteen feature groups: custom colors, four palettes, opacity, brush tips, stroke patterns, rainbow ink, filled shapes, triangles, text placement, font choices, eyedropper, four sticker collections, custom paper, scene starters, local image import, and canvas transforms.

### 🛠️ Improved

Pointer capture, cancellation handling, single-click brush marks, undo restoration context, responsive controls, visible focus styling, import error feedback, and a desktop tool panel that scrolls alongside the canvas.

### 📚 Documented

Setup, feature guide, creative exercises, storage behavior, privacy, security scope, contribution workflow, test coverage, and inherited limitations.
