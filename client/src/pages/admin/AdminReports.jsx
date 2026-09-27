import React, { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Flag,
  Eye,
  CheckCircle2,
  XCircle,
  Search,
  Filter,
  ChevronDown,
  Check,
  RotateCcw,
  Download,
  Users,
  Clock,
  Globe,
  Monitor,
  Ban,
  Trash2,
  X,
  FileText,
  Zap,
} from 'lucide-react';
import { toast } from 'react-toastify';
import StatCard from '../../components/admin/StatCard';
import StatusBadge from '../../components/admin/StatusBadge';
import AdminModal from '../../components/admin/AdminModal';
import UserAvatar from '../../components/common/UserAvatar';
import { reportsAdminData } from '../../data/adminMockData';

// Status Filter Options
const statusOptions = [
  { value: 'All', label: 'All Statuses', dot: 'bg-slate-400' },
  { value: 'Open', label: 'Open Queue', dot: 'bg-rose-500' },
  { value: 'Under Review', label: 'Under Review', dot: 'bg-amber-500' },
  { value: 'Resolved', label: 'Resolved Cases', dot: 'bg-emerald-500' },
  { value: 'Dismissed', label: 'Dismissed Reports', dot: 'bg-slate-500' },
];

// Category Filter Options
const categoryOptions = [
  { value: 'All', label: 'All Categories', dot: 'bg-slate-400' },
  { value: 'Anti-Cheat', label: 'Anti-Cheat Telemetry', dot: 'bg-rose-500' },
  { value: 'Leaderboard', label: 'Leaderboard Integrity', dot: 'bg-purple-500' },
  { value: 'Profile Bio', label: 'Profile Bio / Spam', dot: 'bg-blue-500' },
];

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
        <div className="absolute right-0 top-full mt-1.5 z-50 w-56 rounded-2xl border border-slate-200/90 dark:border-slate-700/80 bg-white dark:bg-slate-900 p-1.5 shadow-2xl shadow-slate-950/25 backdrop-blur-md animate-in fade-in zoom-in-95 duration-150">
          <div className="px-2.5 py-1.5 mb-1 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1">
              <Filter size={10} />
              Violation Category
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

