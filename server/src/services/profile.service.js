class ProfileService {
  constructor(User) {
    this.User = User;
  }

  // Get user profile
  async getProfile(userId) {
    const user = await this.User.findById(userId);

    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    return user;
  }

  // Update user profile
  async updateProfile(userId, data) {
    const user = await this.User.findById(userId);

    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    const {
      name,
      username,
      avatar,
      bio,
      location,
    } = data;

    // Check username availability
    if (
      username &&
      username.toLowerCase() !== user.username
    ) {
      const normalizedUsername = username.toLowerCase();

      const usernameExists = await this.User.findOne({
        username: normalizedUsername,
        _id: { $ne: userId },
      });

      if (usernameExists) {
        const error = new Error(
          'Username is already taken'
        );
        error.statusCode = 400;
        throw error;
      }

      user.username = normalizedUsername;
    }

    if (name) {
      user.name = name;
    }

    if (avatar) {
      user.avatar = avatar;
    }

    if (bio !== undefined) {
      user.bio = bio.slice(0, 160);
    }

    if (location !== undefined) {
      user.location = location;
    }

    return await user.save();
  }

  // Get user statistics
  async getProfileStats(userId) {
    const user = await this.User.findById(userId);

    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    return {
      bestWpm: user.bestWpm,
      averageWpm: user.averageWpm,
      accuracy: user.accuracy,
      testsCompleted: user.testsCompleted,
      totalTypingTime: user.totalTypingTime,
      currentStreak: user.currentStreak,
      achievements: user.achievements,
    };
  }
}

export default ProfileService;