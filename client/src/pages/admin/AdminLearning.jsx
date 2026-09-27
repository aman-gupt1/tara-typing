import React, { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  Layers,
  Plus,
  Edit,
  Globe,
  EyeOff,
  FileText,
  CheckCircle2,
  Clock,
  Zap,
  Target,
  Users,
  Search,
  ChevronDown,
  Check,
  Filter,
  RotateCcw,
  LayoutGrid,
  List,
  Eye,
  Trash2,
  X,
  Download,
  Sparkles,
  Award,
  ArrowRight,
  ShieldCheck,
  Key,
  HelpCircle,
  Hash,
} from 'lucide-react';
import { toast } from 'react-toastify';
import StatCard from '../../components/admin/StatCard';
import StatusBadge from '../../components/admin/StatusBadge';
import AdminModal from '../../components/admin/AdminModal';
import Pagination from '../../components/admin/Pagination';
import { learningCoursesData, learningLessonsData } from '../../data/adminMockData';
import { adminService } from '../../services/adminService';

// Category Filter Options
const categoryOptions = [
  { value: 'All', label: 'All Categories', dot: 'bg-slate-400' },
  { value: 'Getting Started', label: 'Getting Started (L1–4)', dot: 'bg-blue-500' },
  { value: 'Finger Placement', label: 'Finger Placement (L5–7)', dot: 'bg-indigo-500' },
  { value: 'Learn the Keyboard', label: 'Keyboard Mastery (L8–12)', dot: 'bg-purple-500' },
  { value: 'Build Accuracy', label: 'Build Accuracy (L13–14)', dot: 'bg-emerald-500' },
  { value: 'Build Speed', label: 'Build Speed (L15–16)', dot: 'bg-amber-500' },
  { value: 'Advanced Typing', label: 'Advanced Typing (L17–18)', dot: 'bg-rose-500' },
];

// Difficulty Filter Options
const difficultyOptions = [
  { value: 'All', label: 'All Difficulties', dot: 'bg-slate-400' },
  { value: 'Beginner', label: 'Beginner Level', dot: 'bg-emerald-500' },
  { value: 'Intermediate', label: 'Intermediate Level', dot: 'bg-amber-500' },
  { value: 'Advanced', label: 'Advanced Level', dot: 'bg-purple-500' },
  { value: 'Expert', label: 'Expert / Pro Level', dot: 'bg-rose-500' },
];

// Status Filter Options
const statusOptions = [
  { value: 'All', label: 'All Statuses', dot: 'bg-slate-400' },
  { value: 'Published', label: 'Published Live', dot: 'bg-emerald-500' },
  { value: 'Draft', label: 'Draft / In Review', dot: 'bg-indigo-500' },
];

// Sort Options
const sortOptions = [
  { value: 'default', label: 'Default Curriculum Order' },
  { value: 'views_desc', label: 'Most Enrolled / Views' },
  { value: 'completion_desc', label: 'Highest Completion Rate' },
  { value: 'wpm_desc', label: 'Highest Avg Speed (WPM)' },
  { value: 'title_asc', label: 'Title (A – Z)' },
];

