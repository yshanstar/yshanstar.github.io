# Editorial Heading Refinement Implementation Plan

**Goal:** Shorten the four editorial headings, add accessible animated gradient emphasis, and improve hero line wrapping without touching games.

### Task 1: Test and implement

- Update `tests/site-contract.test.mjs` to require the four approved phrases and `.headline-accent`.
- Confirm the contract fails.
- Update `index.html`: wrap `last`, `endure`, `scales`, and `talk` in `<span class="headline-accent">`.
- Update `styles.css`: add steel-blue-to-terracotta background-clip gradient, slow animation, reduced-motion override, and a wider hero copy column.
- Run all tests and `git diff --check`.

### Task 2: Review and commit

- Inspect the local main page for fewer line breaks and readable highlight animation.
- Commit only homepage, tests, and this plan; preserve all game-related files.
