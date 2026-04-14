'use client';

import { useEffect, useRef } from 'react';
import type { Dispatch, RefObject } from 'react';
import type { GameAction, GamePhase } from '@/types/game';

export function useTouch(
  dispatch: Dispatch<GameAction>,
  phase: GamePhase,
  containerRef: RefObject<HTMLElement | null>
): void {
  const startX = useRef(0);
  const startY = useRef(0);
  const lastMoveX = useRef(0);
  const lastMoveTime = useRef(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    function onTouchStart(e: TouchEvent) {
      const touch = e.touches[0];
      if (!touch) return;
      startX.current = touch.clientX;
      startY.current = touch.clientY;
      lastMoveX.current = touch.clientX;
      lastMoveTime.current = Date.now();
    }

    function onTouchMove(e: TouchEvent) {
      if (phase !== 'falling') return;
      const touch = e.touches[0];
      if (!touch) return;

      const now = Date.now();
      if (now - lastMoveTime.current < 120) return;

      const dx = touch.clientX - lastMoveX.current;
      if (Math.abs(dx) > 20) {
        dispatch({ type: dx > 0 ? 'MOVE_RIGHT' : 'MOVE_LEFT' });
        lastMoveX.current = touch.clientX;
        lastMoveTime.current = now;
      }
    }

    function onTouchEnd(e: TouchEvent) {
      const touch = e.changedTouches[0];
      if (!touch) return;

      const dx = touch.clientX - startX.current;
      const dy = touch.clientY - startY.current;

      if (phase === 'idle' || phase === 'gameover') {
        dispatch({ type: 'START_GAME' });
        return;
      }

      if (phase !== 'falling') return;

      if (Math.abs(dx) < 10 && Math.abs(dy) < 10) {
        // タップ: 右側→右回転, 左側→左回転
        const rect = (e.target as HTMLElement).getBoundingClientRect();
        const tapX = touch.clientX - rect.left;
        dispatch({ type: tapX > rect.width / 2 ? 'ROTATE_RIGHT' : 'ROTATE_LEFT' });
        return;
      }

      if (dy > 50 && Math.abs(dy) > Math.abs(dx)) {
        dispatch({ type: 'HARD_DROP' });
      }
    }

    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchmove', onTouchMove, { passive: true });
    el.addEventListener('touchend', onTouchEnd);

    return () => {
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove', onTouchMove);
      el.removeEventListener('touchend', onTouchEnd);
    };
  }, [phase, dispatch, containerRef]);
}
