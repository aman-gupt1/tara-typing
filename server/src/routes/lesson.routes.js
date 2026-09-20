import express from 'express';

import {
  getLessons,
  getLessonBySlug,
  completeLesson,
  toggleBookmark,
  updateLastVisited,
  getProgress,
  resetProgress,
} from '../controllers/lesson.controller.js';

import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Learning Progress Routes
|--------------------------------------------------------------------------
| IMPORTANT:
| /progress routes must come before /:slug
| otherwise "progress" can be treated as a lesson slug.
*/

// Get logged-in user's learning progress
router.get('/progress', protect, getProgress);

// Reset logged-in user's learning progress
router.delete('/progress', protect, resetProgress);

/*
|--------------------------------------------------------------------------
| Lesson Routes
|--------------------------------------------------------------------------
*/

// Get all active lessons
router.get('/', getLessons);

// Get single lesson by slug
router.get('/:slug', getLessonBySlug);

// Mark lesson as completed + save quiz score
router.post('/:slug/complete', protect, completeLesson);

// Toggle lesson bookmark
router.patch('/:slug/bookmark', protect, toggleBookmark);

// Save last visited lesson
router.patch('/:slug/last-visited', protect, updateLastVisited);

export default router;