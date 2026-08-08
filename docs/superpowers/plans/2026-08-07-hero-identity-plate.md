# Hero Identity Plate Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the rectangular home-page portrait panel with an original-photo circular identity plate carrying Shan Ye’s name and a technical arc label.

**Architecture:** Keep `assets/profile.jpg` unchanged and use semantic HTML, decorative inline SVG, and CSS layering for the circle, rings, name, and label. No raster artwork, remote asset, or dependency is added.

**Tech Stack:** HTML5, inline SVG, CSS3, dependency-free JavaScript, Node.js built-in `node:test`.

## Global Constraints

- Use only the existing `assets/profile.jpg`; do not add or reference a generated profile image.
- Show `SHAN YE` in crisp HTML over the lower portrait.
- Show `DISTRIBUTED SYSTEMS / CLOUD INFRASTRUCTURE` around the circle in decorative SVG and accessible hidden HTML text.
- Use deep navy, mint, cool blue, and white only; no handwritten, fashion, or pink styling.
- Preserve portrait alternative text, desktop/mobile hero layouts, focus styles, reduced motion, and no horizontal overflow.

---

### Task 1: Define identity-plate contracts

**Files:**
- Modify: `tests/site-contract.test.mjs`

**Interfaces:**
- Consumes: static `index.html` and `styles.css`.
- Produces: regression tests for original portrait use, name text, technical arc label, and circular treatment.

- [ ] **Step 1: Write the failing contract**

Append this test:

```js
test('uses the original portrait as an engineering identity plate', async () => {
  const [html, css] = await Promise.all([readFile('index.html', 'utf8'), readFile('styles.css', 'utf8')]);

  assert.match(html, /class="identity-plate"/);
  assert.match(html, /src="assets\/profile\.jpg"/);
  assert.match(html, /class="identity-name">SHAN YE<\/span>/);
  assert.match(html, /DISTRIBUTED SYSTEMS \/ CLOUD INFRASTRUCTURE/);
  assert.match(html, /<svg[^>]+aria-hidden="true"/);
  assert.match(css, /\.identity-orbit[^}]*border-radius: 50%/s);
  assert.match(css, /\.identity-name/);
});
```

- [ ] **Step 2: Run the static suite to verify failure**

Run:

```bash
/Users/shanye/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --test tests/site-contract.test.mjs
```

Expected: FAIL because the home page still uses the rectangular `portrait-panel` structure.

### Task 2: Replace portrait markup with the identity plate

**Files:**
- Modify: `index.html:32-37`
- Test: `tests/site-contract.test.mjs`

**Interfaces:**
- Consumes: existing `assets/profile.jpg` and hero layout.
- Produces: a semantic `figure.identity-plate` with the original accessible portrait plus decorative visual layers.

- [ ] **Step 1: Replace the existing portrait figure**

Replace the `.portrait-panel` figure with:

```html
<figure class="identity-plate reveal">
  <div class="identity-orbit">
    <img src="assets/profile.jpg" alt="Shan Ye, senior principal software engineer">
    <svg class="identity-arc" viewBox="0 0 100 100" aria-hidden="true" focusable="false">
      <defs><path id="identity-arc-path" d="M 14,67 A 42,42 0 0,0 86,67" /></defs>
      <text><textPath href="#identity-arc-path" startOffset="50%" text-anchor="middle">DISTRIBUTED SYSTEMS / CLOUD INFRASTRUCTURE</textPath></text>
    </svg>
    <span class="identity-name">SHAN YE</span>
    <span class="sr-only">Distributed systems and cloud infrastructure</span>
  </div>
  <figcaption><span>OPERATING PRINCIPLE</span>Clarity is a scaling strategy</figcaption>
</figure>
```

Use no text generated into an image. Preserve the `reveal` class and original image alt text.

- [ ] **Step 2: Run the static suite to verify the structural contract**

Run:

```bash
/Users/shanye/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --test tests/site-contract.test.mjs
```

