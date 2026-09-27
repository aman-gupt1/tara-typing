import React, { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Award,
  Trophy,
  Zap,
  Flame,
  Target,
  Calendar,
  Star,
  Compass,
  Plus,
  Edit,
  Trash2,
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
  Sparkles,
  ShieldCheck,
  X,
  Lock,
  RefreshCw,
  Loader2,
} from 'lucide-react';
import { toast } from 'react-toastify';
import StatCard from '../../components/admin/StatCard';
import StatusBadge from '../../components/admin/StatusBadge';
import AdminModal from '../../components/admin/AdminModal';
import UserAvatar from '../../components/common/UserAvatar';
import adminService from '../../services/adminService';

// Icon Map aligned with Tara Typing's authentic public site badges
const iconMap = {
  Target: Target,
  Zap: Zap,
  Flame: Flame,
  Trophy: Trophy,
  Award: Award,
  Calendar: Calendar,
  Star: Star,
  Compass: Compass,
};

// Category Options
const categoryOptions = [
  { value: 'All', label: 'All Categories', dot: 'bg-slate-400' },
  { value: 'Speed', label: 'Speed Velocity', dot: 'bg-purple-500' },
  { value: 'Accuracy', label: 'Precision & Accuracy', dot: 'bg-emerald-500' },
  { value: 'Volume', label: 'Test Volume', dot: 'bg-blue-500' },
  { value: 'Streak', label: 'Daily Streaks', dot: 'bg-pink-500' },
  { value: 'Competition', label: 'Competitions & Contests', dot: 'bg-amber-500' },
  { value: 'Learning', label: 'Curriculum & Lessons', dot: 'bg-indigo-500' },
];

// Tier / Rarity Options
const tierOptions = [
  { value: 'All', label: 'All Tiers', dot: 'bg-slate-400' },
  { value: 'Common', label: 'Common Tier', dot: 'bg-blue-400' },
  { value: 'Rare', label: 'Rare Tier', dot: 'bg-emerald-400' },
  { value: 'Epic', label: 'Epic Tier', dot: 'bg-pink-400' },
  { value: 'Legendary', label: 'Legendary Tier', dot: 'bg-amber-400' },
];

// Status Options
const statusOptions = [
  { value: 'All', label: 'All Statuses', dot: 'bg-slate-400' },
  { value: 'Active', label: 'Active in Game', dot: 'bg-emerald-500' },
  { value: 'Disabled', label: 'Disabled / Hidden', dot: 'bg-rose-500' },
];

// Sort Options
const sortOptions = [
  { value: 'unlocked_desc', label: 'Most Unlocked Typists' },
  { value: 'rate_desc', label: 'Highest Unlock Rate (%)' },
  { value: 'points_desc', label: 'Highest XP Points' },
  { value: 'name_asc', label: 'Badge Name (A – Z)' },
];

