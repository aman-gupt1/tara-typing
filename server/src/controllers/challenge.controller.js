import DailyChallengeService from '../services/challenge.service.js';
import DailyChallenge from '../models/DailyChallenge.js';

const dailyChallengeService = new DailyChallengeService(
  DailyChallenge
);

// Get today's daily challenge

export const getTodayChallenge = async (
  req,
  res,
  next
) => {
  try {
    const challenge =
      await dailyChallengeService.getTodayChallenge();

    return res.status(200).json({
      success: true,
      challenge,
    });
  } catch (error) {
    next(error);
  }
};

// Submit score for daily challenge

// export const submitChallengeScore = async (
//   req,
//   res,
//   next
// ) => {
//   try {
//     const {
//       challengeId,
//       wpm,
//       accuracy,
//     } = req.body;

//     const challenge =
//       await dailyChallengeService.submitChallengeScore(
//         challengeId,
//         wpm,
//         accuracy,
//         req.user || null
//       );

//     return res.status(200).json({
//       success: true,
//       challenge,
//     });
//   } catch (error) {
//     next(error);
//   }
// };


export const submitChallengeScore = async (
  req,
  res,
  next
) => {
  try {
    const {
      challengeId,
      wpm,
      accuracy,
    } = req.body;

    const challenge =
      await dailyChallengeService.submitChallengeScore(
        challengeId,
        wpm,
        accuracy,
        req.user
      );

    return res.status(201).json({
      success: true,
      message:
        'Daily challenge submitted successfully',
      challenge,
    });
  } catch (error) {
    next(error);
  }
};