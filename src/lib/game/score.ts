import { CHAIN_BONUS_TABLE, COLOR_BONUS_TABLE } from './constants';
import type { Board, PuyoColor } from '@/types/game';

const DIRECTIONS: ReadonlyArray<[number, number]> = [[-1, 0], [1, 0], [0, -1], [0, 1]];

function getChainBonus(chainCount: number): number {
  if (chainCount <= 4) return CHAIN_BONUS_TABLE[chainCount] ?? 0;
  let bonus = CHAIN_BONUS_TABLE[4] ?? 32;
  for (let i = 5; i <= chainCount; i++) bonus *= 2;
  return bonus;
}

function getColorBonus(colorCount: number): number {
  return COLOR_BONUS_TABLE[Math.min(colorCount, 5)] ?? 24;
}

function getGroupBonus(maxGroupSize: number): number {
  return Math.max(0, maxGroupSize - 4);
}

export function calculateScore(
  erasedCells: ReadonlyArray<[number, number]>,
  board: Board,
  chainCount: number
): number {
  if (erasedCells.length === 0) return 0;

  const colorSet = new Set<PuyoColor>();
  const cellSet = new Set<string>(erasedCells.map(([r, c]) => `${r},${c}`));
  let maxGroupSize = 0;
  const visited = new Set<string>();

  for (const [startRow, startCol] of erasedCells) {
    const key = `${startRow},${startCol}`;
    if (visited.has(key)) continue;

    const color = board[startRow]?.[startCol] ?? null;
    if (color === null) continue;
    colorSet.add(color);

    const queue: Array<[number, number]> = [[startRow, startCol]];
    visited.add(key);
    let size = 0;

    while (queue.length > 0) {
      const item = queue.shift()!;
      const [row, col] = item;
      size++;

      for (const [dr, dc] of DIRECTIONS) {
        const nr = row + dr;
        const nc = col + dc;
        const nkey = `${nr},${nc}`;
        if (cellSet.has(nkey) && !visited.has(nkey) && (board[nr]?.[nc] ?? null) === color) {
          visited.add(nkey);
          queue.push([nr, nc]);
        }
      }
    }

    maxGroupSize = Math.max(maxGroupSize, size);
  }

  const bonus = getChainBonus(chainCount) + getColorBonus(colorSet.size) + getGroupBonus(maxGroupSize);
  const multiplier = Math.max(1, bonus);
  return erasedCells.length * 10 * multiplier;
}
