import AchievementService from '../services/achievement.service.js';
import User from '../models/User.js';

const achievementService = new AchievementService(User);

export const getUserAchievements = async (req, res, next) => {
  try {
    const achievements =
      await achievementService.getUserAchievements(req.user._id);

    return res.status(200).json({
      success: true,
      achievements,
    });
  } catch (error) {
    next(error);
  }
};