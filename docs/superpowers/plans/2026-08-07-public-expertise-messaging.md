# Public Expertise Messaging Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reframe the home page as a concise public statement of Shan Ye's distributed-systems, cloud-infrastructure, and engineering-leadership expertise.

**Architecture:** Keep the existing static one-page structure and Signal Architecture visual system. Update only home-page copy and navigation presentation; retain the existing Snake page and its scripts unchanged. Static contract tests define the required public messaging and prevent product-specific terms from returning.

**Tech Stack:** HTML, CSS, dependency-free browser JavaScript, Node.js built-in test runner.

## Global Constraints

- Preserve `index.html`, `styles.css`, and `script.js` as a dependency-free GitHub Pages site.
- Do not modify Snake gameplay files or behavior.
- Keep LinkedIn as the only external call to action.
- Do not name employers, show logos, include numerical claims, or use product-specific terms including tenancy, subscription, entitlement, commerce, and lifecycle.
- Keep display statements concise and omit terminal punctuation where natural.
- Snake must remain the final navigation link and receive a visible, accessible mint signal treatment without appearing as the active home-page section.

---

### Task 1: Define public-messaging regression coverage

**Files:**
- Modify: `tests/site-contract.test.mjs`

**Interfaces:**
- Consumes: static `index.html` and `styles.css` files through `readFile`.
- Produces: contract assertions that must fail until new home-page copy and Snake navigation styling are implemented.

- [ ] **Step 1: Write the failing test**

In the existing `uses concise, clear display headlines` test, replace the old headline list with:

```js
for (const headline of [
  'Reliable cloud platforms at scale',
  'Foundations built to endure',
  'Scale. Security. Direction',
  'Built for critical systems',
  'Let’s talk systems',
]) {
  assert.match(html, new RegExp(headline.replace(/[.]/g, '\\$&')));
}
```

Then add these tests after it:

```js
test('presents public cloud expertise without product-specific details', async () => {
  const html = await readFile('index.html', 'utf8');

  for (const phrase of [
    'secure, scalable cloud platforms',
    'complex distributed systems',
    'Security and isolation',
    'Mentoring engineers',
    'career growth',
    'company strategy',
  ]) {
    assert.match(html, new RegExp(phrase));
  }

  assert.doesNotMatch(html, /tenancy|subscription|entitlement|commerce|lifecycle/i);
});

test('keeps Snake as the final highlighted navigation link', async () => {
  const [html, css] = await Promise.all([readFile('index.html', 'utf8'), readFile('styles.css', 'utf8')]);

  assert.match(html, /<a class="snake-nav-link" href="snake\.html">Snake<\/a>\s*<\/nav>/);
  assert.match(css, /\.snake-nav-link/);
  assert.match(css, /\.snake-nav-link[^}]*color: var\(--signal\)/s);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
/Users/shanye/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --test tests/site-contract.test.mjs
```

Expected: FAIL because the current copy includes product-specific terms and Snake has neither the final-link structure nor `snake-nav-link` styling.

- [ ] **Step 3: Keep the tests focused**

Do not test pixel values or implementation-only class combinations. The test must protect the user-facing content and final-link behavior while allowing future CSS refinements.

### Task 2: Rewrite the home-page expertise narrative

**Files:**
- Modify: `index.html:6-105`
- Test: `tests/site-contract.test.mjs`

**Interfaces:**
- Consumes: the Task 1 content contract.
- Produces: concise, public-facing page content with the same section IDs and LinkedIn targets used by `script.js` and navigation.

- [ ] **Step 1: Update hero and system-profile copy**

Replace the hero heading and lede with concise public language. Use this copy:

```html
<h1 id="hero-title">Reliable cloud platforms at scale</h1>
<p class="lede">I’m Shan Ye, a senior principal software engineer building secure, scalable cloud platforms for complex distributed systems</p>
```

Replace the system-profile heading and paragraph with:

```html
<h2 id="profile-title">Foundations built to endure</h2>
<p>I design cloud foundations that stay reliable, secure, and understandable as systems, customers, and organizations grow</p>
```

