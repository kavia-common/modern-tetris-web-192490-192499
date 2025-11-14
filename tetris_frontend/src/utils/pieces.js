import { BOARD_WIDTH } from './constants';

// Definitions for tetrominoes in spawn rotation (0)
const TETROMINOES = {
  I: {
    colorId: 1,
    shape: [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
  },
  O: {
    colorId: 2,
    shape: [
      [0, 2, 2, 0],
      [0, 2, 2, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
  },
  T: {
    colorId: 3,
    shape: [
      [0, 3, 0],
      [3, 3, 3],
      [0, 0, 0],
    ],
  },
  S: {
    colorId: 4,
    shape: [
      [0, 4, 4],
      [4, 4, 0],
      [0, 0, 0],
    ],
  },
  Z: {
    colorId: 5,
    shape: [
      [5, 5, 0],
      [0, 5, 5],
      [0, 0, 0],
    ],
  },
  J: {
    colorId: 6,
    shape: [
      [6, 0, 0],
      [6, 6, 6],
      [0, 0, 0],
    ],
  },
  L: {
    colorId: 7,
    shape: [
      [0, 0, 7],
      [7, 7, 7],
      [0, 0, 0],
    ],
  },
};

function cloneMatrix(m) {
  return m.map(r => [...r]);
}

// Rotate matrix 90 degrees clockwise
function rotateMatrixCW(m) {
  const rows = m.length;
  const cols = m[0].length;
  const rotated = Array.from({ length: cols }, () => Array(rows).fill(0));
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      rotated[x][rows - 1 - y] = m[y][x] ? m[y][x] : 0;
    }
  }
  return rotated;
}

// Generate rotation states for each piece
function buildRotations(shape) {
  const r0 = cloneMatrix(shape);
  const r1 = rotateMatrixCW(r0);
  const r2 = rotateMatrixCW(r1);
  const r3 = rotateMatrixCW(r2);
  return [r0, r1, r2, r3];
}

const ROTATIONS = {};
Object.keys(TETROMINOES).forEach(k => {
  ROTATIONS[k] = buildRotations(TETROMINOES[k].shape);
});

// PUBLIC_INTERFACE
export function createBagQueue() {
  /** Create a shuffled 7-bag queue of tetromino entries. */
  const bag = Object.keys(TETROMINOES);
  for (let i = bag.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [bag[i], bag[j]] = [bag[j], bag[i]];
  }
  // Represent queue as array of piece entries
  return bag.map(k => ({
    key: k,
    colorId: TETROMINOES[k].colorId,
    rotations: ROTATIONS[k],
  }));
}

// PUBLIC_INTERFACE
export function getPieceFromQueue(queue) {
  /** Pop next piece from queue; if queue exhausted, append a new 7-bag. */
  if (!queue || queue.length === 0) {
    const nb = createBagQueue();
    const next = nb[0];
    const remain = nb.slice(1);
    return [
      { colorId: next.colorId, shape: next.rotations[0], rotations: next.rotations },
      remain,
    ];
  }
  const next = queue[0];
  const remain = queue.slice(1);
  const ensureQueue = remain.length === 0 ? remain.concat(createBagQueue()) : remain;
  return [
    { colorId: next.colorId, shape: next.rotations[0], rotations: next.rotations },
    ensureQueue,
  ];
}

// PUBLIC_INTERFACE
export function rotatePiece(rotations, currentShape, dir) {
  /** Given rotation states and current shape matrix, return next rotation by dir (+1 or -1). */
  const idx = rotations.findIndex(r => matricesEqual(r, currentShape));
  const nextIdx = (idx + (dir > 0 ? 1 : -1) + 4) % 4;
  return rotations[nextIdx];
}

function matricesEqual(a, b) {
  if (!a || !b) return false;
  if (a.length !== b.length || a[0].length !== b[0].length) return false;
  for (let y = 0; y < a.length; y++) {
    for (let x = 0; x < a[0].length; x++) {
      if (!!a[y][x] !== !!b[y][x]) return false;
    }
  }
  return true;
}

// PUBLIC_INTERFACE
export function getSpawnX(shape) {
  /** Compute initial x position to roughly center the piece. */
  const w = shape[0].length;
  return Math.max(0, Math.floor((BOARD_WIDTH - w) / 2));
}
