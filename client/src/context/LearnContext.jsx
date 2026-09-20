import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { api } from '../services/api';
import { useAuth } from './AuthContext';

const LearnContext = createContext(null);

/**
 * Maps raw backend lesson data to the format expected by Learn UI components
 */
const mapBackendLesson = (lesson, index = 0) => {
  if (!lesson) return null;
  const id = lesson.slug || lesson.id || lesson._id;
  const category = lesson.category || 'Getting Started';
  const categoryId =
    lesson.categoryId ||
    (typeof category === 'string' ? category.toLowerCase().replace(/\s+/g, '-') : 'getting-started');

  return {
    ...lesson,
    id,
    slug: id,
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

  // User progress state (replaces localStorage for authenticated users)
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

  const [lastVisitedLesson, setLastVisitedLesson] = useState(() => {
    return localStorage.getItem('tara_last_lesson') || 'what-is-touch-typing';
  });

  /**
   * Fetch lessons from GET /api/lessons when LearnProvider mounts
   */
  const fetchLessons = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/lessons');
      let rawLessons = [];
      let backendProgress = null;

      if (Array.isArray(res)) {
        rawLessons = res;
      } else if (res && typeof res === 'object') {
        rawLessons = res.lessons || [];
        backendProgress = res.progress || res.userProgress || null;
      }

      const mappedLessons = (rawLessons || []).map((l, idx) => mapBackendLesson(l, idx));
      setLessons(mappedLessons);

      // If user is authenticated, also fetch their authoritative progress
      if (isAuthenticated) {
        try {
          const progRes = await api.get('/lessons/progress');
          if (progRes?.progress) {
            backendProgress = progRes.progress;
          }
        } catch {
          // Keep backendProgress if already supplied
        }
      }

      // If backend returned user progress for authenticated user
      if (isAuthenticated && backendProgress) {
        if (Array.isArray(backendProgress.completedLessons)) {
          setCompletedLessons(backendProgress.completedLessons);
        }
        if (Array.isArray(backendProgress.bookmarkedLessons)) {
          setBookmarkedLessons(backendProgress.bookmarkedLessons);
        }
        if (backendProgress.quizScores) {
          const scores =
            backendProgress.quizScores instanceof Map
              ? Object.fromEntries(backendProgress.quizScores)
              : backendProgress.quizScores;
          setQuizScores(scores);
        }
        if (backendProgress.lastVisitedLesson) {
          setLastVisitedLesson(backendProgress.lastVisitedLesson);
        }
      }
    } catch (err) {
      console.warn('Learning API fetch notice (/api/lessons):', err.message);
      setError(err.message || 'Failed to load lessons');
      setLessons([]); // Safe empty fallback
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchLessons();
  }, [fetchLessons]);

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
        if (last) setLastVisitedLesson(last);
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
    const nextUncompleted = lessons.find((l) => !completedLessons.includes(l.id));
    return nextUncompleted || lessons[0] || null;
  }, [lessons, completedLessons]);

  /**
   * Mark lesson completed:
   * - Call POST /api/lessons/:slug/complete for authenticated users
   * - Update React state from backend response
   * - Fallback to localStorage for guests
   */
  const markLessonCompleted = async (lessonId, score = null) => {
    // Optimistic local update so UI reflects immediately
    setCompletedLessons((prev) => (prev.includes(lessonId) ? prev : [...prev, lessonId]));
    if (score !== null) {
      setQuizScores((prev) => ({ ...prev, [lessonId]: score }));
    }
    setLastVisitedLesson(lessonId);

    if (isAuthenticated) {
      try {
        const payload = {
          score: score !== null ? Number(score) : undefined,
          completedAt: new Date().toISOString(),
        };
        const res = await api.post(`/lessons/${lessonId}/complete`, payload);

        // Update state from backend response if progress is returned
        const progress = res?.progress || res?.userProgress || res;
        if (progress && typeof progress === 'object') {
          if (Array.isArray(progress.completedLessons)) {
            setCompletedLessons(progress.completedLessons);
          }
          if (progress.quizScores) {
            const scores =
              progress.quizScores instanceof Map
                ? Object.fromEntries(progress.quizScores)
                : progress.quizScores;
            setQuizScores(scores);
          }
        }
        return res;
      } catch (err) {
        console.warn(`Failed to record completion for lesson ${lessonId} on backend:`, err.message);
      }
    }
  };

  /**
   * Toggle bookmark
   */
  const toggleBookmark = async (lessonId) => {
    setBookmarkedLessons((prev) =>
      prev.includes(lessonId) ? prev.filter((id) => id !== lessonId) : [...prev, lessonId]
    );

    if (isAuthenticated) {
      try {
        const res = await api.patch(`/lessons/${lessonId}/bookmark`);
        if (res?.bookmarkedLessons && Array.isArray(res.bookmarkedLessons)) {
          setBookmarkedLessons(res.bookmarkedLessons);
        }
      } catch (err) {
        console.warn(`Failed to sync bookmark for lesson ${lessonId}:`, err.message);
      }
    }
  };

  const isBookmarked = (lessonId) => bookmarkedLessons.includes(lessonId);
  const isCompleted = (lessonId) => completedLessons.includes(lessonId);

  /**
   * Set last visited lesson
   */
  const handleSetLastVisitedLesson = async (lessonId) => {
    setLastVisitedLesson(lessonId);
    if (!isAuthenticated) {
      try {
        localStorage.setItem('tara_last_lesson', lessonId);
      } catch {}
    } else {
      try {
        await api.patch(`/lessons/${lessonId}/last-visited`);
      } catch (err) {
        console.warn(`Failed to sync last visited lesson ${lessonId}:`, err.message);
      }
    }
  };

  /**
   * Reset progress:
   * Clears local UI state. For guests, clears localStorage.
   * For authenticated users, calls DELETE /api/lessons/progress.
   */
  const resetProgress = async () => {
    setCompletedLessons([]);
    setQuizScores({});
    setBookmarkedLessons([]);
    setLastVisitedLesson(lessons[0]?.id || 'what-is-touch-typing');

    if (!isAuthenticated) {
      try {
        localStorage.removeItem('tara_completed_lessons');
        localStorage.removeItem('tara_bookmarked_lessons');
        localStorage.removeItem('tara_quiz_scores');
        localStorage.removeItem('tara_last_lesson');
      } catch {}
    } else {
      try {
        await api.delete('/lessons/progress');
      } catch (err) {
        console.warn('Failed to reset progress on backend:', err.message);
      }
    }
  };

  return (
    <LearnContext.Provider
      value={{
        lessons,
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
