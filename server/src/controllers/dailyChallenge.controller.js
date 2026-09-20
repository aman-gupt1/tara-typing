import DailyChallengeService from '../services/dailyChallenge.service.js';
import DailyChallengeRotationService from '../services/dailyChallengeRotation.service.js';
import DailyChallenge from '../models/DailyChallenge.js';
import DailyChallengeResult from '../models/DailyChallengesResult.js';
import User from '../models/User.js';

const dailyChallengeService = new DailyChallengeService(
  DailyChallenge,
  DailyChallengeResult,
  User
);

// export const getTodayChallenge = async (req, res, next) => {
//   try {
//     const challenge = await dailyChallengeService.getTodayChallenge();

//     return res.status(200).json({
//       success: true,
//       challenge,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

export const getTodayChallenge = async (req, res, next) => {
  try {
    const challenge =
      await dailyChallengeRotationService.ensureTodayChallenge();

    return res.status(200).json({
      success: true,
      challenge,
    });
  } catch (error) {
    next(error);
  }
};

export const getChallengeByDate = async (req, res, next) => {
  try {
    const { date } = req.params;

    const challenge =
      await dailyChallengeService.getChallengeByDate(date);

    return res.status(200).json({
      success: true,
      challenge,
    });
  } catch (error) {
    next(error);
  }
};

export const submitDailyChallenge = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const result =
      await dailyChallengeService.submitResult(
        userId,
        req.body
      );

    return res.status(201).json({
      success: true,
      message: 'Daily challenge submitted successfully',
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

export const getDailyChallengeHistory = async (
  req,
  res,
  next
) => {
  try {
    const userId = req.user._id;
    const { limit } = req.query;

    const history =
      await dailyChallengeService.getUserHistory(
        userId,
        limit
      );

    return res.status(200).json({
      success: true,
      history,
    });
  } catch (error) {
    next(error);
  }
};

export const getTodayChallengeResult = async (
  req,
  res,
  next
) => {
  try {
    const userId = req.user._id;

    const result =
      await dailyChallengeService.getTodayResult(userId);

    return res.status(200).json({
      success: true,
      result,
    });
  } catch (error) {
    next(error);
  }
};