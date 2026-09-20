class DailyChallengeService {
  constructor(DailyChallenge, DailyChallengeResult, User) {
    this.DailyChallenge = DailyChallenge;
    this.DailyChallengeResult = DailyChallengeResult;
    this.User = User;
  }

  getIndiaDate(date = new Date()) {
    return new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(date);
  }

  async getTodayChallenge() {
    const today = this.getIndiaDate();

    const challenge = await this.DailyChallenge.findOne({
      date: today,
    }).lean();

    if (!challenge) {
      const error = new Error(
        `Daily challenge not available for ${today}`
      );
      error.statusCode = 404;
      throw error;
    }

    return challenge;
  }

  async getChallengeByDate(date) {
    const challenge = await this.DailyChallenge.findOne({
      date,
    }).lean();

    if (!challenge) {
      const error = new Error('Daily challenge not found');
      error.statusCode = 404;
      throw error;
    }

    return challenge;
  }

  async submitResult(userId, data) {
    if (!userId) {
      const error = new Error('User authentication required');
      error.statusCode = 401;
      throw error;
    }

    const challenge = await this.DailyChallenge.findOne({
      date: this.getIndiaDate(),
    });

    if (!challenge) {
      const error = new Error('Today\'s challenge is not available');
      error.statusCode = 404;
      throw error;
    }

    const wpm = Number(data.wpm);
    const rawWpm =
      data.rawWpm !== undefined ? Number(data.rawWpm) : wpm;
    const accuracy = Number(data.accuracy);
    const mistakes =
      data.mistakes !== undefined ? Number(data.mistakes) : 0;
    const correctCharacters =
      data.correctCharacters !== undefined
        ? Number(data.correctCharacters)
        : 0;
    const totalCharacters =
      data.totalCharacters !== undefined
        ? Number(data.totalCharacters)
        : 0;
    const consistency =
      data.consistency !== undefined
        ? Number(data.consistency)
        : 0;

    if (!Number.isFinite(wpm) || wpm < 0) {
      const error = new Error('Invalid WPM');
      error.statusCode = 400;
      throw error;
    }

    if (!Number.isFinite(rawWpm) || rawWpm < 0) {
      const error = new Error('Invalid raw WPM');
      error.statusCode = 400;
      throw error;
    }

    if (
      !Number.isFinite(accuracy) ||
      accuracy < 0 ||
      accuracy > 100
    ) {
      const error = new Error('Accuracy must be between 0 and 100');
      error.statusCode = 400;
      throw error;
    }

    if (!Number.isFinite(mistakes) || mistakes < 0) {
      const error = new Error('Invalid mistakes value');
      error.statusCode = 400;
      throw error;
    }

    if (
      !Number.isFinite(correctCharacters) ||
      correctCharacters < 0
    ) {
      const error = new Error('Invalid correct characters value');
      error.statusCode = 400;
      throw error;
    }

    if (
      !Number.isFinite(totalCharacters) ||
      totalCharacters < 0
    ) {
      const error = new Error('Invalid total characters value');
      error.statusCode = 400;
      throw error;
    }

    if (
      !Number.isFinite(consistency) ||
      consistency < 0 ||
      consistency > 100
    ) {
      const error = new Error(
        'Consistency must be between 0 and 100'
      );
      error.statusCode = 400;
      throw error;
    }

    const existingResult =
      await this.DailyChallengeResult.findOne({
        challenge: challenge._id,
        user: userId,
      });

    if (existingResult) {
      const error = new Error(
        'You have already completed today\'s challenge'
      );
      error.statusCode = 409;
      throw error;
    }

    const result = await this.DailyChallengeResult.create({
      challenge: challenge._id,
      user: userId,
      wpm,
      rawWpm,
      accuracy,
      mistakes,
      correctCharacters,
      totalCharacters,
      consistency,
      completed: true,
      submittedAt: new Date(),
    });

    const user = await this.User.findById(userId).lean();

    challenge.participantsCount += 1;

    const scoreEntry = {
      user: userId,
      name: user?.name || 'User',
      username: user?.username || '',
      avatar: user?.avatar || '',
      wpm,
      accuracy,
      submittedAt: result.submittedAt,
    };

    challenge.topScores.push(scoreEntry);

    challenge.topScores.sort((a, b) => {
      if (b.wpm !== a.wpm) {
        return b.wpm - a.wpm;
      }

      return b.accuracy - a.accuracy;
    });

    challenge.topScores = challenge.topScores
      .slice(0, 10)
      .map((score, index) => ({
        ...score.toObject(),
        rank: index + 1,
      }));

    await challenge.save();

    const rank = challenge.topScores.findIndex(
      (score) =>
        score.user?.toString() === userId.toString()
    );

    return {
      result,
      rank: rank === -1 ? null : rank + 1,
      participantsCount: challenge.participantsCount,
      topScores: challenge.topScores,
    };
  }

  async getUserHistory(userId, limit = 30) {
    if (!userId) {
      const error = new Error('User authentication required');
      error.statusCode = 401;
      throw error;
    }

    const safeLimit = Math.min(
      Math.max(Number(limit) || 30, 1),
      100
    );

    const results = await this.DailyChallengeResult.find({
      user: userId,
    })
      .populate(
        'challenge',
        'date title description duration difficulty targetWpm targetAccuracy'
      )
      .sort({ submittedAt: -1 })
      .limit(safeLimit)
      .lean();

    return results;
  }

  async getTodayResult(userId) {
    if (!userId) {
      const error = new Error('User authentication required');
      error.statusCode = 401;
      throw error;
    }

    const challenge = await this.DailyChallenge.findOne({
      date: this.getIndiaDate(),
    }).lean();

    if (!challenge) {
      const error = new Error('Today\'s challenge is not available');
      error.statusCode = 404;
      throw error;
    }

    const result = await this.DailyChallengeResult.findOne({
      challenge: challenge._id,
      user: userId,
    }).lean();

    if (!result) {
      return null;
    }

    const rank =
      await this.DailyChallengeResult.countDocuments({
        challenge: challenge._id,
        $or: [
          { wpm: { $gt: result.wpm } },
          {
            wpm: result.wpm,
            accuracy: { $gt: result.accuracy },
          },
        ],
      }) + 1;

    return {
      ...result,
      rank,
      participantsCount: challenge.participantsCount,
    };
  }
}

export default DailyChallengeService;