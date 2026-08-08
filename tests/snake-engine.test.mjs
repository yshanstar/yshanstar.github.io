import assert from 'node:assert/strict';
import test from 'node:test';
import { createGame, queueDirection, spawnItem, step } from '../snake-engine.mjs';

test('wraps across every board edge', () => {
  const state = createGame({
    gridSize: 8,
    snake: [{ x: 7, y: 3 }, { x: 6, y: 3 }],
    direction: 'right',
    item: { x: 2, y: 2, type: 'good' },
  });

  assert.deepEqual(step(state, () => .2).snake[0], { x: 0, y: 3 });
});

test('rejects an immediate reverse turn', () => {
  const state = createGame({ direction: 'right' });

  assert.equal(queueDirection(state, 'left').queuedDirection, null);
});

test('good items grow by two, score, and accelerate', () => {
  const state = createGame({
    snake: [{ x: 2, y: 2 }, { x: 1, y: 2 }],
    direction: 'right',
    item: { x: 3, y: 2, type: 'good' },
  });
  const next = step(state, () => .5);

  assert.equal(next.snake.length, 4);
  assert.equal(next.score, 10);
  assert.ok(next.interval < state.interval);
  assert.equal(next.effect, 'growth');
});

test('bad items shrink by a random amount but preserve two segments', () => {
  const state = createGame({
    snake: [{ x: 3, y: 2 }, { x: 2, y: 2 }, { x: 1, y: 2 }],
    direction: 'right',
    item: { x: 4, y: 2, type: 'bad' },
  });
  const next = step(state, () => .99);

  assert.equal(next.snake.length, 2);
  assert.equal(next.effect, 'shrink');
});

test('spawns items outside occupied cells and ends on self-collision', () => {
  const item = spawnItem([{ x: 0, y: 0 }], 3, () => .01);

  assert.notDeepEqual(item, { x: 0, y: 0 });

  const state = createGame({
    snake: [{ x: 2, y: 1 }, { x: 1, y: 1 }, { x: 1, y: 2 }, { x: 2, y: 2 }, { x: 3, y: 2 }],
    direction: 'down',
  });

  assert.equal(step(state, () => .5).status, 'terminated');
});
