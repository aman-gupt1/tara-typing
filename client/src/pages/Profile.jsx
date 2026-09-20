import { useState, useEffect, useMemo } from 'react';
import {
  Pencil,
  MapPin,
  Calendar,
  Flame,
  Quote,
  Zap,
  BarChart2,
  Target,
  FileText,
  Trophy,
  Lock,
  ChevronDown,
  ArrowRight,
  Share2,
  TrendingUp,
  Check,
  Sparkles,
  Award,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { toast } from 'react-toastify';
import SEO from '../components/common/SEO';
import { useAuth } from '../context/AuthContext';
import { profileService } from '../services/profileService';
import { typingService } from '../services/typingService';
import { achievementService } from '../services/achievementService';
import EditProfileModal from '../components/profile/EditProfileModal';
import AchievementsGrid from '../components/profile/AchievementsGrid';
import UserAvatar from '../components/common/UserAvatar';

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'achievements', label: 'Achievements' },
  { id: 'history', label: 'History' },
];

const MILESTONE_HEX_ACHIEVEMENTS = [
  {
    id: 'first-test',
    aliasKeys: ['first-test'],
    title: 'First Test',
    description: 'Completed your first test',
    icon: Zap,
    activeStroke: '#10B981',
    activeColor: 'text-emerald-400',
    solid: true,
  },
  {
    id: 'speed-50',
    aliasKeys: ['speed-50'],
    title: '50 WPM',
    description: 'Reached 50 WPM',
    icon: Trophy,
    activeStroke: '#0066FF',
    activeColor: 'text-blue-400',
    solid: false,
  },
  {
    id: 'accuracy-95',
    aliasKeys: ['accuracy-95', 'acc-90'],
    title: '95% Accuracy',
    description: 'Achieved 95% accuracy',
    icon: Target,
    activeStroke: '#A855F7',
    activeColor: 'text-purple-400',
    solid: false,
  },
  {
    id: 'streak-7',
    aliasKeys: ['streak-7'],
    title: '7 Day Streak',
    description: 'Typed for 7 consecutive days',
    icon: Flame,
    activeStroke: '#F97316',
    activeColor: 'text-orange-400',
    solid: true,
  },
  {
    id: 'speed-100',
    aliasKeys: ['speed-100', 'century-100'],
    title: '100 WPM',
    description: 'Reach 100 WPM',
    icon: Award,
    activeStroke: '#EC4899',
    activeColor: 'text-pink-400',
    solid: false,
  },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900/95 border border-slate-700/80 rounded-xl p-3 shadow-xl backdrop-blur-md text-xs">
        <p className="font-semibold text-slate-300 mb-1.5">{label}</p>
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full bg-[#0066FF]" />
          <span className="text-slate-400">Speed:</span>
          <span className="font-bold text-white">{payload[0]?.value} WPM</span>
        </div>
        {payload[1] && (
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00E5A3]" />
            <span className="text-slate-400">Accuracy:</span>
            <span className="font-bold text-white">{payload[1]?.value}%</span>
          </div>
        )}
      </div>
    );
  }
  return null;
};

