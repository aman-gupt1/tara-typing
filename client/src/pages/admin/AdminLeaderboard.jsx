import React, { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy,
  Medal,
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
  Users,
  Search,
  Filter,
  Crown,
  Keyboard,
} from 'lucide-react';
import { toast } from 'react-toastify';
import StatCard from '../../components/admin/StatCard';
import StatusBadge from '../../components/admin/StatusBadge';
import Pagination from '../../components/admin/Pagination';
import UserAvatar from '../../components/common/UserAvatar';
import { adminService } from '../../services/adminService';
import { leaderboardTabsData } from '../../data/adminMockData';

// Mode Filter Options (Directly aligned with real Tara Typing platform modes)
const modeOptions = [
  { value: 'All', label: 'All Modes', icon: Layers, detail: 'Every Test Mode' },
  { value: 'Timed', label: 'Timed Tests', icon: Clock, detail: '15s, 30s, 60s, 120s' },
  { value: 'Words', label: 'Words Target', icon: Keyboard, detail: '10, 25, 50, 100 Words' },
  { value: 'Quote', label: 'Quote Practice', icon: Quote, detail: 'Short, Medium, Long' },
  { value: 'Code', label: 'Code Syntax', icon: Code, detail: 'JS, Python' },
  { value: 'Daily Challenge', label: 'Daily Challenge', icon: Trophy, detail: 'Daily Contest' },
];

// Status Filter Options
const statusOptions = [
  { value: 'All', label: 'All Rankings', dot: 'bg-slate-400' },
  { value: 'Verified', label: 'Verified Clean', dot: 'bg-emerald-500' },
  { value: 'Flagged', label: 'Flagged Anomalies', dot: 'bg-rose-500' },
];

