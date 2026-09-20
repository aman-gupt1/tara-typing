import { api } from './api';

export const practiceService = {
  /**
   * Save practice session
   * POST /api/practice/save
   */
  saveSession: async (sessionData) => {
    const payload = {
      mode: sessionData.mode || 'time',
      targetParam: sessionData.targetParam || '30s',
      wpm: Math.round(sessionData.wpm),
      accuracy: Math.round(sessionData.accuracy * 10) / 10,
      mistakes: sessionData.mistakes !== undefined ? sessionData.mistakes : (sessionData.errors || 0),
      duration: sessionData.duration || 30,
    };

    const res = await api.post('/practice/save', payload);
    return res.session;
  },

  /**
   * Get user practice history
   * GET /api/practice/history
   */
  getHistory: async () => {
    try {
      const res = await api.get('/practice/history');
      return res.sessions || [];
    } catch (err) {
      console.warn('Practice history fetch warning:', err.message);
      return [];
    }
  },
};

export default practiceService;
