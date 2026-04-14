'use client';

import { useMemo } from 'react';
import { BOARD_COLS, CELL_SIZE, HIDDEN_ROWS, VISIBLE_ROWS } from '@/lib/game/constants';
import { getChildPosition, hardDrop } from '@/lib/game/puyo';
import type { Board as BoardType, Cell, Connections, ParticleEffect, PuyoPair } from '@/types/game';
import PuyoCell from './PuyoCell';
import ChainLabel from './ChainLabel';

interface CellData {
  color: Cell;
  isErasing: boolean;
  isGhost: boolean;
  connections: Connections;
}

interface BoardProps {
  board: BoardType;
  currentPair: PuyoPair | null;
  erasingCells: ReadonlyArray<[number, number]>;
  particles: ReadonlyArray<ParticleEffect>;
  isFlashing: boolean;
  chainCount: number;
  chainLabelVisible: boolean;
  allClear: boolean;
  onRemoveParticle: (id: string) => void;
}

const PARTICLE_COLOR_MAP: Record<string, string> = {
  red:    'bg-red-400',
  blue:   'bg-blue-400',
  green:  'bg-emerald-400',
  yellow: 'bg-yellow-300',
  purple: 'bg-purple-400',
  ojama:  'bg-gray-400',
};

const NO_CONNECTIONS: Connections = { top: false, right: false, bottom: false, left: false };

function computeConnections(
  cells: { color: Cell; isGhost: boolean }[][],
  row: number,
  col: number
): Connections {
  const cell = cells[row]?.[col];
  if (!cell?.color || cell.isGhost) return NO_CONNECTIONS;
  const color = cell.color;

  const check = (r: number, c: number): boolean => {
    const neighbor = cells[r]?.[c];
    return !!neighbor && !neighbor.isGhost && neighbor.color === color;
  };

  return {
    top:    check(row - 1, col),
    bottom: check(row + 1, col),
    left:   check(row, col - 1),
    right:  check(row, col + 1),
  };
}

