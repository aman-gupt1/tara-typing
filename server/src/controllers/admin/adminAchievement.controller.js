import adminAchievementService from '../../services/admin/adminAchievement.service.js';
import {
  idOrKeySchema,
  getAchievementQuerySchema,
  createAchievementSchema,
  updateAchievementSchema,
  updateAchievementStatusSchema,
  exportAchievementQuerySchema,
} from '../../validators/admin/adminAchievement.validator.js';

/**
 * GET /api/admin/achievements/stats
 * Real gamification KPIs, total unlocks, conversion rate, and rarity tiers
 */
export const getAchievementStats = async (req, res, next) => {
  try {
    const stats = await adminAchievementService.getAchievementStats();
    return res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/admin/achievements
 * Get filtered, searched, and sorted list of achievements with unlock counts
 */
export const getAchievements = async (req, res, next) => {
  try {
    const validatedQuery = getAchievementQuerySchema.parse(req.query);
    const result = await adminAchievementService.getAchievements(validatedQuery);
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
 * GET /api/admin/achievements/:id
 * Get single achievement details, trigger config, and recent typist unlocks
 */
export const getAchievementById = async (req, res, next) => {
  try {
    const idOrKey = idOrKeySchema.parse(req.params.id);
    const achievement = await adminAchievementService.getAchievementById(idOrKey);
    return res.status(200).json({
      success: true,
      data: achievement,
    });
  } catch (error) {
    if (error.statusCode === 404) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
    next(error);
  }
};

/**
 * POST /api/admin/achievements
 * Create a new achievement badge
 */
export const createAchievement = async (req, res, next) => {
  try {
    const validatedData = createAchievementSchema.parse(req.body);
    const created = await adminAchievementService.createAchievement(validatedData);
    return res.status(201).json({
      success: true,
      message: `Achievement "${created.name}" created successfully`,
      data: created,
    });
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({
        success: false,
        message: error.errors[0]?.message || 'Validation error',
        errors: error.errors,
      });
    }
    if (error.statusCode === 409) {
      return res.status(409).json({
        success: false,
        message: error.message,
      });
    }
    next(error);
  }
};

/**
 * PUT /api/admin/achievements/:id
 * Update an existing achievement badge
 */
export const updateAchievement = async (req, res, next) => {
  try {
    const idOrKey = idOrKeySchema.parse(req.params.id);
    const validatedData = updateAchievementSchema.parse(req.body);
    const updated = await adminAchievementService.updateAchievement(idOrKey, validatedData);
    return res.status(200).json({
      success: true,
      message: `Achievement "${updated.name}" updated successfully`,
      data: updated,
    });
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({
        success: false,
        message: error.errors[0]?.message || 'Validation error',
        errors: error.errors,
      });
    }
    if (error.statusCode === 404) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
    if (error.statusCode === 409) {
      return res.status(409).json({
        success: false,
        message: error.message,
      });
    }
    next(error);
  }
};

/**
 * PATCH /api/admin/achievements/:id/status
 * Toggle or set achievement status ('Active' | 'Disabled')
 */
export const updateAchievementStatus = async (req, res, next) => {
  try {
    const idOrKey = idOrKeySchema.parse(req.params.id);
    const { status, isActive } = updateAchievementStatusSchema.parse(req.body);

    let nextStatus = status;
    if (!nextStatus && isActive !== undefined) {
      nextStatus = isActive ? 'Active' : 'Disabled';
    }

    const updated = await adminAchievementService.updateAchievementStatus(idOrKey, nextStatus);
    return res.status(200).json({
      success: true,
      message: `Achievement "${updated.name}" status updated to ${updated.status}`,
      data: updated,
    });
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid status parameter',
        errors: error.errors,
      });
    }
    if (error.statusCode === 404) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
    next(error);
  }
};

/**
 * DELETE /api/admin/achievements/:id
 * Delete an achievement badge
 */
export const deleteAchievement = async (req, res, next) => {
  try {
    const idOrKey = idOrKeySchema.parse(req.params.id);
    const result = await adminAchievementService.deleteAchievement(idOrKey);
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
    next(error);
  }
};

/**
 * GET /api/admin/achievements/export
 * Export achievements roster as CSV file or JSON payload
 */
export const exportAchievements = async (req, res, next) => {
  try {
    const validatedQuery = exportAchievementQuerySchema.parse(req.query);
    const exportResult = await adminAchievementService.exportAchievements(validatedQuery);

    if (exportResult.format === 'csv') {
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${exportResult.filename}"`
      );
      return res.status(200).send(exportResult.data);
    }

    return res.status(200).json({
      success: true,
      ...exportResult,
    });
  } catch (error) {
    next(error);
  }
};
