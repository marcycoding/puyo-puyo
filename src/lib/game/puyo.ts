import { PUYO_COLORS, ROTATION_DELTA, SPAWN_COL, SPAWN_ROW } from './constants';
import { canPlace } from './board';
import type { Board, PuyoColor, PuyoPair } from '@/types/game';

function randomColor(): PuyoColor {
  return PUYO_COLORS[Math.floor(Math.random() * PUYO_COLORS.length)] as PuyoColor;
}

export function createPuyoPair(): PuyoPair {
  return {
    pivotRow: SPAWN_ROW,
    pivotCol: SPAWN_COL,
    rotation: 0, // 副ぷよが上
    pivotColor: randomColor(),
    childColor: randomColor(),
  };
}

export function getChildPosition(pair: PuyoPair): { row: number; col: number } {
  const [dRow, dCol] = ROTATION_DELTA[pair.rotation];
  return { row: pair.pivotRow + dRow, col: pair.pivotCol + dCol };
}

export function tryMoveLeft(board: Board, pair: PuyoPair): PuyoPair | null {
  const moved = { ...pair, pivotCol: pair.pivotCol - 1 };
  return canPlace(board, moved) ? moved : null;
}

export function tryMoveRight(board: Board, pair: PuyoPair): PuyoPair | null {
  const moved = { ...pair, pivotCol: pair.pivotCol + 1 };
  return canPlace(board, moved) ? moved : null;
}

export function tryMoveDown(board: Board, pair: PuyoPair): PuyoPair | null {
  const moved = { ...pair, pivotRow: pair.pivotRow + 1 };
  return canPlace(board, moved) ? moved : null;
}

function tryRotate(board: Board, pair: PuyoPair, newRotation: 0 | 1 | 2 | 3): PuyoPair | null {
  const rotated = { ...pair, rotation: newRotation };
  if (canPlace(board, rotated)) return rotated;

  // 壁蹴り: 左→右の順で補正
  const kickLeft = { ...rotated, pivotCol: rotated.pivotCol - 1 };
  if (canPlace(board, kickLeft)) return kickLeft;

  const kickRight = { ...rotated, pivotCol: rotated.pivotCol + 1 };
  if (canPlace(board, kickRight)) return kickRight;

  return null;
}

export function tryRotateLeft(board: Board, pair: PuyoPair): PuyoPair | null {
  const newRotation = ((pair.rotation + 3) % 4) as 0 | 1 | 2 | 3;
  return tryRotate(board, pair, newRotation);
}

export function tryRotateRight(board: Board, pair: PuyoPair): PuyoPair | null {
  const newRotation = ((pair.rotation + 1) % 4) as 0 | 1 | 2 | 3;
  return tryRotate(board, pair, newRotation);
}

export function hardDrop(board: Board, pair: PuyoPair): PuyoPair {
  let current = pair;
  for (;;) {
    const next = tryMoveDown(board, current);
    if (next === null) break;
    current = next;
  }
  return current;
}
