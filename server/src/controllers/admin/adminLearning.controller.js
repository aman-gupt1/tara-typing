import adminLearningService from '../../services/admin/adminLearning.service.js';
import {
  idOrSlugSchema,
  getLearningQuerySchema,
  createCourseSchema,
  updateCourseSchema,
  toggleStatusSchema,
  createLessonSchema,
  updateLessonSchema,
  exportLearningQuerySchema,
} from '../../validators/admin/adminLearning.validator.js';

/**
 * GET /api/admin/learning/stats
 * Get overview KPIs, real completion statistics, and category breakdown
 */
export const getLearningStats = async (req, res, next) => {
  try {
    const stats = await adminLearningService.getLearningStats();
    return res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/admin/learning/courses
 * Get paginated list of courses with filtering, searching, and sorting
 */
export const getCourses = async (req, res, next) => {
  try {
    const validatedQuery = getLearningQuerySchema.parse(req.query);
    const result = await adminLearningService.getCourses(validatedQuery);
    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid query parameters',
        errors: error.errors,
      });
    }
    next(error);
  }
};

/**
 * POST /api/admin/learning/courses
 * Create a new course module
 */
export const createCourse = async (req, res, next) => {
  try {
    const validatedData = createCourseSchema.parse(req.body);
    const result = await adminLearningService.createCourse(validatedData);
    return res.status(201).json({
      success: true,
      message: `Course "${result.title}" created successfully`,
      data: result,
    });
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({
        success: false,
        message: error.errors[0]?.message || 'Validation error',
        errors: error.errors,
      });
    }
    next(error);
  }
};

/**
 * GET /api/admin/learning/courses/:id
 * Get single course by ID or Slug
 */
export const getCourseById = async (req, res, next) => {
  try {
    const id = idOrSlugSchema.parse(req.params.id);
    const result = await adminLearningService.getCourseById(id);
    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    if (error.statusCode === 404) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
    if (error.name === 'ZodError') {
      return res.status(400).json({
        success: false,
        message: error.errors[0]?.message || 'Validation error',
      });
    }
    next(error);
  }
};

/**
 * PUT /api/admin/learning/courses/:id
 * Update course module
 */
export const updateCourse = async (req, res, next) => {
  try {
    const id = idOrSlugSchema.parse(req.params.id);
    const validatedData = updateCourseSchema.parse(req.body);
    const result = await adminLearningService.updateCourse(id, validatedData);
    return res.status(200).json({
      success: true,
      message: `Course "${result.title}" updated successfully`,
      data: result,
    });
  } catch (error) {
    if (error.statusCode === 404) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
    if (error.name === 'ZodError') {
      return res.status(400).json({
        success: false,
        message: error.errors[0]?.message || 'Validation error',
        errors: error.errors,
      });
    }
    next(error);
  }
};

/**
 * PATCH /api/admin/learning/courses/:id/status
 * Toggle course publish status
 */
export const updateCourseStatus = async (req, res, next) => {
  try {
    const id = idOrSlugSchema.parse(req.params.id);
    const validatedBody = toggleStatusSchema.parse(req.body);
    const result = await adminLearningService.updateCourseStatus(id, validatedBody);
    return res.status(200).json({
      success: true,
      message: `Course status updated to ${result.status}`,
      data: result,
    });
  } catch (error) {
    if (error.statusCode === 404) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
    if (error.name === 'ZodError') {
      return res.status(400).json({
        success: false,
        message: error.errors[0]?.message || 'Validation error',
      });
    }
    next(error);
  }
};

/**
 * DELETE /api/admin/learning/courses/:id
 * Delete course module
 */
export const deleteCourse = async (req, res, next) => {
  try {
    const id = idOrSlugSchema.parse(req.params.id);
    const result = await adminLearningService.deleteCourse(id);
    return res.status(200).json({
      success: true,
      message: result.message,
      data: result,
    });
  } catch (error) {
    if (error.statusCode === 404) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
    if (error.name === 'ZodError') {
      return res.status(400).json({
        success: false,
        message: error.errors[0]?.message || 'Validation error',
      });
    }
    next(error);
  }
};

