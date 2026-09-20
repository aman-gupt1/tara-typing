import express from 'express';

import {
  getTodayChallenge,
  submitChallengeScore,
} from '../controllers/challenge.controller.js';

import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// Get today's challenge
router.get(
  '/today',
  getTodayChallenge
);

// Submit challenge score
router.post(
  '/submit',
  protect,
  submitChallengeScore
);

export default router;