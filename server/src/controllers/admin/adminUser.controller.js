import adminUserService from '../../services/admin/adminUser.service.js';
import {
  getUsersQuerySchema,
  updateRoleSchema,
  updateStatusSchema,
  exportUsersQuerySchema,
  objectIdSchema,
} from '../../validators/admin/adminUser.validator.js';

/**
 * GET /api/admin/users
 * Controller to fetch paginated users directory with search, filter, and KPI stats
 */
export const getUsersList = async (req, res, next) => {
  try {
    const validatedQuery = getUsersQuerySchema.parse(req.query);
    const result = await adminUserService.getUsers(validatedQuery);

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
 * GET /api/admin/users/:id
 * Controller to retrieve user dossier with recent tests, curriculum, and telemetry
 */
export const getUserById = async (req, res, next) => {
  try {
    objectIdSchema.parse(req.params.id);
    const user = await adminUserService.getUserById(req.params.id);

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID format',
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
 * PATCH /api/admin/users/:id/role
 * Controller to update a user's role (user/admin) with self-demotion protection
 */
export const updateUserRole = async (req, res, next) => {
  try {
    objectIdSchema.parse(req.params.id);
    const { role } = updateRoleSchema.parse(req.body);
    const currentAdminId = req.user?._id;

    const updatedUser = await adminUserService.updateUserRole(
      req.params.id,
      role,
      currentAdminId
    );

    return res.status(200).json({
      success: true,
      message: `Role updated to ${role} successfully`,
      data: updatedUser,
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
 * PATCH /api/admin/users/:id/status
 * Controller to update a user's status (active/suspended/inactive)
 */
export const updateUserStatus = async (req, res, next) => {
  try {
    objectIdSchema.parse(req.params.id);
    const { status } = updateStatusSchema.parse(req.body);
    const currentAdminId = req.user?._id;

    const updatedUser = await adminUserService.updateUserStatus(
      req.params.id,
      status,
      currentAdminId
    );

    return res.status(200).json({
      success: true,
      message: `Status updated to ${status} successfully`,
      data: updatedUser,
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
 * DELETE /api/admin/users/:id
 * Controller to cascade delete user and associated records
 */
export const deleteUser = async (req, res, next) => {
  try {
    objectIdSchema.parse(req.params.id);
    const currentAdminId = req.user?._id;

    const result = await adminUserService.deleteUser(req.params.id, currentAdminId);

    return res.status(200).json(result);
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID format',
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
 * GET /api/admin/users/export
 * Controller to export all users as CSV file or JSON response
 */
export const exportUsers = async (req, res, next) => {
  try {
    const { format } = exportUsersQuerySchema.parse(req.query);
    const result = await adminUserService.exportUsers(format);

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
        message: 'Invalid export format requested',
        errors: error.errors,
      });
    }
    next(error);
  }
};
