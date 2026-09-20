import { api } from './api';
import { storage } from '../utils/storage';

export const profileService = {
  /**
   * Get user profile from backend
   * GET /api/profile
   */
  getProfile: async () => {
    try {
      const res = await api.get('/profile');
      if (res?.user) {
        return res.user;
      }
    } catch (err) {
      // Fallback if unauthenticated or network error
    }
    const savedUser = storage.getUser();
    return savedUser || null;
  },

  /**
   * Update user profile fields (name, username, avatar, bio, location)
   * PUT /api/profile/update
   */
  updateProfile: async (profileData) => {
    const payload = {
      name: profileData.name,
      username: profileData.username,
      avatar: profileData.avatar,
      bio: profileData.bio,
      location: profileData.location,
    };

    try {
      const res = await api.put('/profile/update', payload);
      const updated = res.user || res;
      storage.setUser(updated);
      return updated;
    } catch (err) {
      if (err?.status === 404) {
        const res = await api.put('/profile', payload);
        const updated = res.user || res;
        storage.setUser(updated);
        return updated;
      }
      throw err;
    }
  },

  /**
   * Get calculated user stats from backend
   * GET /api/profile/stats
   */
  getUserStats: async () => {
    try {
      const res = await api.get('/profile/stats');
      if (res?.stats) {
        return res.stats;
      }
    } catch (err) {
      // Fallback to local calculations if unauthenticated
    }

    const user = storage.getUser() || null;
    const localResults = storage.getLocalResults() || [];

    let bestWpm = user?.bestWpm || 0;
    let testsCompleted = user?.testsCompleted || localResults.length;
    let totalTypingTime = user?.totalTypingTime || 0;
    let avgWpm = user?.averageWpm || 0;
    let accuracy = user?.accuracy || 0;

    if (localResults.length > 0) {
      bestWpm = Math.max(bestWpm, ...localResults.map((r) => r.wpm || 0));
      const totalWpmSum = localResults.reduce((sum, r) => sum + (r.wpm || 0), 0);
      avgWpm = Math.round(totalWpmSum / localResults.length);
      const totalAccSum = localResults.reduce((sum, r) => sum + (r.accuracy || 0), 0);
      accuracy = +(totalAccSum / localResults.length).toFixed(1);
    }

    return {
      bestWpm,
      averageWpm: avgWpm,
      accuracy,
      testsCompleted,
      totalTypingTime,
      currentStreak: user?.currentStreak || 0,
      achievements: user?.achievements || [],
    };
  },

  /**
   * Get user rank and total users
   * GET /api/profile/rank
   */
  getProfileRank: async () => {
    try {
      const res = await api.get('/profile/rank');
      if (res && typeof res === 'object') {
        return {
          rank: res.rank,
          totalUsers: res.totalUsers,
          wpm: res.wpm,
          accuracy: res.accuracy,
          hasResult: res.hasResult,
        };
      }
      return null;
    } catch (err) {
      return null;
    }
  },
};

export default profileService;
