import { api } from './api';
import { storage } from '../utils/storage';

export const typingService = {
  /**
   * Save a newly finished typing test result
   * POST /api/typing/save
   */
  saveResult: async (resultData) => {
    const payload = {
      mode: resultData.mode || 'words',
      duration: resultData.duration || 30,
      wpm: Math.round(resultData.wpm),
      rawWpm: Math.round(resultData.rawWpm || resultData.wpm),
      accuracy: Math.round(resultData.accuracy * 10) / 10,
      mistakes: resultData.mistakes !== undefined ? resultData.mistakes : (resultData.errors || 0),
      errors: resultData.errors !== undefined ? resultData.errors : (resultData.mistakes || 0),
      correctCharacters: resultData.correctCharacters || 0,
      totalCharacters: resultData.totalCharacters || 0,
      consistency: resultData.consistency || 95,
      wpmHistory: resultData.wpmHistory || [],
    };

    // Always cache locally
    const enrichedLocal = {
      ...payload,
      id: 'res_' + Date.now(),
      completedAt: new Date().toISOString(),
    };
    storage.saveLocalResult(enrichedLocal);

    try {
      const res = await api.post('/typing/save', payload);
      return {
        success: true,
        result: res.result || enrichedLocal,
      };
    } catch (err) {
      // If guest/unauthenticated (401), local save is already complete
      return {
        success: true,
        result: enrichedLocal,
        isGuest: true,
      };
    }
  },

  /**
   * Get recent typing test results from backend or fallback to local storage
   * GET /api/typing/recent
   */
  getRecentResults: async () => {
    try {
      const res = await api.get('/typing/recent');
      if (res?.results && Array.isArray(res.results)) {
        return res.results;
      }
    } catch (err) {
      // Fallback if unauthenticated/guest or network error
    }

    const local = storage.getLocalResults();
    return local || [];
  },

  /**
   * Get user typing trends over N days
   * GET /api/typing/trends?days=7
   */
  getTypingTrends: async (days = 7) => {
    try {
      const res = await api.get(`/typing/trends?days=${days}`);
      return res?.trends || [];
    } catch (err) {
      console.warn('Typing trends fetch warning:', err.message);
      return [];
    }
  },
};

export default typingService;

