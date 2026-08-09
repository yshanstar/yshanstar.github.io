# Tetris Terminal Design

## Goal

Add a standalone, browser-playable Tetris terminal that shares the portfolio’s dark engineering aesthetic and is discoverable through a new Games navigation group.

## Navigation

- Replace the final highlighted `Snake` main-navigation link with a highlighted `Games` group.
- The Games group exposes `Snake` and `Tetris` sub-links, pointing to `snake.html` and `tetris.html`.
- Keep the existing home-page section links unchanged.

## Game Page

- Create `tetris.html` as a standalone Arcade Terminal page, visually consistent with `snake.html`.
- Show a 10 by 20 canvas playfield, Start overlay, score, lines, level, status, and next-piece preview.
- The Start overlay sits over the full visible board and hides all active blocks until play begins.
- Game over uses the existing terminal-overlay pattern with restart and return-to-games actions.

## Rules and Controls

- Use the seven standard tetrominoes and a deterministic, testable piece stream.
- Left/Right arrows move the active piece; Down is soft drop; Up rotates clockwise; Space hard-drops and locks the piece.
- A piece locks when it cannot descend. Full rows flash, then clear and collapse.
- Score uses classic escalating line-clear awards: 100, 300, 500, and 800 points for one through four rows, multiplied by the current level.
- The level starts at 1 and rises from total score. Gravity accelerates with level until a fixed safe minimum interval.
- The game ends when a newly spawned piece collides with occupied cells at the top.

## Mobile Controls

- Render visible on-screen buttons below the board for left, right, clockwise rotate, soft drop, and hard drop.
- Keep touch page scrolling enabled outside the board; buttons provide the complete mobile control path.

## Architecture and Validation

- Add a dependency-free `tetris-engine.mjs` for piece movement, rotation, collision, row resolution, scoring, level, and gravity.
- Add `tetris.js` for rendering, input, timing, overlays, and mobile buttons; add `tetris.css` for the terminal layout.
- Extend static site tests and add engine unit tests for movement, rotation, hard drops, line clears, score/level progression, speed cap, and game over.
- Run the complete Node test suite, `git diff --check`, and inspect the home page and Tetris page in a browser.
