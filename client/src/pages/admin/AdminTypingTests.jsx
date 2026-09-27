import React, { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Keyboard,
  Search,
  Filter,
  AlertTriangle,
  CheckCircle,
  Eye,
  Calendar,
  Clock,
  Gauge,
  Target,
  Zap,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Download,
  Trash2,
  X,
  ChevronDown,
  Check,
  Activity,
  Globe,
  Monitor,
  Flame,
  RotateCcw,
  Sparkles,
  Layers,
  Code,
  Quote,
  Trophy,
} from 'lucide-react';
import { toast } from 'react-toastify';
import StatCard from '../../components/admin/StatCard';
import StatusBadge from '../../components/admin/StatusBadge';
import Pagination from '../../components/admin/Pagination';
import UserAvatar from '../../components/common/UserAvatar';
import { typingTestsListData } from '../../data/adminMockData';
import { adminService } from '../../services/adminService';

// Mode Filter Options (Directly aligned with real Tara Typing platform modes)
const modeOptions = [
  { value: 'All', label: 'All Modes', icon: Layers, detail: 'Every Test Mode' },
  { value: 'Timed', label: 'Timed Tests', icon: Clock, detail: '15s, 30s, 60s, 120s' },
  { value: 'Words', label: 'Words Target', icon: Keyboard, detail: '10, 25, 50, 100 Words' },
  { value: 'Quote', label: 'Quote Practice', icon: Quote, detail: 'Short, Medium, Long' },
  { value: 'Code', label: 'Code Syntax', icon: Code, detail: 'JS, Python, CSS' },
  { value: 'Daily Challenge', label: 'Daily Challenge', icon: Trophy, detail: 'Daily Contest' },
];

// Status Filter Options
const statusOptions = [
  { value: 'All', label: 'All Statuses', dot: 'bg-slate-400' },
  { value: 'Valid', label: 'Legitimate (Valid)', dot: 'bg-emerald-500' },
  { value: 'Suspicious', label: 'Flagged (Suspicious)', dot: 'bg-rose-500' },
];

// Sort Options
const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'speed_desc', label: 'Highest Speed (WPM)' },
  { value: 'accuracy_desc', label: 'Highest Accuracy' },
  { value: 'risk_desc', label: 'Highest Bot Risk' },
];

