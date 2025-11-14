import React from 'react';

/**
 * PUBLIC_INTERFACE
 * Controls: Start/Pause/Resume/Restart and movement buttons; includes key legend.
 * Props: isRunning, paused, gameOver, onStart, onPause, onResume, onRestart, onLeft, onRight, onDown, onDrop, onRotateCW, onRotateCCW, compact, docked
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
  compact = false,
  docked = false,
}) {
  // In compact mode we use smaller buttons, fewer labels, and tighter grid.
  const wrapClass = [
    'panel',
    'card',
    compact ? 'controls-compact' : '',
    docked ? 'controls-docked' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={wrapClass} aria-label="Controls">
      {!docked && (
        <div className="panel-title">
          <span>{compact ? 'Controls' : 'Controls'}</span>
          <span className="badge">{compact ? 'KBD' : 'Keyboard'}</span>
        </div>
      )}

      {docked && (
        <div className="sr-only" aria-live="polite">Docked controls</div>
      )}

      <div className={`controls ${compact ? 'controls-grid-compact' : ''}`} style={{ marginBottom: compact ? 6 : 12 }}>
        {!isRunning && !gameOver && (
          <button className={`btn ${compact ? 'btn-xs' : ''}`} onClick={onStart} aria-label="Start Game">
            {compact ? '▶' : '▶ Start'}
          </button>
        )}
        {isRunning && !paused && (
          <button className={`btn secondary ${compact ? 'btn-xs' : ''}`} onClick={onPause} aria-label="Pause Game">
            {compact ? '⏸' : '⏸ Pause'}
          </button>
        )}
        {isRunning && paused && (
          <button className={`btn ${compact ? 'btn-xs' : ''}`} onClick={onResume} aria-label="Resume Game">
            {compact ? '⏵' : '⏵ Resume'}
          </button>
        )}
        <button className={`btn ghost ${compact ? 'btn-xs' : ''}`} onClick={onRestart} aria-label="Restart Game">
          {compact ? '♻' : '♻ Restart'}
        </button>
      </div>

      <div className={`controls ${compact ? 'controls-grid-compact' : ''}`} style={{ marginBottom: compact ? 6 : 12 }}>
        <button className={`btn ghost ${compact ? 'btn-xs' : ''}`} onClick={onLeft} aria-label="Move Left">←</button>
        <button className={`btn ghost ${compact ? 'btn-xs' : ''}`} onClick={onDown} aria-label="Soft Drop">↓</button>
        <button className={`btn ghost ${compact ? 'btn-xs' : ''}`} onClick={onRight} aria-label="Move Right">→</button>
        <button className={`btn ghost ${compact ? 'btn-xs' : ''}`} onClick={onRotateCCW} aria-label="Rotate CCW">⟲</button>
        <button className={`btn ghost ${compact ? 'btn-xs' : ''}`} onClick={onRotateCW} aria-label="Rotate CW">⟳</button>
        <button className={`btn ghost ${compact ? 'btn-xs' : ''}`} onClick={onDrop} aria-label="Hard Drop">⤓</button>
      </div>

      {!compact && !docked && (
        <div className="key-legend">
          <div className="key">← → move</div>
          <div className="key">↓ soft drop</div>
          <div className="key">Space hard drop</div>
          <div className="key">Z/X rotate</div>
          <div className="key">P pause</div>
          <div className="key">R restart</div>
        </div>
      )}
    </div>
  );
}

export default Controls;
