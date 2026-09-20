import express from 'express';

import {
  getTodayChallenge,
  getChallengeByDate,
  submitDailyChallenge,
  getDailyChallengeHistory,
  getTodayChallengeResult,
} from '../controllers/dailyChallenge.controller.js';

import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

/*
 * Public
 * Today's challenge can be viewed without login.
 */
router.get('/today', getTodayChallenge);

/*
 * Public
 * Get a specific challenge by date.
 * Format: YYYY-MM-DD
 */
router.get('/date/:date', getChallengeByDate);

/*
 * Protected
 * Submit today's challenge result.
 */
router.post('/submit', protect, submitDailyChallenge);

/*
 * Protected
 * Get logged-in user's challenge history.
 */
router.get('/history', protect, getDailyChallengeHistory);

/*
 * Protected
 * Get logged-in user's result for today's challenge.
 */
router.get('/today/result', protect, getTodayChallengeResult);

export default router;