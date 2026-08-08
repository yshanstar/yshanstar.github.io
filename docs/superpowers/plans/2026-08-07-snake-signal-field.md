# Snake Signal Field Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace Snake’s single-item loop with a timed, multi-item signal field and turn the death overlay into a Security breach engineering alert.

**Architecture:** `snake-engine.mjs` owns immutable item-field lifecycle and accepts injected timestamps for deterministic tests. `snake.js` supplies wall-clock time and renders the engine’s `items` array. `snake.html` and `snake.css` present the Security breach overlay without changing the full-board Start menu.

**Tech Stack:** HTML5 Canvas, CSS3, vanilla JavaScript ES modules, Node.js built-in `node:test`.

## Global Constraints

- Start each game with exactly three items; maintain a minimum of one and maximum of ten active items.
- Item lifetimes are 5–10 seconds of wall-clock time; scheduled spawns occur 1–3 seconds apart while below capacity.
- Items never overlap the snake or another active item; good items remain 70% likely.
- Eating one item must not remove, replace, or reset unrelated items.
- Preserve scoring, speed, growth, shrink, minimum snake length, collision, wrapping, keyboard, swipe, full-board Start overlay, and reduced-motion behavior.
- The alert must use `⚠`, `ALERT / SECURITY BREACH`, and `Security breach` with existing amber warning color.

---

### Task 1: Define deterministic multi-item engine coverage

**Files:**
- Modify: `tests/snake-engine.test.mjs`

**Interfaces:**
- Consumes: `createGame(options)`, `spawnItem(snake, items, gridSize, now, random)`, and `step(state, random, now)` from `snake-engine.mjs`.
- Produces: behavior contracts for a bounded, independent-item field.

- [ ] **Step 1: Update existing item tests to use `items`**

Replace single `item` fixtures with `items: [{ x, y, type, expiresAt: 10000 }]` and pass a fixed `now` value to `step`. For example, change the good-item fixture to:

```js
const state = createGame({
  now: 0,
  snake: [{ x: 2, y: 2 }, { x: 1, y: 2 }],
  direction: 'right',
  items: [{ x: 3, y: 2, type: 'good', expiresAt: 10_000 }],
});
const next = step(state, () => .5, 100);
```

- [ ] **Step 2: Add failing multi-item tests**

Add these tests:

```js
test('starts with three independent, non-overlapping items', () => {
  const state = createGame({ gridSize: 8, now: 0, random: () => .2 });

  assert.equal(state.items.length, 3);
  assert.equal(new Set(state.items.map(({ x, y }) => `${x},${y}`)).size, 3);
  assert.ok(state.items.every((item) => item.expiresAt >= 5_000 && item.expiresAt <= 10_000));
});

test('preserves unrelated items when one item is eaten', () => {
  const state = createGame({
    now: 0,
    snake: [{ x: 2, y: 2 }, { x: 1, y: 2 }],
    direction: 'right',
    items: [
      { x: 3, y: 2, type: 'good', expiresAt: 10_000 },
      { x: 6, y: 6, type: 'bad', expiresAt: 10_000 },
    ],
  });
  const next = step(state, () => .5, 100);

  assert.ok(next.items.some((item) => item.x === 6 && item.y === 6 && item.type === 'bad'));
});

test('expires signals and keeps the field between one and ten items', () => {
  const state = createGame({
    now: 0,
    nextSpawnAt: 9_999,
    items: [{ x: 7, y: 7, type: 'good', expiresAt: 1 }],
  });
  const next = step(state, () => .2, 2);

  assert.ok(next.items.length >= 1);
  assert.ok(next.items.length <= 10);
  assert.ok(next.items.every((item) => item.expiresAt > 2));
});

test('never spawns an item on the snake or an active signal', () => {
  const snake = [{ x: 0, y: 0 }];
  const items = [{ x: 1, y: 0, type: 'good', expiresAt: 10_000 }];
  const item = spawnItem(snake, items, 3, 0, () => .01);

  assert.notDeepEqual({ x: item.x, y: item.y }, { x: 0, y: 0 });
  assert.notDeepEqual({ x: item.x, y: item.y }, { x: 1, y: 0 });
});
```

