import React, { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy,
  Flame,
  Plus,
  Edit,
  Globe,
  EyeOff,
  Calendar,
  Users,
  Zap,
  Target,
  Clock,
  Download,
  Trash2,
  X,
  ChevronDown,
  Check,
  Activity,
  Sparkles,
  Filter,
  RotateCcw,
  LayoutGrid,
  List,
  Eye,
  BookOpen,
  FileText,
  CheckCircle2,
  Play,
  Search,
  Layers,
} from 'lucide-react';
import { toast } from 'react-toastify';
import StatCard from '../../components/admin/StatCard';
import StatusBadge from '../../components/admin/StatusBadge';
import AdminModal from '../../components/admin/AdminModal';
import Pagination from '../../components/admin/Pagination';
import UserAvatar from '../../components/common/UserAvatar';
import { dailyChallengesData } from '../../data/adminMockData';

// Difficulty Filter Options
const difficultyOptions = [
  { value: 'All', label: 'All Difficulties', dot: 'bg-slate-400' },
  { value: 'Easy', label: 'Easy Practice', dot: 'bg-emerald-500' },
  { value: 'Medium', label: 'Medium Challenge', dot: 'bg-amber-500' },
  { value: 'Hard', label: 'Hard Mastery', dot: 'bg-rose-500' },
];

// Status Filter Options
const statusOptions = [
  { value: 'All', label: 'All Contests', dot: 'bg-slate-400' },
  { value: 'Active', label: 'Active Contest', dot: 'bg-emerald-500' },
  { value: 'Scheduled', label: 'Scheduled Ahead', dot: 'bg-blue-500' },
  { value: 'Completed', label: 'Completed Sprints', dot: 'bg-slate-400' },
];

// Sort Options
const sortOptions = [
  { value: 'newest', label: 'Newest Date' },
  { value: 'participants_desc', label: 'Most Participants' },
  { value: 'speed_desc', label: 'Highest Avg Speed (WPM)' },
  { value: 'accuracy_desc', label: 'Highest Accuracy' },
];

