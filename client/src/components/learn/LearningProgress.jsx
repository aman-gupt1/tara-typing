import { Link } from 'react-router-dom';
import { Award, Flame, Play, CheckCircle2, BookOpen } from 'lucide-react';
import { useLearn } from '../../context/LearnContext';

export const LearningProgress = () => {
  const { progressPercentage, completedCount, totalLessons, recommendedLesson } = useLearn();

  return (
    <div className="card-glass group rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden border border-border/80 transition-all duration-300 hover:border-blue-500/50 hover:shadow-[0_16px_40px_-10px_rgba(59,130,246,0.22)] cursor-default" aria-label="Learning Progress Overview">
      {/* Background ambient decorative glow */}
      <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/20 blur-3xl group-hover:bg-primary/30 transition-colors duration-500" />

      <div className="grid gap-6 md:grid-cols-[1fr_auto] items-center">
        {/* Left: Progress info & bar */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <BookOpen size={13} />
              <span>Typing Mastery Course</span>
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-pink/30 bg-pink/10 px-2.5 py-0.5 text-xs font-semibold text-pink">
              <Flame size={13} />
              <span>Active Track</span>
            </span>
          </div>

          <div className="flex items-baseline gap-3">
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-foreground group-hover:text-blue-400 transition-colors">
              {progressPercentage}%
            </h2>
            <span className="text-sm text-muted-foreground font-medium">
              ({completedCount} of {totalLessons} lessons completed)
            </span>
          </div>

          {/* Progress Bar */}
          <div className="h-3 w-full max-w-xl overflow-hidden rounded-full bg-muted/80">
            <div
              className="h-full rounded-full bg-gradient-primary shadow-sm transition-all duration-500 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Right: Recommended next lesson action */}
        {recommendedLesson && (
          <div className="rounded-2xl border border-primary/30 bg-primary/5 p-4 sm:p-5 flex flex-col justify-between max-w-sm space-y-3 transition-all duration-300 hover:border-primary/60 hover:bg-primary/10 hover:shadow-[0_8px_20px_-4px_rgba(59,130,246,0.25)]">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-pink">
                {completedCount === 0 ? 'Start With Lesson 1' : 'Recommended Next'}
              </span>
              <h3 className="font-display text-base font-bold text-foreground truncate mt-0.5">
                {recommendedLesson.title}
              </h3>
              <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                {recommendedLesson.subtitle || recommendedLesson.description}
              </p>
            </div>

            <Link
              to={`/learn/lesson/${recommendedLesson.id}`}
              className="bg-gradient-primary glow-primary flex items-center justify-center gap-2 rounded-xl py-2.5 px-4 text-xs sm:text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.02] select-none"
            >
              <Play size={14} />
              <span>{completedCount === 0 ? 'Start Course' : 'Continue Learning'}</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default LearningProgress;
