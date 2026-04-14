interface StartScreenProps {
  onStart: () => void;
  highScore: number;
}

const PIXEL_FONT = 'var(--font-pixel), monospace';

export default function StartScreen({ onStart, highScore }: StartScreenProps) {
  return (
    <div className="absolute inset-0 flex items-center justify-center z-30" style={{ background: 'rgba(0,0,64,0.85)' }}>
      <div
        className="text-center w-full mx-2 px-6 py-6"
        style={{
          background: '#000080',
          border: '4px solid #aaaaff',
          boxShadow: '6px 6px 0 #000030, inset 2px 2px 0 rgba(255,255,255,0.12)',
          fontFamily: PIXEL_FONT,
        }}
      >
        {/* タイトル */}
        <div
          className="text-[#ffff00] text-2xl mb-1 leading-tight"
          style={{ textShadow: '3px 3px 0 #886600, -1px -1px 0 #ffaa00' }}
        >
          PUYO
        </div>
        <div
          className="text-[#ffff00] text-2xl mb-1 leading-tight"
          style={{ textShadow: '3px 3px 0 #886600, -1px -1px 0 #ffaa00' }}
        >
          PUYO
        </div>
        <p className="text-[#aaaaff] text-[8px] mb-5 tracking-widest">ぷよぷよ</p>

        {/* ハイスコア */}
        {highScore > 0 && (
          <div
            className="mb-4 px-3 py-2"
            style={{
              border: '2px solid #ffff00',
              background: 'rgba(255,255,0,0.05)',
            }}
          >
            <p className="text-[#aaaaff] text-[7px] uppercase mb-1">BEST SCORE</p>
            <p className="text-[#ffff00] text-[11px] tabular-nums">{highScore.toLocaleString()}</p>
          </div>
        )}

        {/* 操作説明 */}
        <div
          className="mb-5 text-[8px] space-y-2 text-left px-2 py-3"
          style={{ borderTop: '1px solid #aaaaff', borderBottom: '1px solid #aaaaff' }}
        >
          <p><span style={{ color: '#00ffff' }}>← →</span> <span style={{ color: '#ffffff' }}>MOVE</span></p>
          <p><span style={{ color: '#00ffff' }}>Z / X</span> <span style={{ color: '#ffffff' }}>ROTATE</span></p>
          <p><span style={{ color: '#00ffff' }}>↓</span> <span style={{ color: '#ffffff' }}>SOFT DROP</span></p>
          <p><span style={{ color: '#00ffff' }}>SPACE</span> <span style={{ color: '#ffffff' }}>HARD DROP</span></p>
        </div>

        {/* スタートボタン */}
        <button
          onClick={onStart}
          className="w-full py-3 px-6 text-[#000060] text-[11px] font-bold transition-all duration-75"
          style={{
            background: '#ffff00',
            border: '3px solid #ffffff',
            boxShadow: '4px 4px 0 #886600',
            fontFamily: PIXEL_FONT,
          }}
          onMouseEnter={e => { e.currentTarget.style.boxShadow = '2px 2px 0 #886600'; e.currentTarget.style.transform = 'translate(2px, 2px)'; }}
          onMouseLeave={e => { e.currentTarget.style.boxShadow = '4px 4px 0 #886600'; e.currentTarget.style.transform = ''; }}
          onMouseDown={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translate(4px, 4px)'; }}
          onMouseUp={e => { e.currentTarget.style.boxShadow = '2px 2px 0 #886600'; e.currentTarget.style.transform = 'translate(2px, 2px)'; }}
        >
          ▶ START GAME
        </button>

        {/* 点滅テキスト */}
        <p
          className="mt-4 text-[#aaaaff] text-[8px]"
          style={{ animation: 'blink 1s step-end infinite' }}
        >
          PRESS SPACE TO START
        </p>
      </div>
    </div>
  );
}
