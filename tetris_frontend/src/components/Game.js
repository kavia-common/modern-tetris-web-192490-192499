import React, { useEffect, useRef } from 'react';
import Board from './Board';
import Sidebar from './Sidebar';
import Controls from './Controls';
import useTetris from '../hooks/useTetris';
import { KEY_BINDINGS } from '../utils/constants';

/**
 * PUBLIC_INTERFACE
 * Game: Top-level container orchestrating board, sidebar, and controls.
 * Handles global keyboard input, pause overlay, and responsive layout.
 */
function Game() {
  const {
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
  } = useTetris();

  const rootRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Prevent scrolling on arrow keys/space
      const preventKeys = ['ArrowLeft', 'ArrowRight', 'ArrowDown', 'Space', ' '];
      if (preventKeys.includes(e.code) || preventKeys.includes(e.key)) {
        e.preventDefault();
      }

      if (gameOver) {
        if (e.code === KEY_BINDINGS.RESTART) resetGame();
        return;
      }

      if (!isRunning) {
        if (e.code === KEY_BINDINGS.START || e.code === KEY_BINDINGS.RESTART) startGame();
        return;
      }

      if (e.code === KEY_BINDINGS.PAUSE) {
        if (paused) resumeGame();
        else pauseGame();
        return;
      }

      if (paused) return;

      switch (e.code) {
        case KEY_BINDINGS.MOVE_LEFT:
          moveLeft();
          break;
        case KEY_BINDINGS.MOVE_RIGHT:
          moveRight();
          break;
        case KEY_BINDINGS.SOFT_DROP:
          softDrop();
          break;
        case KEY_BINDINGS.HARD_DROP:
          hardDrop();
          break;
        case KEY_BINDINGS.ROTATE_CW:
        case KEY_BINDINGS.ROTATE_UP:
          rotateCW();
          break;
        case KEY_BINDINGS.ROTATE_CCW:
          rotateCCW();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown, { passive: false });
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    isRunning,
    paused,
    gameOver,
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
  ]);

  return (
    <div className="game-shell">
      <div className="board-wrap">
        <div className="board-frame card" ref={rootRef} aria-label="Tetris board container">
          <Board board={board} drawMatrix={drawMatrix} ghostMatrix={ghostMatrix} />
          {(paused || gameOver || !isRunning) && (
            <div className="overlay" role="dialog" aria-live="polite">
              <div className="content">
                <div className="title">
                  {gameOver ? 'Game Over' : !isRunning ? 'Ready?' : 'Paused'}
                </div>
                <div className="subtitle">
                  {gameOver ? 'Press R to Restart' : !isRunning ? 'Press Enter to Start' : 'Press P to Resume'}
                </div>
              </div>
            </div>
          )}
        </div>
        <div style={{ marginTop: 16 }}>
          <Controls
            isRunning={isRunning}
            paused={paused}
            gameOver={gameOver}
            onStart={startGame}
            onPause={pauseGame}
            onResume={resumeGame}
            onRestart={resetGame}
            onLeft={moveLeft}
            onRight={moveRight}
            onDown={softDrop}
            onDrop={hardDrop}
            onRotateCW={rotateCW}
            onRotateCCW={rotateCCW}
          />
        </div>
      </div>

      <aside className="sidebar">
        <Sidebar
          score={score}
          level={level}
          lines={lines}
          nextPiece={nextPiece}
          isRunning={isRunning}
        />
      </aside>
    </div>
  );
}

export default Game;
