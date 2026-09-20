class StreakService {
  constructor(User) {
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

  async updateStreak(userId) {
    const user = await this.User.findById(userId);

    if (!user) {
      return null;
    }

    const today = this.getIndiaDate();

    // First typing activity
    if (!user.lastTypingDate) {
      user.currentStreak = 1;
      user.lastTypingDate = new Date();

      await user.save();

      return user.currentStreak;
    }

    const lastTypingDay = this.getIndiaDate(user.lastTypingDate);

    // Same day → don't increase streak
    if (lastTypingDay === today) {
      return user.currentStreak;
    }

    // Get yesterday's date in India
    const todayDate = new Date(`${today}T00:00:00+05:30`);
    const yesterdayDate = new Date(todayDate);
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);

    const yesterday = this.getIndiaDate(yesterdayDate);

    if (lastTypingDay === yesterday) {
      user.currentStreak = (user.currentStreak || 0) + 1;
    } else {
      user.currentStreak = 1;
    }

    user.lastTypingDate = new Date();

    await user.save();

    return user.currentStreak;
  }
}

export default StreakService;