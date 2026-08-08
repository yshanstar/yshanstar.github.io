# Snake Clean Menu Preview Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Render an entity-free full grid in Snake menu mode and enlarge the centered Start panel.

**Architecture:** Keep game state creation unchanged, but make `draw` accept an entity-rendering option. Menu mode and menu-mode resize redraw only the grid; running and terminated modes render signals and snake normally. CSS enlarges only the existing Start button panel.

**Tech Stack:** HTML5 Canvas, CSS3, vanilla JavaScript, Node.js built-in `node:test`.

## Global Constraints

- The full-sized board and centered Start overlay remain visible in menu mode.
- Menu mode draws the grid only—no snake or signal entities.
- Running and terminated boards retain the existing snake and multi-signal rendering.
- The Start control remains the sole menu content, uses a roughly 220px-wide panel, and remains responsive.
- Do not change game rules, controls, telemetry, item timings, or the Security breach alert.

---

### Task 1: Define clean-preview regression contracts

**Files:**
- Modify: `tests/site-contract.test.mjs`

**Interfaces:**
- Consumes: static `snake.js` and `snake.css` files.
- Produces: contracts for grid-only menu rendering and the enlarged Start panel.

- [ ] **Step 1: Write failing contracts**

Extend `renders a static board preview while the Snake menu is open` with:

```js
assert.match(js, /function draw\(\{ entities = true \} = \{\}\)/);
assert.match(js, /if \(mode === 'menu'\) \{[\s\S]*draw\(\{ entities: false \}\)/);
assert.match(js, /window\.addEventListener\('resize'[\s\S]*draw\(\{ entities: shell\.dataset\.mode !== 'menu' \}\)/);
assert.match(css, /\.game-menu \.restart-button[^{]*\{[^}]*min-width: 220px/s);
```

- [ ] **Step 2: Run the static suite to verify failure**

Run:

```bash
/Users/shanye/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --test tests/site-contract.test.mjs
```

Expected: FAIL because `draw` currently always paints signals and snake, and the Start panel does not specify the larger width.

### Task 2: Render an entity-free menu board

**Files:**
- Modify: `snake.js:34-66,109-114,189-192`
- Test: `tests/site-contract.test.mjs`

**Interfaces:**
- Consumes: existing `state.items`, `state.snake`, `setMode(mode)`, and responsive resize listener.
- Produces: `draw({ entities = true } = {})`; callers pass `entities: false` only for menu mode.

- [ ] **Step 1: Add the draw option**

Change the function signature to:

```js
function draw({ entities = true } = {}) {
```

Keep the background and grid work unconditional. Wrap the existing `state.items.forEach(...)` and `state.snake.forEach(...)` blocks in:

```js
if (entities) {
  // Existing signal and snake drawing blocks
}
```

- [ ] **Step 2: Use grid-only rendering in menu mode**

In `setMode`, replace the menu-mode draw call with:

```js
draw({ entities: false });
```

Keep `startRun()` and `tick()` calling `draw()` so active and terminated runs still render entities.

- [ ] **Step 3: Preserve clean preview on resize**

Change the resize listener to:

```js
window.addEventListener('resize', () => {
  fitCanvas();
  draw({ entities: shell.dataset.mode !== 'menu' });
});
```

- [ ] **Step 4: Run static contracts to verify pass**

Run:

```bash
/Users/shanye/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --test tests/site-contract.test.mjs
```

Expected: PASS.

### Task 3: Enlarge the Start panel and verify

**Files:**
- Modify: `snake.css:58-60`
- Verify: `snake.js`, `snake.css`, `tests/site-contract.test.mjs`

**Interfaces:**
- Consumes: `.game-menu .restart-button` inside the existing full-board overlay.
- Produces: a responsive, larger Start control without additional menu copy or overlay size changes.

- [ ] **Step 1: Add the larger panel dimensions**

Replace the current menu-button rule with:

```css
.game-menu .restart-button {
  background: var(--surface);
  box-shadow: 0 0 0 6px rgba(68, 215, 168, .08);
  min-width: 220px;
  padding: 2rem 3.5rem;
}
```

At narrow widths, the existing board width constrains the panel naturally; do not add a separate mobile override unless visual testing shows horizontal overflow.

- [ ] **Step 2: Run complete verification**

Run:

```bash
/Users/shanye/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --test tests/*.test.mjs
git diff --check
```

Expected: all tests pass and no whitespace errors.

- [ ] **Step 3: Browser verification**

Serve `snake.html` and inspect the initial menu at desktop and narrow mobile widths. Confirm the board has no snake or signals, the larger Start panel is centered, there is no horizontal overflow, and pressing Start restores the visible snake and multiple signals.

- [ ] **Step 4: Commit the implementation**

```bash
git add snake.js snake.css tests/site-contract.test.mjs docs/superpowers/plans/2026-08-07-snake-clean-menu-preview.md
git commit -m "feat: refine Snake menu preview"
```
