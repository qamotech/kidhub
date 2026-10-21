# 🧰 tools/

Helper scripts for building and checking KidHub. Run everything from the repo root.

| File | What it does | When it runs |
|---|---|---|
| `run-tests.cjs` | Starts a local static server and runs every `test-*.cjs` browser suite in order; ends with `PASS n/n suites` | `node tools/run-tests.cjs` (all) or `node tools/run-tests.cjs test-polish.cjs` (one suite) |
| `practice_kits.py` | Attaches the shared practice companion (`activity-kit.js`) and per-game goals to arcade games and dashboard apps. Safe to re-run | Automatically during `python build.py` |
| `build_portal.py` | Builds the Applications & Resources catalog from the core activities, the 80 toolbox tools and `games/games.json` | Automatically during `python build.py` |
| `import_games.py` | Copies games from the N8DEV arcade into `games/`, stripped to just the game plus a ⬅️ KidHub link and ⛶ Fullscreen button | By hand only. It overwrites games improved inside this repo, so don't run it casually |
| `expand_activities.py` | One-time migration that expanded the original activity bank; refuses to run twice | Never again (kept for history) |

## Typical loop

```bash
python build.py                 # inject src/*.html into studio.html + index.html, rebuild catalog and offline version
node tools/run-tests.cjs        # all browser suites (needs Playwright + Edge)
```

- Adding a suite: create `test-<name>.cjs` in the repo root and add it to the `all` list at the top of `run-tests.cjs`.
- Set `BASE_URL` to run the suites against another server (for example a preview) instead of the built-in one.
- Tests rewrite the screenshot PNGs in the repo root; commit them only when a change is meant to update them.
