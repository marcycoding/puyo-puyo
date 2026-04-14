import { BOARD_COLS, BOARD_ROWS } from './constants';
import type { Board, Cell } from '@/types/game';

export function applyGravity(board: Board): Board {
  const result: Cell[][] = Array.from({ length: BOARD_ROWS }, () =>
    Array.from<Cell>({ length: BOARD_COLS }).fill(null)
  );

  for (let col = 0; col < BOARD_COLS; col++) {
    const nonEmpty: Cell[] = [];
    for (let row = 0; row < BOARD_ROWS; row++) {
      const cell = board[row]?.[col] ?? null;
      if (cell !== null) nonEmpty.push(cell);
    }
    const startRow = BOARD_ROWS - nonEmpty.length;
    for (let i = 0; i < nonEmpty.length; i++) {
      result[startRow + i]![col] = nonEmpty[i]!;
    }
  }

  return result;
}

export function hasFloatingPuyos(board: Board): boolean {
  for (let col = 0; col < BOARD_COLS; col++) {
    let foundEmpty = false;
    for (let row = 0; row < BOARD_ROWS; row++) {
      const cell = board[row]?.[col] ?? null;
      if (cell === null) {
        foundEmpty = true;
      } else if (foundEmpty) {
        return true;
      }
    }
  }
  return false;
}
