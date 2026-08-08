# Snake Board Touch Lock Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Prevent page scrolling from touch gestures that begin on the active Snake board while preserving normal scrolling everywhere else.

**Architecture:** Use the shell’s existing `data-mode` to set canvas touch behavior in CSS. In JavaScript, immediately cancel touchstart/touchmove defaults only when the engine state is running, while retaining existing gesture direction and cleanup logic.

**Tech Stack:** CSS3, vanilla JavaScript, Node.js built-in `node:test`.

## Global Constraints

- Lock touch panning only on `#game-board` while `.game-shell[data-mode="running"]` is active.
- Preserve normal scrolling in menu and terminated modes and outside the board.
- Preserve the 24px swipe threshold, direction mapping, keyboard controls, and all game rules.
- Do not add an on-screen direction pad.

---

### Task 1: Define touch-lock contracts

**Files:**
- Modify: `tests/site-contract.test.mjs`

**Interfaces:**
- Consumes: static `snake.css` and `snake.js`.
- Produces: contracts that prevent a regression to scroll-friendly active-board input.

- [ ] **Step 1: Write failing contracts**

Append this test:

```js
test('locks touch scrolling only while Snake is running', async () => {
  const [css, js] = await Promise.all([readFile('snake.css', 'utf8'), readFile('snake.js', 'utf8')]);

  assert.match(css, /#game-board[^}]*touch-action: pan-y/);
  assert.match(css, /\.game-shell\[data-mode="running"\] #game-board[^}]*touch-action: none/);
  assert.match(js, /canvas\.addEventListener\('touchstart'[\s\S]*state\.status === 'running'[\s\S]*event\.preventDefault\(\)/);
  assert.match(js, /canvas\.addEventListener\('touchmove'[\s\S]*state\.status === 'running'[\s\S]*event\.preventDefault\(\)/);
});
```

- [ ] **Step 2: Run the static suite to verify failure**

Run:

```bash
/Users/shanye/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --test tests/site-contract.test.mjs
```

Expected: FAIL because the board currently retains `pan-y` while running and only prevents scrolling after direction resolution.

### Task 2: Lock active-board touch gestures

**Files:**
- Modify: `snake.css:40-41`
- Modify: `snake.js:157-179`
- Test: `tests/site-contract.test.mjs`

**Interfaces:**
- Consumes: `state.status`, `.game-shell[data-mode]`, and existing `touchStart` / `swipeResolved` state.
- Produces: immediately cancelled board touch gestures for active runs only.

- [ ] **Step 1: Add running-only CSS touch lock**

Keep the baseline board rule unchanged:

```css
#game-board { touch-action: pan-y; }
```

Add directly after it:

```css
.game-shell[data-mode="running"] #game-board { touch-action: none; }
```

- [ ] **Step 2: Cancel active touches immediately**

Change the `touchstart` listener to non-passive and begin it with:

```js
canvas.addEventListener('touchstart', (event) => {
  if (state.status === 'running') event.preventDefault();
  const touch = event.touches[0];
```

Change the `touchmove` listener so, after the null-start guard, it immediately cancels an active run:

```js
if (state.status === 'running') event.preventDefault();
```

Remove the existing `if (swipeResolved) event.preventDefault();` statement. Keep the threshold, direction calculation, and end/cancel cleanup unchanged.

- [ ] **Step 3: Run static contracts to verify pass**

Run:

```bash
/Users/shanye/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --test tests/site-contract.test.mjs
```

Expected: PASS.

### Task 3: Verify and commit

**Files:**
- Verify: `snake.css`, `snake.js`, `tests/site-contract.test.mjs`

**Interfaces:**
- Consumes: the completed CSS and JS touch-lock changes.
- Produces: verified, board-scoped mobile input behavior.

- [ ] **Step 1: Run complete verification**

Run:

```bash
/Users/shanye/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --test tests/*.test.mjs
git diff --check
```

Expected: all tests pass and no whitespace errors.

- [ ] **Step 2: Browser verification**

At a narrow mobile viewport, start a game and swipe vertically/horizontally over the board. Confirm the board stays in place and the game accepts a directional input. Scroll outside the board, then return to Game menu; confirm normal page scrolling remains possible there.

- [ ] **Step 3: Commit implementation**

```bash
git add snake.js snake.css tests/site-contract.test.mjs docs/superpowers/plans/2026-08-07-snake-board-touch-lock.md
git commit -m "fix: lock Snake board touch input"
```
