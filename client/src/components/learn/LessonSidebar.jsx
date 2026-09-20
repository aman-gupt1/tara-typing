import { Link } from 'react-router-dom';
import { CheckCircle2, Circle, BookOpen, Layers } from 'lucide-react';
import { LESSON_CATEGORIES, TYPING_LESSONS } from '../../data/typingLessons';
import { useLearn } from '../../context/LearnContext';

export const LessonSidebar = ({ currentLessonId = '' }) => {
  const { lessons: contextLessons, isCompleted, progressPercentage, completedCount, totalLessons } = useLearn();
  const lessons = contextLessons && contextLessons.length > 0 ? contextLessons : TYPING_LESSONS;

  return (
    <aside className="card-glass h-fit rounded-2xl p-4 sm:p-5 shadow-xl space-y-5 border border-border/60 hover:border-primary/40 hover:shadow-[0_12px_28px_-6px_rgba(59,130,246,0.15)] transition-all duration-300" aria-label="Course Curriculum Navigation">
      {/* Course Progress Summary */}
      <div className="border-b border-border/70 pb-3">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="font-semibold text-foreground flex items-center gap-1.5">
            <BookOpen size={14} className="text-primary" />
            <span>Course Progress</span>
          </span>
          <span className="font-bold font-display text-primary">{progressPercentage}%</span>
        </div>

        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-gradient-primary transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        <div className="mt-1.5 text-[11px] text-muted-foreground flex justify-between">
          <span>{completedCount} of {totalLessons} completed</span>
          <Link to="/learn" className="text-primary hover:underline font-medium">All Lessons</Link>
        </div>
      </div>

      {/* Categorized Lessons List */}
      <div className="space-y-4 max-h-[calc(100vh-280px)] overflow-y-auto pr-1">
        {LESSON_CATEGORIES.map((cat) => {
          const catLessons = lessons.filter((l) => l.categoryId === cat.id);
          if (catLessons.length === 0) return null;

          return (
            <div key={cat.id} className="space-y-1.5">
              <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground px-2">
                <Layers size={11} className="text-pink" />
                <span className="truncate">{cat.name}</span>
              </div>

              <div className="space-y-1">
                {catLessons.map((lesson) => {
                  const isActive = lesson.id === currentLessonId;
                  const completed = isCompleted(lesson.id);

                  return (
                    <Link
                      key={lesson.id}
                      to={`/learn/lesson/${lesson.id}`}
                      className={`group flex items-center justify-between gap-2 rounded-xl px-2.5 py-2 text-xs transition-all select-none ${
                        isActive
                          ? 'bg-primary/20 text-primary font-semibold border border-primary/40 shadow-sm'
                          : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        {completed ? (
                          <CheckCircle2 size={13} className="text-success shrink-0" />
                        ) : (
                          <Circle size={13} className="text-muted-foreground/50 shrink-0 group-hover:text-primary" />
                        )}
                        <span className="truncate">{lesson.title}</span>
                      </div>
                      <span className="text-[10px] text-muted-foreground shrink-0 font-mono">
                        {lesson.duration}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
};

export default LessonSidebar;
