# Tetris Terminal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a standalone classic Tetris terminal with keyboard/mobile controls and a Games navigation group.

**Architecture:** `tetris-engine.mjs` is a pure state reducer for pieces, movement, line resolution, score, level, and gravity. `tetris.js` renders and schedules it; `tetris.html`/`tetris.css` implement the terminal UI. The home navigation gains a dependency-free Games disclosure containing Snake and Tetris.

**Tech Stack:** HTML, CSS, ES modules, Canvas, Node.js built-in test runner.

## Global Constraints

- Use a 10×20 board and seven standard tetrominoes.
- Keyboard: Left/Right move, Down soft-drop, Up clockwise rotate, Space hard-drop.
- Mobile uses visible buttons for those five actions.
- Preserve Snake behavior and reuse its visual language without adding dependencies.

---

### Task 1: Build the pure Tetris engine with tests

**Files:** Create `tetris-engine.mjs`, `tests/tetris-engine.test.mjs`.

**Interfaces:** Export `BOARD_WIDTH`, `BOARD_HEIGHT`, `createGame(options)`, `move(state, dx)`, `rotate(state)`, `softDrop(state)`, `hardDrop(state)`, `tick(state)`, `gravityInterval(state)`.

- [ ] Write failing tests for blocked horizontal movement, clockwise rotation, hard-drop lock, a one-row clear worth 100 points at level 1, four rows worth 800 points, level progression, gravity cap, and top-out.
- [ ] Run `RUNTIME_NODE="/Users/shanye/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node"; "$RUNTIME_NODE" --test tests/tetris-engine.test.mjs`; expect missing-module failure.
- [ ] Implement immutable board state (`board`, `active`, `next`, `score`, `lines`, `level`, `status`, `clearingRows`), collision checks, standard pieces, clockwise matrix rotation with basic wall adjustment, lock/spawn, row detection, and score constants `{1:100,2:300,3:500,4:800}` multiplied by level. Cap gravity at 80ms.
- [ ] Run the target tests until all pass.

### Task 2: Build the Tetris terminal UI

**Files:** Create `tetris.html`, `tetris.css`, `tetris.js`.

- [ ] Add a failing static contract requiring `tetris.html`, a canvas, Start overlay, next preview, telemetry, five mobile buttons, and module script.
- [ ] Implement the page using Snake’s header, terminal overlay, and palette. Render 10×20 cells, active/locked blocks, next preview, score/lines/level/status, and flash `clearingRows` before committing clears.
- [ ] In `tetris.js`, map keys and buttons to engine actions, schedule gravity with `gravityInterval`, suppress page scrolling only for button actions, and provide restart/game-menu overlays on top-out.
- [ ] Run static tests; inspect local Tetris page on desktop and mobile widths.

### Task 3: Add Games navigation and regression coverage

**Files:** Modify `index.html`, `styles.css`, `script.js`, `tests/site-contract.test.mjs`, optionally `README.md`.

- [ ] Add a failing static test requiring a final highlighted `Games` navigation control with `Snake` and `Tetris` links.
- [ ] Replace the standalone Snake link with an accessible disclosure/menu containing both routes; add keyboard and click behavior in `script.js`, and responsive styles that preserve the existing mobile nav.
- [ ] Run full verification:
```bash
RUNTIME_NODE="/Users/shanye/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node"
"$RUNTIME_NODE" --test tests/*.test.mjs
git diff --check
```
- [ ] Commit with `git add index.html styles.css script.js tetris* tests README.md` and `git commit -m "feat: add Tetris terminal"`.

### Task 4: Add Tetris visual-feedback systems

**Files:** Modify `tetris-engine.mjs`, `tests/tetris-engine.test.mjs`, `tetris.html`, `tetris.css`, `tetris.js`.

- [ ] Write failing engine tests for a three-piece queue that advances on spawn and a `clearing` state that resolves only through an exported `resolveClear(state)` action.
- [ ] Change state from `next` to `queue` (three standard piece types), retain locked rows during `clearing`, and export `resolveClear` to collapse rows, score, and spawn after the UI flash.
- [ ] Add an `UP NEXT` side panel with three preview canvases, compute and draw a steel-blue ghost at the active piece’s lowest valid y coordinate, and flash clearing rows for 220ms before calling `resolveClear`.
- [ ] Run `RUNTIME_NODE="/Users/shanye/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node"; "$RUNTIME_NODE" --test tests/*.test.mjs` and `git diff --check`; inspect Tetris in a browser.
