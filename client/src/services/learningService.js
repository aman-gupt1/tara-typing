import { api } from './api';

const COMPLETED_LESSONS_KEY = 'tara_completed_lessons';
const BOOKMARKED_LESSONS_KEY = 'tara_bookmarked_lessons';
const QUIZ_SCORES_KEY = 'tara_quiz_scores';
const LAST_LESSON_KEY = 'tara_last_lesson';

export const learningService = {
  /**
   * Get all active lessons from backend
   * GET /api/lessons
   */
  getLessons: async (category = 'all') => {
    const res = await api.get('/lessons');
    const list = Array.isArray(res) ? res : (res?.lessons || []);
    if (category && category !== 'all') {
      return list.filter((l) => l.category === category || l.categoryId === category);
    }
    return list;
  },

  /**
   * Get single lesson by slug from backend
   * GET /api/lessons/:slug
   */
  getLessonBySlug: async (slug) => {
    const res = await api.get(`/lessons/${slug}`);
    return res?.lesson || null;
  },

  /**
   * Alias for backward compatibility
   */
  getLessonById: async (lessonId) => {
    return learningService.getLessonBySlug(lessonId);
  },

  /**
   * Get logged-in user's full learning progress from backend
   * GET /api/lessons/progress (authenticated)
   */
  getProgress: async () => {
    try {
      const res = await api.get('/lessons/progress');
      if (res?.progress) {
        return res.progress;
      }
    } catch {
      // Unauthenticated or network error fallback
    }

    // Guest fallback using localStorage
    let completed = [];
    let bookmarked = [];
    let quizScores = {};
    let lastVisitedLesson = '';

    try {
      const c = localStorage.getItem(COMPLETED_LESSONS_KEY);
      if (c) completed = JSON.parse(c);
      const b = localStorage.getItem(BOOKMARKED_LESSONS_KEY);
      if (b) bookmarked = JSON.parse(b);
      const q = localStorage.getItem(QUIZ_SCORES_KEY);
      if (q) quizScores = JSON.parse(q);
      const l = localStorage.getItem(LAST_LESSON_KEY);
      if (l) lastVisitedLesson = l;
    } catch {}

    return {
      completedLessons: completed,
      bookmarkedLessons: bookmarked,
      quizScores,
      lastVisitedLesson,
      totalCompleted: completed.length,
    };
  },

  /**
   * Mark lesson as completed with optional quiz score
   * POST /api/lessons/:slug/complete (authenticated)
   */
  completeLesson: async (slug, data = {}) => {
    const payload = {};
    if (data.score !== undefined && data.score !== null) {
      payload.score = Number(data.score);
    }

    try {
      const res = await api.post(`/lessons/${slug}/complete`, payload);
      return res;
    } catch (err) {
      // Guest local fallback
      try {
        let completed = [];
        const c = localStorage.getItem(COMPLETED_LESSONS_KEY);
        if (c) completed = JSON.parse(c);
        if (!completed.includes(slug)) {
          completed.push(slug);
          localStorage.setItem(COMPLETED_LESSONS_KEY, JSON.stringify(completed));
        }

        if (payload.score !== undefined) {
          let quizScores = {};
          const q = localStorage.getItem(QUIZ_SCORES_KEY);
          if (q) quizScores = JSON.parse(q);
          quizScores[slug] = payload.score;
          localStorage.setItem(QUIZ_SCORES_KEY, JSON.stringify(quizScores));
        }
      } catch {}

      return { success: true, slug, ...payload };
    }
  },

  /**
   * Alias for backward compatibility
   */
  saveLessonProgress: async (lessonId, score = null) => {
    return learningService.completeLesson(lessonId, { score });
  },

  /**
   * Toggle lesson bookmark
   * PATCH /api/lessons/:slug/bookmark (authenticated)
   */
  toggleBookmark: async (slug) => {
    try {
      const res = await api.patch(`/lessons/${slug}/bookmark`);
      return res;
    } catch {
      // Guest local fallback
      try {
        let bookmarked = [];
        const b = localStorage.getItem(BOOKMARKED_LESSONS_KEY);
        if (b) bookmarked = JSON.parse(b);
        const already = bookmarked.includes(slug);
        if (already) {
          bookmarked = bookmarked.filter((s) => s !== slug);
        } else {
          bookmarked.push(slug);
        }
        localStorage.setItem(BOOKMARKED_LESSONS_KEY, JSON.stringify(bookmarked));
        return { success: true, bookmarked: !already, bookmarkedLessons: bookmarked };
      } catch {
        return { success: true, bookmarked: false, bookmarkedLessons: [] };
      }
    }
  },

  /**
   * Update last visited lesson
   * PATCH /api/lessons/:slug/last-visited (authenticated)
   */
  updateLastVisited: async (slug) => {
    try {
      const res = await api.patch(`/lessons/${slug}/last-visited`);
      return res;
    } catch {
      try {
        localStorage.setItem(LAST_LESSON_KEY, slug);
      } catch {}
      return { success: true, lastVisitedLesson: slug };
    }
  },

  /**
   * Reset user's learning progress
   * DELETE /api/lessons/progress (authenticated)
   */
  resetProgress: async () => {
    try {
      const res = await api.delete('/lessons/progress');
      return res;
    } catch {
      try {
        localStorage.removeItem(COMPLETED_LESSONS_KEY);
        localStorage.removeItem(BOOKMARKED_LESSONS_KEY);
        localStorage.removeItem(QUIZ_SCORES_KEY);
        localStorage.removeItem(LAST_LESSON_KEY);
      } catch {}
      return { success: true };
    }
  },
};

export default learningService;
