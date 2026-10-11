# 🗓️ Changelog

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
- Two more upgrades for every tower: levels 4 (Champion) and 5 (Legend) add damage, range, speed and an extra shot each. C4 goes to level 7 (Seismic, Doomsday).
- Every tower fires a projectile you can see: fireballs, tumbling boulders, water drops, ice shards, wind swirls, magnet orbs, electric bolts and tracer bullets, plus muzzle flashes and impact streaks that stay visible at 16x/32x speed.
- Always fullscreen and game-only: fills the screen, enters fullscreen on the first tap (and again after an accidental exit), keeps the screen awake, hides the KidHub/Practice buttons, and slims the bars on landscape phones.
- Drag and drop on phones and tablets (towers ride above the finger so they stay visible), plus tap-to-place and mouse drag.
- Eight more improvements: green/red placement preview, range ring on the selected tower, level pips, next-tier name and price on the upgrade button, keyboard shortcuts (1–7, Space, U, T, P, Esc), auto-pause when the app is hidden, haptic buzz on place/upgrade, and multi-shot volleys that no longer fire from sold towers or at defeated enemies.

**Dashboard Recent menu** (`index.html`, `dashboard-shell.js`, `portal.js`, `src/zzzzz-recents.html`)
- The three most recently used apps (applications, activities, toolbox tools, arcade games) sit in the sidebar between Applications and Resources, using the library's existing recent list. Studio screens count only when a child opens them, not on deep links or restores.

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
