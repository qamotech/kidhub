# 🚀🎨 KidHub — Play, Make & Learn

**A colorful browser activity hub with an expanded Art Studio for drawing, storytelling, and creative exploration.** Open one HTML file, choose Art Studio, and start making something imaginative. The application is self-contained HTML, CSS, and JavaScript; there is no build step or application server.

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
2. Open `index.html` in a current desktop browser.
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
| `index.html` | Standalone KidHub app, styles, content, and application logic |
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
