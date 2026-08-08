import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import test from 'node:test';

const requiredFiles = [
  'index.html',
  'styles.css',
  'script.js',
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

  assert.match(html, /Engineering systems that make cloud move\./);
  assert.match(html, /https:\/\/www\.linkedin\.com\/in\/shanye\//);
  assert.match(html, /target="_blank"/);
  assert.match(html, /rel="noreferrer"/);
  assert.doesNotMatch(html, /yshanstar1988@gmail\.com|415.?684.?3217|Oracle|Microsoft|Amazon/);
});
