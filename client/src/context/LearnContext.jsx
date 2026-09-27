import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { learningService } from '../services/learningService';
import { useAuth } from './AuthContext';

const LearnContext = createContext(null);

/**
 * Maps raw backend lesson data to the format expected by Learn UI components
 */
export const mapBackendLesson = (lesson, index = 0) => {
  if (!lesson) return null;
  const id = lesson.slug || lesson.id || lesson._id;
  const category = lesson.category || 'Getting Started';
  const categoryId =
    lesson.categoryId ||
    (typeof category === 'string' ? category.toLowerCase().replace(/\s+/g, '-') : 'getting-started');

  return {
    ...lesson,
    id,
    slug: lesson.slug || id,
    lessonNumber: lesson.lessonNumber || index + 1,
    category,
    categoryId,
    title: lesson.title || 'Untitled Lesson',
    subtitle: lesson.subtitle || '',
    description: lesson.description || '',
    difficulty: lesson.difficulty || 'Beginner',
    duration: lesson.duration || '5 min',
    highlightKeys: Array.isArray(lesson.highlightKeys) ? lesson.highlightKeys : [],
    hasPostureGuide: Boolean(lesson.hasPostureGuide),
    hasFingerGuide: Boolean(lesson.hasFingerGuide),
    hasInteractiveKeyboard: Boolean(lesson.hasInteractiveKeyboard),
    hasWpmVisualizer: Boolean(lesson.hasWpmVisualizer || lesson.slug === 'understanding-wpm-metrics'),
    sections: Array.isArray(lesson.sections) ? lesson.sections : [],
    drillText: lesson.drillText || '',
    quiz: lesson.quiz || null,
    practicePreset: lesson.practicePreset || { mode: 'words', words: 25 },
  };
};

