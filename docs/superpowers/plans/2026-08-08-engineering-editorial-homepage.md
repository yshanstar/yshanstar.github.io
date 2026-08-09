# Engineering Editorial Homepage Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans task-by-task.

**Goal:** Replace the home page’s Signal Architecture presentation with the approved Engineering Editorial design while preserving the Snake game.

**Architecture:** Rework only `index.html`, `styles.css`, and their static contracts. Retain existing navigation behavior and assets; implement the editorial palette, circular portrait, hero, expertise strip, and concise semantic sections with responsive CSS.

**Tech Stack:** Static HTML, CSS, vanilla JavaScript, Node.js test runner.

## Global Constraints

- Keep `assets/profile.jpg`, LinkedIn URL, mobile navigation, accessibility, reduced motion, and Snake unchanged.
- Use warm off-white, deep navy, steel-blue details, system fonts, and no dependencies.

### Task 1: Update the home-page contract

**Files:** Modify `tests/site-contract.test.mjs`.

- [ ] Write a failing test requiring `Cloud platforms built for critical work`, `engineering-editorial` markup, the three expertise labels, the original portrait, and a final Snake navigation link.
- [ ] Run `RUNTIME_NODE="/Users/shanye/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node"; "$RUNTIME_NODE" --test tests/site-contract.test.mjs` and confirm failure.

### Task 2: Build the Engineering Editorial page

**Files:** Modify `index.html`, `styles.css`.

- [ ] Replace the home markup with the approved masthead, two-column editorial hero, circular portrait, three-item expertise strip, concise expertise/leadership sections, LinkedIn close, and footer.
- [ ] Replace home-page styling with responsive off-white editorial rules, deep navy type, steel-blue rules, serif display, sans body, mono labels, mobile navigation, focus styles, and reduced-motion support.
- [ ] Run the target test and confirm it passes.

### Task 3: Verify and commit

- [ ] Inspect `http://127.0.0.1:4173/` on desktop and mobile layouts.
- [ ] Run the full test suite and `git diff --check`.
- [ ] Commit with `git add index.html styles.css tests/site-contract.test.mjs` and `git commit -m "feat: redesign home as engineering editorial"`.
