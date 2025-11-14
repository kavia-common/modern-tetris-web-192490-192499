import React, { useMemo } from 'react';
import { COLOR_MAP } from '../utils/constants';

/**
 * PUBLIC_INTERFACE
 * NextPiece: Renders a 4x4 mini grid preview for the upcoming tetromino.
 * Props: piece { shape: number[][], colorId: number }
 */
function NextPiece({ piece }) {
  const grid = useMemo(() => {
    const empty = Array.from({ length: 4 }, () => Array(4).fill(0));
    if (!piece || !piece.shape) return empty;
    // center the shape roughly within 4x4 grid
    const shape = piece.shape;
    // Determine bounds
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    shape.forEach((row, y) =>
      row.forEach((v, x) => {
        if (v) {
          minX = Math.min(minX, x);
          maxX = Math.max(maxX, x);
          minY = Math.min(minY, y);
          maxY = Math.max(maxY, y);
        }
      })
    );
    const w = maxX - minX + 1;
    const h = maxY - minY + 1;
    const offsetX = Math.max(0, Math.floor((4 - w) / 2)) - minX;
    const offsetY = Math.max(0, Math.floor((4 - h) / 2)) - minY;

    const g = empty.map(r => [...r]);
    shape.forEach((row, y) =>
      row.forEach((v, x) => {
        if (v) {
          const gx = x + offsetX;
          const gy = y + offsetY;
          if (gy >= 0 && gy < 4 && gx >= 0 && gx < 4) {
            g[gy][gx] = piece.colorId;
          }
        }
      })
    );
    return g;
  }, [piece]);

  return (
    <div className="mini-board" role="img" aria-label="next piece preview">
      {grid.flatMap((row, y) =>
        row.map((v, x) => {
          const color = COLOR_MAP[v] || 'transparent';
          return (
            <div
              key={`${x}-${y}`}
              className={`mini-cell ${v ? 'active' : ''}`}
              style={v ? { background: `linear-gradient(180deg, ${color}, rgba(0,0,0,0.12))` } : undefined}
            />
          );
        })
      )}
    </div>
  );
}

export default NextPiece;
