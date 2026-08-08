import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import test from 'node:test';

const requiredFiles = [
  'index.html',
  'assets/profile.jpg',
  '404.html',
];
const requiredAnchors = ['#top', '#profile', '#operate', '#career', '#connect'];

test('ships the complete static site contract', async () => {
  await Promise.all(requiredFiles.map((file) => access(file)));
  const html = await readFile('index.html', 'utf8');

  for (const anchor of requiredAnchors) {
    assert.match(html, new RegExp(`href="${anchor}"|id="${anchor.slice(1)}"`));
  }

  assert.match(html, /Reliable cloud platforms at scale/);
  assert.match(html, /https:\/\/www\.linkedin\.com\/in\/shanye\//);
  assert.match(html, /target="_blank"/);
  assert.match(html, /rel="noreferrer"/);
  assert.doesNotMatch(html, /yshanstar1988@gmail\.com|415.?684.?3217|Oracle|Microsoft|Amazon/);
});

test('uses concise, clear display headlines', async () => {
  const html = await readFile('index.html', 'utf8');

  for (const headline of [
    'Reliable cloud platforms at scale',
    'Foundations built to endure',
    'Scale. Security. Direction',
    'Built for critical systems',
    'Let’s talk systems',
  ]) {
    assert.match(html, new RegExp(headline.replace(/[.]/g, '\\$&')));
  }

  assert.doesNotMatch(html, /Engineering systems that make cloud move\./);
});

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

test('uses semantic sections and an accessible portrait', async () => {
  const html = await readFile('index.html', 'utf8');

  for (const id of ['top', 'profile', 'operate', 'career', 'connect']) {
    assert.match(html, new RegExp(`<section[^>]*id="${id}"|<main[^>]*id="${id}"`));
  }

  assert.match(html, /<img[^>]+src="assets\/profile\.jpg"[^>]+alt="Shan Ye/);
  assert.match(html, /<button[^>]+class="menu-toggle"[^>]+aria-expanded="false"/);
  assert.match(html, /<nav[^>]+aria-label="Primary"/);
});

test('provides responsive, accessible Signal Architecture styling', async () => {
  const css = await readFile('styles.css', 'utf8');

  for (const token of [
    '--ink:',
    '--signal:',
    '@media (max-width:',
    '@media (prefers-reduced-motion: reduce)',
    ':focus-visible',
  ]) {
    assert.match(css, new RegExp(token.replace(/[()]/g, '\\$&')));
  }
});

test('keeps enhancements dependency-free and motion-aware', async () => {
  const js = await readFile('script.js', 'utf8');

  assert.match(js, /matchMedia\('\(prefers-reduced-motion: reduce\)'\)/);
  assert.match(js, /aria-expanded/);
  assert.match(js, /IntersectionObserver/);
  assert.doesNotMatch(js, /import |require\(/);
});

test('ships all final static assets', async () => {
  await Promise.all(
    ['index.html', 'styles.css', 'script.js', 'assets/profile.jpg', '404.html'].map((file) => access(file)),
  );
});

test('documents GitHub Pages publishing', async () => {
  const readme = await readFile('README.md', 'utf8');

  assert.match(readme, /GitHub Pages/);
  assert.match(readme, /Settings.*Pages|Settings → Pages/);
  assert.match(readme, /npm test/);
});

test('ships an accessible standalone Snake game page without touching the home page', async () => {
  const [snake, home] = await Promise.all([readFile('snake.html', 'utf8'), readFile('index.html', 'utf8')]);

  assert.match(snake, /<canvas[^>]+id="game-board"[^>]+aria-label="Snake game board"/);
  assert.match(snake, /id="snake-score"/);
  assert.match(snake, /href="index\.html"/);
  assert.doesNotMatch(snake, /direction-pad|direction-up/);
  assert.doesNotMatch(home, /id="game-board"|Snake game/);
});

test('includes swipe-based mobile input and module-based Snake behavior', async () => {
  const [css, js] = await Promise.all([readFile('snake.css', 'utf8'), readFile('snake.js', 'utf8')]);

  assert.match(css, /@media \(max-width: 760px\)/);
  assert.doesNotMatch(css, /\.direction-pad/);
  assert.match(js, /keydown/);
  assert.match(js, /requestDirection/);
  assert.match(js, /requestAnimationFrame/);
});

test('documents the Snake route', async () => {
  const readme = await readFile('README.md', 'utf8');

  assert.match(readme, /snake\.html/);
  assert.match(readme, /Arrow keys/);
  assert.match(readme, /W\/A\/S\/D/);
});

test('links the home navigation to Snake and supplies accessible game modes', async () => {
  const [home, snake] = await Promise.all([readFile('index.html', 'utf8'), readFile('snake.html', 'utf8')]);

  assert.match(home, /<a class="snake-nav-link" href="snake\.html">Snake<\/a>/);
  assert.match(snake, /<h1 id="game-title">Snake<\/h1>/);
  assert.match(snake, /id="game-menu"/);
  assert.match(snake, /id="start-game"/);
  assert.match(snake, /id="start-game"[^>]*>Start<\/button>/);
  assert.match(snake, /id="game-over"[^>]+role="dialog"[^>]+aria-modal="true"/);
  assert.match(snake, /id="play-again"/);
  assert.match(snake, /id="return-menu"/);
});

test('implements terminal mode and deliberate board swipe steering', async () => {
  const js = await readFile('snake.js', 'utf8');

  for (const token of ['setMode', 'returnToMenu', 'touchstart', 'touchmove', 'touchend', 'preventDefault', 'play-again']) {
    assert.match(js, new RegExp(token));
  }
});

test('styles the terminal overlay and swipe-only mobile play', async () => {
  const css = await readFile('snake.css', 'utf8');

  assert.match(css, /\.game-over/);
  assert.match(css, /\.game-menu/);
  assert.match(css, /touch-action: pan-y/);
  assert.doesNotMatch(css, /\.direction-pad/);
});

test('places the Start menu over the visible Snake board', async () => {
  const snake = await readFile('snake.html', 'utf8');

  assert.match(snake, /<section class="game-shell"[^>]*>[\s\S]*id="game-board"[\s\S]*id="game-menu"/);
  assert.doesNotMatch(snake, /<section id="game-menu"[\s\S]*<section class="game-shell"/);
});

test('renders a static board preview while the Snake menu is open', async () => {
  const [css, js] = await Promise.all([readFile('snake.css', 'utf8'), readFile('snake.js', 'utf8')]);

  assert.match(css, /\.game-menu[^{]*\{[^}]*position: absolute/s);
  assert.match(js, /if \(mode === 'menu'\) \{[\s\S]*fitCanvas\(\);[\s\S]*draw\(\);/);
  assert.doesNotMatch(js, /shell\.hidden = mode === 'menu'/);
});
