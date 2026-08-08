# Snake Board Preview Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Show a full inactive Snake board with a centered Start overlay before a run begins.

**Architecture:** The existing `game-shell` remains the sole board container in every game mode. `game-menu` becomes an overlay inside that shell; `snake.js` draws a static preview when entering menu mode and only schedules movement after `startRun()`.

**Tech Stack:** HTML5 Canvas, CSS3, vanilla JavaScript ES modules, Node.js built-in `node:test`.

## Global Constraints

- Do not change Snake rules, scoring, wrapping, collision, keyboard input, swipe input, or game-over behavior.
- Keep `Start` as the only menu copy.
- Use the same full board dimensions and Signal Architecture styles before and during play.
- Menu mode must not start a timer or respond to directional input.

---

### Task 1: Define board-preview contracts

**Files:**
- Modify: `tests/site-contract.test.mjs`

**Interfaces:**
- Consumes: static Snake HTML, CSS, and JavaScript.
- Produces: regression tests for the visible board-preview structure and menu-mode drawing behavior.

- [ ] **Step 1: Write the failing tests**

Append these tests:

```js
test('places the Start menu over the visible Snake board', async () => {
  const snake = await readFile('snake.html', 'utf8');

  assert.match(snake, /<section class="game-shell"[^>]*>[\s\S]*id="game-board"[\s\S]*id="game-menu"/);
  assert.doesNotMatch(snake, /<section id="game-menu"[\s\S]*<section class="game-shell"/);
});

test('renders a static board preview while the Snake menu is open', async () => {
  const [css, js] = await Promise.all([readFile('snake.css', 'utf8'), readFile('snake.js', 'utf8')]);

  assert.match(css, /\.game-menu[^{]*\{[^}]*position: absolute/s);
  assert.match(js, /if \(mode === 'menu'\) \{[\s\S]*fitCanvas\(\);[\s\S]*draw\(\);/);
  assert.doesNotMatch(js, /shell\.hidden = mode === 'menu'/);
});
```

- [ ] **Step 2: Run the static suite to verify failure**

Run:

```bash
/Users/shanye/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --test tests/site-contract.test.mjs
```

Expected: FAIL because the menu is currently a sibling of the hidden shell and is not positioned over a menu-mode board.

### Task 2: Keep the board visible in menu mode

**Files:**
- Modify: `snake.html:22-39`
- Modify: `snake.js:76-94`
- Test: `tests/site-contract.test.mjs`

**Interfaces:**
- Consumes: existing `#game-board`, `#game-menu`, `setMode(mode)`, `startRun()`, and `returnToMenu()`.
- Produces: a visible canvas for `menu`, `running`, and `terminated` modes; `gameMenu` is visible only in menu mode.

- [ ] **Step 1: Move the menu into the game shell**

Place this block immediately after the canvas inside `.game-shell`:

```html
<section id="game-menu" class="game-menu" aria-label="Start Snake game">
  <button id="start-game" class="restart-button" type="button">Start</button>
</section>
```

Remove the existing sibling menu block. Keep telemetry, message, and Restart run in the shell after the menu block.

- [ ] **Step 2: Draw the preview in menu mode**

Replace `setMode(mode)` with logic that keeps `shell.hidden` false and draws the static state when mode is `menu`:

```js
function setMode(mode) {
  gameMenu.hidden = mode !== 'menu';
  shell.hidden = false;
  gameOver.hidden = mode !== 'terminated';

  if (mode === 'menu') {
    fitCanvas();
    draw();
    window.setTimeout(() => startButton.focus(), 0);
  }

  if (mode === 'terminated') window.setTimeout(() => playAgainButton.focus(), 0);
}
```

Keep `returnToMenu()` limited to clearing the timer and selecting menu mode. Do not call `scheduleTick()` in menu mode.

- [ ] **Step 3: Run the static suite to verify the contracts pass**

Run:

```bash
/Users/shanye/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --test tests/site-contract.test.mjs
```

Expected: PASS.

### Task 3: Style the Start overlay and verify the full game

**Files:**
- Modify: `snake.css:56-57`
- Test: `tests/site-contract.test.mjs`

**Interfaces:**
- Consumes: the menu inside `.game-shell` from Task 2.
- Produces: a board-centered overlay that remains responsive and does not block the button’s focus treatment.

- [ ] **Step 1: Replace the small menu panel styles**

Replace the existing `.game-menu` rule with:

```css
.game-menu {
  align-items: center;
  background: rgba(7, 17, 31, .55);
  display: flex;
  inset: 0;
  justify-content: center;
  position: absolute;
}

.game-menu .restart-button {
  background: var(--surface);
  box-shadow: 0 0 0 6px rgba(68, 215, 168, .08);
}
```

The existing `[hidden]` rule must continue to hide the overlay when a run begins.

- [ ] **Step 2: Run complete verification**

Run:

```bash
/Users/shanye/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --test tests/*.test.mjs
git diff --check
```

Expected: all tests pass and `git diff --check` has no output.

- [ ] **Step 3: Inspect interaction states**

Serve the site statically. Confirm the menu displays the complete board under Start; Start launches the run and hides the overlay; Game menu returns to the static board preview; and the initial mobile layout has no horizontal overflow.

- [ ] **Step 4: Commit the implementation**

```bash
git add snake.html snake.js snake.css tests/site-contract.test.mjs docs/superpowers/plans/2026-08-07-snake-board-preview.md
git commit -m "feat: show Snake board before play"
```
