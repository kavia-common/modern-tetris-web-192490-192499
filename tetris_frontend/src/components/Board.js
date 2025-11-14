import React, { useMemo } from 'react';
import { BOARD_WIDTH, BOARD_HEIGHT, COLOR_MAP } from '../utils/constants';

/**
 * PUBLIC_INTERFACE
 * Board: Renders the 10x20 grid by overlaying board cells with current drawMatrix and ghostMatrix.
 * Props:
 * - board: base board matrix with locked cells (numbers or 0)
 * - drawMatrix: current falling piece matrix positioned on board indices
 * - ghostMatrix: ghost projection matrix positioned on board indices
 */
function Board({ board, drawMatrix, ghostMatrix }) {
  const cells = useMemo(() => {
    const result = [];
    for (let y = 0; y < BOARD_HEIGHT; y++) {
      for (let x = 0; x < BOARD_WIDTH; x++) {
        const baseVal = board[y][x];
        const drawVal = drawMatrix?.[y]?.[x] || 0;
        const ghostVal = ghostMatrix?.[y]?.[x] || 0;

        let val = baseVal || drawVal || 0;
        let isGhost = false;
        if (!val && ghostVal) {
          val = ghostVal;
          isGhost = true;
        }

        result.push({
          key: `${x}-${y}`,
          val,
          isGhost,
          clearing: baseVal === -1, // special flag from clearing animation
        });
      }
    }
    return result;
  }, [board, drawMatrix, ghostMatrix]);

  return (
    <div className="board" role="grid" aria-rowcount={BOARD_HEIGHT} aria-colcount={BOARD_WIDTH}>
      {cells.map(({ key, val, isGhost, clearing }) => {
        const color = COLOR_MAP[val] || 'transparent';
        const classes = [
          'cell',
          val ? 'active' : 'empty',
          isGhost ? 'ghost' : '',
          clearing ? 'clearing' : '',
        ]
          .filter(Boolean)
          .join(' ');
        const style = val
          ? {
              background: `linear-gradient(180deg, ${color}, rgba(0,0,0,0.12))`,
              border: '1px solid rgba(0,0,0,0.08)',
            }
          : undefined;
        return <div key={key} className={classes} style={style} role="gridcell" />;
      })}
    </div>
  );
}

export default Board;
