import { Link } from 'react-router-dom';
import { Clock, CheckCircle2, Bookmark, BookmarkCheck, ArrowRight, Zap } from 'lucide-react';
import { useLearn } from '../../context/LearnContext';

export const LessonCard = ({ lesson }) => {
  const { isCompleted, isBookmarked, toggleBookmark } = useLearn();

  const completed = isCompleted(lesson.id);
  const bookmarked = isBookmarked(lesson.id);

  const difficultyColors = {
    Beginner: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400',
    Intermediate: 'border-amber-500/30 bg-amber-500/10 text-amber-400',
    Advanced: 'border-pink/30 bg-pink/10 text-pink',
  }[lesson.difficulty] || 'border-primary/30 bg-primary/10 text-primary';

  const difficultyHover = {
    Beginner: {
      border: 'hover:border-emerald-500/50',
      shadow: 'hover:shadow-[0_12px_28px_-6px_rgba(16,185,129,0.25)]',
      bg: 'hover:bg-gradient-to-b hover:from-emerald-500/[0.06] hover:to-transparent',
      titleHover: 'group-hover:text-emerald-400',
    },
    Intermediate: {
      border: 'hover:border-amber-500/50',
      shadow: 'hover:shadow-[0_12px_28px_-6px_rgba(245,158,11,0.25)]',
      bg: 'hover:bg-gradient-to-b hover:from-amber-500/[0.06] hover:to-transparent',
      titleHover: 'group-hover:text-amber-400',
    },
    Advanced: {
      border: 'hover:border-rose-500/50',
      shadow: 'hover:shadow-[0_12px_28px_-6px_rgba(244,63,94,0.25)]',
      bg: 'hover:bg-gradient-to-b hover:from-rose-500/[0.06] hover:to-transparent',
      titleHover: 'group-hover:text-rose-400',
    },
  }[lesson.difficulty] || {
    border: 'hover:border-primary/50',
    shadow: 'hover:shadow-[0_12px_28px_-6px_rgba(59,130,246,0.25)]',
    bg: 'hover:bg-gradient-to-b hover:from-primary/[0.06] hover:to-transparent',
    titleHover: 'group-hover:text-primary',
  };

  const formattedNum = String(lesson.lessonNumber).padStart(2, '0');

  return (
    <div
      className={`card-glass group flex flex-col justify-between rounded-2xl p-5 sm:p-6 transition-all duration-300 hover:-translate-y-1.5 shadow-lg border border-border/80 ${difficultyHover.border} ${difficultyHover.shadow} ${difficultyHover.bg} ${
        completed ? 'border-success/40 bg-success/[0.02]' : ''
      }`}
    >
      <div>
        {/* Top bar: Lesson number & Bookmark */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md border border-primary/20">
              LESSON {formattedNum}
            </span>
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${difficultyColors}`}>
              {lesson.difficulty}
            </span>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              toggleBookmark(lesson.id);
            }}
            aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark lesson'}
            className="text-muted-foreground hover:text-pink transition-colors p-1"
          >
            {bookmarked ? <BookmarkCheck size={16} className="text-pink" /> : <Bookmark size={16} />}
          </button>
        </div>

        {/* Title and description */}
        <h3 className={`font-display text-lg font-bold text-foreground mt-3 transition-colors ${difficultyHover.titleHover}`}>
          {lesson.title}
        </h3>
        <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2 leading-relaxed">
          {lesson.description}
        </p>
      </div>

      {/* Footer metadata & CTA */}
      <div className="mt-5 pt-4 border-t border-border/60 flex items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Clock size={13} />
          <span>{lesson.duration}</span>
        </div>

        <Link
          to={`/learn/lesson/${lesson.id}`}
          className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all select-none ${
            completed
              ? 'border border-success/40 bg-success/15 text-success hover:bg-success/25'
              : 'bg-gradient-primary glow-primary text-primary-foreground hover:scale-[1.02]'
          }`}
        >
          {completed ? (
            <>
              <CheckCircle2 size={13} />
              <span>Review</span>
            </>
          ) : (
            <>
              <span>Start</span>
              <ArrowRight size={13} />
            </>
          )}
        </Link>
      </div>
    </div>
  );
};

export default LessonCard;
