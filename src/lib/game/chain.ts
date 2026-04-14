import { BOARD_COLS, BOARD_ROWS } from './constants';
import type { Board, Cell } from '@/types/game';

const DIRECTIONS: ReadonlyArray<[number, number]> = [[-1, 0], [1, 0], [0, -1], [0, 1]];

function findConnectedGroup(
  board: Board,
  startRow: number,
  startCol: number,
  visited: Set<string>
): Array<[number, number]> {
  const color = board[startRow]?.[startCol] ?? null;
  if (color === null) return [];

  const group: Array<[number, number]> = [];
  const queue: Array<[number, number]> = [[startRow, startCol]];
  visited.add(`${startRow},${startCol}`);

  while (queue.length > 0) {
    const item = queue.shift()!;
    const [row, col] = item;
    group.push([row, col]);

    for (const [dr, dc] of DIRECTIONS) {
      const nr = row + dr;
      const nc = col + dc;
      const key = `${nr},${nc}`;
      if (
        nr >= 0 && nr < BOARD_ROWS &&
        nc >= 0 && nc < BOARD_COLS &&
        !visited.has(key) &&
        (board[nr]?.[nc] ?? null) === color
      ) {
        visited.add(key);
        queue.push([nr, nc]);
      }
    }
  }

  return group;
}

export function findErasableGroups(board: Board): ReadonlyArray<[number, number]> {
  const visited = new Set<string>();
  const erasable: Array<[number, number]> = [];

  for (let row = 0; row < BOARD_ROWS; row++) {
    for (let col = 0; col < BOARD_COLS; col++) {
      const key = `${row},${col}`;
      if (!visited.has(key) && (board[row]?.[col] ?? null) !== null) {
        const group = findConnectedGroup(board, row, col, visited);
        if (group.length >= 4) {
          erasable.push(...group);
        }
      }
    }
  }

  return erasable;
}

export function eraseGroups(
  board: Board,
  cells: ReadonlyArray<[number, number]>
): Board {
  const mutable = board.map(row => [...row]) as Cell[][];
  for (const [row, col] of cells) {
    mutable[row]![col] = null;
  }
  return mutable;
}
