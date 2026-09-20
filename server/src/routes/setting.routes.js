import express from 'express';

import {
  getSettings,
  updateSettings,
  resetSettings,
} from '../controllers/setting.controller.js';

import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', protect, getSettings);

router.patch('/', protect, updateSettings);

router.post('/reset', protect, resetSettings);

export default router;