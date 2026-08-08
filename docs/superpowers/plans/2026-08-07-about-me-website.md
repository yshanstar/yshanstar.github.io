# About Me Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a polished, GitHub Pages-ready, one-page professional portfolio for Shan Ye.

**Architecture:** Serve a dependency-free static site from the repository root. `index.html` owns accessible semantic content and section anchors; `styles.css` owns the responsive Signal Architecture visual system; `script.js` adds nonessential menu, active-section, and motion enhancements. Node's built-in test runner validates the static contract without requiring packages.

**Tech Stack:** HTML5, CSS3, vanilla JavaScript, Node.js built-in `node:test` and `node:assert`, GitHub Pages.

## Global Constraints

- Use only supplied resume facts, LinkedIn URL, and portrait; do not expose resume email or phone.
- Do not name employers or use company logos.
- Use the public headline exactly: `Engineering systems that make cloud move.`
- Keep the site one-page, mobile-first, dependency-free, and deployable to GitHub Pages with relative asset paths.
- Use the Signal Architecture system: deep navy, cool-blue structural lines, mint signal accents, editorial display type, and technical body type.
- Include keyboard navigation, visible focus styles, reduced-motion support, accessible labels/alt text, and WCAG-AA normal-text contrast.
- Open LinkedIn safely in a new tab using `target="_blank"` and `rel="noreferrer"`.

---

### Task 1: Establish the static-site contract and project shell

**Files:**
- Create: `package.json`
- Create: `tests/site-contract.test.mjs`
- Create: `.gitignore`
- Create: `404.html`

**Interfaces:**
- Consumes: root-level `index.html`, `styles.css`, and `script.js`, created by later tasks.
- Produces: `npm test`, which runs `node --test tests/*.test.mjs`; the initial contract validates the HTML, portrait, and fallback, and the final task extends it to validate every static asset.

- [ ] **Step 1: Write the failing static contract test**

```js
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import test from 'node:test';

const requiredFiles = ['index.html', 'assets/profile.jpg', '404.html'];
const requiredAnchors = ['#top', '#profile', '#operate', '#career', '#connect'];

test('ships the complete static site contract', async () => {
  await Promise.all(requiredFiles.map((file) => access(file)));
  const html = await readFile('index.html', 'utf8');
  for (const anchor of requiredAnchors) assert.match(html, new RegExp(`href="${anchor}"|id="${anchor.slice(1)}"`));
  assert.match(html, /Engineering systems that make cloud move\./);
  assert.match(html, /https:\/\/www\.linkedin\.com\/in\/shanye\//);
  assert.match(html, /target="_blank"/);
  assert.match(html, /rel="noreferrer"/);
  assert.doesNotMatch(html, /yshanstar1988@gmail\.com|415.?684.?3217|Oracle|Microsoft|Amazon/);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `node --test tests/site-contract.test.mjs`

Expected: FAIL because the static files do not exist yet.

- [ ] **Step 3: Add the script, ignore policy, and fallback page**

```json
{
  "name": "shan-ye-about-me",
  "private": true,
  "scripts": { "test": "node --test tests/*.test.mjs" }
}
```

```gitignore
.superpowers/
.DS_Store
node_modules/
```

Create `404.html` with a minimal dark Signal Architecture page that links back to `./` using the text `Return to Shan Ye's profile.`

- [ ] **Step 4: Run the test to confirm the intended remaining failure**

Run: `npm test`

Expected: FAIL because `index.html` and `assets/profile.jpg` are not present yet.

- [ ] **Step 5: Commit the test shell**

```bash
git add package.json tests/site-contract.test.mjs .gitignore 404.html
git commit -m "test: add static site contract"
```

### Task 2: Build the semantic one-page content and profile asset

**Files:**
- Create: `assets/profile.jpg`
- Create: `index.html`
- Modify: `tests/site-contract.test.mjs`

