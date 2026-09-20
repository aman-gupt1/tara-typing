class PublicStatsService {
  constructor(User, TypingResult, Lesson) {
    this.User = User;
    this.TypingResult = TypingResult;
    this.Lesson = Lesson;
  }

  async getStats() {
    const [
      users,
      testsCompleted,
      lessons,
      bestWpmResult,
    ] = await Promise.all([
      // Total registered users
      this.User.countDocuments(),

      // Total completed typing tests
      this.TypingResult.countDocuments(),

      // Total currently active lessons
      this.Lesson.countDocuments({
        isActive: true,
      }),

      // Highest recorded WPM
      this.TypingResult.findOne({
        wpm: {
          $gt: 0,
        },
      })
        .sort({
          wpm: -1,
        })
        .select('wpm')
        .lean(),
    ]);

    return {
      testsCompleted,
      typists: users,
      lessons,
      bestWpm: bestWpmResult?.wpm || 0,
    };
  }
}

export default PublicStatsService;