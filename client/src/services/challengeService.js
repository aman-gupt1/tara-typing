import { api } from './api';
import { DEFAULT_DAILY_CHALLENGE } from '../data/mockDailyChallenges';

export const challengeService = {
  /**
   * Get today's active daily challenge
   * GET /api/daily-challenge/today
   */
  getTodayChallenge: async () => {
    try {
      const res = await api.get('/daily-challenge/today');
      if (res?.challenge) {
        return { challenge: res.challenge };
      }
    } catch (err) {
      console.warn('Daily challenge fetch warning:', err.message);
    }

    return {
      challenge: DEFAULT_DAILY_CHALLENGE,
    };
  },

  /**
   * Get logged-in user's result for today's challenge
   * GET /api/daily-challenge/today/result
   */
  getTodayResult: async () => {
    try {
      const res = await api.get('/daily-challenge/today/result');
      return res?.result || null;
    } catch (err) {
      if (err?.status !== 401 && err?.status !== 404) {
        console.warn('Today challenge result notice:', err.message);
      }
      return null;
    }
  },

  /**
   * Get challenge by specific date (YYYY-MM-DD)
   * GET /api/daily-challenge/date/:date
   */
  getChallengeByDate: async (date) => {
    try {
      const res = await api.get(`/daily-challenge/date/${date}`);
      return res?.challenge || null;
    } catch (err) {
      console.warn(`Challenge fetch error for date ${date}:`, err.message);
      return null;
    }
  },

  /**
   * Get logged-in user's daily challenge history
   * GET /api/daily-challenge/history
   */
  getHistory: async (limit = 30) => {
    try {
      const res = await api.get(`/daily-challenge/history?limit=${limit}`);
      return res?.history || [];
    } catch (err) {
      if (err?.status !== 401) {
        console.warn('Daily challenge history notice:', err.message);
      }
      return [];
    }
  },

  /**
   * Submit score for daily challenge
   * POST /api/daily-challenge/submit
   */
  submitChallengeScore: async (scoreData) => {
    const payload = {
      challengeId: scoreData.challengeId,
      wpm: Math.round(scoreData.wpm),
      rawWpm: Math.round(scoreData.rawWpm !== undefined ? scoreData.rawWpm : scoreData.wpm),
      accuracy: Math.round(scoreData.accuracy * 10) / 10,
      mistakes: scoreData.mistakes !== undefined ? scoreData.mistakes : (scoreData.errors || 0),
      correctCharacters: scoreData.correctCharacters || 0,
      totalCharacters: scoreData.totalCharacters || 0,
      consistency: Math.round(scoreData.consistency || 95),
    };

    const res = await api.post('/daily-challenge/submit', payload);
    return {
      success: true,
      result: res.result,
      rank: res.rank,
      participantsCount: res.participantsCount,
      topScores: res.topScores,
    };
  },
};

export default challengeService;

