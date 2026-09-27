import React, { useState, useMemo, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  Users,
  Activity,
  Zap,
  Target,
  Laptop,
  RefreshCw,
  Clock,
  BookOpen,
  Calendar,
  Download,
  Flame,
  Award,
  Sparkles,
  ArrowUpRight,
  Filter,
  Loader2,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { toast } from 'react-toastify';
import StatCard from '../../components/admin/StatCard';
import { useTheme } from '../../context/ThemeContext';
import adminService from '../../services/adminService';

export const AdminAnalytics = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Navigation tab
  const [activeTab, setActiveTab] = useState('performance'); // 'performance' | 'traffic' | 'curriculum'

  // Timeframe selector
  const [timeframe, setTimeframe] = useState('30d'); // '24h' | '7d' | '30d' | 'all'

  // Dynamic Live State
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [exporting, setExporting] = useState(false);

  // Chart theme colors
  const gridColor = isDark ? '#1E293B' : '#F1F5F9';
  const textColor = isDark ? '#94A3B8' : '#64748B';
  const tooltipBg = isDark ? '#0F172A' : '#FFFFFF';
  const tooltipBorder = isDark ? '#334155' : '#E2E8F0';

  // Fetch Live Analytics Telemetry
  const fetchAnalytics = async (isManual = false) => {
    try {
      if (isManual) setRefreshing(true);
      else setLoading(true);

      const res = await adminService.getAnalyticsOverview(timeframe);
      if (res?.success && res.data) {
        setAnalyticsData(res.data);
      }
      if (isManual) {
        toast.success('Analytics intelligence refreshed!', { position: 'top-right' });
      }
    } catch (err) {
      console.error('Failed to load analytics:', err);
      toast.error('Failed to fetch live platform analytics', { position: 'top-right' });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [timeframe]);

  // Export Analytics Intelligence CSV
  const handleExportCSV = async () => {
    setExporting(true);
    try {
      await adminService.exportAnalyticsCSV(timeframe);
      toast.success('Analytics Intelligence Report exported to CSV!', { position: 'top-right' });
    } catch (err) {
      console.error('Export error:', err);
      toast.error('Failed to export analytics report', { position: 'top-right' });
    } finally {
      setExporting(false);
    }
  };

  // Safe fallback data object
  const data = analyticsData || {
    dau: 0,
    wau: 0,
    mau: 0,
    retentionRate: '0%',
    averageWpm: 0,
    averageAccuracy: 0,
    testsPerUser: 0,
    bounceRate: '0%',
    totalTestsAllTime: 0,
    testsToday: 0,
    wpmProgression: [],
    modeDistribution: [],
    accuracyDistribution: [],
    hourlyActivity: [],
    deviceBreakdown: [],
    lessonFunnel: [],
  };

  const isWpmEmpty = !data.wpmProgression?.length || data.wpmProgression.every((p) => p.avgWpm === 0 && p.eliteWpm === 0);
  const isModeEmpty = !data.modeDistribution?.length;
  const isAccEmpty = !data.accuracyDistribution?.length || data.accuracyDistribution.every((a) => a.count === 0);
  const isDeviceEmpty = !data.deviceBreakdown?.length || data.deviceBreakdown.every((d) => d.value === 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* ── 1. HEADER & QUICK ACTIONS ── */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 text-xs font-bold uppercase tracking-wider border border-purple-500/20">
              Platform Intelligence
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Telemetry Active
            </span>
          </div>
          <h1 className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-display">
            Platform Analytics & Intelligence
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time typing performance, concurrency distribution in IST, and curriculum retention funnel telemetry.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Timeframe Chips */}
          <div className="flex items-center p-0.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs">
            {[
              { id: '24h', label: '24h IST' },
              { id: '7d', label: '7 Days' },
              { id: '30d', label: '30 Days' },
              { id: 'all', label: 'All-Time' },
            ].map((tf) => (
              <button
                key={tf.id}
                type="button"
                onClick={() => setTimeframe(tf.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  timeframe === tf.id
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {tf.label}
              </button>
            ))}
          </div>

          {/* Refresh Button */}
          <button
            type="button"
            onClick={() => fetchAnalytics(true)}
            disabled={refreshing}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm cursor-pointer disabled:opacity-60"
            title="Refresh analytics telemetry"
          >
            <RefreshCw size={13} className={refreshing ? 'animate-spin text-purple-600' : ''} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          {/* Export Report */}
          <button
            type="button"
            onClick={handleExportCSV}
            disabled={exporting}
            className="inline-flex items-center gap-2 rounded-xl bg-purple-600 hover:bg-purple-700 px-4 py-2 text-xs font-semibold text-white shadow-sm shadow-purple-500/30 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer disabled:opacity-60"
          >
            {exporting ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
            <span>{exporting ? 'Exporting...' : 'Export Report'}</span>
          </button>
        </div>
      </div>

      {/* ── 2. TOP 4 STANDARDIZED KPI METRICS ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Card 1: Daily Active Users */}
        <StatCard
          title="Daily Active Typists (DAU)"
          value={(data.dau || 0).toLocaleString()}
          timeframe={timeframe === '24h' ? 'Past 24 hours (IST)' : 'Active today (IST)'}
          icon={Users}
          hoverEffect="blue"
          colorClass="from-blue-500/20 to-cyan-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
        />

        {/* Card 2: Total Tests Logged */}
        <StatCard
          title="Total Tests Logged"
          value={(data.totalTestsAllTime || 0).toLocaleString()}
          timeframe="Across all typing modes"
          icon={Activity}
          hoverEffect="purple"
          colorClass="from-purple-500/20 to-indigo-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20"
        />

        {/* Card 3: Platform Avg Velocity */}
        <StatCard
          title="Platform Avg Velocity"
          value={`${data.averageWpm || 0} WPM`}
          timeframe="Live platform average speed"
          icon={Zap}
          hoverEffect="emerald"
          colorClass="from-emerald-500/20 to-teal-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
        />

        {/* Card 4: Global Accuracy Benchmark */}
        <StatCard
          title="Accuracy Benchmark"
          value={`${data.averageAccuracy || 0}%`}
          timeframe="Platform precision rate"
          icon={Target}
          hoverEffect="amber"
          colorClass="from-amber-500/20 to-orange-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
        />
      </div>

      {/* ── 3. ANALYTICS PERSPECTIVE TABS ── */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        {[
          { id: 'performance', label: 'Typing Intelligence & Performance', icon: Zap },
          { id: 'traffic', label: 'Concurrency & Platform Usage (IST)', icon: Activity },
          { id: 'curriculum', label: 'Curriculum Retention Funnel', icon: BookOpen },
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
            </button>
          );
        })}
      </div>

      {/* Loading Skeleton */}
      {loading && !analyticsData ? (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-16 text-center">
          <Loader2 size={36} className="mx-auto text-purple-600 animate-spin mb-3" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Loading Live Platform Telemetry & Analytics...
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Computing community speed curves, test modes, and Indian Standard Time concurrency.
          </p>
        </div>
      ) : (
        <>
          {/* ── 4. TAB 1: TYPING INTELLIGENCE & PERFORMANCE ── */}
          {activeTab === 'performance' && (
            <div className="space-y-6">
              {/* Historical WPM Velocity Growth Area Chart */}
              <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6">
                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-display">
                      Community Velocity Progression (WPM Growth)
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Tracking average typist progression vs elite leaderboard contenders over the past 6 months.
                    </p>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-semibold">
                    <span className="flex items-center gap-1.5 text-purple-600 dark:text-purple-400">
                      <span className="h-2.5 w-2.5 rounded-full bg-purple-500" />
                      Average Typist WPM
                    </span>
                    <span className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
                      <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                      Top Elite WPM
                    </span>
                  </div>
                </div>

                <div className="h-72 w-full flex items-center justify-center">
                  {isWpmEmpty ? (
                    <div className="text-center text-slate-400">
                      <TrendingUp size={36} className="mx-auto mb-2 opacity-40 text-purple-500" />
                      <p className="text-xs font-medium">No test sessions recorded in the past 6 months yet</p>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={data.wpmProgression || []}
                        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient id="purpleGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.0} />
                          </linearGradient>
                          <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                        <XAxis dataKey="month" stroke={textColor} fontSize={11} tickLine={false} />
                        <YAxis stroke={textColor} fontSize={11} tickLine={false} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: tooltipBg,
                            borderColor: tooltipBorder,
                            borderRadius: '16px',
                            color: isDark ? '#FFFFFF' : '#0F172A',
                            fontSize: '12px',
                            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.2)',
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="avgWpm"
                          name="Average Typist Speed"
                          stroke="#8B5CF6"
                          strokeWidth={2.5}
                          fillOpacity={1}
                          fill="url(#purpleGrad)"
                        />
                        <Area
                          type="monotone"
                          dataKey="eliteWpm"
                          name="Top Elite Speed"
                          stroke="#3B82F6"
                          strokeWidth={2}
                          strokeDasharray="4 4"
                          fillOpacity={1}
                          fill="url(#blueGrad)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>

              {/* Mode Distribution & Accuracy Breakdown Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Mode Distribution Bar Chart */}
                <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-sm flex flex-col justify-between">
                  <div>
                    <h2 className="text-base font-bold text-slate-900 dark:text-white font-display">
                      Typing Mode Distribution
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Total test executions distributed across Timed, Words, Daily Challenge, and Code modes.
                    </p>
                  </div>

                  <div className="h-64 w-full my-3 flex items-center justify-center">
                    {isModeEmpty ? (
                      <div className="text-center text-slate-400">
                        <Zap size={32} className="mx-auto mb-2 opacity-40 text-purple-500" />
                        <p className="text-xs font-medium">No tests recorded in this timeframe</p>
                      </div>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={data.modeDistribution || []}
                          layout="vertical"
                          margin={{ top: 10, right: 20, left: 40, bottom: 0 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} horizontal={false} />
                          <XAxis type="number" stroke={textColor} fontSize={11} tickLine={false} />
                          <YAxis
                            dataKey="mode"
                            type="category"
                            stroke={textColor}
                            fontSize={11}
                            tickLine={false}
                          />
                          <Tooltip
                            formatter={(val, name, item) => [
                              `${(item.payload.tests || 0).toLocaleString()} tests (${val}%)`,
                              'Execution Volume',
                            ]}
                            contentStyle={{
                              backgroundColor: tooltipBg,
                              borderColor: tooltipBorder,
                              borderRadius: '12px',
                              fontSize: '12px',
                            }}
                          />
                          <Bar dataKey="share" radius={[0, 8, 8, 0]}>
                            {(data.modeDistribution || []).map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color || '#8B5CF6'} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100 dark:border-slate-800 text-center text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">
                        Top Mode
                      </span>
                      <p className="font-bold text-purple-600 dark:text-purple-400 truncate">
                        {data.modeDistribution?.[0]
                          ? `${data.modeDistribution[0].mode} (${data.modeDistribution[0].share}%)`
                          : 'No data'}
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">
                        Contests
                      </span>
                      <p className="font-bold text-emerald-600 dark:text-emerald-400 truncate">
                        {(() => {
                          const item = data.modeDistribution?.find((m) =>
                            m.mode.toLowerCase().includes('challenge') || m.mode.toLowerCase().includes('contest')
                          );
                          return item ? `${item.mode} (${item.share}%)` : 'No data';
                        })()}
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">
                        Code Syntax
                      </span>
                      <p className="font-bold text-pink-600 dark:text-pink-400 truncate">
                        {(() => {
                          const item = data.modeDistribution?.find((m) =>
                            m.mode.toLowerCase().includes('code')
                          );
                          return item ? `${item.mode} (${item.share}%)` : 'No data';
                        })()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Precision & Accuracy Distribution */}
                <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-sm flex flex-col justify-between">
                  <div>
                    <h2 className="text-base font-bold text-slate-900 dark:text-white font-display">
                      Keystroke Accuracy Distribution
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Precision tiers across all verified community test runs.
                    </p>
                  </div>

                  <div className="h-64 w-full flex items-center justify-center my-3">
                    {isAccEmpty ? (
                      <div className="text-center text-slate-400">
                        <Target size={32} className="mx-auto mb-2 opacity-40 text-purple-500" />
                        <p className="text-xs font-medium">No accuracy test sessions recorded in this timeframe</p>
                      </div>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={data.accuracyDistribution || []}
                            dataKey="percentage"
                            nameKey="range"
                            cx="50%"
                            cy="50%"
                            innerRadius={55}
                            outerRadius={85}
                            paddingAngle={4}
                          >
                            {(data.accuracyDistribution || []).map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.fill || '#8B5CF6'} />
                            ))}
                          </Pie>
                          <Tooltip
                            formatter={(val, name, item) => [
                              `${(item.payload.count || 0).toLocaleString()} sessions (${val}%)`,
                              item.payload.range,
                            ]}
                            contentStyle={{
                              backgroundColor: tooltipBg,
                              borderColor: tooltipBorder,
                              borderRadius: '12px',
                              fontSize: '12px',
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    )}
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-slate-100 dark:border-slate-800 text-center text-xs">
                    {(data.accuracyDistribution || []).map((item) => (
                      <div key={item.range}>
                        <span className="text-[10px] text-slate-400 uppercase font-semibold block truncate">
                          {item.range.split(' ')[0]}
                        </span>
                        <p className="font-bold text-slate-900 dark:text-white mt-0.5">
                          {item.percentage}%
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── 5. TAB 2: CONCURRENCY & PLATFORM USAGE (IST) ── */}
          {activeTab === 'traffic' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Hourly Traffic Bar Chart in Indian Standard Time (2 cols) */}
              <div className="lg:col-span-2 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-display">
                      Active Typist Concurrency by Hour (IST)
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Real-time concurrency distribution across 24-hour cycles in Indian Standard Time (UTC+5:30).
                    </p>
                  </div>
                  <span className="hidden sm:inline-block px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-500/20">
                    Peak: {Math.max(0, ...(data.hourlyActivity || []).map((h) => h.users || 0)).toLocaleString()} Users
                  </span>
                </div>

                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={data.hourlyActivity || []}
                      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                      <XAxis dataKey="hour" stroke={textColor} fontSize={11} tickLine={false} />
                      <YAxis stroke={textColor} fontSize={11} tickLine={false} />
                      <Tooltip
                        formatter={(val) => [`${val.toLocaleString()} Active Users`, 'Typist Concurrency']}
                        contentStyle={{
                          backgroundColor: tooltipBg,
                          borderColor: tooltipBorder,
                          borderRadius: '12px',
                          fontSize: '12px',
                        }}
                      />
                      <Bar dataKey="users" fill="#8B5CF6" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Browser / Client Platform Distribution (1 col) */}
              <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-display">
                    Client Platform Split
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Operating environment & browser distributions across typists.
                  </p>
                </div>

                <div className="h-56 w-full flex items-center justify-center my-auto">
                  {isDeviceEmpty ? (
                    <div className="text-center text-slate-400">
                      <Laptop size={32} className="mx-auto mb-2 opacity-40 text-purple-500" />
                      <p className="text-xs font-medium">No client platform data recorded yet</p>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={data.deviceBreakdown || []}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={80}
                          paddingAngle={3}
                        >
                          {(data.deviceBreakdown || []).map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color || '#8B5CF6'} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(val) => [`${val}% of typists`, 'Platform Share']}
                          contentStyle={{
                            backgroundColor: tooltipBg,
                            borderColor: tooltipBorder,
                            borderRadius: '12px',
                            fontSize: '12px',
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </div>

                <div className="space-y-1.5 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                  {(data.deviceBreakdown || []).map((dev) => (
                    <div key={dev.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: dev.color }} />
                        <span className="text-slate-600 dark:text-slate-300 font-medium">{dev.name}</span>
                      </div>
                      <span className="font-bold text-slate-900 dark:text-white">{dev.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── 6. TAB 3: CURRICULUM RETENTION FUNNEL ── */}
          {activeTab === 'curriculum' && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-sm">
                <div className="mb-6">
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-display">
                    Curriculum Retention Funnel
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Monitoring student progress from Lesson 1 (Home Row basics) through advanced mastery.
                  </p>
                </div>

                <div className="space-y-4">
                  {(data.lessonFunnel || []).map((item, idx) => (
                    <div
                      key={item.tier}
                      className="p-4 rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="h-6 w-6 grid place-items-center rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 font-mono font-bold text-xs">
                            {idx + 1}
                          </span>
                          <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                            {item.tier}
                          </h3>
                        </div>

                        <div className="flex items-center gap-4 text-xs font-semibold">
                          <span className="text-slate-500 dark:text-slate-400">
                            {(item.enrolled || 0).toLocaleString()} Enrolled
                          </span>
                          <span className="text-purple-600 dark:text-purple-400 font-bold">
                            {item.completion}% Completion
                          </span>
                        </div>
                      </div>

                      <div className="h-2 w-full bg-slate-200/60 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-purple-500 via-indigo-500 to-emerald-500 rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(100, Math.max(0, item.completion || 0))}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminAnalytics;
