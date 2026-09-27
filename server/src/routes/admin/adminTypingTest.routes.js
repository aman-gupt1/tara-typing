import express from 'express';
import {
  getTypingTestsList,
  getTypingTestById,
  updateTestValidity,
  deleteTypingTest,
  exportTypingTests,
} from '../../controllers/admin/adminTypingTest.controller.js';
import { protect, adminOnly } from '../../middleware/auth.middleware.js';

const router = express.Router();

// Enforce strict JWT authentication and admin role verification
router.use(protect, adminOnly);

// API #5: GET /api/admin/typing-tests/export (Placed before /:id)
router.get('/export', exportTypingTests);

// API #1: GET /api/admin/typing-tests (Directory with pagination, filters, sorting, KPIs)
router.get('/', getTypingTestsList);

// API #2: GET /api/admin/typing-tests/:id (Session dossier with cadence & anti-cheat telemetry)
router.get('/:id', getTypingTestById);

// API #3: PATCH /api/admin/typing-tests/:id/validity (Toggle valid/suspicious status)
router.patch('/:id/validity', updateTestValidity);

// API #4: DELETE /api/admin/typing-tests/:id (Delete test log)
router.delete('/:id', deleteTypingTest);

export default router;
