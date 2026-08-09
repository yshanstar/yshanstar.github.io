# Tetris Visual Feedback Design

## Goal

Improve Tetris play clarity with a three-piece preview, a ghost landing hint, and an animated row-clear phase.

## Queue and Preview

- The game state holds a three-piece queue.
- The active piece consumes the first queue entry; a new deterministic piece is appended after each spawn.
- A right-side `UP NEXT` panel renders all three queue pieces as small tetromino previews.

## Ghost Landing Hint

- The renderer calculates the active piece’s lowest non-colliding position.
- It renders that piece as a muted steel-blue outline behind the active piece.
- The hint updates after movement, rotation, soft drop, and spawn.

## Row-Clear Animation

- When a piece fills one or more rows, the engine enters `clearing` status and retains the locked board plus the row indexes.
- The terminal pauses gravity, flashes those rows in mint and white for 220ms, then dispatches a clear-resolution action.
- Resolution collapses rows, awards score/lines/level, spawns the next active piece, and resumes gravity unless top-out occurs.

## Validation

- Add engine tests for queue length/advance and the two-phase clear lifecycle.
- Confirm the UI shows three previews, a ghost hint, and visible row flashes without horizontal overflow.
- Run the full Node test suite and `git diff --check`.
