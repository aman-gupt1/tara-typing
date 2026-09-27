import { api } from './api';

export const adminService = {
  /**
   * Fetch core Admin Dashboard KPIs, charts, learning status, and system health
   * GET /api/admin/dashboard/stats?timeframe={timeframe}
   */
  getDashboardStats: async (timeframe = '30d') => {
    try {
      const response = await api.get(`/admin/dashboard/stats?timeframe=${timeframe}`);
      if (response && response.success) {
        return response;
      }
      return response || null;
    } catch (error) {
      console.warn('Failed to fetch admin dashboard stats:', error.message);
      return null;
    }
  },

  /**
   * Fetch live telemetry feed, recent user registrations, leaderboard, and anti-cheat cases
   * GET /api/admin/dashboard/recent-activity
   */
  getRecentActivity: async () => {
    try {
      const response = await api.get('/admin/dashboard/recent-activity');
      if (response && response.success) {
        return response;
      }
      return response || null;
    } catch (error) {
      console.warn('Failed to fetch admin recent activity:', error.message);
      return null;
    }
  },

  /**
   * Publish or schedule today's daily challenge
   * POST /api/admin/dashboard/challenge
   */
  publishDailyChallenge: async (challengeData) => {
    try {
      const response = await api.post('/admin/dashboard/challenge', challengeData);
      return response;
    } catch (error) {
      console.error('Failed to publish challenge:', error.message);
      throw error;
    }
  },

  /**
   * Export complete platform telemetry as JSON
   * GET /api/admin/dashboard/export
   */
  exportTelemetry: async () => {
    try {
      const response = await api.get('/admin/dashboard/export');
      // Create a downloadable JSON blob
      const blob = new Blob([JSON.stringify(response, null, 2)], {
        type: 'application/json',
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `TaraTyping-Telemetry-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      return true;
    } catch (error) {
      console.error('Failed to export telemetry:', error.message);
      throw error;
    }
  },

  /**
   * Fetch paginated users directory with search, filter, and KPI counts
   * GET /api/admin/users
   */
  getUsers: async (params = {}) => {
    try {
      const query = new URLSearchParams();
      if (params.search) query.append('search', params.search);
      if (params.status && params.status !== 'All') query.append('status', params.status);
      if (params.speedTier && params.speedTier !== 'All') query.append('speedTier', params.speedTier);
      if (params.sortBy) query.append('sortBy', params.sortBy);
      if (params.sortOrder) query.append('sortOrder', params.sortOrder);
      if (params.page) query.append('page', params.page);
      if (params.limit) query.append('limit', params.limit);

      const qs = query.toString() ? `?${query.toString()}` : '';
      const response = await api.get(`/admin/users${qs}`);
      return response;
    } catch (error) {
      console.error('Failed to fetch admin users list:', error.message);
      throw error;
    }
  },

  /**
   * Fetch complete user dossier, recent typing tests, and lesson breakdown
   * GET /api/admin/users/:id
   */
  getUserById: async (id) => {
    try {
      const response = await api.get(`/admin/users/${id}`);
      return response;
    } catch (error) {
      console.error('Failed to fetch user dossier:', error.message);
      throw error;
    }
  },

  /**
   * Update user role (user/admin)
   * PATCH /api/admin/users/:id/role
   */
  updateUserRole: async (id, role) => {
    try {
      const response = await api.patch(`/admin/users/${id}/role`, { role });
      return response;
    } catch (error) {
      console.error('Failed to update user role:', error.message);
      throw error;
    }
  },

  /**
   * Update user status (active/suspended/inactive)
   * PATCH /api/admin/users/:id/status
   */
  updateUserStatus: async (id, status) => {
    try {
      const response = await api.patch(`/admin/users/${id}/status`, { status });
      return response;
    } catch (error) {
      console.error('Failed to update user status:', error.message);
      throw error;
    }
  },

  /**
   * Delete user and cascade records
   * DELETE /api/admin/users/:id
   */
  deleteUser: async (id) => {
    try {
      const response = await api.delete(`/admin/users/${id}`);
      return response;
    } catch (error) {
      console.error('Failed to delete user:', error.message);
      throw error;
    }
  },

  /**
   * Export users as CSV
   * GET /api/admin/users/export?format=csv
   */
  exportUsers: async (format = 'csv') => {
    try {
      const res = await fetch(`/api/admin/users/export?format=${format}`, {
        credentials: 'include',
      });
      if (!res.ok) {
        throw new Error(`Export failed with status ${res.status}`);
      }
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `tara_typing_users_${new Date().toISOString().split('T')[0]}.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      return true;
    } catch (error) {
      console.error('Failed to export users:', error.message);
      throw error;
    }
  },

  /**
   * Fetch paginated typing test records with search, filters, and KPIs
   * GET /api/admin/typing-tests
   */
  getTypingTests: async (params = {}) => {
    try {
      const query = new URLSearchParams();
      if (params.search) query.append('search', params.search);
      if (params.mode && params.mode !== 'All') query.append('mode', params.mode);
      if (params.status && params.status !== 'All') query.append('status', params.status);
      if (params.sortBy) query.append('sortBy', params.sortBy);
      if (params.sortOrder) query.append('sortOrder', params.sortOrder);
      if (params.page) query.append('page', params.page);
      if (params.limit) query.append('limit', params.limit);

      const qs = query.toString() ? `?${query.toString()}` : '';
      const response = await api.get(`/admin/typing-tests${qs}`);
      return response;
    } catch (error) {
      console.error('Failed to fetch typing tests:', error.message);
      throw error;
    }
  },

  /**
   * Fetch complete typing test session with keystroke cadence & telemetry
   * GET /api/admin/typing-tests/:id
   */
  getTypingTestById: async (id) => {
    try {
      const response = await api.get(`/admin/typing-tests/${id}`);
      return response;
    } catch (error) {
      console.error('Failed to fetch typing test by ID:', error.message);
      throw error;
    }
  },

  /**
   * Toggle validity of typing test (Valid <-> Suspicious)
   * PATCH /api/admin/typing-tests/:id/validity
   */
  updateTestValidity: async (id, data = {}) => {
    try {
      const response = await api.patch(`/admin/typing-tests/${id}/validity`, data);
      return response;
    } catch (error) {
      console.error('Failed to update test validity:', error.message);
      throw error;
    }
  },

  /**
   * Delete typing test session log
   * DELETE /api/admin/typing-tests/:id
   */
  deleteTypingTest: async (id) => {
    try {
      const response = await api.delete(`/admin/typing-tests/${id}`);
      return response;
    } catch (error) {
      console.error('Failed to delete typing test:', error.message);
      throw error;
    }
  },

  /**
   * Export typing tests as CSV
   * GET /api/admin/typing-tests/export?format=csv
   */
  exportTypingTests: async (format = 'csv') => {
    try {
      const res = await fetch(`/api/admin/typing-tests/export?format=${format}`, {
        credentials: 'include',
      });
      if (!res.ok) {
        throw new Error(`Export failed with status ${res.status}`);
      }
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `tara_typing_tests_log_${new Date().toISOString().split('T')[0]}.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      return true;
    } catch (error) {
      console.error('Failed to export typing tests:', error.message);
      throw error;
    }
  },

  /**
   * Fetch leaderboard rankings with timeframes, KPIs, and audit telemetry
   * GET /api/admin/leaderboard?timeframe={timeframe}&mode={mode}&status={status}&sortBy={sortBy}&search={search}&page={page}&limit={limit}
   */
  getLeaderboard: async (params = {}) => {
    try {
      const query = new URLSearchParams();
      if (params.timeframe) query.append('timeframe', params.timeframe);
      if (params.mode && params.mode !== 'All') query.append('mode', params.mode);
      if (params.status && params.status !== 'All') query.append('status', params.status);
      if (params.sortBy) query.append('sortBy', params.sortBy);
      if (params.search) query.append('search', params.search);
      if (params.page) query.append('page', params.page);
      if (params.limit) query.append('limit', params.limit);

      const qs = query.toString() ? `?${query.toString()}` : '';
      const response = await api.get(`/admin/leaderboard${qs}`);
      return response;
    } catch (error) {
      console.error('Failed to fetch admin leaderboard:', error.message);
      throw error;
    }
  },

  /**
   * Toggle leaderboard entry score legitimacy (Verified <-> Flagged)
   * PATCH /api/admin/leaderboard/entry/:testId/flag
   */
  toggleLeaderboardFlag: async (testId, data = {}) => {
    try {
      const response = await api.patch(`/admin/leaderboard/entry/${testId}/flag`, data);
      return response;
    } catch (error) {
      console.error('Failed to toggle leaderboard entry flag:', error.message);
      throw error;
    }
  },

  /**
   * Disqualify anomalous entry from leaderboard
   * DELETE /api/admin/leaderboard/entry/:testId
   */
  disqualifyLeaderboardEntry: async (testId) => {
    try {
      const response = await api.delete(`/admin/leaderboard/entry/${testId}`);
      return response;
    } catch (error) {
      console.error('Failed to disqualify leaderboard entry:', error.message);
      throw error;
    }
  },

  /**
   * Export leaderboard standings as CSV
   * GET /api/admin/leaderboard/export?timeframe={timeframe}&mode={mode}&status={status}&format=csv
   */
  exportLeaderboard: async (params = {}) => {
    try {
      const query = new URLSearchParams();
      if (params.timeframe) query.append('timeframe', params.timeframe);
      if (params.mode && params.mode !== 'All') query.append('mode', params.mode);
      if (params.status && params.status !== 'All') query.append('status', params.status);
      query.append('format', 'csv');

      const res = await fetch(`/api/admin/leaderboard/export?${query.toString()}`, {
        credentials: 'include',
      });
      if (!res.ok) {
        throw new Error(`Export failed with status ${res.status}`);
      }
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `tara_typing_${params.timeframe || 'global'}_leaderboard_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      return true;
    } catch (error) {
      console.error('Failed to export leaderboard:', error.message);
      throw error;
    }
  },

  /**
   * LEARNING CONTENT CMS APIS
   */

  /**
   * Fetch top KPIs, completion stats, and category matrix
   * GET /api/admin/learning/stats
   */
  getLearningStats: async () => {
    try {
      const response = await api.get('/admin/learning/stats');
      return response;
    } catch (error) {
      console.error('Failed to fetch learning stats:', error.message);
      throw error;
    }
  },

  /**
   * Fetch courses/modules with filtering, searching, and sorting
   * GET /api/admin/learning/courses
   */
  getAdminCourses: async (params = {}) => {
    try {
      const query = new URLSearchParams();
      if (params.category && params.category !== 'All') query.append('category', params.category);
      if (params.difficulty && params.difficulty !== 'All') query.append('difficulty', params.difficulty);
      if (params.status && params.status !== 'All') query.append('status', params.status);
      if (params.sortBy) query.append('sortBy', params.sortBy);
      if (params.search) query.append('search', params.search);
      if (params.page) query.append('page', params.page);
      if (params.limit) query.append('limit', params.limit);

      const qs = query.toString() ? `?${query.toString()}` : '';
      const response = await api.get(`/admin/learning/courses${qs}`);
      return response;
    } catch (error) {
      console.error('Failed to fetch admin courses:', error.message);
      throw error;
    }
  },

  /**
   * Get single course by ID or slug
   * GET /api/admin/learning/courses/:id
   */
  getAdminCourseById: async (id) => {
    try {
      const response = await api.get(`/admin/learning/courses/${id}`);
      return response;
    } catch (error) {
      console.error('Failed to fetch admin course by id:', error.message);
      throw error;
    }
  },

  /**
   * Create a new course module
   * POST /api/admin/learning/courses
   */
  createAdminCourse: async (courseData) => {
    try {
      const response = await api.post('/admin/learning/courses', courseData);
      return response;
    } catch (error) {
      console.error('Failed to create admin course:', error.message);
      throw error;
    }
  },

  /**
   * Update course module
   * PUT /api/admin/learning/courses/:id
   */
  updateAdminCourse: async (id, courseData) => {
    try {
      const response = await api.put(`/admin/learning/courses/${id}`, courseData);
      return response;
    } catch (error) {
      console.error('Failed to update admin course:', error.message);
      throw error;
    }
  },

  /**
   * Toggle or update course status
   * PATCH /api/admin/learning/courses/:id/status
   */
  updateAdminCourseStatus: async (id, data = {}) => {
    try {
      const response = await api.patch(`/admin/learning/courses/${id}/status`, data);
      return response;
    } catch (error) {
      console.error('Failed to update course status:', error.message);
      throw error;
    }
  },

  /**
   * Delete course module
   * DELETE /api/admin/learning/courses/:id
   */
  deleteAdminCourse: async (id) => {
    try {
      const response = await api.delete(`/admin/learning/courses/${id}`);
      return response;
    } catch (error) {
      console.error('Failed to delete admin course:', error.message);
      throw error;
    }
  },

  /**
   * Fetch lessons with filtering, searching, and sorting
   * GET /api/admin/learning/lessons
   */
  getAdminLessons: async (params = {}) => {
    try {
      const query = new URLSearchParams();
      if (params.category && params.category !== 'All') query.append('category', params.category);
      if (params.difficulty && params.difficulty !== 'All') query.append('difficulty', params.difficulty);
      if (params.status && params.status !== 'All') query.append('status', params.status);
      if (params.sortBy) query.append('sortBy', params.sortBy);
      if (params.search) query.append('search', params.search);
      if (params.page) query.append('page', params.page);
      if (params.limit) query.append('limit', params.limit);

      const qs = query.toString() ? `?${query.toString()}` : '';
      const response = await api.get(`/admin/learning/lessons${qs}`);
      return response;
    } catch (error) {
      console.error('Failed to fetch admin lessons:', error.message);
      throw error;
    }
  },

  /**
   * Get single lesson by ID or slug
   * GET /api/admin/learning/lessons/:id
   */
  getAdminLessonById: async (id) => {
    try {
      const response = await api.get(`/admin/learning/lessons/${id}`);
      return response;
    } catch (error) {
      console.error('Failed to fetch admin lesson by id:', error.message);
      throw error;
    }
  },

  /**
   * Create a new lesson
   * POST /api/admin/learning/lessons
   */
  createAdminLesson: async (lessonData) => {
    try {
      const response = await api.post('/admin/learning/lessons', lessonData);
      return response;
    } catch (error) {
      console.error('Failed to create admin lesson:', error.message);
      throw error;
    }
  },

  /**
   * Update lesson
   * PUT /api/admin/learning/lessons/:id
   */
  updateAdminLesson: async (id, lessonData) => {
    try {
      const response = await api.put(`/admin/learning/lessons/${id}`, lessonData);
      return response;
    } catch (error) {
      console.error('Failed to update admin lesson:', error.message);
      throw error;
    }
  },

  /**
   * Toggle or update lesson status
   * PATCH /api/admin/learning/lessons/:id/status
   */
  updateAdminLessonStatus: async (id, data = {}) => {
    try {
      const response = await api.patch(`/admin/learning/lessons/${id}/status`, data);
      return response;
    } catch (error) {
      console.error('Failed to update lesson status:', error.message);
      throw error;
    }
  },

  /**
   * Delete lesson
   * DELETE /api/admin/learning/lessons/:id
   */
  deleteAdminLesson: async (id) => {
    try {
      const response = await api.delete(`/admin/learning/lessons/${id}`);
      return response;
    } catch (error) {
      console.error('Failed to delete admin lesson:', error.message);
      throw error;
    }
  },

  /**
   * Export learning content as CSV download
   * GET /api/admin/learning/export
   */
  exportLearningCSV: async (params = {}) => {
    try {
      const query = new URLSearchParams();
      if (params.type) query.append('type', params.type);
      if (params.category && params.category !== 'All') query.append('category', params.category);
      if (params.difficulty && params.difficulty !== 'All') query.append('difficulty', params.difficulty);
      if (params.status && params.status !== 'All') query.append('status', params.status);
      query.append('format', 'csv');

      const res = await fetch(`/api/admin/learning/export?${query.toString()}`, {
        credentials: 'include',
      });
      if (!res.ok) {
        throw new Error(`Export failed with status ${res.status}`);
      }
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `tara_typing_${params.type || 'learning'}_export_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      return true;
    } catch (error) {
      console.error('Failed to export learning data:', error.message);
      throw error;
    }
  },

  /**
   * Fetch gamification overview KPIs and rarity distribution
   * GET /api/admin/achievements/stats
   */
  getAchievementStats: async () => {
    try {
      const response = await api.get('/admin/achievements/stats');
      return response;
    } catch (error) {
      console.error('Failed to fetch achievement stats:', error.message);
      throw error;
    }
  },

  /**
   * Fetch achievements list with filters, searching, and sorting
   * GET /api/admin/achievements
   */
  getAdminAchievements: async (params = {}) => {
    try {
      const query = new URLSearchParams();
      if (params.search) query.append('search', params.search);
      if (params.category && params.category !== 'All') query.append('category', params.category);
      if (params.tier && params.tier !== 'All') query.append('tier', params.tier);
      if (params.status && params.status !== 'All') query.append('status', params.status);
      if (params.sortBy) query.append('sortBy', params.sortBy);
      if (params.page) query.append('page', params.page);
      if (params.limit) query.append('limit', params.limit);

      const qs = query.toString() ? `?${query.toString()}` : '';
      const response = await api.get(`/admin/achievements${qs}`);
      return response;
    } catch (error) {
      console.error('Failed to fetch admin achievements list:', error.message);
      throw error;
    }
  },

  /**
   * Fetch single achievement dossier with unlock telemetry and recent typists
   * GET /api/admin/achievements/:id
   */
  getAdminAchievementById: async (id) => {
    try {
      const response = await api.get(`/admin/achievements/${id}`);
      return response;
    } catch (error) {
      console.error('Failed to fetch achievement by id:', error.message);
      throw error;
    }
  },

  /**
   * Create new achievement badge
   * POST /api/admin/achievements
   */
  createAdminAchievement: async (achievementData) => {
    try {
      const response = await api.post('/admin/achievements', achievementData);
      return response;
    } catch (error) {
      console.error('Failed to create admin achievement:', error.message);
      throw error;
    }
  },

  /**
   * Update achievement badge
   * PUT /api/admin/achievements/:id
   */
  updateAdminAchievement: async (id, achievementData) => {
    try {
      const response = await api.put(`/admin/achievements/${id}`, achievementData);
      return response;
    } catch (error) {
      console.error('Failed to update admin achievement:', error.message);
      throw error;
    }
  },

  /**
   * Toggle or update achievement badge status ('Active' | 'Disabled')
   * PATCH /api/admin/achievements/:id/status
   */
  updateAdminAchievementStatus: async (id, statusData = {}) => {
    try {
      const response = await api.patch(`/admin/achievements/${id}/status`, statusData);
      return response;
    } catch (error) {
      console.error('Failed to update achievement status:', error.message);
      throw error;
    }
  },

  /**
   * Delete achievement badge
   * DELETE /api/admin/achievements/:id
   */
  deleteAdminAchievement: async (id) => {
    try {
      const response = await api.delete(`/admin/achievements/${id}`);
      return response;
    } catch (error) {
      console.error('Failed to delete admin achievement:', error.message);
      throw error;
    }
  },

  /**
   * Export achievements roster as CSV download
   * GET /api/admin/achievements/export?format=csv
   */
  exportAchievementsCSV: async (params = {}) => {
    try {
      const query = new URLSearchParams();
      if (params.category && params.category !== 'All') query.append('category', params.category);
      if (params.tier && params.tier !== 'All') query.append('tier', params.tier);
      if (params.status && params.status !== 'All') query.append('status', params.status);
      if (params.search) query.append('search', params.search);
      query.append('format', 'csv');

      const res = await fetch(`/api/admin/achievements/export?${query.toString()}`, {
        credentials: 'include',
      });
      if (!res.ok) {
        throw new Error(`Export failed with status ${res.status}`);
      }
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `tara_typing_achievements_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      return true;
    } catch (error) {
      console.error('Failed to export achievements data:', error.message);
      throw error;
    }
  },

  /**
   * Fetch complete platform analytics intelligence, speed curves, concurrency, and retention funnel
   * GET /api/admin/analytics/overview?timeframe={timeframe}
   */
  getAnalyticsOverview: async (timeframe = '30d') => {
    try {
      const response = await api.get(`/admin/analytics/overview?timeframe=${timeframe}`);
      return response;
    } catch (error) {
      console.error('Failed to fetch platform analytics overview:', error.message);
      throw error;
    }
  },

  /**
   * Download comprehensive analytics intelligence report as CSV
   * GET /api/admin/analytics/export?timeframe={timeframe}
   */
  exportAnalyticsCSV: async (timeframe = '30d') => {
    try {
      const res = await fetch(`/api/admin/analytics/export?timeframe=${timeframe}`, {
        credentials: 'include',
      });
      if (!res.ok) {
        throw new Error(`Export failed with status ${res.status}`);
      }
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `tara_typing_analytics_report_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      return true;
    } catch (error) {
      console.error('Failed to export analytics report:', error.message);
      throw error;
    }
  },
};

export default adminService;
