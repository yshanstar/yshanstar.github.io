# Tetris Timing and Impact Implementation Plan

**Goal:** Speed up opening play and visual feedback.

1. Add a failing gravity test for 550ms at level 1.
2. Update `gravityInterval` to start at 550ms and preserve the 80ms cap.
3. Reduce the clear timer to 120ms and add a hard-drop impact class for 180ms.
4. Run all tests, inspect diff, and commit.
