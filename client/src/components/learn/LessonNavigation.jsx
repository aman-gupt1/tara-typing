import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, CheckCircle2, Bookmark, BookmarkCheck, Play } from 'lucide-react';
import { useLearn } from '../../context/LearnContext';
import { useTypingContext } from '../../context/TypingContext';

export const LessonNavigation = ({
  currentLesson,
  prevLesson,
  nextLesson,
  onComplete,
}) => {
  const { isBookmarked, toggleBookmark, isCompleted } = useLearn();
  const { setTestConfig } = useTypingContext();
  const navigate = useNavigate();

  const completed = isCompleted(currentLesson.id);
  const bookmarked = isBookmarked(currentLesson.id);

  const handleSandboxPractice = () => {
    if (currentLesson.practicePreset) {
      setTestConfig((prev) => ({
        ...prev,
        ...currentLesson.practicePreset,
      }));
    }
    navigate('/practice');
  };

  return (
    <div className="card-glass rounded-2xl p-4 sm:p-5 shadow-xl space-y-4 border border-border/60 hover:border-primary/40 hover:shadow-[0_12px_28px_-6px_rgba(59,130,246,0.15)] transition-all duration-300">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/70 pb-3">
        {/* Bookmark & Practice Sandbox */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => toggleBookmark(currentLesson.id)}
            className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-medium transition-colors select-none ${
              bookmarked
                ? 'border-pink/40 bg-pink/15 text-pink font-semibold'
                : 'border-border bg-background/60 text-muted-foreground hover:bg-accent hover:text-foreground'
            }`}
          >
            {bookmarked ? <BookmarkCheck size={14} /> : <Bookmark size={14} />}
            <span>{bookmarked ? 'Saved Lesson' : 'Bookmark'}</span>
          </button>

          <button
            type="button"
            onClick={handleSandboxPractice}
            className="flex items-center gap-1.5 rounded-xl border border-primary/40 bg-primary/10 px-3 py-2 text-xs font-semibold text-primary hover:bg-primary/20 transition-colors select-none"
          >
            <Play size={13} />
            <span>Practice in Sandbox</span>
          </button>
        </div>

        {/* Complete Lesson Button */}
        <button
          type="button"
          onClick={onComplete}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-semibold transition-all select-none ${
            completed
              ? 'border border-success/40 bg-success/15 text-success'
              : 'bg-gradient-primary glow-primary text-primary-foreground hover:scale-[1.02]'
          }`}
        >
          <CheckCircle2 size={16} />
          <span>{completed ? 'Completed ✓' : 'Mark Complete'}</span>
        </button>
      </div>

      {/* Prev / Next Lesson Navigation Links */}
      <div className="flex items-center justify-between gap-3">
        {prevLesson ? (
          <Link
            to={`/learn/lesson/${prevLesson.id}`}
            className="flex items-center gap-1.5 rounded-xl border border-border bg-card px-3.5 py-2 text-xs font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors select-none"
          >
            <ChevronLeft size={16} />
            <div className="text-left hidden sm:block">
              <span className="block text-[10px] text-muted-foreground">Previous</span>
              <span className="block truncate font-semibold text-foreground max-w-[140px]">{prevLesson.title}</span>
            </div>
            <span className="sm:hidden">Previous</span>
          </Link>
        ) : (
          <div />
        )}

        {nextLesson ? (
          <Link
            to={`/learn/lesson/${nextLesson.id}`}
            className="flex items-center gap-1.5 rounded-xl border border-border bg-card px-3.5 py-2 text-xs font-medium text-foreground hover:bg-accent transition-colors select-none ml-auto"
          >
            <div className="text-right hidden sm:block">
              <span className="block text-[10px] text-muted-foreground">Next Lesson</span>
              <span className="block truncate font-semibold text-foreground max-w-[140px]">{nextLesson.title}</span>
            </div>
            <span className="sm:hidden">Next Lesson</span>
            <ChevronRight size={16} />
          </Link>
        ) : (
          <Link
            to="/learn"
            className="bg-gradient-primary glow-primary flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold text-primary-foreground select-none ml-auto"
          >
            <span>Back to Lessons</span>
            <ChevronRight size={16} />
          </Link>
        )}
      </div>
    </div>
  );
};

export default LessonNavigation;
