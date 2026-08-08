# Snake Arcade Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a standalone, responsive Snake game page that matches the existing Signal Architecture website without changing the home page.

**Architecture:** `snake-engine.mjs` contains deterministic, DOM-free game rules and is imported by Node tests and the browser controller. `snake.js` owns input, timer, telemetry, and Canvas drawing; `snake.html` is the accessible page shell; `snake.css` isolates the Arcade Terminal presentation while reusing the established color system.

**Tech Stack:** HTML5 Canvas, CSS3, vanilla JavaScript ES modules, Node.js built-in `node:test`, GitHub Pages.

## Global Constraints

- Do not change `index.html`, `styles.css`, `script.js`, or the existing main-page copy.
- Add only the standalone `snake.html` route and its dedicated game assets.
- Use the existing deep navy, cool-blue grid, mint signal accent, and technical label visual language.
- Support Arrow keys, W/A/S/D, and at-least-44px touch direction buttons.
- The board wraps on every edge; reverse moves are ignored; self-collision ends the run; restart does not reload the page.
- Good items give fixed growth; bad items remove a random number of tail segments but never reduce the snake below two segments.
- Each item effect has a reduced-motion-safe visual treatment; no third-party dependency or external runtime is allowed.
- Use only relative paths so the page works at `https://yshanstar.github.io/snake.html`.

---

### Task 1: Create and verify deterministic game rules

**Files:**
- Create: `snake-engine.mjs`
- Create: `tests/snake-engine.test.mjs`

**Interfaces:**
- Produces `createGame(options)`, `queueDirection(state, direction)`, `step(state, random)`, and `spawnItem(snake, gridSize, random)`.
- `Direction` is one of `'up' | 'down' | 'left' | 'right'`; cells are `{ x: number, y: number }`; items are `{ x: number, y: number, type: 'good' | 'bad' }`.
- `step` returns a new state with `status: 'running' | 'terminated'`, `effect: 'growth' | 'shrink' | null`, and never mutates its input.

- [ ] **Step 1: Write failing rules tests**

