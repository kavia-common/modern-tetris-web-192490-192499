import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  BOARD_WIDTH,
  BOARD_HEIGHT,
  SCORE_RULES,
  SOFT_DROP_SCORE,
  HARD_DROP_SCORE_PER_CELL,
  getIntervalForLevel,
} from '../utils/constants';
import {
  createEmptyBoard,
  checkCollision,
  rotateWithWallKick,
  mergePieceToBoard,
  clearFullLines,
  computeGhostPosition,
} from '../utils/engine';
import { createBagQueue, getPieceFromQueue } from '../utils/pieces';

/**
 * PUBLIC_INTERFACE
 * useTetris: Core game state and actions.
 * Exposes:
 * - state: board, drawMatrix, ghostMatrix, isRunning, paused, gameOver, score, level, lines, nextPiece
 * - actions: startGame, pauseGame, resumeGame, resetGame, moveLeft, moveRight, softDrop, hardDrop, rotateCW, rotateCCW
 */
export default function useTetris() {
  // Core state
  const [board, setBoard] = useState(() => createEmptyBoard());
  const [pos, setPos] = useState({ x: 3, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [active, setActive] = useState(null); // { shape: matrix, colorId }
  const [queue, setQueue] = useState(() => createBagQueue());
  const [nextPiece, setNextPiece] = useState(null);

  const [isRunning, setIsRunning] = useState(false);
  const [paused, setPaused] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const [score, setScore] = useState(0);
  const [lines, setLines] = useState(0);
  const [level, setLevel] = useState(1);

  // Timing
  const lastTimeRef = useRef(0);
  const dropAccumulatorRef = useRef(0);
  const rafIdRef = useRef(null);

  // Sound (optional)
  const rotateSoundRef = useRef(null);
  const lineSoundRef = useRef(null);

  useEffect(() => {
    // Attempt to load sounds if available, guard if missing
    try {
      // dynamic import via audio element path
      rotateSoundRef.current = new Audio(process.env.PUBLIC_URL + '/assets/sounds/rotate.mp3');
      lineSoundRef.current = new Audio(process.env.PUBLIC_URL + '/assets/sounds/line-clear.mp3');
    } catch {
      rotateSoundRef.current = null;
      lineSoundRef.current = null;
    }
  }, []);

  // Derived matrices for rendering
  const drawMatrix = useMemo(() => {
    if (!active) return board;
    const matrix = board.map(r => [...r]);
    const { shape, colorId } = active;
    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x]) {
          const gx = pos.x + x;
          const gy = pos.y + y;
          if (gy >= 0 && gy < BOARD_HEIGHT && gx >= 0 && gx < BOARD_WIDTH) {
            matrix[gy][gx] = colorId;
          }
        }
      }
    }
    return matrix;
  }, [board, active, pos]);

  const ghostMatrix = useMemo(() => {
    if (!active) return null;
    const gy = computeGhostPosition(board, active.shape, pos);
    const matrix = Array.from({ length: BOARD_HEIGHT }, () => Array(BOARD_WIDTH).fill(0));
    for (let y = 0; y < active.shape.length; y++) {
      for (let x = 0; x < active.shape[y].length; x++) {
        if (active.shape[y][x]) {
          const gx = pos.x + x;
          const gY = gy + y;
          if (gY >= 0 && gY < BOARD_HEIGHT && gx >= 0 && gx < BOARD_WIDTH) {
            matrix[gY][gx] = active.colorId;
          }
        }
      }
    }
    return matrix;
  }, [board, active, pos]);

  // Spawning and queue handling
  const spawnNext = useCallback((b) => {
    const [piece, newQueue] = getPieceFromQueue(queue);
    setQueue(newQueue);
    setActive({ shape: piece.shape, colorId: piece.colorId });
    setPos({ x: 3, y: 0 });
    setRotation(0);

    // Next preview
    const [np] = getPieceFromQueue(newQueue);
    setNextPiece(np);

    if (checkCollision(b, piece.shape, { x: 3, y: 0 })) {
      // Game over
      setIsRunning(false);
      setPaused(false);
      setGameOver(true);
    }
  }, [queue]);

  // PUBLIC_INTERFACE
  const startGame = useCallback(() => {
    /** Start a new game or resume from idle state. */
    const empty = createEmptyBoard();
    setBoard(empty);
    setScore(0);
    setLines(0);
    setLevel(1);
    setGameOver(false);
    setPaused(false);
    setIsRunning(true);
    setQueue(createBagQueue());
    // spawn after queue reset
    setTimeout(() => spawnNext(empty), 0);
  }, [spawnNext]);

  // PUBLIC_INTERFACE
  const resetGame = useCallback(() => {
    /** Reset state and start anew. */
    startGame();
  }, [startGame]);

  // PUBLIC_INTERFACE
  const pauseGame = useCallback(() => {
    /** Pause active game loop. */
    setPaused(true);
  }, []);

  // PUBLIC_INTERFACE
  const resumeGame = useCallback(() => {
    /** Resume paused game loop. */
    if (!gameOver) setPaused(false);
  }, [gameOver]);

  // Movement/Rotation
  const commitBoardWithActive = useCallback((b, shape, p, colorId) => {
    return mergePieceToBoard(b, shape, p, colorId);
  }, []);

  const lockAndClear = useCallback((b) => {
    // Clear lines and update stats
    const { board: clearedBoard, cleared } = clearFullLines(b);
    if (cleared > 0) {
      if (lineSoundRef.current) {
        try { lineSoundRef.current.currentTime = 0; lineSoundRef.current.play().catch(() => {}); } catch {}
      }
      setLines(prev => prev + cleared);
      setScore(prev => prev + (SCORE_RULES[cleared] || 0) * level);
      // Increase level every 10 lines
      setLevel(prev => Math.floor((prev * 10 + cleared) / 10) > prev ? prev + 1 : prev);
    }
    setBoard(clearedBoard);
    spawnNext(clearedBoard);
  }, [level, spawnNext]);

  // PUBLIC_INTERFACE
  const moveLeft = useCallback(() => {
    if (!active || paused || !isRunning) return;
    const newPos = { x: pos.x - 1, y: pos.y };
    if (!checkCollision(board, active.shape, newPos)) {
      setPos(newPos);
    }
  }, [active, board, isRunning, paused, pos.x, pos.y]);

  // PUBLIC_INTERFACE
  const moveRight = useCallback(() => {
    if (!active || paused || !isRunning) return;
    const newPos = { x: pos.x + 1, y: pos.y };
    if (!checkCollision(board, active.shape, newPos)) {
      setPos(newPos);
    }
  }, [active, board, isRunning, paused, pos.x, pos.y]);

  // PUBLIC_INTERFACE
  const softDrop = useCallback(() => {
    if (!active || paused || !isRunning) return;
    const newPos = { x: pos.x, y: pos.y + 1 };
    if (!checkCollision(board, active.shape, newPos)) {
      setPos(newPos);
      setScore(prev => prev + SOFT_DROP_SCORE);
    } else {
      // lock piece
      const merged = commitBoardWithActive(board, active.shape, pos, active.colorId);
      lockAndClear(merged);
    }
  }, [active, board, commitBoardWithActive, isRunning, lockAndClear, paused, pos]);

  // PUBLIC_INTERFACE
  const hardDrop = useCallback(() => {
    if (!active || paused || !isRunning) return;
    let drop = 0;
    let newY = pos.y;
    while (!checkCollision(board, active.shape, { x: pos.x, y: newY + 1 })) {
      newY++;
      drop++;
    }
    setScore(prev => prev + drop * HARD_DROP_SCORE_PER_CELL);
    const merged = commitBoardWithActive(board, active.shape, { x: pos.x, y: newY }, active.colorId);
    lockAndClear(merged);
  }, [active, board, commitBoardWithActive, isRunning, lockAndClear, paused, pos]);

  // PUBLIC_INTERFACE
  const rotateCW = useCallback(() => {
    if (!active || paused || !isRunning) return;
    const { rotated, newPos } = rotateWithWallKick(board, active.shape, pos, +1);
    if (rotated) {
      if (rotateSoundRef.current) {
        try { rotateSoundRef.current.currentTime = 0; rotateSoundRef.current.play().catch(() => {}); } catch {}
      }
      setActive(a => ({ ...a, shape: rotated }));
      setPos(newPos);
      setRotation(r => (r + 1) % 4);
    }
  }, [active, board, isRunning, paused, pos]);

  // PUBLIC_INTERFACE
  const rotateCCW = useCallback(() => {
    if (!active || paused || !isRunning) return;
    const { rotated, newPos } = rotateWithWallKick(board, active.shape, pos, -1);
    if (rotated) {
      if (rotateSoundRef.current) {
        try { rotateSoundRef.current.currentTime = 0; rotateSoundRef.current.play().catch(() => {}); } catch {}
      }
      setActive(a => ({ ...a, shape: rotated }));
      setPos(newPos);
      setRotation(r => (r + 3) % 4);
    }
  }, [active, board, isRunning, paused, pos]);

  // Game loop via rAF accumulator for gravity
  const loop = useCallback((time) => {
    if (!isRunning || paused || gameOver) return;
    if (!lastTimeRef.current) lastTimeRef.current = time;
    const delta = time - lastTimeRef.current;
    lastTimeRef.current = time;
    dropAccumulatorRef.current += delta;

    const interval = getIntervalForLevel(level);
    if (dropAccumulatorRef.current >= interval) {
      dropAccumulatorRef.current = 0;
      softDrop(); // gravity step acts like a soft drop (but without extra scoring; softDrop adds 1, which is acceptable)
    }

    rafIdRef.current = requestAnimationFrame(loop);
  }, [gameOver, isRunning, level, paused, softDrop]);

  useEffect(() => {
    if (isRunning && !paused && !gameOver) {
      rafIdRef.current = requestAnimationFrame(loop);
      return () => {
        if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      };
    }
    return () => {};
  }, [isRunning, paused, gameOver, loop]);

  return {
    board,
    drawMatrix,
    ghostMatrix,
    isRunning,
    paused,
    gameOver,
    score,
    level,
    lines,
    nextPiece,
    startGame,
    pauseGame,
    resumeGame,
    resetGame,
    moveLeft,
    moveRight,
    softDrop,
    hardDrop,
    rotateCW,
    rotateCCW,
  };
}
