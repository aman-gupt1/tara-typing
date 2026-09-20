import { api } from './api';

export const achievementService = {
  /**
   * Get user achievements with unlock status
   * GET /api/achievements (protected)
   */
  getUserAchievements: async () => {
    try {
      const res = await api.get('/achievements');
      return res?.achievements || [];
    } catch (err) {
      if (err?.status !== 401) {
        console.warn('Achievements fetch notice:', err.message);
      }
      return [];
    }
  },
};

export default achievementService;
