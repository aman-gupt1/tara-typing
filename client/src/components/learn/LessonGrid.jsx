import { useState, useMemo } from 'react';
import { Search, Filter, Layers, CheckCircle2, BookmarkCheck, BookOpen } from 'lucide-react';
import { LESSON_CATEGORIES, TYPING_LESSONS } from '../../data/typingLessons';
import LessonCard from './LessonCard';
import { useLearn } from '../../context/LearnContext';

export const LessonGrid = () => {
  const { lessons: contextLessons, isCompleted, isBookmarked } = useLearn();
  const lessons = contextLessons && contextLessons.length > 0 ? contextLessons : TYPING_LESSONS;
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedFilter, setSelectedFilter] = useState('all'); // all | beginner | intermediate | advanced | completed | saved

  const filteredLessons = useMemo(() => {
    return lessons.filter((lesson) => {
      // Category match
      if (selectedCategory !== 'all' && lesson.categoryId !== selectedCategory) {
        return false;
      }

      // Filter match
      if (selectedFilter === 'beginner' && lesson.difficulty !== 'Beginner') return false;
      if (selectedFilter === 'intermediate' && lesson.difficulty !== 'Intermediate') return false;
      if (selectedFilter === 'advanced' && lesson.difficulty !== 'Advanced') return false;
      if (selectedFilter === 'completed' && !isCompleted(lesson.id)) return false;
      if (selectedFilter === 'saved' && !isBookmarked(lesson.id)) return false;

      // Search match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = lesson.title.toLowerCase().includes(q);
        const matchesSubtitle = (lesson.subtitle || '').toLowerCase().includes(q);
        const matchesDesc = lesson.description.toLowerCase().includes(q);
        const matchesCat = lesson.category.toLowerCase().includes(q);
        return matchesTitle || matchesSubtitle || matchesDesc || matchesCat;
      }

      return true;
    });
  }, [searchQuery, selectedCategory, selectedFilter, isCompleted, isBookmarked]);

  return (
    <div className="space-y-6" id="all-lessons-section">
      {/* Controls Bar: Search & Filters */}
      <div className="card-glass rounded-2xl p-4 sm:p-5 shadow-xl space-y-4 border border-border dark:border-[#1E293B] dark:bg-[#0E1626]">
        <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
          {/* Search Input */}
          <div className="relative">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search lessons by keyword (e.g. Home Row, Posture, WPM, Shift)..."
              className="w-full rounded-xl border border-border dark:border-[#1E293B] bg-slate-100 dark:bg-[#0B1120] py-2.5 pl-10 pr-9 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:border-primary dark:focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-primary/20 dark:focus:ring-blue-500/20 transition-colors caret-primary"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 text-xs p-1 rounded-md transition-colors"
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          {/* Quick Filter Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {[
              { id: 'all', label: 'All Lessons' },
              { id: 'beginner', label: 'Beginner' },
              { id: 'intermediate', label: 'Intermediate' },
              { id: 'advanced', label: 'Advanced' },
              { id: 'completed', label: 'Completed' },
              { id: 'saved', label: 'Saved' },
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setSelectedFilter(f.id)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap select-none ${
                  selectedFilter === f.id
                    ? 'bg-primary text-primary-foreground font-semibold shadow-sm'
                    : 'bg-slate-100 dark:bg-[#0B1120] border border-border dark:border-[#1E293B] text-muted-foreground hover:bg-slate-200 dark:hover:bg-[#151E32] hover:text-foreground'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Category Selector Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-2 border-t border-border/60">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`rounded-lg px-3 py-1 text-xs font-semibold whitespace-nowrap transition-colors select-none ${
              selectedCategory === 'all'
                ? 'bg-gradient-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground hover:bg-accent'
            }`}
          >
            All Categories ({TYPING_LESSONS.length})
          </button>

          {LESSON_CATEGORIES.map((cat) => {
            const count = TYPING_LESSONS.filter((l) => l.categoryId === cat.id).length;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`rounded-lg px-3 py-1 text-xs font-medium whitespace-nowrap transition-colors select-none ${
                  selectedCategory === cat.id
                    ? 'bg-gradient-primary text-primary-foreground font-semibold'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                }`}
              >
                {cat.name} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Lesson Cards Grid */}
      {filteredLessons.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredLessons.map((lesson, idx) => (
            <div
              key={lesson.id}
              className={idx < 6 ? `animate-page-enter stagger-${Math.min(idx, 4)}` : ''}
            >
              <LessonCard lesson={lesson} />
            </div>
          ))}
        </div>
      ) : (
        <div className="card-glass rounded-2xl p-12 text-center space-y-3">
          <BookOpen className="mx-auto text-muted-foreground" size={32} />
          <h3 className="font-display text-lg font-bold text-foreground">No lessons found</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            Try adjusting your search terms or filter selection to explore more topics.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setSelectedFilter('all');
            }}
            className="mt-2 inline-flex rounded-xl bg-accent px-4 py-2 text-xs font-semibold text-foreground hover:bg-accent/80"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default LessonGrid;
