import express from 'express';
import {
  getUsersList,
  getUserById,
  updateUserRole,
  updateUserStatus,
  deleteUser,
  exportUsers,
} from '../../controllers/admin/adminUser.controller.js';
import { protect, adminOnly } from '../../middleware/auth.middleware.js';

const router = express.Router();

// Enforce strict JWT authentication and admin role verification
router.use(protect, adminOnly);

// API #6: GET /api/admin/users/export (MUST be placed before /:id)
router.get('/export', exportUsers);

// API #1: GET /api/admin/users (Directory with pagination, filters, sorting, KPIs)
router.get('/', getUsersList);

// API #2: GET /api/admin/users/:id (Dossier drawer with recent tests, curriculum, telemetry)
router.get('/:id', getUserById);

// API #3: PATCH /api/admin/users/:id/role (Toggle user/admin role)
router.patch('/:id/role', updateUserRole);

// API #4: PATCH /api/admin/users/:id/status (Toggle active/suspended/inactive status)
router.patch('/:id/status', updateUserStatus);

// API #5: DELETE /api/admin/users/:id (Cascade delete user and typing records)
router.delete('/:id', deleteUser);

export default router;