export const LearnProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();

  // Backend lesson list state
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // User progress state
  const [completedLessons, setCompletedLessons] = useState(() => {
    try {
      const saved = localStorage.getItem('tara_completed_lessons');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [bookmarkedLessons, setBookmarkedLessons] = useState(() => {
    try {
      const saved = localStorage.getItem('tara_bookmarked_lessons');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [quizScores, setQuizScores] = useState(() => {
    try {
      const saved = localStorage.getItem('tara_quiz_scores');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [lastVisitedLesson, setLastVisitedLessonState] = useState(() => {
    return localStorage.getItem('tara_last_lesson') || '';
  });

  /**
   * Fetch lessons from GET /api/lessons when LearnProvider mounts
   */
  const fetchLessons = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const rawList = await learningService.getLessons();
      const mappedLessons = (rawList || []).map((l, idx) => mapBackendLesson(l, idx));
      setLessons(mappedLessons);

      // If user is authenticated, also fetch their authoritative progress
      if (isAuthenticated) {
        try {
          const progress = await learningService.getProgress();
          if (progress) {
            if (Array.isArray(progress.completedLessons)) {
              setCompletedLessons(progress.completedLessons);
            }
            if (Array.isArray(progress.bookmarkedLessons)) {
              setBookmarkedLessons(progress.bookmarkedLessons);
            }
            if (progress.quizScores) {
              const scores =
                progress.quizScores instanceof Map
                  ? Object.fromEntries(progress.quizScores)
                  : progress.quizScores;
              setQuizScores(scores);
            }
            if (progress.lastVisitedLesson) {
              setLastVisitedLessonState(progress.lastVisitedLesson);
            }
          }
        } catch (err) {
          console.warn('Progress fetch notice:', err.message);
        }
      }
    } catch (err) {
      console.error('Learning API fetch error (/api/lessons):', err);
      setError(err.message || 'Failed to load lessons');
      setLessons([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchLessons();
  }, [fetchLessons]);

  /**
   * Dynamic categories derived directly from API lessons
   */
  const categories = useMemo(() => {
    const map = new Map();
    lessons.forEach((l) => {
      if (l.categoryId && !map.has(l.categoryId)) {
        map.set(l.categoryId, {
          id: l.categoryId,
          name: l.category || l.categoryId,
        });
      }
    });
    return Array.from(map.values());
  }, [lessons]);

  /**
   * Guest fallback: Sync with localStorage ONLY when user is NOT authenticated
   */
  useEffect(() => {
    if (!isAuthenticated) {
      try {
        localStorage.setItem('tara_completed_lessons', JSON.stringify(completedLessons));
        localStorage.setItem('tara_bookmarked_lessons', JSON.stringify(bookmarkedLessons));
        localStorage.setItem('tara_quiz_scores', JSON.stringify(quizScores));
        if (lastVisitedLesson) {
          localStorage.setItem('tara_last_lesson', lastVisitedLesson);
        }
      } catch {}
    }
  }, [isAuthenticated, completedLessons, bookmarkedLessons, quizScores, lastVisitedLesson]);

  /**
   * When switching between guest and authenticated states, restore appropriate progress
   */
  useEffect(() => {
    if (!isAuthenticated) {
      try {
        const c = localStorage.getItem('tara_completed_lessons');
        setCompletedLessons(c ? JSON.parse(c) : []);
        const b = localStorage.getItem('tara_bookmarked_lessons');
        setBookmarkedLessons(b ? JSON.parse(b) : []);
        const q = localStorage.getItem('tara_quiz_scores');
        setQuizScores(q ? JSON.parse(q) : {});
        const last = localStorage.getItem('tara_last_lesson');
        if (last) setLastVisitedLessonState(last);
      } catch {
        setCompletedLessons([]);
        setBookmarkedLessons([]);
        setQuizScores({});
      }
    }
  }, [isAuthenticated]);

  // Calculations
  const totalLessons = lessons.length;
  const completedCount = completedLessons.length;
  const progressPercentage =
    totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  // Next recommended lesson is the first uncompleted one or the first lesson
  const recommendedLesson = useMemo(() => {
    if (!lessons.length) return null;
    const nextUncompleted = lessons.find(
      (l) => !completedLessons.includes(l.slug) && !completedLessons.includes(l.id)
    );
    return nextUncompleted || lessons[0] || null;
  }, [lessons, completedLessons]);

  /**
   * Mark lesson completed:
   * Calls POST /api/lessons/:slug/complete
   */
  const markLessonCompleted = async (lessonId, score = null) => {
    // Optimistic local update
    setCompletedLessons((prev) => (prev.includes(lessonId) ? prev : [...prev, lessonId]));
    if (score !== null) {
      setQuizScores((prev) => ({ ...prev, [lessonId]: score }));
    }
    setLastVisitedLessonState(lessonId);

    try {
      const res = await learningService.completeLesson(lessonId, { score });
      if (res?.progress) {
        if (Array.isArray(res.progress.completedLessons)) {
          setCompletedLessons(res.progress.completedLessons);
        }
        if (res.progress.quizScores) {
          const scores =
            res.progress.quizScores instanceof Map
              ? Object.fromEntries(res.progress.quizScores)
              : res.progress.quizScores;
          setQuizScores(scores);
        }
      }
      return res;
    } catch (err) {
      console.warn(`Failed to record completion for lesson ${lessonId}:`, err.message);
    }
  };

  /**
   * Toggle bookmark:
   * Calls PATCH /api/lessons/:slug/bookmark
   */
  const toggleBookmark = async (lessonId) => {
    setBookmarkedLessons((prev) =>
      prev.includes(lessonId) ? prev.filter((id) => id !== lessonId) : [...prev, lessonId]
    );

    try {
      const res = await learningService.toggleBookmark(lessonId);
      if (res?.bookmarkedLessons && Array.isArray(res.bookmarkedLessons)) {
        setBookmarkedLessons(res.bookmarkedLessons);
      }
      return res;
    } catch (err) {
      console.warn(`Failed to sync bookmark for lesson ${lessonId}:`, err.message);
    }
  };

  const isBookmarked = (lessonId) =>
    bookmarkedLessons.includes(lessonId);

  const isCompleted = (lessonId) =>
    completedLessons.includes(lessonId);

  /**
   * Set last visited lesson:
   * Calls PATCH /api/lessons/:slug/last-visited
   */
  const handleSetLastVisitedLesson = async (lessonId) => {
    if (!lessonId) return;
    setLastVisitedLessonState(lessonId);
    try {
      await learningService.updateLastVisited(lessonId);
    } catch (err) {
      console.warn(`Failed to sync last visited lesson ${lessonId}:`, err.message);
    }
  };

  /**
   * Reset progress:
   * Calls DELETE /api/lessons/progress
   */
  const resetProgress = async () => {
    setCompletedLessons([]);
    setQuizScores({});
    setBookmarkedLessons([]);
    setLastVisitedLessonState(lessons[0]?.slug || lessons[0]?.id || '');

    try {
      await learningService.resetProgress();
    } catch (err) {
      console.warn('Failed to reset progress on backend:', err.message);
    }
  };

  return (
    <LearnContext.Provider
      value={{
        lessons,
        categories,
        loading,
        error,
        completedLessons,
        bookmarkedLessons,
        quizScores,
        lastVisitedLesson,
        setLastVisitedLesson: handleSetLastVisitedLesson,
        totalLessons,
        completedCount,
        progressPercentage,
        recommendedLesson,
        markLessonCompleted,
        toggleBookmark,
        isBookmarked,
        isCompleted,
        resetProgress,
        refreshLessons: fetchLessons,
      }}
    >
      {children}
    </LearnContext.Provider>
  );
};

export const useLearn = () => {
  const context = useContext(LearnContext);
  if (!context) {
    throw new Error('useLearn must be used within a LearnProvider');
  }
  return context;
};

export default LearnContext;
