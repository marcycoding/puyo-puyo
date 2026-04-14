import { BOARD_COLS, BOARD_ROWS, ROTATION_DELTA, SPAWN_COL, SPAWN_ROW } from './constants';
import type { Board, Cell, PuyoPair } from '@/types/game';

export function createEmptyBoard(): Board {
  return Array.from({ length: BOARD_ROWS }, () =>
    Array.from<Cell>({ length: BOARD_COLS }).fill(null)
  );
}

export function isInBounds(row: number, col: number): boolean {
  return row >= 0 && row < BOARD_ROWS && col >= 0 && col < BOARD_COLS;
}

export function isEmpty(board: Board, row: number, col: number): boolean {
  if (!isInBounds(row, col)) return false;
  return (board[row]?.[col] ?? null) === null;
}

export function setCells(
  board: Board,
  cells: ReadonlyArray<{ row: number; col: number; color: Cell }>
): Board {
  const mutable = board.map(row => [...row]) as Cell[][];
  for (const { row, col, color } of cells) {
    if (isInBounds(row, col)) {
      mutable[row]![col] = color;
    }
  }
  return mutable;
}

export function canPlace(board: Board, pair: PuyoPair): boolean {
  const { pivotRow, pivotCol, rotation } = pair;
  const [dRow, dCol] = ROTATION_DELTA[rotation];
  const childRow = pivotRow + dRow;
  const childCol = pivotCol + dCol;

  if (!isInBounds(pivotRow, pivotCol)) return false;
  if ((board[pivotRow]?.[pivotCol] ?? null) !== null) return false;
  if (!isInBounds(childRow, childCol)) return false;
  if ((board[childRow]?.[childCol] ?? null) !== null) return false;

  return true;
}

export function placePair(board: Board, pair: PuyoPair): Board {
  const { pivotRow, pivotCol, rotation, pivotColor, childColor } = pair;
  const [dRow, dCol] = ROTATION_DELTA[rotation];
  return setCells(board, [
    { row: pivotRow, col: pivotCol, color: pivotColor },
    { row: pivotRow + dRow, col: pivotCol + dCol, color: childColor },
  ]);
}

export function isGameOver(board: Board): boolean {
  return (board[SPAWN_ROW]?.[SPAWN_COL] ?? null) !== null;
}
