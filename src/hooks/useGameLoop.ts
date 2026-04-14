'use client';

import { useEffect } from 'react';
import type { Dispatch } from 'react';
import {
  ERASE_ANIMATION_MS,
  FALL_SPEED_TABLE,
  GRAVITY_DELAY_MS,
  CHAIN_LABEL_MS,
} from '@/lib/game/constants';
import type { GameAction, GameState } from '@/types/game';

export function useGameLoop(state: GameState, dispatch: Dispatch<GameAction>): void {
  const { phase, level } = state;

  // falling: 定期落下
  useEffect(() => {
    if (phase !== 'falling') return;
    const speed = FALL_SPEED_TABLE[level] ?? 1000;
    const id = setInterval(() => dispatch({ type: 'MOVE_DOWN' }), speed);
    return () => clearInterval(id);
  }, [phase, level, dispatch]);

  // locking: 即座に設置確定
  useEffect(() => {
    if (phase !== 'locking') return;
    const id = setTimeout(() => dispatch({ type: 'LOCK_PAIR' }), 0);
    return () => clearTimeout(id);
  }, [phase, dispatch]);

  // gravity: 重力適用
  useEffect(() => {
    if (phase !== 'gravity') return;
    const id = setTimeout(() => dispatch({ type: 'APPLY_GRAVITY' }), GRAVITY_DELAY_MS);
    return () => clearTimeout(id);
  }, [phase, dispatch]);

  // erasing: 消去アニメーション後に確定
  useEffect(() => {
    if (phase !== 'erasing') return;
    const id = setTimeout(() => dispatch({ type: 'COMMIT_ERASE' }), ERASE_ANIMATION_MS);
    return () => clearTimeout(id);
  }, [phase, dispatch]);

  // chain: 連鎖ラベル表示後に次の重力フェーズへ
  useEffect(() => {
    if (phase !== 'chain') return;
    const id = setTimeout(() => dispatch({ type: 'ADVANCE_CHAIN' }), CHAIN_LABEL_MS);
    return () => clearTimeout(id);
  }, [phase, dispatch]);
}
