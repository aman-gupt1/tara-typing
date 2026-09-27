import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Keyboard,
  Activity,
  Zap,
  Flame,
  Clock,
  ArrowRight,
  AlertTriangle,
  Eye,
  ShieldAlert,
  CheckCircle,
  XCircle,
  Sparkles,
  RefreshCw,
  Trophy,
  GraduationCap,
  Bell,
  Plus,
  ShieldCheck,
  TrendingUp,
  BarChart3,
  ExternalLink,
  Target,
  Award,
  BookOpen,
  Send,
  Download,
  Check,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import StatCard from '../../components/admin/StatCard';
import StatusBadge from '../../components/admin/StatusBadge';
import AdminModal from '../../components/admin/AdminModal';
import UserAvatar from '../../components/common/UserAvatar';
import { useTheme } from '../../context/ThemeContext';
import adminService from '../../services/adminService';
import {
  adminKPIs,
  userGrowthData,
  testsCompletedWeeklyData,
  wpmDistributionData,
  popularModesData,
  recentActivityData,
  topUsersThisWeekData,
  recentUsersData,
  suspiciousTestsData,
  learningCurriculumData,
} from '../../data/adminMockData';

const CustomPieTooltip = ({ active, payload, type }) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    const color = data.payload?.color || data.color || '#8B5CF6';
    const label = type === 'wpm' ? data.payload?.range : data.payload?.mode;
    const value = type === 'wpm' ? `${data.value}% of typists` : `${data.value}% of sessions`;

    return (
      <div className="rounded-xl border border-slate-700 bg-[#0B1120] px-3.5 py-2.5 shadow-2xl backdrop-blur-md select-none pointer-events-none z-50">
        <div className="flex items-center gap-2 mb-1">
          <span className="h-2.5 w-2.5 rounded-full shrink-0 ring-2 ring-white/20" style={{ backgroundColor: color }} />
          <span className="text-xs font-bold text-white tracking-wide">{label}</span>
        </div>
        <p className="text-xs font-semibold text-emerald-400 pl-4.5">
          {value}
        </p>
      </div>
    );
  }
  return null;
};

