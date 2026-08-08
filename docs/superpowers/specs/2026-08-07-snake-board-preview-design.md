# Snake Board Preview Design

## Purpose

Replace the small standalone Snake start menu with a visible, full-size board preview that gives the page an immediate arcade presence.

## Experience

- On initial load and after choosing **Game menu**, render the normal empty game grid at the same full size used during play.
- Center a single **Start** button over the board. The board remains visually visible behind it.
- The preview board is non-interactive: it has no running timer, no active movement, and ignores keyboard and swipe direction input until Start is selected.
- Selecting **Start** begins a new run, replaces the overlay with the live game telemetry, and preserves the existing keyboard and swipe controls.
- The game-over dialog and **Game menu** action remain unchanged. Returning to the menu recreates the static board preview and places focus on Start.

## Technical approach

- Keep `snake.html` semantic structure and the existing canvas. Move the menu from a sibling block into the game shell as a centered overlay.
- Update `snake.js` so menu mode sizes and draws the canvas before exposing the Start overlay. Use the existing `createGame()` state only as a visual preview; do not schedule `tick()` until `startRun()`.
- Update `snake.css` to position the menu over the board and apply a restrained inactive treatment while retaining responsive canvas sizing and focus visibility.

## Constraints

- Do not change scoring, good/bad item behavior, collision behavior, wrapping, mobile swipes, keyboard controls, or game-over behavior.
- The Start label remains the only menu copy.
- Preserve the Signal Architecture colors, reduced-motion behavior, and mobile layout.

## Verification

- Add static contracts proving that the game menu lives inside `.game-shell`, is an overlay, and does not hide the shell in menu mode.
- Run the full Node test suite and `git diff --check`.
- Visually inspect the initial preview, running board, and menu return at desktop and mobile widths.
