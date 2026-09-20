import ProfileService from '../services/profile.service.js';
import User from '../models/User.js';
import LeaderboardService from '../services/leaderboard.service.js';
import TypingResult from '../models/TypingResult.js'

const profileService = new ProfileService(User);

// Get user profile

export const getProfile = async (
  req,
  res,
  next
) => {
  try {
    const user = await profileService.getProfile(
      req.user._id
    );

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// Update user profile

export const updateProfile = async (
  req,
  res,
  next
) => {
  try {
    const user =
      await profileService.updateProfile(
        req.user._id,
        req.body
      );

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// Get user statistics

export const getProfileStats = async (
  req,
  res,
  next
) => {
  try {
    const stats =
      await profileService.getProfileStats(
        req.user._id
      );

    return res.status(200).json({
      success: true,
      stats,
    });
  } catch (error) {
    next(error);
  }
};


export const getProfileRank = async (req, res, next) => {
  try {
    const userId = req.user?._id || req.user?.id;

    if (!userId) {
      const error = new Error('Authentication required');
      error.statusCode = 401;
      throw error;
    }

    const leaderboardService =
      new LeaderboardService(TypingResult);

    const rank = await leaderboardService.getUserRank(
      userId,
      'allTime',
      'all'
    );

    return res.status(200).json({
      success: true,
      rank: rank.rank,
      totalUsers: rank.totalUsers,
      wpm: rank.wpm,
      accuracy: rank.accuracy,
      hasResult: rank.hasResult,
    });
  } catch (error) {
    next(error);
  }
};