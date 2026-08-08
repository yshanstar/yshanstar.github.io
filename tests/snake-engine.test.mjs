import assert from 'node:assert/strict';
import test from 'node:test';
import { createGame, queueDirection, spawnItem, step } from '../snake-engine.mjs';

test('wraps across every board edge', () => {
  const state = createGame({
    gridSize: 8,
    snake: [{ x: 7, y: 3 }, { x: 6, y: 3 }],
    direction: 'right',
    items: [{ x: 2, y: 2, type: 'good', expiresAt: 10_000 }],
  });

  assert.deepEqual(step(state, () => .2, 100).snake[0], { x: 0, y: 3 });
});

test('rejects an immediate reverse turn', () => {
  const state = createGame({ direction: 'right' });

  assert.equal(queueDirection(state, 'left').queuedDirection, null);
});

test('good items grow by two, score, and accelerate', () => {
  const state = createGame({
    now: 0,
    snake: [{ x: 2, y: 2 }, { x: 1, y: 2 }],
    direction: 'right',
    items: [{ x: 3, y: 2, type: 'good', expiresAt: 10_000 }],
  });
  const next = step(state, () => .5, 100);

  assert.equal(next.snake.length, 4);
  assert.equal(next.score, 10);
  assert.ok(next.interval < state.interval);
  assert.equal(next.effect, 'growth');
});

test('bad items shrink by a random amount but preserve two segments', () => {
  const state = createGame({
    now: 0,
    snake: [{ x: 3, y: 2 }, { x: 2, y: 2 }, { x: 1, y: 2 }],
    direction: 'right',
    items: [{ x: 4, y: 2, type: 'bad', expiresAt: 10_000 }],
  });
  const next = step(state, () => .99, 100);

  assert.equal(next.snake.length, 2);
  assert.equal(next.effect, 'shrink');
});

test('spawns items outside occupied cells and ends on self-collision', () => {
  const item = spawnItem([{ x: 0, y: 0 }], [], 3, 0, () => .01);

  assert.notDeepEqual(item, { x: 0, y: 0 });

  const state = createGame({
    snake: [{ x: 2, y: 1 }, { x: 1, y: 1 }, { x: 1, y: 2 }, { x: 2, y: 2 }, { x: 3, y: 2 }],
    direction: 'down',
  });

  assert.equal(step(state, () => .5, 100).status, 'terminated');
});

test('starts with three independent, non-overlapping items', () => {
  const state = createGame({ gridSize: 8, now: 0, random: () => .2 });

  assert.equal(state.items.length, 3);
  assert.equal(new Set(state.items.map(({ x, y }) => `${x},${y}`)).size, 3);
  assert.ok(state.items.every((item) => item.expiresAt >= 5_000 && item.expiresAt <= 10_000));
});

test('preserves unrelated items when one item is eaten', () => {
  const state = createGame({
    now: 0,
    nextSpawnAt: 10_000,
    snake: [{ x: 2, y: 2 }, { x: 1, y: 2 }],
    direction: 'right',
    items: [
      { x: 3, y: 2, type: 'good', expiresAt: 10_000 },
      { x: 6, y: 6, type: 'bad', expiresAt: 10_000 },
    ],
  });
  const next = step(state, () => .5, 100);

  assert.ok(next.items.some((item) => item.x === 6 && item.y === 6 && item.type === 'bad'));
});

test('expires signals and keeps the field between one and ten items', () => {
  const state = createGame({
    now: 0,
    nextSpawnAt: 9_999,
    items: [{ x: 7, y: 7, type: 'good', expiresAt: 1 }],
  });
  const next = step(state, () => .2, 2);

  assert.ok(next.items.length >= 1);
  assert.ok(next.items.length <= 10);
  assert.ok(next.items.every((item) => item.expiresAt > 2));
});

test('never spawns an item on the snake or an active signal', () => {
  const snake = [{ x: 0, y: 0 }];
  const items = [{ x: 1, y: 0, type: 'good', expiresAt: 10_000 }];
  const item = spawnItem(snake, items, 3, 0, () => .01);

  assert.notDeepEqual({ x: item.x, y: item.y }, { x: 0, y: 0 });
  assert.notDeepEqual({ x: item.x, y: item.y }, { x: 1, y: 0 });
});

test('does not exceed ten active items when a scheduled spawn is due', () => {
  const items = Array.from({ length: 10 }, (_, index) => ({
    x: index,
    y: 0,
    type: 'good',
    expiresAt: 10_000,
  }));
  const state = createGame({ now: 0, nextSpawnAt: 0, items });
  const next = step(state, () => .2, 100);

  assert.equal(next.items.length, 10);
});
