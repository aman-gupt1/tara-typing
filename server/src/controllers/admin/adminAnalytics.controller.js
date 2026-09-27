import adminAnalyticsService from '../../services/admin/adminAnalytics.service.js';

/**
 * GET /api/admin/analytics/overview
 * Real-time platform intelligence, engagement KPIs, speed progression, mode share, and retention funnel
 */
export const getAnalyticsOverview = async (req, res, next) => {
  try {
    const { timeframe = '30d' } = req.query;
    const analytics = await adminAnalyticsService.getAnalyticsOverview(timeframe);
    return res.status(200).json({
      success: true,
      data: analytics,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/admin/analytics/export
 * Download comprehensive analytics intelligence report as CSV
 */
export const exportAnalytics = async (req, res, next) => {
  try {
    const { timeframe = '30d' } = req.query;
    const { filename, data } = await adminAnalyticsService.exportAnalyticsCSV(timeframe);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    return res.status(200).send(data);
  } catch (error) {
    next(error);
  }
};
