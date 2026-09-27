import adminLeaderboardService from '../../services/admin/adminLeaderboard.service.js';
import {
  getLeaderboardQuerySchema,
  toggleFlagSchema,
  exportLeaderboardQuerySchema,
  objectIdSchema,
} from '../../validators/admin/adminLeaderboard.validator.js';

/**
 * GET /api/admin/leaderboard
 * Controller to fetch optimized leaderboard rankings with top KPIs and timeframe tabs
 */
export const getLeaderboard = async (req, res, next) => {
  try {
    const validatedQuery = getLeaderboardQuerySchema.parse(req.query);
    const result = await adminLeaderboardService.getLeaderboard(validatedQuery);

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
 * PATCH /api/admin/leaderboard/entry/:testId/flag
 * Controller to toggle score legitimacy (Verified <-> Flagged)
 */
export const toggleFlag = async (req, res, next) => {
  try {
    objectIdSchema.parse(req.params.testId);
    const validatedBody = toggleFlagSchema.parse(req.body);

    const result = await adminLeaderboardService.toggleFlag(
      req.params.testId,
      validatedBody
    );

    return res.status(200).json({
      success: true,
      message: `Leaderboard entry marked as ${result.status}`,
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
    if (error.statusCode) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }
    next(error);
  }
};

/**
 * DELETE /api/admin/leaderboard/entry/:testId
 * Controller to disqualify anomalous entry from leaderboard
 */
export const disqualifyEntry = async (req, res, next) => {
  try {
    objectIdSchema.parse(req.params.testId);
    const result = await adminLeaderboardService.disqualifyEntry(req.params.testId);

    return res.status(200).json(result);
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid test ID format',
        errors: error.errors,
      });
    }
    if (error.statusCode) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }
    next(error);
  }
};

/**
 * GET /api/admin/leaderboard/export
 * Controller to export leaderboard as CSV or JSON
 */
export const exportLeaderboard = async (req, res, next) => {
  try {
    const validatedQuery = exportLeaderboardQuerySchema.parse(req.query);
    const result = await adminLeaderboardService.exportLeaderboard(validatedQuery);

    if (result.format === 'csv') {
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="${result.filename}"`);
      return res.status(200).send(result.data);
    }

    return res.status(200).json({
      success: true,
      data: result.data,
    });
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid export parameters',
        errors: error.errors,
      });
    }
    next(error);
  }
};
