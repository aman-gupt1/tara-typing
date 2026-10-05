// Bot difficulty configurations
export const BOT_PROFILES = [
  {
    id: 'turtle',
    name: 'Turtle Turbo',
    avatar: '🐢',
    targetWpm: 28,
    carColor: '#10b981',
    description: 'Slow, steady, and disciplined (25-30 WPM)',
    variance: 4
  },
  {
    id: 'rabbit',
    name: 'Speedy Rabbit',
    avatar: '🐇',
    targetWpm: 55,
    carColor: '#38bdf8',
    description: 'Fast paced with burst typing (50-60 WPM)',
    variance: 8
  },
  {
    id: 'cheetah',
    name: 'Apex Cheetah',
    avatar: '🐆',
    targetWpm: 85,
    carColor: '#f59e0b',
    description: 'Pro grandmaster speed racer (80-90 WPM)',
    variance: 10
  },
  {
    id: 'ghost',
    name: 'Adaptive Ghost',
    avatar: '👻',
    targetWpm: 60,
    carColor: '#a855f7',
    description: 'Mirror bot matching your live WPM to push your limits',
    isAdaptive: true,
    variance: 6
  }
];

export class AIBotSimulator {
  constructor(botProfile, passageText, onUpdate, onFinish) {
    this.profile = botProfile;
    this.passage = passageText;
    this.totalChars = passageText.length;
    this.onUpdate = onUpdate;
    this.onFinish = onFinish;

    this.charIndex = 0;
    this.startTime = null;
    this.isRunning = false;
    this.timer = null;
    this.currentWpm = botProfile.targetWpm;
  }

  start(playerCurrentWpm = 0) {
    this.startTime = Date.now();
    this.isRunning = true;
    this.charIndex = 0;
    this.scheduleNextChar(playerCurrentWpm);
  }

  stop() {
    this.isRunning = false;
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  scheduleNextChar(playerWpm = 0) {
    if (!this.isRunning) return;

    let targetWpm = this.profile.targetWpm;
    if (this.profile.isAdaptive && playerWpm > 10) {
      // Adaptive ghost stays within 2 WPM of the player
      targetWpm = playerWpm + (Math.random() * 4 - 2);
    }

    // Add random micro-variance for human-like typing rhythm
    const jitter = (Math.random() - 0.5) * (this.profile.variance || 5);
    const effectiveWpm = Math.max(15, targetWpm + jitter);
    this.currentWpm = effectiveWpm;

    // Milliseconds per character: (60,000 ms / (WPM * 5 chars per word))
    const msPerChar = Math.max(50, 60000 / (effectiveWpm * 5));

    this.timer = setTimeout(() => {
      if (!this.isRunning) return;

      this.charIndex++;
      const progress = Math.min(100, (this.charIndex / this.totalChars) * 100);

      this.onUpdate({
        id: this.profile.id,
        name: this.profile.name,
        avatar: this.profile.avatar,
        carColor: this.profile.carColor,
        isBot: true,
        progress: Math.round(progress),
        wpm: Math.round(this.currentWpm),
        finished: this.charIndex >= this.totalChars
      });

      if (this.charIndex >= this.totalChars) {
        this.isRunning = false;
        if (this.onFinish) {
          this.onFinish({
            id: this.profile.id,
            timeTaken: Date.now() - this.startTime,
            wpm: Math.round(this.currentWpm)
          });
        }
      } else {
        this.scheduleNextChar(playerWpm);
      }
    }, msPerChar);
  }
}
