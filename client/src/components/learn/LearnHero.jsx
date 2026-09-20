import { Link } from 'react-router-dom';
import { Sparkles, GraduationCap, Play, Compass, CheckCircle2 } from 'lucide-react';
import { useLearn } from '../../context/LearnContext';

export const LearnHero = ({ onScrollToLessons }) => {
  const { completedCount, totalLessons, recommendedLesson } = useLearn();

  return (
    <section className="relative overflow-hidden py-6 sm:py-10 text-center sm:text-left">
      <div className="grid items-center gap-8 lg:grid-cols-[1.3fr_1fr]">
        {/* Left text */}
        <div className="space-y-5">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
            <GraduationCap size={15} />
            <span>Interactive Typing Academy</span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.1]">
            Master Touch Typing.
            <br />
            <span className="text-gradient">Step by Step.</span>
          </h1>

          <p className="max-w-xl text-sm sm:text-base text-muted-foreground leading-relaxed">
            Build bulletproof typing posture, eliminate peeking, master the home row, and double your WPM through structured visual lessons, interactive drills, and quizzes.
          </p>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-2">
            <Link
              to={recommendedLesson ? `/learn/lesson/${recommendedLesson.id}` : '/learn/lesson/what-is-touch-typing'}
              className="bg-gradient-primary glow-primary flex items-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.02] select-none"
            >
              <Play size={16} />
              <span>{completedCount > 0 ? 'Continue Learning' : 'Start Learning Free'}</span>
            </Link>

            <button
              type="button"
              onClick={onScrollToLessons}
              className="flex items-center gap-2 rounded-xl border border-border bg-card px-6 py-3.5 text-sm font-semibold text-foreground hover:bg-accent transition-colors select-none"
            >
              <Compass size={16} />
              <span>Explore All Lessons</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-5 pt-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-success" />
              <span>18 Structured Lessons</span>
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-success" />
              <span>Interactive Visual Keyboard</span>
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-success" />
              <span>Instant Knowledge Checks</span>
            </span>
          </div>
        </div>

        {/* Right card visual */}
        <div className="relative mx-auto w-full max-w-md hidden lg:block" aria-hidden="true">
          <div className="card-glass group rounded-3xl p-6 shadow-2xl border border-primary/20 space-y-4 transition-all duration-300 hover:border-purple-500/50 hover:shadow-[0_16px_40px_-10px_rgba(168,85,247,0.25)] hover:bg-gradient-to-b hover:from-purple-500/[0.04] hover:to-transparent cursor-default">
            <div className="flex items-center justify-between border-b border-border/70 pb-3">
              <span className="font-display font-bold text-sm text-foreground group-hover:text-purple-300 transition-colors">Core Touch Typing Habits</span>
              <Sparkles size={16} className="text-pink group-hover:rotate-12 group-hover:scale-110 transition-transform duration-300" />
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between rounded-xl bg-background/60 p-3 border border-border hover:border-emerald-500/40 hover:bg-background/90 transition-all duration-200">
                <span className="text-muted-foreground">1. Keep eyes on screen</span>
                <span className="font-semibold text-success">Muscle Memory</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-background/60 p-3 border border-border hover:border-blue-500/40 hover:bg-background/90 transition-all duration-200">
                <span className="text-muted-foreground">2. Anchor on F and J</span>
                <span className="font-semibold text-primary">Tactile Ridges</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-background/60 p-3 border border-border hover:border-pink/40 hover:bg-background/90 transition-all duration-200">
                <span className="text-muted-foreground">3. Accuracy before speed</span>
                <span className="font-semibold text-pink">Zero Backspacing</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-background/60 p-3 border border-border hover:border-purple-500/40 hover:bg-background/90 transition-all duration-200">
                <span className="text-muted-foreground">4. Opposite Shift key</span>
                <span className="font-semibold text-purple-400">Two-Hand Balance</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LearnHero;
