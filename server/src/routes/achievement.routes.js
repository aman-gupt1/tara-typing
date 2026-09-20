import express from 'express';

import {
  getUserAchievements,
} from '../controllers/achievement.controller.js';

import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', protect, getUserAchievements);

export default router;