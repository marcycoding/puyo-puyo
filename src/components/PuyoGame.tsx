'use client';

import { useCallback, useEffect, useReducer, useRef } from 'react';
import { createInitialState, gameReducer } from '@/lib/game/reducer';
import { HIGHSCORE_KEY } from '@/lib/game/constants';
import { useGameLoop } from '@/hooks/useGameLoop';
import { useKeyboard } from '@/hooks/useKeyboard';
import { useTouch } from '@/hooks/useTouch';
import Board from '@/components/game/Board';
import NextPanel from '@/components/game/NextPanel';
import ScorePanel from '@/components/game/ScorePanel';
import StartScreen from '@/components/screens/StartScreen';
import GameOverScreen from '@/components/screens/GameOverScreen';

// 3D風ピクセルボーダー（上左:明、下右:暗）
const RAISED_BOX = '3px 3px 0 #aaaaff, -1px -1px 0 #000030, inset 1px 1px 0 rgba(255,255,255,0.15)';

export default function PuyoGame() {
  const [state, dispatch] = useReducer(gameReducer, undefined, createInitialState);
  const touchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(HIGHSCORE_KEY);
      if (saved !== null) {
        const value = parseInt(saved, 10);
        if (!isNaN(value) && value > 0) dispatch({ type: 'UPDATE_HIGHSCORE', value });
      }
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    if (state.highScore <= 0) return;
    try { localStorage.setItem(HIGHSCORE_KEY, String(state.highScore)); }
    catch { /* ignore */ }
  }, [state.highScore]);

  useGameLoop(state, dispatch);
  useKeyboard(dispatch, state.phase);
  useTouch(dispatch, state.phase, touchRef);

  const handleStart = useCallback(() => dispatch({ type: 'START_GAME' }), []);
  const handleRemoveParticle = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_PARTICLES', ids: [id] });
  }, []);

  return (
    <div
      ref={touchRef}
      className="min-h-screen w-full flex flex-col items-center justify-center select-none touch-none py-4"
    >
      {/* タイトルバナー */}
      <div
        className="mb-4 px-6 py-2 text-center"
        style={{
          background: '#000080',
          border: '3px solid #aaaaff',
          boxShadow: RAISED_BOX,
          fontFamily: 'var(--font-pixel), monospace',
        }}
      >
        <span className="text-[#ffff00] text-base tracking-widest" style={{ textShadow: '2px 2px 0 #aa7700' }}>
          ★ PUYO PUYO ★
        </span>
      </div>

      {/* ゲームエリア全体フレーム */}
      <div
        className="flex items-start gap-0"
        style={{
          background: '#000050',
          border: '4px solid #aaaaff',
          boxShadow: '6px 6px 0 #000030, -2px -2px 0 #ccccff',
          padding: '8px',
        }}
      >
        {/* ゲームボード */}
        <div className="relative">
          <Board
            board={state.board}
            currentPair={state.currentPair}
            erasingCells={state.erasingCells}
            particles={state.particles}
            isFlashing={state.isFlashing}
            chainCount={state.chainCount}
            chainLabelVisible={state.chainLabelVisible}
            allClear={state.allClear}
            onRemoveParticle={handleRemoveParticle}
          />

          {state.phase === 'idle' && (
            <StartScreen onStart={handleStart} highScore={state.highScore} />
          )}
          {state.phase === 'gameover' && (
            <GameOverScreen
              score={state.score}
              highScore={state.highScore}
              onRestart={handleStart}
            />
          )}
        </div>

        {/* サイドパネル */}
        <div className="flex flex-col gap-2 ml-2">
          <NextPanel nextPairs={state.nextPairs} />
          <ScorePanel
            score={state.score}
            highScore={state.highScore}
            level={state.level}
            chainCount={state.chainCount}
          />
          {state.phase === 'falling' && (
            <div
              className="text-[7px] space-y-1.5 p-2"
              style={{
                background: '#000080',
                border: '2px solid #aaaaff',
                boxShadow: RAISED_BOX,
                color: '#aaaaff',
                fontFamily: 'var(--font-pixel), monospace',
              }}
            >
              <p><span style={{ color: '#ffff00' }}>←→</span> MOVE</p>
              <p><span style={{ color: '#ffff00' }}>ZX</span>  TURN</p>
              <p><span style={{ color: '#ffff00' }}>↓</span>   SOFT</p>
              <p><span style={{ color: '#ffff00' }}>SPC</span> DROP</p>
            </div>
          )}
        </div>
      </div>

      {/* フッター */}
      <div
        className="mt-3 text-[7px] text-[#aaaaff]"
        style={{ fontFamily: 'var(--font-pixel), monospace' }}
      >
        © 1991 RETRO STYLE
      </div>
    </div>
  );
}
