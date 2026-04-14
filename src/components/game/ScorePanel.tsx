const PANEL_STYLE: React.CSSProperties = {
  background: '#000080',
  border: '3px solid #aaaaff',
  boxShadow: '3px 3px 0 #000030, inset 1px 1px 0 rgba(255,255,255,0.15)',
  fontFamily: 'var(--font-pixel), monospace',
};

interface ScorePanelProps {
  score: number;
  highScore: number;
  level: number;
  chainCount: number;
}

export default function ScorePanel({ score, highScore, level, chainCount }: ScorePanelProps) {
  return (
    <div className="p-3 text-white min-w-[112px]" style={PANEL_STYLE}>
      <div className="mb-3">
        <p className="text-[7px] text-[#aaaaff] uppercase mb-1">HI-SCORE</p>
        <p className="text-[10px] text-[#ffff00] tabular-nums">
          {highScore.toLocaleString()}
        </p>
      </div>

      <div className="mb-3">
        <p className="text-[7px] text-[#aaaaff] uppercase mb-1">SCORE</p>
        <p className="text-[11px] text-white tabular-nums">
          {score.toLocaleString()}
        </p>
      </div>

      <div className="mb-3">
        <p className="text-[7px] text-[#aaaaff] uppercase mb-1">LEVEL</p>
        <p className="text-[11px] text-[#00ffff] tabular-nums">{level}</p>
      </div>

      {chainCount > 0 && (
        <div>
          <p className="text-[7px] text-[#aaaaff] uppercase mb-1">CHAIN</p>
          <p className="text-[11px] text-[#ff44aa] tabular-nums">{chainCount}</p>
        </div>
      )}
    </div>
  );
}