// Custom Category Filter Dropdown
const CategoryFilterDropdown = ({ value, onChange, isOpen, onToggle }) => {
  const selected = categoryOptions.find((c) => c.value === value) || categoryOptions[0];

  return (
    <div className="relative inline-block" data-category-dropdown>
      <button
        type="button"
        onClick={onToggle}
        className={`h-9 px-3 rounded-xl border text-xs font-semibold inline-flex items-center gap-2 transition-all duration-200 cursor-pointer shadow-2xs hover:shadow-xs active:scale-95 select-none ${
          value !== 'All'
            ? 'border-purple-500/40 bg-purple-500/10 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300'
            : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 text-slate-700 dark:text-slate-200 hover:border-slate-300 dark:hover:border-slate-700'
        }`}
        aria-label="Filter by Category"
      >
        <span className={`h-2 w-2 rounded-full ${selected.dot}`} />
        <span>{selected.label}</span>
        <ChevronDown
          size={12}
          className={`text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute left-0 sm:left-auto sm:right-0 top-full mt-1.5 z-50 w-64 rounded-2xl border border-slate-200/90 dark:border-slate-700/80 bg-white dark:bg-slate-900 p-1.5 shadow-2xl shadow-slate-950/25 backdrop-blur-md animate-in fade-in zoom-in-95 duration-150">
          <div className="px-2.5 py-1.5 mb-1 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1">
              <Filter size={10} />
              Filter By Category
            </span>
            {value !== 'All' && (
              <button
                type="button"
                onClick={() => onChange('All')}
                className="text-[10px] text-purple-600 dark:text-purple-400 hover:underline font-semibold cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          <div className="space-y-0.5">
            {categoryOptions.map((opt) => {
              const isSelected = value === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => onChange(opt.value)}
                  className={`w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-xl text-xs transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-purple-500/10 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 font-bold border border-purple-500/20'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/70 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full ${opt.dot}`} />
                    <span>{opt.label}</span>
                  </div>
                  {isSelected && (
                    <Check size={13} className="text-purple-600 dark:text-purple-400 stroke-[2.5]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

// Custom Difficulty Filter Dropdown
const DifficultyFilterDropdown = ({ value, onChange, isOpen, onToggle }) => {
  const selected = difficultyOptions.find((d) => d.value === value) || difficultyOptions[0];

  return (
    <div className="relative inline-block" data-difficulty-dropdown>
      <button
        type="button"
        onClick={onToggle}
        className={`h-9 px-3 rounded-xl border text-xs font-semibold inline-flex items-center gap-2 transition-all duration-200 cursor-pointer shadow-2xs hover:shadow-xs active:scale-95 select-none ${
          value !== 'All'
            ? 'border-purple-500/40 bg-purple-500/10 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300'
            : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 text-slate-700 dark:text-slate-200 hover:border-slate-300 dark:hover:border-slate-700'
        }`}
        aria-label="Filter by Difficulty"
      >
        <span className={`h-2 w-2 rounded-full ${selected.dot}`} />
        <span>{selected.label}</span>
        <ChevronDown
          size={12}
          className={`text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute left-0 sm:left-auto sm:right-0 top-full mt-1.5 z-50 w-56 rounded-2xl border border-slate-200/90 dark:border-slate-700/80 bg-white dark:bg-slate-900 p-1.5 shadow-2xl shadow-slate-950/25 backdrop-blur-md animate-in fade-in zoom-in-95 duration-150">
          <div className="px-2.5 py-1.5 mb-1 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1">
              <Filter size={10} />
              Filter By Difficulty
            </span>
            {value !== 'All' && (
              <button
                type="button"
                onClick={() => onChange('All')}
                className="text-[10px] text-purple-600 dark:text-purple-400 hover:underline font-semibold cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          <div className="space-y-0.5">
            {difficultyOptions.map((opt) => {
              const isSelected = value === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => onChange(opt.value)}
                  className={`w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-xl text-xs transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-purple-500/10 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 font-bold border border-purple-500/20'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/70 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full ${opt.dot}`} />
                    <span>{opt.label}</span>
                  </div>
                  {isSelected && (
                    <Check size={13} className="text-purple-600 dark:text-purple-400 stroke-[2.5]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

// Custom Status Filter Dropdown
const StatusFilterDropdown = ({ value, onChange, isOpen, onToggle }) => {
  const selected = statusOptions.find((s) => s.value === value) || statusOptions[0];

  return (
    <div className="relative inline-block" data-status-dropdown>
      <button
        type="button"
        onClick={onToggle}
        className={`h-9 px-3 rounded-xl border text-xs font-semibold inline-flex items-center gap-2 transition-all duration-200 cursor-pointer shadow-2xs hover:shadow-xs active:scale-95 select-none ${
          value !== 'All'
            ? 'border-purple-500/40 bg-purple-500/10 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300'
            : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 text-slate-700 dark:text-slate-200 hover:border-slate-300 dark:hover:border-slate-700'
        }`}
        aria-label="Filter by Status"
      >
        <span className={`h-2 w-2 rounded-full ${selected.dot}`} />
        <span>{selected.label}</span>
        <ChevronDown
          size={12}
          className={`text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute left-0 sm:left-auto sm:right-0 top-full mt-1.5 z-50 w-52 rounded-2xl border border-slate-200/90 dark:border-slate-700/80 bg-white dark:bg-slate-900 p-1.5 shadow-2xl shadow-slate-950/25 backdrop-blur-md animate-in fade-in zoom-in-95 duration-150">
          <div className="px-2.5 py-1.5 mb-1 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1">
              <Filter size={10} />
              Filter By Status
            </span>
            {value !== 'All' && (
              <button
                type="button"
                onClick={() => onChange('All')}
                className="text-[10px] text-purple-600 dark:text-purple-400 hover:underline font-semibold cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          <div className="space-y-0.5">
            {statusOptions.map((opt) => {
              const isSelected = value === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => onChange(opt.value)}
                  className={`w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-xl text-xs transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-purple-500/10 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 font-bold border border-purple-500/20'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/70 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full ${opt.dot}`} />
                    <span>{opt.label}</span>
                  </div>
                  {isSelected && (
                    <Check size={13} className="text-purple-600 dark:text-purple-400 stroke-[2.5]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

// Custom Sort Dropdown
const SortByDropdown = ({ value, onChange, isOpen, onToggle }) => {
  const selected = sortOptions.find((s) => s.value === value) || sortOptions[0];

  return (
    <div className="relative inline-block" data-sort-dropdown>
      <button
        type="button"
        onClick={onToggle}
        className="h-9 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:border-slate-300 dark:hover:border-slate-700 inline-flex items-center gap-2 transition-all duration-200 cursor-pointer shadow-2xs hover:shadow-xs active:scale-95 select-none"
        aria-label="Sort Curriculum"
      >
        <span className="text-slate-400 font-normal">Sort:</span>
        <span className="font-semibold">{selected.label}</span>
        <ChevronDown
          size={12}
          className={`text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1.5 z-50 w-60 rounded-2xl border border-slate-200/90 dark:border-slate-700/80 bg-white dark:bg-slate-900 p-1.5 shadow-2xl shadow-slate-950/25 backdrop-blur-md animate-in fade-in zoom-in-95 duration-150">
          <div className="px-2.5 py-1.5 mb-1 border-b border-slate-100 dark:border-slate-800">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Sort By
            </span>
          </div>

          <div className="space-y-0.5">
            {sortOptions.map((opt) => {
              const isSelected = value === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => onChange(opt.value)}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-purple-500/10 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 font-bold border border-purple-500/20'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/70 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <span>{opt.label}</span>
                  {isSelected && (
                    <Check size={13} className="text-purple-600 dark:text-purple-400 stroke-[2.5]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export const AdminLearning = () => {
  // Navigation tab
  const [activeTab, setActiveTab] = useState('courses'); // 'courses' | 'lessons' | 'categories'

  // Data state
  const [courses, setCourses] = useState(learningCoursesData);
  const [lessons, setLessons] = useState(learningLessonsData);

  // Filters & Controls
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [difficultyFilter, setDifficultyFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('default');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'

  // Dropdown toggles
  const [openDropdown, setOpenDropdown] = useState(null); // 'category' | 'difficulty' | 'status' | 'sort' | null

  // Inspect Drawer State
  const [inspectItem, setInspectItem] = useState(null); // Course or Lesson object
  const [inspectType, setInspectType] = useState('course'); // 'course' | 'lesson'

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('course'); // 'course' | 'lesson'
  const [editingItem, setEditingItem] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    category: 'Getting Started',
    difficulty: 'Beginner',
    duration: '5 min',
    lessons: 4,
    description: '',
    drillText: '',
    highlightKeys: 'A, S, D, F',
    status: 'Published',
  });

  // API State
  const [statsData, setStatsData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch live CMS data from backend
  const loadData = async (silent = false) => {
    if (!silent) setIsLoading(true);
    try {
      const [statsRes, coursesRes, lessonsRes] = await Promise.all([
        adminService.getLearningStats().catch((err) => {
          console.warn('Stats API error:', err.message);
          return null;
        }),
        adminService.getAdminCourses().catch((err) => {
          console.warn('Courses API error:', err.message);
          return null;
        }),
        adminService.getAdminLessons().catch((err) => {
          console.warn('Lessons API error:', err.message);
          return null;
        }),
      ]);

      if (statsRes?.data) {
        setStatsData(statsRes.data);
      }
      if (coursesRes?.data?.courses && coursesRes.data.courses.length > 0) {
        setCourses(coursesRes.data.courses);
      }
      if (lessonsRes?.data?.lessons && lessonsRes.data.lessons.length > 0) {
        setLessons(lessonsRes.data.lessons);
      }
    } catch (err) {
      console.warn('Error loading admin learning data:', err);
    } finally {
      if (!silent) setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Close dropdown on click outside or Escape
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        !event.target.closest('[data-category-dropdown]') &&
        !event.target.closest('[data-difficulty-dropdown]') &&
        !event.target.closest('[data-status-dropdown]') &&
        !event.target.closest('[data-sort-dropdown]')
      ) {
        setOpenDropdown(null);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setOpenDropdown(null);
        setInspectItem(null);
        setIsModalOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Filtered Courses
  const filteredCourses = useMemo(() => {
    let result = courses.filter((c) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q);
      const matchesCategory =
        categoryFilter === 'All' || c.category.toLowerCase() === categoryFilter.toLowerCase();
      const matchesDifficulty =
        difficultyFilter === 'All' || c.difficulty.toLowerCase() === difficultyFilter.toLowerCase();
      const matchesStatus =
        statusFilter === 'All' || c.status.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesCategory && matchesDifficulty && matchesStatus;
    });

    result.sort((a, b) => {
      if (sortBy === 'views_desc') return b.views - a.views;
      if (sortBy === 'completion_desc') return b.completionRate - a.completionRate;
      if (sortBy === 'wpm_desc') return b.avgWpmGain - a.avgWpmGain;
      if (sortBy === 'title_asc') return a.title.localeCompare(b.title);
      return 0; // Default order
    });

    return result;
  }, [courses, searchQuery, categoryFilter, difficultyFilter, statusFilter, sortBy]);

  // Filtered Lessons
  const filteredLessons = useMemo(() => {
    let result = lessons.filter((l) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        l.title.toLowerCase().includes(q) ||
        l.subtitle.toLowerCase().includes(q) ||
        l.drillText.toLowerCase().includes(q) ||
        l.category.toLowerCase().includes(q) ||
        String(l.lessonNumber).includes(q);
      const matchesCategory =
        categoryFilter === 'All' || l.category.toLowerCase() === categoryFilter.toLowerCase();
      const matchesDifficulty =
        difficultyFilter === 'All' || l.difficulty.toLowerCase() === difficultyFilter.toLowerCase();
      const matchesStatus =
        statusFilter === 'All' || l.status.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesCategory && matchesDifficulty && matchesStatus;
    });

    result.sort((a, b) => {
      if (sortBy === 'views_desc') return b.views - a.views;
      if (sortBy === 'completion_desc') return b.completionRate - a.completionRate;
      if (sortBy === 'wpm_desc') return b.avgWpm - a.avgWpm;
      if (sortBy === 'title_asc') return a.title.localeCompare(b.title);
      return a.lessonNumber - b.lessonNumber; // Default lesson number
    });

    return result;
  }, [lessons, searchQuery, categoryFilter, difficultyFilter, statusFilter, sortBy]);

  // Derived Top KPI Metrics
  const kpiStats = useMemo(() => {
    if (statsData?.kpis) {
      return {
        totalModules: statsData.kpis.totalModules,
        totalLessons: statsData.kpis.totalLessons,
        totalViews: statsData.kpis.totalViews,
        avgCompRate: statsData.kpis.avgCompRate,
      };
    }
    const totalModules = courses.length;
    const totalLessonsCount = lessons.length;
    const totalViews = courses.reduce((sum, c) => sum + (c.views || 0), 0);
    const avgCompRate = (
      courses.reduce((sum, c) => sum + (c.completionRate || 0), 0) / (courses.length || 1)
    ).toFixed(1);

    return {
      totalModules: `${totalModules} Modules`,
      totalLessons: `${totalLessonsCount} Active Lessons`,
      totalViews: totalViews.toLocaleString(),
      avgCompRate: `${avgCompRate}%`,
    };
  }, [courses, lessons, statsData]);

  // Categories matrix overview
  const categoryMatrix = useMemo(() => {
    if (statsData?.categoryMatrix && statsData.categoryMatrix.length > 0) {
      return statsData.categoryMatrix;
    }
    const map = new Map();
    categoryOptions
      .filter((c) => c.value !== 'All')
      .forEach((cat) => {
        const catLessons = lessons.filter((l) => l.category === cat.value);
        const catCourses = courses.filter((c) => c.category === cat.value);
        const catViews = catLessons.reduce((sum, l) => sum + (l.views || 0), 0);
        map.set(cat.value, {
          name: cat.value,
          dot: cat.dot,
          coursesCount: catCourses.length,
          lessonsCount: catLessons.length,
          views: catViews,
          avgCompletion:
            catLessons.length > 0
              ? (
                  catLessons.reduce((sum, l) => sum + (l.completionRate || 0), 0) /
                  catLessons.length
                ).toFixed(1)
              : '0.0',
        });
      });
    return Array.from(map.values());
  }, [courses, lessons, statsData]);

  // Switch Toggle for Course Publish Status
  const toggleCoursePublish = async (id) => {
    const course = courses.find((c) => c.id === id || c._id === id);
    if (!course) return;
    const next = course.status === 'Published' ? 'Draft' : 'Published';

    // Optimistic UI update
    setCourses((prev) =>
      prev.map((c) => {
        if (c.id === id || c._id === id) {
          return { ...c, status: next };
        }
        return c;
      })
    );
    if (inspectItem && (inspectItem.id === id || inspectItem._id === id)) {
      setInspectItem({ ...inspectItem, status: next });
    }

    try {
      await adminService.updateAdminCourseStatus(id, { status: next });
      toast.success(`Course "${course.title}" updated to ${next}!`, { position: 'top-right' });
      loadData(true);
    } catch (err) {
      // Rollback on error
      setCourses((prev) =>
        prev.map((c) => {
          if (c.id === id || c._id === id) {
            return { ...c, status: course.status };
          }
          return c;
        })
      );
      if (inspectItem && (inspectItem.id === id || inspectItem._id === id)) {
        setInspectItem({ ...inspectItem, status: course.status });
      }
      toast.error(err.message || 'Failed to update course status', { position: 'top-right' });
    }
  };

  // Switch Toggle for Lesson Publish Status
  const toggleLessonPublish = async (id) => {
    const lesson = lessons.find((l) => l.id === id || l._id === id);
    if (!lesson) return;
    const next = lesson.status === 'Published' ? 'Draft' : 'Published';

    // Optimistic UI update
    setLessons((prev) =>
      prev.map((l) => {
        if (l.id === id || l._id === id) {
          return { ...l, status: next, isActive: next === 'Published' };
        }
        return l;
      })
    );
    if (inspectItem && (inspectItem.id === id || inspectItem._id === id)) {
      setInspectItem({ ...inspectItem, status: next, isActive: next === 'Published' });
    }

    try {
      await adminService.updateAdminLessonStatus(id, { status: next });
      toast.success(`Lesson "${lesson.title}" updated to ${next}!`, { position: 'top-right' });
      loadData(true);
    } catch (err) {
      // Rollback on error
      setLessons((prev) =>
        prev.map((l) => {
          if (l.id === id || l._id === id) {
            return { ...l, status: lesson.status, isActive: lesson.status === 'Published' };
          }
          return l;
        })
      );
      if (inspectItem && (inspectItem.id === id || inspectItem._id === id)) {
        setInspectItem({ ...inspectItem, status: lesson.status, isActive: lesson.status === 'Published' });
      }
      toast.error(err.message || 'Failed to update lesson status', { position: 'top-right' });
    }
  };

  // Delete Course
  const handleDeleteCourse = async (id, title) => {
    if (window.confirm(`Are you sure you want to delete course "${title}"?`)) {
      try {
        await adminService.deleteAdminCourse(id);
        setCourses((prev) => prev.filter((c) => c.id !== id && c._id !== id));
        if (inspectItem && (inspectItem.id === id || inspectItem._id === id)) setInspectItem(null);
        toast.success(`Course "${title}" removed from catalog!`, { position: 'top-right' });
        loadData(true);
      } catch (err) {
        toast.error(err.message || 'Failed to delete course', { position: 'top-right' });
      }
    }
  };

  // Delete Lesson
  const handleDeleteLesson = async (id, title) => {
    if (window.confirm(`Are you sure you want to delete lesson "${title}"?`)) {
      try {
        await adminService.deleteAdminLesson(id);
        setLessons((prev) => prev.filter((l) => l.id !== id && l._id !== id));
        if (inspectItem && (inspectItem.id === id || inspectItem._id === id)) setInspectItem(null);
        toast.success(`Lesson "${title}" removed from library!`, { position: 'top-right' });
        loadData(true);
      } catch (err) {
        toast.error(err.message || 'Failed to delete lesson', { position: 'top-right' });
      }
    }
  };

  // Open Create Modal
  const handleOpenCreate = () => {
    setEditingItem(null);
    setModalMode(activeTab === 'lessons' ? 'lesson' : 'course');
    setFormData({
      title: '',
      category: 'Getting Started',
      difficulty: 'Beginner',
      duration: '5 min',
      lessons: 4,
      description: '',
      drillText: '',
      highlightKeys: 'A, S, D, F',
      status: 'Published',
    });
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (item, type = 'course') => {
    setEditingItem(item);
    setModalMode(type);
    const itemStatus = item.status || (item.isActive ? 'Published' : 'Draft');
    if (type === 'course') {
      setFormData({
        title: item.title,
        category: item.category,
        difficulty: item.difficulty,
        duration: '5 min',
        lessons: item.lessons,
        description: item.description,
        drillText: '',
        highlightKeys: '',
        status: itemStatus,
      });
    } else {
      setFormData({
        title: item.title,
        category: item.category,
        difficulty: item.difficulty,
        duration: item.duration || '5 min',
        lessons: 1,
        description: item.description,
        drillText: item.drillText || '',
        highlightKeys: (item.highlightKeys || []).join(', '),
        status: itemStatus,
      });
    }
    setIsModalOpen(true);
  };

  // Save Modal Form
  const handleSaveModal = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!formData.title.trim()) {
      toast.error('Please enter a title', { position: 'top-right' });
      return;
    }

    setIsSubmitting(true);
    try {
      if (modalMode === 'course') {
        if (editingItem) {
          const payload = {
            title: formData.title,
            category: formData.category,
            difficulty: formData.difficulty,
            lessons: Number(formData.lessons) || 4,
            description: formData.description,
            status: formData.status || 'Published',
          };
          const res = await adminService.updateAdminCourse(editingItem.id || editingItem._id, payload);
          const updated = res.data || { ...editingItem, ...payload };
          setCourses((prev) =>
            prev.map((c) =>
              c.id === editingItem.id || c._id === editingItem._id ? { ...c, ...updated } : c
            )
          );
          if (inspectItem && (inspectItem.id === editingItem.id || inspectItem._id === editingItem._id)) {
            setInspectItem({ ...inspectItem, ...updated });
          }
          toast.success(`Course "${formData.title}" updated!`, { position: 'top-right' });
        } else {
          const payload = {
            title: formData.title,
            category: formData.category,
            difficulty: formData.difficulty,
            lessons: Number(formData.lessons) || 4,
            description: formData.description,
            status: formData.status || 'Published',
          };
          const res = await adminService.createAdminCourse(payload);
          const created = res.data;
          setCourses((prev) => [created, ...prev]);
          toast.success(`Course "${formData.title}" created successfully!`, { position: 'top-right' });
        }
      } else {
        // Lesson Mode
        const parsedKeys = formData.highlightKeys
          .split(',')
          .map((k) => k.trim().toUpperCase())
          .filter(Boolean);

        if (editingItem) {
          const payload = {
            title: formData.title,
            category: formData.category,
            difficulty: formData.difficulty,
            duration: formData.duration,
            description: formData.description,
            drillText: formData.drillText,
            highlightKeys: parsedKeys,
            status: formData.status || 'Published',
          };
          const res = await adminService.updateAdminLesson(editingItem.id || editingItem._id, payload);
          const updated = res.data || { ...editingItem, ...payload };
          setLessons((prev) =>
            prev.map((l) =>
              l.id === editingItem.id || l._id === editingItem._id ? { ...l, ...updated } : l
            )
          );
          if (inspectItem && (inspectItem.id === editingItem.id || inspectItem._id === editingItem._id)) {
            setInspectItem({ ...inspectItem, ...updated });
          }
          toast.success(`Lesson "${formData.title}" updated!`, { position: 'top-right' });
        } else {
          const payload = {
            title: formData.title,
            category: formData.category,
            difficulty: formData.difficulty,
            duration: formData.duration,
            description: formData.description,
            drillText: formData.drillText,
            highlightKeys: parsedKeys,
            status: formData.status || 'Published',
          };
          const res = await adminService.createAdminLesson(payload);
          const created = res.data;
          setLessons((prev) => [...prev, created]);
          toast.success(`Lesson "${formData.title}" created successfully!`, { position: 'top-right' });
        }
      }
      setIsModalOpen(false);
      loadData(true);
    } catch (err) {
      toast.error(err.message || 'Save operation failed', { position: 'top-right' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset Filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setCategoryFilter('All');
    setDifficultyFilter('All');
    setStatusFilter('All');
    setSortBy('default');
    toast.info('Filters reset to standard view', { position: 'top-right' });
  };

  const hasActiveFilters =
    searchQuery ||
    categoryFilter !== 'All' ||
    difficultyFilter !== 'All' ||
    statusFilter !== 'All' ||
    sortBy !== 'default';

  // Export to CSV
  const handleExportCSV = async () => {
    const exportType = activeTab === 'lessons' ? 'lessons' : 'courses';
    try {
      await adminService.exportLearningCSV({
        type: exportType,
        category: categoryFilter,
        difficulty: difficultyFilter,
        status: statusFilter,
      });
      toast.success(
        `Exported ${exportType} to CSV!`,
        { position: 'top-right' }
      );
      return;
    } catch (err) {
      console.warn('Server export failed, falling back to local CSV:', err.message);
    }

    if (activeTab === 'lessons') {
      if (filteredLessons.length === 0) {
        toast.error('No lessons to export', { position: 'top-right' });
        return;
      }
      const headers = [
        'Lesson No.',
        'Slug',
        'Title',
        'Category',
        'Difficulty',
        'Duration',
        'Highlight Keys',
        'Views',
        'Completion Rate (%)',
        'Avg WPM',
        'Status',
      ];
      const rows = filteredLessons.map((l) => [
        l.lessonNumber,
        l.slug,
        `"${l.title}"`,
        `"${l.category}"`,
        l.difficulty,
        l.duration,
        `"${(l.highlightKeys || []).join(' ')}"`,
        l.views,
        `${l.completionRate}%`,
        l.avgWpm,
        l.status,
      ]);
      const csv =
        'data:text/csv;charset=utf-8,' +
        [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
      const uri = encodeURI(csv);
      const link = document.createElement('a');
      link.href = uri;
      link.download = `tara_typing_lessons_${Date.now()}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success(`Exported ${filteredLessons.length} lessons to CSV!`, { position: 'top-right' });
    } else {
      if (filteredCourses.length === 0) {
        toast.error('No courses to export', { position: 'top-right' });
        return;
      }
      const headers = [
        'Course ID',
        'Title',
        'Category',
        'Difficulty',
        'Lessons Count',
        'Enrolled Typists',
        'Completion Rate (%)',
        'Avg Speed Gain (WPM)',
        'Status',
      ];
      const rows = filteredCourses.map((c) => [
        c.id,
        `"${c.title}"`,
        `"${c.category}"`,
        c.difficulty,
        c.lessons,
        c.views,
        `${c.completionRate}%`,
        `+${c.avgWpmGain} WPM`,
        c.status,
      ]);
      const csv =
        'data:text/csv;charset=utf-8,' +
        [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
      const uri = encodeURI(csv);
      const link = document.createElement('a');
      link.href = uri;
      link.download = `tara_typing_courses_${Date.now()}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success(`Exported ${filteredCourses.length} courses to CSV!`, { position: 'top-right' });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* ── 1. HEADER & QUICK ACTIONS ── */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 text-xs font-bold uppercase tracking-wider border border-purple-500/20">
              Curriculum Engine
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              18 Core Lessons Live
            </span>
          </div>
          <h1 className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-display">
            Learning Curriculum Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Structure interactive touch-typing modules, manage 18 core lessons, inspect student drill analytics, and curate coding drills.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => loadData(false)}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm cursor-pointer disabled:opacity-60"
            title="Refresh curriculum data"
          >
            <RotateCcw size={13} className={isLoading ? 'animate-spin text-purple-600' : ''} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm cursor-pointer"
          >
            <Download size={14} />
            <span>Export CSV</span>
          </button>

          <button
            type="button"
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 rounded-xl bg-purple-600 hover:bg-purple-700 px-4 py-2 text-xs font-semibold text-white shadow-sm shadow-purple-500/30 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <Plus size={15} />
            <span>New Curriculum Item</span>
          </button>
        </div>
      </div>

      {/* ── 2. TOP 4 STANDARDIZED KPI METRICS ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Card 1: Curriculum Modules */}
        <StatCard
          title="Curriculum Modules"
          value={kpiStats.totalModules}
          change={16.7}
          isPositive={true}
          timeframe="Getting Started to Pro"
          icon={Layers}
          hoverEffect="purple"
          colorClass="from-purple-500/20 to-indigo-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20"
        />

        {/* Card 2: Active Lessons */}
        <StatCard
          title="Active Lesson Library"
          value={kpiStats.totalLessons}
          change={100}
          isPositive={true}
          timeframe="100% interactive drills"
          icon={BookOpen}
          hoverEffect="blue"
          colorClass="from-blue-500/20 to-cyan-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
        />

        {/* Card 3: Enrolled Typists */}
        <StatCard
          title="Student Enrollments"
          value={kpiStats.totalViews}
          change={21.4}
          isPositive={true}
          timeframe="across all modules"
          icon={Users}
          hoverEffect="emerald"
          colorClass="from-emerald-500/20 to-teal-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
        />

        {/* Card 4: Avg Completion Rate */}
        <StatCard
          title="Completion Benchmark"
          value={kpiStats.avgCompRate}
          change={4.8}
          isPositive={true}
          timeframe="platform completion rate"
          icon={Target}
          hoverEffect="amber"
          colorClass="from-amber-500/20 to-orange-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
        />
      </div>

      {/* ── 3. NAVIGATION TABS (COURSES, ALL 18 LESSONS, CATEGORIES) ── */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        {[
          { id: 'courses', label: 'Curriculum Modules', count: courses.length, icon: Layers },
          { id: 'lessons', label: '18 Core Lessons', count: lessons.length, icon: BookOpen },
          { id: 'categories', label: 'Category Matrix', count: categoryMatrix.length, icon: Target },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                isActive
                  ? 'bg-purple-600 text-white shadow-sm shadow-purple-500/30'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <Icon size={14} />
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── 4. FILTER & VIEW TOOLBAR (ONLY FOR COURSES & LESSONS TABS) ── */}
      {activeTab !== 'categories' && (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3.5 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          {/* Left: Search input */}
          <div className="relative flex-1 max-w-md">
            <Search
              size={14}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                activeTab === 'lessons'
                  ? 'Search 18 lessons by title, drill text, keys, or slug...'
                  : 'Search modules by title, category, or description...'
              }
              className="w-full h-9 pl-9 pr-8 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs p-0.5 rounded cursor-pointer"
                title="Clear search"
              >
                <X size={12} />
              </button>
            )}
          </div>

          {/* Right: Custom Dropdowns & Switchers */}
          <div className="flex flex-wrap items-center gap-2">
            <CategoryFilterDropdown
              value={categoryFilter}
              onChange={(val) => {
                setCategoryFilter(val);
                setOpenDropdown(null);
              }}
              isOpen={openDropdown === 'category'}
              onToggle={() => setOpenDropdown(openDropdown === 'category' ? null : 'category')}
            />

            <DifficultyFilterDropdown
              value={difficultyFilter}
              onChange={(val) => {
                setDifficultyFilter(val);
                setOpenDropdown(null);
              }}
              isOpen={openDropdown === 'difficulty'}
              onToggle={() => setOpenDropdown(openDropdown === 'difficulty' ? null : 'difficulty')}
            />

            <StatusFilterDropdown
              value={statusFilter}
              onChange={(val) => {
                setStatusFilter(val);
                setOpenDropdown(null);
              }}
              isOpen={openDropdown === 'status'}
              onToggle={() => setOpenDropdown(openDropdown === 'status' ? null : 'status')}
            />

            <SortByDropdown
              value={sortBy}
              onChange={(val) => {
                setSortBy(val);
                setOpenDropdown(null);
              }}
              isOpen={openDropdown === 'sort'}
              onToggle={() => setOpenDropdown(openDropdown === 'sort' ? null : 'sort')}
            />

            {/* Reset Filters */}
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="h-9 px-2.5 rounded-xl border border-rose-200/80 dark:border-rose-900/50 bg-rose-50/50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 text-xs font-semibold inline-flex items-center gap-1.5 hover:bg-rose-100/70 transition-colors cursor-pointer"
                title="Reset all filters"
              >
                <RotateCcw size={12} />
                <span className="hidden sm:inline">Reset</span>
              </button>
            )}

            {/* View Mode Toggle */}
            <div className="flex items-center p-0.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 ml-1">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-white dark:bg-slate-800 text-purple-600 dark:text-purple-400 shadow-xs'
                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                }`}
                title="Card Grid View"
                aria-label="Card Grid View"
              >
                <LayoutGrid size={15} />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewMode === 'table'
                    ? 'bg-white dark:bg-slate-800 text-purple-600 dark:text-purple-400 shadow-xs'
                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                }`}
                title="Compact Table View"
                aria-label="Compact Table View"
              >
                <List size={15} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── 5. COURSES TAB CONTENT (GRID OR TABLE) ── */}
      {activeTab === 'courses' && (
        <>
          {filteredCourses.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-12 text-center">
              <BookOpen size={40} className="mx-auto text-slate-300 dark:text-slate-700 mb-3" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                No Curriculum Modules Match Filters
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                Try loosening your category, difficulty, or search term filters to see available courses.
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="mt-4 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold transition-all inline-flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw size={13} />
                <span>Reset Filters</span>
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            /* COURSES GRID VIEW */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCourses.map((c) => {
                const isPublished = c.status === 'Published';
                return (
                  <div
                    key={c.id}
                    className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between relative overflow-hidden group"
                  >
                    {/* Top gradient highlight bar */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500" />

                    <div>
                      {/* Top Badges & Switch Slider */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                            {c.category}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                              c.difficulty === 'Beginner'
                                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                                : c.difficulty === 'Intermediate'
                                ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                                : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                            }`}
                          >
                            {c.difficulty}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          {/* 1-Click Switch Slider */}
                          <button
                            type="button"
                            onClick={() => toggleCoursePublish(c.id)}
                            className={`group relative inline-flex h-4 w-8 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 ${
                              isPublished ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'
                            }`}
                            aria-label={`Toggle course publish status for ${c.title}`}
                            title={isPublished ? 'Unpublish Course' : 'Publish Course'}
                          >
                            <span
                              className={`pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow-md transition duration-200 ease-in-out ${
                                isPublished ? 'translate-x-4' : 'translate-x-0.5'
                              }`}
                            />
                          </button>
                          <StatusBadge status={c.status} />
                        </div>
                      </div>

                      {/* Title & Description */}
                      <h3 className="text-base font-bold text-slate-900 dark:text-white font-display leading-snug">
                        {c.title}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                        {c.description}
                      </p>

                      {/* Module Metrics (3-column grid) */}
                      <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-center">
                        <div className="p-2 rounded-xl bg-slate-50/70 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800/80">
                          <span className="text-[10px] text-slate-400 uppercase font-semibold flex items-center justify-center gap-1">
                            <BookOpen size={11} className="text-purple-500" /> Lessons
                          </span>
                          <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                            {c.lessons} Lessons
                          </p>
                        </div>

                        <div className="p-2 rounded-xl bg-slate-50/70 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800/80">
                          <span className="text-[10px] text-slate-400 uppercase font-semibold flex items-center justify-center gap-1">
                            <Users size={11} className="text-blue-500" /> Enrolled
                          </span>
                          <p className="text-xs sm:text-sm font-bold text-blue-600 dark:text-blue-400 mt-0.5">
                            {c.views.toLocaleString()}
                          </p>
                        </div>

                        <div className="p-2 rounded-xl bg-slate-50/70 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800/80">
                          <span className="text-[10px] text-slate-400 uppercase font-semibold flex items-center justify-center gap-1">
                            <Zap size={11} className="text-emerald-500" /> Gain
                          </span>
                          <p className="text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                            +{c.avgWpmGain} WPM
                          </p>
                        </div>
                      </div>

                      {/* Completion Progress Bar */}
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                          <span>Completion Rate</span>
                          <span className="text-purple-600 dark:text-purple-400 font-bold">
                            {c.completionRate}%
                          </span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transition-all duration-500"
                            style={{ width: `${c.completionRate}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                      <span className="text-[11px] font-semibold text-slate-400 font-mono">
                        {c.lessonRange || `${c.lessons} Lessons`}
                      </span>

                      <div className="flex items-center gap-1.5">
                        {/* Inspect Button (Purple Icon-Only) */}
                        <div className="relative group/tooltip flex items-center">
                          <button
                            type="button"
                            onClick={() => {
                              setInspectItem(c);
                              setInspectType('course');
                            }}
                            className="p-1.5 rounded-xl border border-purple-200/80 dark:border-purple-800/60 bg-purple-50/90 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/60 hover:border-purple-300 dark:hover:border-purple-700 hover:scale-105 active:scale-95 transition-all shadow-2xs cursor-pointer"
                            title="Inspect Course Dossier"
                            aria-label="Inspect Course Dossier"
                          >
                            <Eye size={14} strokeWidth={2.2} />
                          </button>
                          <div className="pointer-events-none absolute bottom-full mb-2 left-1/2 -translate-x-1/2 opacity-0 group-hover/tooltip:opacity-100 group-hover/tooltip:-translate-y-0.5 transition-all duration-150 z-50 whitespace-nowrap">
                            <div className="px-2.5 py-1 rounded-xl bg-slate-900 text-white dark:bg-slate-800 dark:text-white text-[11px] font-semibold shadow-xl border border-slate-700/60">
                              Inspect Module Dossier
                            </div>
                            <div className="w-1.5 h-1.5 bg-slate-900 dark:bg-slate-800 border-r border-b border-slate-700/60 rotate-45 mx-auto -mt-1 rounded-xs" />
                          </div>
                        </div>

                        {/* Edit Button (Blue) */}
                        <div className="relative group/tooltip flex items-center">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(c, 'course')}
                            className="p-1.5 rounded-xl border border-blue-200/80 dark:border-blue-800/60 bg-blue-50/90 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/60 hover:border-blue-300 dark:hover:border-blue-700 hover:scale-105 active:scale-95 transition-all shadow-2xs cursor-pointer"
                            title="Edit Course"
                            aria-label="Edit Course"
                          >
                            <Edit size={14} strokeWidth={2.2} />
                          </button>
                          <div className="pointer-events-none absolute bottom-full mb-2 left-1/2 -translate-x-1/2 opacity-0 group-hover/tooltip:opacity-100 group-hover/tooltip:-translate-y-0.5 transition-all duration-150 z-50 whitespace-nowrap">
                            <div className="px-2.5 py-1 rounded-xl bg-slate-900 text-white dark:bg-slate-800 dark:text-white text-[11px] font-semibold shadow-xl border border-slate-700/60">
                              Edit Course
                            </div>
                            <div className="w-1.5 h-1.5 bg-slate-900 dark:bg-slate-800 border-r border-b border-slate-700/60 rotate-45 mx-auto -mt-1 rounded-xs" />
                          </div>
                        </div>

                        {/* Delete Button (Rose) */}
                        <div className="relative group/tooltip flex items-center">
                          <button
                            type="button"
                            onClick={() => handleDeleteCourse(c.id, c.title)}
                            className="p-1.5 rounded-xl border border-rose-200/80 dark:border-rose-800/60 bg-rose-50/90 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/60 hover:border-rose-300 dark:hover:border-rose-700 hover:scale-105 active:scale-95 transition-all shadow-2xs cursor-pointer"
                            title="Delete Course"
                            aria-label="Delete Course"
                          >
                            <Trash2 size={14} strokeWidth={2.2} />
                          </button>
                          <div className="pointer-events-none absolute bottom-full mb-2 right-0 opacity-0 group-hover/tooltip:opacity-100 group-hover/tooltip:-translate-y-0.5 transition-all duration-150 z-50 whitespace-nowrap">
                            <div className="px-2.5 py-1 rounded-xl bg-rose-600 text-white text-[11px] font-semibold shadow-xl border border-rose-500">
                              Delete Course
                            </div>
                            <div className="w-1.5 h-1.5 bg-rose-600 border-r border-b border-rose-500 rotate-45 ml-auto mr-2.5 -mt-1 rounded-xs" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* COURSES TABLE VIEW */
            <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-slate-50/80 dark:bg-slate-950/50 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="px-5 py-3.5">Course Module</th>
                      <th className="px-5 py-3.5">Category</th>
                      <th className="px-5 py-3.5">Difficulty</th>
                      <th className="px-5 py-3.5">Lessons</th>
                      <th className="px-5 py-3.5">Enrolled</th>
                      <th className="px-5 py-3.5">Completion</th>
                      <th className="px-5 py-3.5">Status</th>
                      <th className="px-5 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                    {filteredCourses.map((c) => {
                      const isPublished = c.status === 'Published';
                      return (
                        <tr
                          key={c.id}
                          className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                        >
                          <td className="px-5 py-3.5">
                            <p className="font-bold text-slate-900 dark:text-white leading-tight">
                              {c.title}
                            </p>
                            <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                              {c.description}
                            </p>
                          </td>
                          <td className="px-5 py-3.5 whitespace-nowrap">
                            <span className="inline-block px-2.5 py-0.5 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 text-xs font-semibold">
                              {c.category}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 whitespace-nowrap">
                            <span
                              className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                                c.difficulty === 'Beginner'
                                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                  : c.difficulty === 'Intermediate'
                                  ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                                  : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                              }`}
                            >
                              {c.difficulty}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 whitespace-nowrap font-medium text-slate-700 dark:text-slate-300">
                            {c.lessons} Lessons
                          </td>
                          <td className="px-5 py-3.5 whitespace-nowrap text-slate-600 dark:text-slate-400 font-semibold">
                            {c.views.toLocaleString()}
                          </td>
                          <td className="px-5 py-3.5 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-purple-600 dark:text-purple-400">
                                {c.completionRate}%
                              </span>
                              <div className="w-16 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-purple-500 rounded-full"
                                  style={{ width: `${c.completionRate}%` }}
                                />
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-3.5 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => toggleCoursePublish(c.id)}
                                className={`group relative inline-flex h-4 w-8 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 ${
                                  isPublished ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'
                                }`}
                              >
                                <span
                                  className={`pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow-md transition duration-200 ease-in-out ${
                                    isPublished ? 'translate-x-4' : 'translate-x-0.5'
                                  }`}
                                />
                              </button>
                              <StatusBadge status={c.status} />
                            </div>
                          </td>
                          <td className="px-5 py-3.5 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* Inspect (Icon-Only) */}
                              <button
                                type="button"
                                onClick={() => {
                                  setInspectItem(c);
                                  setInspectType('course');
                                }}
                                className="p-1.5 rounded-xl border border-purple-200/80 dark:border-purple-800/60 bg-purple-50/90 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/60 hover:border-purple-300 dark:hover:border-purple-700 hover:scale-105 active:scale-95 transition-all shadow-2xs cursor-pointer"
                                title="Inspect Course Dossier"
                                aria-label="Inspect Course Dossier"
                              >
                                <Eye size={13} strokeWidth={2.2} />
                              </button>
                              {/* Edit */}
                              <button
                                type="button"
                                onClick={() => handleOpenEdit(c, 'course')}
                                className="p-1.5 rounded-xl border border-blue-200/80 dark:border-blue-800/60 bg-blue-50/90 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 hover:bg-blue-100 transition-all cursor-pointer"
                              >
                                <Edit size={13} strokeWidth={2.2} />
                              </button>
                              {/* Delete */}
                              <button
                                type="button"
                                onClick={() => handleDeleteCourse(c.id, c.title)}
                                className="p-1.5 rounded-xl border border-rose-200/80 dark:border-rose-800/60 bg-rose-50/90 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 transition-all cursor-pointer"
                              >
                                <Trash2 size={13} strokeWidth={2.2} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {/* ── 6. 18 LESSONS TAB CONTENT (GRID OR TABLE) ── */}
      {activeTab === 'lessons' && (
        <>
          {filteredLessons.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-12 text-center">
              <BookOpen size={40} className="mx-auto text-slate-300 dark:text-slate-700 mb-3" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                No Lessons Match Filters
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                Reset your filter criteria to inspect all 18 core curriculum lessons.
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="mt-4 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold transition-all inline-flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw size={13} />
                <span>Reset Filters</span>
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            /* LESSONS GRID VIEW */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredLessons.map((l) => {
                const isPublished = l.status === 'Published';
                return (
                  <div
                    key={l.id}
                    className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between relative overflow-hidden group"
                  >
                    <div>
                      {/* Top Badges & Switch Slider */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold font-mono">
                            #{String(l.lessonNumber).padStart(2, '0')}
                          </span>
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                            {l.category}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                              l.difficulty === 'Beginner'
                                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                : l.difficulty === 'Intermediate'
                                ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                                : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                            }`}
                          >
                            {l.difficulty}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          {/* 1-Click Switch Slider */}
                          <button
                            type="button"
                            onClick={() => toggleLessonPublish(l.id)}
                            className={`group relative inline-flex h-4 w-8 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 ${
                              isPublished ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'
                            }`}
                            aria-label={`Toggle lesson publish status for ${l.title}`}
                            title={isPublished ? 'Unpublish Lesson' : 'Publish Lesson'}
                          >
                            <span
                              className={`pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow-md transition duration-200 ease-in-out ${
                                isPublished ? 'translate-x-4' : 'translate-x-0.5'
                              }`}
                            />
                          </button>
                          <StatusBadge status={l.status} />
                        </div>
                      </div>

                      {/* Title & Subtitle */}
                      <h3 className="text-base font-bold text-slate-900 dark:text-white font-display leading-snug">
                        {l.title}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                        {l.subtitle || l.description}
                      </p>

                      {/* Highlight Keys (Keyboard Keycaps preview) */}
                      {l.highlightKeys && l.highlightKeys.length > 0 && (
                        <div className="mt-3 flex items-center gap-1.5 flex-wrap">
                          <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1 mr-1">
                            <Key size={10} /> Keys:
                          </span>
                          {l.highlightKeys.slice(0, 8).map((k, idx) => (
                            <kbd
                              key={idx}
                              className="px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] font-mono font-bold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-2xs"
                            >
                              {k}
                            </kbd>
                          ))}
                          {l.highlightKeys.length > 8 && (
                            <span className="text-[10px] text-slate-400">
                              +{l.highlightKeys.length - 8} more
                            </span>
                          )}
                        </div>
                      )}

                      {/* Drill Snippet */}
                      <div className="mt-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800 text-xs font-mono text-slate-600 dark:text-slate-400 line-clamp-2 italic">
                        "{l.drillText}"
                      </div>
                    </div>

                    {/* Footer Controls */}
                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 text-slate-400 font-medium">
                        <span className="inline-flex items-center gap-1">
                          <Clock size={12} />
                          {l.duration}
                        </span>
                        {l.quiz && (
                          <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold text-[11px]">
                            <CheckCircle2 size={11} /> Quiz
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5">
                        {/* Inspect Button (Purple Icon-Only) */}
                        <div className="relative group/tooltip flex items-center">
                          <button
                            type="button"
                            onClick={() => {
                              setInspectItem(l);
                              setInspectType('lesson');
                            }}
                            className="p-1.5 rounded-xl border border-purple-200/80 dark:border-purple-800/60 bg-purple-50/90 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/60 hover:border-purple-300 dark:hover:border-purple-700 hover:scale-105 active:scale-95 transition-all shadow-2xs cursor-pointer"
                            title="Inspect Lesson Drill"
                            aria-label="Inspect Lesson Drill"
                          >
                            <Eye size={14} strokeWidth={2.2} />
                          </button>
                          <div className="pointer-events-none absolute bottom-full mb-2 left-1/2 -translate-x-1/2 opacity-0 group-hover/tooltip:opacity-100 group-hover/tooltip:-translate-y-0.5 transition-all duration-150 z-50 whitespace-nowrap">
                            <div className="px-2.5 py-1 rounded-xl bg-slate-900 text-white dark:bg-slate-800 dark:text-white text-[11px] font-semibold shadow-xl border border-slate-700/60">
                              Inspect Lesson Dossier
                            </div>
                            <div className="w-1.5 h-1.5 bg-slate-900 dark:bg-slate-800 border-r border-b border-slate-700/60 rotate-45 mx-auto -mt-1 rounded-xs" />
                          </div>
                        </div>

                        {/* Edit Button (Blue) */}
                        <div className="relative group/tooltip flex items-center">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(l, 'lesson')}
                            className="p-1.5 rounded-xl border border-blue-200/80 dark:border-blue-800/60 bg-blue-50/90 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/60 hover:border-blue-300 dark:hover:border-blue-700 hover:scale-105 active:scale-95 transition-all shadow-2xs cursor-pointer"
                            title="Edit Lesson"
                            aria-label="Edit Lesson"
                          >
                            <Edit size={14} strokeWidth={2.2} />
                          </button>
                          <div className="pointer-events-none absolute bottom-full mb-2 left-1/2 -translate-x-1/2 opacity-0 group-hover/tooltip:opacity-100 group-hover/tooltip:-translate-y-0.5 transition-all duration-150 z-50 whitespace-nowrap">
                            <div className="px-2.5 py-1 rounded-xl bg-slate-900 text-white dark:bg-slate-800 dark:text-white text-[11px] font-semibold shadow-xl border border-slate-700/60">
                              Edit Lesson
                            </div>
                            <div className="w-1.5 h-1.5 bg-slate-900 dark:bg-slate-800 border-r border-b border-slate-700/60 rotate-45 mx-auto -mt-1 rounded-xs" />
                          </div>
                        </div>

                        {/* Delete Button (Rose) */}
                        <div className="relative group/tooltip flex items-center">
                          <button
                            type="button"
                            onClick={() => handleDeleteLesson(l.id, l.title)}
                            className="p-1.5 rounded-xl border border-rose-200/80 dark:border-rose-800/60 bg-rose-50/90 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/60 hover:border-rose-300 dark:hover:border-rose-700 hover:scale-105 active:scale-95 transition-all shadow-2xs cursor-pointer"
                            title="Delete Lesson"
                            aria-label="Delete Lesson"
                          >
                            <Trash2 size={14} strokeWidth={2.2} />
                          </button>
                          <div className="pointer-events-none absolute bottom-full mb-2 right-0 opacity-0 group-hover/tooltip:opacity-100 group-hover/tooltip:-translate-y-0.5 transition-all duration-150 z-50 whitespace-nowrap">
                            <div className="px-2.5 py-1 rounded-xl bg-rose-600 text-white text-[11px] font-semibold shadow-xl border border-rose-500">
                              Delete Lesson
                            </div>
                            <div className="w-1.5 h-1.5 bg-rose-600 border-r border-b border-rose-500 rotate-45 ml-auto mr-2.5 -mt-1 rounded-xs" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* LESSONS TABLE VIEW */
            <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-slate-50/80 dark:bg-slate-950/50 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="px-5 py-3.5">#</th>
                      <th className="px-5 py-3.5">Lesson Title</th>
                      <th className="px-5 py-3.5">Category</th>
                      <th className="px-5 py-3.5">Difficulty</th>
                      <th className="px-5 py-3.5">Duration</th>
                      <th className="px-5 py-3.5">Enrolled Views</th>
                      <th className="px-5 py-3.5">Status</th>
                      <th className="px-5 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                    {filteredLessons.map((l) => {
                      const isPublished = l.status === 'Published';
                      return (
                        <tr
                          key={l.id}
                          className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                        >
                          <td className="px-5 py-3.5 font-mono font-bold text-slate-400">
                            #{String(l.lessonNumber).padStart(2, '0')}
                          </td>
                          <td className="px-5 py-3.5">
                            <p className="font-bold text-slate-900 dark:text-white leading-tight">
                              {l.title}
                            </p>
                            <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                              {l.subtitle || l.description}
                            </p>
                          </td>
                          <td className="px-5 py-3.5 whitespace-nowrap">
                            <span className="inline-block px-2.5 py-0.5 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 text-xs font-semibold">
                              {l.category}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 whitespace-nowrap">
                            <span
                              className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                                l.difficulty === 'Beginner'
                                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                  : l.difficulty === 'Intermediate'
                                  ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                                  : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                              }`}
                            >
                              {l.difficulty}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 whitespace-nowrap text-slate-600 dark:text-slate-400 font-medium">
                            {l.duration}
                          </td>
                          <td className="px-5 py-3.5 whitespace-nowrap text-slate-700 dark:text-slate-300 font-semibold">
                            {l.views.toLocaleString()}
                          </td>
                          <td className="px-5 py-3.5 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => toggleLessonPublish(l.id)}
                                className={`group relative inline-flex h-4 w-8 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 ${
                                  isPublished ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'
                                }`}
                              >
                                <span
                                  className={`pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow-md transition duration-200 ease-in-out ${
                                    isPublished ? 'translate-x-4' : 'translate-x-0.5'
                                  }`}
                                />
                              </button>
                              <StatusBadge status={l.status} />
                            </div>
                          </td>
                          <td className="px-5 py-3.5 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* Inspect (Icon-Only) */}
                              <button
                                type="button"
                                onClick={() => {
                                  setInspectItem(l);
                                  setInspectType('lesson');
                                }}
                                className="p-1.5 rounded-xl border border-purple-200/80 dark:border-purple-800/60 bg-purple-50/90 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/60 hover:border-purple-300 dark:hover:border-purple-700 hover:scale-105 active:scale-95 transition-all shadow-2xs cursor-pointer"
                                title="Inspect Lesson Drill"
                                aria-label="Inspect Lesson Drill"
                              >
                                <Eye size={13} strokeWidth={2.2} />
                              </button>
                              {/* Edit */}
                              <button
                                type="button"
                                onClick={() => handleOpenEdit(l, 'lesson')}
                                className="p-1.5 rounded-xl border border-blue-200/80 dark:border-blue-800/60 bg-blue-50/90 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 hover:bg-blue-100 transition-all cursor-pointer"
                              >
                                <Edit size={13} strokeWidth={2.2} />
                              </button>
                              {/* Delete */}
                              <button
                                type="button"
                                onClick={() => handleDeleteLesson(l.id, l.title)}
                                className="p-1.5 rounded-xl border border-rose-200/80 dark:border-rose-800/60 bg-rose-50/90 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 transition-all cursor-pointer"
                              >
                                <Trash2 size={13} strokeWidth={2.2} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {/* ── 7. CATEGORIES MATRIX TAB CONTENT ── */}
      {activeTab === 'categories' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categoryMatrix.map((cat) => (
            <div
              key={cat.name}
              className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
                    <Layers size={18} />
                  </div>
                  <span className={`h-2.5 w-2.5 rounded-full ${cat.dot}`} />
                </div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white font-display">
                  {cat.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Structured learning tier featuring progressive touch-typing drills.
                </p>

                <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-center">
                  <div className="p-2 rounded-xl bg-slate-50/70 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800/80">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">
                      Modules
                    </span>
                    <p className="text-sm font-bold text-purple-600 dark:text-purple-400 mt-0.5">
                      {cat.coursesCount} Active
                    </p>
                  </div>

                  <div className="p-2 rounded-xl bg-slate-50/70 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800/80">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">
                      Lessons
                    </span>
                    <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                      {cat.lessonsCount} Lessons
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
                <span>{cat.views.toLocaleString()} Total Views</span>
                <span className="text-emerald-600 dark:text-emerald-400">
                  {cat.avgCompletion}% Avg Comp.
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── 8. SLIDE-OVER INSPECT SIDE DRAWER (PORTAL + FRAMER MOTION) ── */}
      {typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {inspectItem && (
              <div className="fixed inset-0 z-[70] flex justify-end">
                {/* Backdrop with Blur */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => setInspectItem(null)}
                  className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs cursor-pointer"
                />

                {/* Drawer Content */}
                <motion.div
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ type: 'spring', damping: 28, stiffness: 280 }}
                  className="relative z-10 w-full max-w-xl h-full bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col justify-between overflow-hidden"
                >
                  {/* Drawer Header */}
                  <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/50">
                    <div className="flex items-center gap-2.5">
                      <div className="grid h-9 w-9 place-items-center rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                        {inspectType === 'course' ? <Layers size={18} /> : <BookOpen size={18} />}
                      </div>
                      <div>
                        <h2 className="text-base font-bold text-slate-900 dark:text-white font-display">
                          {inspectType === 'course' ? 'Curriculum Module Dossier' : 'Lesson Details Dossier'}
                        </h2>
                        <span className="text-xs text-slate-400 font-mono">
                          ID: {inspectItem.id || inspectItem.slug}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setInspectItem(null)}
                      className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                      aria-label="Close Drawer"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  {/* Drawer Body (Scrollable) */}
                  <div className="p-6 space-y-6 flex-1 overflow-y-auto">
                    {/* Top Badges */}
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        {inspectItem.lessonNumber && (
                          <span className="px-2.5 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-mono font-bold text-xs">
                            Lesson #{inspectItem.lessonNumber}
                          </span>
                        )}
                        <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 text-xs font-bold">
                          {inspectItem.category}
                        </span>
                        <span
                          className={`text-xs font-bold px-2.5 py-0.5 rounded-md ${
                            inspectItem.difficulty === 'Beginner'
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                              : inspectItem.difficulty === 'Intermediate'
                              ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                              : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                          }`}
                        >
                          {inspectItem.difficulty}
                        </span>
                      </div>

                      <StatusBadge status={inspectItem.status} />
                    </div>

                    {/* Title & Description */}
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white font-display">
                        {inspectItem.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                        {inspectItem.description || inspectItem.subtitle}
                      </p>
                    </div>

                    {/* Interactive Highlight Keys Keycaps (If Lesson) */}
                    {inspectType === 'lesson' && inspectItem.highlightKeys && (
                      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-2.5">
                          <Key size={14} className="text-purple-500" />
                          Keyboard Tactile Highlight Keys
                        </span>
                        <div className="flex flex-wrap items-center gap-2">
                          {inspectItem.highlightKeys.map((k, i) => (
                            <kbd
                              key={i}
                              className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 text-sm font-mono font-bold text-purple-600 dark:text-purple-400 border border-slate-300 dark:border-slate-700 shadow-sm"
                            >
                              {k === ' ' ? 'SPACEBAR' : k}
                            </kbd>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Drill Practice Text Passage (If Lesson) */}
                    {inspectType === 'lesson' && inspectItem.drillText && (
                      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                            <FileText size={14} className="text-blue-500" />
                            Drill Text Practice Passage
                          </span>
                          <span className="text-[11px] font-mono text-slate-400">
                            {inspectItem.drillText.split(' ').filter(Boolean).length} Words |{' '}
                            {inspectItem.drillText.length} Chars
                          </span>
                        </div>
                        <p className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed select-all">
                          {inspectItem.drillText}
                        </p>
                      </div>
                    )}

                    {/* Quiz Inspector (If Lesson) */}
                    {inspectType === 'lesson' && inspectItem.quiz && (
                      <div className="p-4 rounded-2xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200/80 dark:border-purple-900/60 space-y-3">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-purple-700 dark:text-purple-300">
                          <HelpCircle size={14} />
                          <span>Interactive Lesson Quiz Question</span>
                        </div>
                        <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">
                          "{inspectItem.quiz.question}"
                        </p>
                        <div className="space-y-1.5">
                          {inspectItem.quiz.options.map((opt, idx) => {
                            const isCorrect = idx === inspectItem.quiz.correctIndex;
                            return (
                              <div
                                key={idx}
                                className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs border ${
                                  isCorrect
                                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 font-semibold'
                                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                                }`}
                              >
                                <span>{opt}</span>
                                {isCorrect && (
                                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                                    <Check size={13} strokeWidth={3} />
                                    Correct Answer
                                  </span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                        {inspectItem.quiz.explanation && (
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 italic">
                            Explanation: {inspectItem.quiz.explanation}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Included Lessons Outline (If Course) */}
                    {inspectType === 'course' && (
                      <div className="space-y-2">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                          Curriculum Outline ({inspectItem.lessons} Lessons)
                        </h4>
                        <div className="space-y-1.5">
                          {lessons
                            .filter(
                              (l) =>
                                l.category.toLowerCase() === inspectItem.category.toLowerCase() ||
                                (inspectItem.lessonSlugs && inspectItem.lessonSlugs.includes(l.slug))
                            )
                            .map((l) => (
                              <div
                                key={l.id}
                                onClick={() => {
                                  setInspectItem(l);
                                  setInspectType('lesson');
                                }}
                                className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40 hover:bg-purple-50/60 dark:hover:bg-purple-950/40 hover:border-purple-300 dark:hover:border-purple-800 transition-all cursor-pointer group/item"
                                title="Click to inspect this chapter drill"
                              >
                                <div className="flex items-center gap-2.5">
                                  <span className="font-mono text-xs font-bold text-purple-600 dark:text-purple-400">
                                    #{String(l.lessonNumber).padStart(2, '0')}
                                  </span>
                                  <div>
                                    <p className="text-xs font-bold text-slate-900 dark:text-white group-hover/item:text-purple-600 dark:group-hover/item:text-purple-400 transition-colors">
                                      {l.title}
                                    </p>
                                    <span className="text-[10px] text-slate-400">{l.duration} • Click to inspect drill</span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <StatusBadge status={l.status} />
                                  <ArrowRight size={13} className="text-slate-400 group-hover/item:text-purple-600 group-hover/item:translate-x-0.5 transition-all" />
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}

                    {/* Telemetry Engagement Metrics */}
                    <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                        Student Engagement Telemetry
                      </h4>
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                          <span className="text-[10px] text-slate-400 uppercase font-semibold">
                            Total Typists
                          </span>
                          <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                            {inspectItem.views ? inspectItem.views.toLocaleString() : '0'}
                          </p>
                        </div>
                        <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                          <span className="text-[10px] text-slate-400 uppercase font-semibold">
                            Completion
                          </span>
                          <p className="text-sm font-bold text-purple-600 dark:text-purple-400 mt-0.5">
                            {inspectItem.completionRate}%
                          </p>
                        </div>
                        <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                          <span className="text-[10px] text-slate-400 uppercase font-semibold">
                            Avg Speed
                          </span>
                          <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                            {inspectItem.avgWpmGain
                              ? `+${inspectItem.avgWpmGain} WPM`
                              : `${inspectItem.avgWpm || 35} WPM`}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Drawer Sticky Footer with Top-Positioned Tooltips */}
                  <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/70 flex items-center justify-between gap-3">
                    {/* Toggle Status Switch Slider */}
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          inspectType === 'course'
                            ? toggleCoursePublish(inspectItem.id)
                            : toggleLessonPublish(inspectItem.id)
                        }
                        className={`group relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 focus:outline-none ${
                          inspectItem.status === 'Published'
                            ? 'bg-emerald-500'
                            : 'bg-slate-300 dark:bg-slate-700'
                        }`}
                        title="Toggle Publish Status"
                      >
                        <span
                          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition duration-200 ease-in-out ${
                            inspectItem.status === 'Published'
                              ? 'translate-x-4'
                              : 'translate-x-0.5'
                          }`}
                        />
                      </button>
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        {inspectItem.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Edit Button */}
                      <button
                        type="button"
                        onClick={() => {
                          const item = inspectItem;
                          const type = inspectType;
                          setInspectItem(null);
                          handleOpenEdit(item, type);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-blue-200/80 dark:border-blue-800/60 bg-blue-50/90 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 hover:bg-blue-100 text-xs font-semibold transition-all cursor-pointer"
                      >
                        <Edit size={14} />
                        <span>Edit</span>
                      </button>

                      {/* Delete Button */}
                      <button
                        type="button"
                        onClick={() =>
                          inspectType === 'course'
                            ? handleDeleteCourse(inspectItem.id, inspectItem.title)
                            : handleDeleteLesson(inspectItem.id, inspectItem.title)
                        }
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-rose-200/80 dark:border-rose-800/60 bg-rose-50/90 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 text-xs font-semibold transition-all cursor-pointer"
                      >
                        <Trash2 size={14} />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>,
          document.body
        )}

      {/* ── 9. CREATE / EDIT MODAL (ZERO NATIVE SELECT!) ── */}
      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={
          editingItem
            ? `Edit ${modalMode === 'course' ? 'Curriculum Course' : 'Lesson Drill'}`
            : `Create New ${modalMode === 'course' ? 'Curriculum Course' : 'Lesson Drill'}`
        }
        subtitle="Configure title, category, difficulty level, and student drill text."
        maxWidth="max-w-xl"
        footer={
          <div className="flex items-center justify-end gap-2 w-full">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveModal}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-60 text-white text-xs font-semibold transition-all shadow-sm shadow-purple-500/30 cursor-pointer"
            >
              {isSubmitting ? 'Saving...' : 'Save Curriculum Item'}
            </button>
          </div>
        }
      >
        <form onSubmit={handleSaveModal} className="space-y-4">
          {/* Mode Switcher if creating fresh */}
          {!editingItem && (
            <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setModalMode('course')}
                className={`flex-1 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  modalMode === 'course'
                    ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                Curriculum Module
              </button>
              <button
                type="button"
                onClick={() => setModalMode('lesson')}
                className={`flex-1 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  modalMode === 'lesson'
                    ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                Granular Lesson Drill
              </button>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Title
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder={
                modalMode === 'course'
                  ? 'e.g. Touch Typing Foundations'
                  : 'e.g. Home Row Foundation Drill'
              }
              className="w-full h-9 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 px-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
            />
          </div>

          {/* Category Custom Pill Chips (Zero Native Select!) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Category
            </label>
            <div className="flex flex-wrap gap-1.5">
              {categoryOptions
                .filter((c) => c.value !== 'All')
                .map((cat) => {
                  const isSel = formData.category === cat.value;
                  return (
                    <button
                      key={cat.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, category: cat.value })}
                      className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                        isSel
                          ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                          : 'bg-slate-50 dark:bg-slate-950/60 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                      }`}
                    >
                      {cat.value}
                    </button>
                  );
                })}
            </div>
          </div>

          {/* Difficulty Custom Pill Chips (Zero Native Select!) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Difficulty
            </label>
            <div className="flex flex-wrap gap-1.5">
              {['Beginner', 'Intermediate', 'Advanced', 'Expert'].map((d) => {
                const isSel = formData.difficulty === d;
                return (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setFormData({ ...formData, difficulty: d })}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                      isSel
                        ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-950/60 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                    }`}
                  >
                    {d}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Publication Status Selection (Published vs Draft) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Publication Status
            </label>
            <div className="flex gap-2">
              {['Published', 'Draft'].map((st) => {
                const isSel = (formData.status || 'Published') === st;
                return (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setFormData({ ...formData, status: st })}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                      isSel
                        ? st === 'Published'
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                          : 'bg-amber-600 text-white border-amber-600 shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-950/60 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                    }`}
                  >
                    {st === 'Published' ? '🚀 Published (Live on Site)' : '📝 Draft (Hidden)'}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Lesson Count or Duration */}
          <div className="grid grid-cols-2 gap-3">
            {modalMode === 'course' ? (
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Lessons Count
                </label>
                <input
                  type="number"
                  min={1}
                  max={30}
                  value={formData.lessons}
                  onChange={(e) => setFormData({ ...formData, lessons: Number(e.target.value) })}
                  className="w-full h-9 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 px-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                />
              </div>
            ) : (
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Estimated Duration
                </label>
                <input
                  type="text"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  placeholder="e.g. 5 min"
                  className="w-full h-9 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 px-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                />
              </div>
            )}

            {modalMode === 'lesson' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Highlight Keys (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.highlightKeys}
                  onChange={(e) => setFormData({ ...formData, highlightKeys: e.target.value })}
                  placeholder="e.g. A, S, D, F, J, K, L"
                  className="w-full h-9 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 px-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                />
              </div>
            )}
          </div>

          {/* Drill Text (If Lesson) */}
          {modalMode === 'lesson' && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Drill Practice Passage
                </label>
                <span className="text-[11px] font-mono text-slate-400">
                  {formData.drillText.split(' ').filter(Boolean).length} Words |{' '}
                  {formData.drillText.length} Chars
                </span>
              </div>
              <textarea
                rows={3}
                value={formData.drillText}
                onChange={(e) => setFormData({ ...formData, drillText: e.target.value })}
                placeholder="Type the practice drill text for student keystroke practice..."
                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 p-2.5 font-mono text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
              />
            </div>
          )}

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Description & Objectives
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Explain the concepts covered in this module..."
              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 p-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
            />
          </div>
        </form>
      </AdminModal>
    </div>
  );
};

export default AdminLearning;