// Custom Styled Difficulty Filter Dropdown (Zero Native OS Grey Box Glitch)
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
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={`h-2 w-2 rounded-full shrink-0 ${opt.dot}`} />
                    <span className="truncate">{opt.label}</span>
                  </div>

                  {isSelected && (
                    <Check size={13} className="text-purple-600 dark:text-purple-400 stroke-[2.5] shrink-0" />
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
        <Sparkles
          size={13}
          className={value !== 'All' ? 'text-purple-600 dark:text-purple-400' : 'text-slate-400'}
        />
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
              Filter By Contest Status
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
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={`h-2 w-2 rounded-full shrink-0 ${opt.dot}`} />
                    <span className="truncate">{opt.label}</span>
                  </div>

                  {isSelected && (
                    <Check size={13} className="text-purple-600 dark:text-purple-400 stroke-[2.5] shrink-0" />
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
        aria-label="Sort challenges"
      >
        <Activity size={13} className="text-purple-500 shrink-0" />
        <span>Sort: {selected.label}</span>
        <ChevronDown
          size={12}
          className={`text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1.5 z-50 w-56 rounded-2xl border border-slate-200/90 dark:border-slate-700/80 bg-white dark:bg-slate-900 p-1.5 shadow-2xl shadow-slate-950/25 backdrop-blur-md animate-in fade-in zoom-in-95 duration-150">
          <div className="px-2.5 py-1.5 mb-1 border-b border-slate-100 dark:border-slate-800">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Sort Challenges By
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

export const AdminChallenges = () => {
  const [challenges, setChallenges] = useState(dailyChallengesData);
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingChallenge, setEditingChallenge] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null); // 'difficulty' | 'status' | 'sort' | null

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    difficulty: 'Medium',
    duration: '60s',
    startDate: '',
    endDate: '',
    passage: '',
  });

  // Close dropdown on click outside or Escape
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
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
        setSelectedChallenge(null);
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

  // Filter & Sort Logic
  const filteredChallenges = useMemo(() => {
    let result = challenges.filter((ch) => {
      const matchesSearch =
        ch.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ch.passage.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ch.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDifficulty =
        difficultyFilter === 'All' || ch.difficulty.toLowerCase() === difficultyFilter.toLowerCase();
      const matchesStatus =
        statusFilter === 'All' || ch.status.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesDifficulty && matchesStatus;
    });

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'participants_desc') return b.participants - a.participants;
      if (sortBy === 'speed_desc') return b.avgWpm - a.avgWpm;
      if (sortBy === 'accuracy_desc') return b.avgAccuracy - a.avgAccuracy;
      return 0; // Default order
    });

    return result;
  }, [challenges, searchQuery, difficultyFilter, statusFilter, sortBy]);

  // Derived KPI Stats
  const kpiStats = useMemo(() => {
    const active = challenges.find((c) => c.status === 'Active');
    const totalRuns = challenges.reduce((sum, c) => sum + (c.participants || 0), 0);
    const completedOrActive = challenges.filter((c) => c.avgWpm > 0);
    const avgSpeed =
      completedOrActive.length > 0
        ? (completedOrActive.reduce((sum, c) => sum + c.avgWpm, 0) / completedOrActive.length).toFixed(1)
        : '0.0';
    const avgAccuracy =
      completedOrActive.length > 0
        ? (
            completedOrActive.reduce((sum, c) => sum + c.avgAccuracy, 0) / completedOrActive.length
          ).toFixed(1)
        : '0.0';

    return {
      activeParticipants: active ? `${active.participants.toLocaleString()} Typists` : 'None Active',
      activeTitle: active ? active.title : 'No Contest Live',
      totalRuns: totalRuns.toLocaleString(),
      avgSpeed: `${avgSpeed} WPM`,
      avgAccuracy: `${avgAccuracy}%`,
    };
  }, [challenges]);

  // Handle Create Modal Open
  const handleOpenCreate = () => {
    setEditingChallenge(null);
    const now = new Date();
    const tomorrow = new Date(Date.now() + 86400000);
    setFormData({
      title: '',
      difficulty: 'Medium',
      duration: '60s',
      startDate: now.toISOString().slice(0, 16),
      endDate: tomorrow.toISOString().slice(0, 16),
      passage: '',
    });
    setIsModalOpen(true);
  };

  // Handle Edit Modal Open
  const handleOpenEdit = (ch) => {
    setEditingChallenge(ch);
    setFormData({
      title: ch.title,
      difficulty: ch.difficulty,
      duration: ch.duration || '60s',
      startDate: ch.startDate ? ch.startDate.replace(' ', 'T') : '',
      endDate: ch.endDate ? ch.endDate.replace(' ', 'T') : '',
      passage: ch.passage,
    });
    setIsModalOpen(true);
  };

  // Handle Save
  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.passage.trim()) {
      toast.error('Please enter challenge title and passage text', { position: 'top-right' });
      return;
    }

    if (editingChallenge) {
      setChallenges((prev) =>
        prev.map((c) =>
          c.id === editingChallenge.id
            ? {
                ...c,
                title: formData.title,
                difficulty: formData.difficulty,
                duration: formData.duration,
                startDate: formData.startDate.replace('T', ' '),
                endDate: formData.endDate.replace('T', ' '),
                passage: formData.passage,
              }
            : c
        )
      );
      if (selectedChallenge && selectedChallenge.id === editingChallenge.id) {
        setSelectedChallenge((prev) => ({
          ...prev,
          title: formData.title,
          difficulty: formData.difficulty,
          duration: formData.duration,
          startDate: formData.startDate.replace('T', ' '),
          endDate: formData.endDate.replace('T', ' '),
          passage: formData.passage,
        }));
      }
      toast.success(`Challenge "${formData.title}" updated successfully!`, {
        position: 'top-right',
      });
    } else {
      const newCh = {
        id: `ch-0${challenges.length + 1}`,
        title: formData.title,
        difficulty: formData.difficulty,
        duration: formData.duration,
        participants: 0,
        avgWpm: 0,
        avgAccuracy: 0,
        bestWpm: 0,
        topPerformer: 'Contest scheduled',
        status: 'Scheduled',
        startDate: formData.startDate.replace('T', ' '),
        endDate: formData.endDate.replace('T', ' '),
        passage: formData.passage,
        topScores: [],
      };
      setChallenges((prev) => [newCh, ...prev]);
      toast.success(`New daily challenge published!`, { position: 'top-right' });
    }
    setIsModalOpen(false);
  };

  // Toggle Publish / Active
  const togglePublish = (id) => {
    let nextStatus = '';
    setChallenges((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          nextStatus = c.status === 'Active' ? 'Scheduled' : 'Active';
          return { ...c, status: nextStatus };
        }
        return c;
      })
    );

    if (selectedChallenge && selectedChallenge.id === id) {
      setSelectedChallenge((prev) => ({
        ...prev,
        status: prev.status === 'Active' ? 'Scheduled' : 'Active',
      }));
    }

    if (nextStatus === 'Active') {
      toast.success(`Challenge activated for today's community sprint!`, {
        position: 'top-right',
      });
    } else {
      toast.info(`Challenge status set to Scheduled.`, { position: 'top-right' });
    }
  };

  // Delete Challenge
  const handleDeleteChallenge = (id, title) => {
    setChallenges((prev) => prev.filter((c) => c.id !== id));
    if (selectedChallenge && selectedChallenge.id === id) {
      setSelectedChallenge(null);
    }
    toast.success(`Challenge "${title}" deleted from platform`, { position: 'top-right' });
  };

  // Export CSV
  const handleExportCSV = () => {
    if (filteredChallenges.length === 0) {
      toast.error('No challenge records to export', { position: 'top-right' });
      return;
    }
    const headers = [
      'Challenge ID',
      'Title',
      'Difficulty',
      'Duration',
      'Participants',
      'Avg Speed (WPM)',
      'Avg Accuracy (%)',
      'Best WPM',
      'Top Performer',
      'Status',
      'Start Date',
      'End Date',
    ];
    const rows = filteredChallenges.map((c) => [
      c.id,
      `"${c.title}"`,
      c.difficulty,
      c.duration || '60s',
      c.participants,
      c.avgWpm,
      `${c.avgAccuracy}%`,
      c.bestWpm || 0,
      `"${c.topPerformer || 'N/A'}"`,
      c.status,
      `"${c.startDate}"`,
      `"${c.endDate}"`,
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `tara_typing_daily_challenges_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Exported ${filteredChallenges.length} challenges to CSV!`, {
      position: 'top-right',
    });
  };

  // Reset Filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setDifficultyFilter('All');
    setStatusFilter('All');
    setSortBy('newest');
    toast.info('Filters reset to default view', { position: 'top-right' });
  };

  const hasActiveFilters =
    searchQuery || difficultyFilter !== 'All' || statusFilter !== 'All' || sortBy !== 'newest';

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* ── 1. HEADER & QUICK ACTIONS ── */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 text-xs font-bold uppercase tracking-wider border border-purple-500/20">
              Community Contests
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              IST Midnight Auto-Reset
            </span>
          </div>
          <h1 className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-display">
            Daily Challenges Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Curate 24-hour typing sprints, monitor community participants, and configure challenge passages.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
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
            <span>Create Challenge</span>
          </button>
        </div>
      </div>

      {/* ── 2. TOP 4 STANDARDIZED KPI METRICS (MATCHING ADMIN DASHBOARD) ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Card 1: Active Contest Today */}
        <StatCard
          title="Active Contest Today"
          value={kpiStats.activeParticipants}
          change={24.5}
          isPositive={true}
          timeframe={kpiStats.activeTitle}
          icon={Flame}
          hoverEffect="purple"
          colorClass="from-purple-500/20 to-indigo-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20"
        />

        {/* Card 2: Total Challenge Runs */}
        <StatCard
          title="Total Challenge Runs"
          value={kpiStats.totalRuns}
          change={18.2}
          isPositive={true}
          timeframe="community sprint entries"
          icon={Users}
          hoverEffect="blue"
          colorClass="from-blue-500/20 to-cyan-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
        />

        {/* Card 3: Avg Community Speed */}
        <StatCard
          title="Avg Community Speed"
          value={kpiStats.avgSpeed}
          change={5.1}
          isPositive={true}
          timeframe="curated passage speed"
          icon={Zap}
          hoverEffect="emerald"
          colorClass="from-emerald-500/20 to-teal-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
        />

        {/* Card 4: Accuracy Benchmark */}
        <StatCard
          title="Accuracy Benchmark"
          value={kpiStats.avgAccuracy}
          change={1.2}
          isPositive={true}
          timeframe="precision across all sprints"
          icon={Target}
          hoverEffect="amber"
          colorClass="from-amber-500/20 to-yellow-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
        />
      </div>

      {/* ── 3. FILTER TOOLBAR & VIEW TOGGLE ── */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-3.5 sm:p-4 shadow-sm">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search challenges by title, passage text..."
            className="w-full h-9 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 pl-9 pr-3 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Dropdown Filters & Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Difficulty Dropdown */}
          <DifficultyFilterDropdown
            value={difficultyFilter}
            onChange={(val) => {
              setDifficultyFilter(val);
              setOpenDropdown(null);
            }}
            isOpen={openDropdown === 'difficulty'}
            onToggle={() =>
              setOpenDropdown(openDropdown === 'difficulty' ? null : 'difficulty')
            }
          />

          {/* Status Dropdown */}
          <StatusFilterDropdown
            value={statusFilter}
            onChange={(val) => {
              setStatusFilter(val);
              setOpenDropdown(null);
            }}
            isOpen={openDropdown === 'status'}
            onToggle={() => setOpenDropdown(openDropdown === 'status' ? null : 'status')}
          />

          {/* Sort By Dropdown */}
          <SortByDropdown
            value={sortBy}
            onChange={(val) => {
              setSortBy(val);
              setOpenDropdown(null);
            }}
            isOpen={openDropdown === 'sort'}
            onToggle={() => setOpenDropdown(openDropdown === 'sort' ? null : 'sort')}
          />

          {/* View Mode Toggle */}
          <div className="flex items-center p-0.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/80">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-2xs'
                  : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
              title="Card Grid View"
            >
              <LayoutGrid size={15} />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-2xs'
                  : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
              title="Table View"
            >
              <List size={15} />
            </button>
          </div>

          {/* Reset Filters */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="h-9 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 hover:border-purple-500/30 inline-flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Reset all filters"
            >
              <RotateCcw size={12} />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* ── 4. CHALLENGES VIEW: GRID OR TABLE ── */}
      {filteredChallenges.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="flex flex-col items-center justify-center gap-2">
            <Trophy size={36} className="text-slate-300 dark:text-slate-700 stroke-[1.5]" />
            <p className="font-semibold text-slate-600 dark:text-slate-300 text-sm">
              No daily challenges match your criteria
            </p>
            <p className="text-xs text-slate-400">
              Try adjusting the difficulty or status filters, or create a new daily challenge.
            </p>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="mt-2 px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>
      ) : viewMode === 'grid' ? (
        /* GRID CARDS VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {filteredChallenges.map((ch) => {
            const isActive = ch.status === 'Active';
            return (
              <div
                key={ch.id}
                className={`flex flex-col justify-between rounded-2xl border bg-white dark:bg-slate-900 p-5 shadow-sm hover:shadow-md transition-all duration-200 relative overflow-hidden group ${
                  isActive
                    ? 'border-purple-500/40 dark:border-purple-500/30 ring-1 ring-purple-500/20'
                    : 'border-slate-200/80 dark:border-slate-800'
                }`}
              >
                {/* Active Indicator Top Stripe */}
                {isActive && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-indigo-500 to-emerald-500" />
                )}

                <div>
                  {/* Top Badges & Switch Toggle */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                          ch.difficulty === 'Easy'
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                            : ch.difficulty === 'Medium'
                            ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                            : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                        }`}
                      >
                        {ch.difficulty}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-400 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 font-mono">
                        {ch.duration || '60s'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Pixel-Perfect Switch Slider */}
                      <button
                        type="button"
                        onClick={() => togglePublish(ch.id)}
                        className={`group relative inline-flex h-4 w-8 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 ${
                          isActive ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'
                        }`}
                        aria-label={`Toggle contest status for ${ch.title}`}
                        title={isActive ? 'Deactivate Challenge' : 'Activate Challenge for Today'}
                      >
                        <span
                          className={`pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow-md transition duration-200 ease-in-out ${
                            isActive ? 'translate-x-4' : 'translate-x-0.5'
                          }`}
                        />
                      </button>
                      <StatusBadge status={ch.status} />
                    </div>
                  </div>

                  {/* Title & Passage Excerpt */}
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-display leading-snug">
                    {ch.title}
                  </h3>

                  <div className="mt-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800 text-xs font-mono text-slate-600 dark:text-slate-400 line-clamp-2 italic">
                    "{ch.passage}"
                  </div>

                  {/* 3-Column Participation & Performance Stats */}
                  <div className="grid grid-cols-3 gap-2 mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-800 text-center">
                    <div className="p-2 rounded-xl bg-slate-50/70 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800/80">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold flex items-center justify-center gap-1">
                        <Users size={11} className="text-blue-500" /> Players
                      </span>
                      <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                        {ch.participants.toLocaleString()}
                      </p>
                    </div>

                    <div className="p-2 rounded-xl bg-slate-50/70 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800/80">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold flex items-center justify-center gap-1">
                        <Zap size={11} className="text-purple-500" /> Avg Speed
                      </span>
                      <p className="text-sm font-bold text-purple-600 dark:text-purple-400 mt-0.5">
                        {ch.avgWpm > 0 ? `${ch.avgWpm} WPM` : '-'}
                      </p>
                    </div>

                    <div className="p-2 rounded-xl bg-slate-50/70 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800/80">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold flex items-center justify-center gap-1">
                        <Target size={11} className="text-emerald-500" /> Accuracy
                      </span>
                      <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                        {ch.avgAccuracy > 0 ? `${ch.avgAccuracy}%` : '-'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1 text-slate-400 font-medium">
                    <Calendar size={12} />
                    <span>{ch.startDate.split(' ')[0]}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Inspect Button (Purple) */}
                    <div className="relative group/tooltip flex items-center">
                      <button
                        type="button"
                        onClick={() => setSelectedChallenge(ch)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-purple-200/80 dark:border-purple-800/60 bg-purple-50/90 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/60 hover:border-purple-300 dark:hover:border-purple-700 hover:scale-105 active:scale-95 transition-all shadow-2xs shadow-purple-500/10 font-semibold cursor-pointer"
                        title="Inspect Contest Dossier"
                        aria-label="Inspect Contest Dossier"
                      >
                        <Eye size={14} strokeWidth={2.2} />
                        <span>Inspect</span>
                      </button>
                      <div className="pointer-events-none absolute bottom-full mb-2 left-1/2 -translate-x-1/2 opacity-0 group-hover/tooltip:opacity-100 group-hover/tooltip:-translate-y-0.5 transition-all duration-150 z-50 whitespace-nowrap">
                        <div className="px-2.5 py-1 rounded-xl bg-slate-900 text-white dark:bg-slate-800 dark:text-white text-[11px] font-semibold shadow-xl border border-slate-700/60">
                          Inspect Contest Dossier
                        </div>
                        <div className="w-1.5 h-1.5 bg-slate-900 dark:bg-slate-800 border-r border-b border-slate-700/60 rotate-45 mx-auto -mt-1 rounded-xs" />
                      </div>
                    </div>

                    {/* Edit Button (Blue) */}
                    <div className="relative group/tooltip flex items-center">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(ch)}
                        className="p-1.5 rounded-xl border border-blue-200/80 dark:border-blue-800/60 bg-blue-50/90 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/60 hover:border-blue-300 dark:hover:border-blue-700 hover:scale-105 active:scale-95 transition-all shadow-2xs shadow-blue-500/10 cursor-pointer"
                        title="Edit Challenge"
                        aria-label="Edit Challenge"
                      >
                        <Edit size={14} strokeWidth={2.2} />
                      </button>
                      <div className="pointer-events-none absolute bottom-full mb-2 left-1/2 -translate-x-1/2 opacity-0 group-hover/tooltip:opacity-100 group-hover/tooltip:-translate-y-0.5 transition-all duration-150 z-50 whitespace-nowrap">
                        <div className="px-2.5 py-1 rounded-xl bg-slate-900 text-white dark:bg-slate-800 dark:text-white text-[11px] font-semibold shadow-xl border border-slate-700/60">
                          Edit Challenge
                        </div>
                        <div className="w-1.5 h-1.5 bg-slate-900 dark:bg-slate-800 border-r border-b border-slate-700/60 rotate-45 mx-auto -mt-1 rounded-xs" />
                      </div>
                    </div>

                    {/* Delete Button (Rose) */}
                    <div className="relative group/tooltip flex items-center">
                      <button
                        type="button"
                        onClick={() => handleDeleteChallenge(ch.id, ch.title)}
                        className="p-1.5 rounded-xl border border-rose-200/80 dark:border-rose-800/60 bg-rose-50/90 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/60 hover:border-rose-300 dark:hover:border-rose-700 hover:scale-105 active:scale-95 transition-all shadow-2xs shadow-rose-500/10 cursor-pointer"
                        title="Delete Challenge"
                        aria-label="Delete Challenge"
                      >
                        <Trash2 size={14} strokeWidth={2.2} />
                      </button>
                      <div className="pointer-events-none absolute bottom-full mb-2 right-0 opacity-0 group-hover/tooltip:opacity-100 group-hover/tooltip:-translate-y-0.5 transition-all duration-150 z-50 whitespace-nowrap">
                        <div className="px-2.5 py-1 rounded-xl bg-rose-600 text-white text-[11px] font-semibold shadow-xl border border-rose-500">
                          Delete Challenge
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
        /* TABLE VIEW */
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
          <div className="overflow-x-auto stylish-scrollbar">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50/70 dark:bg-slate-950/40 text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-5 py-3.5">Challenge ID & Date</th>
                  <th className="px-5 py-3.5">Title & Passage</th>
                  <th className="px-5 py-3.5">Difficulty</th>
                  <th className="px-5 py-3.5">Players</th>
                  <th className="px-5 py-3.5">Performance</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/70 dark:divide-slate-800">
                {filteredChallenges.map((ch) => {
                  const isActive = ch.status === 'Active';
                  return (
                    <tr
                      key={ch.id}
                      className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="px-5 py-4">
                        <div className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200">
                          {ch.id}
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <Calendar size={11} />
                          <span>{ch.startDate.split(' ')[0]}</span>
                        </div>
                      </td>

                      <td className="px-5 py-4 max-w-xs">
                        <p className="font-semibold text-slate-900 dark:text-white leading-tight">
                          {ch.title}
                        </p>
                        <p className="text-xs text-slate-400 line-clamp-1 italic mt-0.5 font-mono">
                          "{ch.passage}"
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                            ch.difficulty === 'Easy'
                              ? 'bg-emerald-500/10 text-emerald-600'
                              : ch.difficulty === 'Medium'
                              ? 'bg-amber-500/10 text-amber-600'
                              : 'bg-rose-500/10 text-rose-600'
                          }`}
                        >
                          {ch.difficulty}
                        </span>
                      </td>

                      <td className="px-5 py-4 font-bold text-slate-800 dark:text-slate-200">
                        {ch.participants.toLocaleString()}
                      </td>

                      <td className="px-5 py-4">
                        <div className="font-bold text-purple-600 dark:text-purple-400">
                          {ch.avgWpm > 0 ? `${ch.avgWpm} WPM` : '-'}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {ch.avgAccuracy > 0 ? `${ch.avgAccuracy}% acc` : '-'}
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => togglePublish(ch.id)}
                            className={`group relative inline-flex h-4 w-8 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 ${
                              isActive ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'
                            }`}
                          >
                            <span
                              className={`pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow-md transition duration-200 ease-in-out ${
                                isActive ? 'translate-x-4' : 'translate-x-0.5'
                              }`}
                            />
                          </button>
                          <StatusBadge status={ch.status} />
                        </div>
                      </td>

                      <td className="px-5 py-4 text-right">
                        <div className="inline-flex items-center gap-2 justify-end">
                          {/* Inspect Button (Purple / Eye) */}
                          <div className="relative group/tooltip flex items-center">
                            <button
                              type="button"
                              onClick={() => setSelectedChallenge(ch)}
                              className="p-2 rounded-xl border border-purple-200/80 dark:border-purple-800/60 bg-purple-50/90 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/60 hover:border-purple-300 dark:hover:border-purple-700 hover:scale-105 active:scale-95 transition-all shadow-2xs shadow-purple-500/10 cursor-pointer"
                              title="Inspect Contest Details"
                              aria-label="Inspect Contest Details"
                            >
                              <Eye size={15} strokeWidth={2.2} />
                            </button>
                            <div className="pointer-events-none absolute bottom-full mb-2 left-1/2 -translate-x-1/2 opacity-0 group-hover/tooltip:opacity-100 group-hover/tooltip:-translate-y-0.5 transition-all duration-150 z-50 whitespace-nowrap">
                              <div className="px-2.5 py-1 rounded-xl bg-slate-900 text-white dark:bg-slate-800 dark:text-white text-[11px] font-semibold shadow-xl border border-slate-700/60 flex items-center gap-1">
                                <span>Inspect Details</span>
                              </div>
                              <div className="w-1.5 h-1.5 bg-slate-900 dark:bg-slate-800 border-r border-b border-slate-700/60 rotate-45 mx-auto -mt-1 rounded-xs" />
                            </div>
                          </div>

                          {/* Edit Button (Blue / Edit) */}
                          <div className="relative group/tooltip flex items-center">
                            <button
                              type="button"
                              onClick={() => handleOpenEdit(ch)}
                              className="p-2 rounded-xl border border-blue-200/80 dark:border-blue-800/60 bg-blue-50/90 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/60 hover:border-blue-300 dark:hover:border-blue-700 hover:scale-105 active:scale-95 transition-all shadow-2xs shadow-blue-500/10 cursor-pointer"
                              title="Edit Challenge"
                              aria-label="Edit Challenge"
                            >
                              <Edit size={15} strokeWidth={2.2} />
                            </button>
                            <div className="pointer-events-none absolute bottom-full mb-2 left-1/2 -translate-x-1/2 opacity-0 group-hover/tooltip:opacity-100 group-hover/tooltip:-translate-y-0.5 transition-all duration-150 z-50 whitespace-nowrap">
                              <div className="px-2.5 py-1 rounded-xl bg-slate-900 text-white dark:bg-slate-800 dark:text-white text-[11px] font-semibold shadow-xl border border-slate-700/60 flex items-center gap-1">
                                <span>Edit Challenge</span>
                              </div>
                              <div className="w-1.5 h-1.5 bg-slate-900 dark:bg-slate-800 border-r border-b border-slate-700/60 rotate-45 mx-auto -mt-1 rounded-xs" />
                            </div>
                          </div>

                          {/* Delete Button (Rose / Trash) */}
                          <div className="relative group/tooltip flex items-center">
                            <button
                              type="button"
                              onClick={() => handleDeleteChallenge(ch.id, ch.title)}
                              className="p-2 rounded-xl border border-rose-200/80 dark:border-rose-800/60 bg-rose-50/90 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/60 hover:border-rose-300 dark:hover:border-rose-700 hover:scale-105 active:scale-95 transition-all shadow-2xs shadow-rose-500/10 cursor-pointer"
                              title="Delete Challenge"
                              aria-label="Delete Challenge"
                            >
                              <Trash2 size={15} strokeWidth={2.2} />
                            </button>
                            <div className="pointer-events-none absolute bottom-full mb-2 right-0 opacity-0 group-hover/tooltip:opacity-100 group-hover/tooltip:-translate-y-0.5 transition-all duration-150 z-50 whitespace-nowrap">
                              <div className="px-2.5 py-1 rounded-xl bg-rose-600 text-white text-[11px] font-semibold shadow-xl border border-rose-500 flex items-center gap-1">
                                <span>Delete Challenge</span>
                              </div>
                              <div className="w-1.5 h-1.5 bg-rose-600 border-r border-b border-rose-500 rotate-45 ml-auto mr-2.5 -mt-1 rounded-xs" />
                            </div>
                          </div>
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

      {/* ── 5. INSPECT CHALLENGE SLIDE-OVER SIDE DRAWER (PORTAL TO DOCUMENT.BODY) ── */}
      {typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {selectedChallenge && (
              <>
                {/* Backdrop */}
                <motion.div
                  key="challenge-drawer-backdrop"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.22, ease: 'easeOut' }}
                  className="fixed inset-0 z-[60] bg-slate-950/60 backdrop-blur-xs"
                  onClick={() => setSelectedChallenge(null)}
                  aria-hidden="true"
                />

                {/* Slide-Over Drawer Container */}
                <motion.div
                  key="challenge-drawer-panel"
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ type: 'spring', damping: 30, stiffness: 280 }}
                  className="fixed inset-y-0 right-0 z-[70] w-full max-w-md sm:max-w-xl h-screen max-h-screen bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col"
                  role="dialog"
                  aria-modal="true"
                  aria-label="Daily Challenge Dossier"
                >
                  {/* Drawer Header */}
                  <div className="flex items-center justify-between px-5 py-2.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/50 shrink-0">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                        <Flame size={15} />
                      </div>
                      <div>
                        <h2 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                          Daily Challenge Dossier
                        </h2>
                        <span className="font-mono text-[11px] text-purple-600 dark:text-purple-400 font-semibold">
                          {selectedChallenge.id} • {selectedChallenge.difficulty} Tier
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedChallenge(null)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                      title="Close Drawer (Esc)"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  {/* Drawer Scrollable Content */}
                  <div className="flex-1 overflow-y-auto p-5 space-y-4 stylish-scrollbar">
                    {/* Header Summary Card */}
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-purple-50/30 dark:from-slate-950/70 dark:to-purple-950/10 border border-purple-500/20 shadow-xs space-y-2.5">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                              selectedChallenge.difficulty === 'Easy'
                                ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                                : selectedChallenge.difficulty === 'Medium'
                                ? 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                                : 'bg-rose-500/10 text-rose-600 border border-rose-500/20'
                            }`}
                          >
                            {selectedChallenge.difficulty}
                          </span>
                          <h3 className="font-bold text-lg text-slate-900 dark:text-white mt-1 leading-snug">
                            {selectedChallenge.title}
                          </h3>
                        </div>

                        <StatusBadge status={selectedChallenge.status} />
                      </div>

                      {/* Metadata Badges */}
                      <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-200/70 dark:border-slate-800 text-[11px]">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-500/10 border border-purple-500/20 font-semibold text-purple-700 dark:text-purple-300">
                          <Clock size={12} className="text-purple-600 dark:text-purple-400 shrink-0" />
                          <span>Duration: {selectedChallenge.duration || '60s'}</span>
                        </div>

                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-medium">
                          <Calendar size={12} className="text-slate-400 shrink-0" />
                          <span>Active: {selectedChallenge.startDate.split(' ')[0]}</span>
                        </div>
                      </div>
                    </div>

                    {/* Curated Typing Passage Card */}
                    <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                          <FileText size={13} className="text-purple-500" />
                          Official Typing Passage
                        </span>
                        <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                          <span>{selectedChallenge.passage.length} characters</span>
                          <span>•</span>
                          <span>{selectedChallenge.passage.split(/\s+/).filter(Boolean).length} words</span>
                        </div>
                      </div>

                      <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200/70 dark:border-slate-800 text-xs sm:text-sm font-mono text-slate-800 dark:text-slate-200 leading-relaxed select-text">
                        {selectedChallenge.passage}
                      </div>
                    </div>

                    {/* Performance Benchmark Cards */}
                    <div className="grid grid-cols-2 gap-2.5">
                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800">
                        <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                          Total Typists
                        </span>
                        <div className="font-bold text-lg text-blue-600 dark:text-blue-400 mt-0.5">
                          {selectedChallenge.participants.toLocaleString()}
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800">
                        <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                          Avg Community Speed
                        </span>
                        <div className="font-bold text-lg text-purple-600 dark:text-purple-400 mt-0.5">
                          {selectedChallenge.avgWpm > 0 ? `${selectedChallenge.avgWpm} WPM` : 'Pending'}
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800">
                        <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                          Avg Accuracy
                        </span>
                        <div className="font-bold text-lg text-emerald-600 dark:text-emerald-400 mt-0.5">
                          {selectedChallenge.avgAccuracy > 0
                            ? `${selectedChallenge.avgAccuracy}%`
                            : 'Pending'}
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800">
                        <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                          Peak Session Speed
                        </span>
                        <div className="font-bold text-lg text-amber-600 dark:text-amber-400 mt-0.5">
                          {selectedChallenge.bestWpm > 0
                            ? `${selectedChallenge.bestWpm} WPM`
                            : 'No attempts'}
                        </div>
                      </div>
                    </div>

                    {/* Top Daily Performers List */}
                    <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                          <Trophy size={13} className="text-amber-500" />
                          Top Challenge Performers
                        </span>
                        <span className="text-[10px] text-slate-400">Podium Standings</span>
                      </div>

                      {selectedChallenge.topScores && selectedChallenge.topScores.length > 0 ? (
                        <div className="space-y-1.5">
                          {selectedChallenge.topScores.map((score) => (
                            <div
                              key={score.username}
                              className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800"
                            >
                              <div className="flex items-center gap-2.5">
                                <span
                                  className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                                    score.rank === 1
                                      ? 'bg-amber-500/20 text-amber-600'
                                      : score.rank === 2
                                      ? 'bg-slate-400/20 text-slate-600'
                                      : score.rank === 3
                                      ? 'bg-amber-700/20 text-amber-700'
                                      : 'bg-slate-100 text-slate-500'
                                  }`}
                                >
                                  {score.rank}
                                </span>
                                <UserAvatar
                                  src={score.avatar}
                                  name={score.user}
                                  username={score.username}
                                  className="h-6 w-6"
                                  textClassName="text-[10px] font-bold"
                                  rounded="rounded-md"
                                  firstLetterOnly
                                />
                                <div>
                                  <span className="text-xs font-bold text-slate-900 dark:text-white block leading-tight">
                                    {score.user}
                                  </span>
                                  <span className="text-[10px] text-purple-600 dark:text-purple-400 font-medium">
                                    @{score.username}
                                  </span>
                                </div>
                              </div>

                              <div className="text-right">
                                <span className="font-bold text-xs text-purple-600 dark:text-purple-400">
                                  {score.wpm} WPM
                                </span>
                                <span className="text-[10px] text-slate-400 block font-mono">
                                  {score.accuracy}% acc
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-slate-400 italic text-center py-4">
                          No submissions recorded yet for this scheduled contest.
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Drawer Sticky Footer with Top-Positioned Tooltips */}
                  <div className="px-5 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-950/80 shrink-0 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setSelectedChallenge(null)}
                      className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      Close
                    </button>

                    <div className="flex items-center gap-2.5">
                      {/* Publish / Unpublish Icon Button with Top Tooltip */}
                      <div className="relative group/tooltip flex items-center">
                        <button
                          type="button"
                          onClick={() => togglePublish(selectedChallenge.id)}
                          className={`p-2.5 rounded-xl border transition-all duration-150 hover:scale-105 active:scale-95 shadow-2xs cursor-pointer ${
                            selectedChallenge.status === 'Active'
                              ? 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800/60 hover:bg-amber-100'
                              : 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800/60 hover:bg-emerald-100'
                          }`}
                          aria-label={
                            selectedChallenge.status === 'Active'
                              ? 'Pause / Schedule Contest'
                              : 'Activate Contest'
                          }
                        >
                          {selectedChallenge.status === 'Active' ? (
                            <EyeOff size={16} strokeWidth={2.2} />
                          ) : (
                            <Globe size={16} strokeWidth={2.2} />
                          )}
                        </button>

                        {/* Top-Positioned Tooltip */}
                        <div className="pointer-events-none absolute bottom-full mb-2.5 left-1/2 -translate-x-1/2 opacity-0 group-hover/tooltip:opacity-100 group-hover/tooltip:-translate-y-1 transition-all duration-150 z-50 whitespace-nowrap">
                          <div className="px-3 py-1.5 rounded-xl bg-slate-900 text-white dark:bg-slate-800 dark:text-white text-[11px] font-semibold shadow-xl border border-slate-700/60 flex items-center gap-1.5">
                            <span>
                              {selectedChallenge.status === 'Active'
                                ? 'Unpublish / Pause Contest'
                                : 'Publish / Activate Contest'}
                            </span>
                          </div>
                          <div className="w-2 h-2 bg-slate-900 dark:bg-slate-800 border-r border-b border-slate-700/60 rotate-45 mx-auto -mt-1 rounded-xs" />
                        </div>
                      </div>

                      {/* Edit Icon Button with Top Tooltip */}
                      <div className="relative group/tooltip flex items-center">
                        <button
                          type="button"
                          onClick={() => {
                            const ch = selectedChallenge;
                            setSelectedChallenge(null);
                            handleOpenEdit(ch);
                          }}
                          className="p-2.5 rounded-xl border border-blue-200 dark:border-blue-800/60 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 hover:text-blue-700 transition-all hover:scale-105 active:scale-95 shadow-2xs shadow-blue-500/10 cursor-pointer"
                          aria-label="Edit Challenge"
                        >
                          <Edit size={16} strokeWidth={2.2} />
                        </button>

                        <div className="pointer-events-none absolute bottom-full mb-2.5 left-1/2 -translate-x-1/2 opacity-0 group-hover/tooltip:opacity-100 group-hover/tooltip:-translate-y-1 transition-all duration-150 z-50 whitespace-nowrap">
                          <div className="px-3 py-1.5 rounded-xl bg-slate-900 text-white dark:bg-slate-800 dark:text-white text-[11px] font-semibold shadow-xl border border-slate-700/60 flex items-center gap-1.5">
                            <Edit size={12} />
                            <span>Edit Challenge</span>
                          </div>
                          <div className="w-2 h-2 bg-slate-900 dark:bg-slate-800 border-r border-b border-slate-700/60 rotate-45 mx-auto -mt-1 rounded-xs" />
                        </div>
                      </div>

                      {/* Delete Icon Button with Top Tooltip */}
                      <div className="relative group/tooltip flex items-center">
                        <button
                          type="button"
                          onClick={() =>
                            handleDeleteChallenge(selectedChallenge.id, selectedChallenge.title)
                          }
                          className="p-2.5 rounded-xl text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800/60 hover:bg-rose-100 dark:hover:bg-rose-900/50 hover:text-rose-700 hover:scale-105 active:scale-95 transition-all shadow-2xs shadow-rose-500/10 cursor-pointer"
                          aria-label="Delete Challenge"
                        >
                          <Trash2 size={16} strokeWidth={2.2} />
                        </button>

                        <div className="pointer-events-none absolute bottom-full mb-2.5 right-0 opacity-0 group-hover/tooltip:opacity-100 group-hover/tooltip:-translate-y-1 transition-all duration-150 z-50 whitespace-nowrap">
                          <div className="px-3 py-1.5 rounded-xl bg-rose-600 text-white text-[11px] font-semibold shadow-xl border border-rose-500 flex items-center gap-1.5">
                            <Trash2 size={12} />
                            <span>Delete Challenge</span>
                          </div>
                          <div className="w-2 h-2 bg-rose-600 border-r border-b border-rose-500 rotate-45 ml-auto mr-3.5 -mt-1 rounded-xs" />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>,
          document.body
        )}

      {/* ── 6. CREATE / EDIT CHALLENGE MODAL (ZERO NATIVE SELECT) ── */}
      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingChallenge ? 'Edit Daily Challenge' : 'Create Daily Challenge'}
        subtitle="Configure sprint title, difficulty tier, duration, and curated typing passage."
        maxWidth="max-w-lg"
        footer={
          <div className="flex items-center justify-end gap-2.5 w-full">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-sm shadow-purple-500/30 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              {editingChallenge ? 'Save Changes' : 'Publish Contest'}
            </button>
          </div>
        }
      >
        <form onSubmit={handleSave} className="space-y-4">
          {/* Challenge Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Challenge Title
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Quantum Computing Vocabulary Sprint"
              className="w-full h-9 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 px-3 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 transition-colors"
            />
          </div>

          {/* Difficulty & Duration Custom Button Toggles (NO Native Select) */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Difficulty Tier
              </label>
              <div className="flex items-center p-0.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950/60">
                {['Easy', 'Medium', 'Hard'].map((diff) => (
                  <button
                    key={diff}
                    type="button"
                    onClick={() => setFormData({ ...formData, difficulty: diff })}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      formData.difficulty === diff
                        ? diff === 'Easy'
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : diff === 'Medium'
                          ? 'bg-amber-600 text-white shadow-xs'
                          : 'bg-rose-600 text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Sprint Duration
              </label>
              <div className="flex items-center p-0.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950/60">
                {['15s', '30s', '60s', '120s'].map((dur) => (
                  <button
                    key={dur}
                    type="button"
                    onClick={() => setFormData({ ...formData, duration: dur })}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      formData.duration === dur
                        ? 'bg-purple-600 text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                    }`}
                  >
                    {dur}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Active Date (IST) */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Start Time (IST)
              </label>
              <input
                type="datetime-local"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full h-9 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 px-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                End Time (IST)
              </label>
              <input
                type="datetime-local"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full h-9 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 px-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500"
              />
            </div>
          </div>

          {/* Passage Text */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Curated Passage Text
              </label>
              <div className="text-[10px] text-slate-400 font-mono">
                {formData.passage.length} chars • {formData.passage.split(/\s+/).filter(Boolean).length} words
              </div>
            </div>
            <textarea
              rows={4}
              required
              value={formData.passage}
              onChange={(e) => setFormData({ ...formData, passage: e.target.value })}
              placeholder="Enter the curated typing sprint paragraph that users will type in this daily challenge..."
              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 p-3 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 font-mono transition-colors"
            />
          </div>
        </form>
      </AdminModal>
    </div>
  );
};

export default AdminChallenges;