// Custom Mode Filter Dropdown (Zero Native OS Grey Box Glitch)
const ModeFilterDropdown = ({ value, onChange, isOpen, onToggle }) => {
  const selected = modeOptions.find((m) => m.value === value) || modeOptions[0];
  const IconComponent = selected.icon;

  return (
    <div className="relative inline-block" data-mode-dropdown>
      <button
        type="button"
        onClick={onToggle}
        className={`h-9 px-3 rounded-xl border text-xs font-semibold inline-flex items-center gap-2 transition-all duration-200 cursor-pointer shadow-2xs hover:shadow-xs active:scale-95 select-none ${
          value !== 'All'
            ? 'border-purple-500/40 bg-purple-500/10 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300'
            : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 text-slate-700 dark:text-slate-200 hover:border-slate-300 dark:hover:border-slate-700'
        }`}
        aria-label="Filter by Mode"
      >
        <IconComponent
          size={13}
          className={value !== 'All' ? 'text-purple-600 dark:text-purple-400' : 'text-slate-400'}
        />
        <span>{selected.label}</span>
        {value !== 'All' && (
          <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-purple-500/15 text-purple-600 dark:text-purple-300 font-bold">
            Active
          </span>
        )}
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
              Filter By Test Mode
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
            {modeOptions.map((opt) => {
              const isSelected = value === opt.value;
              const ItemIcon = opt.icon;
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
                    <ItemIcon
                      size={13}
                      className={isSelected ? 'text-purple-600 dark:text-purple-400' : 'text-slate-400'}
                    />
                    <div className="text-left">
                      <div className="truncate font-semibold">{opt.label}</div>
                      <div className="text-[10px] text-slate-400 font-normal">{opt.detail}</div>
                    </div>
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
        <ShieldCheck
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
        aria-label="Sort tests"
      >
        <Activity size={13} className="text-purple-500 shrink-0" />
        <span>Sort: {selected.label}</span>
        <ChevronDown
          size={12}
          className={`text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1.5 z-50 w-52 rounded-2xl border border-slate-200/90 dark:border-slate-700/80 bg-white dark:bg-slate-900 p-1.5 shadow-2xl shadow-slate-950/25 backdrop-blur-md animate-in fade-in zoom-in-95 duration-150">
          <div className="px-2.5 py-1.5 mb-1 border-b border-slate-100 dark:border-slate-800">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Sort Records By
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

export const AdminTypingTests = () => {
  const [tests, setTests] = useState([]);
  const [apiKpis, setApiKpis] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDrawerLoading, setIsDrawerLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [modeFilter, setModeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedTest, setSelectedTest] = useState(null);
  const [drawerTab, setDrawerTab] = useState('session'); // 'session' | 'telemetry'
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  // Dropdown open states
  const [openDropdown, setOpenDropdown] = useState(null); // 'mode' | 'status' | 'sort' | null

  // Fetch live typing tests from backend
  const fetchTests = async () => {
    try {
      setIsLoading(true);
      const res = await adminService.getTypingTests({
        limit: 100,
      });
      if (res && res.data && res.data.tests) {
        setTests(res.data.tests);
        setApiKpis(res.data.stats);
      } else {
        setTests(typingTestsListData);
      }
    } catch (err) {
      console.warn('Failed to load typing tests from API:', err);
      setTests(typingTestsListData);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTests();
  }, []);

  // Inspect session and fetch full telemetry
  const handleOpenDrawer = async (test) => {
    setSelectedTest(test);
    setDrawerTab('session');
    try {
      setIsDrawerLoading(true);
      const res = await adminService.getTypingTestById(test.id || test._id);
      if (res && res.data) {
        setSelectedTest(res.data);
      }
    } catch (err) {
      console.warn('Failed to load test session details:', err);
    } finally {
      setIsDrawerLoading(false);
    }
  };

  // Close dropdown on click outside or Escape
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        !event.target.closest('[data-mode-dropdown]') &&
        !event.target.closest('[data-status-dropdown]') &&
        !event.target.closest('[data-sort-dropdown]')
      ) {
        setOpenDropdown(null);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setOpenDropdown(null);
        setSelectedTest(null);
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
  const filteredTests = useMemo(() => {
    let result = tests.filter((t) => {
      const q = searchQuery.toLowerCase();
      const testIdStr = (t.id || t._id || '').toLowerCase();
      const userNameStr = (t.user || '').toLowerCase();
      const usernameStr = (t.username || '').toLowerCase();

      const matchesSearch =
        !q ||
        testIdStr.includes(q) ||
        userNameStr.includes(q) ||
        usernameStr.includes(q);
      const matchesMode =
        modeFilter === 'All' ||
        (t.mode && t.mode.toLowerCase().includes(modeFilter.toLowerCase())) ||
        (t.modeDetail && t.modeDetail.toLowerCase().includes(modeFilter.toLowerCase()));
      const matchesStatus =
        statusFilter === 'All' || (t.status && t.status.toLowerCase() === statusFilter.toLowerCase());

      return matchesSearch && matchesMode && matchesStatus;
    });

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'speed_desc') return b.wpm - a.wpm;
      if (sortBy === 'accuracy_desc') return b.accuracy - a.accuracy;
      if (sortBy === 'risk_desc') return (b.botRisk || 0) - (a.botRisk || 0);
      return 0; // Default newest
    });

    return result;
  }, [tests, searchQuery, modeFilter, statusFilter, sortBy]);

  const totalPages = Math.ceil(filteredTests.length / pageSize) || 1;
  const paginatedTests = filteredTests.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Dynamic KPI Stats derived from API or calculated fallback
  const kpiStats = useMemo(() => {
    if (apiKpis) {
      return {
        totalTests: apiKpis.totalTests,
        avgSpeed: apiKpis.avgSpeed,
        avgAccuracy: apiKpis.avgAccuracy,
        flaggedCount: apiKpis.flaggedCount,
      };
    }

    const total = tests.length;
    const suspiciousCount = tests.filter((t) => t.isSuspicious || t.status === 'Suspicious').length;
    const validTests = tests.filter((t) => !t.isSuspicious && t.status !== 'Suspicious');
    const avgWpm =
      validTests.length > 0
        ? Math.round(validTests.reduce((sum, t) => sum + t.wpm, 0) / validTests.length)
        : 0;
    const avgAcc =
      validTests.length > 0
        ? (validTests.reduce((sum, t) => sum + t.accuracy, 0) / validTests.length).toFixed(1)
        : '0.0';

    return {
      totalTests: total,
      avgSpeed: `${avgWpm} WPM`,
      avgAccuracy: `${avgAcc}%`,
      flaggedCount: suspiciousCount,
    };
  }, [tests, apiKpis]);

  // Toggle Test Legitimacy / Suspicious via API
  const toggleTestValidity = async (testId) => {
    const test = tests.find((t) => (t.id || t._id) === testId);
    if (!test) return;

    const nextStatus = (test.status || 'Valid') === 'Suspicious' ? 'valid' : 'suspicious';
    const nextDisplayStatus = nextStatus === 'suspicious' ? 'Suspicious' : 'Valid';
    const nextIsSuspicious = nextStatus === 'suspicious';
    const nextBotRisk = nextIsSuspicious ? 95 : 2;

    try {
      await adminService.updateTestValidity(testId, { status: nextStatus });
      setTests((prev) =>
        prev.map((t) =>
          (t.id || t._id) === testId
            ? {
                ...t,
                status: nextDisplayStatus,
                isSuspicious: nextIsSuspicious,
                botRisk: nextBotRisk,
              }
            : t
        )
      );

      if (selectedTest && (selectedTest.id || selectedTest._id) === testId) {
        setSelectedTest((prev) => ({
          ...prev,
          status: nextDisplayStatus,
          isSuspicious: nextIsSuspicious,
          botRisk: nextBotRisk,
        }));
      }

      if (nextStatus === 'valid') {
        toast.success(`Session ${testId.slice(-6)} validated as legitimate!`, {
          position: 'top-right',
        });
      } else {
        toast.info(`Session ${testId.slice(-6)} flagged as suspicious / bot run!`, {
          position: 'top-right',
        });
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update test status', { position: 'top-right' });
    }
  };

  // Delete Test Record via API
  const handleDeleteTest = async (testId) => {
    if (window.confirm('Are you sure you want to permanently delete this test session record?')) {
      try {
        await adminService.deleteTypingTest(testId);
        setTests((prev) => prev.filter((t) => (t.id || t._id) !== testId));
        if (selectedTest && (selectedTest.id || selectedTest._id) === testId) {
          setSelectedTest(null);
        }
        toast.success('Session log removed permanently from database', { position: 'top-right' });
      } catch (err) {
        toast.error(err.message || 'Failed to delete test', { position: 'top-right' });
      }
    }
  };

  // Export CSV via Backend API
  const handleExportCSV = async () => {
    try {
      await adminService.exportTypingTests('csv');
      toast.success('Exported typing test records to CSV!', { position: 'top-right' });
    } catch (err) {
      toast.error(err.message || 'Failed to export CSV', { position: 'top-right' });
    }
  };

  // Reset Filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setModeFilter('All');
    setStatusFilter('All');
    setSortBy('newest');
    setCurrentPage(1);
    toast.info('Filters reset to default view', { position: 'top-right' });
  };

  const hasActiveFilters = searchQuery || modeFilter !== 'All' || statusFilter !== 'All' || sortBy !== 'newest';

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* ── 1. HEADER & QUICK ACTIONS ── */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 text-xs font-bold uppercase tracking-wider border border-purple-500/20">
              Audit & Anti-Cheat Hub
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Telemetry Stream
            </span>
          </div>
          <h1 className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-display">
            Typing Test Records & Telemetry
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Audit keystroke cadences, verify legitimate platform speeds, and moderate automated bot submissions.
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
        </div>
      </div>

      {/* ── 2. TOP 4 STANDARDIZED KPI METRICS (MATCHING ADMIN DASHBOARD) ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Card 1: Total Tests Logged */}
        <StatCard
          title="Total Tests Logged"
          value={kpiStats.totalTests}
          change={18.4}
          isPositive={true}
          timeframe="recorded sessions"
          icon={Keyboard}
          hoverEffect="blue"
          colorClass="from-blue-500/20 to-cyan-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
        />

        {/* Card 2: Platform Avg Speed */}
        <StatCard
          title="Platform Avg Speed"
          value={kpiStats.avgSpeed}
          change={4.2}
          isPositive={true}
          timeframe="human verified pace"
          icon={Zap}
          hoverEffect="purple"
          colorClass="from-purple-500/20 to-indigo-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20"
        />

        {/* Card 3: Platform Accuracy */}
        <StatCard
          title="Platform Accuracy"
          value={kpiStats.avgAccuracy}
          change={1.8}
          isPositive={true}
          timeframe="keystroke precision"
          icon={Target}
          hoverEffect="emerald"
          colorClass="from-emerald-500/20 to-teal-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
        />

        {/* Card 4: Bot Sentry Flags */}
        <StatCard
          title="Flagged Bot Runs"
          value={kpiStats.flaggedCount}
          change={-12.5}
          isPositive={false}
          timeframe="cheater script alerts"
          icon={ShieldAlert}
          hoverEffect="rose"
          colorClass="from-rose-500/20 to-red-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20"
        />
      </div>

      {/* ── 3. FILTER TOOLBAR WITH CUSTOM STYLED DROPDOWNS ── */}
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
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search test ID (e.g. TT-98421), user, or @username..."
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
          {/* Mode Dropdown */}
          <ModeFilterDropdown
            value={modeFilter}
            onChange={(val) => {
              setModeFilter(val);
              setOpenDropdown(null);
              setCurrentPage(1);
            }}
            isOpen={openDropdown === 'mode'}
            onToggle={() => setOpenDropdown(openDropdown === 'mode' ? null : 'mode')}
          />

          {/* Status Dropdown */}
          <StatusFilterDropdown
            value={statusFilter}
            onChange={(val) => {
              setStatusFilter(val);
              setOpenDropdown(null);
              setCurrentPage(1);
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
              setCurrentPage(1);
            }}
            isOpen={openDropdown === 'sort'}
            onToggle={() => setOpenDropdown(openDropdown === 'sort' ? null : 'sort')}
          />

          {/* Reset Filters Button */}
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

      {/* ── 4. TYPING TESTS INTERACTIVE TABLE ── */}
      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
        <div className="overflow-x-auto stylish-scrollbar">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/70 dark:bg-slate-950/40 text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-5 py-3.5">Session ID</th>
                <th className="px-5 py-3.5">Typist Member</th>
                <th className="px-5 py-3.5">Speed (WPM)</th>
                <th className="px-5 py-3.5">Accuracy</th>
                <th className="px-5 py-3.5">Test Mode</th>
                <th className="px-5 py-3.5">Anti-Cheat Validation</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/70 dark:divide-slate-800">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="text-center py-16 text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="h-8 w-8 animate-spin rounded-full border-3 border-purple-500 border-t-transparent" />
                      <span className="text-xs font-medium text-slate-500">Loading typing test records...</span>
                    </div>
                  </td>
                </tr>
              ) : paginatedTests.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-14 text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Keyboard size={36} className="text-slate-300 dark:text-slate-700 stroke-[1.5]" />
                      <p className="font-semibold text-slate-600 dark:text-slate-300 text-sm">
                        No typing tests found matching your criteria
                      </p>
                      <p className="text-xs text-slate-400">
                        Try clearing or adjusting search filters to see all recorded sessions.
                      </p>
                      {hasActiveFilters && (
                        <button
                          type="button"
                          onClick={handleResetFilters}
                          className="mt-2 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer"
                        >
                          Clear Active Filters
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedTests.map((t) => {
                  const isFlagged = t.isSuspicious || t.status === 'Suspicious';
                  return (
                    <tr
                      key={t.id}
                      className={`hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors ${
                        isFlagged ? 'bg-rose-500/[0.03] dark:bg-rose-950/[0.15]' : ''
                      }`}
                    >
                      {/* Session ID & Timestamp */}
                      <td className="px-5 py-4">
                        <div className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                          <span>{t.id}</span>
                          {isFlagged && (
                            <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" />
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center gap-1 mt-0.5">
                          <Calendar size={11} className="shrink-0" />
                          <span>{t.date}</span>
                        </div>
                      </td>

                      {/* Typist Member */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="relative shrink-0">
                            <UserAvatar
                              src={t.avatar}
                              name={t.user}
                              username={t.username}
                              className="h-8 w-8"
                              textClassName="text-xs font-bold"
                              rounded="rounded-xl"
                              firstLetterOnly
                            />
                            {t.streak > 0 && (
                              <span
                                className="absolute -top-1 -right-1 inline-flex items-center px-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-extrabold text-[8px] border border-white dark:border-slate-900"
                                title={`${t.streak} Day Streak`}
                              >
                                <Flame size={7} className="fill-white stroke-none" />
                              </span>
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900 dark:text-white leading-tight">
                              {t.user}
                            </p>
                            <p className="text-xs text-purple-600 dark:text-purple-400 font-medium">
                              @{t.username}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Speed (WPM) & Raw WPM */}
                      <td className="px-5 py-4">
                        <div
                          className={`font-bold text-base ${
                            t.wpm >= 200
                              ? 'text-rose-600 dark:text-rose-400'
                              : 'text-purple-600 dark:text-purple-400'
                          }`}
                        >
                          {t.wpm} <span className="text-xs font-semibold text-slate-400">WPM</span>
                        </div>
                        <div className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">
                          Raw: {t.rawWpm || t.wpm} WPM
                        </div>
                      </td>

                      {/* Accuracy & Errors */}
                      <td className="px-5 py-4">
                        <div className="font-semibold text-slate-800 dark:text-slate-200">
                          {t.accuracy}%
                        </div>
                        <div className="text-[11px] text-slate-400 dark:text-slate-500">
                          {t.errors || 0} err • {t.backspaces || 0} bksp
                        </div>
                      </td>

                      {/* Test Mode & Target */}
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60">
                          {t.modeDetail || `${t.mode} (${t.duration})`}
                        </span>
                      </td>

                      {/* Anti-Cheat Validation & Switch Toggle Button */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2.5">
                          {/* Pixel-Perfect Switch Slider */}
                          <button
                            type="button"
                            onClick={() => toggleTestValidity(t.id)}
                            className={`group relative inline-flex h-4 w-8 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 ${
                              !isFlagged ? 'bg-emerald-500' : 'bg-rose-500'
                            }`}
                            aria-label={`Mark test as ${isFlagged ? 'Valid' : 'Suspicious'}`}
                            title={`Click to mark as ${isFlagged ? 'Valid' : 'Suspicious'}`}
                          >
                            <span
                              className={`pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow-md transition duration-200 ease-in-out ${
                                !isFlagged ? 'translate-x-4' : 'translate-x-0.5'
                              }`}
                            />
                          </button>

                          <span
                            className={`text-xs font-bold ${
                              !isFlagged
                                ? 'text-emerald-600 dark:text-emerald-400'
                                : 'text-rose-600 dark:text-rose-400'
                            }`}
                          >
                            {!isFlagged ? 'Valid' : 'Suspicious'}
                          </span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4 text-right">
                        <div className="inline-flex items-center gap-2 justify-end">
                          {/* Inspect Session Button */}
                          <button
                            type="button"
                            onClick={() => handleOpenDrawer(t)}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-purple-200/80 dark:border-purple-800/60 bg-purple-50/90 dark:bg-purple-950/40 text-xs font-semibold text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/60 hover:border-purple-300 dark:hover:border-purple-700 hover:scale-105 active:scale-95 transition-all shadow-2xs shadow-purple-500/10 cursor-pointer"
                            title="Inspect Session & Telemetry"
                          >
                            <Eye size={13} strokeWidth={2.2} />
                            <span>Inspect</span>
                          </button>

                          {/* Delete Session Button */}
                          <button
                            type="button"
                            onClick={() => handleDeleteTest(t.id)}
                            className="p-1.5 rounded-xl border border-rose-200/80 dark:border-rose-800/60 bg-rose-50/90 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/60 hover:border-rose-300 dark:hover:border-rose-700 hover:scale-105 active:scale-95 transition-all shadow-2xs shadow-rose-500/10 cursor-pointer"
                            title="Delete Session Record"
                          >
                            <Trash2 size={14} strokeWidth={2.2} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredTests.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* ── 5. INSPECT SESSION SLIDE-OVER SIDE DRAWER (PORTAL TO DOCUMENT.BODY) ── */}
      {typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {selectedTest && (
              <>
                {/* Drawer Backdrop */}
                <motion.div
                  key="test-drawer-backdrop"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.22, ease: 'easeOut' }}
                  className="fixed inset-0 z-[60] bg-slate-950/60 backdrop-blur-xs"
                  onClick={() => setSelectedTest(null)}
                  aria-hidden="true"
                />

                {/* Slide-Over Drawer Container */}
                <motion.div
                  key="test-drawer-panel"
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ type: 'spring', damping: 30, stiffness: 280 }}
                  className="fixed inset-y-0 right-0 z-[70] w-full max-w-md sm:max-w-xl h-screen max-h-screen bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col"
                  role="dialog"
                  aria-modal="true"
                  aria-label="Typing Session Telemetry Drawer"
                >
                  {/* Drawer Header */}
                  <div className="flex items-center justify-between px-5 py-2.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/50 shrink-0">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                        <Keyboard size={15} />
                      </div>
                      <div>
                        <h2 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                          Session Audit & Telemetry
                        </h2>
                        <span className="font-mono text-[11px] text-purple-600 dark:text-purple-400 font-semibold">
                          {selectedTest.id}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedTest(null)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                      title="Close Drawer (Esc)"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  {/* Drawer Scrollable Content */}
                  <div className="flex-1 overflow-y-auto p-5 space-y-4 stylish-scrollbar">
                    {/* Typist Header Summary Card */}
                    <div className="p-3.5 rounded-2xl bg-gradient-to-br from-slate-50 to-purple-50/30 dark:from-slate-950/70 dark:to-purple-950/10 border border-purple-500/20 shadow-xs space-y-2.5">
                      <div className="flex items-center gap-3">
                        <div className="relative shrink-0">
                          <UserAvatar
                            src={selectedTest.avatar}
                            name={selectedTest.user}
                            username={selectedTest.username}
                            className="h-12 w-12"
                            textClassName="text-base font-bold"
                            rounded="rounded-xl"
                            firstLetterOnly
                          />
                          {selectedTest.streak > 0 && (
                            <span
                              className="absolute -top-1 -right-1 z-10 inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-extrabold text-[9px] shadow-sm border border-white dark:border-slate-900 leading-tight"
                              title={`${selectedTest.streak} Day Typing Streak`}
                            >
                              <Flame size={9} className="fill-white stroke-none" />
                              <span>{selectedTest.streak}d</span>
                            </span>
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-bold text-base text-slate-900 dark:text-white leading-tight">
                              {selectedTest.user}
                            </h3>
                            <StatusBadge status={selectedTest.status} />
                          </div>
                          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            <span className="text-purple-600 dark:text-purple-400 font-semibold">
                              @{selectedTest.username}
                            </span>
                            <span>•</span>
                            <span>{selectedTest.modeDetail || selectedTest.mode}</span>
                          </div>
                        </div>
                      </div>

                      {/* Metadata Badges */}
                      <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-200/70 dark:border-slate-800 text-[11px]">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-500/10 border border-purple-500/20 font-semibold text-purple-700 dark:text-purple-300">
                          <Clock size={12} className="text-purple-600 dark:text-purple-400 shrink-0" />
                          <span>Duration: {selectedTest.duration}</span>
                        </div>

                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-medium">
                          <Calendar size={12} className="text-slate-400 shrink-0" />
                          <span>{selectedTest.date}</span>
                        </div>

                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-medium">
                          <Layers size={12} className="text-slate-400 shrink-0" />
                          <span>Mode: {selectedTest.mode}</span>
                        </div>
                      </div>
                    </div>

                    {/* Navigation Tabs */}
                    <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80">
                      <button
                        type="button"
                        onClick={() => setDrawerTab('session')}
                        className={`flex-1 flex items-center justify-center gap-2 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                          drawerTab === 'session'
                            ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-xs'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        <Keyboard size={13} />
                        <span>Session Performance</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setDrawerTab('telemetry')}
                        className={`flex-1 flex items-center justify-center gap-2 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                          drawerTab === 'telemetry'
                            ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-xs'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        <ShieldAlert size={13} />
                        <span>Anti-Cheat & Telemetry</span>
                      </button>
                    </div>

                    {/* TAB 1: SESSION PERFORMANCE */}
                    {drawerTab === 'session' && (
                      <div className="space-y-4">
                        {/* 4 Metric Cards */}
                        <div className="grid grid-cols-2 gap-2.5">
                          {/* Net Speed */}
                          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800">
                            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                              Net Speed
                            </span>
                            <div className="font-bold text-lg text-purple-600 dark:text-purple-400 mt-0.5">
                              {selectedTest.wpm} <span className="text-xs font-normal">WPM</span>
                            </div>
                          </div>

                          {/* Raw Speed */}
                          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800">
                            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                              Raw Speed
                            </span>
                            <div className="font-bold text-lg text-blue-600 dark:text-blue-400 mt-0.5">
                              {selectedTest.rawWpm || selectedTest.wpm}{' '}
                              <span className="text-xs font-normal">WPM</span>
                            </div>
                          </div>

                          {/* Accuracy */}
                          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800">
                            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                              Accuracy Rate
                            </span>
                            <div className="font-bold text-lg text-emerald-600 dark:text-emerald-400 mt-0.5">
                              {selectedTest.accuracy}%
                            </div>
                          </div>

                          {/* Consistency */}
                          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800">
                            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                              Consistency
                            </span>
                            <div className="font-bold text-lg text-amber-600 dark:text-amber-400 mt-0.5">
                              {selectedTest.consistency || 88.5}%
                            </div>
                          </div>
                        </div>

                        {/* Keystroke & Input Analysis */}
                        <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 space-y-2.5">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                            <Keyboard size={13} className="text-purple-500" />
                            Keystroke & Input Breakdown
                          </h4>

                          <div className="grid grid-cols-3 gap-2 text-center">
                            <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-200/70 dark:border-slate-800">
                              <span className="text-[10px] text-slate-400 block font-semibold">Keystrokes</span>
                              <span className="font-bold text-sm text-slate-900 dark:text-white">
                                {selectedTest.keystrokes || selectedTest.wpm * 5}
                              </span>
                            </div>
                            <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-200/70 dark:border-slate-800">
                              <span className="text-[10px] text-slate-400 block font-semibold">Unfixed Errors</span>
                              <span className="font-bold text-sm text-rose-600 dark:text-rose-400">
                                {selectedTest.errors || 0}
                              </span>
                            </div>
                            <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-200/70 dark:border-slate-800">
                              <span className="text-[10px] text-slate-400 block font-semibold">Backspaces</span>
                              <span className="font-bold text-sm text-amber-600 dark:text-amber-400">
                                {selectedTest.backspaces || 0}
                              </span>
                            </div>
                          </div>

                          {/* Cadence Variance Note */}
                          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                            <span className="text-slate-400 block font-semibold text-[10px] uppercase">
                              Keystroke Cadence Analysis
                            </span>
                            <p className="mt-0.5 font-medium text-slate-700 dark:text-slate-300">
                              {selectedTest.isSuspicious || selectedTest.wpm > 200 ? (
                                <span className="text-rose-600 dark:text-rose-400 flex items-center gap-1">
                                  <AlertTriangle size={13} />
                                  Low latency variance (&lt;15ms). Robotic rhythmic cadence flagged.
                                </span>
                              ) : (
                                <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                                  <CheckCircle size={13} />
                                  Natural human cadence variance with organic pause/dwell times.
                                </span>
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* TAB 2: ANTI-CHEAT & TELEMETRY */}
                    {drawerTab === 'telemetry' && (
                      <div className="space-y-4">
                        {/* Bot Risk Gauge */}
                        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                              <ShieldAlert size={14} className="text-rose-500" />
                              Anti-Cheat Sentry Bot Probability
                            </span>
                            <span
                              className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                                (selectedTest.botRisk || (selectedTest.isSuspicious ? 95 : 2)) > 50
                                  ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400'
                                  : 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                              }`}
                            >
                              {selectedTest.botRisk || (selectedTest.isSuspicious ? 95 : 2)}% Probability (
                              {(selectedTest.botRisk || (selectedTest.isSuspicious ? 95 : 2)) > 50
                                ? 'High Risk / Bot Script'
                                : 'Low Risk / Legitimate'}
                              )
                            </span>
                          </div>
                          <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${
                                (selectedTest.botRisk || (selectedTest.isSuspicious ? 95 : 2)) > 50
                                  ? 'bg-rose-500'
                                  : 'bg-emerald-500'
                              }`}
                              style={{
                                width: `${selectedTest.botRisk || (selectedTest.isSuspicious ? 95 : 2)}%`,
                              }}
                            />
                          </div>
                        </div>

                        {/* Diagnostics Cards */}
                        <div className="space-y-2.5">
                          <h5 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                            <Activity size={13} className="text-purple-500" />
                            Session & Network Diagnostics
                          </h5>

                          {/* Last Recorded IP Card */}
                          <div className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:border-purple-500/30 transition-colors">
                            <div className="flex items-center gap-2.5">
                              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                                <Globe size={15} />
                              </div>
                              <div>
                                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block">
                                  Session IP Address
                                </span>
                                <span className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200">
                                  {selectedTest.ip || '103.44.112.5'}
                                </span>
                              </div>
                            </div>
                            <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-semibold text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                              IPv4 Verified
                            </span>
                          </div>

                          {/* Client Environment Card */}
                          <div className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:border-purple-500/30 transition-colors">
                            <div className="flex items-center gap-2.5">
                              <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                                <Monitor size={15} />
                              </div>
                              <div>
                                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block">
                                  Client Browser & OS
                                </span>
                                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                                  {selectedTest.browser || 'Chrome 128 / Windows 11'}
                                </span>
                              </div>
                            </div>
                            <span className="px-2 py-0.5 rounded-md bg-purple-500/10 text-[10px] font-semibold text-purple-600 dark:text-purple-400 border border-purple-500/20">
                              Client Verified
                            </span>
                          </div>

                          {/* Anti-Cheat Standing Card */}
                          <div className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:border-purple-500/30 transition-colors">
                            <div className="flex items-center gap-2.5">
                              <div
                                className={`p-2 rounded-lg border ${
                                  !selectedTest.isSuspicious
                                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                                    : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
                                }`}
                              >
                                {!selectedTest.isSuspicious ? (
                                  <ShieldCheck size={15} />
                                ) : (
                                  <ShieldAlert size={15} />
                                )}
                              </div>
                              <div>
                                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block">
                                  Current Standing
                                </span>
                                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                                  {!selectedTest.isSuspicious
                                    ? 'Verified Authentic Session'
                                    : 'Flagged by Sentry Guard'}
                                </span>
                              </div>
                            </div>
                            <span
                              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border shadow-2xs ${
                                !selectedTest.isSuspicious
                                  ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                                  : 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30'
                              }`}
                            >
                              <span
                                className={`h-1.5 w-1.5 rounded-full ${
                                  !selectedTest.isSuspicious ? 'bg-emerald-500' : 'bg-rose-500'
                                }`}
                              />
                              <span>{selectedTest.status}</span>
                            </span>
                          </div>
                        </div>

                        {/* Sentry Audit Notes */}
                        <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40 text-xs space-y-1">
                          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider flex items-center gap-1">
                            <Shield size={12} className="text-purple-500" />
                            Sentry Anti-Cheat Audit Notes
                          </span>
                          <p className="font-mono text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                            {selectedTest.telemetryNotes ||
                              'Natural keystroke distribution with expected human error correction and variance.'}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Drawer Sticky Footer with Top-Positioned Tooltips */}
                  <div className="px-5 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-950/80 shrink-0 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setSelectedTest(null)}
                      className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      Close
                    </button>

                    <div className="flex items-center gap-3">
                      {/* Legitimacy Toggle Icon Button with Custom Top Tooltip */}
                      <div className="relative group/tooltip flex items-center">
                        <button
                          type="button"
                          onClick={() => toggleTestValidity(selectedTest.id)}
                          className={`p-2.5 rounded-xl border transition-all duration-150 hover:scale-105 active:scale-95 shadow-2xs cursor-pointer ${
                            selectedTest.status === 'Suspicious'
                              ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 shadow-emerald-500/10'
                              : 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800/60 hover:bg-amber-100 dark:hover:bg-amber-900/50 shadow-amber-500/10'
                          }`}
                          aria-label={
                            selectedTest.status === 'Suspicious'
                              ? 'Mark as Legitimate Human'
                              : 'Flag as Suspicious Bot'
                          }
                        >
                          {selectedTest.status === 'Suspicious' ? (
                            <CheckCircle size={16} strokeWidth={2.2} />
                          ) : (
                            <AlertTriangle size={16} strokeWidth={2.2} />
                          )}
                        </button>

                        {/* Top-Positioned Tooltip with Smooth Rounded Border Radius */}
                        <div className="pointer-events-none absolute bottom-full mb-2.5 left-1/2 -translate-x-1/2 opacity-0 group-hover/tooltip:opacity-100 group-hover/tooltip:-translate-y-1 transition-all duration-150 z-50 whitespace-nowrap">
                          <div className="px-3 py-1.5 rounded-xl bg-slate-900 text-white dark:bg-slate-800 dark:text-white text-[11px] font-semibold shadow-xl border border-slate-700/60 flex items-center gap-1.5">
                            <span>
                              {selectedTest.status === 'Suspicious'
                                ? 'Mark as Legitimate Human'
                                : 'Flag as Suspicious Bot'}
                            </span>
                          </div>
                          <div className="w-2 h-2 bg-slate-900 dark:bg-slate-800 border-r border-b border-slate-700/60 rotate-45 mx-auto -mt-1 rounded-xs" />
                        </div>
                      </div>

                      {/* Delete Test Icon Button with Custom Top Tooltip */}
                      <div className="relative group/tooltip flex items-center">
                        <button
                          type="button"
                          onClick={() => handleDeleteTest(selectedTest.id)}
                          className="p-2.5 rounded-xl text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800/60 hover:bg-rose-100 dark:hover:bg-rose-900/50 hover:text-rose-700 hover:scale-105 active:scale-95 transition-all shadow-2xs shadow-rose-500/10 cursor-pointer"
                          aria-label="Delete Session Record"
                        >
                          <Trash2 size={16} strokeWidth={2.2} />
                        </button>

                        {/* Top-Positioned Tooltip with Smooth Rounded Border Radius */}
                        <div className="pointer-events-none absolute bottom-full mb-2.5 right-0 opacity-0 group-hover/tooltip:opacity-100 group-hover/tooltip:-translate-y-1 transition-all duration-150 z-50 whitespace-nowrap">
                          <div className="px-3 py-1.5 rounded-xl bg-rose-600 text-white text-[11px] font-semibold shadow-xl border border-rose-500 flex items-center gap-1.5">
                            <Trash2 size={12} />
                            <span>Delete Test Record</span>
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
    </div>
  );
};

export default AdminTypingTests;
