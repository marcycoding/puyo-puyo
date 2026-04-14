import type { PuyoColor } from '@/types/game';

export const BOARD_COLS = 6;
export const BOARD_ROWS = 14; // 12 visible + 2 hidden
export const VISIBLE_ROWS = 12;
export const HIDDEN_ROWS = 2;

export const SPAWN_ROW = 1; // 非表示領域最下行（ツモ出現位置）
export const SPAWN_COL = 2;

export const PUYO_COLORS: readonly PuyoColor[] = ['red', 'blue', 'green', 'yellow', 'purple'];

export const FALL_SPEED_TABLE: Readonly<Record<number, number>> = {
  1: 1000, 2: 900,  3: 800,  4: 700,  5: 600,
  6: 500,  7: 430,  8: 360,  9: 300,  10: 250,
  11: 200, 12: 160, 13: 130, 14: 100, 15: 80,
};

export const LEVEL_UP_THRESHOLD = 30;
export const MAX_LEVEL = 15;

export const CHAIN_BONUS_TABLE: Readonly<Record<number, number>> = {
  1: 0, 2: 8, 3: 16, 4: 32,
};

export const COLOR_BONUS_TABLE: Readonly<Record<number, number>> = {
  1: 0, 2: 3, 3: 6, 4: 12, 5: 24,
};

export const GRAVITY_DELAY_MS = 100;
export const ERASE_ANIMATION_MS = 300;
export const CHAIN_LABEL_MS = 600;

export const HIGHSCORE_KEY = 'puyo-highscore';

export const ALL_CLEAR_BONUS = 30000;

export const ROTATION_DELTA: Readonly<Record<0 | 1 | 2 | 3, [number, number]>> = {
  0: [-1, 0], // 上
  1: [0, 1],  // 右
  2: [1, 0],  // 下
  3: [0, -1], // 左
};

export const CELL_SIZE = 36; // px