/**
 * GET /api/admin/learning/lessons
 * Get paginated list of lessons with filtering, searching, and sorting
 */
export const getLessons = async (req, res, next) => {
  try {
    const validatedQuery = getLearningQuerySchema.parse(req.query);
    const result = await adminLearningService.getLessons(validatedQuery);
    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid query parameters',
        errors: error.errors,
      });
    }
    next(error);
  }
};

/**
 * POST /api/admin/learning/lessons
 * Create a new lesson
 */
export const createLesson = async (req, res, next) => {
  try {
    const validatedData = createLessonSchema.parse(req.body);
    const result = await adminLearningService.createLesson(validatedData);
    return res.status(201).json({
      success: true,
      message: `Lesson "${result.title}" created successfully`,
      data: result,
    });
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({
        success: false,
        message: error.errors[0]?.message || 'Validation error',
        errors: error.errors,
      });
    }
    next(error);
  }
};

/**
 * GET /api/admin/learning/lessons/:id
 * Get single lesson by ID or Slug
 */
export const getLessonById = async (req, res, next) => {
  try {
    const id = idOrSlugSchema.parse(req.params.id);
    const result = await adminLearningService.getLessonById(id);
    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    if (error.statusCode === 404) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
    if (error.name === 'ZodError') {
      return res.status(400).json({
        success: false,
        message: error.errors[0]?.message || 'Validation error',
      });
    }
    next(error);
  }
};

/**
 * PUT /api/admin/learning/lessons/:id
 * Update lesson details
 */
export const updateLesson = async (req, res, next) => {
  try {
    const id = idOrSlugSchema.parse(req.params.id);
    const validatedData = updateLessonSchema.parse(req.body);
    const result = await adminLearningService.updateLesson(id, validatedData);
    return res.status(200).json({
      success: true,
      message: `Lesson "${result.title}" updated successfully`,
      data: result,
    });
  } catch (error) {
    if (error.statusCode === 404) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
    if (error.name === 'ZodError') {
      return res.status(400).json({
        success: false,
        message: error.errors[0]?.message || 'Validation error',
        errors: error.errors,
      });
    }
    next(error);
  }
};

/**
 * PATCH /api/admin/learning/lessons/:id/status
 * Toggle lesson publish status
 */
export const updateLessonStatus = async (req, res, next) => {
  try {
    const id = idOrSlugSchema.parse(req.params.id);
    const validatedBody = toggleStatusSchema.parse(req.body);
    const result = await adminLearningService.updateLessonStatus(id, validatedBody);
    return res.status(200).json({
      success: true,
      message: `Lesson status updated to ${result.status}`,
      data: result,
    });
  } catch (error) {
    if (error.statusCode === 404) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
    if (error.name === 'ZodError') {
      return res.status(400).json({
        success: false,
        message: error.errors[0]?.message || 'Validation error',
      });
    }
    next(error);
  }
};

/**
 * DELETE /api/admin/learning/lessons/:id
 * Delete lesson
 */
export const deleteLesson = async (req, res, next) => {
  try {
    const id = idOrSlugSchema.parse(req.params.id);
    const result = await adminLearningService.deleteLesson(id);
    return res.status(200).json({
      success: true,
      message: result.message,
      data: result,
    });
  } catch (error) {
    if (error.statusCode === 404) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
    if (error.name === 'ZodError') {
      return res.status(400).json({
        success: false,
        message: error.errors[0]?.message || 'Validation error',
      });
    }
    next(error);
  }
};

/**
 * GET /api/admin/learning/export
 * Export courses and lessons data
 */
export const exportLearning = async (req, res, next) => {
  try {
    const validatedQuery = exportLearningQuerySchema.parse(req.query);
    const result = await adminLearningService.exportLearningData(validatedQuery);

    if (validatedQuery.format === 'csv') {
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="tara_typing_${validatedQuery.type}_export_${Date.now()}.csv"`
      );
      return res.status(200).send(result);
    }

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid export query parameters',
        errors: error.errors,
      });
    }
    next(error);
  }
};
