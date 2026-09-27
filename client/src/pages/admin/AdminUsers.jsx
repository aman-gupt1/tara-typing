import React, { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Search,
  Filter,
  Eye,
  UserCheck,
  UserX,
  Mail,
  Calendar,
  Flame,
  Zap,
  Target,
  FileText,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Trophy,
  GraduationCap,
  Sparkles,
  Download,
  Plus,
  LayoutGrid,
  List,
  Clock,
  Globe,
  Monitor,
  ArrowUpDown,
  Trash2,
  X,
  Activity,
  MapPin,
  User,
  ChevronDown,
  Check,
} from 'lucide-react';
import { toast } from 'react-toastify';
import StatCard from '../../components/admin/StatCard';
import StatusBadge from '../../components/admin/StatusBadge';
import AdminModal from '../../components/admin/AdminModal';
import Pagination from '../../components/admin/Pagination';
import UserAvatar from '../../components/common/UserAvatar';
import { recentUsersData, adminUserKPIs } from '../../data/adminMockData';
import { adminService } from '../../services/adminService';

// Custom Styled Role Selector Dropdown with Rounded Card
const RoleSelectorDropdown = ({ user, isOpen, onToggle, onSelectRole, align = 'bottom' }) => {
  const isAdm = user.role === 'admin';
  return (
    <div className="relative inline-flex items-center" data-role-dropdown>
      <button
        type="button"
        onClick={onToggle}
        className={`group relative inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition-all duration-200 cursor-pointer shadow-2xs hover:shadow-xs active:scale-95 ${
          isAdm
            ? 'bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 dark:text-purple-300 border-purple-500/30'
            : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700'
        }`}
        title="Click to update role (User / Admin)"
      >
        {isAdm ? (
          <Shield size={12} className="text-purple-600 dark:text-purple-400 stroke-[2.5]" />
        ) : (
          <User size={12} className="text-slate-500 dark:text-slate-400" />
        )}
        <span>{isAdm ? 'Admin' : 'User'}</span>
        <ChevronDown
          size={11}
          className={`transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          } ${isAdm ? 'text-purple-500 dark:text-purple-400' : 'text-slate-400'}`}
        />
      </button>

      {/* Styled Floating Dropdown Menu Card */}
      {isOpen && (
        <div
          className={`absolute left-0 z-50 min-w-[130px] rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-900 p-1 shadow-xl shadow-slate-950/25 backdrop-blur-md space-y-0.5 animate-in fade-in zoom-in-95 duration-150 ${
            align === 'top' ? 'bottom-full mb-1.5' : 'top-full mt-1.5'
          }`}
        >
          {/* User Option */}
          <button
            type="button"
            onClick={() => onSelectRole('user')}
            className={`w-full flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              !isAdm
                ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/70 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <div className="flex items-center gap-2">
              <User size={13} className="text-slate-400 dark:text-slate-500" />
              <span>User</span>
            </div>
            {!isAdm && (
              <Check size={13} className="text-slate-700 dark:text-slate-300 stroke-[2.5]" />
            )}
          </button>

          {/* Admin Option */}
          <button
            type="button"
            onClick={() => onSelectRole('admin')}
            className={`w-full flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              isAdm
                ? 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:bg-purple-50/50 dark:hover:bg-purple-950/30 hover:text-purple-600 dark:hover:text-purple-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <Shield size={13} className="text-purple-600 dark:text-purple-400 stroke-[2.5]" />
              <span>Admin</span>
            </div>
            {isAdm && (
              <Check size={13} className="text-purple-600 dark:text-purple-400 stroke-[2.5]" />
            )}
          </button>
        </div>
      )}
    </div>
  );
};

// Speed Tier Configuration for Custom Dropdown
const speedTierOptions = [
  { value: 'All', label: 'All Speed Tiers', speedRange: 'All WPM', dot: 'bg-slate-400' },
  { value: 'beginner', label: 'Beginner', speedRange: '< 40 WPM', dot: 'bg-slate-400' },
  { value: 'intermediate', label: 'Intermediate', speedRange: '40–79 WPM', dot: 'bg-blue-500' },
  { value: 'advanced', label: 'Advanced', speedRange: '80–109 WPM', dot: 'bg-emerald-500' },
  { value: 'elite', label: 'Elite Master', speedRange: '110+ WPM', dot: 'bg-purple-500' },
];

// Sort Options Configuration for Custom Dropdown
const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'speed', label: 'Highest WPM' },
  { value: 'tests', label: 'Most Tests' },
  { value: 'accuracy', label: 'Highest Accuracy' },
  { value: 'streak', label: 'Longest Streak' },
  { value: 'curriculum', label: 'Lessons Mastered' },
];

