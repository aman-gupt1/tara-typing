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
  ChevronLeft,
  ChevronRight,
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
      <div className="bg-card border border-border rounded-xl p-3 shadow-xl backdrop-blur-md text-xs text-foreground">
        <p className="font-semibold text-foreground mb-1.5">{label}</p>
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full bg-[#0066FF]" />
          <span className="text-muted-foreground">Speed:</span>
          <span className="font-bold text-foreground">{payload[0]?.value} WPM</span>
        </div>
        {payload[1] && (
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00E5A3]" />
            <span className="text-muted-foreground">Accuracy:</span>
            <span className="font-bold text-foreground">{payload[1]?.value}%</span>
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

  // Complete Test History Table Pagination
  const [historyPage, setHistoryPage] = useState(1);
  const historyPerPage = 10;
  const totalHistoryPages = Math.max(1, Math.ceil(recentActivityList.length / historyPerPage));

  const paginatedActivityList = useMemo(() => {
    const start = (historyPage - 1) * historyPerPage;
    return recentActivityList.slice(start, start + historyPerPage);
  }, [recentActivityList, historyPage]);

  // Reset to page 1 if total records change significantly
  useEffect(() => {
    if (historyPage > totalHistoryPages) {
      setHistoryPage(1);
    }
  }, [recentActivityList.length, totalHistoryPages, historyPage]);

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
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <p className="text-muted-foreground text-sm font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-200">
      <SEO
        title={`${p.name || user?.name || 'User'} (@${p.username || user?.username || 'user'}) - Profile | Tara Typing`}
        description={`Typing profile and performance statistics for ${p.name || user?.name || 'User'}`}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* ================= TOP PROFILE HEADER CARD ================= */}
        <section className="group/header bg-card border border-border rounded-2xl p-6 lg:p-7 backdrop-blur-md relative overflow-hidden shadow-sm transition-all duration-300 hover:border-indigo-500/40 hover:shadow-lg hover:shadow-indigo-500/10">
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
                  className="absolute bottom-0 right-0 p-1.5 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-md transition-colors border-2 border-card cursor-pointer"
                  title="Edit Profile"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
                    {p.name || user?.name || 'Typist'}
                  </h1>
                  <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-semibold bg-primary/15 text-primary border border-primary/30">
                    <Sparkles className="w-3 h-3 text-primary" />
                    Typing Enthusiast
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-muted-foreground font-medium">
                  @{p.username || user?.username || 'typist'}
                </p>

                <p className="text-xs sm:text-sm text-foreground/90 max-w-xl line-clamp-2 pt-0.5 leading-relaxed">
                  {p.bio || 'Passionate typist striving for higher speed and accuracy.'}
                </p>

                {/* Location, Joined Date & Streak metadata */}
                <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-2 text-xs font-medium text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                    <span>{p.location || 'Not specified'}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                    <span>{joinedDate}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-orange-500 font-semibold">
                    <Flame className="w-3.5 h-3.5 fill-orange-500 shrink-0" />
                    <span>{p.currentStreak || 0} day streak</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Motivational Quote Box & Action Buttons */}
            <div className="flex flex-col sm:flex-row lg:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto shrink-0 justify-end">
              {/* Quote Card */}
              <div className="group/quote hidden sm:flex items-start gap-3 bg-muted/40 border border-border rounded-xl p-3.5 max-w-xs shadow-xs transition-all duration-300 hover:border-primary/50 hover:bg-muted/70 cursor-default">
                <div className="p-1.5 rounded-lg bg-primary/10 text-primary shrink-0 mt-0.5 transition-all duration-300 group-hover/quote:scale-110">
                  <Quote className="w-4 h-4 fill-primary/20" />
                </div>
                <div className="text-left">
                  <p className="text-xs text-foreground/90 italic leading-relaxed">
                    "Small steps every day lead to big results."
                  </p>
                  <p className="text-[11px] font-bold text-primary mt-1 transition-colors">
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
                  className="p-2.5 rounded-xl bg-muted hover:bg-accent border border-border text-foreground transition-all shadow-sm cursor-pointer"
                  title="Share Profile"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(true)}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-semibold transition-all shadow-sm cursor-pointer"
                >
                  <Pencil className="w-4 h-4" />
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
                className="group relative bg-card border border-border rounded-2xl p-3.5 sm:p-4 flex items-center gap-3.5 sm:gap-4 backdrop-blur-sm transition-all duration-300 ease-out cursor-default hover:-translate-y-1.5 shadow-sm hover:border-primary/40 hover:shadow-md"
              >
                <div
                  className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shrink-0 ${card.iconBg} ${card.iconColor} transition-all duration-300 ${card.iconHover}`}
                >
                  <Icon className={`w-5 h-5 ${card.solid ? 'fill-current' : ''}`} />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-xl sm:text-2xl font-bold text-foreground tracking-tight leading-tight transition-colors duration-200">
                    {card.value}
                  </span>
                  <span className="text-xs sm:text-[13px] text-muted-foreground font-medium mt-1 truncate transition-colors duration-200 group-hover:text-foreground">
                    {card.label}
                  </span>
                  {card.subtext && (
                    <span className="text-[10px] text-muted-foreground/80 truncate leading-tight mt-0.5 transition-colors duration-200" title={card.subtext}>
                      {card.subtext}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </section>

        {/* ================= TAB NAVIGATION ================= */}
        <div className="border-b border-border">
          <nav className="flex items-center gap-8 overflow-x-auto no-scrollbar" aria-label="Profile navigation">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`pb-3.5 text-sm font-semibold transition-all relative whitespace-nowrap cursor-pointer ${
                    isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {tab.label}
                  {isActive && (
                    <motion.div
                      layoutId="profileTabHighlight"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full shadow-sm"
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
              <div className="group/chart bg-card border border-border rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col justify-between backdrop-blur-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg">
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2.5 pb-2">
                    <div className="flex items-start gap-2.5">
                      <div className="mt-0.5 shrink-0 text-primary transition-all duration-300 group-hover/chart:scale-110">
                        <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="currentColor">
                          <rect x="3" y="11" width="4" height="10" rx="1.5" />
                          <rect x="10" y="4" width="4" height="17" rx="1.5" />
                          <rect x="17" y="8" width="4" height="13" rx="1.5" />
                        </svg>
                      </div>
                      <div>
                        <h2 className="text-sm sm:text-base font-bold text-foreground tracking-tight transition-colors duration-200">
                          Progress Overview
                        </h2>
                        <p className="text-[11px] text-muted-foreground mt-0.5">
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
                          className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-muted/70 border border-border text-[11px] font-medium text-foreground hover:bg-muted transition-colors cursor-pointer"
                        >
                          <span>{timeframe === '7d' ? 'Last 7 Days' : timeframe === '90d' ? 'Last 90 Days' : 'Last 30 Days'}</span>
                          <ChevronDown className="w-3 h-3 text-muted-foreground" />
                        </button>
                        {isTimeframeOpen && (
                          <div className="absolute right-0 mt-1 w-32 bg-card border border-border rounded-xl shadow-xl py-1 z-30">
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
                                className={`w-full text-left px-3 py-1 text-xs transition-colors cursor-pointer ${
                                  timeframe === opt.id
                                    ? 'text-primary font-semibold bg-primary/10'
                                    : 'text-foreground hover:bg-muted'
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
                          <span className="text-muted-foreground">WPM</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-[#00E5A3]" />
                          <span className="text-muted-foreground">Accuracy (%)</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Recharts Area Chart */}
                  <div className="w-full h-48 pt-1">
                    {isTrendsLoading ? (
                      <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                        <div className="w-6 h-6 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
                        <span className="text-xs text-muted-foreground font-medium">Loading trends...</span>
                      </div>
                    ) : chartData.length === 0 ? (
                      <div className="w-full h-full flex flex-col items-center justify-center text-center p-4 border border-dashed border-border rounded-xl">
                        <TrendingUp className="w-7 h-7 text-muted-foreground mb-1.5" />
                        <p className="text-xs font-semibold text-foreground">No typing trend data for this period</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">Complete a typing test to see your progress chart!</p>
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
                          <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-border" opacity={0.6} vertical={false} />
                          <XAxis
                            dataKey="date"
                            stroke="currentColor"
                            className="text-muted-foreground"
                            tick={{ fontSize: 10, fill: 'currentColor' }}
                            axisLine={false}
                            tickLine={false}
                          />
                          <YAxis
                            stroke="currentColor"
                            className="text-muted-foreground"
                            domain={[0, 120]}
                            ticks={[0, 30, 60, 90, 120]}
                            tick={{ fontSize: 10, fill: 'currentColor' }}
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
              <div className="group/milestone bg-card border border-border rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col justify-between backdrop-blur-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:border-amber-500/50 hover:shadow-lg">
                <div>
                  <div className="flex items-center justify-between pb-2">
                    <div className="flex items-center gap-2">
                      <Trophy className="w-4.5 h-4.5 text-amber-500 fill-amber-500/20 shrink-0 transition-all duration-300 group-hover/milestone:scale-110" />
                      <div>
                        <h2 className="text-sm sm:text-base font-bold text-foreground tracking-tight">
                          Achievements
                        </h2>
                        <p className="text-[11px] text-muted-foreground mt-0.5">
                          Milestones on your typing journey
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTab('achievements')}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary/80 transition-colors cursor-pointer"
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
                      const strokeColor = isUnlocked ? item.activeStroke : '#94a3b8';
                      const iconColor = isUnlocked ? item.activeColor : 'text-muted-foreground';

                      return (
                        <div
                          key={item.id}
                          className="group/badge flex flex-col items-center cursor-pointer w-full transition-transform duration-200 hover:-translate-y-1"
                          title={isUnlocked ? 'Unlocked!' : 'Locked'}
                        >
                          <div className="relative w-12 h-12 sm:w-13 sm:h-13 flex items-center justify-center transition-transform duration-200 group-hover/badge:scale-110">
                            <svg viewBox="0 0 100 115" className="w-full h-full drop-shadow-sm transition-all duration-200">
                              <polygon
                                points="50,4 94,28 94,86 50,110 6,86 6,28"
                                className="fill-muted/60"
                                stroke={strokeColor}
                                strokeWidth="4"
                                strokeLinejoin="round"
                              />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${iconColor} ${isUnlocked && item.solid ? 'fill-current' : ''}`} />
                            </div>
                          </div>

                          <span className={`text-[11px] sm:text-xs font-bold text-center mt-1.5 whitespace-nowrap transition-colors ${isUnlocked ? 'text-foreground font-semibold' : 'text-muted-foreground'}`}>
                            {item.title}
                          </span>
                          <span className="text-[10px] text-muted-foreground text-center mt-0.5 leading-tight max-w-[80px]">
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
              className="bg-card border border-border rounded-2xl p-6 shadow-sm transition-all duration-300 hover:border-purple-500/40 hover:shadow-lg"
            >
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
                <div>
                  <h2 className="text-xl font-bold text-foreground">All Achievements</h2>
                  <p className="text-xs text-muted-foreground mt-1">Unlock badges and showcase your typing milestones</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-primary/15 text-primary border border-primary/30 text-xs font-semibold">
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
              className="bg-card border border-border rounded-2xl p-6 shadow-sm transition-all duration-300 hover:border-cyan-500/40 hover:shadow-lg"
            >
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
                <div>
                  <h2 className="text-xl font-bold text-foreground">Complete Test History</h2>
                  <p className="text-xs text-muted-foreground mt-1">Detailed logs of all your typing sessions</p>
                </div>
                {recentActivityList.length > 0 && (
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-muted text-foreground border border-border">
                    {recentActivityList.length} tests recorded
                  </span>
                )}
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="text-muted-foreground font-semibold border-b border-border">
                      <th className="py-3 px-3">Date</th>
                      <th className="py-3 px-3">Test Mode</th>
                      <th className="py-3 px-3">Duration</th>
                      <th className="py-3 px-3">Speed (WPM)</th>
                      <th className="py-3 px-3">Accuracy</th>
                      <th className="py-3 px-3 text-right">Result</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {recentActivityList.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-muted-foreground">
                          <div className="flex flex-col items-center justify-center gap-2">
                            <FileText className="w-8 h-8 text-muted-foreground" />
                            <span className="text-sm font-medium text-foreground">No typing tests yet</span>
                            <span className="text-xs text-muted-foreground">Take a typing test to see your performance history!</span>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      paginatedActivityList.map((row, index) => (
                        <tr key={`${row.id}-${index}`} className="hover:bg-muted/40 transition-colors">
                          <td className="py-3.5 px-3 text-foreground font-medium whitespace-nowrap">
                            {row.date}
                          </td>
                          <td className="py-3.5 px-3 text-muted-foreground whitespace-nowrap">
                            {row.type}
                          </td>
                          <td className="py-3.5 px-3 text-muted-foreground whitespace-nowrap">
                            {row.duration}
                          </td>
                          <td className="py-3.5 px-3 font-bold text-foreground whitespace-nowrap">
                            {row.wpm} WPM
                          </td>
                          <td className="py-3.5 px-3 text-emerald-500 font-semibold whitespace-nowrap">
                            {row.accuracy}
                          </td>
                          <td className="py-3.5 px-3 text-right whitespace-nowrap">
                            <span
                              className={`px-2.5 py-0.5 rounded-md text-[11px] font-semibold border ${
                                row.result === 'Great'
                                  ? 'bg-emerald-500/15 text-emerald-500 border-emerald-500/30'
                                  : row.result === 'Good'
                                  ? 'bg-blue-500/15 text-blue-500 border-blue-500/30'
                                  : 'bg-amber-500/15 text-amber-500 border-amber-500/30'
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

              {/* Table Pagination Footer */}
              {recentActivityList.length > historyPerPage && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 mt-4 border-t border-border text-xs text-muted-foreground">
                  <div>
                    Showing <span className="font-semibold text-foreground">{(historyPage - 1) * historyPerPage + 1}</span> to{' '}
                    <span className="font-semibold text-foreground">
                      {Math.min(historyPage * historyPerPage, recentActivityList.length)}
                    </span>{' '}
                    of <span className="font-semibold text-foreground">{recentActivityList.length}</span> tests
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      disabled={historyPage === 1}
                      onClick={() => setHistoryPage((p) => Math.max(1, p - 1))}
                      className="p-1.5 rounded-lg border border-border bg-card text-foreground hover:bg-muted disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
                      title="Previous Page"
                    >
                      <ChevronLeft size={14} />
                    </button>

                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalHistoryPages }, (_, i) => i + 1)
                        .filter((pNum) => {
                          if (totalHistoryPages <= 5) return true;
                          return Math.abs(pNum - historyPage) <= 1 || pNum === 1 || pNum === totalHistoryPages;
                        })
                        .map((pNum, idx, arr) => {
                          const prev = arr[idx - 1];
                          const showEllipsis = prev && pNum - prev > 1;
                          return (
                            <div key={pNum} className="flex items-center">
                              {showEllipsis && <span className="px-1 text-muted-foreground text-xs">...</span>}
                              <button
                                type="button"
                                onClick={() => setHistoryPage(pNum)}
                                className={`h-7 min-w-[28px] px-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                                  historyPage === pNum
                                    ? 'bg-primary text-primary-foreground shadow-sm'
                                    : 'border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted'
                                }`}
                              >
                                {pNum}
                              </button>
                            </div>
                          );
                        })}
                    </div>

                    <button
                      type="button"
                      disabled={historyPage === totalHistoryPages}
                      onClick={() => setHistoryPage((p) => Math.min(totalHistoryPages, p + 1))}
                      className="p-1.5 rounded-lg border border-border bg-card text-foreground hover:bg-muted disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
                      title="Next Page"
                    >
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              )}
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
