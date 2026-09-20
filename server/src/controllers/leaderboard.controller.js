import LeaderboardService from '../services/leaderboard.service.js';
import TypingResult from '../models/TypingResult.js';

const leaderboardService = new LeaderboardService(
  TypingResult
);

// Get leaderboard rankings

export const getLeaderboard = async (
  req,
  res,
  next
) => {
  try {
    const {
      period = 'allTime',
      duration = 30,
    } = req.query;

    const results =
      await leaderboardService.getLeaderboard(
        period,
        duration
      );

    const leaderboard = results.map(
      (item, index) => ({
        rank: index + 1,

        name:
          item.user?.name ||
          'Anonymous Typist',

        username:
          item.user?.username ||
          'anonymous',

        avatar:
          item.user?.avatar ||
          'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',

        wpm: item.wpm,

        accuracy: item.accuracy,

        tests:
          item.user?.testsCompleted || 1,

        date: item.createdAt,

        isCurrentUser:
          req.user && item.user
            ? item.user._id.toString() ===
              req.user._id.toString()
            : false,
      })
    );

    return res.status(200).json({
      success: true,
      leaderboard,
    });
  } catch (error) {
    next(error);
  }
};