**Interfaces:**
- Consumes: asset path `assets/profile.jpg`; section anchors in the static contract.
- Produces: accessible section structure and selectors consumed by `styles.css` and `script.js`: `.site-header`, `.menu-toggle`, `.site-nav`, `.hero`, `.section`, `.signal-card`, `.career-item`, `.reveal`.

- [ ] **Step 1: Extend the failing test for semantic and accessibility requirements**

```js
test('uses semantic sections and an accessible portrait', async () => {
  const html = await readFile('index.html', 'utf8');
  for (const id of ['top', 'profile', 'operate', 'career', 'connect']) {
    assert.match(html, new RegExp(`<section[^>]*id="${id}"|<main[^>]*id="${id}"`));
  }
  assert.match(html, /<img[^>]+src="assets\/profile\.jpg"[^>]+alt="Shan Ye/);
  assert.match(html, /<button[^>]+class="menu-toggle"[^>]+aria-expanded="false"/);
  assert.match(html, /<nav[^>]+aria-label="Primary"/);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test`

Expected: FAIL because `index.html` does not exist.

- [ ] **Step 3: Copy and optimize the supplied headshot, then write `index.html`**

Copy the supplied image into `assets/profile.jpg`; retain the subject’s head and shoulders and target an approximately 1200px-wide optimized JPEG.

Create a semantic document with `lang="en"`, viewport metadata, stylesheet and script references, and these sections:

```html
<header class="site-header">…</header>
<main id="top">
  <section class="hero" aria-labelledby="hero-title">…</section>
  <section id="profile" class="section">…</section>
  <section id="operate" class="section">…</section>
  <section id="career" class="section">…</section>
  <section id="connect" class="section">…</section>
</main>
```

Use content that faithfully summarizes the resume: lifecycle management and resource reclamation; scalable service/API and commerce platform work; roadmaps, design reviews, mentoring, and cross-team alignment. Use generic labels such as `Cloud infrastructure`, `Enterprise commerce`, and `Retail systems` rather than company names. Provide LinkedIn CTAs in the hero and connect section only.

- [ ] **Step 4: Run the Task 2 contract test**

Run: `npm test`

Expected: PASS.

- [ ] **Step 5: Commit the structured content**

```bash
git add index.html assets/profile.jpg tests/site-contract.test.mjs
git commit -m "feat: add one-page professional profile content"
```

### Task 3: Implement the responsive Signal Architecture visual system

**Files:**
- Create: `styles.css`
- Modify: `tests/site-contract.test.mjs`

**Interfaces:**
- Consumes: the markup classes from Task 2.
- Produces: responsive layout styles, custom properties, focus treatment, mobile navigation presentation, and reduced-motion behavior.

- [ ] **Step 1: Add a failing stylesheet contract test**

```js
test('provides responsive, accessible Signal Architecture styling', async () => {
  const css = await readFile('styles.css', 'utf8');
  for (const token of ['--ink:', '--signal:', '@media (max-width:', '@media (prefers-reduced-motion: reduce)', ':focus-visible']) {
    assert.match(css, new RegExp(token.replace(/[()]/g, '\\$&')));
  }
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test`

Expected: FAIL because `styles.css` does not exist.

- [ ] **Step 3: Write `styles.css`**

Define the design tokens below, then implement the full component/layout styling:

```css
:root {
  --ink: #07111f;
  --surface: #0d1c2e;
  --line: #254866;
  --text: #e8f1fb;
  --muted: #9db2c7;
  --signal: #44d7a8;
  --focus: #f6ce71;
}
```

Use `min()`/`clamp()` to constrain page width and type scale. Build an asymmetric desktop hero with the photo in a framed grid panel and a single-column mobile hero. Use a faint CSS-only grid background, outlined card surfaces, section numbers, readable line lengths, and 44px minimum touch targets. Hide `.menu-toggle` on larger screens; on mobile, expose the nav only when `.nav-open` is set on the header. Add high-contrast focus styles and disable smooth/reveal transitions inside `@media (prefers-reduced-motion: reduce)`.

- [ ] **Step 4: Run the full test suite**

Run: `npm test`

