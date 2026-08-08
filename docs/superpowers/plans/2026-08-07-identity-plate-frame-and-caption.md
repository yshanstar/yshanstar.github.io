# Identity Plate Frame and Caption Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the identity plate’s mint circular frame lines with steel-blue and center the operating-principle caption beneath the portrait.

**Architecture:** Preserve the circular portrait and its existing overlays. Update only the identity-orbit border rules and identity-plate caption layout in `styles.css`; extend the static contract to cover the visual-token and alignment changes.

**Tech Stack:** HTML, CSS, Node.js built-in test runner; no external dependencies.

## Global Constraints

- Preserve `assets/profile.jpg`, the name overlay, technical labels, and all Snake-related files.
- Use the existing `--muted` steel-blue theme token (`#9db2c7`) instead of mint for both circular border lines.
- Center the caption under the portrait while retaining its divider line and copy.
- Maintain responsive behavior and no horizontal page overflow.

---

### Task 1: Apply and verify identity-plate visual refinements

**Files:**
- Modify: `tests/site-contract.test.mjs:80-98`
- Modify: `styles.css:84-98`

**Interfaces:**
- Consumes: `.identity-orbit`, `.identity-orbit::before`, and `.identity-plate figcaption` from the existing hero identity plate.
- Produces: a steel-blue double circular frame and centered caption layout.

- [ ] **Step 1: Write the failing static contract assertions**

Add these assertions to the existing identity-plate test:

```js
assert.match(css, /\.identity-orbit[^}]*border: 1px solid var\(--muted\)/s);
assert.match(css, /\.identity-orbit::before[^}]*rgba\(157, 178, 199, \.72\)/s);
assert.match(css, /\.identity-plate figcaption[^}]*text-align: center/s);
```

- [ ] **Step 2: Run the target test to verify it fails**

Run:

```bash
RUNTIME_NODE="/Users/shanye/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node"
"$RUNTIME_NODE" --test tests/site-contract.test.mjs
```

Expected: the identity-plate test fails because the outer and inset frame still use mint and the caption has no centered alignment.

- [ ] **Step 3: Replace mint frame lines with steel-blue**

In `styles.css`, make these exact changes:

```css
.identity-orbit { border: 1px solid var(--muted); }
.identity-orbit::before { border: 1px solid rgba(157, 178, 199, .72); }
```

Keep all other declarations in those rules unchanged.

- [ ] **Step 4: Center the operating-principle caption**

Add `text-align: center;` to `.identity-plate figcaption`:

```css
.identity-plate figcaption { border-top: 1px solid var(--line); color: var(--muted); font-size: .78rem; padding: .85rem .2rem .2rem; text-align: center; }
```

- [ ] **Step 5: Run the target test to verify it passes**

Run:

```bash
RUNTIME_NODE="/Users/shanye/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node"
"$RUNTIME_NODE" --test tests/site-contract.test.mjs
```

Expected: all static site contract tests pass.

- [ ] **Step 6: Inspect the local hero visually**

Open `http://127.0.0.1:4173/` with the browser client. Confirm that both circular lines are steel-blue, the caption is centered below the circle, and the page has no horizontal overflow.

- [ ] **Step 7: Run complete verification**

Run:

```bash
RUNTIME_NODE="/Users/shanye/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node"
"$RUNTIME_NODE" --test tests/*.test.mjs
git diff --check
```

Expected: all tests pass and `git diff --check` returns no output.

- [ ] **Step 8: Commit the implementation**

Run:

```bash
git add styles.css tests/site-contract.test.mjs
git commit -m "style: refine identity plate framing"
```
