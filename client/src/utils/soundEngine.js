/**
 * Web Audio Synthesizer for high-fidelity mechanical keyboard & error sounds.
 * 100% standalone, zero latency, no external asset loading issues.
 */

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.soundType = 'mechanical'; // 'mechanical' | 'typewriter' | 'beep' | 'off'
    this.errorSoundEnabled = true;
    this.volume = 0.5;
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playKeypress(soundType = this.soundType) {
    if (soundType === 'off' || this.volume <= 0) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    if (soundType === 'typewriter') {
      // Crisp metallic typewriter click
      osc.type = 'square';
      osc.frequency.setValueAtTime(800 + Math.random() * 200, now);
      osc.frequency.exponentialRampToValueAtTime(120, now + 0.04);

      gain.gain.setValueAtTime(this.volume * 0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.04);
    } else if (soundType === 'beep') {
      // Soft modern electronic pip
      osc.type = 'sine';
      osc.frequency.setValueAtTime(650 + Math.random() * 80, now);

      gain.gain.setValueAtTime(this.volume * 0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.03);
    } else {
      // Default: Deep tactile mechanical switch "thock"
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320 + Math.random() * 60, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.045);

      gain.gain.setValueAtTime(this.volume * 0.45, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.045);
    }
  }

  playError() {
    if (!this.errorSoundEnabled || this.volume <= 0) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.linearRampToValueAtTime(110, now + 0.08);

    gain.gain.setValueAtTime(this.volume * 0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.08);
  }

  playCompletion() {
    if (this.volume <= 0) return;
    this.init();
    if (!this.ctx) return;

    // Victory chime chord (C5 - E5 - G5 - C6)
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, i) => {
      const now = this.ctx.currentTime + (i * 0.08);
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(this.volume * 0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.4);
    });
  }

  playVictory() {
    this.playCompletion();
  }

  playClick(soundType = this.soundType, volume = this.volume) {
    if (typeof volume === 'number') this.volume = volume;
    this.playKeypress(soundType);
  }

  playKey(soundType = this.soundType, volume = this.volume) {
    if (typeof volume === 'number') this.volume = volume;
    this.playKeypress(soundType);
  }
}

export const soundEngine = new SoundEngine();
