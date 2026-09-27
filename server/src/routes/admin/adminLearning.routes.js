import express from 'express';
import {
  getLearningStats,
  getCourses,
  createCourse,
  getCourseById,
  updateCourse,
  updateCourseStatus,
  deleteCourse,
  getLessons,
  createLesson,
  getLessonById,
  updateLesson,
  updateLessonStatus,
  deleteLesson,
  exportLearning,
} from '../../controllers/admin/adminLearning.controller.js';
import { protect, adminOnly } from '../../middleware/auth.middleware.js';

const router = express.Router();

// Strict security: all admin learning routes require valid JWT & admin role
router.use(protect, adminOnly);

// Top KPIs & Analytics
router.get('/stats', getLearningStats);

// Export (Must be registered before :id routes)
router.get('/export', exportLearning);

// Courses / Modules CRUD
router.get('/courses', getCourses);
router.post('/courses', createCourse);
router.get('/courses/:id', getCourseById);
router.put('/courses/:id', updateCourse);
router.patch('/courses/:id/status', updateCourseStatus);
router.delete('/courses/:id', deleteCourse);

// Lessons CRUD
router.get('/lessons', getLessons);
router.post('/lessons', createLesson);
router.get('/lessons/:id', getLessonById);
router.put('/lessons/:id', updateLesson);
router.patch('/lessons/:id/status', updateLessonStatus);
router.delete('/lessons/:id', deleteLesson);

export default router;
