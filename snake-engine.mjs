export const GOOD_GROWTH = 2;
export const GOOD_SCORE = 10;
export const INITIAL_INTERVAL = 180;
export const MIN_INTERVAL = 65;
export const INTERVAL_STEP = 12;
export const MIN_LENGTH = 2;

const vectors = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

const opposite = {
  up: 'down',
  down: 'up',
  left: 'right',
  right: 'left',
};

const sameCell = (first, second) => first.x === second.x && first.y === second.y;

const copyCell = (cell) => ({ x: cell.x, y: cell.y });

export function spawnItem(snake, gridSize, random = Math.random) {
  const available = [];

  for (let y = 0; y < gridSize; y += 1) {
    for (let x = 0; x < gridSize; x += 1) {
      if (!snake.some((cell) => cell.x === x && cell.y === y)) available.push({ x, y });
    }
  }

  if (available.length === 0) return null;

  const cell = available[Math.floor(random() * available.length)];
  return { ...cell, type: random() < .7 ? 'good' : 'bad' };
}

export function createGame(options = {}) {
  const gridSize = options.gridSize ?? 20;
  const snake = (options.snake ?? [{ x: 10, y: 10 }, { x: 9, y: 10 }]).map(copyCell);

  return {
    gridSize,
    snake,
    direction: options.direction ?? 'right',
    queuedDirection: options.queuedDirection ?? null,
    item: options.item ?? spawnItem(snake, gridSize, options.random ?? Math.random),
    score: options.score ?? 0,
    interval: options.interval ?? INITIAL_INTERVAL,
    status: options.status ?? 'running',
    effect: options.effect ?? null,
  };
}

export function queueDirection(state, direction) {
  if (!vectors[direction] || direction === state.direction || direction === opposite[state.direction]) {
    return { ...state };
  }

  return { ...state, queuedDirection: direction };
}

export function step(state, random = Math.random) {
  if (state.status !== 'running') return { ...state, snake: state.snake.map(copyCell) };

  const direction = state.queuedDirection ?? state.direction;
  const vector = vectors[direction];
  const currentHead = state.snake[0];
  const head = {
    x: (currentHead.x + vector.x + state.gridSize) % state.gridSize,
    y: (currentHead.y + vector.y + state.gridSize) % state.gridSize,
  };
  const ateItem = state.item && sameCell(head, state.item);
  const isGood = ateItem && state.item.type === 'good';
  let snake = isGood
    ? [head, ...state.snake.map(copyCell), copyCell(state.snake[state.snake.length - 1])]
    : [head, ...state.snake.slice(0, -1).map(copyCell)];

  if (snake.slice(1).some((cell) => sameCell(head, cell))) {
    return { ...state, snake, direction, queuedDirection: null, status: 'terminated', effect: null };
  }

  let score = state.score;
  let interval = state.interval;
  let effect = null;

  if (ateItem) {
    if (isGood) {
      score += GOOD_SCORE;
      interval = Math.max(MIN_INTERVAL, interval - INTERVAL_STEP);
      effect = 'growth';
    } else {
      const removal = 1 + Math.floor(random() * 3);
      snake = snake.slice(0, Math.max(MIN_LENGTH, snake.length - removal));
      score = Math.max(0, score - 5);
      effect = 'shrink';
    }
  }

  return {
    ...state,
    snake,
    direction,
    queuedDirection: null,
    item: ateItem ? spawnItem(snake, state.gridSize, random) : state.item,
    score,
    interval,
    effect,
  };
}
