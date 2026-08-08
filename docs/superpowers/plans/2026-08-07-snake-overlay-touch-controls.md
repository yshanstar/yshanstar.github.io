# Snake Overlay and Touch Controls Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a discoverable Snake navigation link, an in-game menu and game-over overlay, and touch-first board swipe controls.

**Architecture:** `index.html` gains one direct game route in its existing navigation. `snake.html` gains a minimal start menu and dialog controls; `snake.js` owns game-mode transitions, overlay focus, and board swipe gestures; `snake.css` visually layers the overlay while keeping mobile play swipe-only.

**Tech Stack:** HTML5 Canvas, CSS3, vanilla JavaScript ES modules, Node.js built-in `node:test`.

## Global Constraints

- Keep all existing home-page content sections unchanged; add only the `Snake` link to its top navigation.
- Change the game title to `Snake`.
- Game death freezes the board and opens a terminal-style overlay with final score, `Try again`, and `Game menu`.
- `Game menu` returns to an in-page start screen, not the profile route; `Try again` immediately starts a fresh run.
- Support Arrow keys, W/A/S/D, and deliberate board swipes; do not render an on-screen direction pad.
- Board swipes prevent default scrolling only after a swipe resolves to a direction.
- Preserve reduced-motion behavior and accessible focus/labels.

---

### Task 1: Add navigation, menu, and dialog markup

**Files:**
- Modify: `index.html`
- Modify: `snake.html`
- Modify: `tests/site-contract.test.mjs`

**Interfaces:**
- Produces IDs consumed by `snake.js`: `start-game`, `game-menu`, `game-over`, `final-score`, `play-again`, and `return-menu`.

- [ ] **Step 1: Write failing page-contract tests**

```js
test('links the home navigation to Snake and supplies accessible game modes', async () => {
  const [home, snake] = await Promise.all([readFile('index.html', 'utf8'), readFile('snake.html', 'utf8')]);
  assert.match(home, /<a href="snake\.html">Snake<\/a>/);
  assert.match(snake, /<h1 id="game-title">Snake<\/h1>/);
  assert.match(snake, /id="game-menu"/);
  assert.match(snake, /id="start-game"/);
  assert.match(snake, /id="game-over"[^>]+role="dialog"[^>]+aria-modal="true"/);
  assert.match(snake, /id="play-again"/);
  assert.match(snake, /id="return-menu"/);
});
```

- [ ] **Step 2: Run the static tests to verify failure**

Run: `node --test tests/site-contract.test.mjs`

Expected: FAIL because the navigation link and game-mode controls do not exist.

- [ ] **Step 3: Implement semantic page structure**

Add `<a href="snake.html">Snake</a>` to the existing `.site-nav` in `index.html`.

In `snake.html`, shorten the title heading to `Snake`. Add `#game-menu` before the board with only a `Start` button. Add a hidden `#game-over` dialog after the board with `aria-labelledby="game-over-title"`, a score output `#final-score`, and buttons `#play-again` and `#return-menu`. Keep the game shell present but hidden while the menu is visible.

- [ ] **Step 4: Run the static tests to verify pass**

Run: `node --test tests/site-contract.test.mjs`

Expected: PASS.

- [ ] **Step 5: Commit page markup**

```bash
git add index.html snake.html tests/site-contract.test.mjs
git commit -m "feat: add Snake menu and terminal overlay markup"
```

### Task 2: Implement game modes and touch-first steering

**Files:**
- Modify: `snake.js`
- Modify: `tests/site-contract.test.mjs`

**Interfaces:**
- Consumes the IDs from Task 1 and engine functions already exported by `snake-engine.mjs`.
- Produces `setMode('menu' | 'running' | 'terminated')`, `startRun()`, `returnToMenu()`, and `requestDirection(direction)`.

- [ ] **Step 1: Write failing behavior-contract tests**

```js
test('implements terminal mode and deliberate board swipe steering', async () => {
  const js = await readFile('snake.js', 'utf8');
  for (const token of ['setMode', 'returnToMenu', 'touchstart', 'touchmove', 'touchend', 'preventDefault', 'play-again']) {
    assert.match(js, new RegExp(token));
  }
});
```

- [ ] **Step 2: Run static tests to verify failure**

Run: `node --test tests/site-contract.test.mjs`

Expected: FAIL because the mode and touch event implementation is absent.

- [ ] **Step 3: Implement modes and gestures**

Create `setMode(mode)` to toggle `hidden` on `#game-menu`, `.game-shell`, and `#game-over`. `startRun()` creates game state, renders, schedules ticks, and focuses the canvas. On self-collision in `tick`, cancel the timer, copy `state.score` to `#final-score`, and call `setMode('terminated')`; focus `#play-again` after opening the dialog. `returnToMenu()` cancels the timer and calls `setMode('menu')`.

Track the initial board touch `{ x, y }` on `touchstart`. On `touchmove`, compute deltas; when the larger absolute delta reaches 24px, request its cardinal direction, call `event.preventDefault()`, and mark the gesture resolved. Ignore shorter touches and do not call `preventDefault()` before resolution. Clear touch state on `touchend` and `touchcancel`.

- [ ] **Step 4: Run full automated tests**

Run: `node --test tests/*.test.mjs && git diff --check`

Expected: PASS; no whitespace errors.

- [ ] **Step 5: Commit behavior**

```bash
git add snake.js tests/site-contract.test.mjs
git commit -m "feat: add Snake terminal and swipe controls"
```

### Task 3: Style overlays and verify swipe-only mobile play

**Files:**
- Modify: `snake.css`

**Interfaces:**
- Consumes hidden game-mode elements from Task 1 and state classes set by Task 2.
- Produces a minimal mobile menu and overlay for swipe-only play.

- [ ] **Step 1: Add a failing style contract**

```js
test('styles the terminal overlay and swipe-only mobile play', async () => {
  const css = await readFile('snake.css', 'utf8');
  assert.match(css, /\.game-over/);
  assert.match(css, /\.game-menu/);
  assert.match(css, /touch-action: pan-y/);
  assert.doesNotMatch(css, /\.direction-pad/);
});
```

- [ ] **Step 2: Run static tests to verify failure**

Run: `node --test tests/site-contract.test.mjs`

Expected: FAIL because terminal/menu styles are absent.

- [ ] **Step 3: Implement page styling**

Style `.game-menu` as a small, centered terminal panel containing only Start, and `.game-over` as a fixed, dark translucent backdrop with a bordered dialog panel. Use mint for Try again and muted outlined styling for Game menu. Set `#game-board { touch-action: pan-y; }`, retain visible focus treatment, and ensure hidden mode elements use `[hidden] { display: none !important; }`.

- [ ] **Step 4: Run automated and browser verification**

Run: `node --test tests/*.test.mjs && git diff --check`

Expected: PASS.

Serve the root with `python3 -m http.server 4173`. At 1440px, verify the home nav links to `snake.html`, menu starts a run, a terminated state produces the overlay, and both overlay buttons behave correctly. At 390px, verify the board has no horizontal overflow, no direction controls are rendered, and a 24px board swipe steers without blocking ordinary scroll.

- [ ] **Step 5: Commit styles**

```bash
git add snake.css tests/site-contract.test.mjs
git commit -m "feat: style Snake terminal overlay"
```
