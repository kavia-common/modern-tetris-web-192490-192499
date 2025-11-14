import React, { useEffect, useState } from 'react';
import NextPiece from './NextPiece';

/**
 * PUBLIC_INTERFACE
 * Sidebar: Displays stats (score, level, lines), next piece preview, and high score.
 * Props: score, level, lines, nextPiece, isRunning
 */
function Sidebar({ score, level, lines, nextPiece, isRunning }) {
  const [highScore, setHighScore] = useState(() => {
    try {
      const v = localStorage.getItem('tetris_high_score');
      return v ? parseInt(v, 10) : 0;
    } catch {
      return 0;
    }
  });

  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      try {
        localStorage.setItem('tetris_high_score', String(score));
      } catch {
        // ignore storage errors
      }
    }
  }, [score, highScore]);

  return (
    <>
      <div className="panel card">
        <div className="panel-title">
          <span>Stats</span>
          <span className="badge">{isRunning ? 'LIVE' : 'IDLE'}</span>
        </div>
        <div className="stat-grid">
          <div className="stat">
            <div className="label">Score</div>
            <div className="value" aria-label="score">{score}</div>
          </div>
          <div className="stat">
            <div className="label">Level</div>
            <div className="value" aria-label="level">{level}</div>
          </div>
          <div className="stat">
            <div className="label">Lines</div>
            <div className="value" aria-label="lines">{lines}</div>
          </div>
        </div>
      </div>

      <div className="panel card next-wrap">
        <div className="panel-title">
          <span>Next</span>
          <span className="badge">Preview</span>
        </div>
        <NextPiece piece={nextPiece} />
      </div>

      <div className="panel card">
        <div className="panel-title">
          <span>High Score</span>
          <span className="badge">Local</span>
        </div>
        <div className="stat" style={{ padding: 16 }}>
          <div className="value" aria-label="high-score" style={{ fontSize: 24 }}>{highScore}</div>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
