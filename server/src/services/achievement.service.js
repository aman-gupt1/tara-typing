import { ACHIEVEMENTS } from '../constants/achievement.js';

class AchievementService {
  constructor(User) {
    this.User = User;
  }

  async checkAndUnlock(userId) {
    const user = await this.User.findById(userId);

    if (!user) {
      return [];
    }

    const unlockedAchievements = user.achievements || [];
    const newlyUnlocked = [];

    for (const achievement of ACHIEVEMENTS) {
      const alreadyUnlocked = unlockedAchievements.some(
        (item) => item.key === achievement.key
      );

      if (alreadyUnlocked) {
        continue;
      }

      const { type, value } = achievement.requirement;

      let currentValue = 0;

      switch (type) {
        case 'testsCompleted':
          currentValue = user.testsCompleted || 0;
          break;

        case 'bestWpm':
          currentValue = user.bestWpm || 0;
          break;

        case 'accuracy':
          currentValue = user.accuracy || 0;
          break;

        case 'currentStreak':
          currentValue = user.currentStreak || 0;
          break;

        default:
          continue;
      }

      if (currentValue >= value) {
        const unlockedAchievement = {
          key: achievement.key,
          unlockedAt: new Date(),
        };

        user.achievements.push(unlockedAchievement);
        newlyUnlocked.push(achievement.key);
      }
    }

    if (newlyUnlocked.length > 0) {
      await user.save();
    }

    return newlyUnlocked;
  }

  async getUserAchievements(userId) {
    const user = await this.User.findById(userId);

    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    const unlocked = user.achievements || [];

    return ACHIEVEMENTS.map((achievement) => {
      const userAchievement = unlocked.find(
        (item) => item.key === achievement.key
      );

      return {
        key: achievement.key,
        title: achievement.title,
        description: achievement.description,
        icon: achievement.icon,
        category: achievement.category,
        requirement: achievement.requirement,
        unlocked: Boolean(userAchievement),
        unlockedAt: userAchievement?.unlockedAt || null,
      };
    });
  }
}

export default AchievementService; 