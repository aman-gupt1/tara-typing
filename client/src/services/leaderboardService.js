import { api } from './api';

export const leaderboardService = {
  /**
   * Get leaderboard rankings for selected period and duration.
   * GET /api/leaderboard?period={period}&duration={duration}
   *
   * Supported periods: 'allTime', 'today', 'thisWeek', 'thisMonth'
   * Supported durations: 'all', '15', '30', '60', '120'
   */
  getLeaderboard: async (period = 'allTime', duration = 'all') => {
    const periodMap = {
      today: 'today',
      week: 'thisWeek',
      thisWeek: 'thisWeek',
      month: 'thisMonth',
      thisMonth: 'thisMonth',
      allTime: 'allTime',
    };

    const targetPeriod = periodMap[period] || 'allTime';
    const targetDuration = duration ?? 'all';

    const res = await api.get(`/leaderboard?period=${targetPeriod}&duration=${targetDuration}`);
    return {
      success: res?.success ?? true,
      leaderboard: res?.leaderboard || [],
      period: targetPeriod,
      duration: targetDuration,
    };
  },

  /**
   * Get public platform statistics (testsCompleted, typists, lessons, bestWpm)
   * GET /api/public/stats
   */
  getPublicStats: async () => {
    try {
      const res = await api.get('/public/stats');
      return res?.stats || null;
    } catch (err) {
      console.warn('Public stats fetch warning:', err.message);
      return null;
    }
  },
};

export default leaderboardService;
