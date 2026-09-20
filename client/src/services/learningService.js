import { api } from './api';
import { TYPING_LESSONS, LESSON_CATEGORIES } from '../data/typingLessons';

const COMPLETED_LESSONS_KEY = 'tara_completed_lessons';
const BOOKMARKED_LESSONS_KEY = 'tara_bookmarked_lessons';
const QUIZ_SCORES_KEY = 'tara_quiz_scores';
const LAST_LESSON_KEY = 'tara_last_lesson';

export const learningService = {
  /**
   * Get all lessons with user progress from backend
   * GET /api/lessons
   */
  getLessons: async (category = 'all') => {
    try {
      const res = await api.get('/lessons');
      const list = Array.isArray(res) ? res : (res?.lessons || []);
      if (category && category !== 'all') {
        return list.filter((l) => l.category === category || l.categoryId === category);
      }
      return list;
    } catch (err) {
      console.warn('Learning API getLessons warning:', err.message);
      if (!category || category === 'all') {
        return TYPING_LESSONS;
      }
      return TYPING_LESSONS.filter((l) => l.category === category || l.categoryId === category);
    }
  },

  /**
   * Get single lesson by slug
   * GET /api/lessons/:slug
   */
  getLessonBySlug: async (slug) => {
    try {
      const res = await api.get(`/lessons/${slug}`);
      return res?.lesson || null;
    } catch (err) {
      console.warn(`Learning API getLessonBySlug warning (${slug}):`, err.message);
      return TYPING_LESSONS.find((l) => l.id === slug || l.slug === slug) || null;
    }
  },

  /**
   * Alias for backward compatibility
   */
  getLessonById: async (lessonId) => {
    return learningService.getLessonBySlug(lessonId);
  },

  /**
   * Get lesson categories
   */
  getCategories: async () => {
    return LESSON_CATEGORIES;
  },

  /**
   * Get logged-in user's full learning progress from backend
   * GET /api/lessons/progress (protected)
   */
  getProgress: async () => {
    try {
      const res = await api.get('/lessons/progress');
      if (res?.progress) {
        const p = res.progress;
        return {
          completedLessons: p.completedLessons || [],
          bookmarkedLessons: p.bookmarkedLessons || [],
          quizScores: p.quizScores || {},
          lastVisitedLesson: p.lastVisitedLesson || '',
          totalCompleted: p.totalCompleted || (p.completedLessons || []).length,
          updatedAt: p.updatedAt,
        };
      }
    } catch (err) {
      // Fallback for unauthenticated guest
    }

    // Guest fallback using localStorage
    let completed = [];
    let bookmarked = [];
    let quizScores = {};
    let lastVisitedLesson = 'what-is-touch-typing';

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

    const total = TYPING_LESSONS.length;
    const progressPercent = total > 0 ? Math.round((completed.length / total) * 100) : 0;

    return {
      completedLessons: completed,
      bookmarkedLessons: bookmarked,
      quizScores,
      lastVisitedLesson,
      totalLessons: total,
      completedCount: completed.length,
      progressPercentage: progressPercent,
    };
  },

  /**
   * Mark lesson as completed with optional quiz score
   * POST /api/lessons/:slug/complete (protected)
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
      // Fallback for unauthenticated guest
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
   * PATCH /api/lessons/:slug/bookmark (protected)
   */
  toggleBookmark: async (slug) => {
    try {
      const res = await api.patch(`/lessons/${slug}/bookmark`);
      return res;
    } catch (err) {
      // Fallback for guest
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
   * PATCH /api/lessons/:slug/last-visited (protected)
   */
  updateLastVisited: async (slug) => {
    try {
      const res = await api.patch(`/lessons/${slug}/last-visited`);
      return res;
    } catch (err) {
      try {
        localStorage.setItem(LAST_LESSON_KEY, slug);
      } catch {}
      return { success: true, lastVisitedLesson: slug };
    }
  },

  /**
   * Reset user's learning progress
   * DELETE /api/lessons/progress (protected)
   */
  resetProgress: async () => {
    try {
      const res = await api.delete('/lessons/progress');
      return res;
    } catch (err) {
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
