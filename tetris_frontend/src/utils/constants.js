export const BOARD_WIDTH = 10;
export const BOARD_HEIGHT = 20;

// PUBLIC_INTERFACE
export const SCORE_RULES = {
  /** Number of lines cleared at once -> score gain (base multiplied by level). */
  1: 100,
  2: 300,
  3: 500,
  4: 800, // Tetris
};

// PUBLIC_INTERFACE
export const SOFT_DROP_SCORE = 1;

// PUBLIC_INTERFACE
export const HARD_DROP_SCORE_PER_CELL = 2;

// PUBLIC_INTERFACE
export const LEVEL_SPEEDS_MS = [
  1000, // level 1
  850,  // 2
  700,  // 3
  600,  // 4
  500,  // 5
  420,  // 6
  350,  // 7
  300,  // 8
  260,  // 9
  220,  // 10
  200,  // 11+
];

// PUBLIC_INTERFACE
export function getIntervalForLevel(level) {
  /** Get gravity interval in ms for a given level. */
  const idx = Math.min(Math.max(1, level), LEVEL_SPEEDS_MS.length) - 1;
  return LEVEL_SPEEDS_MS[idx];
}

// PUBLIC_INTERFACE
export const COLOR_MAP = {
  /** Maps color id to a nice color for the Ocean Professional theme. */
  0: 'transparent',
  1: '#22D3EE', // I - cyan
  2: '#F59E0B', // O - amber
  3: '#8B5CF6', // T - violet
  4: '#10B981', // S - emerald
  5: '#EF4444', // Z - red
  6: '#2563EB', // J - blue
  7: '#D946EF', // L - fuchsia
};

// PUBLIC_INTERFACE
export const KEY_BINDINGS = {
  MOVE_LEFT: 'ArrowLeft',
  MOVE_RIGHT: 'ArrowRight',
  SOFT_DROP: 'ArrowDown',
  HARD_DROP: 'Space',
  ROTATE_CW: 'KeyX',
  ROTATE_CCW: 'KeyZ',
  ROTATE_UP: 'ArrowUp',
  PAUSE: 'KeyP',
  START: 'Enter',
  RESTART: 'KeyR',
};
