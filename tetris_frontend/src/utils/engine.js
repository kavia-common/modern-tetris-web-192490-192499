import { BOARD_HEIGHT, BOARD_WIDTH } from './constants';
import { rotatePiece } from './pieces';

// PUBLIC_INTERFACE
export function createEmptyBoard() {
  /** Create a BOARD_HEIGHT x BOARD_WIDTH matrix filled with 0. */
  return Array.from({ length: BOARD_HEIGHT }, () => Array(BOARD_WIDTH).fill(0));
}

// PUBLIC_INTERFACE
export function checkCollision(board, shape, pos) {
  /** Returns true if shape at pos collides with walls, floor, or locked cells. */
  for (let y = 0; y < shape.length; y++) {
    for (let x = 0; x < shape[y].length; x++) {
      if (shape[y][x]) {
        const gx = pos.x + x;
        const gy = pos.y + y;
        if (gx < 0 || gx >= BOARD_WIDTH || gy >= BOARD_HEIGHT) {
          return true;
        }
        if (gy >= 0 && board[gy][gx]) {
          return true;
        }
      }
    }
  }
  return false;
}

// PUBLIC_INTERFACE
export function mergePieceToBoard(board, shape, pos, colorId) {
  /** Merge the piece into a new board matrix at position pos with colorId. */
  const newBoard = board.map(r => [...r]);
  for (let y = 0; y < shape.length; y++) {
    for (let x = 0; x < shape[y].length; x++) {
      if (shape[y][x]) {
        const gx = pos.x + x;
        const gy = pos.y + y;
        if (gy >= 0 && gy < BOARD_HEIGHT && gx >= 0 && gx < BOARD_WIDTH) {
          newBoard[gy][gx] = colorId;
        }
      }
    }
  }
  return newBoard;
}

// SRS-like wall kick offsets (simplified)
const KICKS = [
  { x: 0, y: 0 },
  { x: -1, y: 0 },
  { x: 1, y: 0 },
  { x: 0, y: -1 },
  { x: -2, y: 0 },
  { x: 2, y: 0 },
];

// PUBLIC_INTERFACE
export function rotateWithWallKick(board, currentShape, pos, dir) {
  /** Attempt to rotate currentShape with simple wall kicks; returns { rotated, newPos }. */
  // We need the rotation list; infer via rotatePiece by applying dir to current twice to find the rotated matrix.
  // Since rotatePiece requires rotations list we can't compute here; provide a generic rotate implementation:
  const rotated = rotateMatrixGeneric(currentShape, dir);
  for (const kick of KICKS) {
    const newPos = { x: pos.x + kick.x, y: pos.y + kick.y };
    if (!checkCollision(board, rotated, newPos)) {
      return { rotated, newPos };
    }
  }
  return { rotated: null, newPos: pos };
}

// Generic rotation (90 deg CW for dir>0, CCW for dir<0)
function rotateMatrixGeneric(m, dir) {
  const rows = m.length;
  const cols = m[0].length;
  if (dir > 0) {
    const out = Array.from({ length: cols }, () => Array(rows).fill(0));
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        out[x][rows - 1 - y] = m[y][x];
      }
    }
    return out;
  } else {
    const out = Array.from({ length: cols }, () => Array(rows).fill(0));
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        out[cols - 1 - x][y] = m[y][x];
      }
    }
    return out;
  }
}

// PUBLIC_INTERFACE
export function clearFullLines(board) {
  /** Removes full lines; returns { board: newBoard, cleared: count }. */
  const newBoard = [];
  let cleared = 0;
  for (let y = 0; y < BOARD_HEIGHT; y++) {
    const full = board[y].every(v => !!v);
    if (full) {
      cleared++;
    } else {
      newBoard.push([...board[y]]);
    }
  }
  while (newBoard.length < BOARD_HEIGHT) {
    newBoard.unshift(Array(BOARD_WIDTH).fill(0));
  }
  return { board: newBoard, cleared };
}

// PUBLIC_INTERFACE
export function computeGhostPosition(board, shape, pos) {
  /** Returns the lowest y where the shape can be placed without collision. */
  let y = pos.y;
  while (!checkCollision(board, shape, { x: pos.x, y: y + 1 })) {
    y++;
  }
  return y;
}