Expected: PASS.

- [ ] **Step 5: Commit the visual system**

```bash
git add styles.css tests/site-contract.test.mjs
git commit -m "feat: style Signal Architecture portfolio"
```

### Task 4: Add progressive enhancement and validate static deployment

**Files:**
- Create: `script.js`
- Modify: `tests/site-contract.test.mjs`

**Interfaces:**
- Consumes: `.menu-toggle`, `.site-header`, `.site-nav a`, `.reveal` elements, and section IDs from Task 2.
- Produces: `nav-open` state, menu `aria-expanded` synchronization, `is-active` navigation markers, and `is-visible` reveal state.

- [ ] **Step 1: Add a failing JavaScript behavior and assembled-site contract test**

```js
test('keeps enhancements dependency-free and motion-aware', async () => {
  const js = await readFile('script.js', 'utf8');
  assert.match(js, /matchMedia\('\(prefers-reduced-motion: reduce\)'\)/);
  assert.match(js, /aria-expanded/);
  assert.match(js, /IntersectionObserver/);
  assert.doesNotMatch(js, /import |require\(/);
});

test('ships all final static assets', async () => {
  await Promise.all(['index.html', 'styles.css', 'script.js', 'assets/profile.jpg', '404.html'].map((file) => access(file)));
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test`

Expected: FAIL because `script.js` does not exist.

- [ ] **Step 3: Write the minimal enhancement script**

Implement a DOMContentLoaded callback that:

```js
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const header = document.querySelector('.site-header');
const toggle = document.querySelector('.menu-toggle');
```

On toggle click, flip `header.classList.toggle('nav-open')` and set `aria-expanded` to the resulting boolean string. Close the menu after a navigation link is clicked. Use a threshold-0.45 `IntersectionObserver` to apply `is-active` to the corresponding nav link. If reduced motion is enabled or `IntersectionObserver` is unavailable, immediately add `is-visible` to all `.reveal` elements; otherwise observe each element and add `is-visible` when intersecting. Do not intercept anchor links or introduce a dependency.

- [ ] **Step 4: Run automated verification**

Run: `npm test && git diff --check && git status --short`

Expected: tests pass, whitespace check is clean, and only intentional project files remain uncommitted.

- [ ] **Step 5: Perform browser QA and commit**

Serve the root with `python3 -m http.server 4173`, then inspect desktop (1440px) and mobile (390px) layouts. Confirm portrait cropping, navigation anchors, menu operation, keyboard focus, LinkedIn target, reduced-motion behavior, and `404.html` link. Commit only after all checks pass:

```bash
git add script.js tests/site-contract.test.mjs
git commit -m "feat: add accessible navigation enhancements"
```

### Task 5: Prepare GitHub Pages handoff

**Files:**
- Modify: `README.md`

**Interfaces:**
- Consumes: root-level static site.
- Produces: documented GitHub Pages publishing steps and local verification command.

- [ ] **Step 1: Write the failing documentation assertion**

```js
test('documents GitHub Pages publishing', async () => {
  const readme = await readFile('README.md', 'utf8');
  assert.match(readme, /GitHub Pages/);
  assert.match(readme, /Settings.*Pages|Settings → Pages/);
  assert.match(readme, /npm test/);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test`

Expected: FAIL because `README.md` does not exist.

- [ ] **Step 3: Write concise publishing instructions**

Create `README.md` explaining that the site is a no-build static site. Include `npm test`, a local `python3 -m http.server 4173` preview command, and GitHub Pages settings: choose **Deploy from a branch**, select the publishing branch, and select the repository root (`/`).

- [ ] **Step 4: Run final validation**

Run: `npm test && git diff --check && find . -maxdepth 2 -type f | sort`

Expected: tests pass, the tree includes root static assets and test/documentation files, and no build artifacts are present.

- [ ] **Step 5: Commit the handoff documentation**

```bash
git add README.md tests/site-contract.test.mjs
git commit -m "docs: add GitHub Pages deployment guide"
```
