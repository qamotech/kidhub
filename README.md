# 🚀🎨 KidHub — Play, Make & Learn

🌐 **[Open KidHub](https://qamotech.github.io/kidhub/)** · 🎨 **[Open the studio directly](https://qamotech.github.io/kidhub/studio.html)**

**A colorful browser activity hub with an expanded Art Studio for drawing, storytelling, and creative exploration.** Open one HTML file, choose Art Studio, and start making something imaginative. The application is self-contained HTML, CSS, and JavaScript; there is no build step or application server.

## 🧰 KidHub Plus — 80 tools, 80 features, 10 badges, 80 improvements

Open **🧰 Toolbox** from the hub (or press **T**, or link straight to a tool with `#tool=<id>`, e.g. `studio.html#tool=piano`).

| Category | Tools |
|---|---|
| ➗ Math | Addition, Subtraction, Multiplication and Division quizzes, Times Table Viewer, Number Line Jumper, Even or Odd, Skip Counter, Fraction Pizza, Place Value |
| 🔤 Words | Rhyme Finder, Syllable Clapper, Word Scramble, Alphabet Explorer, Sight Word Cards, Word Mirror, Story Starter, Compound Builder, Opposites Quiz, Vowel Counter |
| 🔬 Science | Planet Facts, Animal Habitats, Solid/Liquid/Gas, My Body, Plant Grower, Weather Wardrobe, Magnet Sorter, Moon Phases, Sink or Float, Five Senses |
| ⏰ Time & Money | Clock Reader, Stopwatch, Countdown, What Day Was It, Coin Counter, Change Maker, Age Calculator, Days Until, Seasons, Piggy Bank Goal |
| 🎨 Art & Music | Color Mixer, Palette Generator, Pattern Maker, Metronome, Mini Piano, Drum Pads, Emoji Mosaic, Spiral Art, Shape Namer, Rhythm Echo |
| 🎲 Games | Dice, Coin Flip, Choice Spinner, Rock Paper Scissors, Number Guess, Color Echo, Tic-Tac-Toe, Whack-a-Mole, Reaction Timer, Guess the Word |
| 💚 Feel Good | Breathing Bubble, Feelings Check-in, Gratitude Jar, Kindness Ideas, Stretch Break, Water Tracker, Bedtime Routine, Calm Sounds, Brave Words, Chore Chart |
| 🧭 Helpers | Length, Temperature and Weight converters, Team Picker, Name Picker, Tally Counter, To-Do List, Secret Code, Morse Code, Binary Numbers |

**10 activities are now fully playable.** They used to show "Loading activity…": Code Logic (robot programming, 5 levels), Space Explorer, Dino Dig, Shapes Puzzle (sliding 8-puzzle), Farm Friends, Coloring Book, Word Spelling, Telling Time, Music Maker (8-step sequencer) and Storybook Creator.

**10 new badges:** 🧰 Tool Tinkerer · 🧭 Tool Explorer · 🛠️ Master Maker · 👑 Toolbox Legend · 🔥 Brain Blaze · 🤖 Robot Coder · 🧩 Puzzle Pro · 🦴 Fossil Finder · ✍️ Storybook Author · 🧘 Calm Champion.

The full lists of the 80 features and 80 improvements are in the app under **Toolbox → ✨ What's new**. Toolbox progress is stored locally under `kidHubPlus`. You can export and import it from **Toolbox settings**.

Tests: `node test.cjs` (Art Studio) and `node test-plus.cjs` (all 80 tools, 10 activities, badges, mobile overflow). Both need Playwright with Microsoft Edge.

## 🆕 Latest release

- 🕹️ **Arcade:** 13 full-screen games in `games/`. Each game keeps only the game, plus one ⬅️ KidHub link and a ⛶ Fullscreen button (`python tools/import_games.py` regenerates them).
- 🎹 **KidsBeat instruments:** 24 mastered instruments (drums, world percussion, piano, guitar, brass, flute, synths, fun sounds) power the whole Music Lab.
- 🧑‍🏫 **Beat Coach:** auto-fix groove, 7 smart genre grooves, fills, remix, undo, live drum recording (keys 1–6), accents, humanize, auto-bass, kit and mix, a 16-step melody lane that stays in key, "Make it cohesive" melody tuning, auto-tune, a 2–4 octave keyboard (octaves 0–7), and a star rating with tips.
- 🖌️ **Paint Pro:** 48 Paint-style tools and a full color editor. 🧰 **Toolbox:** 80 tools. 🌄 **Parallax worlds** on the hub.
- ☁️ **Cloud widget** (bottom-left): parent-configured webhook messages (Discord, Slack, ntfy or generic JSON over https), reminders, voice typing, SOS, offline outbox, quiet hours and a PIN lock. Nothing is sent until a grown-up adds a webhook.
- 🎨 **8 themes** (Sunny, Space, Ocean, Candy, Forest, Sunset, Midnight, Arctic). Dark themes gently dim the page.
- 🗣️ **Friendly voice:** natural female or cartoon-style read-aloud with a picker in Settings.
- ✨ **40 improvements:** deep links and Back button, offline service worker with an update prompt, installable app, accessibility and performance polish (full list in Settings → What's new).

**Develop:** `npm install`, `npm run build`, then `npm test` (12 Playwright suites, Edge). Edit `src/*.html` modules; `build.py` injects them into `studio.html` and the dashboard.

## ✨🎨 The 16 new Art Studio features

| # | Feature | What you can do |
|---|---|---|
| 1 | 🎨 Custom color | Choose any RGB color with the native color picker. |
| 2 | 🌈 Curated palettes | Switch between Bright, Pastel, Earth, and Ocean collections. |
| 3 | 🫧 Opacity | Adjust drawing opacity from 10% to 100%, with a live readout. |
| 4 | 🖌️ Brush tips | Choose round or square stroke caps. |
| 5 | ➖ Stroke patterns | Draw solid, dashed, or dotted strokes. |
| 6 | 🌈 Rainbow ink | Cycle through hues as you move the brush. |
| 7 | 🟪 Filled shapes | Fill boxes, ellipses, and triangles with the current ink. |
| 8 | 🔺 Triangle tool | Drag to create triangles, including mirrored triangles. |
| 9 | 🔤 Text placement | Enter up to 100 characters, then click the canvas to place them. |
| 10 | 📚 Letter styles | Choose friendly sans, storybook serif, or robot monospace. |
| 11 | 🔎 Eyedropper | Sample a canvas pixel to set your drawing color. |
| 12 | 🐬 Sticker library | Explore 32 stickers across Space, Nature, Animals, and Food. |
| 13 | 📄 Custom paper | Replace the canvas with any chosen paper color. Undo is available. |
| 14 | 🏞️ Scene starters | Start with rolling hills, an underwater scene, or three comic panels. |
| 15 | 🖼️ Image import | Fit a local PNG, JPEG, or WebP onto the canvas; files are limited to 10 MB. |
| 16 | 🔄 Canvas transforms | Flip the entire artwork horizontally or rotate it 180°. |

### 🧰 Existing studio essentials

Brush, eraser, stamps, lines, rectangles, ellipses, mirror drawing, brush sizes, background presets, creative prompts, undo/redo, a small local gallery, and full-size PNG download remain available. The canvas is 900 × 560 pixels. Undo retains up to 16 snapshots. Paper and scene starters replace the current picture; imports overlay a fitted image. Export important work before closing the page.

## 🚀 Quick start

1. Download or clone this repository.
2. Open `index.html` for the full dashboard, or `studio.html` for the direct KidHub activity hub.
3. Choose **🎨 Art Studio** from the activity hub.
4. Pick a tool and drag on the canvas. Text and stickers are placed with a click.
5. Use **↓ PNG** to save your full-resolution artwork.

For a stable browser storage origin, serve the directory locally:

```sh
python -m http.server 8000
```

Then visit `http://localhost:8000`. No package installation is required to use the app. Google Fonts are requested when online; system fonts are available as fallbacks.

## 🧑‍🎨 Creative mini-projects

- 🌊 **Ocean postcard:** choose the underwater starter, Ocean palette, animal stickers, and a text greeting.
- 🌻 **Garden explorer:** choose rolling hills, Nature stickers, pastel colors, and dotted paths.
- 📖 **Three-panel story:** choose comic panels; draw a beginning, middle, and ending; add serif captions.
- 🤖 **Robot blueprint:** use square tips, dashed lines, triangles, and monospace labels.
- 🪞 **Symmetry challenge:** turn on the existing mirror switch and build a butterfly with filled shapes.
- 🖼️ **Picture remix:** import a local image, add stickers and a caption, then download the result.

## 🧭 More activities in the hub

The inherited hub includes entry points for Catch the Stars, Story Garden, Music Lab, Math Mission, Memory Match, Code Logic, Space Explorer, Dino Dig, Shapes Puzzle, Farm Friends, Coloring Book, Word Spelling, Telling Time, Music Maker, and Storybook Creator. This release focuses on Art Studio; those other activities have not received a complete functional audit.

## 💾 Privacy & storage

- 🏠 Profile, progress, and gallery state use browser local storage under `kidHubV3`.
- 🖼️ Imported images are decoded in the browser; the new import feature does not upload them.
- 📦 The existing gallery keeps three reduced-size JPEG previews, not editable full-resolution projects.
- 🧹 Clearing browser data can remove saved progress. Different browser profiles and origins have separate storage.
- 🌐 Google Fonts requests contact an external service. This is not a completely network-free page.
- 💬 Existing “Quick Connect” messaging is simulated UI, not a real communication service.
- 👪 Existing parent controls are convenience controls, not authenticated access protection.

See [PRIVACY.md](PRIVACY.md) for details.

## 🏗️ Project structure

| File | Purpose |
|---|---|
| `index.html` | Multi-app dashboard with the enhanced KidHub app embedded |
| `studio.html` | Direct standalone KidHub activity hub and Art Studio |
| `test.cjs` | Playwright regression checks for the expanded Art Studio |
| `studio-desktop.png` / `studio-mobile.png` | Screenshots captured during browser verification |
| `CHANGELOG.md` | Release scope and behavior changes |
| `CONTRIBUTING.md` | Development and validation expectations |
| `PRIVACY.md` | Storage, external resources, and data handling |
| `SECURITY.md` | Security reporting and scope |

## 🧪 Validation

The regression script uses Node.js, Playwright, and installed Microsoft Edge:

```sh
npm install --no-save playwright
node test.cjs
```

It checks inline JavaScript syntax, drawing, all 16 new feature groups, undo/redo, image import, PNG download, transform reversibility, and layout at 1440px and 390px widths. It fails on page JavaScript errors. Screenshots are written in the project directory. Touch hardware, all browsers, assistive technology, and every inherited activity are outside this test's coverage.

## ⚠️ Practical limits

The canvas is a raster image rather than a layered editor. Text and stickers become pixels after placement. Emoji appearance varies by operating system. Opacity is applied per stroke segment and can build up at overlaps. Browser storage may be unavailable or full. Downloading PNG is the recommended durable backup. No software license was added because redistribution rights for the inherited source have not been established.

## 🤝 Contributing & support

Read [CONTRIBUTING.md](CONTRIBUTING.md). Reports should include browser version, screen size, reproducible steps, and expected versus actual behavior. Avoid including children's personal information or private artwork in public reports.

## 🌐 GitHub Pages & optimization

The public repository publishes from `main` at `/` with HTTPS enforced. `.nojekyll` keeps the site a direct static deployment. The canonical URL, social preview metadata, sitemap, and robots file identify the public entry points. The full dashboard preserves the additional embedded apps from the upstream update; `studio.html` avoids loading those extra apps when you only need KidHub.

Art Studio history now stores bounded pixel snapshots instead of PNG-encoding the canvas before every stroke. Undo/redo restores synchronously, avoiding asynchronous image-load races. Decorative studio animation pauses in hidden tabs and respects the operating system's reduced-motion preference. Mobile controls stay within the available width; desktop controls scroll beside the canvas.

The Pages deployment and the Art Studio are verified separately. Other apps embedded in the dashboard remain inherited functionality rather than newly audited features.
