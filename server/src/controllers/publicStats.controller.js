import PublicStatsService from '../services/publicStats.service.js';
import User from '../models/User.js';
import TypingResult from '../models/TypingResult.js';
import Lesson from '../models/Lesson.js';

const publicStatsService = new PublicStatsService(
  User,
  TypingResult,
  Lesson
);

export const getPublicStats = async (req, res, next) => {
  try {
    const stats = await publicStatsService.getStats();

    return res.status(200).json({
      success: true,
      stats,
    });
  } catch (error) {
    next(error);
  }
};