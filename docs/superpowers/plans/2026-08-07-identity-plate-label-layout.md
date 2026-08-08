# Identity Plate Label Layout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the clipped curved expertise label in the home-page identity plate with two readable, steel-blue technical labels beneath the name.

**Architecture:** Keep the circular portrait and name overlay intact. Replace the decorative SVG path with a semantic label row in `index.html`; style the row in the existing identity-orbit stacking context in `styles.css`. The static contract verifies the complete labels and retirement of the SVG label.

**Tech Stack:** HTML, CSS, Node.js built-in test runner; no external dependencies.

## Global Constraints

- Keep `assets/profile.jpg` as the sole hero portrait asset.
- Retain the deep navy, mint, white, and existing muted steel-blue (`--muted`, `#9db2c7`) theme colors.
- Use the existing monospaced typeface and uppercase style for both technical labels.
- Do not modify the Snake game or unrelated page content.
- Keep labels readable without overlap or horizontal page scrolling.

---

### Task 1: Define and test the split-label identity plate

**Files:**
- Modify: `tests/site-contract.test.mjs:80-94`
- Modify: `index.html:35-45`
- Modify: `styles.css:88-95`

**Interfaces:**
- Consumes: `.identity-orbit` and `.identity-name` as existing overlay layers.
- Produces: `.identity-expertise`, `.identity-expertise__left`, `.identity-expertise__divider`, and `.identity-expertise__right`.

- [ ] **Step 1: Write the failing static contract test**

Replace the SVG assertions in the identity-plate test with:

```js
assert.match(html, /class="identity-expertise"/);
assert.match(html, /class="identity-expertise__left">DISTRIBUTED SYSTEMS<\/span>/);
assert.match(html, /class="identity-expertise__right">CLOUD INFRASTRUCTURE<\/span>/);
assert.doesNotMatch(html, /class="identity-arc"/);
assert.match(css, /\.identity-expertise[^}]*color: var\(--muted\)/s);
assert.match(css, /\.identity-expertise__divider/);
```

- [ ] **Step 2: Run the target test to verify it fails**

Run:

```bash
RUNTIME_NODE="/Users/shanye/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node"
"$RUNTIME_NODE" --test tests/site-contract.test.mjs
```

Expected: the identity-plate test fails because the current HTML contains `.identity-arc` and lacks `.identity-expertise`.

- [ ] **Step 3: Replace the curved label markup**

In `index.html`, remove the entire `<svg class="identity-arc">…</svg>` block. Keep the image and name. Insert:

```html
<span class="identity-name">SHAN YE</span>
<div class="identity-expertise" aria-hidden="true">
  <span class="identity-expertise__left">DISTRIBUTED SYSTEMS</span>
  <span class="identity-expertise__divider">/</span>
  <span class="identity-expertise__right">CLOUD INFRASTRUCTURE</span>
</div>
<span class="sr-only">Distributed systems and cloud infrastructure</span>
```

- [ ] **Step 4: Style the readable technical-label row**

Remove `.identity-arc` and `.identity-arc text` rules. Add beside `.identity-name`:

```css
.identity-name { bottom: 18%; }
.identity-expertise { align-items: center; bottom: 11%; color: var(--muted); display: flex; font-family: var(--mono); font-size: clamp(.43rem, .82vw, .65rem); gap: .45rem; justify-content: center; letter-spacing: .035em; line-height: 1.2; padding: 0 8%; position: absolute; text-align: center; width: 100%; z-index: 4; }
.identity-expertise__left { text-align: right; }
.identity-expertise__divider { color: var(--muted); }
.identity-expertise__right { text-align: left; }
```

At the `max-width: 760px` breakpoint, add:

```css
.identity-expertise { bottom: 10%; font-size: clamp(.42rem, 2.1vw, .62rem); gap: .35rem; padding: 0 7%; }
```

- [ ] **Step 5: Run the target test to verify it passes**

Run:

```bash
RUNTIME_NODE="/Users/shanye/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node"
"$RUNTIME_NODE" --test tests/site-contract.test.mjs
```

Expected: all static site contract tests pass.

- [ ] **Step 6: Inspect the local hero visually**

Open `http://127.0.0.1:4173/` using the browser client. Confirm that both labels are fully visible below `SHAN YE`, the divider is steel-blue, the original portrait is displayed, and the page has no horizontal overflow.

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
git add index.html styles.css tests/site-contract.test.mjs
git commit -m "fix: clarify identity plate expertise labels"
```