// Color Theme Box Styles (matching public site AchievementsGrid)
const colorStyles = {
  blue: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30',
  purple: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30',
  orange: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30',
  pink: 'bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/30',
  green: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
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
        <div className="absolute left-0 sm:left-auto sm:right-0 top-full mt-1.5 z-50 w-60 rounded-2xl border border-slate-200/90 dark:border-slate-700/80 bg-white dark:bg-slate-900 p-1.5 shadow-2xl shadow-slate-950/25 backdrop-blur-md animate-in fade-in zoom-in-95 duration-150">
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

// Custom Tier Filter Dropdown
const TierFilterDropdown = ({ value, onChange, isOpen, onToggle }) => {
  const selected = tierOptions.find((t) => t.value === value) || tierOptions[0];

  return (
    <div className="relative inline-block" data-tier-dropdown>
      <button
        type="button"
        onClick={onToggle}
        className={`h-9 px-3 rounded-xl border text-xs font-semibold inline-flex items-center gap-2 transition-all duration-200 cursor-pointer shadow-2xs hover:shadow-xs active:scale-95 select-none ${
          value !== 'All'
            ? 'border-purple-500/40 bg-purple-500/10 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300'
            : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 text-slate-700 dark:text-slate-200 hover:border-slate-300 dark:hover:border-slate-700'
        }`}
        aria-label="Filter by Tier"
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
              Filter By Tier
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
            {tierOptions.map((opt) => {
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
        aria-label="Sort Achievements"
      >
        <span className="text-slate-400 font-normal">Sort:</span>
        <span className="font-semibold">{selected.label}</span>
        <ChevronDown
          size={12}
          className={`text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1.5 z-50 w-56 rounded-2xl border border-slate-200/90 dark:border-slate-700/80 bg-white dark:bg-slate-900 p-1.5 shadow-2xl shadow-slate-950/25 backdrop-blur-md animate-in fade-in zoom-in-95 duration-150">
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

export const AdminAchievements = () => {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [backendKPIs, setBackendKPIs] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [tierFilter, setTierFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('unlocked_desc');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'

  // Dropdown toggles
  const [openDropdown, setOpenDropdown] = useState(null);

  // Side Drawer inspect state
  const [selectedAch, setSelectedAch] = useState(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAch, setEditingAch] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    key: '',
    description: '',
    requirement: '',
    category: 'Speed',
    color: 'purple',
    tier: 'Rare',
    icon: 'Zap',
    points: 50,
  });

  // Fetch live achievements and gamification KPIs from backend
  const fetchAchievementsData = async (isManual = false) => {
    try {
      if (isManual) setRefreshing(true);
      else setLoading(true);

      const [statsRes, listRes] = await Promise.allSettled([
        adminService.getAchievementStats(),
        adminService.getAdminAchievements(),
      ]);

      if (statsRes.status === 'fulfilled' && statsRes.value?.success) {
        setBackendKPIs(statsRes.value.data?.kpis || null);
      }

      if (listRes.status === 'fulfilled' && listRes.value?.success) {
        setAchievements(listRes.value.data?.achievements || []);
      }

      if (isManual) {
        toast.success('Achievement metrics refreshed!', { position: 'top-right' });
      }
    } catch (err) {
      console.error('Failed to load achievements:', err);
      toast.error('Failed to fetch live achievement metrics', { position: 'top-right' });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAchievementsData();
  }, []);

  // Close dropdown on click outside or Escape
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        !event.target.closest('[data-category-dropdown]') &&
        !event.target.closest('[data-tier-dropdown]') &&
        !event.target.closest('[data-sort-dropdown]')
      ) {
        setOpenDropdown(null);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setOpenDropdown(null);
        setSelectedAch(null);
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
  const filteredAchievements = useMemo(() => {
    let result = achievements.filter((a) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        a.name.toLowerCase().includes(q) ||
        (a.description || '').toLowerCase().includes(q) ||
        (a.requirement || '').toLowerCase().includes(q) ||
        (a.key || '').toLowerCase().includes(q);
      const matchesCategory =
        categoryFilter === 'All' || a.category.toLowerCase() === categoryFilter.toLowerCase();
      const matchesTier = tierFilter === 'All' || a.tier.toLowerCase() === tierFilter.toLowerCase();
      const matchesStatus =
        statusFilter === 'All' || a.status.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesCategory && matchesTier && matchesStatus;
    });

    result.sort((a, b) => {
      if (sortBy === 'unlocked_desc') return (b.unlockedBy || 0) - (a.unlockedBy || 0);
      if (sortBy === 'rate_desc') return (b.unlockRate || 0) - (a.unlockRate || 0);
      if (sortBy === 'points_desc') return (b.points || 0) - (a.points || 0);
      if (sortBy === 'name_asc') return (a.name || '').localeCompare(b.name || '');
      return 0;
    });

    return result;
  }, [achievements, searchQuery, categoryFilter, tierFilter, statusFilter, sortBy]);

  // Derived Top KPI Metrics (Driven by Backend KPIs with dynamic live fallback)
  const kpiStats = useMemo(() => {
    const totalBadges = backendKPIs?.totalBadgesRaw ?? achievements.length;
    const totalUnlocks =
      backendKPIs?.totalUnlocks ??
      achievements.reduce((sum, a) => sum + (a.unlockedBy || 0), 0).toLocaleString();
    const activeFirstSteps = achievements.find((a) => a.key === 'first-test');
    const centuryAch = achievements.find((a) => a.key === 'speed-100');

    return {
      totalBadges: `${totalBadges} Badges`,
      totalUnlocks:
        typeof totalUnlocks === 'number' ? totalUnlocks.toLocaleString() : totalUnlocks,
      firstStepsRate:
        backendKPIs?.firstStepsRate ??
        (activeFirstSteps ? `${activeFirstSteps.unlockRate}%` : '0%'),
      centuryCount:
        backendKPIs?.centuryCount ??
        (centuryAch ? `${(centuryAch.unlockedBy || 0).toLocaleString()} Typists` : '0 Typists'),
    };
  }, [achievements, backendKPIs]);

  // Inspect Achievement Dossier
  const handleOpenInspect = async (ach) => {
    setSelectedAch(ach);
    try {
      const res = await adminService.getAdminAchievementById(ach.id || ach.key);
      if (res?.success && res.data) {
        setSelectedAch(res.data);
      }
    } catch (err) {
      console.warn('Could not fetch detailed dossier:', err);
    }
  };

  // Toggle Badge Status (Active vs Disabled)
  const toggleStatus = async (id) => {
    const target = achievements.find((a) => a.id === id);
    if (!target) return;
    const nextStatus = target.status === 'Active' ? 'Disabled' : 'Active';

    // Optimistic UI update
    setAchievements((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: nextStatus } : a))
    );
    if (selectedAch && selectedAch.id === id) {
      setSelectedAch((prev) => ({ ...prev, status: nextStatus }));
    }

    try {
      await adminService.updateAdminAchievementStatus(id, { status: nextStatus });
      toast.success(`Badge "${target.name}" set to ${nextStatus}!`, { position: 'top-right' });
    } catch (err) {
      // Revert on error
      setAchievements((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: target.status } : a))
      );
      if (selectedAch && selectedAch.id === id) {
        setSelectedAch((prev) => ({ ...prev, status: target.status }));
      }
      toast.error(err.message || 'Failed to update badge status', { position: 'top-right' });
    }
  };

  // Delete Badge
  const handleDeleteAchievement = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete achievement "${name}"?`)) {
      try {
        await adminService.deleteAdminAchievement(id);
        setAchievements((prev) => prev.filter((a) => a.id !== id));
        if (selectedAch && selectedAch.id === id) setSelectedAch(null);
        toast.success(`Achievement "${name}" deleted!`, { position: 'top-right' });

        // Background KPI refresh
        adminService.getAchievementStats().then((res) => {
          if (res?.success) setBackendKPIs(res.data?.kpis || null);
        });
      } catch (err) {
        toast.error(err.message || 'Failed to delete achievement', { position: 'top-right' });
      }
    }
  };

  // Open Create Modal
  const handleOpenCreate = () => {
    setEditingAch(null);
    setFormData({
      name: '',
      key: '',
      description: '',
      requirement: '',
      category: 'Speed',
      color: 'purple',
      tier: 'Rare',
      icon: 'Zap',
      points: 50,
    });
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (ach) => {
    setEditingAch(ach);
    setFormData({
      name: ach.name,
      key: ach.key,
      description: ach.description,
      requirement: ach.requirement,
      category: ach.category,
      color: ach.color || 'purple',
      tier: ach.tier || 'Rare',
      icon: ach.icon || 'Award',
      points: ach.points || 50,
    });
    setIsModalOpen(true);
  };

  // Save Modal Form
  const handleSaveModal = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Please enter badge name', { position: 'top-right' });
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...formData,
        points: Number(formData.points) || 50,
      };

      if (editingAch) {
        const res = await adminService.updateAdminAchievement(editingAch.id, payload);
        if (res?.success) {
          setAchievements((prev) =>
            prev.map((a) => (a.id === editingAch.id ? res.data : a))
          );
          if (selectedAch && selectedAch.id === editingAch.id) {
            setSelectedAch(res.data);
          }
          toast.success(`Achievement "${formData.name}" updated!`, { position: 'top-right' });
        }
      } else {
        const res = await adminService.createAdminAchievement(payload);
        if (res?.success) {
          setAchievements((prev) => [res.data, ...prev]);
          toast.success(`Achievement "${formData.name}" created!`, { position: 'top-right' });
        }
      }
      setIsModalOpen(false);

      // Background KPI refresh
      adminService.getAchievementStats().then((res) => {
        if (res?.success) setBackendKPIs(res.data?.kpis || null);
      });
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to save achievement', {
        position: 'top-right',
      });
    } finally {
      setSaving(false);
    }
  };

  // Reset Filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setCategoryFilter('All');
    setTierFilter('All');
    setStatusFilter('All');
    setSortBy('unlocked_desc');
    toast.info('Filters reset to default view', { position: 'top-right' });
  };

  const hasActiveFilters =
    searchQuery ||
    categoryFilter !== 'All' ||
    tierFilter !== 'All' ||
    statusFilter !== 'All' ||
    sortBy !== 'unlocked_desc';

  // Export CSV
  const handleExportCSV = async () => {
    try {
      await adminService.exportAchievementsCSV({
        category: categoryFilter,
        tier: tierFilter,
        status: statusFilter,
        search: searchQuery,
      });
      toast.success('Achievements exported to CSV!', { position: 'top-right' });
    } catch (err) {
      if (filteredAchievements.length === 0) {
        toast.error('No achievement badges to export', { position: 'top-right' });
        return;
      }
      const headers = [
        'Badge ID',
        'Key',
        'Name',
        'Category',
        'Tier',
        'Requirement',
        'Points (XP)',
        'Total Typists Unlocked',
        'Unlock Rate (%)',
        'Status',
      ];
      const rows = filteredAchievements.map((a) => [
        a.id,
        a.key,
        `"${a.name}"`,
        a.category,
        a.tier,
        `"${a.requirement}"`,
        a.points,
        a.unlockedBy,
        `${a.unlockRate}%`,
        a.status,
      ]);
      const csv =
        'data:text/csv;charset=utf-8,' +
        [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
      const uri = encodeURI(csv);
      const link = document.createElement('a');
      link.href = uri;
      link.download = `tara_typing_achievements_${Date.now()}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success(`Exported ${filteredAchievements.length} achievements to CSV!`, {
        position: 'top-right',
      });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* ── 1. HEADER & QUICK ACTIONS ── */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 text-xs font-bold uppercase tracking-wider border border-purple-500/20">
              Gamification System
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Public Profile Badges Live
            </span>
          </div>
          <h1 className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-display">
            Achievement Badges & Milestones
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Configure gamified milestones, tier rarities, XP rewards, and monitor typist unlock rates.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => fetchAchievementsData(true)}
            disabled={refreshing}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm cursor-pointer disabled:opacity-60"
            title="Refresh achievements"
          >
            <RefreshCw size={13} className={refreshing ? 'animate-spin text-purple-600' : ''} />
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
            <span>New Achievement</span>
          </button>
        </div>
      </div>

      {/* ── 2. TOP 4 STANDARDIZED KPI METRICS ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Card 1: Badges Defined */}
        <StatCard
          title="Achievement Badges"
          value={kpiStats.totalBadges}
          change={20.0}
          isPositive={true}
          timeframe="Public & Competitive"
          icon={Award}
          hoverEffect="purple"
          colorClass="from-purple-500/20 to-indigo-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20"
        />

        {/* Card 2: Total Unlocks */}
        <StatCard
          title="Total Unlocks Granted"
          value={kpiStats.totalUnlocks}
          change={18.4}
          isPositive={true}
          timeframe="milestone unlocks awarded"
          icon={Sparkles}
          hoverEffect="blue"
          colorClass="from-blue-500/20 to-cyan-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
        />

        {/* Card 3: Active Milestone Rate */}
        <StatCard
          title="First Steps Conversion"
          value={kpiStats.firstStepsRate}
          change={1.2}
          isPositive={true}
          timeframe="1st test completion rate"
          icon={Target}
          hoverEffect="emerald"
          colorClass="from-emerald-500/20 to-teal-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
        />

        {/* Card 4: Century Typists */}
        <StatCard
          title="Century Typists (100+ WPM)"
          value={kpiStats.centuryCount}
          change={8.9}
          isPositive={true}
          timeframe="elite gold badge holders"
          icon={Trophy}
          hoverEffect="amber"
          colorClass="from-amber-500/20 to-orange-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
        />
      </div>

      {/* ── 3. FILTER & VIEW TOOLBAR (ZERO NATIVE SELECT) ── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3.5 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        {/* Search input */}
        <div className="relative flex-1 max-w-md">
          <Search
            size={14}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search badges by title, requirement, or key (e.g. 100 WPM, Streak)..."
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

        {/* Custom Dropdowns & Switchers */}
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

          <TierFilterDropdown
            value={tierFilter}
            onChange={(val) => {
              setTierFilter(val);
              setOpenDropdown(null);
            }}
            isOpen={openDropdown === 'tier'}
            onToggle={() => setOpenDropdown(openDropdown === 'tier' ? null : 'tier')}
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

      {/* ── 4. BADGES GRID OR TABLE VIEW ── */}
      {loading && achievements.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-16 text-center">
          <Loader2 size={36} className="mx-auto text-purple-600 animate-spin mb-3" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Loading Live Achievements & Unlock Telemetry...
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Connecting to database and calculating real typist unlock conversion rates.
          </p>
        </div>
      ) : filteredAchievements.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-12 text-center">
          <Award size={40} className="mx-auto text-slate-300 dark:text-slate-700 mb-3" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            No Achievement Badges Match Filters
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
            Try resetting your category or tier filters to view the full gamification badge roster.
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
        /* GRID VIEW (Aesthetic 3D Badges matching public site) */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredAchievements.map((ach) => {
            const IconComp = iconMap[ach.icon] || Award;
            const isAct = ach.status === 'Active';
            const colorClass = colorStyles[ach.color] || colorStyles.purple;

            return (
              <div
                key={ach.id}
                className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between relative group"
              >
                <div>
                  {/* Top Badges & Switch Slider */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono">
                        {ach.category}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                          ach.tier === 'Legendary'
                            ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                            : ach.tier === 'Epic'
                            ? 'bg-pink-500/10 text-pink-600 dark:text-pink-400 border border-pink-500/20'
                            : ach.tier === 'Rare'
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                            : 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20'
                        }`}
                      >
                        {ach.tier}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => toggleStatus(ach.id)}
                        className={`group relative inline-flex h-4 w-8 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 ${
                          isAct ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'
                        }`}
                        title={isAct ? 'Disable Badge' : 'Enable Badge'}
                      >
                        <span
                          className={`pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow-md transition duration-200 ease-in-out ${
                            isAct ? 'translate-x-4' : 'translate-x-0.5'
                          }`}
                        />
                      </button>
                      <StatusBadge status={ach.status} />
                    </div>
                  </div>

                  {/* Icon Box & Title */}
                  <div className="flex items-center gap-3 mt-2">
                    <div
                      className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl border ${colorClass} shadow-sm group-hover:scale-105 transition-transform duration-200`}
                    >
                      <IconComp size={24} className="stroke-[2.2]" />
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-slate-900 dark:text-white font-display leading-tight">
                        {ach.name}
                      </h3>
                      <span className="text-[11px] font-mono text-purple-600 dark:text-purple-400 font-semibold">
                        +{ach.points} XP
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2.5 line-clamp-2 leading-relaxed">
                    {ach.description}
                  </p>

                  {/* Requirement Criterion */}
                  <div className="mt-3.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800 text-xs">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                      Requirement
                    </span>
                    <span className="font-medium text-slate-800 dark:text-slate-200">
                      {ach.requirement}
                    </span>
                  </div>

                  {/* Unlock Rate Progress Bar */}
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                      <span>{ach.unlockedBy.toLocaleString()} Unlocked</span>
                      <span className="text-purple-600 dark:text-purple-400 font-bold">
                        {ach.unlockRate}%
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"
                        style={{ width: `${Math.min(ach.unlockRate, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-[11px] font-mono text-slate-400">key: {ach.key}</span>

                  <div className="flex items-center gap-1.5">
                    {/* Inspect Button (Purple) */}
                    <div className="relative group/tooltip flex items-center">
                      <button
                        type="button"
                        onClick={() => handleOpenInspect(ach)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-purple-200/80 dark:border-purple-800/60 bg-purple-50/90 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/60 hover:border-purple-300 dark:hover:border-purple-700 hover:scale-105 active:scale-95 transition-all shadow-2xs font-semibold cursor-pointer"
                        title="Inspect Badge"
                      >
                        <Eye size={13} strokeWidth={2.2} />
                        <span>Inspect</span>
                      </button>
                      <div className="pointer-events-none absolute bottom-full mb-2 left-1/2 -translate-x-1/2 opacity-0 group-hover/tooltip:opacity-100 group-hover/tooltip:-translate-y-0.5 transition-all duration-150 z-50 whitespace-nowrap">
                        <div className="px-2.5 py-1 rounded-xl bg-slate-900 text-white dark:bg-slate-800 dark:text-white text-[11px] font-semibold shadow-xl border border-slate-700/60">
                          Inspect Badge Telemetry
                        </div>
                        <div className="w-1.5 h-1.5 bg-slate-900 dark:bg-slate-800 border-r border-b border-slate-700/60 rotate-45 mx-auto -mt-1 rounded-xs" />
                      </div>
                    </div>

                    {/* Edit Button (Blue) */}
                    <div className="relative group/tooltip flex items-center">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(ach)}
                        className="p-1.5 rounded-xl border border-blue-200/80 dark:border-blue-800/60 bg-blue-50/90 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 hover:bg-blue-100 hover:scale-105 active:scale-95 transition-all shadow-2xs cursor-pointer"
                        title="Edit Badge"
                      >
                        <Edit size={13} strokeWidth={2.2} />
                      </button>
                      <div className="pointer-events-none absolute bottom-full mb-2 left-1/2 -translate-x-1/2 opacity-0 group-hover/tooltip:opacity-100 group-hover/tooltip:-translate-y-0.5 transition-all duration-150 z-50 whitespace-nowrap">
                        <div className="px-2.5 py-1 rounded-xl bg-slate-900 text-white dark:bg-slate-800 dark:text-white text-[11px] font-semibold shadow-xl border border-slate-700/60">
                          Edit Badge
                        </div>
                        <div className="w-1.5 h-1.5 bg-slate-900 dark:bg-slate-800 border-r border-b border-slate-700/60 rotate-45 mx-auto -mt-1 rounded-xs" />
                      </div>
                    </div>

                    {/* Delete Button (Rose) */}
                    <div className="relative group/tooltip flex items-center">
                      <button
                        type="button"
                        onClick={() => handleDeleteAchievement(ach.id, ach.name)}
                        className="p-1.5 rounded-xl border border-rose-200/80 dark:border-rose-800/60 bg-rose-50/90 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 hover:scale-105 active:scale-95 transition-all shadow-2xs cursor-pointer"
                        title="Delete Badge"
                      >
                        <Trash2 size={13} strokeWidth={2.2} />
                      </button>
                      <div className="pointer-events-none absolute bottom-full mb-2 right-0 opacity-0 group-hover/tooltip:opacity-100 group-hover/tooltip:-translate-y-0.5 transition-all duration-150 z-50 whitespace-nowrap">
                        <div className="px-2.5 py-1 rounded-xl bg-rose-600 text-white text-[11px] font-semibold shadow-xl border border-rose-500">
                          Delete Badge
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
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50/80 dark:bg-slate-950/50 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-5 py-3.5">Badge</th>
                  <th className="px-5 py-3.5">Category</th>
                  <th className="px-5 py-3.5">Tier</th>
                  <th className="px-5 py-3.5">Requirement</th>
                  <th className="px-5 py-3.5">Points</th>
                  <th className="px-5 py-3.5">Unlocked</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {filteredAchievements.map((ach) => {
                  const IconComp = iconMap[ach.icon] || Award;
                  const isAct = ach.status === 'Active';
                  return (
                    <tr
                      key={ach.id}
                      className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="grid h-9 w-9 place-items-center rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                            <IconComp size={18} />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white leading-tight">
                              {ach.name}
                            </p>
                            <span className="text-[11px] text-slate-400 font-mono">{ach.key}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap font-medium text-slate-700 dark:text-slate-300">
                        {ach.category}
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <span
                          className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                            ach.tier === 'Legendary'
                              ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                              : ach.tier === 'Epic'
                              ? 'bg-pink-500/10 text-pink-600 dark:text-pink-400'
                              : ach.tier === 'Rare'
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                              : 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                          }`}
                        >
                          {ach.tier}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-slate-600 dark:text-slate-400 max-w-xs truncate">
                        {ach.requirement}
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap font-bold text-purple-600 dark:text-purple-400">
                        +{ach.points} XP
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <span className="font-semibold text-slate-900 dark:text-white">
                          {ach.unlockedBy.toLocaleString()}
                        </span>
                        <span className="text-xs text-slate-400 ml-1">({ach.unlockRate}%)</span>
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => toggleStatus(ach.id)}
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
                          <StatusBadge status={ach.status} />
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenInspect(ach)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-purple-200/80 dark:border-purple-800/60 bg-purple-50/90 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 hover:bg-purple-100 transition-all font-semibold cursor-pointer"
                          >
                            <Eye size={13} strokeWidth={2.2} />
                            <span>Inspect</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(ach)}
                            className="p-1.5 rounded-xl border border-blue-200/80 dark:border-blue-800/60 bg-blue-50/90 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 hover:bg-blue-100 transition-all cursor-pointer"
                          >
                            <Edit size={13} strokeWidth={2.2} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteAchievement(ach.id, ach.name)}
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
            {selectedAch && (
              <div className="fixed inset-0 z-[70] flex justify-end">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => setSelectedAch(null)}
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
                        <Award size={18} />
                      </div>
                      <div>
                        <h2 className="text-base font-bold text-slate-900 dark:text-white font-display">
                          Achievement Badge Dossier
                        </h2>
                        <span className="text-xs text-slate-400 font-mono">
                          ID: {selectedAch.id} • Key: {selectedAch.key}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedAch(null)}
                      className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  {/* Body */}
                  <div className="p-6 space-y-6 flex-1 overflow-y-auto">
                    {/* Visual Showcase Card */}
                    <div className="p-6 rounded-2xl bg-gradient-to-b from-purple-500/10 to-indigo-500/5 border border-purple-500/20 text-center flex flex-col items-center justify-center">
                      <div className="grid h-20 w-20 place-items-center rounded-3xl bg-white dark:bg-slate-800 border-2 border-purple-500/30 shadow-xl mb-3">
                        {React.createElement(iconMap[selectedAch.icon] || Award, {
                          size: 40,
                          className: 'text-purple-600 dark:text-purple-400 stroke-[2.2]',
                        })}
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white font-display">
                        {selectedAch.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400">
                          {selectedAch.category}
                        </span>
                        <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400">
                          {selectedAch.tier} Tier
                        </span>
                        <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                          +{selectedAch.points} XP
                        </span>
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
                        Badge Lore & Description
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                        {selectedAch.description}
                      </p>
                    </div>

                    {/* Unlock Requirement */}
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-1">
                        <Target size={14} className="text-purple-500" />
                        Trigger Requirement
                      </span>
                      <p className="text-sm font-bold text-purple-600 dark:text-purple-400 font-mono">
                        {selectedAch.requirement}
                      </p>
                    </div>

                    {/* Unlock Telemetry */}
                    <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                        Player Unlock Distribution
                      </h4>
                      <div className="grid grid-cols-2 gap-3 text-center">
                        <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                          <span className="text-[10px] text-slate-400 uppercase font-semibold">
                            Total Typists
                          </span>
                          <p className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                            {(selectedAch.unlockedBy || 0).toLocaleString()}
                          </p>
                        </div>
                        <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                          <span className="text-[10px] text-slate-400 uppercase font-semibold">
                            Global Rate
                          </span>
                          <p className="text-base font-bold text-purple-600 dark:text-purple-400 mt-0.5">
                            {selectedAch.unlockRate || 0}%
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Recent Typist Unlocks */}
                    {selectedAch.recentUnlocks && selectedAch.recentUnlocks.length > 0 && (
                      <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 space-y-3">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                          Recent Unlocking Typists
                        </h4>
                        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                          {selectedAch.recentUnlocks.map((u) => (
                            <div
                              key={u.id}
                              className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs"
                            >
                              <div className="flex items-center gap-2">
                                <UserAvatar
                                  src={u.avatar}
                                  name={u.name}
                                  username={u.username}
                                  className="h-6 w-6"
                                  textClassName="text-[10px] font-bold"
                                  rounded="rounded-full"
                                  firstLetterOnly
                                />
                                <div>
                                  <p className="font-semibold text-slate-900 dark:text-white leading-tight">
                                    {u.name}
                                  </p>
                                  <p className="text-[10px] text-slate-400">
                                    @{u.username} • {u.bestWpm} WPM
                                  </p>
                                </div>
                              </div>
                              <span className="text-[10px] text-purple-600 dark:text-purple-400 font-medium">
                                {u.unlockedAt ? new Date(u.unlockedAt).toLocaleDateString() : 'Unlocked'}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Sticky Footer */}
                  <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/70 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => toggleStatus(selectedAch.id)}
                        className={`group relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 focus:outline-none ${
                          selectedAch.status === 'Active'
                            ? 'bg-emerald-500'
                            : 'bg-slate-300 dark:bg-slate-700'
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition duration-200 ease-in-out ${
                            selectedAch.status === 'Active'
                              ? 'translate-x-4'
                              : 'translate-x-0.5'
                          }`}
                        />
                      </button>
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        {selectedAch.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          const item = selectedAch;
                          setSelectedAch(null);
                          handleOpenEdit(item);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-blue-200/80 dark:border-blue-800/60 bg-blue-50/90 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 hover:bg-blue-100 text-xs font-semibold transition-all cursor-pointer"
                      >
                        <Edit size={14} />
                        <span>Edit</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteAchievement(selectedAch.id, selectedAch.name)}
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

      {/* ── 6. CREATE / EDIT ACHIEVEMENT MODAL ── */}
      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingAch ? 'Edit Achievement Badge' : 'Create New Achievement Badge'}
        subtitle="Define badge name, requirement trigger, tier rarity, and reward points."
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
              disabled={saving}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold transition-all shadow-sm shadow-purple-500/30 cursor-pointer disabled:opacity-60"
            >
              {saving && <Loader2 size={13} className="animate-spin" />}
              <span>{saving ? 'Saving...' : 'Save Achievement'}</span>
            </button>
          </div>
        }
      >
        <form onSubmit={handleSaveModal} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Badge Name
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Speed Typist"
              className="w-full h-9 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 px-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Unique Key Identifier
            </label>
            <input
              type="text"
              value={formData.key}
              onChange={(e) => setFormData({ ...formData, key: e.target.value })}
              placeholder="e.g. speed-50 (auto-generated if empty)"
              className="w-full h-9 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 px-3 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
            />
          </div>

          {/* Category Selectable Pills (Zero Native Select!) */}
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
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
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

          {/* Tier / Rarity Pills */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Tier Rarity
            </label>
            <div className="flex flex-wrap gap-1.5">
              {['Common', 'Rare', 'Epic', 'Legendary'].map((t) => {
                const isSel = formData.tier === t;
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setFormData({ ...formData, tier: t })}
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

          {/* Requirement & XP Points */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Requirement Text
              </label>
              <input
                type="text"
                required
                value={formData.requirement}
                onChange={(e) => setFormData({ ...formData, requirement: e.target.value })}
                placeholder="e.g. 50 WPM on any test"
                className="w-full h-9 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 px-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                XP Points
              </label>
              <input
                type="number"
                min={5}
                max={1000}
                value={formData.points}
                onChange={(e) => setFormData({ ...formData, points: Number(e.target.value) })}
                className="w-full h-9 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 px-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Description
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Explain how this badge is earned..."
              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 p-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
            />
          </div>
        </form>
      </AdminModal>
    </div>
  );
};

export default AdminAchievements;