Use facts headed `Focus`, `Mode`, and `Method` whose values communicate distributed systems and cloud infrastructure, cross-functional technical leadership, and clear architecture/operational practice without retired product terms.

- [ ] **Step 2: Update the three expertise cards**

Replace the existing card content with these subject areas and copy:

```html
<span class="card-code">A / DISTRIBUTED</span>
<h3>Distributed systems</h3>
<p>Building dependable services with clear boundaries and safe change at scale</p>

<span class="card-code">B / INFRASTRUCTURE</span>
<h3>Cloud infrastructure</h3>
<p>Creating secure platform foundations with resilience, strong isolation, and operational clarity</p>

<span class="card-code">C / LEADERSHIP</span>
<h3>Engineering leadership</h3>
<p>Mentoring engineers, supporting career growth, aligning technical direction with company strategy, and sharing practical lessons with the engineering community</p>
```

Update the section heading to `Scale. Security. Direction`.

- [ ] **Step 3: Generalize career and connection copy**

Keep the three anonymous career entries and their `NOW`, `PRIOR`, and `FOUNDATION` labels. Rewrite each title and description to describe transferable work in cloud platforms, scalable systems, and customer experiences without product-specific business language. Keep the LinkedIn CTA URLs and target/rel attributes unchanged.

- [ ] **Step 4: Run the content contract**

Run:

```bash
/Users/shanye/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --test tests/site-contract.test.mjs
```

Expected: the public-messaging test remains the only failure because the Snake final-link structure and CSS treatment are not yet updated.

### Task 3: Make Snake a final navigation signal

**Files:**
- Modify: `index.html:16-22`
- Modify: `styles.css:42-47`
- Test: `tests/site-contract.test.mjs`

**Interfaces:**
- Consumes: `snake-nav-link` contract from Task 1 and existing `.site-nav a` styles.
- Produces: a final navigation link with a visible signal treatment that keeps the existing responsive mobile menu behavior intact.

- [ ] **Step 1: Move and mark the Snake link**

Order the links as Profile, Operate, Career, Connect, Snake. Make Snake the last child of the existing navigation and use the exact markup:

```html
<a class="snake-nav-link" href="snake.html">Snake</a>
```

- [ ] **Step 2: Add compact Snake signal styling**

Append a focused rule after the existing `.site-nav` link rules:

```css
.site-nav .snake-nav-link {
  color: var(--signal);
  text-shadow: 0 0 12px rgba(68, 215, 168, .45);
}

.site-nav .snake-nav-link::after { transform: scaleX(1); }
```

Retain `:focus-visible` behavior from the shared navigation styles. Do not add animation; the highlight must respect the site's restrained tone and reduced-motion preference.

- [ ] **Step 3: Run the content contract to verify it passes**

Run:

```bash
/Users/shanye/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --test tests/site-contract.test.mjs
```

Expected: PASS with all static-site contract tests green.

### Task 4: Verify static quality and responsive presentation

**Files:**
- Verify: `index.html`, `styles.css`, `tests/site-contract.test.mjs`

**Interfaces:**
- Consumes: the completed public-messaging content and highlight styles.
- Produces: evidence that the deployed static site remains valid and legible.

- [ ] **Step 1: Run the complete test suite**

Run:

```bash
/Users/shanye/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --test tests/*.test.mjs
```

Expected: PASS with no failed tests.

- [ ] **Step 2: Check whitespace errors**

Run:

```bash
git diff --check
```

Expected: no output and exit code 0.

- [ ] **Step 3: Inspect desktop and mobile pages**

Serve the repository as static files, then inspect the root page at a desktop width and at 390px wide. Confirm the hero copy is readable, no horizontal overflow appears, and Snake remains last in both desktop and expanded mobile navigation.

- [ ] **Step 4: Commit the implementation**

```bash
git add index.html styles.css tests/site-contract.test.mjs docs/superpowers/plans/2026-08-07-public-expertise-messaging.md
git commit -m "feat: emphasize public cloud expertise"
```