Expected: the identity-plate markup assertions pass; the CSS assertion remains failing until Task 3.

### Task 3: Build the Signal Architecture circular treatment

**Files:**
- Modify: `styles.css:84-89`
- Test: `tests/site-contract.test.mjs`

**Interfaces:**
- Consumes: `.identity-plate`, `.identity-orbit`, `.identity-arc`, `.identity-name`, and `.sr-only` from Task 2.
- Produces: a circular portrait, signal rings, readable name overlay, and responsive arc label.

- [ ] **Step 1: Replace rectangular portrait rules**

Remove `.portrait-panel`, `.portrait-meta`, and `.portrait-panel img` rules. Add these focused rules:

```css
.identity-plate { margin: 0; position: relative; }
.identity-orbit {
  aspect-ratio: 1;
  background: radial-gradient(circle at 50% 30%, var(--surface-raised), var(--ink) 72%);
  border: 1px solid var(--signal);
  border-radius: 50%;
  isolation: isolate;
  overflow: hidden;
  position: relative;
}
.identity-orbit::before {
  border: 1px solid rgba(68, 215, 168, .3);
  border-radius: 50%;
  content: "";
  inset: 4%;
  pointer-events: none;
  position: absolute;
  z-index: 2;
}
.identity-orbit img {
  display: block;
  filter: contrast(1.04) saturate(.88);
  height: 100%;
  object-fit: cover;
  object-position: 50% 19%;
  width: 100%;
}
```

- [ ] **Step 2: Layer readable identity text and the arc label**

Add:

```css
.identity-name {
  bottom: 12%;
  color: var(--text);
  font-family: var(--display);
  font-size: clamp(2.25rem, 5vw, 4.75rem);
  font-weight: 600;
  left: 50%;
  letter-spacing: -.06em;
  line-height: .8;
  position: absolute;
  text-align: center;
  text-shadow: 0 3px 20px rgba(7, 17, 31, .9);
  transform: translateX(-50%);
  white-space: nowrap;
  z-index: 3;
}
.identity-arc { fill: var(--muted); font-family: var(--mono); font-size: 4px; letter-spacing: .55px; inset: 0; position: absolute; z-index: 3; }
.sr-only { height: 1px; margin: -1px; overflow: hidden; padding: 0; position: absolute; width: 1px; clip: rect(0, 0, 0, 0); white-space: nowrap; }
```

Keep the existing figcaption visual language by adapting its selector to `.identity-plate figcaption`.

- [ ] **Step 3: Add responsive adjustments**

Inside the existing `@media (max-width: 760px)` block, replace the rectangular image height override with:

```css
.identity-plate { max-width: min(100%, 32rem); }
.identity-name { font-size: clamp(2.35rem, 13vw, 4.5rem); }
```

- [ ] **Step 4: Run the static suite to verify pass**

Run:

```bash
/Users/shanye/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --test tests/site-contract.test.mjs
```

Expected: PASS.

### Task 4: Verify and commit

**Files:**
- Verify: `index.html`, `styles.css`, `tests/site-contract.test.mjs`

**Interfaces:**
- Consumes: the completed identity plate.
- Produces: a verified responsive home-page hero with no new image asset.

- [ ] **Step 1: Run complete verification**

Run:

```bash
/Users/shanye/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --test tests/*.test.mjs
git diff --check
```

Expected: all tests pass and no whitespace errors.

- [ ] **Step 2: Browser verification**

Serve the root page and inspect at desktop and 390px mobile widths. Confirm the original portrait crop preserves face and crossed arms; SHAN YE is readable over the lower circle; the technical arc label remains legible; there is no horizontal overflow; and the existing LinkedIn CTA and navigation remain usable.

- [ ] **Step 3: Commit implementation**

```bash
git add index.html styles.css tests/site-contract.test.mjs docs/superpowers/plans/2026-08-07-hero-identity-plate.md
git commit -m "feat: add hero identity plate"
```
