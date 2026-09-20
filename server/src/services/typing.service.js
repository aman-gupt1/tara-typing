
class TypingService {
  constructor(TypingResult, User,achievementService,streakService) {
    this.TypingResult = TypingResult;
    this.User = User;
    this.achievementService = achievementService;
    this.streakService = streakService;
  }


  // save typing
 async saveTypingResult(userId, data) {
  const {
    mode,
    duration,
    wpm,
    rawWpm,
    accuracy,
    errors,
    mistakes,
    correctCharacters,
    totalCharacters,
    consistency,
    wpmHistory,
  } = data;

  const calculatedMistakes =
    mistakes !== undefined
      ? mistakes
      : errors || 0;

  // Create typing result
  const result = new this.TypingResult({
    user: userId || null,
    mode: mode || 'words',
    duration: duration || 30,
    wpm: Math.round(wpm),
    rawWpm: Math.round(rawWpm),
    accuracy: Math.round(accuracy * 10) / 10,
    mistakes: calculatedMistakes,
    correctCharacters: correctCharacters || 0,
    totalCharacters: totalCharacters || 0,
    consistency: consistency || 95,
    wpmHistory: wpmHistory || [],
  });

  const savedResult = await result.save();

  let newlyUnlocked = [];
  let currentStreak = 0;

  // Update authenticated user's statistics
  if (userId) {
    const user = await this.User.findById(userId);

    if (user) {
      // Best WPM
      user.bestWpm = Math.max(
        user.bestWpm || 0,
        savedResult.wpm
      );

      // Average WPM
      const previousTests = user.testsCompleted || 0;
      const newTests = previousTests + 1;
      const previousAverage = user.averageWpm || 0;

      user.averageWpm = Math.round(
        (
          previousAverage * previousTests +
          savedResult.wpm
        ) / newTests
      );

      // Tests completed
      user.testsCompleted = newTests;

      // Total typing time
      user.totalTypingTime =
        (user.totalTypingTime || 0) +
        (savedResult.duration || 30);

      // Total correct characters
      user.totalCorrectCharacters =
        (user.totalCorrectCharacters || 0) +
        (savedResult.correctCharacters || 0);

      // Total characters
      user.totalCharacters =
        (user.totalCharacters || 0) +
        (savedResult.totalCharacters || 0);

      // Overall accuracy
      if (user.totalCharacters > 0) {
        user.accuracy =
          Math.round(
            (
              user.totalCorrectCharacters /
              user.totalCharacters
            ) * 1000
          ) / 10;
      }

      await user.save();

      // Update India-based typing streak
      currentStreak = await this.streakService.updateStreak(userId);

      // Check achievements AFTER updating streak
      newlyUnlocked = await this.achievementService.checkAndUnlock(userId);
    }
  }

  // Convert mongoose document to object
  const resultObject = savedResult.toObject();

  // Backward compatibility
  resultObject.errors = resultObject.mistakes;

  return {
    ...resultObject,
    currentStreak,
    newlyUnlocked,
  };
}


  // get recent results
  async getRecentResults(userId) {
    const filter = userId
      ? { user: userId }
      : {};

    const results = await this.TypingResult.find(filter)
      .sort({ createdAt: -1 })
      .limit(20);

    return results.map((result) => {
      const resultObject = result.toObject();

      resultObject.errors = resultObject.mistakes;

      return resultObject;
    });
  }


  // get typing trends
  async getTypingTrends(userId, days = 7) {
  const startDate = new Date();

  startDate.setDate(startDate.getDate() - Number(days));
  startDate.setHours(0, 0, 0, 0);

  const results = await this.TypingResult.find({
    user: userId,
    createdAt: { $gte: startDate },
  })
    .sort({ createdAt: 1 })
    .select('wpm accuracy createdAt');

  return results.map((result) => ({
    date: result.createdAt,
    wpm: result.wpm,
    accuracy: result.accuracy,
  }));
}
}

export default TypingService;