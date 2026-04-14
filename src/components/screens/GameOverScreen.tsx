const PIXEL_FONT = 'var(--font-pixel), monospace';

interface GameOverScreenProps {
  score: number;
  highScore: number;
  onRestart: () => void;
}

export default function GameOverScreen({ score, highScore, onRestart }: GameOverScreenProps) {
  const isNewRecord = score >= highScore && score > 0;

  return (
    <div className="absolute inset-0 flex items-center justify-center z-30" style={{ background: 'rgba(0,0,64,0.88)' }}>
      <div
        className="text-center w-full mx-2 px-6 py-6"
        style={{
          background: '#000080',
          border: '4px solid #aaaaff',
          boxShadow: '6px 6px 0 #000030, inset 2px 2px 0 rgba(255,255,255,0.12)',
          fontFamily: PIXEL_FONT,
        }}
      >
        <h2
          className="text-lg text-[#ff4444] mb-1"
          style={{ textShadow: '3px 3px 0 #880000' }}
        >
          GAME
        </h2>
        <h2
          className="text-lg text-[#ff4444] mb-3"
          style={{ textShadow: '3px 3px 0 #880000' }}
        >
          OVER
        </h2>

        <div style={{ borderBottom: '2px dashed #aaaaff' }} className="mb-4" />

        {isNewRecord && (
          <p
            className="mb-3 text-[#ffff00] text-[9px]"
            style={{ animation: 'blink 0.8s step-end infinite' }}
          >
            ★ NEW RECORD! ★
          </p>
        )}

        <div className="mb-5 space-y-3">
          <div
            className="px-3 py-2"
            style={{ border: '2px solid #aaaaff', background: 'rgba(0,0,0,0.3)' }}
          >
            <p className="text-[#aaaaff] text-[7px] uppercase mb-1">SCORE</p>
            <p
              className="text-sm tabular-nums"
              style={{ color: isNewRecord ? '#ffff00' : '#ffffff' }}
            >
              {score.toLocaleString()}
            </p>
          </div>

          <div
            className="px-3 py-2"
            style={{ border: '2px solid #aaaaff', background: 'rgba(0,0,0,0.3)' }}
          >
            <p className="text-[#aaaaff] text-[7px] uppercase mb-1">BEST</p>
            <p className="text-[11px] tabular-nums text-[#ffff00]">
              {highScore.toLocaleString()}
            </p>
          </div>
        </div>

        <button
          onClick={onRestart}
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
          ▶ RETRY
        </button>

        <p
          className="mt-4 text-[#aaaaff] text-[8px]"
          style={{ animation: 'blink 1s step-end infinite' }}
        >
          PRESS SPACE TO RETRY
        </p>
      </div>
    </div>
  );
}
