import { api } from './api';

export const statsService = {
  /**
   * Fetch public platform statistics for the home page
   * GET /api/public/stats
   * @returns {Promise<{ testsCompleted: number, typists: number, lessons: number, bestWpm: number } | null>}
   */
  getPublicStats: async () => {
    try {
      const response = await api.get('/public/stats');
      if (response && response.success && response.stats) {
        return response.stats;
      }
      return response?.stats || null;
    } catch (err) {
      console.warn('Failed to fetch public stats:', err.message);
      return null;
    }
  },
};

export default statsService;
