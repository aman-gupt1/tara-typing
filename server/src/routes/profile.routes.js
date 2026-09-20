import express from 'express';

import {
  getProfile,
  updateProfile,
  getProfileRank,
  getProfileStats,
} from '../controllers/profile.controller.js';

import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get(
  '/',
  protect,
  getProfile
);

router.put(
  '/update',
  protect,
  updateProfile
);

router.get(
  '/stats',
  protect,
  getProfileStats
);

router.get('/rank', protect, getProfileRank);

export default router;