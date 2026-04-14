import { createEmptyBoard, isGameOver, placePair } from './board';
import { createPuyoPair, hardDrop, tryMoveDown, tryMoveLeft, tryMoveRight, tryRotateLeft, tryRotateRight } from './puyo';
import { applyGravity } from './gravity';
import { eraseGroups, findErasableGroups } from './chain';
import { calculateScore } from './score';
import { ALL_CLEAR_BONUS, LEVEL_UP_THRESHOLD, MAX_LEVEL } from './constants';
import type { Board, GameAction, GameState, ParticleEffect, PuyoColor } from '@/types/game';

function createParticles(
  erasedCells: ReadonlyArray<[number, number]>,
  board: Board
): ParticleEffect[] {
  const particles: ParticleEffect[] = [];
  for (const [row, col] of erasedCells) {
    const color = board[row]?.[col] as PuyoColor | null;
    if (!color) continue;
    for (let i = 0; i < 5; i++) {
      particles.push({
        id: `${Date.now()}-${row}-${col}-${i}-${Math.random()}`,
        row,
        col,
        color,
        dx: (Math.random() - 0.5) * 100,
        dy: (Math.random() - 0.5) * 100,
      });
    }
  }
  return particles;
}

function isBoardEmpty(board: Board): boolean {
  return board.every(row => row.every(cell => cell === null));
}

export function createInitialState(): GameState {
  return {
    phase: 'idle',
    board: createEmptyBoard(),
    currentPair: null,
    nextPairs: [createPuyoPair(), createPuyoPair()],
    score: 0,
    highScore: 0,
    level: 1,
    totalErased: 0,
    chainCount: 0,
    erasingCells: [],
    particles: [],
    isFlashing: false,
    chainLabelVisible: false,
    allClear: false,
  };
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START_GAME': {
      const next1 = state.nextPairs[0];
      const next2 = state.nextPairs[1];
      return {
        ...createInitialState(),
        highScore: state.highScore,
        currentPair: next1,
        nextPairs: [next2, createPuyoPair()],
        phase: 'falling',
      };
    }

    case 'MOVE_LEFT': {
      if (!state.currentPair || state.phase !== 'falling') return state;
      const moved = tryMoveLeft(state.board, state.currentPair);
      return moved ? { ...state, currentPair: moved } : state;
    }

    case 'MOVE_RIGHT': {
      if (!state.currentPair || state.phase !== 'falling') return state;
      const moved = tryMoveRight(state.board, state.currentPair);
      return moved ? { ...state, currentPair: moved } : state;
    }

    case 'MOVE_DOWN': {
      if (!state.currentPair || state.phase !== 'falling') return state;
      const moved = tryMoveDown(state.board, state.currentPair);
      if (moved) return { ...state, currentPair: moved };
      return { ...state, phase: 'locking' };
    }

    case 'HARD_DROP': {
      if (!state.currentPair || state.phase !== 'falling') return state;
      const dropped = hardDrop(state.board, state.currentPair);
      return { ...state, currentPair: dropped, phase: 'locking' };
    }

    case 'ROTATE_LEFT': {
      if (!state.currentPair || state.phase !== 'falling') return state;
      const rotated = tryRotateLeft(state.board, state.currentPair);
      return rotated ? { ...state, currentPair: rotated } : state;
    }

    case 'ROTATE_RIGHT': {
      if (!state.currentPair || state.phase !== 'falling') return state;
      const rotated = tryRotateRight(state.board, state.currentPair);
      return rotated ? { ...state, currentPair: rotated } : state;
    }

    case 'LOCK_PAIR': {
      if (!state.currentPair) return state;
      const newBoard = placePair(state.board, state.currentPair);
      return {
        ...state,
        board: newBoard,
        currentPair: null,
        phase: 'gravity',
        chainCount: 0,
        allClear: false,
      };
    }

    case 'APPLY_GRAVITY': {
      const newBoard = applyGravity(state.board);
      const erasable = findErasableGroups(newBoard);

      if (erasable.length > 0) {
        return {
          ...state,
          board: newBoard,
          phase: 'erasing',
          erasingCells: erasable,
        };
      }

      if (isGameOver(newBoard)) {
        return { ...state, board: newBoard, phase: 'gameover' };
      }

      // 全消し判定
      const boardEmpty = isBoardEmpty(newBoard);
      const allClearScore = boardEmpty ? ALL_CLEAR_BONUS : 0;
      const scoreAfterAllClear = state.score + allClearScore;
      const highScoreAfterAllClear = Math.max(state.highScore, scoreAfterAllClear);

      // スポーン
      const next1 = state.nextPairs[0];
      const next2 = state.nextPairs[1];
      return {
        ...state,
        board: newBoard,
        currentPair: next1,
        nextPairs: [next2, createPuyoPair()],
        phase: 'falling',
        chainCount: 0,
        score: scoreAfterAllClear,
        highScore: highScoreAfterAllClear,
        allClear: boardEmpty,
      };
    }

    case 'COMMIT_ERASE': {
      const { erasingCells, board, chainCount, score, highScore, totalErased, level } = state;
      const newChainCount = chainCount + 1;
      const addedScore = calculateScore(erasingCells, board, newChainCount);
      const newBoard = eraseGroups(board, erasingCells);
      const newTotalErased = totalErased + erasingCells.length;
      const newLevel = Math.min(MAX_LEVEL, Math.floor(newTotalErased / LEVEL_UP_THRESHOLD) + 1);
      const newScore = score + addedScore;
      const newHighScore = Math.max(highScore, newScore);
      const newParticles = createParticles(erasingCells, board);

      return {
        ...state,
        board: newBoard,
        chainCount: newChainCount,
        erasingCells: [],
        score: newScore,
        highScore: newHighScore,
        totalErased: newTotalErased,
        level: newLevel,
        particles: [...state.particles, ...newParticles],
        isFlashing: true,
        chainLabelVisible: true,
        phase: 'chain',
      };
    }

    case 'ADVANCE_CHAIN': {
      return { ...state, phase: 'gravity', isFlashing: false, chainLabelVisible: false };
    }

    case 'REMOVE_PARTICLES': {
      const idSet = new Set(action.ids);
      return { ...state, particles: state.particles.filter(p => !idSet.has(p.id)) };
    }

    case 'UPDATE_HIGHSCORE': {
      return { ...state, highScore: Math.max(state.highScore, action.value) };
    }

    default: {
      const _exhaustive: never = action;
      return state;
    }
  }
}
