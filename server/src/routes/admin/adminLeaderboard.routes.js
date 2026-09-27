import express from 'express';
import {
  getLeaderboard,
  toggleFlag,
  disqualifyEntry,
  exportLeaderboard,
} from '../../controllers/admin/adminLeaderboard.controller.js';
import { protect, adminOnly } from '../../middleware/auth.middleware.js';

const router = express.Router();

// Enforce strict JWT authentication and admin role verification
router.use(protect, adminOnly);

// API #4: GET /api/admin/leaderboard/export (Must be before parameterized routes)
router.get('/export', exportLeaderboard);

// API #1: GET /api/admin/leaderboard (Optimized leaderboard rankings with timeframes & KPIs)
router.get('/', getLeaderboard);

// API #2: PATCH /api/admin/leaderboard/entry/:testId/flag (Toggle verified/flagged status)
router.patch('/entry/:testId/flag', toggleFlag);

// API #3: DELETE /api/admin/leaderboard/entry/:testId (Disqualify entry from leaderboard)
router.delete('/entry/:testId', disqualifyEntry);

export default router;