```js
import assert from 'node:assert/strict';
import test from 'node:test';
import { createGame, queueDirection, spawnItem, step } from '../snake-engine.mjs';

test('wraps across every board edge', () => {
  const state = createGame({ gridSize: 8, snake: [{ x: 7, y: 3 }, { x: 6, y: 3 }], direction: 'right', item: { x: 2, y: 2, type: 'good' } });
  assert.deepEqual(step(state, () => .2).snake[0], { x: 0, y: 3 });
});

test('rejects an immediate reverse turn', () => {
  const state = createGame({ direction: 'right' });
  assert.equal(queueDirection(state, 'left').queuedDirection, null);
});

test('good items grow by two, score, and accelerate', () => {
  const state = createGame({ snake: [{ x: 2, y: 2 }, { x: 1, y: 2 }], direction: 'right', item: { x: 3, y: 2, type: 'good' } });
  const next = step(state, () => .5);
  assert.equal(next.snake.length, 4);
  assert.equal(next.score, 10);
  assert.ok(next.interval < state.interval);
  assert.equal(next.effect, 'growth');
});

test('bad items shrink by a random amount but preserve two segments', () => {
  const state = createGame({ snake: [{ x: 3, y: 2 }, { x: 2, y: 2 }, { x: 1, y: 2 }], direction: 'right', item: { x: 4, y: 2, type: 'bad' } });
  const next = step(state, () => .99);
  assert.equal(next.snake.length, 2);
  assert.equal(next.effect, 'shrink');
});

test('spawns items outside occupied cells and ends on self-collision', () => {
  const item = spawnItem([{ x: 0, y: 0 }], 3, () => .01);
  assert.notDeepEqual(item, { x: 0, y: 0 });
  const state = createGame({ snake: [{ x: 2, y: 1 }, { x: 1, y: 1 }, { x: 1, y: 2 }, { x: 2, y: 2 }, { x: 3, y: 2 }], direction: 'down' });
  assert.equal(step(state, () => .5).status, 'terminated');
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `node --test tests/snake-engine.test.mjs`

Expected: FAIL because `snake-engine.mjs` does not exist.

- [ ] **Step 3: Implement the pure engine**

Implement these exact constants: `GOOD_GROWTH = 2`, `GOOD_SCORE = 10`, `INITIAL_INTERVAL = 180`, `MIN_INTERVAL = 65`, `INTERVAL_STEP = 12`, and `MIN_LENGTH = 2`. `createGame` supplies defaults for a 20x20 grid and accepts overrides used by the tests. `spawnItem` uses the provided random function to choose an empty cell and assigns `'good'` when `random() < .7`, otherwise `'bad'`.

In `step`, apply queued direction; wrap head coordinates with `(coordinate + gridSize) % gridSize`; terminate if the new head intersects the body after the tail-movement rule is applied. Good items preserve the existing tail then append two tail copies, add ten points, reduce interval no lower than 65, and set `effect: 'growth'`. Bad items remove `1 + Math.floor(random() * 3)` tail segments without dropping below two, subtract five points down to zero, and set `effect: 'shrink'`. Every consumed item calls `spawnItem` for the replacement.

- [ ] **Step 4: Run the rules tests to verify they pass**

Run: `node --test tests/snake-engine.test.mjs`

Expected: PASS with five tests.

- [ ] **Step 5: Commit the game engine**

```bash
git add snake-engine.mjs tests/snake-engine.test.mjs
git commit -m "feat: add Snake game rules engine"
```

### Task 2: Add the accessible Arcade Terminal page shell

**Files:**
- Create: `snake.html`
- Modify: `tests/site-contract.test.mjs`

**Interfaces:**
- Consumes `snake.css` and module `snake.js`, created by later tasks.
- Produces page IDs consumed by `snake.js`: `game-board`, `snake-score`, `snake-speed`, `snake-status`, `restart-game`, `direction-up`, `direction-down`, `direction-left`, `direction-right`, and `game-message`.

- [ ] **Step 1: Write the failing standalone-page contract test**

```js
test('ships an accessible standalone Snake game page without touching the home page', async () => {
  const [snake, home] = await Promise.all([readFile('snake.html', 'utf8'), readFile('index.html', 'utf8')]);
  assert.match(snake, /<canvas[^>]+id="game-board"[^>]+aria-label="Snake game board"/);
  assert.match(snake, /<button[^>]+id="direction-up"[^>]+aria-label="Move up"/);
  assert.match(snake, /id="snake-score"/);
  assert.match(snake, /href="index\.html"/);
  assert.doesNotMatch(home, /snake\.html|Snake game/);
});
```

- [ ] **Step 2: Run the static tests to verify failure**

Run: `node --test tests/site-contract.test.mjs`

Expected: FAIL because `snake.html` does not exist.

- [ ] **Step 3: Build `snake.html`**

Create a semantic page with title `Snake // Arcade Terminal — Shan Ye`, a back link to `index.html`, a `<main>` heading `Snake // Arcade Terminal`, an instruction sentence with Arrow keys and W/A/S/D, and a `<canvas id="game-board" width="800" height="800" aria-label="Snake game board" role="img">` fallback text.

Below the canvas, provide a three-cell telemetry strip with outputs `snake-score`, `snake-speed`, and `snake-status`; a visually distinct `game-message` status region with `aria-live="polite"`; a restart button; and four labelled direction buttons in a D-pad order. Link `snake.css` and load `snake.js` as `type="module"`.

- [ ] **Step 4: Run static tests to verify the page contract passes**

Run: `node --test tests/site-contract.test.mjs`

Expected: PASS.

- [ ] **Step 5: Commit the page shell**

```bash
git add snake.html tests/site-contract.test.mjs
git commit -m "feat: add Snake arcade page shell"
```

### Task 3: Implement Canvas rendering, input, and responsive controls

**Files:**
- Create: `snake.css`
- Create: `snake.js`
- Modify: `tests/site-contract.test.mjs`

**Interfaces:**
- Consumes engine exports and all IDs in Task 2.
- Produces `window.__snakeGame` only in development for browser QA, holding `state`, `restart()`, and `requestDirection(direction)`.

- [ ] **Step 1: Add a failing JavaScript and style contract test**

