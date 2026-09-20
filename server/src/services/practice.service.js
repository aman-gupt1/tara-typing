class PracticeService {
  constructor(PracticeSession) {
    this.PracticeSession = PracticeSession;
  }

  async savePracticeSession(userId, data) {
    const {
      mode,
      targetParam,
      wpm,
      accuracy,
      errors,
      mistakes,
      duration,
    } = data;

    const calculatedMistakes =
      mistakes !== undefined
        ? mistakes
        : errors || 0;

    const session = await this.PracticeSession.create({
      user: userId || null,
      mode: mode || 'time',
      targetParam,
      wpm: Math.round(wpm),
      accuracy: Math.round(accuracy * 10) / 10,
      mistakes: calculatedMistakes,
      duration: duration || 30,
    });

    const sessionObject = session.toObject();

    sessionObject.errors = sessionObject.mistakes;

    return sessionObject;
  }

  async getPracticeHistory(userId) {
    const filter = userId
      ? { user: userId }
      : {};

    const sessions = await this.PracticeSession.find(filter)
      .sort({ createdAt: -1 })
      .limit(20);

    return sessions.map((session) => {
      const sessionObject = session.toObject();

      sessionObject.errors = sessionObject.mistakes;

      return sessionObject;
    });
  }
}

export default PracticeService;