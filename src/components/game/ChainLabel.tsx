interface ChainLabelProps {
  chainCount: number;
  visible: boolean;
}

const CHAIN_COLORS = [
  '#ffff00',
  '#ff8800',
  '#ff4444',
  '#ff4488',
  '#cc44ff',
  '#4488ff',
  '#00ffcc',
];

export default function ChainLabel({ chainCount, visible }: ChainLabelProps) {
  if (!visible || chainCount === 0) return null;

  const color = CHAIN_COLORS[Math.min(chainCount - 1, CHAIN_COLORS.length - 1)] ?? '#ffff00';

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
      <div
        className="animate-chain-pop text-base text-center"
        style={{
          fontFamily: 'var(--font-pixel), monospace',
          color,
          textShadow: '3px 3px 0 #000, -1px -1px 0 #000',
        }}
      >
        {chainCount >= 2 ? `${chainCount} CHAIN!!` : 'NICE!'}
      </div>
    </div>
  );
}
