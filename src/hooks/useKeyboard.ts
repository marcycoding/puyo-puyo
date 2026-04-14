'use client';

import { useEffect } from 'react';
import type { Dispatch } from 'react';
import type { GameAction, GamePhase } from '@/types/game';

type SimpleActionType = 'MOVE_LEFT' | 'MOVE_RIGHT' | 'MOVE_DOWN' | 'HARD_DROP' | 'ROTATE_LEFT' | 'ROTATE_RIGHT';

const MOVE_KEYS: Readonly<Record<string, SimpleActionType>> = {
  ArrowLeft: 'MOVE_LEFT',  a: 'MOVE_LEFT',  A: 'MOVE_LEFT',
  ArrowRight: 'MOVE_RIGHT', d: 'MOVE_RIGHT', D: 'MOVE_RIGHT',
  ArrowDown: 'MOVE_DOWN',  s: 'MOVE_DOWN',  S: 'MOVE_DOWN',
};

const ONCE_KEYS: Readonly<Record<string, SimpleActionType>> = {
  ' ':        'HARD_DROP',
  ArrowUp:    'HARD_DROP',
  z:          'ROTATE_LEFT',  Z: 'ROTATE_LEFT',  ',': 'ROTATE_LEFT',
  x:          'ROTATE_RIGHT', X: 'ROTATE_RIGHT', '.': 'ROTATE_RIGHT',
};

export function useKeyboard(dispatch: Dispatch<GameAction>, phase: GamePhase): void {
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      // スタート・リスタート
      if (phase === 'idle' || phase === 'gameover') {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          dispatch({ type: 'START_GAME' });
        }
        return;
      }

      if (phase !== 'falling') return;

      // 押しっぱなし対応（移動・ソフトドロップ）
      const moveAction = MOVE_KEYS[e.key];
      if (moveAction) {
        e.preventDefault();
        dispatch({ type: moveAction } as GameAction);
        return;
      }

      // 1回のみ（ハードドロップ・回転）
      if (!e.repeat) {
        const onceAction = ONCE_KEYS[e.key];
        if (onceAction) {
          e.preventDefault();
          dispatch({ type: onceAction } as GameAction);
        }
      }
    }

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [phase, dispatch]);
}
