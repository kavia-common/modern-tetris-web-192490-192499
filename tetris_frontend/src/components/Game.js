import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
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

  // Detect compact mode from viewport height (<700px) and very narrow width
  const [viewport, setViewport] = useState({ w: window.innerWidth, h: window.innerHeight });
  useEffect(() => {
    const onResize = () => setViewport({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  const compact = useMemo(() => viewport.h < 700 || viewport.w < 420, [viewport.h, viewport.w]);
  const narrow = useMemo(() => viewport.w <= 900, [viewport.w]); // for stacking and sidebar behavior

  // Dock visibility state: when hidden, we show inline compact controls in sidebar
  const [dockHidden, setDockHidden] = useState(false);

  // Reserve height for dock when compact and not hidden
  const DOCK_HEIGHT = 88; // default dock height used in CSS; keep in sync
  const dockActive = compact && !dockHidden;

  // PUBLIC_INTERFACE
  const toggleDock = useCallback(() => {
    /** Toggle the bottom dock visibility. When hidden, show inline controls in the sidebar. */
    setDockHidden(v => !v);
  }, []);

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

  const boardFrameStyle = dockActive
    ? {
        // Reserve space beneath the board area equivalent to dock height + safe area
        paddingBottom: `calc(var(--controls-dock-height, ${DOCK_HEIGHT}px) + env(safe-area-inset-bottom, 0px))`,
      }
    : undefined;

  return (
    <div className={`game-shell ${compact ? 'game-compact' : ''}`}>
      <div className={`board-wrap ${compact ? 'board-wrap-compact' : ''}`}>
        <div
          className={`board-frame card ${compact ? 'board-frame-compact' : ''}`}
          ref={rootRef}
          aria-label="Tetris board container"
          style={boardFrameStyle}
        >
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

          {/* Bottom docked controls for compact mode - positioned near the bottom of board frame */}
          {dockActive && (
            <div className="controls-bottom-dock" role="region" aria-label="Docked Controls">
              <Controls
                compact
                docked
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
          )}
        </div>

        {/* Standard controls under board only when not compact (non-compact mode; dock should not overlay) */}
        {!compact && (
          <div style={{ marginTop: 12 }}>
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
        )}
      </div>

      <aside className={`sidebar ${compact ? 'sidebar-compact' : ''} ${narrow ? 'sidebar-collapsible' : ''}`}>
        <Sidebar
          score={score}
          level={level}
          lines={lines}
          nextPiece={nextPiece}
          isRunning={isRunning}
        />

        {/* Dock visibility toggle and inline controls when dock is hidden */}
        {compact && (
          <div className="panel card" style={{ marginTop: 12 }}>
            <div className="panel-title">
              <span>Controls</span>
              <button
                className="btn ghost btn-xs"
                onClick={toggleDock}
                aria-pressed={!dockHidden ? 'true' : 'false'}
                aria-label={dockHidden ? 'Show bottom dock' : 'Hide bottom dock'}
              >
                {dockHidden ? 'Show Dock' : 'Hide Dock'}
              </button>
            </div>

            {dockHidden && (
              <Controls
                compact
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
            )}
          </div>
        )}
      </aside>
    </div>
  );
}

export default Game;