export const AdminReports = () => {
  const [reports, setReports] = useState(reportsAdminData);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Dropdown toggles
  const [openDropdown, setOpenDropdown] = useState(null);

  // Side Drawer inspect state
  const [selectedReport, setSelectedReport] = useState(null);

  // Close dropdown on click outside or Escape
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('[data-status-dropdown]') && !event.target.closest('[data-category-dropdown]')) {
        setOpenDropdown(null);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setOpenDropdown(null);
        setSelectedReport(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Filter Logic
  const filteredReports = useMemo(() => {
    return reports.filter((r) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        r.id.toLowerCase().includes(q) ||
        r.target.toLowerCase().includes(q) ||
        r.targetUsername.toLowerCase().includes(q) ||
        r.reporter.toLowerCase().includes(q) ||
        r.reason.toLowerCase().includes(q);
      const matchesStatus =
        statusFilter === 'All' || r.status.toLowerCase() === statusFilter.toLowerCase();
      const matchesCategory =
        categoryFilter === 'All' || r.category.toLowerCase() === categoryFilter.toLowerCase();

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [reports, searchQuery, statusFilter, categoryFilter]);

  // Derived Top KPI Metrics
  const kpiStats = useMemo(() => {
    const openCount = reports.filter((r) => r.status === 'Open' || r.status === 'Under Review').length;
    const botCount = reports.filter((r) => r.category === 'Anti-Cheat').length;
    const resolvedCount = reports.filter((r) => r.status === 'Resolved').length;

    return {
      openCases: `${openCount} Open Cases`,
      botDetections: `${botCount} Bot Flags`,
      resolvedCount: `${resolvedCount} Cases Resolved`,
      accuracyScore: '100% Verified',
    };
  }, [reports]);

  // Action Handlers
  const handleResolveAction = (reportId, newStatus, message) => {
    setReports((prev) =>
      prev.map((r) => (r.id === reportId ? { ...r, status: newStatus } : r))
    );
    if (selectedReport && selectedReport.id === reportId) {
      setSelectedReport({ ...selectedReport, status: newStatus });
    }
    toast.success(message, { position: 'top-right' });
  };

  // Reset Filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('All');
    setCategoryFilter('All');
    toast.info('Filters reset to standard queue', { position: 'top-right' });
  };

  const hasActiveFilters = searchQuery || statusFilter !== 'All' || categoryFilter !== 'All';

  // Export CSV
  const handleExportCSV = () => {
    if (filteredReports.length === 0) {
      toast.error('No reports to export', { position: 'top-right' });
      return;
    }
    const headers = [
      'Report ID',
      'Accused Target',
      'Target Username',
      'Reporter',
      'Category',
      'Reason',
      'Speed Recorded',
      'Status',
      'IP Address',
      'Client Browser',
      'Date',
    ];
    const rows = filteredReports.map((r) => [
      r.id,
      `"${r.target}"`,
      `@${r.targetUsername}`,
      `"${r.reporter}"`,
      r.category,
      `"${r.reason}"`,
      r.speedRecorded,
      r.status,
      r.ip,
      `"${r.browser}"`,
      `"${r.date}"`,
    ]);
    const csv =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const uri = encodeURI(csv);
    const link = document.createElement('a');
    link.href = uri;
    link.download = `tara_typing_moderation_reports_${Date.now()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Exported ${filteredReports.length} reports to CSV!`, { position: 'top-right' });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* ── 1. HEADER & QUICK ACTIONS ── */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-bold uppercase tracking-wider border border-rose-500/20">
              Integrity & Moderation
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Sentry Anti-Cheat Active
            </span>
          </div>
          <h1 className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-display">
            Reports & Moderation Desk
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Audit user cheat reports, synthetic keystroke injection alerts, and sanitize profile bio violations.
          </p>
        </div>

        <button
          type="button"
          onClick={handleExportCSV}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm cursor-pointer self-start md:self-auto"
        >
          <Download size={14} />
          <span>Export Moderation Log</span>
        </button>
      </div>

      {/* ── 2. TOP 4 STANDARDIZED KPI METRICS ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Card 1: Open Queue */}
        <StatCard
          title="Active Moderation Queue"
          value={kpiStats.openCases}
          change={12.5}
          isPositive={false}
          timeframe="requires review"
          icon={AlertTriangle}
          hoverEffect="rose"
          colorClass="from-rose-500/20 to-red-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20"
        />

        {/* Card 2: Bot Detections */}
        <StatCard
          title="Anti-Cheat Bot Detections"
          value={kpiStats.botDetections}
          change={25.0}
          isPositive={false}
          timeframe="synthetic cadence alerts"
          icon={ShieldAlert}
          hoverEffect="purple"
          colorClass="from-purple-500/20 to-indigo-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20"
        />

        {/* Card 3: Resolved Cases */}
        <StatCard
          title="Resolved & Sanitized"
          value={kpiStats.resolvedCount}
          change={100}
          isPositive={true}
          timeframe="sanitized or penalized"
          icon={ShieldCheck}
          hoverEffect="emerald"
          colorClass="from-emerald-500/20 to-teal-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
        />

        {/* Card 4: Integrity Score */}
        <StatCard
          title="Leaderboard Cleanliness"
          value="99.8%"
          change={0.2}
          isPositive={true}
          timeframe="verified authentic typists"
          icon={CheckCircle2}
          hoverEffect="blue"
          colorClass="from-blue-500/20 to-cyan-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
        />
      </div>

      {/* ── 3. FILTER TOOLBAR (ZERO NATIVE SELECT) ── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3.5 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search
            size={14}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by case ID, accused typist, reporter, or reason..."
            className="w-full h-9 pl-9 pr-8 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs p-0.5 rounded cursor-pointer"
            >
              <X size={12} />
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <StatusFilterDropdown
            value={statusFilter}
            onChange={(val) => {
              setStatusFilter(val);
              setOpenDropdown(null);
            }}
            isOpen={openDropdown === 'status'}
            onToggle={() => setOpenDropdown(openDropdown === 'status' ? null : 'status')}
          />

          <CategoryFilterDropdown
            value={categoryFilter}
            onChange={(val) => {
              setCategoryFilter(val);
              setOpenDropdown(null);
            }}
            isOpen={openDropdown === 'category'}
            onToggle={() => setOpenDropdown(openDropdown === 'category' ? null : 'category')}
          />

          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="h-9 px-2.5 rounded-xl border border-rose-200/80 dark:border-rose-900/50 bg-rose-50/50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 text-xs font-semibold inline-flex items-center gap-1.5 hover:bg-rose-100/70 transition-colors cursor-pointer"
            >
              <RotateCcw size={12} />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* ── 4. REPORTS TABLE ── */}
      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50/80 dark:bg-slate-950/50 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-5 py-3.5">Case ID</th>
                <th className="px-5 py-3.5">Accused Typist</th>
                <th className="px-5 py-3.5">Category</th>
                <th className="px-5 py-3.5">Violation Reason</th>
                <th className="px-5 py-3.5">Telemetry Speed</th>
                <th className="px-5 py-3.5">Reporter</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {filteredReports.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400 text-xs">
                    No moderation reports match the current filters.
                  </td>
                </tr>
              ) : (
                filteredReports.map((r) => {
                  return (
                    <tr
                      key={r.id}
                      className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="px-5 py-3.5 font-mono font-bold text-slate-600 dark:text-slate-300">
                        {r.id}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <UserAvatar
                            src={r.targetAvatar}
                            name={r.target}
                            username={r.targetUsername}
                            className="h-8 w-8"
                            textClassName="text-xs font-bold"
                            rounded="rounded-full"
                            firstLetterOnly
                          />
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white leading-tight">
                              {r.target}
                            </p>
                            <span className="text-[11px] text-slate-400 font-mono">
                              @{r.targetUsername}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                            r.category === 'Anti-Cheat'
                              ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                              : r.category === 'Profile Bio'
                              ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20'
                              : 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20'
                          }`}
                        >
                          {r.category}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-slate-700 dark:text-slate-300 max-w-xs truncate font-medium">
                        {r.reason}
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap font-mono font-bold text-rose-600 dark:text-rose-400">
                        {r.speedRecorded}
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap text-slate-500 dark:text-slate-400 text-xs">
                        {r.reporter}
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <StatusBadge status={r.status} />
                      </td>
                      <td className="px-5 py-3.5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Inspect Dossier (Purple) */}
                          <button
                            type="button"
                            onClick={() => setSelectedReport(r)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-purple-200/80 dark:border-purple-800/60 bg-purple-50/90 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 hover:bg-purple-100 transition-all font-semibold cursor-pointer"
                          >
                            <Eye size={13} strokeWidth={2.2} />
                            <span>Review</span>
                          </button>

                          {/* Quick Dismiss or Suspend */}
                          {r.status !== 'Resolved' && (
                            <button
                              type="button"
                              onClick={() =>
                                handleResolveAction(
                                  r.id,
                                  'Resolved',
                                  `Case ${r.id} marked as Resolved!`
                                )
                              }
                              className="p-1.5 rounded-xl border border-emerald-200/80 dark:border-emerald-800/60 bg-emerald-50/90 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 transition-all cursor-pointer"
                              title="Verify & Resolve"
                            >
                              <ShieldCheck size={13} strokeWidth={2.2} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── 5. SLIDE-OVER INSPECT SIDE DRAWER (PORTAL TO BODY) ── */}
      {typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {selectedReport && (
              <div className="fixed inset-0 z-[70] flex justify-end">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => setSelectedReport(null)}
                  className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs cursor-pointer"
                />

                <motion.div
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ type: 'spring', damping: 28, stiffness: 280 }}
                  className="relative z-10 w-full max-w-lg h-full bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col justify-between overflow-hidden"
                >
                  {/* Header */}
                  <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/50">
                    <div className="flex items-center gap-2.5">
                      <div className="grid h-9 w-9 place-items-center rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                        <ShieldAlert size={18} />
                      </div>
                      <div>
                        <h2 className="text-base font-bold text-slate-900 dark:text-white font-display">
                          Moderation Case Dossier
                        </h2>
                        <span className="text-xs text-slate-400 font-mono">
                          Case: {selectedReport.id} • Category: {selectedReport.category}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedReport(null)}
                      className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  {/* Body */}
                  <div className="p-6 space-y-6 flex-1 overflow-y-auto">
                    {/* Accused Typist Identity Card */}
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <UserAvatar
                          src={selectedReport.targetAvatar}
                          name={selectedReport.target}
                          username={selectedReport.targetUsername}
                          className="h-12 w-12"
                          textClassName="text-base font-bold"
                          rounded="rounded-full"
                          firstLetterOnly
                        />
                        <div>
                          <h3 className="font-bold text-base text-slate-900 dark:text-white font-display">
                            {selectedReport.target}
                          </h3>
                          <span className="text-xs text-slate-400 font-mono">
                            @{selectedReport.targetUsername}
                          </span>
                        </div>
                      </div>

                      <StatusBadge status={selectedReport.status} />
                    </div>

                    {/* Anti-Cheat Telemetry Snapshot */}
                    <div className="p-4 rounded-2xl bg-rose-500/5 border border-rose-500/20 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                          <Zap size={14} /> Recorded Performance Flag
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-bold font-mono">
                          {selectedReport.speedRecorded}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                          <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                            Accuracy Recorded
                          </span>
                          <span className="font-bold text-slate-900 dark:text-white">
                            {selectedReport.accuracyRecorded}
                          </span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                          <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                            Inter-Key Cadence
                          </span>
                          <span className="font-bold text-rose-600 dark:text-rose-400 font-mono">
                            {selectedReport.cadenceLatency}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Details & Telemetry Evidence */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                        Violation Description & Sentry Telemetry
                      </h4>
                      <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                        <p className="font-semibold text-slate-800 dark:text-slate-200">
                          "{selectedReport.details}"
                        </p>
                        <p className="text-slate-500 dark:text-slate-400 font-mono text-[11px] pt-2 border-t border-slate-200/60 dark:border-slate-800">
                          Telemetry: {selectedReport.telemetryEvidence}
                        </p>
                      </div>
                    </div>

                    {/* Diagnostic Identifiers */}
                    <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 space-y-2.5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                          <Globe size={13} /> Recorded IP
                        </span>
                        <span className="font-mono font-semibold text-slate-900 dark:text-white">
                          {selectedReport.ip}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                          <Monitor size={13} /> Client Environment
                        </span>
                        <span className="font-semibold text-slate-900 dark:text-white">
                          {selectedReport.browser}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                          <Users size={13} /> Reported By
                        </span>
                        <span className="font-semibold text-purple-600 dark:text-purple-400">
                          {selectedReport.reporter}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Sticky Footer Moderation Actions */}
                  <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/70 flex items-center justify-between gap-2 flex-wrap">
                    <button
                      type="button"
                      onClick={() =>
                        handleResolveAction(
                          selectedReport.id,
                          'Dismissed',
                          `Case ${selectedReport.id} dismissed as benign.`
                        )
                      }
                      className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      Dismiss Case
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          handleResolveAction(
                            selectedReport.id,
                            'Resolved',
                            `Leaderboard score disqualified for ${selectedReport.target}!`
                          )
                        }
                        className="px-3 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold transition-all cursor-pointer shadow-sm shadow-purple-500/20"
                      >
                        Disqualify Score
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleResolveAction(
                            selectedReport.id,
                            'Resolved',
                            `Account @${selectedReport.targetUsername} suspended!`
                          )
                        }
                        className="px-3 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold transition-all cursor-pointer shadow-sm shadow-rose-500/20"
                      >
                        Suspend Account
                      </button>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </div>
  );
};

export default AdminReports;