// Sort Options
const sortOptions = [
  { value: 'rank', label: 'Official Rank (1st → Last)' },
  { value: 'speed_desc', label: 'Highest Speed (WPM)' },
  { value: 'accuracy_desc', label: 'Highest Accuracy' },
  { value: 'tests_desc', label: 'Most Tests Completed' },
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
              Filter By Audit Status
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
        aria-label="Sort leaderboard"
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
              Sort Rankings By
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

export const AdminLeaderboard = () => {
  const [activeTab, setActiveTab] = useState('global'); // 'global' | 'daily' | 'weekly' | 'monthly'
  const [leaderboardData, setLeaderboardData] = useState({
    global: [],
    daily: [],
    weekly: [],
    monthly: [],
  });
  const [tabsCount, setTabsCount] = useState({ global: 0, daily: 0, weekly: 0, monthly: 0 });
  const [apiKpis, setApiKpis] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [modeFilter, setModeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('rank');
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [drawerTab, setDrawerTab] = useState('performance'); // 'performance' | 'telemetry'
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  // Dropdown open states
  const [openDropdown, setOpenDropdown] = useState(null); // 'mode' | 'status' | 'sort' | null

  // Fetch live leaderboard rankings from backend
  const fetchLeaderboard = async (timeframeToFetch = activeTab) => {
    try {
      setIsLoading(true);
      const res = await adminService.getLeaderboard({
        timeframe: timeframeToFetch,
        mode: modeFilter,
        status: statusFilter,
        sortBy,
        limit: 100,
      });

      if (res && res.success && res.data) {
        const { leaderboard, allLeaderboard, tabsCount: serverTabsCount, stats } = res.data;
        const listToUse = allLeaderboard || leaderboard || [];
        setLeaderboardData((prev) => ({
          ...prev,
          [timeframeToFetch]: listToUse,
        }));
        if (serverTabsCount) {
          setTabsCount(serverTabsCount);
        }
        if (stats) {
          setApiKpis(stats);
        }
      }
    } catch (err) {
      console.warn('Failed to load leaderboard from live API, using cached data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard(activeTab);
  }, [activeTab, modeFilter, statusFilter, sortBy]);

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
        setSelectedEntry(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Current tab items
  const currentList = leaderboardData[activeTab] || [];

  // Filter & Sort Logic
  const filteredList = useMemo(() => {
    let result = (currentList || []).filter((item) => {
      const name = item.name || '';
      const username = item.username || '';
      const mode = item.mode || '';
      const matchesSearch =
        name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mode.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesMode =
        modeFilter === 'All' ||
        (mode && (
          mode.toLowerCase().includes(modeFilter.toLowerCase()) ||
          (modeFilter.toLowerCase() === 'timed' && (mode.toLowerCase().includes('time') || mode.toLowerCase().includes('custom')))
        ));
      const matchesStatus =
        statusFilter === 'All' ||
        (statusFilter === 'Verified' && !item.isFlagged) ||
        (statusFilter === 'Flagged' && item.isFlagged);

      return matchesSearch && matchesMode && matchesStatus;
    });

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'speed_desc') return (b.wpm || 0) - (a.wpm || 0);
      if (sortBy === 'accuracy_desc') return (b.accuracy || 0) - (a.accuracy || 0);
      if (sortBy === 'tests_desc') return (b.tests || 0) - (a.tests || 0);
      if (sortBy === 'risk_desc') return (b.botRisk || 0) - (a.botRisk || 0);
      return (a.rank || 0) - (b.rank || 0); // Default by official rank
    });

    return result;
  }, [currentList, searchQuery, modeFilter, statusFilter, sortBy]);

  const totalPages = Math.ceil(filteredList.length / pageSize) || 1;
  const paginatedList = filteredList.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Dynamic KPI Stats derived from active leaderboard tab
  const kpiStats = useMemo(() => {
    if (apiKpis && !searchQuery && modeFilter === 'All' && statusFilter === 'All') {
      return apiKpis;
    }
    const totalRanked = currentList.length;
    const flaggedList = currentList.filter((item) => item.isFlagged);
    const validList = currentList.filter((item) => !item.isFlagged);

    const peakSpeed =
      validList.length > 0
        ? Math.max(...validList.map((item) => item.wpm))
        : 0;
    const peakHolder = validList.find((item) => item.wpm === peakSpeed);

    // Top 3 Podium accuracy
    const top3 = validList.slice(0, 3);
    const podiumAvgAccuracy =
      top3.length > 0
        ? (top3.reduce((sum, item) => sum + item.accuracy, 0) / top3.length).toFixed(1)
        : '0.0';

    return {
      peakSpeed: `${peakSpeed} WPM`,
      peakHolder: peakHolder ? `@${peakHolder.username}` : 'No holder',
      rankedTypists: totalRanked,
      flaggedCount: flaggedList.length,
      podiumAccuracy: `${podiumAvgAccuracy}%`,
    };
  }, [currentList, apiKpis, searchQuery, modeFilter, statusFilter]);

  // Toggle Score Legitimacy / Flagged Status
  const toggleScoreLegitimacy = async (entryOrUsername) => {
    const entry =
      typeof entryOrUsername === 'object' && entryOrUsername !== null
        ? entryOrUsername
        : currentList.find((u) => u.username === entryOrUsername) || { username: entryOrUsername };

    const username = entry.username;
    const testId = entry.testId || entry.id;
    const currentFlagged = Boolean(entry.isFlagged);
    const newFlaggedState = !currentFlagged;

    // Optimistic UI update
    setLeaderboardData((prev) => {
      const updatedTabList = (prev[activeTab] || []).map((u) => {
        if (u.username === username || (testId && (u.testId === testId || u.id === testId))) {
          return {
            ...u,
            isFlagged: newFlaggedState,
            status: newFlaggedState ? 'Flagged Anomalous' : 'Verified Clean',
            botRisk: newFlaggedState ? 95 : 2,
          };
        }
        return u;
      });
      return { ...prev, [activeTab]: updatedTabList };
    });

    if (selectedEntry && (selectedEntry.username === username || selectedEntry.testId === testId)) {
      setSelectedEntry((prev) => ({
        ...prev,
        isFlagged: newFlaggedState,
        status: newFlaggedState ? 'Flagged Anomalous' : 'Verified Clean',
        botRisk: newFlaggedState ? 95 : 2,
      }));
    }

    if (testId) {
      try {
        await adminService.toggleLeaderboardFlag(testId, { isFlagged: newFlaggedState });
      } catch (err) {
        console.error('Failed to update score flag on server:', err);
        toast.error('Failed to update score status on server', { position: 'top-right' });
        // Revert optimistic state
        setLeaderboardData((prev) => {
          const reverted = (prev[activeTab] || []).map((u) => {
            if (u.username === username || u.testId === testId) {
              return { ...u, isFlagged: currentFlagged, botRisk: currentFlagged ? 95 : 2 };
            }
            return u;
          });
          return { ...prev, [activeTab]: reverted };
        });
        return;
      }
    }

    if (!newFlaggedState) {
      toast.success(`Score for @${username} verified as legitimate!`, { position: 'top-right' });
    } else {
      toast.info(`Score for @${username} flagged as anomalous bot script!`, { position: 'top-right' });
    }
  };

  // Disqualify and remove from leaderboard
  const handleDisqualify = async (entryOrUsername, optionalName) => {
    const entry =
      typeof entryOrUsername === 'object' && entryOrUsername !== null
        ? entryOrUsername
        : currentList.find((u) => u.username === entryOrUsername) || {
            username: entryOrUsername,
            name: optionalName || entryOrUsername,
          };

    const username = entry.username;
    const name = entry.name || username;
    const testId = entry.testId || entry.id;

    // Optimistic UI update
    setLeaderboardData((prev) => ({
      ...prev,
      [activeTab]: (prev[activeTab] || []).filter(
        (u) => u.username !== username && (!testId || (u.testId !== testId && u.id !== testId))
      ),
    }));

    setTabsCount((prev) => ({
      ...prev,
      [activeTab]: Math.max(0, (prev[activeTab] || 1) - 1),
    }));

    if (selectedEntry && (selectedEntry.username === username || selectedEntry.testId === testId)) {
      setSelectedEntry(null);
    }

    if (testId) {
      try {
        await adminService.disqualifyLeaderboardEntry(testId);
      } catch (err) {
        console.error('Failed to disqualify entry on server:', err);
        toast.error('Failed to disqualify entry on server', { position: 'top-right' });
        fetchLeaderboard(activeTab);
        return;
      }
    }

    toast.success(`Disqualified @${username} (${name}) from ${activeTab} leaderboard`, {
      position: 'top-right',
    });
  };

  // Export CSV
  const handleExportCSV = async () => {
    if (filteredList.length === 0) {
      toast.error('No leaderboard records to export', { position: 'top-right' });
      return;
    }
    try {
      setIsExporting(true);
      await adminService.exportLeaderboard({
        timeframe: activeTab,
        mode: modeFilter,
        status: statusFilter,
      });
      toast.success(`Exported ${activeTab} leaderboard to CSV!`, { position: 'top-right' });
    } catch (apiErr) {
      console.warn('Backend export failed, falling back to client CSV generation:', apiErr);
      const headers = [
        'Rank',
        'Typist Name',
        'Username',
        'Speed (WPM)',
        'Raw WPM',
        'Accuracy (%)',
        'Total Tests',
        'Mode',
        'Date',
        'Status',
        'Bot Risk (%)',
        'IP Address',
      ];
      const rows = filteredList.map((item) => [
        item.rank,
        `"${item.name}"`,
        `"${item.username}"`,
        item.wpm,
        item.rawWpm || item.wpm,
        `${item.accuracy}%`,
        item.tests || 0,
        `"${item.mode || 'Timed'}"`,
        `"${item.date || 'Sep 25, 2026'}"`,
        item.isFlagged ? 'Flagged Anomalous' : 'Verified Clean',
        `${item.botRisk || 0}%`,
        item.ip || '127.0.0.1',
      ]);
      const csvContent =
        'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `tara_typing_${activeTab}_leaderboard_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success(`Exported ${filteredList.length} leaderboard records to CSV!`, {
        position: 'top-right',
      });
    } finally {
      setIsExporting(false);
    }
  };

  // Reset Filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setModeFilter('All');
    setStatusFilter('All');
    setSortBy('rank');
    setCurrentPage(1);
    toast.info('Filters reset to default rankings', { position: 'top-right' });
  };

  const hasActiveFilters =
    searchQuery || modeFilter !== 'All' || statusFilter !== 'All' || sortBy !== 'rank';

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* ── 1. HEADER & QUICK ACTIONS ── */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 text-xs font-bold uppercase tracking-wider border border-purple-500/20">
              Fair-Play Moderation
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Podium Standings
            </span>
          </div>
          <h1 className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-display">
            Leaderboard Moderation & Fair-Play
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Audit platform high scores, verify legitimate records, and moderate automated bot submissions.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleExportCSV}
            disabled={isExporting}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <Download size={14} className={isExporting ? 'animate-bounce' : ''} />
            <span>{isExporting ? 'Exporting...' : 'Export CSV'}</span>
          </button>
        </div>
      </div>

      {/* ── 2. TOP 4 STANDARDIZED KPI METRICS (MATCHING ADMIN DASHBOARD) ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Card 1: All-Time Peak Speed */}
        <StatCard
          title="Peak Verified Speed"
          value={kpiStats.peakSpeed}
          change={3.4}
          isPositive={true}
          timeframe={`Held by ${kpiStats.peakHolder}`}
          icon={Trophy}
          hoverEffect="purple"
          colorClass="from-purple-500/20 to-indigo-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20"
        />

        {/* Card 2: Ranked Competitors */}
        <StatCard
          title="Ranked Typists"
          value={kpiStats.rankedTypists}
          change={15.0}
          isPositive={true}
          timeframe="active competitors"
          icon={Users}
          hoverEffect="blue"
          colorClass="from-blue-500/20 to-cyan-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
        />

        {/* Card 3: Podium Avg Accuracy */}
        <StatCard
          title="Podium Accuracy"
          value={kpiStats.podiumAccuracy}
          change={0.8}
          isPositive={true}
          timeframe="top-3 precision rate"
          icon={Target}
          hoverEffect="emerald"
          colorClass="from-emerald-500/20 to-teal-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
        />

        {/* Card 4: Flagged Anomalies */}
        <StatCard
          title="Flagged Anomalies"
          value={kpiStats.flaggedCount}
          change={-25.0}
          isPositive={false}
          timeframe="pending Sentry audit"
          icon={ShieldAlert}
          hoverEffect="rose"
          colorClass="from-rose-500/20 to-red-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20"
        />
      </div>

      {/* ── 3. TIMEFRAME TABS & FILTER TOOLBAR ── */}
      <div className="space-y-3">
        {/* Timeframe Selector Bar */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-x-auto stylish-scrollbar">
          {[
            { id: 'global', label: 'All-Time Global', icon: Globe },
            { id: 'daily', label: 'Daily Contest (24h)', icon: Sparkles },
            { id: 'weekly', label: 'This Week', icon: Calendar },
            { id: 'monthly', label: 'This Month', icon: Clock },
          ].map((tab) => {
            const isTabActive = activeTab === tab.id;
            const TabIcon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTab(tab.id);
                  setCurrentPage(1);
                }}
                className={`flex-1 min-w-[130px] flex items-center justify-center gap-2 py-2 px-3.5 rounded-xl text-xs font-semibold transition-all cursor-pointer select-none shrink-0 ${
                  isTabActive
                    ? 'bg-purple-600 text-white shadow-sm shadow-purple-500/30'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60'
                }`}
              >
                <TabIcon size={14} className={isTabActive ? 'text-white' : 'text-slate-400'} />
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-md font-mono ${
                    isTabActive
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {tabsCount[tab.id] !== undefined ? tabsCount[tab.id] : (leaderboardData[tab.id] || []).length}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search & Custom Filter Toolbar */}
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
              placeholder="Search ranked typist name or @handle..."
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

          {/* Filter Controls */}
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
      </div>

      {/* ── 4. LEADERBOARD INTERACTIVE TABLE ── */}
      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
        <div className="overflow-x-auto stylish-scrollbar">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/70 dark:bg-slate-950/40 text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-5 py-3.5">Rank</th>
                <th className="px-5 py-3.5">Typist Member</th>
                <th className="px-5 py-3.5">Speed (WPM)</th>
                <th className="px-5 py-3.5">Accuracy & Volume</th>
                <th className="px-5 py-3.5">Test Mode</th>
                <th className="px-5 py-3.5">Audit Standing</th>
                <th className="px-5 py-3.5 text-right">Moderation Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/70 dark:divide-slate-800">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="text-center py-16 text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="h-7 w-7 animate-spin rounded-full border-2 border-purple-500 border-t-transparent" />
                      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                        Loading leaderboard standings...
                      </span>
                    </div>
                  </td>
                </tr>
              ) : paginatedList.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-14 text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Trophy size={36} className="text-slate-300 dark:text-slate-700 stroke-[1.5]" />
                      <p className="font-semibold text-slate-600 dark:text-slate-300 text-sm">
                        No leaderboard records found matching your filters
                      </p>
                      <p className="text-xs text-slate-400">
                        Try resetting filters or switching between Global, Daily, Weekly, or Monthly tabs.
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
                paginatedList.map((entry) => {
                  const isFlagged = entry.isFlagged;
                  return (
                    <tr
                      key={entry.username}
                      className={`hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors ${
                        isFlagged ? 'bg-rose-500/[0.03] dark:bg-rose-950/[0.15]' : ''
                      }`}
                    >
                      {/* Rank Column with Podium Badges */}
                      <td className="px-5 py-4">
                        {entry.rank === 1 ? (
                          <div
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 text-xs font-extrabold shadow-2xs"
                            title="Gold 1st Place Podium"
                          >
                            <Crown size={12} className="fill-amber-500 stroke-none" />
                            <span>1st</span>
                          </div>
                        ) : entry.rank === 2 ? (
                          <div
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-400/15 text-slate-600 dark:text-slate-300 border border-slate-400/30 text-xs font-bold shadow-2xs"
                            title="Silver 2nd Place Podium"
                          >
                            <Medal size={12} className="text-slate-400" />
                            <span>2nd</span>
                          </div>
                        ) : entry.rank === 3 ? (
                          <div
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-700/15 text-amber-700 dark:text-amber-500 border border-amber-700/30 text-xs font-bold shadow-2xs"
                            title="Bronze 3rd Place Podium"
                          >
                            <Medal size={12} className="text-amber-700 dark:text-amber-500" />
                            <span>3rd</span>
                          </div>
                        ) : (
                          <span className="font-mono text-xs font-semibold text-slate-500 dark:text-slate-400 pl-2">
                            #{entry.rank}
                          </span>
                        )}
                      </td>

                      {/* Typist Member */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="relative shrink-0">
                            <UserAvatar
                              src={entry.avatar}
                              name={entry.name}
                              username={entry.username}
                              className="h-8 w-8"
                              textClassName="text-xs font-bold"
                              rounded="rounded-xl"
                              firstLetterOnly
                            />
                            {entry.streak > 0 && (
                              <span
                                className="absolute -top-1 -right-1 inline-flex items-center px-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-extrabold text-[8px] border border-white dark:border-slate-900"
                                title={`${entry.streak} Day Streak`}
                              >
                                <Flame size={7} className="fill-white stroke-none" />
                              </span>
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900 dark:text-white leading-tight">
                              {entry.name}
                            </p>
                            <p className="text-xs text-purple-600 dark:text-purple-400 font-medium">
                              @{entry.username}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Speed (WPM) & Raw */}
                      <td className="px-5 py-4">
                        <div
                          className={`font-bold text-base ${
                            entry.wpm >= 200
                              ? 'text-rose-600 dark:text-rose-400'
                              : 'text-purple-600 dark:text-purple-400'
                          }`}
                        >
                          {entry.wpm} <span className="text-xs font-semibold text-slate-400">WPM</span>
                        </div>
                        <div className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">
                          Raw: {entry.rawWpm || entry.wpm} WPM
                        </div>
                      </td>

                      {/* Accuracy & Volume */}
                      <td className="px-5 py-4">
                        <div className="font-semibold text-slate-800 dark:text-slate-200">
                          {entry.accuracy}%
                        </div>
                        <div className="text-[11px] text-slate-400 dark:text-slate-500">
                          {entry.tests ? `${entry.tests.toLocaleString()} tests` : 'Recent run'}
                        </div>
                      </td>

                      {/* Test Mode */}
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60">
                          {entry.mode || 'Timed 60s'}
                        </span>
                      </td>

                      {/* Audit Standing & Switch Toggle */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2.5">
                          {/* Pixel-Perfect Switch Slider */}
                          <button
                            type="button"
                            onClick={() => toggleScoreLegitimacy(entry)}
                            className={`group relative inline-flex h-4 w-8 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 ${
                              !isFlagged ? 'bg-emerald-500' : 'bg-rose-500'
                            }`}
                            aria-label={`Mark score as ${isFlagged ? 'Verified' : 'Flagged'}`}
                            title={`Click to mark as ${isFlagged ? 'Verified' : 'Flagged'}`}
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
                            {!isFlagged ? 'Verified' : 'Flagged'}
                          </span>
                        </div>
                      </td>

                      {/* Moderation Actions */}
                      <td className="px-5 py-4 text-right">
                        <div className="inline-flex items-center gap-2 justify-end">
                          {/* Inspect Session Button */}
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedEntry(entry);
                              setDrawerTab('performance');
                            }}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-purple-200/80 dark:border-purple-800/60 bg-purple-50/90 dark:bg-purple-950/40 text-xs font-semibold text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/60 hover:border-purple-300 dark:hover:border-purple-700 hover:scale-105 active:scale-95 transition-all shadow-2xs shadow-purple-500/10 cursor-pointer"
                            title="Inspect Score Telemetry"
                          >
                            <Eye size={13} strokeWidth={2.2} />
                            <span>Inspect</span>
                          </button>

                          {/* Disqualify Button */}
                          <button
                            type="button"
                            onClick={() => handleDisqualify(entry)}
                            className="p-1.5 rounded-xl border border-rose-200/80 dark:border-rose-800/60 bg-rose-50/90 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/60 hover:border-rose-300 dark:hover:border-rose-700 hover:scale-105 active:scale-95 transition-all shadow-2xs shadow-rose-500/10 cursor-pointer"
                            title="Disqualify Score"
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
          totalItems={filteredList.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* ── 5. INSPECT SCORE SLIDE-OVER SIDE DRAWER (PORTAL TO DOCUMENT.BODY) ── */}
      {typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {selectedEntry && (
              <>
                {/* Backdrop */}
                <motion.div
                  key="leaderboard-drawer-backdrop"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.22, ease: 'easeOut' }}
                  className="fixed inset-0 z-[60] bg-slate-950/60 backdrop-blur-xs"
                  onClick={() => setSelectedEntry(null)}
                  aria-hidden="true"
                />

                {/* Slide-Over Drawer Container */}
                <motion.div
                  key="leaderboard-drawer-panel"
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ type: 'spring', damping: 30, stiffness: 280 }}
                  className="fixed inset-y-0 right-0 z-[70] w-full max-w-md sm:max-w-xl h-screen max-h-screen bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col"
                  role="dialog"
                  aria-modal="true"
                  aria-label="High Score Audit Drawer"
                >
                  {/* Drawer Header */}
                  <div className="flex items-center justify-between px-5 py-2.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/50 shrink-0">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                        <Trophy size={15} />
                      </div>
                      <div>
                        <h2 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                          Leaderboard Score Dossier
                        </h2>
                        <span className="font-mono text-[11px] text-purple-600 dark:text-purple-400 font-semibold">
                          Rank #{selectedEntry.rank} • {activeTab.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedEntry(null)}
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
                            src={selectedEntry.avatar}
                            name={selectedEntry.name}
                            username={selectedEntry.username}
                            className="h-12 w-12"
                            textClassName="text-base font-bold"
                            rounded="rounded-xl"
                            firstLetterOnly
                          />
                          {selectedEntry.streak > 0 && (
                            <span
                              className="absolute -top-1 -right-1 z-10 inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-extrabold text-[9px] shadow-sm border border-white dark:border-slate-900 leading-tight"
                              title={`${selectedEntry.streak} Day Typing Streak`}
                            >
                              <Flame size={9} className="fill-white stroke-none" />
                              <span>{selectedEntry.streak}d</span>
                            </span>
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-bold text-base text-slate-900 dark:text-white leading-tight">
                              {selectedEntry.name}
                            </h3>
                            <span
                              className={`px-2 py-0.5 rounded-full text-xs font-bold border ${
                                !selectedEntry.isFlagged
                                  ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                                  : 'bg-rose-500/10 text-rose-600 border-rose-500/20'
                              }`}
                            >
                              {!selectedEntry.isFlagged ? 'Verified' : 'Flagged'}
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            <span className="text-purple-600 dark:text-purple-400 font-semibold">
                              @{selectedEntry.username}
                            </span>
                            <span>•</span>
                            <span>{selectedEntry.mode || 'Timed 60s'}</span>
                          </div>
                        </div>
                      </div>

                      {/* Metadata Badges */}
                      <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-200/70 dark:border-slate-800 text-[11px]">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-500/10 border border-purple-500/20 font-semibold text-purple-700 dark:text-purple-300">
                          <Trophy size={12} className="text-purple-600 dark:text-purple-400 shrink-0" />
                          <span>Rank: #{selectedEntry.rank}</span>
                        </div>

                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-medium">
                          <Calendar size={12} className="text-slate-400 shrink-0" />
                          <span>{selectedEntry.date || 'Sep 25, 2026'}</span>
                        </div>

                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-medium">
                          <Layers size={12} className="text-slate-400 shrink-0" />
                          <span>{selectedEntry.tests ? `${selectedEntry.tests} Tests` : 'Competitor'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Navigation Tabs */}
                    <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80">
                      <button
                        type="button"
                        onClick={() => setDrawerTab('performance')}
                        className={`flex-1 flex items-center justify-center gap-2 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                          drawerTab === 'performance'
                            ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-xs'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        <Trophy size={13} />
                        <span>High Score Metrics</span>
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
                        <span>Anti-Cheat Proof</span>
                      </button>
                    </div>

                    {/* TAB 1: HIGH SCORE PERFORMANCE */}
                    {drawerTab === 'performance' && (
                      <div className="space-y-4">
                        {/* 4 Metric Cards */}
                        <div className="grid grid-cols-2 gap-2.5">
                          {/* Net Speed */}
                          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800">
                            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                              Net Speed
                            </span>
                            <div className="font-bold text-lg text-purple-600 dark:text-purple-400 mt-0.5">
                              {selectedEntry.wpm} <span className="text-xs font-normal">WPM</span>
                            </div>
                          </div>

                          {/* Raw Speed */}
                          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800">
                            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                              Raw Speed
                            </span>
                            <div className="font-bold text-lg text-blue-600 dark:text-blue-400 mt-0.5">
                              {selectedEntry.rawWpm || selectedEntry.wpm}{' '}
                              <span className="text-xs font-normal">WPM</span>
                            </div>
                          </div>

                          {/* Accuracy */}
                          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800">
                            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                              Accuracy Rate
                            </span>
                            <div className="font-bold text-lg text-emerald-600 dark:text-emerald-400 mt-0.5">
                              {selectedEntry.accuracy}%
                            </div>
                          </div>

                          {/* Consistency */}
                          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800">
                            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                              Consistency
                            </span>
                            <div className="font-bold text-lg text-amber-600 dark:text-amber-400 mt-0.5">
                              {selectedEntry.consistency || 92.5}%
                            </div>
                          </div>
                        </div>

                        {/* Test Mode & Submission Breakdown */}
                        <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 space-y-2.5">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                            <Keyboard size={13} className="text-purple-500" />
                            Session Submission Breakdown
                          </h4>

                          <div className="grid grid-cols-3 gap-2 text-center">
                            <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-200/70 dark:border-slate-800">
                              <span className="text-[10px] text-slate-400 block font-semibold">Total Tests</span>
                              <span className="font-bold text-sm text-slate-900 dark:text-white">
                                {selectedEntry.tests || 1}
                              </span>
                            </div>
                            <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-200/70 dark:border-slate-800">
                              <span className="text-[10px] text-slate-400 block font-semibold">Streak</span>
                              <span className="font-bold text-sm text-amber-600 dark:text-amber-400">
                                {selectedEntry.streak || 0}d
                              </span>
                            </div>
                            <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-200/70 dark:border-slate-800">
                              <span className="text-[10px] text-slate-400 block font-semibold">Rank Tier</span>
                              <span className="font-bold text-sm text-purple-600 dark:text-purple-400">
                                {selectedEntry.rank <= 3 ? 'Podium' : 'Challenger'}
                              </span>
                            </div>
                          </div>

                          {/* Cadence Variance Note */}
                          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                            <span className="text-slate-400 block font-semibold text-[10px] uppercase">
                              Keystroke Cadence Analysis
                            </span>
                            <p className="mt-0.5 font-medium text-slate-700 dark:text-slate-300">
                              {selectedEntry.isFlagged || selectedEntry.wpm > 200 ? (
                                <span className="text-rose-600 dark:text-rose-400 flex items-center gap-1">
                                  <AlertTriangle size={13} />
                                  Robotic uniform latency (&lt;15ms). Injected keystroke sequence detected.
                                </span>
                              ) : (
                                <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                                  <CheckCircle size={13} />
                                  Human dwell time variance verified. Natural burst speed characteristics.
                                </span>
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* TAB 2: ANTI-CHEAT PROOF & TELEMETRY */}
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
                                (selectedEntry.botRisk || (selectedEntry.isFlagged ? 95 : 2)) > 50
                                  ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400'
                                  : 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                              }`}
                            >
                              {selectedEntry.botRisk || (selectedEntry.isFlagged ? 95 : 2)}% Probability (
                              {(selectedEntry.botRisk || (selectedEntry.isFlagged ? 95 : 2)) > 50
                                ? 'High Risk / Bot Script'
                                : 'Low Risk / Legitimate'}
                              )
                            </span>
                          </div>
                          <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${
                                (selectedEntry.botRisk || (selectedEntry.isFlagged ? 95 : 2)) > 50
                                  ? 'bg-rose-500'
                                  : 'bg-emerald-500'
                              }`}
                              style={{
                                width: `${selectedEntry.botRisk || (selectedEntry.isFlagged ? 95 : 2)}%`,
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
                                  Submission IP
                                </span>
                                <span className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200">
                                  {selectedEntry.ip || '103.44.112.5'}
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
                                  Browser & Environment
                                </span>
                                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                                  {selectedEntry.browser || 'Chrome 128 / Windows 11'}
                                </span>
                              </div>
                            </div>
                            <span className="px-2 py-0.5 rounded-md bg-purple-500/10 text-[10px] font-semibold text-purple-600 dark:text-purple-400 border border-purple-500/20">
                              Client Verified
                            </span>
                          </div>

                          {/* Standing Card */}
                          <div className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:border-purple-500/30 transition-colors">
                            <div className="flex items-center gap-2.5">
                              <div
                                className={`p-2 rounded-lg border ${
                                  !selectedEntry.isFlagged
                                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                                    : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
                                }`}
                              >
                                {!selectedEntry.isFlagged ? (
                                  <ShieldCheck size={15} />
                                ) : (
                                  <ShieldAlert size={15} />
                                )}
                              </div>
                              <div>
                                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block">
                                  Leaderboard Standing
                                </span>
                                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                                  {!selectedEntry.isFlagged
                                    ? 'Verified Authentic Ranking'
                                    : 'Flagged for Bot Disqualification'}
                                </span>
                              </div>
                            </div>
                            <span
                              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border shadow-2xs ${
                                !selectedEntry.isFlagged
                                  ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                                  : 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30'
                              }`}
                            >
                              <span
                                className={`h-1.5 w-1.5 rounded-full ${
                                  !selectedEntry.isFlagged ? 'bg-emerald-500' : 'bg-rose-500'
                                }`}
                              />
                              <span>{!selectedEntry.isFlagged ? 'Verified' : 'Flagged'}</span>
                            </span>
                          </div>
                        </div>

                        {/* Sentry Audit Notes */}
                        <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40 text-xs space-y-1">
                          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider flex items-center gap-1">
                            <Shield size={12} className="text-purple-500" />
                            Sentry Telemetry Audit Proof
                          </span>
                          <p className="font-mono text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                            {selectedEntry.telemetryNotes ||
                              'Organic keystroke dwell time and cadence recorded throughout session.'}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Drawer Sticky Footer with Top-Positioned Tooltips */}
                  <div className="px-5 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-950/80 shrink-0 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setSelectedEntry(null)}
                      className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      Close
                    </button>

                    <div className="flex items-center gap-3">
                      {/* Legitimacy Toggle Icon Button with Top Tooltip */}
                      <div className="relative group/tooltip flex items-center">
                        <button
                          type="button"
                          onClick={() => toggleScoreLegitimacy(selectedEntry)}
                          className={`p-2.5 rounded-xl border transition-all duration-150 hover:scale-105 active:scale-95 shadow-2xs cursor-pointer ${
                            selectedEntry.isFlagged
                              ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 shadow-emerald-500/10'
                              : 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800/60 hover:bg-amber-100 dark:hover:bg-amber-900/50 shadow-amber-500/10'
                          }`}
                          aria-label={
                            selectedEntry.isFlagged
                              ? 'Verify Score Legitimacy'
                              : 'Flag Score as Suspicious'
                          }
                        >
                          {selectedEntry.isFlagged ? (
                            <CheckCircle size={16} strokeWidth={2.2} />
                          ) : (
                            <AlertTriangle size={16} strokeWidth={2.2} />
                          )}
                        </button>

                        {/* Top-Positioned Tooltip */}
                        <div className="pointer-events-none absolute bottom-full mb-2.5 left-1/2 -translate-x-1/2 opacity-0 group-hover/tooltip:opacity-100 group-hover/tooltip:-translate-y-1 transition-all duration-150 z-50 whitespace-nowrap">
                          <div className="px-3 py-1.5 rounded-xl bg-slate-900 text-white dark:bg-slate-800 dark:text-white text-[11px] font-semibold shadow-xl border border-slate-700/60 flex items-center gap-1.5">
                            <span>
                              {selectedEntry.isFlagged
                                ? 'Verify Score Legitimacy'
                                : 'Flag Score as Suspicious'}
                            </span>
                          </div>
                          <div className="w-2 h-2 bg-slate-900 dark:bg-slate-800 border-r border-b border-slate-700/60 rotate-45 mx-auto -mt-1 rounded-xs" />
                        </div>
                      </div>

                      {/* Disqualify Icon Button with Top Tooltip */}
                      <div className="relative group/tooltip flex items-center">
                        <button
                          type="button"
                          onClick={() => handleDisqualify(selectedEntry)}
                          className="p-2.5 rounded-xl text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800/60 hover:bg-rose-100 dark:hover:bg-rose-900/50 hover:text-rose-700 hover:scale-105 active:scale-95 transition-all shadow-2xs shadow-rose-500/10 cursor-pointer"
                          aria-label="Disqualify Score"
                        >
                          <Trash2 size={16} strokeWidth={2.2} />
                        </button>

                        {/* Top-Positioned Tooltip */}
                        <div className="pointer-events-none absolute bottom-full mb-2.5 right-0 opacity-0 group-hover/tooltip:opacity-100 group-hover/tooltip:-translate-y-1 transition-all duration-150 z-50 whitespace-nowrap">
                          <div className="px-3 py-1.5 rounded-xl bg-rose-600 text-white text-[11px] font-semibold shadow-xl border border-rose-500 flex items-center gap-1.5">
                            <Trash2 size={12} />
                            <span>Disqualify from Leaderboard</span>
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

export default AdminLeaderboard;
