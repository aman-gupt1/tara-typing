// import TypingResult from '../models/TypingResult.js';
// import User from '../models/User.js';

// @desc    Save typing test result
// @route   POST /api/typing/save
// @access  Public (with optional user attachment)
// export const saveTypingResult = async (req, res) => {
//   try {
//     const {
//       mode,
//       duration,
//       wpm,
//       rawWpm,
//       accuracy,
//       errors,
//       mistakes,
//       correctCharacters,
//       totalCharacters,
//       consistency,
//       wpmHistory,
//     } = req.body;

//     const calculatedMistakes = mistakes !== undefined ? mistakes : (errors || 0);

//     const result = new TypingResult({
//       user: req.user ? req.user._id : null,
//       mode: mode || 'words',
//       duration: duration || 30,
//       wpm: Math.round(wpm),
//       rawWpm: Math.round(rawWpm),
//       accuracy: Math.round(accuracy * 10) / 10,
//       mistakes: calculatedMistakes,
//       correctCharacters: correctCharacters || 0,
//       totalCharacters: totalCharacters || 0,
//       consistency: consistency || 95,
//       wpmHistory: wpmHistory || [],
//     });

//     const savedResult = await result.save();

//     // If user is authenticated, update aggregated statistics
//     if (req.user) {
//       const user = await User.findById(req.user._id);
//       if (user) {
//         user.bestWpm = Math.max(user.bestWpm, savedResult.wpm);
//         const prevTests = user.testsCompleted || 0;
//         const newTests = prevTests + 1;
//         const prevAvg = user.averageWpm || 0;
//         user.averageWpm = Math.round((prevAvg * prevTests + savedResult.wpm) / newTests);
//         user.testsCompleted = newTests;
//         user.totalTypingTime = (user.totalTypingTime || 0) + (savedResult.duration || 30);
//         await user.save();
//       }
//     }

//     const resultObj = savedResult.toObject();
//     resultObj.errors = resultObj.mistakes;

//     res.status(201).json({
//       success: true,
//       result: resultObj,
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// @desc    Get recent results for current user
// @route   GET /api/typing/recent
// @access  Public (optional auth)
// export const getRecentResults = async (req, res) => {
//   try {
//     const filter = req.user ? { user: req.user._id } : {};
//     const results = await TypingResult.find(filter)
//       .sort({ createdAt: -1 })
//       .limit(20);
//     const formatted = results.map((r) => {
//       const obj = r.toObject();
//       obj.errors = obj.mistakes;
//       return obj;
//     });
//     res.json({ results: formatted });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };



import TypingService from '../services/typing.service.js';
import StreakService from '../services/streak.service.js';
import TypingResult from '../models/TypingResult.js';
import User from '../models/User.js';
import AchievementService from '../services/achievement.service.js';

const achievementService = new AchievementService(User);
const streakService = new StreakService(User);

const typingService = new TypingService(
  TypingResult,
  User,
  achievementService,
  streakService
);


// Save typing result

export const saveTypingResult = async (req, res, next) => {
  try {
    const result = await typingService.saveTypingResult(
      req.user._id,
      req.body
    );

    return res.status(201).json({
      success: true,
      result,
    });
  } catch (error) {
    next(error);
  }
};

// Get recent results
export const getRecentResults = async (req, res, next) => {
  try {
    const results = await typingService.getRecentResults(
      req.user._id
    );

    return res.status(200).json({
      success: true,
      results,
    });
  } catch (error) {
    next(error);
  }
};


// Get typing trends
// GET /api/typing/trends
// Private

export const getTypingTrends = async (req, res, next) => {
  try {
    const { days = 7 } = req.query;

    const trends = await typingService.getTypingTrends(
      req.user._id,
      days
    );

    return res.status(200).json({
      success: true,
      trends,
    });
  } catch (error) {
    next(error);
  }
};