export default function Board({
  board,
  currentPair,
  erasingCells,
  particles,
  isFlashing,
  chainCount,
  chainLabelVisible,
  allClear,
  onRemoveParticle,
}: BoardProps) {
  const erasingSet = useMemo(
    () => new Set(erasingCells.map(([r, c]) => `${r},${c}`)),
    [erasingCells]
  );

  const displayCells = useMemo<CellData[][]>(() => {
    // 表示行（row 2〜13）を基底として初期化
    const cells: Array<Array<{ color: Cell; isErasing: boolean; isGhost: boolean }>> =
      board.slice(HIDDEN_ROWS).map((row, visRow) =>
        row.map((color, col) => ({
          color,
          isErasing: erasingSet.has(`${visRow + HIDDEN_ROWS},${col}`),
          isGhost: false,
        }))
      );

    if (currentPair) {
      // ゴーストを先に描画（現在地より下）
      const ghost = hardDrop(board, currentPair);
      const ghostChild = getChildPosition(ghost);
      const ghostPositions = [
        { row: ghost.pivotRow - HIDDEN_ROWS, col: ghost.pivotCol, color: ghost.pivotColor },
        { row: ghostChild.row - HIDDEN_ROWS, col: ghostChild.col, color: ghost.childColor },
      ];
      for (const { row, col, color } of ghostPositions) {
        if (row >= 0 && row < VISIBLE_ROWS && col >= 0 && col < BOARD_COLS) {
          if (!cells[row]![col]!.color) {
            cells[row]![col] = { color, isErasing: false, isGhost: true };
          }
        }
      }

      // 現在のツモを上書き描画
      const child = getChildPosition(currentPair);
      const pairPositions = [
        { row: currentPair.pivotRow - HIDDEN_ROWS, col: currentPair.pivotCol, color: currentPair.pivotColor },
        { row: child.row - HIDDEN_ROWS, col: child.col, color: currentPair.childColor },
      ];
      for (const { row, col, color } of pairPositions) {
        if (row >= 0 && row < VISIBLE_ROWS && col >= 0 && col < BOARD_COLS) {
          cells[row]![col] = { color, isErasing: false, isGhost: false };
        }
      }
    }

    // 連結情報を付加
    return cells.map((row, visRow) =>
      row.map((cell, col) => ({
        ...cell,
        connections: computeConnections(cells, visRow, col),
      }))
    );
  }, [board, currentPair, erasingSet]);

  const boardWidthPx = BOARD_COLS * CELL_SIZE;
  const boardHeightPx = VISIBLE_ROWS * CELL_SIZE;

  return (
    <div
      className="relative overflow-hidden"
      style={{
        width: boardWidthPx,
        height: boardHeightPx,
        background: '#000020',
        border: '3px solid #aaaaff',
        boxShadow: 'inset 2px 2px 0 rgba(170,170,255,0.3), inset -2px -2px 0 rgba(0,0,0,0.5)',
      }}
    >
      {/* グリッド */}
      <div
        className="grid relative"
        style={{
          gridTemplateColumns: `repeat(${BOARD_COLS}, ${CELL_SIZE}px)`,
          gridTemplateRows: `repeat(${VISIBLE_ROWS}, ${CELL_SIZE}px)`,
          width: boardWidthPx,
          height: boardHeightPx,
        }}
      >
        {/* グリッド線 */}
        {Array.from({ length: VISIBLE_ROWS * BOARD_COLS }).map((_, i) => (
          <div key={i} className="border border-[#0a0a40]" />
        ))}

        {/* ぷよセル（absolute overlay） */}
        {displayCells.map((row, visRow) =>
          row.map((cell, col) => (
            <div
              key={`${visRow}-${col}`}
              className="absolute flex items-center justify-center"
              style={{
                left: col * CELL_SIZE,
                top: visRow * CELL_SIZE,
                width: CELL_SIZE,
                height: CELL_SIZE,
              }}
            >
              <PuyoCell
                color={cell.color}
                isErasing={cell.isErasing}
                isGhost={cell.isGhost}
                connections={cell.connections}
              />
            </div>
          ))
        )}
      </div>

      {/* パーティクルオーバーレイ */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map(p => {
          const visRow = p.row - HIDDEN_ROWS;
          if (visRow < 0 || visRow >= VISIBLE_ROWS) return null;
          const top = visRow * CELL_SIZE + CELL_SIZE / 2;
          const left = p.col * CELL_SIZE + CELL_SIZE / 2;
          const colorClass = PARTICLE_COLOR_MAP[p.color] ?? 'bg-white';
          return (
            <div
              key={p.id}
              className={`absolute w-2 h-2 rounded-full animate-particle ${colorClass}`}
              style={{
                top,
                left,
                '--tx': `${p.dx}px`,
                '--ty': `${p.dy}px`,
              } as React.CSSProperties}
              onAnimationEnd={() => onRemoveParticle(p.id)}
            />
          );
        })}
      </div>

      {/* 画面フラッシュ */}
      {isFlashing && (
        <div className="absolute inset-0 bg-white/30 animate-screen-flash pointer-events-none" />
      )}

      {/* 連鎖ラベル */}
      <ChainLabel chainCount={chainCount} visible={chainLabelVisible} />

      {/* 全消しラベル */}
      {allClear && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="animate-chain-pop text-center" style={{ fontFamily: 'var(--font-pixel), monospace' }}>
            <div className="text-lg tracking-widest text-[#ffff00]" style={{ textShadow: '2px 2px 0 #000' }}>
              ALL CLEAR
            </div>
            <div className="text-[10px] text-[#00ffcc] mt-2" style={{ textShadow: '1px 1px 0 #000' }}>+30,000</div>
          </div>
        </div>
      )}
    </div>
  );
}
