# Snake Arcade Page Design

## Purpose

Add a standalone, browser-playable Snake page to the professional website without changing `index.html`. The game should provide a short, polished diversion while visually belonging to Shan Ye's Signal Architecture site.

## Scope

- New route: `snake.html`.
- New isolated assets: `snake.css` and `snake.js`.
- Existing home page markup and content are unchanged.
- The page has a clear route back to the main profile.

## Visual design

The selected layout is **Arcade Terminal**:

- A centered, wide game board is the primary visual object.
- A compact telemetry strip beneath the board displays score, speed, and status.
- The page uses the existing deep navy background, cool-blue structural grid, mint signal accent, and technical label styling.
- The game-board canvas uses the same grid motif, with mint snake segments, a mint good-item marker, and a contrasting amber bad-item marker.
- Desktop presents keyboard instructions; mobile presents a prominent four-direction touch pad under the board.

## Game rules

- The board is a fixed logical grid rendered responsively in Canvas.
- The snake starts short and moves automatically.
- Arrow keys and W, A, S, D request direction changes.
- Touch controls request the same changes.
- Reverse direction into the snake's neck is ignored.
- The board wraps at all edges: top to bottom, bottom to top, left to right, and right to left.
- Good and bad items appear in unoccupied cells; each spawn is randomly assigned an item type.
- Eating a good item adds a fixed number of snake segments, increases the score, and increases movement speed up to a stated maximum.
- Eating a bad item removes a randomized number of tail segments while keeping the snake at a minimum length of two segments. Bad items do not end the run.
- Eating either item type triggers a short, reduced-motion-safe visual animation: mint expansion feedback for growth and amber contraction feedback for shrinkage.
- Contact between the head and any body segment ends the run.
- A terminated run displays a clear status and can be restarted without reloading the page.

## Architecture

`snake.html` supplies semantic page structure, score/status outputs, canvas, restart control, and accessible touch buttons. `snake.css` supplies page-specific layout and shares the existing design token values rather than modifying `styles.css`. `snake.js` owns rendering, input wiring, timing, and a testable `SnakeGame` rules module.

The module state includes the ordered snake cells, current direction, one queued direction, item cell and type, score, movement interval, status, and a short item-effect animation state. A single scheduled tick advances the state, detects collision, handles wrapping and item consumption, updates the telemetry, then renders the board.

## Accessibility and responsive behavior

- Canvas has a descriptive label; live score/status text is exposed outside the canvas.
- Buttons have accessible direction labels and are at least 44px in each dimension.
- Keyboard controls work when the page is not inside a form field.
- The board uses the available content width and preserves a stable aspect ratio.
- Reduced-motion users receive the normal turn-based game behavior without decorative entrance animation.

## Testing

Automated tests validate wrapping, opposite-turn rejection, fixed good-item growth, randomized bad-item shrinkage with a two-segment minimum, score/speed behavior, item placement outside the snake, and self-collision. A static-page contract validates the new page and required assets without changing the current homepage. Manual browser checks cover keyboard controls, touch buttons, responsive board sizing, good/bad item effects, restart, and the back link.
