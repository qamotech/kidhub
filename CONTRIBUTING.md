# 🤝 Contributing to KidHub

## 🛠️ Work locally

Open `index.html` or serve the repository with `python -m http.server 8000`. Keep changes focused, preserve the standalone entry point, and avoid introducing a build requirement without explaining the benefit.

## 🎨 UI expectations

Label controls, retain visible keyboard focus, avoid horizontal overflow on small screens, and keep destructive canvas operations undoable. User-entered text belongs in text nodes or canvas text, never interpolated into HTML. New imported-file features should validate input and release temporary resources.

## 🧪 Before submitting

Run `node test.cjs` with Playwright and Microsoft Edge installed. Inspect desktop and mobile screenshots. Exercise the exact workflow you changed, including failure and undo paths. Report which browsers and devices you actually tested; do not infer touch or accessibility coverage from desktop tests.

## 🐛 Useful bug reports

Include a short title, browser/OS, viewport size, steps to reproduce, expected behavior, actual behavior, and a screenshot when helpful. Remove personal information. Describe whether the problem occurs from a local file or an HTTP server.
