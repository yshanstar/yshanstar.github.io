import { INITIAL_INTERVAL, createGame, queueDirection, step } from './snake-engine.mjs';

const canvas = document.querySelector('#game-board');
const context = canvas.getContext('2d');
const shell = document.querySelector('.game-shell');
const scoreOutput = document.querySelector('#snake-score');
const speedOutput = document.querySelector('#snake-speed');
const statusOutput = document.querySelector('#snake-status');
const message = document.querySelector('#game-message');
const restartButton = document.querySelector('#restart-game');
const gameMenu = document.querySelector('#game-menu');
const gameOver = document.querySelector('#game-over');
const startButton = document.querySelector('#start-game');
const playAgainButton = document.querySelector('#play-again');
const returnMenuButton = document.querySelector('#return-menu');
const finalScore = document.querySelector('#final-score');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let state = createGame();
let timerId;
let animationId;

function cellSize() {
  return canvas.getBoundingClientRect().width / state.gridSize;
}

function fitCanvas() {
  const size = canvas.getBoundingClientRect().width;
  const ratio = window.devicePixelRatio || 1;
  canvas.width = Math.round(size * ratio);
  canvas.height = Math.round(size * ratio);
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
}

function draw({ entities = true } = {}) {
  const size = canvas.getBoundingClientRect().width;
  const unit = cellSize();
  context.clearRect(0, 0, size, size);
  context.fillStyle = '#0d1c2e';
  context.fillRect(0, 0, size, size);
  context.strokeStyle = '#254866';
  context.lineWidth = 1;

  for (let index = 0; index <= state.gridSize; index += 1) {
    const line = Math.round(index * unit) + .5;
    context.beginPath();
    context.moveTo(line, 0);
    context.lineTo(line, size);
    context.moveTo(0, line);
    context.lineTo(size, line);
    context.stroke();
  }

  if (entities) {
    state.items.forEach((item) => {
      const centerX = (item.x + .5) * unit;
      const centerY = (item.y + .5) * unit;
      context.fillStyle = item.type === 'good' ? '#44d7a8' : '#f6ce71';
      context.beginPath();
      context.arc(centerX, centerY, unit * .24, 0, Math.PI * 2);
      context.fill();
    });

    state.snake.forEach((cell, index) => {
      context.fillStyle = index === 0 ? '#e8f1fb' : '#44d7a8';
      context.fillRect(cell.x * unit + 2, cell.y * unit + 2, unit - 4, unit - 4);
    });
  }
}

function updateTelemetry() {
  scoreOutput.value = String(state.score).padStart(3, '0');
  speedOutput.value = String(1 + Math.round((INITIAL_INTERVAL - state.interval) / 12)).padStart(2, '0');
  statusOutput.value = state.status === 'terminated' ? 'ENDED' : 'RUN';
  message.textContent = state.status === 'terminated'
    ? 'RUN TERMINATED — restart when ready'
    : 'RUN ACTIVE — collect the signals';
}

function animateEffect(effect) {
  if (!effect || reduceMotion) return;
  shell.classList.remove('effect-growth', 'effect-shrink');
  cancelAnimationFrame(animationId);
  animationId = requestAnimationFrame(() => {
    shell.classList.add(`effect-${effect}`);
    window.setTimeout(() => shell.classList.remove(`effect-${effect}`), 420);
  });
}

function scheduleTick() {
  window.clearTimeout(timerId);
  if (state.status === 'running') timerId = window.setTimeout(tick, state.interval);
}

function tick() {
  state = step(state, Math.random, Date.now());
  draw();
  updateTelemetry();
  animateEffect(state.effect);
  if (state.status === 'terminated') {
    finalScore.value = String(state.score).padStart(3, '0');
    setMode('terminated');
  } else {
    scheduleTick();
  }
}

function requestDirection(direction) {
  if (state.status !== 'running') return;
  state = queueDirection(state, direction);
}

function setMode(mode) {
  gameMenu.hidden = mode !== 'menu';
  shell.dataset.mode = mode;
  shell.hidden = false;
  gameOver.hidden = mode !== 'terminated';

  if (mode === 'menu') {
    fitCanvas();
    draw({ entities: false });
    window.setTimeout(() => startButton.focus(), 0);
  }

  if (mode === 'terminated') window.setTimeout(() => playAgainButton.focus(), 0);
}

function startRun() {
  window.clearTimeout(timerId);
  state = createGame();
  setMode('running');
  fitCanvas();
  draw();
  updateTelemetry();
  scheduleTick();
  canvas.focus();
}

function returnToMenu() {
  window.clearTimeout(timerId);
  state = createGame();
  setMode('menu');
}

const keyDirections = {
  ArrowUp: 'up', w: 'up', W: 'up',
  ArrowDown: 'down', s: 'down', S: 'down',
  ArrowLeft: 'left', a: 'left', A: 'left',
  ArrowRight: 'right', d: 'right', D: 'right',
};

document.addEventListener('keydown', (event) => {
  const direction = keyDirections[event.key];
  if (!direction || event.target.closest('input, textarea, select')) return;
  event.preventDefault();
  requestDirection(direction);
});

let touchStart = null;
let swipeResolved = false;

canvas.addEventListener('touchstart', (event) => {
  if (state.status === 'running') event.preventDefault();
  const touch = event.touches[0];
  touchStart = { x: touch.clientX, y: touch.clientY };
  swipeResolved = false;
}, { passive: false });

canvas.addEventListener('touchmove', (event) => {
  if (!touchStart) return;
  if (state.status === 'running') event.preventDefault();
  const touch = event.touches[0];
  const deltaX = touch.clientX - touchStart.x;
  const deltaY = touch.clientY - touchStart.y;
  const distance = Math.max(Math.abs(deltaX), Math.abs(deltaY));

  if (!swipeResolved && distance >= 24) {
    requestDirection(Math.abs(deltaX) > Math.abs(deltaY) ? (deltaX > 0 ? 'right' : 'left') : (deltaY > 0 ? 'down' : 'up'));
    swipeResolved = true;
  }

}, { passive: false });

canvas.addEventListener('touchend', () => { touchStart = null; swipeResolved = false; });
canvas.addEventListener('touchcancel', () => { touchStart = null; swipeResolved = false; });

restartButton.addEventListener('click', startRun);
startButton.addEventListener('click', startRun);
playAgainButton.addEventListener('click', startRun);
returnMenuButton.addEventListener('click', returnToMenu);
window.addEventListener('resize', () => {
  fitCanvas();
  draw({ entities: shell.dataset.mode !== 'menu' });
});

window.__snakeGame = { get state() { return state; }, startRun, returnToMenu, requestDirection };
setMode('menu');
