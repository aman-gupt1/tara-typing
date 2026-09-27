import React, { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Megaphone,
  Plus,
  Edit,
  Trash2,
  Calendar,
  Info,
  AlertTriangle,
  CheckCircle2,
  Eye,
  Search,
  Filter,
  ChevronDown,
  Check,
  RotateCcw,
  LayoutGrid,
  List,
  Download,
  Users,
  Clock,
  Sparkles,
  X,
  Bell,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { toast } from 'react-toastify';
import StatCard from '../../components/admin/StatCard';
import StatusBadge from '../../components/admin/StatusBadge';
import AdminModal from '../../components/admin/AdminModal';
import { announcementsAdminData } from '../../data/adminMockData';

// Type Options
const typeOptions = [
  { value: 'All', label: 'All Broadcast Types', dot: 'bg-slate-400' },
  { value: 'Info', label: 'Informational Notice', dot: 'bg-purple-500' },
  { value: 'Success', label: 'Feature / Release Update', dot: 'bg-emerald-500' },
  { value: 'Warning', label: 'Maintenance / Alert', dot: 'bg-amber-500' },
];

// Status Options
const statusOptions = [
  { value: 'All', label: 'All Statuses', dot: 'bg-slate-400' },
  { value: 'Active', label: 'Active Live', dot: 'bg-emerald-500' },
  { value: 'Scheduled', label: 'Scheduled Ahead', dot: 'bg-blue-500' },
  { value: 'Expired', label: 'Expired / Archived', dot: 'bg-slate-500' },
];

// Custom Type Filter Dropdown
const TypeFilterDropdown = ({ value, onChange, isOpen, onToggle }) => {
  const selected = typeOptions.find((t) => t.value === value) || typeOptions[0];

  return (
    <div className="relative inline-block" data-type-dropdown>
      <button
        type="button"
        onClick={onToggle}
        className={`h-9 px-3 rounded-xl border text-xs font-semibold inline-flex items-center gap-2 transition-all duration-200 cursor-pointer shadow-2xs hover:shadow-xs active:scale-95 select-none ${
          value !== 'All'
            ? 'border-purple-500/40 bg-purple-500/10 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300'
            : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 text-slate-700 dark:text-slate-200 hover:border-slate-300 dark:hover:border-slate-700'
        }`}
        aria-label="Filter by Type"
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
              Broadcast Type
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
            {typeOptions.map((opt) => {
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
        <div className="absolute right-0 top-full mt-1.5 z-50 w-52 rounded-2xl border border-slate-200/90 dark:border-slate-700/80 bg-white dark:bg-slate-900 p-1.5 shadow-2xl shadow-slate-950/25 backdrop-blur-md animate-in fade-in zoom-in-95 duration-150">
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

export const AdminAnnouncements = () => {
  const [announcements, setAnnouncements] = useState(announcementsAdminData);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'

  // Dropdown toggles
  const [openDropdown, setOpenDropdown] = useState(null);

  // Side Drawer inspect state
  const [selectedAnn, setSelectedAnn] = useState(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAnn, setEditingAnn] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'Info',
    placement: 'Top Header Banner',
    targetAudience: 'All Typists',
    startDate: '',
    endDate: '',
    isDismissible: true,
  });

  // Close dropdown on click outside or Escape
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('[data-type-dropdown]') && !event.target.closest('[data-status-dropdown]')) {
        setOpenDropdown(null);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setOpenDropdown(null);
        setSelectedAnn(null);
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

  // Filter Logic
  const filteredAnnouncements = useMemo(() => {
    return announcements.filter((a) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        a.title.toLowerCase().includes(q) ||
        a.message.toLowerCase().includes(q) ||
        a.id.toLowerCase().includes(q);
      const matchesType = typeFilter === 'All' || a.type.toLowerCase() === typeFilter.toLowerCase();
      const matchesStatus =
        statusFilter === 'All' || a.status.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [announcements, searchQuery, typeFilter, statusFilter]);

  // Derived Top KPI Metrics
  const kpiStats = useMemo(() => {
    const activeCount = announcements.filter((a) => a.status === 'Active').length;
    const scheduledCount = announcements.filter((a) => a.status === 'Scheduled').length;
    const totalImpressions = announcements.reduce((sum, a) => sum + (a.impressions || 0), 0);
    const totalClicks = announcements.reduce((sum, a) => sum + (a.clicks || 0), 0);

    return {
      activeBroadcasts: `${activeCount} Live`,
      scheduledBroadcasts: `${scheduledCount} Scheduled`,
      totalReach: totalImpressions.toLocaleString(),
      totalClicks: totalClicks.toLocaleString(),
    };
  }, [announcements]);

  // Toggle Publish Status
  const togglePublishStatus = (id) => {
    setAnnouncements((prev) =>
      prev.map((a) => {
        if (a.id === id) {
          const next = a.status === 'Active' ? 'Expired' : 'Active';
          toast.success(`Announcement "${a.title}" set to ${next}!`, { position: 'top-right' });
          if (selectedAnn && selectedAnn.id === id) {
            setSelectedAnn({ ...selectedAnn, status: next });
          }
          return { ...a, status: next };
        }
        return a;
      })
    );
  };

  // Delete Announcement
  const handleDeleteAnnouncement = (id, title) => {
    if (window.confirm(`Are you sure you want to delete announcement "${title}"?`)) {
      setAnnouncements((prev) => prev.filter((a) => a.id !== id));
      if (selectedAnn && selectedAnn.id === id) setSelectedAnn(null);
      toast.success(`Announcement "${title}" removed!`, { position: 'top-right' });
    }
  };

  // Open Create Modal
  const handleOpenCreate = () => {
    setEditingAnn(null);
    const today = new Date().toISOString().slice(0, 10);
    const nextWeek = new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10);
    setFormData({
      title: '',
      message: '',
      type: 'Info',
      placement: 'Top Header Banner',
      targetAudience: 'All Typists',
      startDate: today,
      endDate: nextWeek,
      isDismissible: true,
    });
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (ann) => {
    setEditingAnn(ann);
    setFormData({
      title: ann.title,
      message: ann.message,
      type: ann.type,
      placement: ann.placement || 'Top Header Banner',
      targetAudience: ann.targetAudience || 'All Typists',
      startDate: ann.startDate,
      endDate: ann.endDate,
      isDismissible: ann.isDismissible ?? true,
    });
    setIsModalOpen(true);
  };

  // Save Modal Form
  const handleSaveModal = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error('Please enter a title', { position: 'top-right' });
      return;
    }

    if (editingAnn) {
      setAnnouncements((prev) =>
        prev.map((a) => (a.id === editingAnn.id ? { ...a, ...formData } : a))
      );
      toast.success(`Announcement "${formData.title}" updated!`, { position: 'top-right' });
    } else {
      const newAnn = {
        id: `ANN-0${announcements.length + 1}`,
        ...formData,
        created: 'Today',
        status: 'Active',
        impressions: 0,
        clicks: 0,
      };
      setAnnouncements((prev) => [newAnn, ...prev]);
      toast.success(`Announcement "${formData.title}" published!`, { position: 'top-right' });
    }
    setIsModalOpen(false);
  };

  // Reset Filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setTypeFilter('All');
    setStatusFilter('All');
    toast.info('Filters reset to standard view', { position: 'top-right' });
  };

  const hasActiveFilters = searchQuery || typeFilter !== 'All' || statusFilter !== 'All';

  // Export CSV
  const handleExportCSV = () => {
    if (filteredAnnouncements.length === 0) {
      toast.error('No announcements to export', { position: 'top-right' });
      return;
    }
    const headers = [
      'Announcement ID',
      'Title',
      'Type',
      'Placement',
      'Target Audience',
      'Start Date',
      'End Date',
      'Impressions',
      'Clicks',
      'Status',
    ];
    const rows = filteredAnnouncements.map((a) => [
      a.id,
      `"${a.title}"`,
      a.type,
      `"${a.placement}"`,
      `"${a.targetAudience}"`,
      a.startDate,
      a.endDate,
      a.impressions,
      a.clicks,
      a.status,
    ]);
    const csv =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const uri = encodeURI(csv);
    const link = document.createElement('a');
    link.href = uri;
    link.download = `tara_typing_announcements_${Date.now()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Exported ${filteredAnnouncements.length} announcements to CSV!`, {
      position: 'top-right',
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* ── 1. HEADER & QUICK ACTIONS ── */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 text-xs font-bold uppercase tracking-wider border border-purple-500/20">
              Public Broadcasts
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Banner System Active
            </span>
          </div>
          <h1 className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-display">
            Platform Announcements & Broadcasts
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Broadcast sitewide alerts, maintenance banners, and tournament announcements directly onto the public website.
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
            <span>New Announcement</span>
          </button>
        </div>
      </div>

      {/* ── 2. TOP 4 STANDARDIZED KPI METRICS ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Card 1: Active Broadcasts */}
        <StatCard
          title="Active Live Broadcasts"
          value={kpiStats.activeBroadcasts}
          change={100}
          isPositive={true}
          timeframe="visible on public site"
          icon={Megaphone}
          hoverEffect="emerald"
          colorClass="from-emerald-500/20 to-teal-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
        />

        {/* Card 2: Scheduled Broadcasts */}
        <StatCard
          title="Scheduled Announcements"
          value={kpiStats.scheduledBroadcasts}
          change={10.0}
          isPositive={true}
          timeframe="scheduled ahead"
          icon={Calendar}
          hoverEffect="blue"
          colorClass="from-blue-500/20 to-cyan-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
        />

        {/* Card 3: Total Typist Reach */}
        <StatCard
          title="Public Banner Impressions"
          value={kpiStats.totalReach}
          change={24.2}
          isPositive={true}
          timeframe="cumulative public reach"
          icon={Users}
          hoverEffect="purple"
          colorClass="from-purple-500/20 to-indigo-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20"
        />

        {/* Card 4: Public Click-Throughs */}
        <StatCard
          title="Community Clicks"
          value={kpiStats.totalClicks}
          change={14.8}
          isPositive={true}
          timeframe="14.2% engagement CTR"
          icon={Sparkles}
          hoverEffect="amber"
          colorClass="from-amber-500/20 to-orange-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
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
            placeholder="Search broadcasts by title, message, or ID..."
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
          <TypeFilterDropdown
            value={typeFilter}
            onChange={(val) => {
              setTypeFilter(val);
              setOpenDropdown(null);
            }}
            isOpen={openDropdown === 'type'}
            onToggle={() => setOpenDropdown(openDropdown === 'type' ? null : 'type')}
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
            >
              <List size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* ── 4. BROADCAST CARDS OR TABLE VIEW ── */}
      {filteredAnnouncements.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-12 text-center">
          <Megaphone size={40} className="mx-auto text-slate-300 dark:text-slate-700 mb-3" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            No Announcements Found
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
            Create a new public broadcast banner or adjust your filter options.
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
        /* GRID VIEW (Interactive Broadcast Cards with Live Banner Preview) */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredAnnouncements.map((ann) => {
            const isAct = ann.status === 'Active';
            return (
              <div
                key={ann.id}
                className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  {/* Top Badges & Switch Slider */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          ann.type === 'Warning'
                            ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                            : ann.type === 'Success'
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                            : 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20'
                        }`}
                      >
                        {ann.type}
                      </span>
                      <span className="text-[11px] font-mono text-slate-400 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800">
                        {ann.placement || 'Top Banner'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => togglePublishStatus(ann.id)}
                        className={`group relative inline-flex h-4 w-8 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 ${
                          isAct ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'
                        }`}
                        title={isAct ? 'Deactivate Broadcast' : 'Activate Broadcast'}
                      >
                        <span
                          className={`pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow-md transition duration-200 ease-in-out ${
                            isAct ? 'translate-x-4' : 'translate-x-0.5'
                          }`}
                        />
                      </button>
                      <StatusBadge status={ann.status} />
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-bold text-slate-900 dark:text-white font-display leading-snug">
                    {ann.title}
                  </h3>

                  {/* Live Banner Preview as Rendered on Public Site */}
                  <div
                    className={`mt-3 p-3 rounded-xl border text-xs flex items-start gap-2.5 ${
                      ann.type === 'Warning'
                        ? 'bg-amber-500/10 border-amber-500/30 text-amber-900 dark:text-amber-200'
                        : ann.type === 'Success'
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-900 dark:text-emerald-200'
                        : 'bg-purple-500/10 border-purple-500/30 text-purple-900 dark:text-purple-200'
                    }`}
                  >
                    <div className="shrink-0 mt-0.5">
                      {ann.type === 'Warning' ? (
                        <AlertTriangle size={15} className="text-amber-500" />
                      ) : ann.type === 'Success' ? (
                        <CheckCircle2 size={15} className="text-emerald-500" />
                      ) : (
                        <Info size={15} className="text-purple-500" />
                      )}
                    </div>
                    <p className="leading-relaxed line-clamp-2">{ann.message}</p>
                  </div>

                  {/* Engagement Metrics */}
                  <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-center">
                    <div className="p-2 rounded-xl bg-slate-50/70 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800/80">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">
                        Impressions
                      </span>
                      <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                        {ann.impressions ? ann.impressions.toLocaleString() : '0'}
                      </p>
                    </div>

                    <div className="p-2 rounded-xl bg-slate-50/70 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800/80">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">
                        Clicks
                      </span>
                      <p className="text-xs sm:text-sm font-bold text-purple-600 dark:text-purple-400 mt-0.5">
                        {ann.clicks ? ann.clicks.toLocaleString() : '0'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-slate-400 font-mono text-[11px]">
                    <Calendar size={12} />
                    <span>
                      {ann.startDate} → {ann.endDate}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Inspect Button (Purple) */}
                    <button
                      type="button"
                      onClick={() => setSelectedAnn(ann)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-purple-200/80 dark:border-purple-800/60 bg-purple-50/90 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 hover:bg-purple-100 transition-all font-semibold cursor-pointer"
                    >
                      <Eye size={13} strokeWidth={2.2} />
                      <span>Inspect</span>
                    </button>

                    {/* Edit Button (Blue) */}
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(ann)}
                      className="p-1.5 rounded-xl border border-blue-200/80 dark:border-blue-800/60 bg-blue-50/90 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 hover:bg-blue-100 transition-all cursor-pointer"
                    >
                      <Edit size={13} strokeWidth={2.2} />
                    </button>

                    {/* Delete Button (Rose) */}
                    <button
                      type="button"
                      onClick={() => handleDeleteAnnouncement(ann.id, ann.title)}
                      className="p-1.5 rounded-xl border border-rose-200/80 dark:border-rose-800/60 bg-rose-50/90 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 transition-all cursor-pointer"
                    >
                      <Trash2 size={13} strokeWidth={2.2} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50/80 dark:bg-slate-950/50 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-5 py-3.5">Broadcast Title</th>
                  <th className="px-5 py-3.5">Type</th>
                  <th className="px-5 py-3.5">Placement</th>
                  <th className="px-5 py-3.5">Target</th>
                  <th className="px-5 py-3.5">Impressions</th>
                  <th className="px-5 py-3.5">Schedule</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {filteredAnnouncements.map((ann) => {
                  const isAct = ann.status === 'Active';
                  return (
                    <tr
                      key={ann.id}
                      className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="px-5 py-3.5">
                        <p className="font-bold text-slate-900 dark:text-white leading-tight">
                          {ann.title}
                        </p>
                        <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{ann.message}</p>
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                            ann.type === 'Warning'
                              ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                              : ann.type === 'Success'
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                              : 'bg-purple-500/10 text-purple-600 dark:text-purple-400'
                          }`}
                        >
                          {ann.type}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap font-medium text-slate-600 dark:text-slate-400 text-xs">
                        {ann.placement || 'Top Banner'}
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap text-xs text-slate-500">
                        {ann.targetAudience || 'All Typists'}
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap font-semibold text-slate-900 dark:text-white">
                        {ann.impressions ? ann.impressions.toLocaleString() : '0'}
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap font-mono text-xs text-slate-400">
                        {ann.startDate}
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => togglePublishStatus(ann.id)}
                            className={`group relative inline-flex h-4 w-8 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 ${
                              isAct ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'
                            }`}
                          >
                            <span
                              className={`pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow-md transition duration-200 ease-in-out ${
                                isAct ? 'translate-x-4' : 'translate-x-0.5'
                              }`}
                            />
                          </button>
                          <StatusBadge status={ann.status} />
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => setSelectedAnn(ann)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-purple-200/80 dark:border-purple-800/60 bg-purple-50/90 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 hover:bg-purple-100 transition-all font-semibold cursor-pointer"
                          >
                            <Eye size={13} strokeWidth={2.2} />
                            <span>Inspect</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(ann)}
                            className="p-1.5 rounded-xl border border-blue-200/80 dark:border-blue-800/60 bg-blue-50/90 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 hover:bg-blue-100 transition-all cursor-pointer"
                          >
                            <Edit size={13} strokeWidth={2.2} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteAnnouncement(ann.id, ann.title)}
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

      {/* ── 5. SLIDE-OVER INSPECT SIDE DRAWER (PORTAL TO BODY) ── */}
      {typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {selectedAnn && (
              <div className="fixed inset-0 z-[70] flex justify-end">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => setSelectedAnn(null)}
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
                      <div className="grid h-9 w-9 place-items-center rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                        <Megaphone size={18} />
                      </div>
                      <div>
                        <h2 className="text-base font-bold text-slate-900 dark:text-white font-display">
                          Broadcast Preview & Specs
                        </h2>
                        <span className="text-xs text-slate-400 font-mono">
                          ID: {selectedAnn.id} • Type: {selectedAnn.type}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedAnn(null)}
                      className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  {/* Body */}
                  <div className="p-6 space-y-6 flex-1 overflow-y-auto">
                    {/* Public Site Live Banner Preview */}
                    <div className="space-y-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                        <Eye size={13} /> Live Public Site Rendering Preview
                      </span>
                      <div
                        className={`p-4 rounded-2xl border text-xs sm:text-sm flex items-start justify-between gap-3 shadow-sm ${
                          selectedAnn.type === 'Warning'
                            ? 'bg-amber-500/15 border-amber-500/40 text-amber-950 dark:text-amber-100'
                            : selectedAnn.type === 'Success'
                            ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-950 dark:text-emerald-100'
                            : 'bg-purple-500/15 border-purple-500/40 text-purple-950 dark:text-purple-100'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="shrink-0 mt-0.5">
                            {selectedAnn.type === 'Warning' ? (
                              <AlertTriangle size={18} className="text-amber-500" />
                            ) : selectedAnn.type === 'Success' ? (
                              <CheckCircle2 size={18} className="text-emerald-500" />
                            ) : (
                              <Info size={18} className="text-purple-500" />
                            )}
                          </div>
                          <div>
                            <h4 className="font-bold text-sm mb-1">{selectedAnn.title}</h4>
                            <p className="leading-relaxed opacity-90">{selectedAnn.message}</p>
                          </div>
                        </div>
                        <span className="text-xs opacity-60 font-bold cursor-pointer">✕</span>
                      </div>
                    </div>

                    {/* Broadcast Configurations */}
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-2.5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 dark:text-slate-400">Display Placement</span>
                        <span className="font-bold text-slate-900 dark:text-white">
                          {selectedAnn.placement || 'Top Header Banner'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 dark:text-slate-400">Target Audience</span>
                        <span className="font-bold text-purple-600 dark:text-purple-400">
                          {selectedAnn.targetAudience || 'All Typists'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 dark:text-slate-400">Scheduled Duration</span>
                        <span className="font-mono text-slate-700 dark:text-slate-300">
                          {selectedAnn.startDate} → {selectedAnn.endDate}
                        </span>
                      </div>
                    </div>

                    {/* Engagement Impressions */}
                    <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                        Public Audience Engagement
                      </h4>
                      <div className="grid grid-cols-2 gap-3 text-center">
                        <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                          <span className="text-[10px] text-slate-400 uppercase font-semibold">
                            Total Impressions
                          </span>
                          <p className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                            {selectedAnn.impressions ? selectedAnn.impressions.toLocaleString() : '0'}
                          </p>
                        </div>
                        <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                          <span className="text-[10px] text-slate-400 uppercase font-semibold">
                            User Clicks
                          </span>
                          <p className="text-base font-bold text-purple-600 dark:text-purple-400 mt-0.5">
                            {selectedAnn.clicks ? selectedAnn.clicks.toLocaleString() : '0'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Sticky Footer */}
                  <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/70 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => togglePublishStatus(selectedAnn.id)}
                        className={`group relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 focus:outline-none ${
                          selectedAnn.status === 'Active'
                            ? 'bg-emerald-500'
                            : 'bg-slate-300 dark:bg-slate-700'
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition duration-200 ease-in-out ${
                            selectedAnn.status === 'Active'
                              ? 'translate-x-4'
                              : 'translate-x-0.5'
                          }`}
                        />
                      </button>
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        {selectedAnn.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          const item = selectedAnn;
                          setSelectedAnn(null);
                          handleOpenEdit(item);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-blue-200/80 dark:border-blue-800/60 bg-blue-50/90 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 hover:bg-blue-100 text-xs font-semibold transition-all cursor-pointer"
                      >
                        <Edit size={14} />
                        <span>Edit</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteAnnouncement(selectedAnn.id, selectedAnn.title)}
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

      {/* ── 6. CREATE / EDIT ANNOUNCEMENT MODAL ── */}
      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingAnn ? 'Edit Announcement' : 'Create New Broadcast'}
        subtitle="Publish alerts, maintenance notices, or updates to public site visitors."
        maxWidth="max-w-lg"
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
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold transition-all shadow-sm shadow-purple-500/30 cursor-pointer"
            >
              Publish Broadcast
            </button>
          </div>
        }
      >
        <form onSubmit={handleSaveModal} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Broadcast Title
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Daily Challenge Indian Timezone Optimization"
              className="w-full h-9 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 px-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
            />
          </div>

          {/* Broadcast Type Pills */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Notice Type
            </label>
            <div className="flex flex-wrap gap-1.5">
              {['Info', 'Success', 'Warning'].map((t) => {
                const isSel = formData.type === t;
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setFormData({ ...formData, type: t })}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                      isSel
                        ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-950/60 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                    }`}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Placement Pills */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Placement on Website
            </label>
            <div className="flex flex-wrap gap-1.5">
              {['Top Header Banner', 'Modal Dialog on Login', 'Notification Bell Toast'].map((p) => {
                const isSel = formData.placement === p;
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setFormData({ ...formData, placement: p })}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                      isSel
                        ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-950/60 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                    }`}
                  >
                    {p}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Target Audience Pills */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Target Audience
            </label>
            <div className="flex flex-wrap gap-1.5">
              {['All Typists', 'Registered Only', 'Guests Only'].map((aud) => {
                const isSel = formData.targetAudience === aud;
                return (
                  <button
                    key={aud}
                    type="button"
                    onClick={() => setFormData({ ...formData, targetAudience: aud })}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                      isSel
                        ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-950/60 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                    }`}
                  >
                    {aud}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Schedule Dates */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Start Date
              </label>
              <input
                type="date"
                required
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full h-9 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 px-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                End Date
              </label>
              <input
                type="date"
                required
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full h-9 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 px-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
              />
            </div>
          </div>

          {/* Message Text */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Broadcast Message
            </label>
            <textarea
              rows={3}
              required
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Write the message that users will see on the website..."
              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 p-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
            />
          </div>
        </form>
      </AdminModal>
    </div>
  );
};

export default AdminAnnouncements;
