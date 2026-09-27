import express from 'express';
import {
  getAnalyticsOverview,
  exportAnalytics,
} from '../../controllers/admin/adminAnalytics.controller.js';
import { protect, adminOnly } from '../../middleware/auth.middleware.js';

const router = express.Router();

// Strict security: all admin analytics routes require authenticated admin JWT
router.use(protect, adminOnly);

// Export CSV report
router.get('/export', exportAnalytics);

// Overview intelligence & chart telemetry
router.get('/overview', getAnalyticsOverview);
router.get('/', getAnalyticsOverview);

export default router;