```js
test('includes responsive touch controls and module-based Snake behavior', async () => {
  const [css, js] = await Promise.all([readFile('snake.css', 'utf8'), readFile('snake.js', 'utf8')]);
  assert.match(css, /@media \(max-width: 760px\)/);
  assert.match(css, /\.direction-pad/);
  assert.match(css, /min-height: 44px/);
  assert.match(js, /keydown/);
  assert.match(js, /requestDirection/);
  assert.match(js, /requestAnimationFrame/);
});
```

- [ ] **Step 2: Run the static tests to verify failure**

Run: `node --test tests/site-contract.test.mjs`

Expected: FAIL because `snake.css` and `snake.js` do not exist.

- [ ] **Step 3: Implement `snake.css` and `snake.js`**

In `snake.css`, create page-local tokens matching `#07111f`, `#254866`, `#e8f1fb`, `#9db2c7`, `#44d7a8`, and `#f6ce71`. Center an 800px-max board, keep the canvas at `width: min(100%, 800px); aspect-ratio: 1`, style the telemetry strip and restart button as outlined terminal controls, and make `.direction-pad button` at least 52px square. Under `@media (max-width: 760px)`, stack telemetry cells and display the touch pad; above that breakpoint, keep the pad available but compact.

In `snake.js`, import engine functions; fit Canvas to device pixel ratio while preserving its CSS size; draw the dark grid, mint snake, amber bad item, and mint good item. Map `ArrowUp`/`w`, `ArrowDown`/`s`, `ArrowLeft`/`a`, and `ArrowRight`/`d` to directions; call `preventDefault()` only for matched game keys. Wire D-pad buttons to the same input function. Drive the game with `setTimeout` using `state.interval`, re-scheduling after each running tick. Update the output elements each tick and set `game-message` to `RUN TERMINATED — restart when ready` after self-collision.

Use `requestAnimationFrame` to animate `growth` as a brief mint board glow and `shrink` as an amber board glow; skip the effect if `matchMedia('(prefers-reduced-motion: reduce)').matches`.

- [ ] **Step 4: Run the full automated suite**

Run: `node --test tests/*.test.mjs && git diff --check`

Expected: PASS with the engine and static-page tests; no whitespace errors.

- [ ] **Step 5: Perform browser QA and commit**

Serve the repository root with `python3 -m http.server 4173`, then inspect `/snake.html` at 1440px and 390px. Verify: the home page has no game link; Arrow keys and W/A/S/D steer; a reverse move is ignored; controls steer on mobile; board edges wrap; good and bad items have distinct feedback; the snake does not fall below two segments; self-collision terminates; restart begins a new run; and the back link reaches the home page.

```bash
git add snake.css snake.js tests/site-contract.test.mjs
git commit -m "feat: implement Snake arcade game"
```

### Task 4: Document the game route

**Files:**
- Modify: `README.md`
- Modify: `tests/site-contract.test.mjs`

**Interfaces:**
- Consumes published route `snake.html`.
- Produces clear local-preview and public-route documentation.

- [ ] **Step 1: Add the failing documentation assertion**

```js
test('documents the Snake route', async () => {
  const readme = await readFile('README.md', 'utf8');
  assert.match(readme, /snake\.html/);
  assert.match(readme, /Arrow keys/);
  assert.match(readme, /W\/A\/S\/D/);
});
```

- [ ] **Step 2: Run the test to verify failure**

Run: `node --test tests/site-contract.test.mjs`

Expected: FAIL because the README does not mention the game route.

- [ ] **Step 3: Add route documentation**

Append a `## Snake arcade` section to `README.md`. State that `/snake.html` is a standalone game route; list Arrow keys and W/A/S/D controls; mention on-screen touch controls; describe mint good items, amber bad items, wrapping edges, self-collision, and restart.

- [ ] **Step 4: Run final verification**

Run: `node --test tests/*.test.mjs && git diff --check && git status --short`

Expected: all tests pass, whitespace check is clean, and only intended README/test files remain before commit.

- [ ] **Step 5: Commit documentation**

```bash
git add README.md tests/site-contract.test.mjs
git commit -m "docs: describe Snake arcade route"
```
