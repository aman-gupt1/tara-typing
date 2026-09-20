import LessonService from '../services/lesson.service.js';
import Lesson from '../models/Lesson.js';
import UserLessonProgress from '../models/UserLessonProgress.js';

const lessonService = new LessonService(
  Lesson,
  UserLessonProgress
);

// ----------------------------------------------------
// GET /api/lessons
// Get all active lessons with user's progress
// ----------------------------------------------------
export const getLessons = async (req, res, next) => {
  try {
    const userId = req.user?._id || null;

    const lessons = await lessonService.getLessons(userId);

    return res.status(200).json({
      success: true,
      lessons,
    });
  } catch (error) {
    next(error);
  }
};

// ----------------------------------------------------
// GET /api/lessons/:slug
// Get single lesson with user's progress
// ----------------------------------------------------
export const getLessonBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const userId = req.user?._id || null;

    const lesson = await lessonService.getLessonBySlug(
      slug,
      userId
    );

    return res.status(200).json({
      success: true,
      lesson,
    });
  } catch (error) {
    next(error);
  }
};

// ----------------------------------------------------
// POST /api/lessons/:slug/complete
// Complete lesson and optionally save quiz score
// ----------------------------------------------------
export const completeLesson = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const userId = req.user._id;

    const result = await lessonService.completeLesson(
      userId,
      slug,
      req.body
    );

    return res.status(200).json({
      success: true,
      message: 'Lesson completed successfully',
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

// ----------------------------------------------------
// PATCH /api/lessons/:slug/bookmark
// Toggle lesson bookmark
// ----------------------------------------------------
export const toggleBookmark = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const userId = req.user._id;

    const result = await lessonService.toggleBookmark(
      userId,
      slug
    );

    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

// ----------------------------------------------------
// PATCH /api/lessons/:slug/last-visited
// Update last visited lesson
// ----------------------------------------------------
export const updateLastVisited = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const userId = req.user._id;

    const progress = await lessonService.updateLastVisited(
      userId,
      slug
    );

    return res.status(200).json({
      success: true,
      lastVisitedLesson: progress.lastVisitedLesson,
    });
  } catch (error) {
    next(error);
  }
};

// ----------------------------------------------------
// GET /api/lessons/progress
// Get current user's complete learning progress
// ----------------------------------------------------
export const getProgress = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const progress = await lessonService.getProgress(
      userId
    );

    return res.status(200).json({
      success: true,
      progress,
    });
  } catch (error) {
    next(error);
  }
};

// ----------------------------------------------------
// DELETE /api/lessons/progress
// Reset current user's learning progress
// ----------------------------------------------------
export const resetProgress = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const progress = await lessonService.resetProgress(
      userId
    );

    return res.status(200).json({
      success: true,
      message: 'Learning progress reset successfully',
      progress,
    });
  } catch (error) {
    next(error);
  }
};