export type SoundEvent =
  | 'drop'      // ぷよ設置
  | 'erase'     // 消去
  | 'chain'     // 連鎖発生
  | 'allClear'  // 全消し
  | 'hardDrop'  // ハードドロップ
  | 'rotate'    // 回転
  | 'gameover'; // ゲームオーバー

export interface SoundManager {
  play(event: SoundEvent, chainCount?: number): void;
  setVolume(volume: number): void;
  setEnabled(enabled: boolean): void;
}

// Web Audio API を使ったプレースホルダー実装
// 実際の音声ファイルが用意できたら差し替えるだけでよい
class WebAudioSoundManager implements SoundManager {
  private ctx: AudioContext | null = null;
  private volume = 0.3;
  private enabled = true;

  private getCtx(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      try {
        this.ctx = new AudioContext();
      } catch {
        return null;
      }
    }
    return this.ctx;
  }

  private beep(
    frequency: number,
    duration: number,
    type: OscillatorType = 'sine',
    gain = this.volume
  ): void {
    if (!this.enabled) return;
    const ctx = this.getCtx();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.type = type;
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);
    gainNode.gain.setValueAtTime(gain, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  }

  play(event: SoundEvent, chainCount = 1): void {
    switch (event) {
      case 'rotate':
        this.beep(440, 0.05, 'square', 0.1);
        break;
      case 'drop':
        this.beep(220, 0.08, 'square', 0.15);
        break;
      case 'hardDrop':
        this.beep(180, 0.12, 'square', 0.2);
        break;
      case 'erase':
        this.beep(600, 0.15, 'sine', 0.2);
        break;
      case 'chain': {
        // 連鎖数に応じて音程を上げる
        const baseFreq = 523; // C5
        const freq = baseFreq * Math.pow(1.15, chainCount - 1);
        this.beep(freq, 0.2, 'triangle', 0.25);
        break;
      }
      case 'allClear':
        // 上昇アルペジオ
        [523, 659, 784, 1047].forEach((f, i) => {
          setTimeout(() => this.beep(f, 0.15, 'sine', 0.3), i * 80);
        });
        break;
      case 'gameover':
        [440, 370, 330, 220].forEach((f, i) => {
          setTimeout(() => this.beep(f, 0.2, 'sawtooth', 0.2), i * 150);
        });
        break;
    }
  }

  setVolume(volume: number): void {
    this.volume = Math.max(0, Math.min(1, volume));
  }

  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }
}

// シングルトン
let _soundManager: SoundManager | null = null;

export function getSoundManager(): SoundManager {
  if (!_soundManager) {
    _soundManager = new WebAudioSoundManager();
  }
  return _soundManager;
}
