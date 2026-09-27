import express from 'express';
import {
  getDashboardStats,
  getRecentActivity,
  createOrUpdateDailyChallenge,
  exportPlatformTelemetry,
} from '../controllers/admin.controller.js';
import { protectAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

// All admin dashboard endpoints are guarded by protectAdmin
router.use(protectAdmin);

// Main Dashboard endpoints
router.get('/dashboard/stats', getDashboardStats);
router.get('/dashboard/recent-activity', getRecentActivity);
router.post('/dashboard/challenge', createOrUpdateDailyChallenge);
router.get('/dashboard/export', exportPlatformTelemetry);

export default router;