- [ ] **Step 3: Run the engine suite to verify failure**

Run:

```bash
/Users/shanye/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --test tests/snake-engine.test.mjs
```

Expected: FAIL because the current engine exposes a single `item` with no expiry or field bounds.

### Task 2: Implement the bounded signal field

**Files:**
- Modify: `snake-engine.mjs`
- Test: `tests/snake-engine.test.mjs`

**Interfaces:**
- Consumes: state with `items: Array<{x: number, y: number, type: 'good' | 'bad', expiresAt: number}>` and `nextSpawnAt: number`.
- Produces: `createGame(options)` with three initial signals; `spawnItem(snake, items, gridSize, now, random)`; and `step(state, random, now)` with independent expiry and bounded replenishment.

- [ ] **Step 1: Add field timing constants and item helpers**

Export these constants near the existing game constants:

```js
export const INITIAL_ITEMS = 3;
export const MIN_ITEMS = 1;
export const MAX_ITEMS = 10;
export const ITEM_MIN_LIFETIME = 5_000;
export const ITEM_MAX_LIFETIME = 10_000;
export const SPAWN_MIN_DELAY = 1_000;
export const SPAWN_MAX_DELAY = 3_000;
```

Add `randomBetween(min, max, random)` using an inclusive lower bound and exclusive upper bound. Change `spawnItem` to exclude cells occupied by either `snake` or `items`, and return `{ x, y, type, expiresAt }`, where `expiresAt` is `now + randomBetween(ITEM_MIN_LIFETIME, ITEM_MAX_LIFETIME + 1, random)`.

- [ ] **Step 2: Build initial and replenished fields**

Add `createItems(snake, gridSize, now, random, count = INITIAL_ITEMS)` that repeatedly calls `spawnItem` with the items created so far until it has `count` items or the grid is full.

Add `reconcileItems(snake, items, gridSize, nextSpawnAt, now, random)` that:

1. Removes items whose `expiresAt <= now`.
2. Replenishes immediately up to `MIN_ITEMS`.
3. When `now >= nextSpawnAt` and the field has fewer than `MAX_ITEMS`, adds exactly one signal and sets `nextSpawnAt` to `now + randomBetween(SPAWN_MIN_DELAY, SPAWN_MAX_DELAY + 1, random)`.
4. Returns `{ items, nextSpawnAt }` without modifying existing active items.

- [ ] **Step 3: Change game creation and step resolution**

Make `createGame` accept `now` (default `Date.now()`), `items` (defaulting to `createItems`), and `nextSpawnAt` (defaulting to an initial random delay). Remove the singular `item` field.

Make `step(state, random = Math.random, now = Date.now())` find at most one item at the new head, remove only that item when eaten, apply existing good/bad outcomes, then pass the surviving items through `reconcileItems`. Preserve the existing self-collision return shape, but preserve `items` and `nextSpawnAt` unchanged on termination.

- [ ] **Step 4: Run the engine suite to verify pass**

Run:

```bash
/Users/shanye/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --test tests/snake-engine.test.mjs
```

Expected: PASS with all legacy movement/growth/shrink rules and new multi-item field tests green.

### Task 3: Render the signal field and Security breach alert

**Files:**
- Modify: `snake.js:41-48,76-85`
- Modify: `snake.html:39-45`
- Modify: `snake.css:57-65`
- Modify: `tests/site-contract.test.mjs`

**Interfaces:**
- Consumes: `state.items` and timestamp-aware `step` from Task 2.
- Produces: multiple visible mint/amber signals and an accessible Security breach alert.

- [ ] **Step 1: Add failing static page contracts**