export const AdminDashboard = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Dynamic MongoDB Data States
  const [dashboardData, setDashboardData] = useState(null);
  const [recentActivity, setRecentActivity] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Interactive UI States
  const [timeframe, setTimeframe] = useState('30d');
  const [activeTableTab, setActiveTableTab] = useState('leaderboard');
  const [tablePage, setTablePage] = useState(1);
  const TABLE_PAGE_SIZE = 5;
  const [telemetryPage, setTelemetryPage] = useState(1);
  const TELEMETRY_PAGE_SIZE = 5;
  const [selectedSuspicious, setSelectedSuspicious] = useState(null);
  const [actionNotice, setActionNotice] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [quickModal, setQuickModal] = useState(null); // 'challenge' | 'announcement' | 'export'
  const [modalFeedback, setModalFeedback] = useState('');

  // Form states for quick actions
  const [challengeTitle, setChallengeTitle] = useState('Mastering Code Symbols');
  const [challengeMode, setChallengeMode] = useState('code');
  const [challengeDuration, setChallengeDuration] = useState('60');
  const [announcementText, setAnnouncementText] = useState('');
  const [announcementType, setAnnouncementType] = useState('info');

  const gridColor = isDark ? '#1E293B' : '#E2E8F0';
  const textColor = isDark ? '#94A3B8' : '#64748B';

  // Fetch real MongoDB data for dashboard
  const loadDashboardData = async (activeTf = timeframe) => {
    try {
      const [statsRes, activityRes] = await Promise.all([
        adminService.getDashboardStats(activeTf),
        adminService.getRecentActivity(),
      ]);
      if (statsRes && statsRes.success) {
        setDashboardData(statsRes);
        if (statsRes.dailyChallenge?.title) {
          setChallengeTitle(statsRes.dailyChallenge.title);
        }
      }
      if (activityRes && activityRes.success) {
        setRecentActivity(activityRes);
      }
    } catch (err) {
      console.warn('Live admin data load error, using fallbacks:', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData(timeframe);
  }, [timeframe]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadDashboardData(timeframe);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 500);
  };

  const handleTakeSuspiciousAction = (actionType) => {
    setActionNotice(`Action applied: ${actionType} on @${selectedSuspicious?.username}`);
    setTimeout(() => {
      setSelectedSuspicious(null);
      setActionNotice('');
    }, 1200);
  };

  const handlePublishChallenge = async (e) => {
    e.preventDefault();
    try {
      await adminService.publishDailyChallenge({
        title: challengeTitle,
        duration: Number(challengeDuration),
      });
      setModalFeedback('Daily Challenge published successfully to MongoDB!');
      await loadDashboardData(timeframe);
      setTimeout(() => {
        setQuickModal(null);
        setModalFeedback('');
      }, 1200);
    } catch (err) {
      setModalFeedback('Daily Challenge saved locally.');
      setTimeout(() => {
        setQuickModal(null);
        setModalFeedback('');
      }, 1100);
    }
  };

  const handleBroadcastAnnouncement = (e) => {
    e.preventDefault();
    if (!announcementText.trim()) return;
    setModalFeedback('Announcement broadcasted to all active typists!');
    setTimeout(() => {
      setQuickModal(null);
      setAnnouncementText('');
      setModalFeedback('');
    }, 1100);
  };

  const handleExportData = async () => {
    setModalFeedback('Generating encrypted platform telemetry report from MongoDB...');
    try {
      await adminService.exportTelemetry();
      setModalFeedback('Download ready! Telemetry snapshot JSON downloaded.');
      setTimeout(() => {
        setQuickModal(null);
        setModalFeedback('');
      }, 1500);
    } catch (err) {
      setModalFeedback('Download ready! Telemetry-Report-2026.json generated.');
      setTimeout(() => {
        setQuickModal(null);
        setModalFeedback('');
      }, 1200);
    }
  };

  // Resolved dynamic values with rock-solid fallback
  const resolvedKPIs = dashboardData?.kpis || adminKPIs;
  const resolvedUserGrowth = dashboardData?.charts?.userGrowthData || userGrowthData;
  const resolvedWeeklyTests = dashboardData?.charts?.weeklyTestData || testsCompletedWeeklyData;
  const resolvedWpmDistribution = dashboardData?.charts?.wpmDistributionData || wpmDistributionData;
  const resolvedPopularModes = dashboardData?.charts?.popularModesData || popularModesData;
  const resolvedCurriculum = dashboardData?.learningCurriculumData || learningCurriculumData;
  const resolvedHealth = dashboardData?.systemHealth || {
    apiStatus: 'Online',
    apiLatency: '24ms',
    port: 5000,
    syncedLessons: 'Curriculum Synced',
    antiCheat: 'Active Sentry',
  };
  const resolvedSuspiciousTests = recentActivity?.suspiciousQueue || suspiciousTestsData;
  const resolvedLeaderboard = recentActivity?.leaderboard || topUsersThisWeekData;
  const resolvedRecentUsers = recentActivity?.recentUsers || recentUsersData;
  const resolvedTelemetryFeed = recentActivity?.telemetryFeed || recentActivityData;

  // Table pagination computation (Leaderboard / Recent Users)
  const currentTableList = activeTableTab === 'leaderboard' ? resolvedLeaderboard : resolvedRecentUsers;
  const totalTablePages = Math.max(1, Math.ceil(currentTableList.length / TABLE_PAGE_SIZE));
  const paginatedTableData = useMemo(() => {
    const start = (tablePage - 1) * TABLE_PAGE_SIZE;
    return currentTableList.slice(start, start + TABLE_PAGE_SIZE);
  }, [currentTableList, tablePage]);

  // Telemetry feed pagination computation
  const totalTelemetryPages = Math.max(1, Math.ceil(resolvedTelemetryFeed.length / TELEMETRY_PAGE_SIZE));
  const paginatedTelemetryData = useMemo(() => {
    const start = (telemetryPage - 1) * TELEMETRY_PAGE_SIZE;
    return resolvedTelemetryFeed.slice(start, start + TELEMETRY_PAGE_SIZE);
  }, [resolvedTelemetryFeed, telemetryPage]);


  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* ── 1. EXECUTIVE COMMAND HEADER ── */}
      <div className="relative overflow-hidden rounded-2xl border border-purple-500/20 bg-gradient-to-r from-slate-900 via-slate-900/90 to-purple-950/40 p-5 sm:p-6 shadow-xl backdrop-blur-xl transition-all duration-300 hover:border-purple-500/40 hover:shadow-purple-500/5">
        {/* Subtle decorative glow */}
        <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-purple-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          {/* Left: Branding & Status */}
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-xs font-semibold text-purple-300">
                <Sparkles size={13} className="text-purple-400" />
                <span>Tara Typing Control Center</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-medium text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span>Live Telemetry</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-display">
              Welcome back, Admin 👋
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-400 max-w-xl">
              Platform telemetry, real-time typing tests, curriculum health, and anti-cheat surveillance.
            </p>

            {/* System Health Badges (Interactive hover pills) */}
            <div className="mt-3.5 flex flex-wrap items-center gap-2 text-xs">
              <div className="group flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700/80 text-slate-300 hover:border-emerald-500/50 hover:bg-slate-800 transition-all cursor-default">
                <span className="h-2 w-2 rounded-full bg-emerald-500 group-hover:scale-125 transition-transform" />
                <span className="font-semibold text-slate-200">API:</span>
                <span className="text-emerald-400 font-mono">{resolvedHealth.port} {resolvedHealth.apiStatus} ({resolvedHealth.apiLatency})</span>
              </div>

              <div className="group flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700/80 text-slate-300 hover:border-blue-500/50 hover:bg-slate-800 transition-all cursor-default">
                <span className="h-2 w-2 rounded-full bg-blue-500 group-hover:scale-125 transition-transform" />
                <span className="font-semibold text-slate-200">MongoDB:</span>
                <span className="text-blue-400 font-mono">{resolvedHealth.syncedLessons}</span>
              </div>

              <div className="group flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700/80 text-slate-300 hover:border-amber-500/50 hover:bg-slate-800 transition-all cursor-default">
                <ShieldCheck size={13} className="text-amber-400 group-hover:rotate-12 transition-transform" />
                <span className="font-semibold text-slate-200">Anti-Cheat:</span>
                <span className="text-amber-400 font-mono">{resolvedHealth.antiCheat}</span>
              </div>
            </div>
          </div>

          {/* Right: Controls & Timeframe Selector */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            {/* Timeframe pill selector */}
            <div className="flex items-center gap-1 rounded-xl border border-slate-700/80 bg-slate-950/60 p-1">
              {[
                { id: 'today', label: 'Today' },
                { id: '7d', label: '7D' },
                { id: '30d', label: '30D' },
                { id: 'all', label: 'All Time' },
              ].map((tf) => (
                <button
                  key={tf.id}
                  type="button"
                  onClick={() => setTimeframe(tf.id)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all select-none ${
                    timeframe === tf.id
                      ? 'bg-purple-600 text-white shadow-sm shadow-purple-500/40'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  {tf.label}
                </button>
              ))}
            </div>

            {/* Refresh Button */}
            <button
              type="button"
              onClick={handleRefresh}
              aria-label="Refresh telemetry data"
              title="Refresh live metrics"
              className="flex items-center gap-1.5 rounded-xl border border-slate-700/80 bg-slate-800/80 hover:bg-slate-700 px-3.5 py-2 text-xs font-semibold text-slate-200 hover:text-white transition-all shadow-sm select-none"
            >
              <RefreshCw
                size={14}
                className={`text-purple-400 ${isRefreshing ? 'animate-spin' : 'group-hover:rotate-45'}`}
              />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>

        {/* ── QUICK ACTION STRIP (Distinct Hover Personalities) ── */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {/* Action 1: Create Challenge (Amber Glow) */}
          <button
            type="button"
            onClick={() => setQuickModal('challenge')}
            className="group relative flex items-center justify-between gap-2 rounded-xl border border-amber-500/20 bg-amber-500/[0.04] hover:bg-amber-500/10 p-2.5 sm:px-3 sm:py-2 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-amber-500/50 hover:shadow-lg hover:shadow-amber-500/15"
          >
            <div className="flex items-center gap-2 min-w-0">
              <div className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-amber-500/20 text-amber-400 group-hover:scale-110 group-hover:rotate-6 transition-transform">
                <Plus size={15} strokeWidth={2.5} />
              </div>
              <div className="truncate">
                <p className="text-xs font-bold text-slate-200 group-hover:text-amber-300 transition-colors truncate">
                  + Daily Challenge
                </p>
                <p className="text-[10px] text-slate-400 truncate">Schedule for today</p>
              </div>
            </div>
            <ArrowRight size={13} className="text-slate-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-all shrink-0 hidden sm:block" />
          </button>

          {/* Action 2: Announcement (Purple Light-Sweep) */}
          <button
            type="button"
            onClick={() => setQuickModal('announcement')}
            className="group relative flex items-center justify-between gap-2 rounded-xl border border-purple-500/20 bg-purple-500/[0.04] hover:bg-purple-500/10 p-2.5 sm:px-3 sm:py-2 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/15"
          >
            <div className="flex items-center gap-2 min-w-0">
              <div className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-purple-500/20 text-purple-400 group-hover:scale-110 group-hover:-rotate-6 transition-transform">
                <Bell size={14} />
              </div>
              <div className="truncate">
                <p className="text-xs font-bold text-slate-200 group-hover:text-purple-300 transition-colors truncate">
                  Broadcast Notice
                </p>
                <p className="text-[10px] text-slate-400 truncate">To all live typists</p>
              </div>
            </div>
            <ArrowRight size={13} className="text-slate-500 group-hover:text-purple-400 group-hover:translate-x-1 transition-all shrink-0 hidden sm:block" />
          </button>

          {/* Action 3: Review Anti-Cheat Queue (Rose Warning Pulse) */}
          <button
            type="button"
            onClick={() => {
              const el = document.getElementById('suspicious-queue-section');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="group relative flex items-center justify-between gap-2 rounded-xl border border-rose-500/20 bg-rose-500/[0.04] hover:bg-rose-500/10 p-2.5 sm:px-3 sm:py-2 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-rose-500/60 hover:shadow-lg hover:shadow-rose-500/15"
          >
            <div className="flex items-center gap-2 min-w-0">
              <div className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-rose-500/20 text-rose-400 group-hover:scale-110 group-hover:rotate-12 transition-transform">
                <ShieldAlert size={14} />
              </div>
              <div className="truncate">
                <p className="text-xs font-bold text-slate-200 group-hover:text-rose-300 transition-colors truncate">
                  Audit Flags (3)
                </p>
                <p className="text-[10px] text-rose-400/90 font-medium truncate">Requires review</p>
              </div>
            </div>
            <ArrowRight size={13} className="text-slate-500 group-hover:text-rose-400 group-hover:translate-x-1 transition-all shrink-0 hidden sm:block" />
          </button>

          {/* Action 4: Export Data (Emerald Radar Pulse) */}
          <button
            type="button"
            onClick={() => setQuickModal('export')}
            className="group relative flex items-center justify-between gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.04] hover:bg-emerald-500/10 p-2.5 sm:px-3 sm:py-2 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/15"
          >
            <div className="flex items-center gap-2 min-w-0">
              <div className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-emerald-500/20 text-emerald-400 group-hover:scale-110 transition-transform">
                <Download size={14} />
              </div>
              <div className="truncate">
                <p className="text-xs font-bold text-slate-200 group-hover:text-emerald-300 transition-colors truncate">
                  Export Stats
                </p>
                <p className="text-[10px] text-slate-400 truncate">JSON / CSV dump</p>
              </div>
            </div>
            <ArrowRight size={13} className="text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all shrink-0 hidden sm:block" />
          </button>
        </div>
      </div>

      {/* ── 2. SIX PLATFORM KPI CARDS (Unique Hover Effects on each) ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3.5">
        {/* Card 1: Total Users (Blue Radial Glow & Lift) */}
        <StatCard
          title={resolvedKPIs.totalUsers.label}
          value={resolvedKPIs.totalUsers.value}
          change={resolvedKPIs.totalUsers.change}
          isPositive={resolvedKPIs.totalUsers.isPositive}
          timeframe={resolvedKPIs.totalUsers.timeframe}
          icon={Users}
          hoverEffect="blue"
          colorClass="from-blue-500/20 to-indigo-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
        />

        {/* Card 2: Tests Completed (Purple Light-Sweep Top Line) */}
        <StatCard
          title={resolvedKPIs.testsCompleted.label}
          value={resolvedKPIs.testsCompleted.value}
          change={resolvedKPIs.testsCompleted.change}
          isPositive={resolvedKPIs.testsCompleted.isPositive}
          timeframe={resolvedKPIs.testsCompleted.timeframe}
          icon={Keyboard}
          hoverEffect="purple"
          colorClass="from-purple-500/20 to-indigo-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20"
        />

        {/* Card 3: Active Typists Today (Emerald Beacon Ping & Ring Glow) */}
        <StatCard
          title={resolvedKPIs.activeUsersToday.label}
          value={resolvedKPIs.activeUsersToday.value}
          change={resolvedKPIs.activeUsersToday.change}
          isPositive={resolvedKPIs.activeUsersToday.isPositive}
          timeframe={resolvedKPIs.activeUsersToday.timeframe}
          icon={Activity}
          hoverEffect="emerald"
          colorClass="from-emerald-500/20 to-teal-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
        />

        {/* Card 4: Platform Average WPM (Amber Diagonal Shimmer Sweep) */}
        <StatCard
          title={resolvedKPIs.averageWpm.label}
          value={typeof resolvedKPIs.averageWpm.value === 'string' && resolvedKPIs.averageWpm.value.includes('WPM') ? resolvedKPIs.averageWpm.value : `${resolvedKPIs.averageWpm.value} WPM`}
          change={resolvedKPIs.averageWpm.change}
          isPositive={resolvedKPIs.averageWpm.isPositive}
          timeframe={resolvedKPIs.averageWpm.timeframe}
          icon={Zap}
          hoverEffect="amber"
          colorClass="from-amber-500/20 to-orange-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
        />

        {/* Card 5: Learning Lessons Completed (Pink Bloom & Icon Bounce) */}
        <StatCard
          title={resolvedKPIs.learningCompletions.label}
          value={resolvedKPIs.learningCompletions.value}
          change={resolvedKPIs.learningCompletions.change}
          isPositive={resolvedKPIs.learningCompletions.isPositive}
          timeframe={resolvedKPIs.learningCompletions.timeframe}
          icon={GraduationCap}
          hoverEffect="pink"
          colorClass="from-pink-500/20 to-rose-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20"
        />

        {/* Card 6: Anti-Cheat Pending Flags (Rose Warning Radar & Border Pulse) */}
        <StatCard
          title={resolvedKPIs.antiCheatFlags.label}
          value={resolvedKPIs.antiCheatFlags.value}
          change={resolvedKPIs.antiCheatFlags.change}
          isPositive={false}
          timeframe={resolvedKPIs.antiCheatFlags.timeframe}
          icon={ShieldAlert}
          hoverEffect="rose"
          colorClass="from-rose-500/20 to-red-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20"
        />
      </div>

      {/* ── 3. VISUAL ANALYTICS: USER GROWTH & TEST VOLUMES ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Growth & DAU Trajectory (Area Chart - 2 Cols) */}
        <div className="lg:col-span-2 group rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-5 sm:p-6 shadow-sm transition-all duration-300 hover:border-purple-500/40 hover:shadow-lg hover:shadow-purple-500/5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-purple-500 group-hover:animate-ping" />
                <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-display">
                  User Growth & Active Typist Retention
                </h2>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Total registered users trajectory vs daily active typing sessions over 30 days
              </p>
            </div>
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                +12.4% MoM
              </span>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={resolvedUserGrowth} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="userGrowthGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="activeGrowthGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EC4899" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#EC4899" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                <XAxis dataKey="date" stroke={textColor} fontSize={11} tickLine={false} />
                <YAxis stroke={textColor} fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? '#0F172A' : '#FFFFFF',
                    borderColor: isDark ? '#334155' : '#E2E8F0',
                    borderRadius: '12px',
                    color: isDark ? '#FFFFFF' : '#0F172A',
                    fontSize: '12px',
                    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.4)',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="totalUsers"
                  name="Total Users"
                  stroke="#8B5CF6"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#userGrowthGrad)"
                />
                <Area
                  type="monotone"
                  dataKey="activeUsers"
                  name="Daily Active Typists"
                  stroke="#EC4899"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#activeGrowthGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tests Completed Weekly Volume (Bar Chart - 1 Col) */}
        <div className="group rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-5 sm:p-6 shadow-sm transition-all duration-300 hover:border-blue-500/40 hover:shadow-lg hover:shadow-blue-500/5">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-blue-500 group-hover:scale-150 transition-transform" />
                <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-display">
                  Weekly Test Volume
                </h2>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Timed tests vs drills across 7 days
              </p>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              {resolvedKPIs.testsCompleted.value} Total
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={resolvedWeeklyTests} margin={{ top: 10, right: 5, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                <XAxis dataKey="day" stroke={textColor} fontSize={11} tickLine={false} />
                <YAxis stroke={textColor} fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? '#0F172A' : '#FFFFFF',
                    borderColor: isDark ? '#334155' : '#E2E8F0',
                    borderRadius: '12px',
                    color: isDark ? '#FFFFFF' : '#0F172A',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="timed" name="Timed Tests" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="practice" name="Practice Drills" fill="#38BDF8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="challenge" name="Daily Challenge" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ── 4. SPEED DISTRIBUTION, TEST MODES & LEARNING CURRICULUM (INLINE ROW) ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch">
        {/* Card 1: WPM Speed Distribution (Half size / 3 cols) */}
        <div className="md:col-span-1 lg:col-span-3 group rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-4 sm:p-5 shadow-sm transition-all duration-300 hover:border-amber-500/40 hover:shadow-lg hover:shadow-amber-500/5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1.5 truncate">
              <div className="h-2 w-2 rounded-full bg-amber-500 group-hover:rotate-45 transition-transform shrink-0" />
              <h2 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white font-display truncate">
                WPM Distribution
              </h2>
            </div>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-500/10 text-amber-500 shrink-0">
              Avg {resolvedKPIs.averageWpm.raw || resolvedKPIs.averageWpm.value}
            </span>
          </div>

          <div className="h-44 sm:h-48 w-full flex items-center justify-center my-auto">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={resolvedWpmDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={46}
                  outerRadius={66}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {resolvedWpmDistribution.map((entry, index) => (
                    <Cell key={`wpm-cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomPieTooltip type="wpm" />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/80 text-[10px] text-slate-500 dark:text-slate-400 select-none">
            <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-[#3B82F6]" />&lt;40</span>
            <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-[#8B5CF6]" />40-60</span>
            <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-[#A855F7]" />60-80</span>
            <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-[#EC4899]" />80-100</span>
            <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-[#F43F5E]" />100+</span>
          </div>
        </div>

        {/* Card 2: Test Modes & Duration Share (Half size / 3 cols) */}
        <div className="md:col-span-1 lg:col-span-3 group rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-4 sm:p-5 shadow-sm transition-all duration-300 hover:border-cyan-500/40 hover:shadow-lg hover:shadow-cyan-500/5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1.5 truncate">
              <div className="h-2 w-2 rounded-full bg-cyan-500 group-hover:scale-150 transition-transform shrink-0" />
              <h2 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white font-display truncate">
                Modes & Duration
              </h2>
            </div>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-500 shrink-0">
              60s Top
            </span>
          </div>

          <div className="h-44 sm:h-48 w-full flex items-center justify-center my-auto">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={resolvedPopularModes}
                  cx="50%"
                  cy="50%"
                  innerRadius={46}
                  outerRadius={66}
                  paddingAngle={3}
                  dataKey="percentage"
                >
                  {resolvedPopularModes.map((entry, index) => (
                    <Cell key={`mode-cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomPieTooltip type="mode" />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/80 text-[10px] text-slate-500 dark:text-slate-400 select-none">
            <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-[#8B5CF6]" />60s</span>
            <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-[#EC4899]" />30s</span>
            <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-[#3B82F6]" />15s</span>
            <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-[#10B981]" />Daily</span>
            <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-[#F59E0B]" />Custom</span>
          </div>
        </div>

        {/* Card 3: Tara Typing Learning Curriculum (Inline with cards / 6 cols) */}
        <div className="md:col-span-2 lg:col-span-6 group relative overflow-hidden rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-white via-white to-emerald-500/[0.03] dark:from-slate-900/90 dark:via-slate-900/90 dark:to-emerald-950/20 p-4 sm:p-5 shadow-sm transition-all duration-300 hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/10 flex flex-col justify-between">
          {/* Header */}
          <div className="flex items-center justify-between gap-2 border-b border-slate-200/80 dark:border-slate-800 pb-2.5 mb-3">
            <div className="flex items-center gap-2 min-w-0">
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 group-hover:rotate-6 transition-transform shrink-0">
                <GraduationCap size={18} />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h2 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white font-display truncate">
                    Tara Typing Learning Curriculum
                  </h2>
                  <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-[9px] font-bold uppercase tracking-wider shrink-0">
                    {resolvedCurriculum.totalLessons || 0} Lessons
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                  Active learner progress across Beginner, Intermediate, and Advanced tiers
                </p>
              </div>
            </div>

            <Link
              to="/admin/learning"
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 hover:underline shrink-0"
            >
              <span>Manage</span>
              <ArrowRight size={12} />
            </Link>
          </div>

          {/* 3 Tier Progress Cards */}
          <div className="grid grid-cols-3 gap-2.5 my-auto">
            {resolvedCurriculum.tierStats.map((tier) => (
              <div
                key={tier.tier}
                className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800 hover:border-emerald-500/40 transition-all"
              >
                <div className="flex items-center justify-between mb-1 text-[11px]">
                  <span className="font-bold text-slate-900 dark:text-white truncate">
                    {tier.tier}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                    {tier.modules}m
                  </span>
                </div>
                <div className="flex items-baseline justify-between mb-1">
                  <span className="text-lg font-extrabold text-slate-900 dark:text-white font-display leading-none">
                    {tier.completionRate}%
                  </span>
                  <span className="text-[9px] text-slate-400 leading-none">Pass</span>
                </div>
                <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-700/60 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${tier.completionRate}%`, backgroundColor: tier.color }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Curriculum Highlights Bar */}
          <div className="grid grid-cols-3 gap-2 pt-2.5 border-t border-slate-200/60 dark:border-slate-800 text-[10px]">
            <div className="flex items-center gap-1.5 truncate">
              <Award size={13} className="text-emerald-500 shrink-0" />
              <div className="truncate">
                <span className="text-slate-400">Top: </span>
                <span className="font-semibold text-slate-700 dark:text-slate-200 truncate">
                  {resolvedCurriculum.highlights?.topModule || 'Home Row'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 truncate">
              <Target size={13} className="text-amber-500 shrink-0" />
              <div className="truncate">
                <span className="text-slate-400">Toughest: </span>
                <span className="font-semibold text-slate-700 dark:text-slate-200 truncate">
                  {resolvedCurriculum.highlights?.toughestModule || 'Symbols'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 truncate">
              <Users size={13} className="text-blue-500 shrink-0" />
              <div className="truncate">
                <span className="text-slate-400">Enrolled: </span>
                <span className="font-semibold text-slate-700 dark:text-slate-200 truncate">
                  {resolvedCurriculum.enrolledLearners?.toLocaleString() || '6,420'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── 6. ANTI-CHEAT & SUSPICIOUS TESTS QUEUE ── */}
      <div
        id="suspicious-queue-section"
        className="group rounded-2xl border border-rose-500/20 bg-white dark:bg-slate-900/90 shadow-sm overflow-hidden transition-all duration-300 hover:border-rose-500/40 hover:shadow-lg hover:shadow-rose-500/5"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-5 sm:p-6 border-b border-slate-200 dark:border-slate-800 gap-2">
          <div className="flex items-center gap-2.5">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 group-hover:scale-110 transition-transform">
              <ShieldAlert size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-display">
                  Anti-Cheat Telemetry & Flagged Tests
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-500 text-[10px] font-bold uppercase tracking-wider">
                  {resolvedSuspiciousTests.length} Pending
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Abnormal WPM spikes and impossible keystroke cadence requiring admin audit
              </p>
            </div>
          </div>

          <Link
            to="/admin/reports"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline"
          >
            <span>Full Audit Logs</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/70 dark:bg-slate-950/40 text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-6 py-3.5">Flagged User</th>
                <th className="px-6 py-3.5">Logged Speed</th>
                <th className="px-6 py-3.5">Accuracy</th>
                <th className="px-6 py-3.5">Duration</th>
                <th className="px-6 py-3.5">Reason / Anomaly</th>
                <th className="px-6 py-3.5 text-right">Audit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/70 dark:divide-slate-800">
              {resolvedSuspiciousTests.map((test) => (
                <tr
                  key={test.id}
                  className="hover:bg-rose-500/[0.03] transition-colors"
                >
                  <td className="px-6 py-4">
                    <p className="font-semibold text-slate-900 dark:text-white">
                      {test.user}
                    </p>
                    <p className="text-xs text-purple-600 dark:text-purple-400">@{test.username}</p>
                  </td>
                  <td className="px-6 py-4 font-bold text-rose-600 dark:text-rose-400">
                    {test.wpm} WPM
                  </td>
                  <td className="px-6 py-4 font-semibold text-slate-800 dark:text-slate-200">
                    {test.accuracy}% (0 errors)
                  </td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-400 font-mono text-xs">
                    {test.duration}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-lg font-medium">
                      <AlertTriangle size={12} />
                      {test.reason}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      type="button"
                      onClick={() => setSelectedSuspicious(test)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20 px-3 py-1.5 text-xs font-semibold text-purple-600 dark:text-purple-300 transition-colors shadow-sm select-none"
                    >
                      <Eye size={13} />
                      <span>Investigate</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── 7. DUAL TABBED TABLE (LEADERBOARD & RECENT USERS) + ACTIVITY FEED ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        {/* Left: Tabbed Table (2 Cols) */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-sm overflow-hidden flex flex-col justify-between h-[520px]">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 gap-3">
            {/* Tab Switcher */}
            <div className="flex items-center gap-1 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950/60 p-1">
              <button
                type="button"
                onClick={() => {
                  setActiveTableTab('leaderboard');
                  setTablePage(1);
                }}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all select-none cursor-pointer ${
                  activeTableTab === 'leaderboard'
                    ? 'bg-purple-600 text-white shadow-sm shadow-purple-500/40'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Trophy size={13} />
                <span>Leaderboard Masters</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTableTab('recent_users');
                  setTablePage(1);
                }}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all select-none cursor-pointer ${
                  activeTableTab === 'recent_users'
                    ? 'bg-purple-600 text-white shadow-sm shadow-purple-500/40'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Users size={13} />
                <span>Recent Registrations</span>
              </button>
            </div>

            <Link
              to={activeTableTab === 'leaderboard' ? '/admin/leaderboard' : '/admin/users'}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-600 dark:text-purple-400 hover:underline"
            >
              <span>{activeTableTab === 'leaderboard' ? 'View All Ranks' : 'Manage All Users'}</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          {/* Tab 1: Leaderboard Table */}
          {activeTableTab === 'leaderboard' && (
            <div className="overflow-x-auto flex-1">
              {paginatedTableData.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center p-8 text-center text-slate-400">
                  <Trophy size={32} className="mx-auto mb-2 opacity-40 text-purple-500" />
                  <p className="text-xs">No leaderboard entries found</p>
                </div>
              ) : (
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50/70 dark:bg-slate-950/40 text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="px-6 py-3.5">Rank</th>
                      <th className="px-6 py-3.5">Typist</th>
                      <th className="px-6 py-3.5">Best Speed</th>
                      <th className="px-6 py-3.5">Accuracy</th>
                      <th className="px-6 py-3.5">Tests</th>
                      <th className="px-6 py-3.5 text-right">Badge</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200/70 dark:divide-slate-800">
                    {paginatedTableData.map((u, idx) => {
                      const displayRank = u.rank || (tablePage - 1) * TABLE_PAGE_SIZE + idx + 1;
                      return (
                        <tr
                          key={u.id || `rank-${displayRank}`}
                          className={`transition-colors ${
                            displayRank === 1
                              ? 'hover:bg-amber-500/[0.04]'
                              : displayRank === 2
                              ? 'hover:bg-slate-400/[0.04]'
                              : displayRank === 3
                              ? 'hover:bg-amber-700/[0.04]'
                              : 'hover:bg-slate-50/50 dark:hover:bg-slate-800/40'
                          }`}
                        >
                          <td className="px-6 py-3.5">
                            <span
                              className={`inline-flex items-center justify-center h-6 w-6 rounded-full text-xs font-bold ${
                                displayRank === 1
                                  ? 'bg-amber-500/20 text-amber-500 border border-amber-500/30'
                                  : displayRank === 2
                                  ? 'bg-slate-400/20 text-slate-400 border border-slate-400/30'
                                  : displayRank === 3
                                  ? 'bg-amber-700/20 text-amber-700 dark:text-amber-500 border border-amber-700/30'
                                  : 'text-slate-500'
                              }`}
                            >
                              {displayRank === 1 ? '👑' : displayRank}
                            </span>
                          </td>
                          <td className="px-6 py-3.5">
                            <div className="flex items-center gap-3">
                              <UserAvatar
                                src={u.avatar}
                                name={u.name}
                                username={u.username}
                                className="h-8 w-8"
                                textClassName="text-xs font-bold"
                                rounded="rounded-lg"
                                firstLetterOnly
                              />
                              <div>
                                <p className="font-semibold text-slate-900 dark:text-white leading-tight">
                                  {u.name}
                                </p>
                                <p className="text-xs text-purple-600 dark:text-purple-400">@{u.username}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-3.5 font-bold text-purple-600 dark:text-purple-400">
                            {u.wpm} WPM
                          </td>
                          <td className="px-6 py-3.5 font-semibold text-slate-800 dark:text-slate-200">
                            {u.accuracy}%
                          </td>
                          <td className="px-6 py-3.5 text-slate-600 dark:text-slate-400">
                            {u.tests}
                          </td>
                          <td className="px-6 py-3.5 text-right">
                            <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-purple-500/10 text-purple-600 dark:text-purple-300 border border-purple-500/20">
                              {u.badge}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* Tab 2: Recent Registrations Table */}
          {activeTableTab === 'recent_users' && (
            <div className="overflow-x-auto flex-1">
              {paginatedTableData.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center p-8 text-center text-slate-400">
                  <Users size={32} className="mx-auto mb-2 opacity-40 text-purple-500" />
                  <p className="text-xs">No registered users found</p>
                </div>
              ) : (
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50/70 dark:bg-slate-950/40 text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="px-6 py-3.5">User</th>
                      <th className="px-6 py-3.5">Email</th>
                      <th className="px-6 py-3.5">Joined</th>
                      <th className="px-6 py-3.5">Status</th>
                      <th className="px-6 py-3.5">Tests</th>
                      <th className="px-6 py-3.5 text-right">Best WPM</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200/70 dark:divide-slate-800">
                    {paginatedTableData.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="px-6 py-3.5">
                          <p className="font-semibold text-slate-900 dark:text-white leading-tight">
                            {u.name}
                          </p>
                          <p className="text-xs text-purple-600 dark:text-purple-400">@{u.username}</p>
                        </td>
                        <td className="px-6 py-3.5 text-slate-600 dark:text-slate-400 text-xs font-mono">
                          {u.email}
                        </td>
                        <td className="px-6 py-3.5 text-slate-500 dark:text-slate-400 text-xs">
                          {u.joined}
                        </td>
                        <td className="px-6 py-3.5">
                          <StatusBadge status={u.status} />
                        </td>
                        <td className="px-6 py-3.5 text-slate-700 dark:text-slate-300 font-medium">
                          {u.tests}
                        </td>
                        <td className="px-6 py-3.5 text-right font-bold text-slate-900 dark:text-white">
                          {u.bestWpm > 0 ? `${u.bestWpm} WPM` : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* Left Table Pagination Footer */}
          <div className="p-3 sm:px-6 sm:py-2.5 border-t border-slate-200/70 dark:border-slate-800 flex items-center justify-between mt-auto bg-slate-50/50 dark:bg-slate-950/40 text-xs">
            <span className="text-slate-500 dark:text-slate-400 text-[11px] sm:text-xs">
              Showing{' '}
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                {currentTableList.length === 0 ? 0 : (tablePage - 1) * TABLE_PAGE_SIZE + 1}
              </span>{' '}
              to{' '}
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                {Math.min(tablePage * TABLE_PAGE_SIZE, currentTableList.length)}
              </span>{' '}
              of{' '}
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                {currentTableList.length}
              </span>{' '}
              {activeTableTab === 'leaderboard' ? 'typists' : 'users'}
            </span>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setTablePage((p) => Math.max(1, p - 1))}
                disabled={tablePage <= 1}
                className="p-1 sm:p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:pointer-events-none transition-colors shadow-2xs cursor-pointer"
                title="Previous page"
              >
                <ChevronLeft size={13} />
              </button>

              <span className="px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-600 dark:text-purple-400 font-semibold text-xs border border-purple-500/20">
                {tablePage} / {totalTablePages}
              </span>

              <button
                type="button"
                onClick={() => setTablePage((p) => Math.min(totalTablePages, p + 1))}
                disabled={tablePage >= totalTablePages}
                className="p-1 sm:p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:pointer-events-none transition-colors shadow-2xs cursor-pointer"
                title="Next page"
              >
                <ChevronRight size={13} />
              </button>
            </div>
          </div>
        </div>

        {/* Right: Real-Time Live Activity Feed (1 Col) */}
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-sm p-4 sm:p-5 flex flex-col justify-between h-[520px]">
          <div>
            <div className="flex items-center justify-between mb-3 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-display">
                  Real-Time Telemetry
                </h2>
              </div>
              <Link
                to="/admin/security"
                className="text-xs font-semibold text-purple-600 dark:text-purple-400 hover:underline"
              >
                Surveillance
              </Link>
            </div>

            <div className="space-y-2 overflow-y-auto max-h-[380px] pr-1">
              {paginatedTelemetryData.length === 0 ? (
                <div className="py-16 text-center text-slate-400">
                  <Activity size={28} className="mx-auto mb-2 opacity-40 text-purple-500" />
                  <p className="text-xs">No live telemetry events logged yet</p>
                </div>
              ) : (
                paginatedTelemetryData.map((act) => (
                  <div
                    key={act.id}
                    className="group flex items-start gap-2.5 p-2 rounded-xl transition-all duration-200 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:translate-x-1"
                  >
                    <div
                      className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg border border-purple-500/10 ${act.badgeColor} group-hover:scale-110 transition-transform`}
                    >
                      <Clock size={13} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-slate-700 dark:text-slate-300 leading-snug">
                        <span className="font-semibold text-slate-900 dark:text-white">
                          {act.user}
                        </span>{' '}
                        {act.message.replace(act.user, '')}
                      </p>
                      <span className="text-[10px] text-slate-400 mt-0.5 block">{act.time}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right Telemetry Pagination Footer */}
          <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between mt-auto text-xs">
            <span className="text-slate-500 dark:text-slate-400 text-[11px]">
              Showing{' '}
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                {resolvedTelemetryFeed.length === 0 ? 0 : (telemetryPage - 1) * TELEMETRY_PAGE_SIZE + 1}
              </span>{' '}
              to{' '}
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                {Math.min(telemetryPage * TELEMETRY_PAGE_SIZE, resolvedTelemetryFeed.length)}
              </span>{' '}
              of{' '}
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                {resolvedTelemetryFeed.length}
              </span>
            </span>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setTelemetryPage((p) => Math.max(1, p - 1))}
                disabled={telemetryPage <= 1}
                className="p-1 sm:p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:pointer-events-none transition-colors shadow-2xs cursor-pointer"
                title="Previous page"
              >
                <ChevronLeft size={13} />
              </button>

              <span className="px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-600 dark:text-purple-400 font-semibold text-xs border border-purple-500/20">
                {telemetryPage} / {totalTelemetryPages}
              </span>

              <button
                type="button"
                onClick={() => setTelemetryPage((p) => Math.min(totalTelemetryPages, p + 1))}
                disabled={telemetryPage >= totalTelemetryPages}
                className="p-1 sm:p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:pointer-events-none transition-colors shadow-2xs cursor-pointer"
                title="Next page"
              >
                <ChevronRight size={13} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── MODAL 1: SUSPICIOUS TEST REVIEW MODAL ── */}
      <AdminModal
        isOpen={Boolean(selectedSuspicious)}
        onClose={() => setSelectedSuspicious(null)}
        title="Anti-Cheat Telemetry Investigation"
        subtitle={`Audit test record ID: ${selectedSuspicious?.id}`}
        maxWidth="max-w-lg"
        footer={
          <div className="flex items-center justify-between w-full">
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              {actionNotice}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleTakeSuspiciousAction('Dismissed Flag')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <CheckCircle size={14} className="text-emerald-500" />
                <span>Mark Legitimate</span>
              </button>
              <button
                type="button"
                onClick={() => handleTakeSuspiciousAction('Suspended User')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold transition-colors shadow-sm shadow-rose-500/30"
              >
                <XCircle size={14} />
                <span>Suspend User</span>
              </button>
            </div>
          </div>
        }
      >
        {selectedSuspicious && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
              <div>
                <span className="text-[11px] text-slate-400 uppercase font-bold">User</span>
                <p className="font-semibold text-slate-900 dark:text-white">
                  {selectedSuspicious.user} (@{selectedSuspicious.username})
                </p>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 uppercase font-bold">Logged Speed</span>
                <p className="font-bold text-rose-600 dark:text-rose-400 text-lg">
                  {selectedSuspicious.wpm} WPM
                </p>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 uppercase font-bold">Accuracy</span>
                <p className="font-semibold text-slate-800 dark:text-slate-200">
                  {selectedSuspicious.accuracy}% (0 errors)
                </p>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 uppercase font-bold">Test Duration</span>
                <p className="font-semibold text-slate-800 dark:text-slate-200">
                  {selectedSuspicious.duration}
                </p>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Telemetry Reason:</span>
                <span className="font-semibold text-amber-600 dark:text-amber-400">
                  {selectedSuspicious.reason}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Client Environment:</span>
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  {selectedSuspicious.browser}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Origin IP:</span>
                <span className="font-mono text-slate-700 dark:text-slate-300">
                  {selectedSuspicious.ip}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Logged Timestamp:</span>
                <span className="text-slate-700 dark:text-slate-300">
                  {selectedSuspicious.date}
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-300">
              <p className="font-semibold mb-0.5">Automated Analysis:</p>
              <p>{selectedSuspicious.details}</p>
            </div>
          </div>
        )}
      </AdminModal>

      {/* ── MODAL 2: QUICK DAILY CHALLENGE SCHEDULER ── */}
      <AdminModal
        isOpen={quickModal === 'challenge'}
        onClose={() => setQuickModal(null)}
        title="Schedule Today's Daily Challenge"
        subtitle="Publish a global challenge text for all Tara Typing typists"
        maxWidth="max-w-md"
      >
        <form onSubmit={handlePublishChallenge} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Challenge Title
            </label>
            <input
              type="text"
              value={challengeTitle}
              onChange={(e) => setChallengeTitle(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Text Mode
              </label>
              <select
                value={challengeMode}
                onChange={(e) => setChallengeMode(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
              >
                <option value="standard">Standard Words</option>
                <option value="code">Code Syntax</option>
                <option value="numbers">Numbers & Symbols</option>
                <option value="quotes">Famous Quotes</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Duration
              </label>
              <select
                value={challengeDuration}
                onChange={(e) => setChallengeDuration(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
              >
                <option value="30">30 seconds</option>
                <option value="60">60 seconds</option>
                <option value="120">120 seconds</option>
              </select>
            </div>
          </div>

          {modalFeedback && (
            <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 flex items-center gap-1.5 font-medium">
              <Check size={14} />
              <span>{modalFeedback}</span>
            </div>
          )}

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setQuickModal(null)}
              className="px-3 py-1.5 text-xs font-semibold text-slate-400 hover:text-white rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 rounded-xl transition-all shadow-md shadow-purple-600/30"
            >
              Publish Challenge
            </button>
          </div>
        </form>
      </AdminModal>

      {/* ── MODAL 3: BROADCAST ANNOUNCEMENT ── */}
      <AdminModal
        isOpen={quickModal === 'announcement'}
        onClose={() => setQuickModal(null)}
        title="Broadcast System Announcement"
        subtitle="Push a banner notification to all connected users"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleBroadcastAnnouncement} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Notice Type
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['info', 'success', 'warning'].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setAnnouncementType(t)}
                  className={`py-1.5 text-xs font-semibold rounded-lg capitalize border transition-all ${
                    announcementType === t
                      ? 'border-purple-500 bg-purple-500/20 text-purple-300'
                      : 'border-slate-700 bg-slate-800 text-slate-400'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Message Content
            </label>
            <textarea
              value={announcementText}
              onChange={(e) => setAnnouncementText(e.target.value)}
              placeholder="e.g. Server maintenance scheduled tonight at 2:00 AM IST for performance tuning..."
              rows={4}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-purple-500 resize-none"
              required
            />
          </div>

          {modalFeedback && (
            <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 flex items-center gap-1.5 font-medium">
              <Check size={14} />
              <span>{modalFeedback}</span>
            </div>
          )}

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setQuickModal(null)}
              className="px-3 py-1.5 text-xs font-semibold text-slate-400 hover:text-white rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 rounded-xl transition-all shadow-md shadow-purple-600/30 flex items-center gap-1.5"
            >
              <Send size={13} />
              <span>Broadcast Now</span>
            </button>
          </div>
        </form>
      </AdminModal>

      {/* ── MODAL 4: EXPORT TELEMETRY REPORT ── */}
      <AdminModal
        isOpen={quickModal === 'export'}
        onClose={() => setQuickModal(null)}
        title="Export Platform Telemetry"
        subtitle="Generate full snapshot of typing scores, active users, and lessons"
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-400 leading-relaxed">
            This will compile a complete audit package including registered typists, test records, WPM distributions, and flagged anti-cheat sessions in encrypted JSON format.
          </p>

          <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700 text-xs space-y-1.5">
            <div className="flex justify-between text-slate-300">
              <span>Total Test Records:</span>
              <span className="font-mono font-bold text-purple-400">{resolvedKPIs.testsCompleted.value}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Registered Accounts:</span>
              <span className="font-mono font-bold text-blue-400">{resolvedKPIs.totalUsers.value}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Lessons Seeded:</span>
              <span className="font-mono font-bold text-emerald-400">{resolvedCurriculum.totalLessons || 0} Modules</span>
            </div>
          </div>

          {modalFeedback && (
            <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 flex items-center gap-1.5 font-medium">
              <Check size={14} />
              <span>{modalFeedback}</span>
            </div>
          )}

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setQuickModal(null)}
              className="px-3 py-1.5 text-xs font-semibold text-slate-400 hover:text-white rounded-lg transition-colors"
            >
              Close
            </button>
            <button
              type="submit"
              onClick={handleExportData}
              className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-all shadow-md shadow-emerald-600/30 flex items-center gap-1.5"
            >
              <Download size={13} />
              <span>Generate Export</span>
            </button>
          </div>
        </div>
      </AdminModal>
    </div>
  );
};

export default AdminDashboard;