export const Profile = () => {
  const { user, updateUser } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [rankData, setRankData] = useState(null);
  const [achievementsList, setAchievementsList] = useState([]);
  const [localHistory, setLocalHistory] = useState([]);
  const [trendsData, setTrendsData] = useState([]);
  const [isTrendsLoading, setIsTrendsLoading] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [timeframe, setTimeframe] = useState('30d');
  const [isTimeframeOpen, setIsTimeframeOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Initial load of all profile-related data
  useEffect(() => {
    let isMounted = true;
    const fetchProfile = async () => {
      try {
        const [profileRes, statsRes, historyRes, achsRes, rankRes] = await Promise.allSettled([
          profileService.getProfile(),
          profileService.getUserStats(),
          typingService.getRecentResults(),
          achievementService.getUserAchievements(),
          profileService.getProfileRank(),
        ]);

        if (!isMounted) return;

        const profileVal = profileRes.status === 'fulfilled' ? profileRes.value : null;
        const statsVal = statsRes.status === 'fulfilled' ? statsRes.value : null;
        const historyVal = historyRes.status === 'fulfilled' && Array.isArray(historyRes.value) ? historyRes.value : [];
        const achsVal = achsRes.status === 'fulfilled' && Array.isArray(achsRes.value) ? achsRes.value : [];
        const rankVal = rankRes.status === 'fulfilled' ? rankRes.value : null;

        const merged = {
          ...(user || {}),
          ...(profileVal || {}),
          ...(statsVal || {}),
          achievements: achsVal.length > 0 ? achsVal : (statsVal?.achievements || user?.achievements || []),
        };

        setProfileData(merged);
        setLocalHistory(historyVal);
        setAchievementsList(achsVal);
        if (rankVal) {
          setRankData(rankVal);
        }
      } catch (err) {
        console.error('Failed to fetch profile data:', err);
        toast.error('Unable to load profile data');
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProfile();

    return () => {
      isMounted = false;
    };
  }, [user]);

  // Fetch dynamic typing trends whenever the timeframe changes
  useEffect(() => {
    let isMounted = true;
    const fetchTrends = async () => {
      setIsTrendsLoading(true);
      try {
        const days = timeframe === '7d' ? 7 : timeframe === '90d' ? 90 : 30;
        const trends = await typingService.getTypingTrends(days);
        if (isMounted) {
          setTrendsData(Array.isArray(trends) ? trends : []);
        }
      } catch (err) {
        console.error('Failed to fetch typing trends:', err);
      } finally {
        if (isMounted) {
          setIsTrendsLoading(false);
        }
      }
    };

    fetchTrends();

    return () => {
      isMounted = false;
    };
  }, [timeframe]);

  const handleSaveProfile = async (updatedData) => {
    try {
      const res = await profileService.updateProfile(updatedData);
      const updatedUser = res?.user || res || updatedData;
      setProfileData((prev) => ({ ...prev, ...updatedUser }));
      if (updateUser) {
        updateUser(updatedUser);
      }
      toast.success('Profile updated successfully!');
      setIsEditModalOpen(false);
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || err?.message || 'Failed to update profile');
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    toast.success('Profile link copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const p = profileData || user || {};

  // Formatted joined date
  const joinedDate = useMemo(() => {
    const dateVal = p.createdAt || user?.createdAt;
    if (dateVal) {
      const d = new Date(dateVal);
      if (!isNaN(d.getTime())) {
        return `Joined ${d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`;
      }
    }
    return 'Joined recently';
  }, [p.createdAt, user?.createdAt]);

  // Dynamic chart data from backend trends, fallback to recent history if no trend records yet
  const chartData = useMemo(() => {
    if (trendsData && trendsData.length > 0) {
      return trendsData.map((item, idx) => {
        const d = item.date ? new Date(item.date) : null;
        const dateLabel = d && !isNaN(d.getTime())
          ? d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
          : `Day ${idx + 1}`;
        return {
          date: dateLabel,
          wpm: Math.round(item.wpm || 0),
          accuracy: Math.round(item.accuracy || 100),
        };
      });
    }

    if (localHistory && localHistory.length > 0) {
      return [...localHistory].reverse().map((item, idx) => {
        const d = item.createdAt ? new Date(item.createdAt) : null;
        const dateLabel = d && !isNaN(d.getTime())
          ? d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
          : `Test ${idx + 1}`;
        return {
          date: dateLabel,
          wpm: Math.round(item.wpm || item.netWpm || 0),
          accuracy: Math.round(item.accuracy || 100),
        };
      });
    }

    return [];
  }, [trendsData, localHistory]);

  // Dynamic recent activity list
  const recentActivityList = useMemo(() => {
    if (!Array.isArray(localHistory) || localHistory.length === 0) {
      return [];
    }
    return localHistory.map((item, idx) => {
      const d = item.createdAt ? new Date(item.createdAt) : null;
      const dateStr = d && !isNaN(d.getTime())
        ? d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        : 'Recent';
      const wpmVal = Math.round(item.wpm || item.netWpm || 0);
      const accVal = Math.round(item.accuracy || 0);
      let resultLabel = 'Good';
      if (wpmVal >= 70 && accVal >= 95) resultLabel = 'Great';
      else if (wpmVal < 50 || accVal < 90) resultLabel = 'Nice';

      return {
        id: item._id || item.id || idx,
        date: dateStr,
        type: item.mode ? `${item.mode.charAt(0).toUpperCase() + item.mode.slice(1)}` : 'Words',
        duration: `${item.duration || 30}s`,
        wpm: wpmVal,
        accuracy: `${accVal}%`,
        result: resultLabel,
      };
    });
  }, [localHistory]);

  // Set of unlocked achievement keys
  const unlockedAchievementKeys = useMemo(() => {
    const list = achievementsList.length > 0 ? achievementsList : (p.achievements || []);
    return new Set(
      list
        .filter((a) => {
          if (typeof a === 'string') return true;
          if (typeof a?.unlocked === 'boolean') return a.unlocked;
          return Boolean(a?.key);
        })
        .map((a) => (typeof a === 'string' ? a : a?.key))
        .filter(Boolean)
    );
  }, [achievementsList, p.achievements]);

  const statCards = [
    {
      id: 'bestWpm',
      label: 'Best WPM',
      value: p.bestWpm || 0,
      icon: Zap,
      iconColor: 'text-emerald-400',
      iconBg: 'bg-emerald-500/15',
      solid: true,
      hoverBorder: 'hover:border-emerald-500/50',
      hoverShadow: 'hover:shadow-[0_12px_28px_-6px_rgba(16,185,129,0.28)]',
      hoverBg: 'hover:bg-gradient-to-b hover:from-[#09221C] hover:to-[#0B132B]/80',
      iconHover: 'group-hover:scale-110 group-hover:bg-emerald-500/25 group-hover:text-emerald-300 group-hover:shadow-[0_0_12px_rgba(16,185,129,0.35)]',
      textHover: 'group-hover:text-emerald-300',
    },
    {
      id: 'averageWpm',
      label: 'Average WPM',
      value: p.averageWpm || 0,
      icon: BarChart2,
      iconColor: 'text-blue-400',
      iconBg: 'bg-blue-500/15',
      hoverBorder: 'hover:border-blue-500/50',
      hoverShadow: 'hover:shadow-[0_12px_28px_-6px_rgba(59,130,246,0.28)]',
      hoverBg: 'hover:bg-gradient-to-b hover:from-[#081530] hover:to-[#0B132B]/80',
      iconHover: 'group-hover:scale-110 group-hover:bg-blue-500/25 group-hover:text-blue-300 group-hover:shadow-[0_0_12px_rgba(59,130,246,0.35)]',
      textHover: 'group-hover:text-blue-300',
    },
    {
      id: 'accuracy',
      label: 'Best Accuracy',
      value: `${p.accuracy || 0}%`,
      icon: Target,
      iconColor: 'text-purple-400',
      iconBg: 'bg-purple-500/15',
      hoverBorder: 'hover:border-purple-500/50',
      hoverShadow: 'hover:shadow-[0_12px_28px_-6px_rgba(168,85,247,0.28)]',
      hoverBg: 'hover:bg-gradient-to-b hover:from-[#150F2E] hover:to-[#0B132B]/80',
      iconHover: 'group-hover:scale-110 group-hover:bg-purple-500/25 group-hover:text-purple-300 group-hover:shadow-[0_0_12px_rgba(168,85,247,0.35)]',
      textHover: 'group-hover:text-purple-300',
    },
    {
      id: 'testsCompleted',
      label: 'Test Completed',
      value: p.testsCompleted || 0,
      icon: FileText,
      iconColor: 'text-rose-400',
      iconBg: 'bg-rose-500/15',
      hoverBorder: 'hover:border-rose-500/50',
      hoverShadow: 'hover:shadow-[0_12px_28px_-6px_rgba(244,63,94,0.28)]',
      hoverBg: 'hover:bg-gradient-to-b hover:from-[#280C16] hover:to-[#0B132B]/80',
      iconHover: 'group-hover:scale-110 group-hover:bg-rose-500/25 group-hover:text-rose-300 group-hover:shadow-[0_0_12px_rgba(244,63,94,0.35)]',
      textHover: 'group-hover:text-rose-300',
    },
    {
      id: 'streak',
      label: 'Current Streak',
      value: p.currentStreak || 0,
      icon: Flame,
      iconColor: 'text-orange-400',
      iconBg: 'bg-orange-500/15',
      solid: true,
      hoverBorder: 'hover:border-orange-500/50',
      hoverShadow: 'hover:shadow-[0_12px_28px_-6px_rgba(249,115,22,0.28)]',
      hoverBg: 'hover:bg-gradient-to-b hover:from-[#281308] hover:to-[#0B132B]/80',
      iconHover: 'group-hover:scale-110 group-hover:bg-orange-500/25 group-hover:text-orange-300 group-hover:shadow-[0_0_12px_rgba(249,115,22,0.35)]',
      textHover: 'group-hover:text-orange-300',
    },
    {
      id: 'rank',
      label: 'Global Rank',
      value: rankData?.hasResult && rankData?.rank ? `#${rankData.rank}` : '--',
      subtext: rankData?.hasResult
        ? (rankData.totalUsers ? `of ${rankData.totalUsers} typists` : null)
        : 'Complete a test to get ranked',
      icon: Trophy,
      iconColor: 'text-amber-400',
      iconBg: 'bg-amber-500/15',
      hoverBorder: 'hover:border-amber-500/50',
      hoverShadow: 'hover:shadow-[0_12px_28px_-6px_rgba(245,158,11,0.28)]',
      hoverBg: 'hover:bg-gradient-to-b hover:from-[#221808] hover:to-[#0B132B]/80',
      iconHover: 'group-hover:scale-110 group-hover:bg-amber-500/25 group-hover:text-amber-300 group-hover:shadow-[0_0_12px_rgba(245,158,11,0.35)]',
      textHover: 'group-hover:text-amber-300',
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#07090E] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
          <p className="text-slate-400 text-sm font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07090E] text-white">
      <SEO
        title={`${p.name || user?.name || 'User'} (@${p.username || user?.username || 'user'}) - Profile | Tara Typing`}
        description={`Typing profile and performance statistics for ${p.name || user?.name || 'User'}`}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* ================= TOP PROFILE HEADER CARD ================= */}
        <section className="group/header bg-[#0D121F]/90 border border-slate-800/80 rounded-2xl p-6 lg:p-7 backdrop-blur-md relative overflow-hidden shadow-xl transition-all duration-300 hover:border-indigo-500/40 hover:shadow-[0_16px_40px_-10px_rgba(99,102,241,0.2)]">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            {/* Left: User Avatar & Details */}
            <div className="flex items-start sm:items-center gap-5">
              <div className="relative shrink-0">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full p-1 bg-gradient-to-tr from-blue-600 via-indigo-500 to-purple-500 shadow-lg">
                  <UserAvatar
                    src={p.avatar}
                    name={p.name || user?.name || 'Typist'}
                    username={p.username || user?.username || 'typist'}
                    className="w-full h-full rounded-full object-cover"
                    textClassName="text-2xl sm:text-3xl font-bold"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(true)}
                  aria-label="Edit Profile"
                  className="absolute bottom-0 right-0 p-1.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white shadow-md transition-colors border-2 border-[#0D121F]"
                  title="Edit Profile"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    {p.name || user?.name || 'Typist'}
                  </h1>
                  <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-semibold bg-blue-500/15 text-blue-400 border border-blue-500/30">
                    <Sparkles className="w-3 h-3 text-blue-400" />
                    Typing Enthusiast
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-400 font-medium">
                  @{p.username || user?.username || 'typist'}
                </p>

                <p className="text-xs sm:text-sm text-slate-300 max-w-xl line-clamp-2 pt-0.5 leading-relaxed">
                  {p.bio || 'Passionate typist striving for higher speed and accuracy.'}
                </p>

                {/* Location, Joined Date & Streak metadata */}
                <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-2 text-xs font-medium text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{p.location || 'Not specified'}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{joinedDate}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-orange-400 font-semibold">
                    <Flame className="w-3.5 h-3.5 fill-orange-400 shrink-0" />
                    <span>{p.currentStreak || 0} day streak</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Motivational Quote Box & Action Buttons */}
            <div className="flex flex-col sm:flex-row lg:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto shrink-0 justify-end">
              {/* Quote Card */}
              <div className="group/quote hidden sm:flex items-start gap-3 bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 max-w-xs shadow-inner transition-all duration-300 hover:border-blue-500/50 hover:shadow-[0_8px_20px_-4px_rgba(0,102,255,0.25)] hover:bg-slate-900/95 cursor-default">
                <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 shrink-0 mt-0.5 transition-all duration-300 group-hover/quote:scale-110 group-hover/quote:bg-blue-500/20 group-hover/quote:text-blue-300">
                  <Quote className="w-4 h-4 fill-blue-400/20" />
                </div>
                <div className="text-left">
                  <p className="text-xs text-slate-200 italic leading-relaxed">
                    "Small steps every day lead to big results."
                  </p>
                  <p className="text-[11px] font-bold text-[#0066FF] mt-1 transition-colors group-hover/quote:text-blue-400">
                    — Tara Typing
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyLink}
                  aria-label="Share Profile"
                  className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 text-slate-300 hover:text-white transition-all shadow-sm"
                  title="Share Profile"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(true)}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700/70 text-white text-sm font-semibold transition-all shadow-sm hover:border-slate-600"
                >
                  <Pencil className="w-4 h-4 text-slate-300" />
                  <span>Edit Profile</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ================= 6 STAT METRIC CARDS ================= */}
        <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
          {statCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                className={`group relative bg-[#0B132B]/75 dark:bg-[#0D1424]/90 border border-slate-800/80 rounded-2xl p-3.5 sm:p-4 flex items-center gap-3.5 sm:gap-4 backdrop-blur-sm transition-all duration-300 ease-out cursor-default hover:-translate-y-1.5 shadow-sm ${card.hoverBorder} ${card.hoverShadow} ${card.hoverBg}`}
              >
                <div
                  className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shrink-0 ${card.iconBg} ${card.iconColor} transition-all duration-300 ${card.iconHover}`}
                >
                  <Icon className={`w-5 h-5 ${card.solid ? 'fill-current' : ''}`} />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className={`text-xl sm:text-2xl font-bold text-white tracking-tight leading-tight transition-colors duration-200 ${card.textHover}`}>
                    {card.value}
                  </span>
                  <span className="text-xs sm:text-[13px] text-slate-400 font-medium mt-1 truncate transition-colors duration-200 group-hover:text-slate-200">
                    {card.label}
                  </span>
                  {card.subtext && (
                    <span className="text-[10px] text-slate-500 truncate leading-tight mt-0.5 transition-colors duration-200 group-hover:text-slate-400" title={card.subtext}>
                      {card.subtext}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </section>

        {/* ================= TAB NAVIGATION ================= */}
        <div className="border-b border-slate-800/80">
          <nav className="flex items-center gap-8 overflow-x-auto no-scrollbar" aria-label="Profile navigation">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`pb-3.5 text-sm font-semibold transition-all relative whitespace-nowrap ${
                    isActive ? 'text-white' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {tab.label}
                  {isActive && (
                    <motion.div
                      layoutId="profileTabHighlight"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0066FF] rounded-full shadow-[0_0_12px_rgba(0,102,255,0.8)]"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* ================= TAB CONTENT ================= */}
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview-tab"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5"
            >
              {/* ================= TOP LEFT: Progress Overview Chart ================= */}
              <div className="group/chart bg-[#0B132B]/75 dark:bg-[#0D1424]/90 border border-slate-800/80 rounded-2xl p-4 sm:p-5 shadow-md flex flex-col justify-between backdrop-blur-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:border-blue-500/50 hover:shadow-[0_16px_36px_-6px_rgba(0,102,255,0.22)] hover:bg-gradient-to-b hover:from-[#081530] hover:to-[#0B132B]/80">
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2.5 pb-2">
                    <div className="flex items-start gap-2.5">
                      <div className="mt-0.5 shrink-0 text-[#0066FF] transition-all duration-300 group-hover/chart:scale-110 group-hover/chart:text-blue-400">
                        <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="currentColor">
                          <rect x="3" y="11" width="4" height="10" rx="1.5" />
                          <rect x="10" y="4" width="4" height="17" rx="1.5" />
                          <rect x="17" y="8" width="4" height="13" rx="1.5" />
                        </svg>
                      </div>
                      <div>
                        <h2 className="text-sm sm:text-base font-bold text-white tracking-tight transition-colors duration-200 group-hover/chart:text-blue-300">
                          Progress Overview
                        </h2>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Track your typing journey over time
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1.5">
                      {/* Timeframe Dropdown */}
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setIsTimeframeOpen(!isTimeframeOpen)}
                          className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-slate-800/80 border border-slate-700/60 text-[11px] font-medium text-slate-300 hover:text-white transition-colors"
                        >
                          <span>{timeframe === '7d' ? 'Last 7 Days' : timeframe === '90d' ? 'Last 90 Days' : 'Last 30 Days'}</span>
                          <ChevronDown className="w-3 h-3 text-slate-400" />
                        </button>
                        {isTimeframeOpen && (
                          <div className="absolute right-0 mt-1 w-32 bg-slate-900 border border-slate-700 rounded-xl shadow-xl py-1 z-30">
                            {[
                              { id: '7d', label: 'Last 7 Days' },
                              { id: '30d', label: 'Last 30 Days' },
                              { id: '90d', label: 'Last 90 Days' },
                            ].map((opt) => (
                              <button
                                key={opt.id}
                                type="button"
                                onClick={() => {
                                  setTimeframe(opt.id);
                                  setIsTimeframeOpen(false);
                                }}
                                className={`w-full text-left px-3 py-1 text-xs transition-colors ${
                                  timeframe === opt.id
                                    ? 'text-[#0066FF] font-semibold bg-blue-500/10'
                                    : 'text-slate-300 hover:bg-slate-800'
                                }`}
                              >
                                {opt.label}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Legend */}
                      <div className="flex items-center gap-2.5 text-[11px] font-medium">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-[#0066FF]" />
                          <span className="text-slate-300">WPM</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-[#00E5A3]" />
                          <span className="text-slate-300">Accuracy (%)</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Recharts Area Chart */}
                  <div className="w-full h-48 pt-1">
                    {isTrendsLoading ? (
                      <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                        <div className="w-6 h-6 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
                        <span className="text-xs text-slate-400 font-medium">Loading trends...</span>
                      </div>
                    ) : chartData.length === 0 ? (
                      <div className="w-full h-full flex flex-col items-center justify-center text-center p-4 border border-dashed border-slate-800 rounded-xl">
                        <TrendingUp className="w-7 h-7 text-slate-600 mb-1.5" />
                        <p className="text-xs font-semibold text-slate-400">No typing trend data for this period</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">Complete a typing test to see your progress chart!</p>
                      </div>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={chartData}
                          margin={{ top: 8, right: 8, left: -26, bottom: 0 }}
                        >
                          <defs>
                            <linearGradient id="colorWpm" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#0066FF" stopOpacity={0.35} />
                              <stop offset="95%" stopColor="#0066FF" stopOpacity={0.0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.6} vertical={false} />
                          <XAxis
                            dataKey="date"
                            stroke="#64748b"
                            tick={{ fontSize: 10, fill: '#64748b' }}
                            axisLine={false}
                            tickLine={false}
                          />
                          <YAxis
                            stroke="#64748b"
                            domain={[0, 120]}
                            ticks={[0, 30, 60, 90, 120]}
                            tick={{ fontSize: 10, fill: '#64748b' }}
                            axisLine={false}
                            tickLine={false}
                          />
                          <Tooltip content={<CustomTooltip />} />
                          <Area
                            type="monotone"
                            dataKey="wpm"
                            stroke="#0066FF"
                            strokeWidth={2}
                            dot={{ r: 3, fill: '#0066FF', stroke: '#0066FF', strokeWidth: 1 }}
                            activeDot={{ r: 4.5, fill: '#0066FF', stroke: '#ffffff', strokeWidth: 2 }}
                            fillOpacity={1}
                            fill="url(#colorWpm)"
                          />
                          <Area
                            type="monotone"
                            dataKey="accuracy"
                            stroke="#00E5A3"
                            strokeWidth={2}
                            dot={{ r: 3, fill: '#00E5A3', stroke: '#00E5A3', strokeWidth: 1 }}
                            activeDot={{ r: 4.5, fill: '#00E5A3', stroke: '#ffffff', strokeWidth: 2 }}
                            fillOpacity={0}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </div>
              </div>

              {/* ================= TOP RIGHT: Achievements Hexagonal Badges ================= */}
              <div className="group/milestone bg-[#0B132B]/75 dark:bg-[#0D1424]/90 border border-slate-800/80 rounded-2xl p-4 sm:p-5 shadow-md flex flex-col justify-between backdrop-blur-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:border-amber-500/50 hover:shadow-[0_16px_36px_-6px_rgba(245,158,11,0.22)] hover:bg-gradient-to-b hover:from-[#221808] hover:to-[#0B132B]/80">
                <div>
                  <div className="flex items-center justify-between pb-2">
                    <div className="flex items-center gap-2">
                      <Trophy className="w-4.5 h-4.5 text-amber-400 fill-amber-400/20 shrink-0 transition-all duration-300 group-hover/milestone:scale-110 group-hover/milestone:text-amber-300" />
                      <div>
                        <h2 className="text-sm sm:text-base font-bold text-white tracking-tight transition-colors duration-200 group-hover/milestone:text-amber-300">
                          Achievements
                        </h2>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Milestones on your typing journey
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTab('achievements')}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#0066FF] hover:text-blue-400 transition-colors"
                    >
                      <span>View All</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* 5 Hexagonal Badges Row */}
                  <div className="grid grid-cols-5 gap-1.5 sm:gap-2 items-start justify-items-center pt-3 pb-1">
                    {MILESTONE_HEX_ACHIEVEMENTS.map((item) => {
                      const isUnlocked = item.aliasKeys.some((k) => unlockedAchievementKeys.has(k));
                      const Icon = isUnlocked ? item.icon : Lock;
                      const strokeColor = isUnlocked ? item.activeStroke : '#334155';
                      const iconColor = isUnlocked ? item.activeColor : 'text-slate-500';

                      return (
                        <div
                          key={item.id}
                          className="group/badge flex flex-col items-center cursor-pointer w-full transition-transform duration-200 hover:-translate-y-1"
                          title={isUnlocked ? 'Unlocked!' : 'Locked'}
                        >
                          <div className="relative w-12 h-12 sm:w-13 sm:h-13 flex items-center justify-center transition-transform duration-200 group-hover/badge:scale-110">
                            <svg viewBox="0 0 100 115" className="w-full h-full drop-shadow-sm transition-all duration-200 group-hover/badge:drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]">
                              <polygon
                                points="50,4 94,28 94,86 50,110 6,86 6,28"
                                fill="#0B1220"
                                stroke={strokeColor}
                                strokeWidth="4"
                                strokeLinejoin="round"
                              />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${iconColor} ${isUnlocked && item.solid ? 'fill-current' : ''}`} />
                            </div>
                          </div>

                          <span className={`text-[11px] sm:text-xs font-bold text-center mt-1.5 whitespace-nowrap transition-colors ${isUnlocked ? 'text-white group-hover/badge:text-amber-300' : 'text-slate-400'}`}>
                            {item.title}
                          </span>
                          <span className="text-[10px] text-slate-500 text-center mt-0.5 leading-tight max-w-[80px]">
                            {item.description}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

            </motion.div>
          )}

          {activeTab === 'achievements' && (
            <motion.div
              key="achievements-tab"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
              className="bg-[#0D121F]/90 border border-slate-800/80 rounded-2xl p-6 shadow-md transition-all duration-300 hover:border-purple-500/40 hover:shadow-[0_16px_40px_-10px_rgba(168,85,247,0.2)]"
            >
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
                <div>
                  <h2 className="text-xl font-bold text-white">All Achievements</h2>
                  <p className="text-xs text-slate-400 mt-1">Unlock badges and showcase your typing milestones</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/30 text-xs font-semibold">
                    {unlockedAchievementKeys.size} unlocked
                  </span>
                </div>
              </div>
              <AchievementsGrid achievements={achievementsList.length > 0 ? achievementsList : (p.achievements || [])} />
            </motion.div>
          )}

          {activeTab === 'history' && (
            <motion.div
              key="history-tab"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
              className="bg-[#0D121F]/90 border border-slate-800/80 rounded-2xl p-6 shadow-md transition-all duration-300 hover:border-cyan-500/40 hover:shadow-[0_16px_40px_-10px_rgba(6,182,212,0.2)]"
            >
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
                <div>
                  <h2 className="text-xl font-bold text-white">Complete Test History</h2>
                  <p className="text-xs text-slate-400 mt-1">Detailed logs of all your typing sessions</p>
                </div>
                {recentActivityList.length > 0 && (
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                    {recentActivityList.length} tests recorded
                  </span>
                )}
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="text-slate-400 font-semibold border-b border-slate-800">
                      <th className="py-3 px-3">Date</th>
                      <th className="py-3 px-3">Test Mode</th>
                      <th className="py-3 px-3">Duration</th>
                      <th className="py-3 px-3">Speed (WPM)</th>
                      <th className="py-3 px-3">Accuracy</th>
                      <th className="py-3 px-3 text-right">Result</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/40">
                    {recentActivityList.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-slate-500">
                          <div className="flex flex-col items-center justify-center gap-2">
                            <FileText className="w-8 h-8 text-slate-600" />
                            <span className="text-sm font-medium text-slate-400">No typing tests yet</span>
                            <span className="text-xs text-slate-500">Take a typing test to see your performance history!</span>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      recentActivityList.map((row, index) => (
                        <tr key={`${row.id}-${index}`} className="hover:bg-slate-800/20 transition-colors">
                          <td className="py-3.5 px-3 text-slate-300 font-medium whitespace-nowrap">
                            {row.date}
                          </td>
                          <td className="py-3.5 px-3 text-slate-400 whitespace-nowrap">
                            {row.type}
                          </td>
                          <td className="py-3.5 px-3 text-slate-400 whitespace-nowrap">
                            {row.duration}
                          </td>
                          <td className="py-3.5 px-3 font-bold text-white whitespace-nowrap">
                            {row.wpm} WPM
                          </td>
                          <td className="py-3.5 px-3 text-emerald-400 font-semibold whitespace-nowrap">
                            {row.accuracy}
                          </td>
                          <td className="py-3.5 px-3 text-right whitespace-nowrap">
                            <span
                              className={`px-2.5 py-0.5 rounded-md text-[11px] font-semibold border ${
                                row.result === 'Great'
                                  ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                                  : row.result === 'Good'
                                  ? 'bg-blue-500/15 text-blue-400 border-blue-500/30'
                                  : 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                              }`}
                            >
                              {row.result}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        user={p}
        onSave={handleSaveProfile}
      />
    </div>
  );
};

export default Profile;
