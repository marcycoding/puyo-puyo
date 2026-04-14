import type { Cell, Connections } from '@/types/game';

// フラットカラー + 2px インナーボーダーでレトロ8bit感を表現
const COLOR_STYLES: Readonly<Record<string, string>> = {
  red:    'bg-red-500 border-2 border-red-300',
  blue:   'bg-blue-500 border-2 border-blue-300',
  green:  'bg-green-500 border-2 border-green-300',
  yellow: 'bg-yellow-400 border-2 border-yellow-200',
  purple: 'bg-purple-500 border-2 border-purple-300',
  ojama:  'bg-gray-400 border-2 border-gray-200',
};

const NO_CONNECTIONS: Connections = { top: false, right: false, bottom: false, left: false };

function getBorderRadius(c: Connections): string {
  const full = '50%';
  const flat = '15%';
  const tl = c.top || c.left    ? flat : full;
  const tr = c.top || c.right   ? flat : full;
  const br = c.bottom || c.right ? flat : full;
  const bl = c.bottom || c.left  ? flat : full;
  return `${tl} ${tr} ${br} ${bl}`;
}

interface PuyoCellProps {
  color: Cell;
  isErasing?: boolean;
  isGhost?: boolean;
  size?: 'sm' | 'md';
  connections?: Connections;
}

export default function PuyoCell({
  color,
  isErasing = false,
  isGhost = false,
  size = 'md',
  connections = NO_CONNECTIONS,
}: PuyoCellProps) {
  if (!color) {
    return <div className={size === 'md' ? 'w-9 h-9' : 'w-6 h-6'} />;
  }

  const colorStyle = COLOR_STYLES[color] ?? COLOR_STYLES['ojama']!;
  const sizeClass = size === 'md' ? 'w-9 h-9' : 'w-6 h-6';
  const borderRadius = getBorderRadius(connections);

  return (
    <div
      className={[
        sizeClass,
        'relative',
        colorStyle,
        isErasing ? 'animate-puyo-erase' : '',
        isGhost ? 'opacity-20' : '',
      ].join(' ')}
      style={{ borderRadius }}
    >
      {/* ピクセル風ハイライト（左上の明るい四角） */}
      {!isGhost && (
        <div className="absolute top-0.5 left-0.5 w-1.5 h-1 bg-white/60" />
      )}
    </div>
  );
}
