export const BOARD_WIDTH = 10;
export const BOARD_HEIGHT = 20;

const PIECES = {
  I: [[1, 1, 1, 1]],
  J: [[1, 0, 0], [1, 1, 1], [0, 0, 0]],
  L: [[0, 0, 1], [1, 1, 1], [0, 0, 0]],
  O: [[1, 1], [1, 1]],
  S: [[0, 1, 1], [1, 1, 0], [0, 0, 0]],
  T: [[0, 1, 0], [1, 1, 1], [0, 0, 0]],
  Z: [[1, 1, 0], [0, 1, 1], [0, 0, 0]],
};

const PIECE_TYPES = Object.keys(PIECES);
const LINE_SCORES = { 1: 100, 2: 300, 3: 500, 4: 800 };

const emptyBoard = () => Array.from({ length: BOARD_HEIGHT }, () => Array(BOARD_WIDTH).fill(null));
const copyBoard = (board) => board.map((row) => row.slice());
const copyMatrix = (matrix) => matrix.map((row) => row.slice());
const nextPieceType = (type) => PIECE_TYPES[(PIECE_TYPES.indexOf(type) + 1) % PIECE_TYPES.length];
export const pieceMatrix = (type) => copyMatrix(PIECES[type]);

function createActive(piece = {}) {
  const type = piece.type ?? 'T';
  const matrix = copyMatrix(piece.matrix ?? PIECES[type]);

  return {
    type,
    matrix,
    x: piece.x ?? Math.floor((BOARD_WIDTH - matrix[0].length) / 2),
    y: piece.y ?? 0,
  };
}

function copyActive(active) {
  return active ? { ...active, matrix: copyMatrix(active.matrix) } : null;
}

function copyState(state, changes = {}) {
  return {
    ...state,
    board: copyBoard(state.board),
    active: copyActive(state.active),
    clearingRows: state.clearingRows.slice(),
    ...changes,
  };
}

function collides(board, active) {
  return active.matrix.some((row, rowIndex) => row.some((cell, columnIndex) => {
    if (!cell) return false;
    const x = active.x + columnIndex;
    const y = active.y + rowIndex;
    return x < 0 || x >= BOARD_WIDTH || y >= BOARD_HEIGHT || (y >= 0 && board[y][x] !== null);
  }));
}

function rotateMatrix(matrix) {
  return matrix[0].map((_, columnIndex) => matrix.map((row) => row[columnIndex]).reverse());
}

function placePiece(board, active) {
  const placed = copyBoard(board);
  active.matrix.forEach((row, rowIndex) => row.forEach((cell, columnIndex) => {
    if (!cell) return;
    const y = active.y + rowIndex;
    const x = active.x + columnIndex;
    if (y >= 0) placed[y][x] = active.type;
  }));
  return placed;
}

function clearLines(board) {
  const clearingRows = [];
  const retainedRows = [];

  board.forEach((row, index) => {
    if (row.every((cell) => cell !== null)) clearingRows.push(index);
    else retainedRows.push(row);
  });

  return {
    clearingRows,
    board: [
      ...Array.from({ length: clearingRows.length }, () => Array(BOARD_WIDTH).fill(null)),
      ...retainedRows.map((row) => row.slice()),
    ],
  };
}

function lockAndSpawn(state) {
  const lockedBoard = placePiece(state.board, state.active);
  const cleared = clearLines(lockedBoard);
  if (cleared.clearingRows.length) {
    return copyState(state, { board: lockedBoard, active: null, status: 'clearing', clearingRows: cleared.clearingRows });
  }
  return spawnNext(copyState(state, { board: lockedBoard, clearingRows: [] }));
}

function spawnNext(state) {
  const active = createActive({ type: state.queue[0] });
  const queue = [...state.queue.slice(1), nextPieceType(state.queue[state.queue.length - 1])];
  const status = collides(state.board, active) ? 'terminated' : 'running';
  return copyState(state, { active, queue, status });
}

export function resolveClear(state) {
  if (state.status !== 'clearing') return copyState(state);
  const cleared = clearLines(state.board);
  const lines = state.lines + cleared.clearingRows.length;
  const level = Math.floor(lines / 10) + 1;
  return spawnNext(copyState(state, {
    board: cleared.board,
    score: state.score + (LINE_SCORES[cleared.clearingRows.length] ?? 0) * state.level,
    lines,
    level,
    clearingRows: cleared.clearingRows,
  }));
}

export function createGame(options = {}) {
  const active = createActive(options.active);
  const queue = options.queue ?? [options.next ?? 'I', 'J', 'L'];

  return {
    board: copyBoard(options.board ?? emptyBoard()),
    active,
    queue: queue.slice(0, 3),
    score: options.score ?? 0,
    lines: options.lines ?? 0,
    level: options.level ?? 1,
    status: options.status ?? 'running',
    clearingRows: (options.clearingRows ?? []).slice(),
  };
}

export function move(state, dx) {
  if (state.status !== 'running') return copyState(state);

  const active = { ...copyActive(state.active), x: state.active.x + dx };
  if (collides(state.board, active)) return copyState(state, { clearingRows: [] });

  return copyState(state, { active, clearingRows: [] });
}

export function rotate(state) {
  if (state.status !== 'running') return copyState(state);

  const matrix = rotateMatrix(state.active.matrix);
  for (const adjustment of [0, -1, 1, -2, 2]) {
    const active = { ...copyActive(state.active), matrix, x: state.active.x + adjustment };
    if (!collides(state.board, active)) return copyState(state, { active, clearingRows: [] });
  }

  return copyState(state, { clearingRows: [] });
}

export function softDrop(state) {
  if (state.status !== 'running') return copyState(state);

  const active = { ...copyActive(state.active), y: state.active.y + 1 };
  if (collides(state.board, active)) return lockAndSpawn(state);

  return copyState(state, { active, clearingRows: [] });
}

export function hardDrop(state) {
  if (state.status !== 'running') return copyState(state);

  let active = copyActive(state.active);
  while (!collides(state.board, { ...active, y: active.y + 1 })) {
    active = { ...active, y: active.y + 1 };
  }

  return lockAndSpawn(copyState(state, { active, clearingRows: [] }));
}

export function tick(state) {
  return softDrop(state);
}

export function gravityInterval(state) {
  return Math.max(80, 800 - (state.level - 1) * 60);
}
