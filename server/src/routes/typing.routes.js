import express from 'express';

import {
  saveTypingResult,
  getRecentResults,
  getTypingTrends
} from '../controllers/typing.controller.js';

import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/save', protect, saveTypingResult);

router.get('/recent', protect, getRecentResults);
router.get('/trends', protect, getTypingTrends);

export default router;