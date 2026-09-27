import { ACHIEVEMENTS } from '../constants/achievement.js';
import Achievement from '../models/Achievement.js';

class AchievementService {
  constructor(User) {
    this.User = User;
  }

  /**
   * Helper to retrieve active achievements from DB, falling back to static constants
   */
  async getActiveAchievementList() {
    try {
      const dbBadges = await Achievement.find({ status: 'Active' }).lean();
      if (dbBadges && dbBadges.length > 0) {
        return dbBadges.map((b) => ({
          key: b.key,
          title: b.title || b.name,
          name: b.name || b.title,
          description: b.description,
          icon: b.icon,
          color: b.color,
          tier: b.tier,
          points: b.points,
          category: b.category,
          requirement: b.requirement,
          requirementConfig: b.requirementConfig || {
            type: 'custom',
            value: 0,
          },
        }));
      }
    } catch (err) {
      console.warn('AchievementService - Error fetching from DB, fallback to constants:', err.message);
    }
    return ACHIEVEMENTS;
  }

  async checkAndUnlock(userId) {
    const user = await this.User.findById(userId);

    if (!user) {
      return [];
    }

    const unlockedAchievements = user.achievements || [];
    const newlyUnlocked = [];
    const badgeList = await this.getActiveAchievementList();

    for (const achievement of badgeList) {
      const alreadyUnlocked = unlockedAchievements.some(
        (item) => item.key === achievement.key
      );

      if (alreadyUnlocked) {
        continue;
      }

      // Check requirementConfig or requirement
      const req = achievement.requirementConfig || achievement.requirement || {};
      const type = req.type;
      const value = req.value;

      if (!type || value === undefined) {
        continue;
      }

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
    const badgeList = await this.getActiveAchievementList();

    return badgeList.map((achievement) => {
      const userAchievement = unlocked.find(
        (item) => item.key === achievement.key
      );

      return {
        key: achievement.key,
        title: achievement.title || achievement.name,
        name: achievement.name || achievement.title,
        description: achievement.description,
        icon: achievement.icon,
        color: achievement.color || 'purple',
        tier: achievement.tier || 'Common',
        points: achievement.points || 50,
        category: achievement.category,
        requirement: achievement.requirement,
        unlocked: Boolean(userAchievement),
        unlockedAt: userAchievement?.unlockedAt || null,
      };
    });
  }
}

export default AchievementService;