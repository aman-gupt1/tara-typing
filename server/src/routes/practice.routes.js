import express from 'express';

import {
  savePracticeSession,
  getPracticeHistory,
} from '../controllers/practice.controller.js';

import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/save', protect, savePracticeSession);

router.get('/history', protect, getPracticeHistory);

export default router;