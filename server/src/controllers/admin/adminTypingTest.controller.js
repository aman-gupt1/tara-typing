import adminTypingTestService from '../../services/admin/adminTypingTest.service.js';
import {
  getTypingTestsQuerySchema,
  updateValiditySchema,
  exportTypingTestsQuerySchema,
  objectIdSchema,
} from '../../validators/admin/adminTypingTest.validator.js';

/**
 * GET /api/admin/typing-tests
 * Controller to fetch paginated typing tests directory with search, filter, and platform KPIs
 */
export const getTypingTestsList = async (req, res, next) => {
  try {
    const validatedQuery = getTypingTestsQuerySchema.parse(req.query);
    const result = await adminTypingTestService.getTypingTests(validatedQuery);

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
 * GET /api/admin/typing-tests/:id
 * Controller to fetch detailed typing test session with keystroke cadence & telemetry
 */
export const getTypingTestById = async (req, res, next) => {
  try {
    objectIdSchema.parse(req.params.id);
    const test = await adminTypingTestService.getTypingTestById(req.params.id);

    return res.status(200).json({
      success: true,
      data: test,
    });
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid typing test ID format',
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
 * PATCH /api/admin/typing-tests/:id/validity
 * Controller to toggle validity status of typing test (Valid <-> Suspicious)
 */
export const updateTestValidity = async (req, res, next) => {
  try {
    objectIdSchema.parse(req.params.id);
    const validatedBody = updateValiditySchema.parse(req.body);

    const updated = await adminTypingTestService.updateTestValidity(
      req.params.id,
      validatedBody
    );

    return res.status(200).json({
      success: true,
      message: `Test session marked as ${updated.status}`,
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
 * DELETE /api/admin/typing-tests/:id
 * Controller to permanently delete a test session log
 */
export const deleteTypingTest = async (req, res, next) => {
  try {
    objectIdSchema.parse(req.params.id);
    const result = await adminTypingTestService.deleteTypingTest(req.params.id);

    return res.status(200).json(result);
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid typing test ID format',
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
 * GET /api/admin/typing-tests/export
 * Controller to export typing test records as CSV file or JSON response
 */
export const exportTypingTests = async (req, res, next) => {
  try {
    const { format } = exportTypingTestsQuerySchema.parse(req.query);
    const result = await adminTypingTestService.exportTypingTests(format);

    if (result.format === 'csv') {
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${result.filename}"`
      );
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
        message: 'Invalid export format requested',
        errors: error.errors,
      });
    }
    next(error);
  }
};
