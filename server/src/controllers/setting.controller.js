import settingsService from '../services/setting.service.js';

/**
 * GET /api/settings
 */
export const getSettings = async (req, res, next) => {
  try {
    const userId = req.user?._id || req.user?.id;

    const settings = await settingsService.getSettings(userId);

    return res.status(200).json({
      success: true,
      settings,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/settings
 */
export const updateSettings = async (req, res, next) => {
  try {
    const userId = req.user?._id || req.user?.id;

    const settings = await settingsService.updateSettings(
      userId,
      req.body
    );

    return res.status(200).json({
      success: true,
      message: 'Settings updated successfully',
      settings,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/settings/reset
 */
export const resetSettings = async (req, res, next) => {
  try {
    const userId = req.user?._id || req.user?.id;

    const settings = await settingsService.resetSettings(userId);

    return res.status(200).json({
      success: true,
      message: 'Settings reset successfully',
      settings,
    });
  } catch (error) {
    next(error);
  }
};