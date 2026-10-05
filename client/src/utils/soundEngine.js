/**
 * Web Audio Synthesizer for high-fidelity mechanical keyboard, arcade laser & celebration sounds.
 * 100% standalone, zero latency, no external asset loading issues.
 */

export const SOUNDPACKS = [
  { id: 'mechanical', name: 'Mechanical Thock', desc: 'Deep resonant linear switch bottom-out' },
  { id: 'holypanda',  name: 'Holy Panda Tactile', desc: 'Crisp snappy tactile bump & pop' },
  { id: 'cherryblue', name: 'Cherry MX Blue', desc: 'High-pitched crisp clicky snap' },
  { id: 'topre',      name: 'Topre Capacitive', desc: 'Soft muffled electro-capacitive dome pop' },
  { id: 'typewriter', name: 'Vintage Typewriter', desc: 'Classic metal strike with mechanical clatter' },
  { id: 'raindrop',   name: 'Raindrop Water Click', desc: 'Organic soothing water droplet sound' },
];

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.soundType = 'mechanical';
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

    switch (soundType) {
      case 'holypanda': {
        // Heavy tactile bump (dual frequency snap)
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(520 + Math.random() * 80, now);
        osc.frequency.exponentialRampToValueAtTime(110, now + 0.035);

        gain.gain.setValueAtTime(this.volume * 0.5, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.035);
        break;
      }

      case 'cherryblue': {
        // High clicky switch snap
        osc.type = 'square';
        osc.frequency.setValueAtTime(1200 + Math.random() * 200, now);
        osc.frequency.exponentialRampToValueAtTime(300, now + 0.025);

        gain.gain.setValueAtTime(this.volume * 0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.025);
        break;
      }

      case 'topre': {
        // Muffled electro-capacitive rubber dome pop
        osc.type = 'sine';
        osc.frequency.setValueAtTime(240 + Math.random() * 40, now);
        osc.frequency.exponentialRampToValueAtTime(60, now + 0.05);

        gain.gain.setValueAtTime(this.volume * 0.55, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.05);
        break;
      }

      case 'typewriter': {
        // Classic mechanical typewriter strike
        osc.type = 'square';
        osc.frequency.setValueAtTime(800 + Math.random() * 200, now);
        osc.frequency.exponentialRampToValueAtTime(120, now + 0.04);

        gain.gain.setValueAtTime(this.volume * 0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.04);
        break;
      }

      case 'raindrop': {
        // Organic water droplet click
        osc.type = 'sine';
        osc.frequency.setValueAtTime(900 + Math.random() * 300, now);
        osc.frequency.exponentialRampToValueAtTime(400, now + 0.04);

        gain.gain.setValueAtTime(this.volume * 0.45, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.04);
        break;
      }

      case 'beep': {
        // Subtle digital pip
        osc.type = 'sine';
        osc.frequency.setValueAtTime(650 + Math.random() * 80, now);

        gain.gain.setValueAtTime(this.volume * 0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.03);
        break;
      }

      case 'mechanical':
      default: {
        // Deep linear mechanical "thock"
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(320 + Math.random() * 60, now);
        osc.frequency.exponentialRampToValueAtTime(80, now + 0.045);

        gain.gain.setValueAtTime(this.volume * 0.45, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.045);
        break;
      }
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

  playLaser() {
    if (this.volume <= 0) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.exponentialRampToValueAtTime(110, now + 0.12);

    gain.gain.setValueAtTime(this.volume * 0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.12);
  }

  playExplosion() {
    if (this.volume <= 0) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(30, now + 0.25);

    gain.gain.setValueAtTime(this.volume * 0.45, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.25);
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