Append this test:

```js
test('uses a software-engineering Security breach alert', async () => {
  const [snake, css] = await Promise.all([readFile('snake.html', 'utf8'), readFile('snake.css', 'utf8')]);

  assert.match(snake, /class="warning-symbol"[^>]*aria-hidden="true">⚠<\/span>/);
  assert.match(snake, /ALERT \/ SECURITY BREACH/);
  assert.match(snake, /<h2 id="game-over-title">Security breach<\/h2>/);
  assert.match(css, /\.warning-symbol/);
  assert.match(css, /color: var\(--warning\)/);
});
```

- [ ] **Step 2: Update the canvas render and tick**

Replace the singular-item draw block with:

```js
state.items.forEach((item) => {
  const centerX = (item.x + .5) * unit;
  const centerY = (item.y + .5) * unit;
  context.fillStyle = item.type === 'good' ? '#44d7a8' : '#f6ce71';
  context.beginPath();
  context.arc(centerX, centerY, unit * .24, 0, Math.PI * 2);
  context.fill();
});
```

Change `tick()` to call `state = step(state, Math.random, Date.now())` so expiry uses wall-clock time. Leave `startRun()` and `returnToMenu()` using `createGame()`; its default current time initializes the preview and run fields.

- [ ] **Step 3: Implement the incident alert markup and CSS**

Replace the game-over eyebrow/title markup with:

```html
<span class="warning-symbol" aria-hidden="true">⚠</span>
<p class="eyebrow">ALERT / SECURITY BREACH</p>
<h2 id="game-over-title">Security breach</h2>
```

Add:

```css
.warning-symbol {
  color: var(--warning);
  display: block;
  font-family: var(--mono);
  font-size: clamp(3rem, 8vw, 5rem);
  line-height: 1;
  margin-bottom: 1rem;
}

.game-over-panel .eyebrow { color: var(--warning); }
```

Do not change `.game-menu`, the canvas size, or its Start button.

- [ ] **Step 4: Run page contracts to verify pass**

Run:

```bash
/Users/shanye/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --test tests/site-contract.test.mjs
```

Expected: PASS with static contracts for the full-board menu and Security breach alert.

### Task 4: Verify end-to-end behavior and commit

**Files:**
- Verify: `snake-engine.mjs`, `snake.js`, `snake.html`, `snake.css`, `tests/snake-engine.test.mjs`, `tests/site-contract.test.mjs`

**Interfaces:**
- Consumes: all completed engine, render, and alert work.
- Produces: verified static game behavior suitable for GitHub Pages.

- [ ] **Step 1: Run the complete suite**

Run:

```bash
/Users/shanye/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --test tests/*.test.mjs
```

Expected: all tests pass.

- [ ] **Step 2: Check whitespace and inspect the diff**

Run:

```bash
git diff --check
git diff -- snake-engine.mjs snake.js snake.html snake.css tests/snake-engine.test.mjs tests/site-contract.test.mjs
```

Expected: no whitespace errors; no changes to movement controls, the Start overlay size, or unrelated home-page files.

- [ ] **Step 3: Browser verification**

Serve the repository as static files and inspect `snake.html`:

1. Before Start, confirm the full-sized board preview remains visible with centered Start.
2. After Start, confirm at least three mint/amber items are visible together and normal telemetry appears.
3. Confirm an item expiring does not clear the others.
4. Force a normal self-collision while playing and confirm the amber `⚠` Security breach overlay appears with both existing actions.
5. At a narrow mobile viewport, confirm no horizontal overflow and that the full-board Start overlay remains centered.

- [ ] **Step 4: Commit the implementation**

```bash
git add snake-engine.mjs snake.js snake.html snake.css tests/snake-engine.test.mjs tests/site-contract.test.mjs docs/superpowers/plans/2026-08-07-snake-signal-field.md
git commit -m "feat: add Snake signal field"
```
