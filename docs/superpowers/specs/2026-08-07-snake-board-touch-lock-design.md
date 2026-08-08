# Snake Board Touch Lock Design

## Purpose

Make mobile Snake steering reliable by preventing browser page movement when a player interacts with the active game board.

## Experience

- During a running game, a touch that begins on the board belongs to Snake. Dragging or swiping the board cannot scroll the page and continues to request the corresponding direction after the existing 24px threshold.
- Normal page scrolling remains available outside the board, before a game starts, after a game ends, and after returning to the game menu.
- No direction buttons or other controls are added.

## Technical design

- `snake.css` applies `touch-action: none` to `#game-board` only while `.game-shell[data-mode="running"]` is active; menu and terminated modes retain `touch-action: pan-y`.
- `snake.js` handles board `touchstart` and `touchmove` as non-passive listeners. When `state.status === 'running'`, it calls `preventDefault()` immediately so the browser never begins a competing scroll gesture. It retains the existing directional threshold and only queues direction changes for active runs.
- Touch-end and touch-cancel clear gesture state as they do today.

## Constraints

- Preserve keyboard controls, swipe direction mapping, 24px threshold, full-board Start overlay, scoring, item-field behavior, and Security breach alert.
- Do not globally disable document scrolling or alter touch behavior outside the board.

## Verification

- Add static contracts for running-only `touch-action: none` and immediate running-state `preventDefault()`.
- Run the complete Node suite and `git diff --check`.
- On a narrow mobile viewport, confirm a board swipe does not move the page during a run while scrolling above/below the board and in menu mode still works.
