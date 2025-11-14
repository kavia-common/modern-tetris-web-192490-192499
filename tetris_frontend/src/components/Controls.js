import React from 'react';

/**
 * PUBLIC_INTERFACE
 * Controls: Start/Pause/Resume/Restart and movement buttons; includes key legend.
 * Props: isRunning, paused, gameOver, onStart, onPause, onResume, onRestart, onLeft, onRight, onDown, onDrop, onRotateCW, onRotateCCW
 */
function Controls({
  isRunning,
  paused,
  gameOver,
  onStart,
  onPause,
  onResume,
  onRestart,
  onLeft,
  onRight,
  onDown,
  onDrop,
  onRotateCW,
  onRotateCCW,
}) {
  return (
    <div className="panel card">
      <div className="panel-title">
        <span>Controls</span>
        <span className="badge">Keyboard</span>
      </div>

      <div className="controls" style={{ marginBottom: 12 }}>
        {!isRunning && !gameOver && (
          <button className="btn" onClick={onStart} aria-label="Start Game">
            ▶ Start
          </button>
        )}
        {isRunning && !paused && (
          <button className="btn secondary" onClick={onPause} aria-label="Pause Game">
            ⏸ Pause
          </button>
        )}
        {isRunning && paused && (
          <button className="btn" onClick={onResume} aria-label="Resume Game">
            ⏵ Resume
          </button>
        )}
        <button className="btn ghost" onClick={onRestart} aria-label="Restart Game">
          ♻ Restart
        </button>
      </div>

      <div className="controls" style={{ marginBottom: 12 }}>
        <button className="btn ghost" onClick={onLeft} aria-label="Move Left">←</button>
        <button className="btn ghost" onClick={onDown} aria-label="Soft Drop">↓</button>
        <button className="btn ghost" onClick={onRight} aria-label="Move Right">→</button>
        <button className="btn ghost" onClick={onRotateCCW} aria-label="Rotate CCW">⟲</button>
        <button className="btn ghost" onClick={onRotateCW} aria-label="Rotate CW">⟳</button>
        <button className="btn ghost" onClick={onDrop} aria-label="Hard Drop">⤓</button>
      </div>

      <div className="key-legend">
        <div className="key">← → move</div>
        <div className="key">↓ soft drop</div>
        <div className="key">Space hard drop</div>
        <div className="key">Z/X rotate</div>
        <div className="key">P pause</div>
        <div className="key">R restart</div>
      </div>
    </div>
  );
}

export default Controls;
