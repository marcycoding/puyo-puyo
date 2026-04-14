export type PuyoColor = 'red' | 'blue' | 'green' | 'yellow' | 'purple' | 'ojama';
export type Cell = PuyoColor | null;
export type Board = ReadonlyArray<ReadonlyArray<Cell>>;

export interface Connections {
  top: boolean;
  right: boolean;
  bottom: boolean;
  left: boolean;
}

export interface PuyoPair {
  pivotRow: number;
  pivotCol: number;
  rotation: 0 | 1 | 2 | 3; // 0=上, 1=右, 2=下, 3=左
  pivotColor: PuyoColor;
  childColor: PuyoColor;
}

export type GamePhase =
  | 'idle'
  | 'falling'
  | 'locking'
  | 'gravity'
  | 'erasing'
  | 'chain'
  | 'gameover';

export interface ParticleEffect {
  id: string;
  row: number;
  col: number;
  color: PuyoColor;
  dx: number;
  dy: number;
}

export interface GameState {
  phase: GamePhase;
  board: Board;
  currentPair: PuyoPair | null;
  nextPairs: [PuyoPair, PuyoPair];
  score: number;
  highScore: number;
  level: number;
  totalErased: number;
  chainCount: number;
  erasingCells: ReadonlyArray<[number, number]>;
  particles: ReadonlyArray<ParticleEffect>;
  isFlashing: boolean;
  chainLabelVisible: boolean;
  allClear: boolean;
}

export type GameAction =
  | { type: 'START_GAME' }
  | { type: 'MOVE_LEFT' }
  | { type: 'MOVE_RIGHT' }
  | { type: 'MOVE_DOWN' }
  | { type: 'HARD_DROP' }
  | { type: 'ROTATE_LEFT' }
  | { type: 'ROTATE_RIGHT' }
  | { type: 'LOCK_PAIR' }
  | { type: 'APPLY_GRAVITY' }
  | { type: 'COMMIT_ERASE' }
  | { type: 'ADVANCE_CHAIN' }
  | { type: 'REMOVE_PARTICLES'; ids: string[] }
  | { type: 'UPDATE_HIGHSCORE'; value: number };