// Custom Styled Speed Tier Filter Dropdown (Zero Native Grey/White Box Glitch)
const SpeedTierDropdown = ({ value, onChange, isOpen, onToggle }) => {
  const selectedOption = speedTierOptions.find((opt) => opt.value === value) || speedTierOptions[0];

  return (
    <div className="relative inline-block" data-speed-tier-dropdown>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={onToggle}
        className={`h-9 px-3 rounded-xl border text-xs font-semibold inline-flex items-center gap-2 transition-all duration-200 cursor-pointer shadow-2xs hover:shadow-xs active:scale-95 select-none ${
          value !== 'All'
            ? 'border-purple-500/40 bg-purple-500/10 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300'
            : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 text-slate-700 dark:text-slate-200 hover:border-slate-300 dark:hover:border-slate-700'
        }`}
        aria-label="Filter by Speed Tier"
      >
        <Zap
          size={13}
          className={value !== 'All' ? 'text-purple-600 dark:text-purple-400' : 'text-slate-400'}
        />
        <span>{selectedOption.label}</span>
        {value !== 'All' && (
          <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-purple-500/15 text-purple-600 dark:text-purple-300 font-bold">
            {selectedOption.speedRange}
          </span>
        )}
        <ChevronDown
          size={12}
          className={`text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Styled Floating Option Card */}
      {isOpen && (
        <div className="absolute left-0 sm:left-auto sm:right-0 top-full mt-1.5 z-50 w-64 rounded-2xl border border-slate-200/90 dark:border-slate-700/80 bg-white dark:bg-slate-900 p-1.5 shadow-2xl shadow-slate-950/25 backdrop-blur-md animate-in fade-in zoom-in-95 duration-150">
          <div className="px-2.5 py-1.5 mb-1 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1">
              <Filter size={10} />
              Filter By Speed Tier
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
            {speedTierOptions.map((opt) => {
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

                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-mono">
                      {opt.speedRange}
                    </span>
                    {isSelected && (
                      <Check size={13} className="text-purple-600 dark:text-purple-400 stroke-[2.5]" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

// Custom Styled Sort By Dropdown
const SortByDropdown = ({ value, onChange, isOpen, onToggle }) => {
  const selectedOption = sortOptions.find((opt) => opt.value === value) || sortOptions[0];

  return (
    <div className="relative inline-block" data-sort-dropdown>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={onToggle}
        className="h-9 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:border-slate-300 dark:hover:border-slate-700 inline-flex items-center gap-2 transition-all duration-200 cursor-pointer shadow-2xs hover:shadow-xs active:scale-95 select-none"
        aria-label="Sort users"
      >
        <ArrowUpDown size={13} className="text-purple-500 shrink-0" />
        <span>Sort: {selectedOption.label}</span>
        <ChevronDown
          size={12}
          className={`text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Styled Floating Option Card */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-1.5 z-50 w-52 rounded-2xl border border-slate-200/90 dark:border-slate-700/80 bg-white dark:bg-slate-900 p-1.5 shadow-2xl shadow-slate-950/25 backdrop-blur-md animate-in fade-in zoom-in-95 duration-150">
          <div className="px-2.5 py-1.5 mb-1 border-b border-slate-100 dark:border-slate-800">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1">
              <ArrowUpDown size={10} />
              Sort Member Directory
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
                  className={`w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-xl text-xs transition-all cursor-pointer ${
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

// Helper to reliably check if a user is active
export const isUserActive = (u) => {
  if (!u) return false;
  if (u.active !== undefined && u.active !== null) {
    return Boolean(u.active);
  }
  const s = String(u.status || '').toLowerCase().trim();
  return s === 'active';
};

export const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [kpis, setKpis] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDossierLoading, setIsDossierLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [speedTierFilter, setSpeedTierFilter] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'grid'
  const [selectedUser, setSelectedUser] = useState(null);
  const [dossierActiveTab, setDossierActiveTab] = useState('overview'); // 'overview' | 'telemetry'
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [openRoleMenuId, setOpenRoleMenuId] = useState(null);
  const [isSpeedTierOpen, setIsSpeedTierOpen] = useState(false);
  const [isSortByOpen, setIsSortByOpen] = useState(false);

  // Fetch real users from backend API
  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const res = await adminService.getUsers({
        limit: 100,
      });
      if (res && res.data && res.data.users) {
        setUsers(res.data.users);
        setKpis(res.data.stats);
      } else {
        setUsers(recentUsersData);
      }
    } catch (err) {
      console.warn('Backend users API error, falling back to cached/mock users:', err);
      setUsers(recentUsersData);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Fetch full user dossier with live test history and curriculum from API
  const handleOpenDossier = async (u) => {
    setSelectedUser(u);
    setDossierActiveTab('overview');
    try {
      setIsDossierLoading(true);
      const res = await adminService.getUserById(u._id || u.id);
      if (res && res.data) {
        setSelectedUser(res.data);
      }
    } catch (err) {
      console.warn('Failed to load user full dossier from API:', err);
    } finally {
      setIsDossierLoading(false);
    }
  };

  // Close Custom Dropdowns on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (!e.target.closest('[data-role-dropdown]')) {
        setOpenRoleMenuId(null);
      }
      if (!e.target.closest('[data-speed-tier-dropdown]')) {
        setIsSpeedTierOpen(false);
      }
      if (!e.target.closest('[data-sort-dropdown]')) {
        setIsSortByOpen(false);
      }
    };
    if (openRoleMenuId || isSpeedTierOpen || isSortByOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [openRoleMenuId, isSpeedTierOpen, isSortByOpen]);

  // Close Side Drawer & Dropdowns on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (openRoleMenuId) setOpenRoleMenuId(null);
        setIsSpeedTierOpen(false);
        setIsSortByOpen(false);
        if (selectedUser) setSelectedUser(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [openRoleMenuId, isSpeedTierOpen, isSortByOpen, selectedUser]);

  // Lock body scroll when Side Drawer is open
  useEffect(() => {
    if (selectedUser) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedUser]);

  // Add User Form State
  const [newUserForm, setNewUserForm] = useState({
    name: '',
    username: '',
    email: '',
    role: 'user',
    location: 'India',
    tempPassword: 'TaraTyping@2026',
    sendWelcomeEmail: true,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  // Filtered and sorted list
  const filteredUsers = useMemo(() => {
    return users
      .filter((u) => {
        // Search filter
        const q = searchQuery.toLowerCase().trim();
        const matchesSearch =
          !q ||
          u.name.toLowerCase().includes(q) ||
          u.username.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          (u.location && u.location.toLowerCase().includes(q));

        // Status filter
        const matchesStatus =
          statusFilter === 'All' ||
          (statusFilter === 'Active' && isUserActive(u)) ||
          (statusFilter === 'Suspended' && !isUserActive(u)) ||
          (u.status && u.status.toLowerCase() === statusFilter.toLowerCase());

        // Speed tier filter
        let matchesSpeed = true;
        if (speedTierFilter === 'beginner') {
          matchesSpeed = u.bestWpm < 40;
        } else if (speedTierFilter === 'intermediate') {
          matchesSpeed = u.bestWpm >= 40 && u.bestWpm < 80;
        } else if (speedTierFilter === 'advanced') {
          matchesSpeed = u.bestWpm >= 80 && u.bestWpm < 110;
        } else if (speedTierFilter === 'elite') {
          matchesSpeed = u.bestWpm >= 110;
        }

        return matchesSearch && matchesStatus && matchesSpeed;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') return (b._id || b.id).localeCompare(a._id || a.id);
        if (sortBy === 'speed') return b.bestWpm - a.bestWpm;
        if (sortBy === 'tests') return (b.testsCompleted || b.tests) - (a.testsCompleted || a.tests);
        if (sortBy === 'accuracy') return b.accuracy - a.accuracy;
        if (sortBy === 'streak') return (b.currentStreak || b.streak) - (a.currentStreak || a.streak);
        if (sortBy === 'curriculum') return (b.lessonProgress || 0) - (a.lessonProgress || 0);
        return 0;
      });
  }, [users, searchQuery, statusFilter, speedTierFilter, sortBy]);

  const totalPages = Math.ceil(filteredUsers.length / pageSize) || 1;
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Status counts for tabs
  const statusCounts = useMemo(() => {
    return {
      all: users.length,
      active: users.filter((u) => isUserActive(u)).length,
      suspended: users.filter((u) => !isUserActive(u)).length,
      pending: users.filter((u) => String(u.status || '').toLowerCase() === 'pending').length,
    };
  }, [users]);

  // Toggle user status (Active <-> Suspended) via Backend API
  const toggleUserStatus = async (userId) => {
    const userToUpdate = users.find((u) => (u._id || u.id) === userId);
    if (!userToUpdate) return;

    const currentlyActive = isUserActive(userToUpdate);
    const newActive = !currentlyActive;
    const newStatus = newActive ? 'active' : 'suspended';
    const displayStatus = newActive ? 'Active' : 'Suspended';

    try {
      await adminService.updateUserStatus(userId, newStatus);
      setUsers((prev) =>
        prev.map((u) =>
          (u._id || u.id) === userId
            ? { ...u, status: displayStatus, active: newActive }
            : u
        )
      );

      if (selectedUser && (selectedUser._id || selectedUser.id) === userId) {
        setSelectedUser((prev) => ({
          ...prev,
          status: displayStatus,
          active: newActive,
        }));
      }

      if (!newActive) {
        toast.warn(`Account for ${userToUpdate.name} has been suspended.`, {
          position: 'top-right',
        });
      } else {
        toast.success(`Account for ${userToUpdate.name} is now active.`, {
          position: 'top-right',
        });
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update user status', { position: 'top-right' });
    }
  };

  // Update user role via Backend API
  const handleUpdateRole = async (userId, newRole) => {
    try {
      await adminService.updateUserRole(userId, newRole);
      setUsers((prev) =>
        prev.map((u) => ((u._id || u.id) === userId ? { ...u, role: newRole } : u))
      );
      if (selectedUser && (selectedUser._id || selectedUser.id) === userId) {
        setSelectedUser((prev) => ({ ...prev, role: newRole }));
      }
      const roleLabel = newRole === 'admin' ? 'Administrator' : 'Standard User';
      toast.success(`Role updated to ${roleLabel} successfully.`, {
        position: 'top-right',
      });
    } catch (err) {
      toast.error(err.message || 'Failed to update user role', { position: 'top-right' });
    }
  };

  // Delete user via Backend API (Cascading)
  const handleDeleteUser = async (userId, userName) => {
    if (window.confirm(`Are you sure you want to permanently delete ${userName}'s account? This will cascade remove all typing records and lesson progress.`)) {
      try {
        await adminService.deleteUser(userId);
        setUsers((prev) => prev.filter((u) => (u._id || u.id) !== userId));
        if (selectedUser && (selectedUser._id || selectedUser.id) === userId) setSelectedUser(null);
        toast.success(`User ${userName} has been removed.`, {
          position: 'top-right',
        });
      } catch (err) {
        toast.error(err.message || 'Failed to delete user', { position: 'top-right' });
      }
    }
  };

  // Export CSV via Backend API
  const handleExportCSV = async () => {
    try {
      await adminService.exportUsers('csv');
      toast.success(`Exported platform users to CSV.`, { position: 'top-right' });
    } catch (err) {
      toast.error(err.message || 'Failed to export CSV', { position: 'top-right' });
    }
  };

  // Handle Add User Form Submission
  const handleAddUserSubmit = (e) => {
    e.preventDefault();
    if (!newUserForm.name || !newUserForm.email || !newUserForm.username) {
      toast.error('Please fill out all required fields.', { position: 'top-right' });
      return;
    }

    const newUser = {
      _id: `6ab${Date.now().toString(16).slice(-8)}4715f691`,
      id: `6ab${Date.now().toString(16).slice(-8)}4715f691`,
      name: newUserForm.name,
      username: newUserForm.username.toLowerCase().replace(/\s+/g, '_'),
      email: newUserForm.email,
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${newUserForm.username}`,
      location: newUserForm.location,
      country: newUserForm.location,
      joined: 'Just Now',
      createdAt: new Date().toISOString(),
      status: 'Active',
      active: true,
      testsCompleted: 0,
      tests: 0,
      bestWpm: 0,
      averageWpm: 0,
      avgWpm: 0,
      accuracy: 100,
      currentStreak: 1,
      streak: 1,
      lessonProgress: 0,
      lastActive: 'Active now',
      riskScore: 0,
      ip: '127.0.0.1',
      browser: 'Admin Created Account',
      bio: 'Dedicated to typing faster and thinking sharper.',
      role: newUserForm.role,
      recentTests: [],
    };

    setUsers([newUser, ...users]);
    setIsAddUserOpen(false);
    setNewUserForm({
      name: '',
      username: '',
      email: '',
      role: 'user',
      location: 'India',
      tempPassword: 'TaraTyping@2026',
      sendWelcomeEmail: true,
    });
    toast.success(`Member ${newUser.name} created successfully!`, { position: 'top-right' });
  };

  // Helper role badge (used inside Dossier modal)
  const renderRoleBadge = (role) => {
    if (role === 'admin') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
          <Shield size={11} className="stroke-[2.5]" />
          <span>Administrator</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
        <span>Standard User</span>
      </span>
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* ── 1. PAGE HEADER & QUICK ACTIONS ── */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 text-xs font-bold uppercase tracking-wider border border-purple-500/20">
              Community Directory
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              MongoDB Synced
            </span>
          </div>
          <h1 className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-display">
            User Management & Moderation
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Audit registered Tara Typing members, verify speed records, and monitor 18-lesson curriculum completion.
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
            onClick={() => setIsAddUserOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-purple-600 hover:bg-purple-700 px-4 py-2 text-xs font-semibold text-white shadow-sm shadow-purple-500/30 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <Plus size={15} />
            <span>Add Typist</span>
          </button>
        </div>
      </div>

      {/* ── 2. TOP 4 METRICS KPI CARDS (WITH HOMOGENOUS HOVER EFFECTS) ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Card 1: Total Typists (Blue Elevation & Blur Glow) */}
        <StatCard
          title={adminUserKPIs.totalUsers.label}
          value={kpis?.totalUsers !== undefined ? kpis.totalUsers.toLocaleString() : adminUserKPIs.totalUsers.value}
          change={adminUserKPIs.totalUsers.change}
          isPositive={adminUserKPIs.totalUsers.isPositive}
          timeframe={adminUserKPIs.totalUsers.timeframe}
          icon={Users}
          hoverEffect="blue"
          colorClass="from-blue-500/20 to-cyan-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
        />

        {/* Card 2: Active Typists Today (Emerald Beacon Ping) */}
        <StatCard
          title={adminUserKPIs.activeToday.label}
          value={kpis?.activeUsers !== undefined ? kpis.activeUsers.toLocaleString() : adminUserKPIs.activeToday.value}
          change={adminUserKPIs.activeToday.change}
          isPositive={adminUserKPIs.activeToday.isPositive}
          timeframe={adminUserKPIs.activeToday.timeframe}
          icon={Activity}
          hoverEffect="emerald"
          colorClass="from-emerald-500/20 to-teal-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
        />

        {/* Card 3: Platform Admins (Purple Light-Sweep Top Stripe) */}
        <StatCard
          title="Platform Admins"
          value={kpis?.adminUsers !== undefined ? kpis.adminUsers.toLocaleString() : '1'}
          change="+1 this month"
          isPositive={true}
          timeframe="Admin Privilege"
          icon={Sparkles}
          hoverEffect="purple"
          colorClass="from-purple-500/20 to-indigo-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20"
        />

        {/* Card 4: Flagged / Suspended (Rose Warning Radar Scan) */}
        <StatCard
          title={adminUserKPIs.flaggedAccounts.label}
          value={kpis?.suspendedUsers !== undefined ? kpis.suspendedUsers.toLocaleString() : adminUserKPIs.flaggedAccounts.value}
          change={adminUserKPIs.flaggedAccounts.change}
          isPositive={false}
          timeframe={adminUserKPIs.flaggedAccounts.timeframe}
          icon={ShieldAlert}
          hoverEffect="rose"
          colorClass="from-rose-500/20 to-red-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20"
        />
      </div>

      {/* ── 3. COMMAND FILTER & CONTROL TOOLBAR ── */}
      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm space-y-3.5">
        {/* Top Row: Search input + View mode toggle */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Omni Search Bar */}
          <div className="relative w-full sm:max-w-md">
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
              placeholder="Search by name, @username, email, or location..."
              className="w-full h-10 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 pl-9 pr-8 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* View Mode & Sorter */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-end">
            {/* Sort Selector (Custom Styled Dropdown Card) */}
            <SortByDropdown
              value={sortBy}
              onChange={(val) => {
                setSortBy(val);
                setIsSortByOpen(false);
              }}
              isOpen={isSortByOpen}
              onToggle={() => {
                setIsSortByOpen(!isSortByOpen);
                setIsSpeedTierOpen(false);
              }}
            />

            {/* View Switcher: Table vs Cards */}
            <div className="flex items-center rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950/60 p-1">
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg transition-all ${
                  viewMode === 'table'
                    ? 'bg-white dark:bg-slate-800 text-purple-600 dark:text-purple-400 shadow-xs'
                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                }`}
                title="Table View"
              >
                <List size={15} />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-all ${
                  viewMode === 'grid'
                    ? 'bg-white dark:bg-slate-800 text-purple-600 dark:text-purple-400 shadow-xs'
                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                }`}
                title="Grid Cards View"
              >
                <LayoutGrid size={15} />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Row: Status Tabs + Speed Tier Filter */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-1 border-t border-slate-100 dark:border-slate-800/60">
          {/* Status Tab Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {[
              { id: 'All', label: 'All Typists', count: statusCounts.all },
              { id: 'Active', label: 'Active', count: statusCounts.active },
              { id: 'Suspended', label: 'Suspended', count: statusCounts.suspended },
              { id: 'Pending', label: 'Pending', count: statusCounts.pending },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setStatusFilter(tab.id);
                  setCurrentPage(1);
                }}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all select-none ${
                  statusFilter === tab.id
                    ? 'bg-purple-600 text-white shadow-sm shadow-purple-500/30'
                    : 'border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    statusFilter === tab.id
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Speed Tier Filter (Custom Styled Dropdown Card) */}
          <div className="flex items-center gap-2">
            <SpeedTierDropdown
              value={speedTierFilter}
              onChange={(val) => {
                setSpeedTierFilter(val);
                setCurrentPage(1);
                setIsSpeedTierOpen(false);
              }}
              isOpen={isSpeedTierOpen}
              onToggle={() => {
                setIsSpeedTierOpen(!isSpeedTierOpen);
                setIsSortByOpen(false);
              }}
            />

            {(searchQuery || statusFilter !== 'All' || speedTierFilter !== 'All') && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('All');
                  setSpeedTierFilter('All');
                  setCurrentPage(1);
                }}
                className="text-xs text-rose-600 dark:text-rose-400 hover:underline px-1 py-0.5"
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── 4. MAIN DIRECTORY VIEW: TABLE OR CARD GRID ── */}
      {viewMode === 'table' ? (
        /* TABLE VIEW */
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50/80 dark:bg-slate-950/60 text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-3.5">Typist Member</th>
                  <th className="px-6 py-3.5">Role</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5">Speed</th>
                  <th className="px-6 py-3.5">Accuracy</th>
                  <th className="px-6 py-3.5">Lesson Progress</th>
                  <th className="px-6 py-3.5">Activity</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/70 dark:divide-slate-800">
                {isLoading ? (
                  <tr>
                    <td colSpan={8} className="text-center py-16 text-slate-400 text-sm">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <div className="h-8 w-8 animate-spin rounded-full border-3 border-purple-500 border-t-transparent" />
                        <span className="text-xs font-medium text-slate-500">Loading typists directory...</span>
                      </div>
                    </td>
                  </tr>
                ) : paginatedUsers.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-14 text-slate-400 text-sm">
                      <div className="max-w-xs mx-auto space-y-2">
                        <Users size={32} className="mx-auto text-slate-300 dark:text-slate-600" />
                        <p className="font-semibold text-slate-700 dark:text-slate-300">
                          No typists match your filters
                        </p>
                        <p className="text-xs text-slate-400">
                          Try searching for a different keyword or resetting your speed tier filters.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedUsers.map((u, idx) => {
                    const lessonPct = Math.round(((u.lessonProgress || 0) / 18) * 100);
                    const testCount = u.testsCompleted !== undefined ? u.testsCompleted : u.tests;
                    const streakCount = u.currentStreak !== undefined ? u.currentStreak : u.streak;
                    const avgWpmVal = u.averageWpm !== undefined ? u.averageWpm : u.avgWpm;

                    return (
                      <tr
                        key={u._id || u.id}
                        className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors group"
                      >
                        {/* Typist Profile with Streak Badge on Avatar */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="relative shrink-0">
                              <UserAvatar
                                src={u.avatar}
                                name={u.name}
                                username={u.username}
                                className="h-10 w-10 group-hover:scale-105 transition-transform"
                                textClassName="text-sm font-bold"
                                rounded="rounded-xl"
                                firstLetterOnly
                              />
                              {streakCount > 0 && (
                                <span
                                  className="absolute -top-1.5 -right-1.5 z-10 inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-extrabold text-[9px] shadow-xs border-1.5 border-white dark:border-slate-900 leading-tight"
                                  title={`${streakCount} Day Typing Streak`}
                                >
                                  <Flame size={9} className="fill-white stroke-none" />
                                  <span>{streakCount}d</span>
                                </span>
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold text-slate-900 dark:text-white leading-tight truncate">
                                {u.name}
                              </p>
                              <p className="text-xs text-purple-600 dark:text-purple-400 font-medium truncate">
                                @{u.username}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Role (Custom Styled Dropdown with Rounded Card) */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <RoleSelectorDropdown
                            user={u}
                            isOpen={openRoleMenuId === (u._id || u.id)}
                            onToggle={() =>
                              setOpenRoleMenuId(
                                openRoleMenuId === (u._id || u.id) ? null : (u._id || u.id)
                              )
                            }
                            onSelectRole={(newRole) => {
                              handleUpdateRole(u._id || u.id, newRole);
                              setOpenRoleMenuId(null);
                            }}
                            align={idx >= paginatedUsers.length - 2 && paginatedUsers.length > 2 ? 'top' : 'bottom'}
                          />
                        </td>

                        {/* Status (Unified Interactive Toggle Button) */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          {(() => {
                            const isActive = isUserActive(u);
                            const statusText = isActive ? 'Active' : 'Suspended';
                            return (
                              <button
                                type="button"
                                onClick={() => toggleUserStatus(u._id || u.id)}
                                className={`group relative inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border transition-all duration-200 cursor-pointer shadow-2xs hover:shadow-xs active:scale-95 select-none ${
                                  isActive
                                    ? 'bg-emerald-500/10 hover:bg-emerald-500/15 dark:bg-emerald-950/40 dark:hover:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-500/30'
                                    : 'bg-rose-500/10 hover:bg-rose-500/15 dark:bg-rose-950/40 dark:hover:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-500/30'
                                }`}
                                title={isActive ? 'Status: Active (Click to Suspend)' : 'Status: Suspended (Click to Activate)'}
                                aria-label={`Status: ${statusText}. Click to ${isActive ? 'Suspend' : 'Activate'}`}
                              >
                                <span className="relative flex h-2 w-2 shrink-0">
                                  {isActive ? (
                                    <>
                                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-sm" />
                                    </>
                                  ) : (
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500 shadow-sm" />
                                  )}
                                </span>
                                <span className="font-semibold leading-none">{statusText}</span>
                                <span
                                  className={`relative inline-flex h-4 w-8 shrink-0 items-center rounded-full p-0.5 transition-colors duration-200 ease-in-out border ${
                                    isActive
                                      ? 'bg-emerald-500 border-emerald-600 shadow-xs shadow-emerald-500/30'
                                      : 'bg-slate-300 dark:bg-slate-700 border-slate-400 dark:border-slate-600'
                                  }`}
                                >
                                  <span
                                    className={`pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow-sm transition duration-200 ease-in-out ${
                                      isActive ? 'translate-x-4' : 'translate-x-0'
                                    }`}
                                  />
                                </span>
                              </button>
                            );
                          })()}
                        </td>

                        {/* Speed */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold inline-block ${
                              u.bestWpm >= 110
                                ? 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/30'
                                : u.bestWpm >= 80
                                ? 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30'
                                : u.bestWpm >= 40
                                ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                                : 'bg-slate-500/15 text-slate-600 dark:text-slate-400'
                            }`}
                          >
                            {u.bestWpm > 0 ? `${u.bestWpm} WPM` : 'Unranked'}
                          </span>
                        </td>

                        {/* Accuracy */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`text-xs font-bold ${
                              u.accuracy >= 98
                                ? 'text-emerald-600 dark:text-emerald-400'
                                : u.accuracy >= 90
                                ? 'text-blue-600 dark:text-blue-400'
                                : 'text-amber-600 dark:text-amber-400'
                            }`}
                          >
                            {u.accuracy}% acc
                          </span>
                        </td>

                        {/* Tara Typing 18-Lesson Progress */}
                        <td className="px-4 py-4">
                          <div className="w-28 space-y-1">
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="font-semibold text-slate-700 dark:text-slate-300">
                                {u.lessonProgress || 0}/18
                              </span>
                              <span className="text-slate-400 text-[10px]">{lessonPct}%</span>
                            </div>
                            <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all duration-500 ${
                                  lessonPct === 100
                                    ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                                    : 'bg-gradient-to-r from-purple-500 to-indigo-500'
                                }`}
                                style={{ width: `${lessonPct}%` }}
                              />
                            </div>
                          </div>
                        </td>

                        {/* Activity */}
                        <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500 dark:text-slate-400">
                          <div className="flex items-center gap-1.5">
                            {u.lastActive === 'Active now' ? (
                              <span className="flex h-2 w-2 relative">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                              </span>
                            ) : (
                              <Clock size={12} className="text-slate-400" />
                            )}
                            <span>{u.lastActive}</span>
                          </div>
                        </td>

                        {/* Actions (Separate Icon-Only Buttons) */}
                        <td className="px-6 py-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleOpenDossier(u)}
                              className="p-1.5 rounded-lg text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200/70 dark:border-indigo-800/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 hover:text-indigo-700 dark:hover:text-indigo-300 hover:border-indigo-300 dark:hover:border-indigo-700 hover:scale-105 active:scale-95 transition-all shadow-2xs cursor-pointer"
                              title="View Details"
                              aria-label="View Details"
                            >
                              <Eye size={15} strokeWidth={2} />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDeleteUser(u._id || u.id, u.name)}
                              className="p-1.5 rounded-lg text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border border-rose-200/70 dark:border-rose-800/50 hover:bg-rose-100 dark:hover:bg-rose-900/50 hover:text-rose-700 dark:hover:text-rose-300 hover:border-rose-300 dark:hover:border-rose-700 hover:scale-105 active:scale-95 transition-all shadow-2xs"
                              title="Delete Account"
                              aria-label="Delete Account"
                            >
                              <Trash2 size={15} strokeWidth={2} />
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

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredUsers.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
          />
        </div>
      ) : (
        /* GRID CARDS VIEW */
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {isLoading ? (
              <div className="col-span-full py-16 text-center rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-400 text-sm flex flex-col items-center justify-center gap-3">
                <div className="h-8 w-8 animate-spin rounded-full border-3 border-purple-500 border-t-transparent" />
                <span className="text-xs font-medium text-slate-500">Loading typists directory...</span>
              </div>
            ) : paginatedUsers.length === 0 ? (
              <div className="col-span-full py-14 text-center rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-400 text-sm">
                No members found matching your search.
              </div>
            ) : (
              paginatedUsers.map((u) => {
                const lessonPct = Math.round(((u.lessonProgress || 0) / 18) * 100);
                const testCount = u.testsCompleted !== undefined ? u.testsCompleted : u.tests;
                const streakCount = u.currentStreak !== undefined ? u.currentStreak : u.streak;

                return (
                  <div
                    key={u._id || u.id}
                    className="relative rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-purple-500/40"
                  >
                    {/* Top Row: User Avatar, Name, Status */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="relative shrink-0">
                          <UserAvatar
                            src={u.avatar}
                            name={u.name}
                            username={u.username}
                            className="h-12 w-12"
                            textClassName="text-base font-bold"
                            rounded="rounded-xl"
                            firstLetterOnly
                          />
                          {streakCount > 0 && (
                            <span
                              className="absolute -top-1.5 -right-1.5 z-10 inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-extrabold text-[9px] shadow-xs border-1.5 border-white dark:border-slate-900 leading-tight"
                              title={`${streakCount} Day Typing Streak`}
                            >
                              <Flame size={9} className="fill-white stroke-none" />
                              <span>{streakCount}d</span>
                            </span>
                          )}
                          {u.lastActive === 'Active now' && (
                            <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900 z-10" />
                          )}
                        </div>

                        <div className="min-w-0">
                          <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white truncate">
                            {u.name}
                          </h3>
                          <p className="text-xs text-purple-600 dark:text-purple-400 font-medium truncate">
                            @{u.username}
                          </p>
                          <div className="mt-1 flex items-center flex-wrap gap-1.5">
                            {(() => {
                              const isActive = isUserActive(u);
                              const statusText = isActive ? 'Active' : 'Suspended';
                              return (
                                <button
                                  type="button"
                                  onClick={() => toggleUserStatus(u._id || u.id)}
                                  className={`group relative inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border transition-all duration-200 cursor-pointer shadow-2xs hover:shadow-xs active:scale-95 select-none ${
                                    isActive
                                      ? 'bg-emerald-500/10 hover:bg-emerald-500/15 dark:bg-emerald-950/40 dark:hover:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-500/30'
                                      : 'bg-rose-500/10 hover:bg-rose-500/15 dark:bg-rose-950/40 dark:hover:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-500/30'
                                  }`}
                                  title={isActive ? 'Status: Active (Click to Suspend)' : 'Status: Suspended (Click to Activate)'}
                                  aria-label={`Status: ${statusText}. Click to ${isActive ? 'Suspend' : 'Activate'}`}
                                >
                                  <span className="relative flex h-1.5 w-1.5 shrink-0">
                                    {isActive ? (
                                      <>
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                                      </>
                                    ) : (
                                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-rose-500" />
                                    )}
                                  </span>
                                  <span>{statusText}</span>
                                  <span
                                    className={`relative inline-flex h-3.5 w-7 shrink-0 items-center rounded-full p-0.5 transition-colors duration-200 ease-in-out border ${
                                      isActive
                                        ? 'bg-emerald-500 border-emerald-600'
                                        : 'bg-slate-300 dark:bg-slate-700 border-slate-400 dark:border-slate-600'
                                    }`}
                                  >
                                    <span
                                      className={`pointer-events-none inline-block h-2.5 w-2.5 transform rounded-full bg-white shadow-xs transition duration-200 ease-in-out ${
                                        isActive ? 'translate-x-3.5' : 'translate-x-0'
                                      }`}
                                    />
                                  </span>
                                </button>
                              );
                            })()}

                            {/* Role (Custom Styled Dropdown with Rounded Card) */}
                            <RoleSelectorDropdown
                              user={u}
                              isOpen={openRoleMenuId === `grid-${u._id || u.id}`}
                              onToggle={() =>
                                setOpenRoleMenuId(
                                  openRoleMenuId === `grid-${u._id || u.id}`
                                    ? null
                                    : `grid-${u._id || u.id}`
                                )
                              }
                              onSelectRole={(newRole) => {
                                handleUpdateRole(u._id || u.id, newRole);
                                setOpenRoleMenuId(null);
                              }}
                              align="bottom"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Quick 4 Stats Grid */}
                    <div className="mt-4 grid grid-cols-4 gap-2 text-center p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/80">
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">Speed</span>
                        <p className="text-xs sm:text-sm font-bold text-purple-600 dark:text-purple-400">
                          {u.bestWpm > 0 ? `${u.bestWpm}` : '-'}
                        </p>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">Tests</span>
                        <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
                          {testCount}
                        </p>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">Acc</span>
                        <p className="text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400">
                          {u.accuracy}%
                        </p>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">Streak</span>
                        <p className="text-xs sm:text-sm font-bold text-amber-500 flex items-center justify-center gap-0.5">
                          <Flame size={11} className="fill-amber-500" />
                          {streakCount}d
                        </p>
                      </div>
                    </div>

                    {/* Tara Typing 18-Lesson Progress Bar */}
                    <div className="mt-3.5 space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1">
                          <GraduationCap size={12} className="text-purple-500" />
                          Curriculum Progress
                        </span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                          {u.lessonProgress || 0}/18 ({lessonPct}%)
                        </span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-purple-500 to-indigo-500"
                          style={{ width: `${lessonPct}%` }}
                        />
                      </div>
                    </div>

                    {/* Bio snippet */}
                    {u.bio && (
                      <p className="mt-3 text-xs text-slate-500 dark:text-slate-400 line-clamp-2 italic">
                        "{u.bio}"
                      </p>
                    )}

                    {/* Card Actions */}
                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                      <span className="text-[11px] text-slate-400">
                        Joined {u.joined || (u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'Sep 2026')}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenDossier(u)}
                          className="p-1.5 rounded-lg text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200/70 dark:border-indigo-800/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 hover:text-indigo-700 dark:hover:text-indigo-300 hover:border-indigo-300 dark:hover:border-indigo-700 hover:scale-105 active:scale-95 transition-all shadow-2xs cursor-pointer"
                          title="View Details"
                          aria-label="View Details"
                        >
                          <Eye size={15} strokeWidth={2} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteUser(u._id || u.id, u.name)}
                          className="p-1.5 rounded-lg text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border border-rose-200/70 dark:border-rose-800/50 hover:bg-rose-100 dark:hover:bg-rose-900/50 hover:text-rose-700 dark:hover:text-rose-300 hover:border-rose-300 dark:hover:border-rose-700 hover:scale-105 active:scale-95 transition-all shadow-2xs"
                          title="Delete Account"
                          aria-label="Delete Account"
                        >
                          <Trash2 size={15} strokeWidth={2} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredUsers.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {/* ── 5. SLIDE-OVER SIDE DRAWER FOR USER DETAILS & DOSSIER (PORTAL TO BODY) ── */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {selectedUser && (
            <>
              {/* Backdrop */}
              <motion.div
                key="drawer-backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
                className="fixed inset-0 z-[60] bg-slate-950/60 backdrop-blur-xs"
                onClick={() => setSelectedUser(null)}
                aria-hidden="true"
              />

              {/* Slide-Over Drawer Container (True Full Screen Viewport Height) */}
              <motion.div
                key="drawer-panel"
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 30, stiffness: 280 }}
                className="fixed inset-y-0 right-0 z-[70] w-full max-w-md sm:max-w-xl h-screen max-h-screen bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col"
                role="dialog"
                aria-modal="true"
                aria-label="User Profile Drawer"
              >
        {/* Drawer Header (Compact Height) */}
        <div className="flex items-center justify-between px-5 py-2.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/50 shrink-0">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
              <Users size={15} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                Typist Profile & Dossier
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setSelectedUser(null)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Close Drawer (Esc)"
          >
            <X size={16} />
          </button>
        </div>

        {/* Drawer Scrollable Body */}
        {selectedUser && (
          <div className="flex-1 overflow-y-auto p-5 space-y-4 stylish-scrollbar">
            {/* User Profile Card (Compact Height) */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-slate-50 to-purple-50/30 dark:from-slate-950/70 dark:to-purple-950/10 border border-purple-500/20 shadow-xs space-y-2.5">
              <div className="flex items-center gap-3">
                <div className="relative shrink-0">
                  <UserAvatar
                    src={selectedUser.avatar}
                    name={selectedUser.name}
                    username={selectedUser.username}
                    className="h-12 w-12"
                    textClassName="text-base font-bold"
                    rounded="rounded-xl"
                    firstLetterOnly
                  />
                  {((selectedUser.currentStreak !== undefined ? selectedUser.currentStreak : selectedUser.streak) || 0) > 0 && (
                    <span
                      className="absolute -top-1 -right-1 z-10 inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-extrabold text-[9px] shadow-sm border border-white dark:border-slate-900 leading-tight"
                      title={`${selectedUser.currentStreak || selectedUser.streak} Day Typing Streak`}
                    >
                      <Flame size={9} className="fill-white stroke-none" />
                      <span>{selectedUser.currentStreak || selectedUser.streak}d</span>
                    </span>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-bold text-base text-slate-900 dark:text-white leading-tight">
                      {selectedUser.name}
                    </h3>
                    <StatusBadge status={isUserActive(selectedUser) ? 'Active' : 'Suspended'} />
                    <RoleSelectorDropdown
                      user={selectedUser}
                      isOpen={openRoleMenuId === `drawer-${selectedUser._id || selectedUser.id}`}
                      onToggle={() =>
                        setOpenRoleMenuId(
                          openRoleMenuId === `drawer-${selectedUser._id || selectedUser.id}`
                            ? null
                            : `drawer-${selectedUser._id || selectedUser.id}`
                        )
                      }
                      onSelectRole={(newRole) => {
                        handleUpdateRole(selectedUser._id || selectedUser.id, newRole);
                        setOpenRoleMenuId(null);
                      }}
                      align="bottom"
                    />
                  </div>
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-slate-500 dark:text-slate-400 mt-1">
                    <span className="text-purple-600 dark:text-purple-400 font-semibold">
                      @{selectedUser.username}
                    </span>
                    <span>•</span>
                    <span className="truncate">{selectedUser.email}</span>
                  </div>
                </div>
              </div>

              {/* Location & Metadata Badges (Icon-Only Compact Line) */}
              <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-200/70 dark:border-slate-800 text-[11px]">
                <div
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-500/10 border border-purple-500/20 font-semibold text-purple-700 dark:text-purple-300"
                  title={`Location: ${selectedUser.location || 'India'}`}
                >
                  <MapPin size={12} className="text-purple-600 dark:text-purple-400 shrink-0" />
                  <span>{selectedUser.location || 'India'}</span>
                </div>

                <div
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-medium"
                  title={`Joined: ${selectedUser.joined || (selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleDateString() : 'Sep 23, 2026')}`}
                >
                  <Calendar size={12} className="text-slate-400 dark:text-slate-500 shrink-0" />
                  <span>{selectedUser.joined || (selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleDateString() : 'Sep 23, 2026')}</span>
                </div>

                <div
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-medium"
                  title={`Active: ${selectedUser.lastActive || 'Recently'}`}
                >
                  <Clock size={12} className="text-slate-400 dark:text-slate-500 shrink-0" />
                  <span>{selectedUser.lastActive || 'Recently'}</span>
                </div>
              </div>
            </div>

            {/* Dossier Tabs: Overview vs Telemetry */}
            <div className="flex items-center gap-1 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950/60 p-1">
              <button
                type="button"
                onClick={() => setDossierActiveTab('overview')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  dossierActiveTab === 'overview'
                    ? 'bg-white dark:bg-slate-800 text-purple-600 dark:text-purple-400 shadow-xs'
                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                Typing Performance & Curriculum
              </button>
              <button
                type="button"
                onClick={() => setDossierActiveTab('telemetry')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  dossierActiveTab === 'telemetry'
                    ? 'bg-white dark:bg-slate-800 text-purple-600 dark:text-purple-400 shadow-xs'
                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                Security Telemetry & Anti-Cheat
              </button>
            </div>

            {dossierActiveTab === 'overview' ? (
              <div className="space-y-4">
                {/* 4 Core Metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-center shadow-xs">
                    <FileText size={16} className="mx-auto text-blue-500 mb-1" />
                    <span className="text-[10px] text-slate-400 font-semibold uppercase">Total Tests</span>
                    <p className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                      {selectedUser.testsCompleted !== undefined ? selectedUser.testsCompleted : selectedUser.tests}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-center shadow-xs">
                    <Zap size={16} className="mx-auto text-purple-500 mb-1" />
                    <span className="text-[10px] text-slate-400 font-semibold uppercase">Best Speed</span>
                    <p className="text-base sm:text-lg font-bold text-purple-600 dark:text-purple-400">
                      {selectedUser.bestWpm} WPM
                    </p>
                  </div>

                  <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-center shadow-xs">
                    <Target size={16} className="mx-auto text-emerald-500 mb-1" />
                    <span className="text-[10px] text-slate-400 font-semibold uppercase">Accuracy</span>
                    <p className="text-base sm:text-lg font-bold text-emerald-600 dark:text-emerald-400">
                      {selectedUser.accuracy}%
                    </p>
                  </div>

                  <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-center shadow-xs">
                    <Flame size={16} className="mx-auto text-amber-500 mb-1" />
                    <span className="text-[10px] text-slate-400 font-semibold uppercase">Streak</span>
                    <p className="text-base sm:text-lg font-bold text-amber-500">
                      {selectedUser.currentStreak !== undefined ? selectedUser.currentStreak : selectedUser.streak} Days
                    </p>
                  </div>
                </div>

                {/* 18-Lesson Curriculum Progress Card */}
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <GraduationCap size={16} className="text-purple-600" />
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                        Tara Typing Lesson Curriculum
                      </h4>
                    </div>
                    <span className="text-xs font-bold text-purple-600 dark:text-purple-400">
                      {selectedUser.lessonProgress || 0}/18 Completed (
                      {Math.round(((selectedUser.lessonProgress || 0) / 18) * 100)}%)
                    </span>
                  </div>

                  {/* 3 Tier visual breakdown */}
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                      <span className="text-[10px] text-slate-400 block font-semibold">Beginner (1-6)</span>
                      <span className="font-bold text-emerald-600">
                        {Math.min(6, selectedUser.lessonProgress || 0)} / 6 Done
                      </span>
                    </div>
                    <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                      <span className="text-[10px] text-slate-400 block font-semibold">Intermediate (7-12)</span>
                      <span className="font-bold text-blue-600">
                        {Math.max(0, Math.min(6, (selectedUser.lessonProgress || 0) - 6))} / 6 Done
                      </span>
                    </div>
                    <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                      <span className="text-[10px] text-slate-400 block font-semibold">Advanced (13-18)</span>
                      <span className="font-bold text-purple-600">
                        {Math.max(0, (selectedUser.lessonProgress || 0) - 12)} / 6 Done
                      </span>
                    </div>
                  </div>
                </div>

                {/* Recent Tests Table */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Recent Typing Test Records
                  </h4>
                  {selectedUser.recentTests && selectedUser.recentTests.length > 0 ? (
                    <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden text-xs">
                      <table className="w-full text-left">
                        <thead className="bg-slate-50 dark:bg-slate-950/60 text-slate-500 border-b border-slate-200 dark:border-slate-800">
                          <tr>
                            <th className="px-3 py-2">Mode</th>
                            <th className="px-3 py-2">Speed</th>
                            <th className="px-3 py-2">Accuracy</th>
                            <th className="px-3 py-2">Date</th>
                            <th className="px-3 py-2 text-right">Result</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                          {selectedUser.recentTests.slice(0, 3).map((t) => (
                            <tr key={t.id}>
                              <td className="px-3 py-2 font-medium text-slate-800 dark:text-slate-200">
                                {t.mode}
                              </td>
                              <td className="px-3 py-2 font-bold text-purple-600 dark:text-purple-400">
                                {t.wpm} WPM
                              </td>
                              <td className="px-3 py-2">{t.accuracy}%</td>
                              <td className="px-3 py-2 text-slate-400">{t.date}</td>
                              <td className="px-3 py-2 text-right">
                                <span
                                  className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                    t.status === 'Passed'
                                      ? 'bg-emerald-500/10 text-emerald-600'
                                      : 'bg-rose-500/10 text-rose-600'
                                  }`}
                                >
                                  {t.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 italic p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
                      No typing sessions recorded yet for this typist.
                    </p>
                  )}
                </div>
              </div>
            ) : (
              /* TELEMETRY & SECURITY TAB */
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
                        (selectedUser.riskScore || 0) > 50
                          ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400'
                          : 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                      }`}
                    >
                      {selectedUser.riskScore || 0}% Probability (
                      {(selectedUser.riskScore || 0) > 50 ? 'High Risk' : 'Low Risk / Legitimate'}
                      )
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        (selectedUser.riskScore || 0) > 50 ? 'bg-rose-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${selectedUser.riskScore || 2}%` }}
                    />
                  </div>
                </div>

                {/* Device & Connection Diagnostics Cards */}
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
                          Last Recorded IP
                        </span>
                        <span className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200">
                          {selectedUser.ip || '127.0.0.1'}
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
                          Client Environment
                        </span>
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                          {selectedUser.browser || 'Chrome 128 / Windows'}
                        </span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-md bg-purple-500/10 text-[10px] font-semibold text-purple-600 dark:text-purple-400 border border-purple-500/20">
                      Desktop Client
                    </span>
                  </div>

                  {/* Account Standing Card */}
                  {(() => {
                    const isSelectedActive = isUserActive(selectedUser);
                    return (
                      <div className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:border-purple-500/30 transition-colors">
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`p-2 rounded-lg border ${
                              isSelectedActive
                                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                                : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
                            }`}
                          >
                            {isSelectedActive ? <ShieldCheck size={15} /> : <ShieldAlert size={15} />}
                          </div>
                          <div>
                            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block">
                              Account Standing
                            </span>
                            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                              Platform Governance Status
                            </span>
                          </div>
                        </div>
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border shadow-2xs ${
                            isSelectedActive
                              ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                              : 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30'
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              isSelectedActive ? 'bg-emerald-500' : 'bg-rose-500'
                            }`}
                          />
                          <span>{isSelectedActive ? 'Active' : 'Suspended'}</span>
                        </span>
                      </div>
                    );
                  })()}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Drawer Sticky Footer with Clean Icon-Only Action Buttons & Top Tooltips */}
        <div className="px-5 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-950/80 shrink-0 flex items-center justify-end gap-3">
          {/* Suspend / Activate Icon Button with Top-Positioned Tooltip */}
          {(() => {
            const isSelectedActive = isUserActive(selectedUser);
            return (
              <div className="relative group/tooltip flex items-center">
                <button
                  type="button"
                  onClick={() => toggleUserStatus(selectedUser._id || selectedUser.id)}
                  className={`p-2.5 rounded-xl border transition-all duration-150 hover:scale-105 active:scale-95 shadow-2xs cursor-pointer ${
                    !isSelectedActive
                      ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 shadow-emerald-500/10'
                      : 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800/60 hover:bg-amber-100 dark:hover:bg-amber-900/50 shadow-amber-500/10'
                  }`}
                  aria-label={!isSelectedActive ? 'Activate User Account' : 'Suspend User Account'}
                >
                  {!isSelectedActive ? (
                    <UserCheck size={16} strokeWidth={2.2} />
                  ) : (
                    <UserX size={16} strokeWidth={2.2} />
                  )}
                </button>

                {/* Custom Styled Tooltip on TOP with Smooth Border Radius */}
                <div className="pointer-events-none absolute bottom-full mb-2.5 left-1/2 -translate-x-1/2 opacity-0 group-hover/tooltip:opacity-100 group-hover/tooltip:-translate-y-1 transition-all duration-150 z-50 whitespace-nowrap">
                  <div className="px-3 py-1.5 rounded-xl bg-slate-900 text-white dark:bg-slate-800 dark:text-white text-[11px] font-semibold shadow-xl border border-slate-700/60 flex items-center gap-1.5">
                    <span>{!isSelectedActive ? 'Activate User Account' : 'Suspend User Account'}</span>
                  </div>
                  <div className="w-2 h-2 bg-slate-900 dark:bg-slate-800 border-r border-b border-slate-700/60 rotate-45 mx-auto -mt-1 rounded-xs" />
                </div>
              </div>
            );
          })()}

          {/* Delete Icon Button with Top-Positioned Tooltip */}
          <div className="relative group/tooltip flex items-center">
            <button
              type="button"
              onClick={() => handleDeleteUser(selectedUser._id || selectedUser.id, selectedUser.name)}
              className="p-2.5 rounded-xl text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800/60 hover:bg-rose-100 dark:hover:bg-rose-900/50 hover:text-rose-700 hover:scale-105 active:scale-95 transition-all shadow-2xs shadow-rose-500/10 cursor-pointer"
              aria-label="Delete User Account"
            >
              <Trash2 size={16} strokeWidth={2.2} />
            </button>

            {/* Custom Styled Tooltip on TOP with Smooth Border Radius */}
            <div className="pointer-events-none absolute bottom-full mb-2.5 right-0 opacity-0 group-hover/tooltip:opacity-100 group-hover/tooltip:-translate-y-1 transition-all duration-150 z-50 whitespace-nowrap">
              <div className="px-3 py-1.5 rounded-xl bg-rose-600 text-white text-[11px] font-semibold shadow-xl border border-rose-500 flex items-center gap-1.5">
                <Trash2 size={12} />
                <span>Delete Account</span>
              </div>
              <div className="w-2 h-2 bg-rose-600 border-r border-b border-rose-500 rotate-45 ml-auto mr-3.5 -mt-1 rounded-xs" />
            </div>
          </div>
        </div>
      </motion.div>
    </>
  )}
</AnimatePresence>,
document.body
)}

      {/* ── 6. ADD NEW TYPIST MODAL ── */}
      <AdminModal
        isOpen={isAddUserOpen}
        onClose={() => setIsAddUserOpen(false)}
        title="Add New Typist Member"
        subtitle="Provision an account manually for testing, coaching, or administrative privileges."
        maxWidth="max-w-md"
        footer={
          <div className="flex items-center justify-end gap-2 w-full">
            <button
              type="button"
              onClick={() => setIsAddUserOpen(false)}
              className="px-3.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleAddUserSubmit}
              className="px-4 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold transition-colors shadow-sm shadow-purple-500/30"
            >
              Create Account
            </button>
          </div>
        }
      >
        <form onSubmit={handleAddUserSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={newUserForm.name}
              onChange={(e) => setNewUserForm({ ...newUserForm, name: e.target.value })}
              placeholder="e.g. Ram Kumar"
              className="w-full h-9 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 px-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Username *
              </label>
              <input
                type="text"
                required
                value={newUserForm.username}
                onChange={(e) => setNewUserForm({ ...newUserForm, username: e.target.value })}
                placeholder="e.g. ram_typist"
                className="w-full h-9 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 px-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Role *
              </label>
              <select
                value={newUserForm.role}
                onChange={(e) => setNewUserForm({ ...newUserForm, role: e.target.value })}
                className="w-full h-9 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 px-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="user">Standard User</option>
                <option value="admin">Administrator</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Email Address *
            </label>
            <input
              type="email"
              required
              value={newUserForm.email}
              onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
              placeholder="e.g. ram@example.com"
              className="w-full h-9 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 px-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Location
              </label>
              <input
                type="text"
                value={newUserForm.location}
                onChange={(e) => setNewUserForm({ ...newUserForm, location: e.target.value })}
                placeholder="e.g. Prayagraj"
                className="w-full h-9 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 px-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Temporary Password
              </label>
              <input
                type="text"
                value={newUserForm.tempPassword}
                onChange={(e) => setNewUserForm({ ...newUserForm, tempPassword: e.target.value })}
                className="w-full h-9 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 px-3 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center gap-2">
            <input
              type="checkbox"
              id="sendWelcome"
              checked={newUserForm.sendWelcomeEmail}
              onChange={(e) =>
                setNewUserForm({ ...newUserForm, sendWelcomeEmail: e.target.checked })
              }
              className="rounded border-slate-300 text-purple-600 focus:ring-purple-500"
            />
            <label htmlFor="sendWelcome" className="text-slate-600 dark:text-slate-400 select-none">
              Dispatch welcome email with initial login credentials
            </label>
          </div>
        </form>
      </AdminModal>
    </div>
  );
};

export default AdminUsers;
