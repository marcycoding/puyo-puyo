import type { PuyoPair } from '@/types/game';
import PuyoCell from './PuyoCell';

// 3D風ピクセルボーダー
const PANEL_STYLE: React.CSSProperties = {
  background: '#000080',
  border: '3px solid #aaaaff',
  boxShadow: '3px 3px 0 #000030, inset 1px 1px 0 rgba(255,255,255,0.15)',
  fontFamily: 'var(--font-pixel), monospace',
};

interface NextPairDisplayProps {
  pair: PuyoPair;
  size?: 'sm' | 'md';
}

function NextPairDisplay({ pair, size = 'md' }: NextPairDisplayProps) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <PuyoCell color={pair.childColor} size={size} />
      <PuyoCell color={pair.pivotColor} size={size} />
    </div>
  );
}

interface NextPanelProps {
  nextPairs: [PuyoPair, PuyoPair];
}

export default function NextPanel({ nextPairs }: NextPanelProps) {
  return (
    <div className="p-3 text-white" style={PANEL_STYLE}>
      <p className="text-[8px] text-[#ffff00] uppercase mb-3 text-center">NEXT</p>

      <div className="flex flex-col gap-4 items-center">
        <div>
          <p className="text-[7px] text-[#aaaaff] text-center mb-1">1ST</p>
          <NextPairDisplay pair={nextPairs[0]} size="md" />
        </div>
        <div>
          <p className="text-[7px] text-[#aaaaff] text-center mb-1">2ND</p>
          <NextPairDisplay pair={nextPairs[1]} size="sm" />
        </div>
      </div>
    </div>
  );
}
