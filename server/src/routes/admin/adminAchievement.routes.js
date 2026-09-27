import express from 'express';
import {
  getAchievementStats,
  getAchievements,
  getAchievementById,
  createAchievement,
  updateAchievement,
  updateAchievementStatus,
  deleteAchievement,
  exportAchievements,
} from '../../controllers/admin/adminAchievement.controller.js';
import { protect, adminOnly } from '../../middleware/auth.middleware.js';

const router = express.Router();

// Strict security: all admin gamification routes require authenticated admin JWT
router.use(protect, adminOnly);

// Top KPIs & Telemetry (Must be registered before :id routes)
router.get('/stats', getAchievementStats);

// Export achievements CSV/JSON (Must be registered before :id routes)
router.get('/export', exportAchievements);

// Roster Collection CRUD
router.get('/', getAchievements);
router.post('/', createAchievement);

// Single Item Operations
router.get('/:id', getAchievementById);
router.put('/:id', updateAchievement);
router.patch('/:id/status', updateAchievementStatus);
router.delete('/:id', deleteAchievement);

export default router;
