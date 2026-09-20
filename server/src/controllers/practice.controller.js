import PracticeService from '../services/practice.service.js';
import PracticeSession from '../models/PracticeSession.js';

const practiceService = new PracticeService(
  PracticeSession
);

// Save practice session

export const savePracticeSession = async (
  req,
  res,
  next
) => {
  try {
    const session =
      await practiceService.savePracticeSession(
        req.user?._id || null,
        req.body
      );

    return res.status(201).json({
      success: true,
      session,
    });
  } catch (error) {
    next(error);
  }
};

// Get user practice history

export const getPracticeHistory = async (
  req,
  res,
  next
) => {
  try {
    const sessions =
      await practiceService.getPracticeHistory(
        req.user?._id || null
      );

    return res.status(200).json({
      success: true,
      sessions,
    });
  } catch (error) {
    next(error);
  }
};