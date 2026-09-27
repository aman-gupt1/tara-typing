import { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Clock,
  CheckCircle2,
  Bookmark,
  BookmarkCheck,
  AlertCircle,
  Lightbulb,
  Sparkles,
  ArrowLeft,
  XCircle,
} from 'lucide-react';
import { toast } from 'react-toastify';
import confetti from 'canvas-confetti';
import SEO from '../components/common/SEO';
import { useLearn, mapBackendLesson } from '../context/LearnContext';
import { learningService } from '../services/learningService';
import InteractiveKeyboard from '../components/learn/InteractiveKeyboard';
import FingerGuide from '../components/learn/FingerGuide';
import PostureGuide from '../components/learn/PostureGuide';
import WpmVisualizer from '../components/learn/WpmVisualizer';
import InLessonPractice from '../components/learn/InLessonPractice';
import QuizCard from '../components/learn/QuizCard';
import LessonSidebar from '../components/learn/LessonSidebar';
import LessonNavigation from '../components/learn/LessonNavigation';

function LessonDetailSkeleton() {
  return (
    <div className="w-full flex-1 bg-background text-foreground animate-pulse">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        <div className="flex justify-between items-center">
          <div className="h-4 w-32 bg-muted/60 rounded-md" />
          <div className="h-4 w-28 bg-muted/60 rounded-md" />
        </div>
        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          <div className="space-y-6">
            <div className="card-glass rounded-3xl p-6 sm:p-8 space-y-4 border border-border/60">
              <div className="flex gap-2">
                <div className="h-5 w-24 bg-muted/60 rounded-md" />
                <div className="h-5 w-28 bg-muted/40 rounded-md" />
              </div>
              <div className="h-8 w-3/4 bg-muted/60 rounded-lg" />
              <div className="h-4 w-full bg-muted/40 rounded-md" />
            </div>
            <div className="card-glass rounded-2xl p-6 sm:p-8 space-y-4 border border-border/60">
              <div className="h-6 w-1/2 bg-muted/60 rounded-md" />
              <div className="h-4 w-full bg-muted/40 rounded-md" />
              <div className="h-4 w-5/6 bg-muted/40 rounded-md" />
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="card-glass rounded-2xl p-5 space-y-4 border border-border/60">
              <div className="h-5 w-32 bg-muted/60 rounded-md" />
              <div className="h-2 w-full bg-muted/40 rounded-full" />
              <div className="space-y-2 pt-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-8 w-full bg-muted/30 rounded-xl" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const LessonDetail = () => {
  const { lessonId, slug } = useParams();
  const currentLessonId = slug || lessonId;

  const {
    lessons: contextLessons,
    totalLessons,
    markLessonCompleted,
    isCompleted,
    isBookmarked,
    toggleBookmark,
    setLastVisitedLesson,
  } = useLearn();

  const [lessonData, setLessonData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCompletionBanner, setShowCompletionBanner] = useState(false);

  // Fetch full single lesson from GET /api/lessons/:slug
  useEffect(() => {
    let isMounted = true;
    if (!currentLessonId) return;

    const fetchDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        const raw = await learningService.getLessonBySlug(currentLessonId);
        if (isMounted) {
          if (raw) {
            setLessonData(mapBackendLesson(raw));
          } else {
            // Check contextLessons if available
            const cached = (contextLessons || []).find(
              (l) => l.slug === currentLessonId || l.id === currentLessonId
            );
            if (cached) {
              setLessonData(cached);
            } else {
              setLessonData(null);
            }
          }
        }
      } catch (err) {
        if (isMounted) {
          console.warn(`Error loading lesson ${currentLessonId}:`, err);
          const cached = (contextLessons || []).find(
            (l) => l.slug === currentLessonId || l.id === currentLessonId
          );
          if (cached) {
            setLessonData(cached);
          } else {
            setError(err.message || 'Failed to load lesson');
            setLessonData(null);
          }
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchDetail();
    setLastVisitedLesson(currentLessonId);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    return () => {
      isMounted = false;
    };
  }, [currentLessonId, contextLessons, setLastVisitedLesson]);

  // Compute prev/next from contextLessons
  const lessonIndex = useMemo(() => {
    return (contextLessons || []).findIndex(
      (l) => l.slug === currentLessonId || l.id === currentLessonId
    );
  }, [contextLessons, currentLessonId]);

  const prevLesson = lessonIndex > 0 ? contextLessons[lessonIndex - 1] : null;
  const nextLesson =
    lessonIndex !== -1 && lessonIndex < (contextLessons || []).length - 1
      ? contextLessons[lessonIndex + 1]
      : null;

  if (loading) {
    return <LessonDetailSkeleton />;
  }

  if (!lessonData || error) {
    return (
      <div className="w-full flex-1 bg-background text-foreground flex items-center justify-center p-4">
        <div className="card-glass max-w-md rounded-2xl p-8 text-center space-y-4">
          <AlertCircle className="mx-auto text-destructive" size={36} />
          <h1 className="font-display text-2xl font-bold">Lesson Not Found</h1>
          <p className="text-xs text-muted-foreground">
            {error || 'The requested typing lesson could not be found in our database.'}
          </p>
          <Link
            to="/learn"
            className="bg-gradient-primary glow-primary inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-semibold text-primary-foreground"
          >
            <ArrowLeft size={14} />
            <span>Return to Course Lessons</span>
          </Link>
        </div>
      </div>
    );
  }

  const lesson = lessonData;
  const targetId = lesson.slug || lesson.id;
  const completed = isCompleted(targetId);
  const bookmarked = isBookmarked(targetId);
  const totalCount = totalLessons || (contextLessons ? contextLessons.length : 0);

  const handleComplete = (score = 100) => {
    markLessonCompleted(targetId, score);
    setShowCompletionBanner(true);
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
    toast.success(`Lesson Completed: ${lesson.title}! 🎉`);
  };

  const handleDrillComplete = (wpm) => {
    toast.info(`Great practice drill! You hit ${wpm} WPM.`);
  };

  const handleQuizSubmit = (score) => {
    handleComplete(score);
  };

  return (
    <div className="w-full flex-1 bg-background text-foreground transition-colors duration-200">
      <SEO
        title={`${lesson.title} — Learn Touch Typing | Tara Typing`}
        description={`${lesson.description} Study typing fundamentals, finger placement, and accuracy with Tara Typing.`}
      />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Top Breadcrumbs */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            to="/learn"
            className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Back to All Lessons</span>
          </Link>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="font-mono font-semibold text-primary">
              Lesson {lesson.lessonNumber} of {totalCount}
            </span>
          </div>
        </div>

        {/* 2-Column Layout: Main Content + Sidebar */}
        <div className="grid gap-8 lg:grid-cols-[1fr_300px] xl:grid-cols-[1fr_320px]">
          {/* Main Article & Interactive Studies */}
          <main className="space-y-8 min-w-0">
            {/* Lesson Header Banner */}
            <div className="card-glass rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden space-y-4 border border-border/60 hover:border-primary/40 hover:shadow-[0_12px_32px_-8px_rgba(59,130,246,0.18)] transition-all duration-300">
              <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/20 blur-3xl" />

              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-md border border-primary/20">
                    LESSON {String(lesson.lessonNumber).padStart(2, '0')}
                  </span>
                  <span className="text-xs font-medium text-muted-foreground">• {lesson.category}</span>
                </div>

                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock size={13} />
                    <span>{lesson.duration}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => toggleBookmark(targetId)}
                    className="flex items-center gap-1 text-xs text-muted-foreground hover:text-pink transition-colors"
                  >
                    {bookmarked ? <BookmarkCheck size={16} className="text-pink" /> : <Bookmark size={16} />}
                    <span className="hidden sm:inline">{bookmarked ? 'Saved' : 'Bookmark'}</span>
                  </button>
                </div>
              </div>

              <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
                {lesson.title}
              </h1>

              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                {lesson.subtitle || lesson.description}
              </p>

              {completed && (
                <div className="inline-flex items-center gap-1.5 rounded-full border border-success/40 bg-success/15 px-3 py-1 text-xs font-semibold text-success">
                  <CheckCircle2 size={14} />
                  <span>You have completed this lesson</span>
                </div>
              )}
            </div>

            {/* Reading Sections */}
            <div className="space-y-6">
              {(lesson.sections || []).map((sec, idx) => (
                <article
                  key={idx}
                  className="card-glass rounded-2xl p-6 sm:p-8 shadow-lg space-y-4 border border-border/60 hover:border-border hover:shadow-[0_8px_24px_-4px_rgba(0,0,0,0.2)] hover:-translate-y-0.5 transition-all duration-300"
                >
                  <h2 className="font-display text-xl sm:text-2xl font-bold text-foreground">
                    {sec.heading}
                  </h2>

                  <div className="prose prose-sm sm:prose max-w-none text-foreground/90 leading-relaxed space-y-3 whitespace-pre-line text-sm sm:text-base">
                    {sec.content}
                  </div>

                  {/* Callout Box */}
                  {sec.callout && sec.callout.text && (
                    <div
                      className={`rounded-xl border p-4 text-xs sm:text-sm flex items-start gap-3 ${
                        sec.callout.type === 'tip'
                          ? 'border-primary/40 bg-primary/10 text-foreground'
                          : sec.callout.type === 'warning'
                          ? 'border-warning/40 bg-warning/10 text-foreground'
                          : 'border-pink/40 bg-pink/10 text-foreground'
                      }`}
                    >
                      <Lightbulb size={18} className="shrink-0 text-primary mt-0.5" />
                      <div className="leading-relaxed">
                        <strong className="block font-semibold mb-0.5 capitalize">{sec.callout.type || 'Note'}</strong>
                        <span>{sec.callout.text}</span>
                      </div>
                    </div>
                  )}

                  {/* Common Mistakes List */}
                  {sec.mistakes && sec.mistakes.length > 0 && (
                    <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 space-y-2 text-xs sm:text-sm">
                      <h4 className="font-semibold text-destructive flex items-center gap-1.5">
                        <XCircle size={15} /> Common Pitfalls to Avoid
                      </h4>
                      <ul className="space-y-1.5 pl-2 text-foreground/90">
                        {sec.mistakes.map((m, mIdx) => (
                          <li key={mIdx} className="flex items-start gap-2">
                            <span className="text-destructive font-bold">•</span>
                            <span>{m}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </article>
              ))}
            </div>

            {/* Visual Interactive Tools */}
            {lesson.highlightKeys && lesson.highlightKeys.length > 0 && (
              <section aria-label="Interactive Keyboard Visualization">
                <InteractiveKeyboard
                  highlightKeys={lesson.highlightKeys}
                  title={`Keyboard Visualization for ${lesson.title}`}
                />
              </section>
            )}

            {lesson.hasFingerGuide && (
              <section aria-label="Finger Mapping Guide">
                <FingerGuide />
              </section>
            )}

            {lesson.hasPostureGuide && (
              <section aria-label="Ergonomics and Posture">
                <PostureGuide />
              </section>
            )}

            {lesson.hasWpmVisualizer && (
              <section aria-label="WPM Metrics Explained">
                <WpmVisualizer />
              </section>
            )}

            {/* Embedded Live Practice Drill */}
            {lesson.drillText && (
              <section aria-label="In-Lesson Practice Drill">
                <InLessonPractice
                  drillText={lesson.drillText}
                  onDrillComplete={handleDrillComplete}
                />
              </section>
            )}

            {/* Mini Quiz Knowledge Check */}
            {lesson.quiz && (
              <section aria-label="Lesson Quiz">
                <QuizCard quiz={lesson.quiz} onQuizSubmit={handleQuizSubmit} />
              </section>
            )}

            {/* Completion Banner */}
            {showCompletionBanner && (
              <div className="rounded-2xl border border-success/50 bg-success/15 p-6 text-center space-y-2 animate-in fade-in zoom-in-95">
                <Sparkles className="mx-auto text-success" size={28} />
                <h3 className="font-display text-xl font-bold text-success">Lesson Mastered!</h3>
                <p className="text-xs text-foreground/80 max-w-md mx-auto">
                  Your progress has been recorded. Continue to the next topic or drill in the practice sandbox.
                </p>
              </div>
            )}

            {/* Bottom Lesson Navigation */}
            <LessonNavigation
              currentLesson={lesson}
              prevLesson={prevLesson}
              nextLesson={nextLesson}
              onComplete={() => handleComplete(100)}
            />
          </main>

          {/* Right Sticky Sidebar */}
          <div className="hidden lg:block">
            <div className="sticky top-24">
              <LessonSidebar currentLessonId={targetId} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonDetail;
