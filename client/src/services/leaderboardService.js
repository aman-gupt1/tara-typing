import { api } from './api';

export const leaderboardService = {
  /**
   * Get leaderboard list for selected period ('today', 'week'/'thisWeek', 'month'/'thisMonth', 'allTime') and duration
   * GET /api/leaderboard?period=...&duration=...
   */
  getLeaderboard: async (period = 'allTime', duration = 30) => {
    const keyMap = {
      today: 'today',
      week: 'thisWeek',
      thisWeek: 'thisWeek',
      month: 'thisMonth',
      thisMonth: 'thisMonth',
      allTime: 'allTime',
    };

    const targetPeriod = keyMap[period] || 'allTime';

    try {
      const res = await api.get(`/leaderboard?period=${targetPeriod}&duration=${duration}`);
      return {
        leaderboard: res?.leaderboard || [],
        period: targetPeriod,
        duration,
      };
    } catch (err) {
      console.warn('Leaderboard fetch warning:', err.message);
      return {
        leaderboard: [],
        period: targetPeriod,
        duration,
      };
    }
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
