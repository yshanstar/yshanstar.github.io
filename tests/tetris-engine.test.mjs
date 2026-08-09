import assert from 'node:assert/strict';
import test from 'node:test';
import {
  BOARD_HEIGHT,
  BOARD_WIDTH,
  createGame,
  gravityInterval,
  hardDrop,
  resolveClear,
  move,
  rotate,
} from '../tetris-engine.mjs';

const emptyBoard = () => Array.from({ length: BOARD_HEIGHT }, () => Array(BOARD_WIDTH).fill(null));

const boardWithBottomGap = (gapStart, gapWidth) => {
  const board = emptyBoard();
  for (let x = 0; x < BOARD_WIDTH; x += 1) {
    if (x < gapStart || x >= gapStart + gapWidth) board[BOARD_HEIGHT - 1][x] = 'J';
  }
  return board;
};

test('keeps the active piece in place when a horizontal move is blocked', () => {
  const board = emptyBoard();
  board[0][5] = 'J';
  const state = createGame({ board, active: { type: 'O', x: 3, y: 0 } });

  const next = move(state, 1);

  assert.equal(next.active.x, 3);
  assert.equal(state.active.x, 3);
});

test('rotates a T piece clockwise', () => {
  const state = createGame({ active: { type: 'T', x: 3, y: 3 } });

  const next = rotate(state);

  assert.deepEqual(next.active.matrix, [
    [0, 1, 0],
    [0, 1, 1],
    [0, 1, 0],
  ]);
});

test('locks a hard-dropped piece into the board and spawns the next piece', () => {
  const state = createGame({ active: { type: 'O', x: 0, y: 0 }, next: 'I' });

  const next = resolveClear(hardDrop(state));

  assert.equal(next.board[18][0], 'O');
  assert.equal(next.board[19][1], 'O');
  assert.equal(next.active.type, 'I');
});

test('awards 100 points for clearing one row at level one', () => {
  const state = createGame({
    board: boardWithBottomGap(8, 2),
    active: { type: 'O', x: 8, y: 0 },
    next: 'I',
  });

  const next = resolveClear(hardDrop(state));

  assert.equal(next.score, 100);
  assert.equal(next.lines, 1);
  assert.equal(next.level, 1);
  assert.deepEqual(next.clearingRows, [19]);
});

test('awards 800 points for clearing four rows at level one', () => {
  const board = emptyBoard();
  for (let y = 16; y < BOARD_HEIGHT; y += 1) {
    for (let x = 0; x < BOARD_WIDTH - 1; x += 1) board[y][x] = 'L';
  }
  const state = createGame({
    board,
    active: { type: 'I', matrix: [[1], [1], [1], [1]], x: 9, y: 0 },
    next: 'O',
  });

  const next = resolveClear(hardDrop(state));

  assert.equal(next.score, 800);
  assert.equal(next.lines, 4);
  assert.deepEqual(next.clearingRows, [16, 17, 18, 19]);
});

test('increases the level after every ten cleared lines', () => {
  const state = createGame({
    board: boardWithBottomGap(8, 2),
    active: { type: 'O', x: 8, y: 0 },
    next: 'I',
    lines: 9,
    level: 1,
  });

  const next = resolveClear(hardDrop(state));

  assert.equal(next.lines, 10);
  assert.equal(next.level, 2);
});

test('caps gravity at 80 milliseconds for high levels', () => {
  assert.equal(gravityInterval(createGame()), 550);
  assert.equal(gravityInterval(createGame({ level: 99 })), 80);
});

test('ends the game when the next piece cannot spawn', () => {
  const board = emptyBoard();
  board[0][4] = 'Z';
  const state = createGame({
    board,
    active: { type: 'O', x: 0, y: 0 },
    next: 'O',
  });

  const next = hardDrop(state);

  assert.equal(next.status, 'terminated');
});
