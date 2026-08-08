export const GOOD_GROWTH = 2;
export const GOOD_SCORE = 10;
export const INITIAL_INTERVAL = 180;
export const MIN_INTERVAL = 65;
export const INTERVAL_STEP = 12;
export const MIN_LENGTH = 2;
export const INITIAL_ITEMS = 3;
export const MIN_ITEMS = 1;
export const MAX_ITEMS = 10;
export const ITEM_MIN_LIFETIME = 5_000;
export const ITEM_MAX_LIFETIME = 10_000;
export const SPAWN_MIN_DELAY = 1_000;
export const SPAWN_MAX_DELAY = 3_000;

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
const copyItem = (item) => ({ ...item });
const randomBetween = (min, max, random) => min + Math.floor(random() * (max - min + 1));

export function spawnItem(snake, items, gridSize, now, random = Math.random) {
  const available = [];

  for (let y = 0; y < gridSize; y += 1) {
    for (let x = 0; x < gridSize; x += 1) {
      const occupiedBySnake = snake.some((cell) => cell.x === x && cell.y === y);
      const occupiedByItem = items.some((item) => item.x === x && item.y === y);
      if (!occupiedBySnake && !occupiedByItem) available.push({ x, y });
    }
  }

  if (available.length === 0) return null;

  const cell = available[Math.floor(random() * available.length)];
  return {
    ...cell,
    type: random() < .7 ? 'good' : 'bad',
    expiresAt: now + randomBetween(ITEM_MIN_LIFETIME, ITEM_MAX_LIFETIME, random),
  };
}

function createItems(snake, gridSize, now, random, count = INITIAL_ITEMS) {
  const items = [];

  while (items.length < count) {
    const item = spawnItem(snake, items, gridSize, now, random);
    if (!item) break;
    items.push(item);
  }

  return items;
}

function reconcileItems(snake, items, gridSize, nextSpawnAt, now, random) {
  const activeItems = items.filter((item) => item.expiresAt > now).map(copyItem);

  while (activeItems.length < MIN_ITEMS) {
    const item = spawnItem(snake, activeItems, gridSize, now, random);
    if (!item) break;
    activeItems.push(item);
  }

  let scheduledSpawnAt = nextSpawnAt;
  if (now >= scheduledSpawnAt && activeItems.length < MAX_ITEMS) {
    const item = spawnItem(snake, activeItems, gridSize, now, random);
    if (item) activeItems.push(item);
    scheduledSpawnAt = now + randomBetween(SPAWN_MIN_DELAY, SPAWN_MAX_DELAY, random);
  }

  return { items: activeItems, nextSpawnAt: scheduledSpawnAt };
}

export function createGame(options = {}) {
  const gridSize = options.gridSize ?? 20;
  const snake = (options.snake ?? [{ x: 10, y: 10 }, { x: 9, y: 10 }]).map(copyCell);
  const now = options.now ?? Date.now();
  const random = options.random ?? Math.random;

  return {
    gridSize,
    snake,
    direction: options.direction ?? 'right',
    queuedDirection: options.queuedDirection ?? null,
    items: (options.items ?? createItems(snake, gridSize, now, random)).map(copyItem),
    nextSpawnAt: options.nextSpawnAt ?? now + randomBetween(SPAWN_MIN_DELAY, SPAWN_MAX_DELAY, random),
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

export function step(state, random = Math.random, now = Date.now()) {
  if (state.status !== 'running') return { ...state, snake: state.snake.map(copyCell) };

  const direction = state.queuedDirection ?? state.direction;
  const vector = vectors[direction];
  const currentHead = state.snake[0];
  const head = {
    x: (currentHead.x + vector.x + state.gridSize) % state.gridSize,
    y: (currentHead.y + vector.y + state.gridSize) % state.gridSize,
  };
  const activeItems = state.items.filter((item) => item.expiresAt > now);
  const eatenItem = activeItems.find((item) => sameCell(head, item));
  const isGood = eatenItem?.type === 'good';
  let snake = isGood
    ? [head, ...state.snake.map(copyCell), copyCell(state.snake[state.snake.length - 1])]
    : [head, ...state.snake.slice(0, -1).map(copyCell)];

  if (snake.slice(1).some((cell) => sameCell(head, cell))) {
    return {
      ...state,
      snake,
      items: state.items.map(copyItem),
      direction,
      queuedDirection: null,
      status: 'terminated',
      effect: null,
    };
  }

  let score = state.score;
  let interval = state.interval;
  let effect = null;

  if (eatenItem) {
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

  const field = reconcileItems(
    snake,
    eatenItem ? activeItems.filter((item) => item !== eatenItem) : activeItems,
    state.gridSize,
    state.nextSpawnAt,
    now,
    random,
  );

  return {
    ...state,
    snake,
    direction,
    queuedDirection: null,
    items: field.items,
    nextSpawnAt: field.nextSpawnAt,
    score,
    interval,
    effect,
  };
}
