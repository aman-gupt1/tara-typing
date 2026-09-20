import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Medal, Search, Trophy, Users, BarChart2, Star, ChevronLeft, ChevronRight,
  TrendingUp, Play, Crown, Keyboard, Globe2, Zap, RefreshCw, Sparkles,
} from 'lucide-react';
import SEO from '../components/common/SEO';
import { useAuth } from '../context/AuthContext';
import { leaderboardService } from '../services/leaderboardService';
import UserAvatar from '../components/common/UserAvatar';

/* ─── Constants ──────────────────────────────────────────────── */
const periods = [
  { id: 'today',   label: 'Today'      },
  { id: 'week',    label: 'This Week'  },
  { id: 'month',   label: 'This Month' },
  { id: 'allTime', label: 'All Time'   },
];

const durationOptions = [
  { id: 'all', label: 'All',   value: 'all' },
  { id: '15',  label: '15s',   value: 15    },
  { id: '30',  label: '30s',   value: 30    },
  { id: '60',  label: '60s',   value: 60    },
  { id: '120', label: '120s',  value: 120   },
];

/* ─── Default Showcase Top 3 Champions (from design reference) ─── */
const DEFAULT_TOP3 = [
  {
    rank: 1,
    name: 'max_type',
    username: 'max_type',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    country: 'India',
    flag: '🇮🇳',
    wpm: 154,
    accuracy: 99.4,
    tests: 312,
  },
  {
    rank: 2,
    name: 'speed_demon',
    username: 'speed_demon',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
    country: 'United States',
    flag: '🇺🇸',
    wpm: 148,
    accuracy: 98.9,
    tests: 231,
  },
  {
    rank: 3,
    name: 'key_master',
    username: 'key_master',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    country: 'United Kingdom',
    flag: '🇬🇧',
    wpm: 142,
    accuracy: 98.5,
    tests: 198,
  },
];

/* ─── 20 Realistic Showcase Typists (Matching Figma Mockup) ──── */
const BASE_DUMMY_USERS = [
  {
    id: 'u1',
    name: 'max_type',
    username: 'max_type',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    country: 'India',
    flag: '🇮🇳',
    baseWpm: 154,
    baseAccuracy: 99.4,
    baseTests: 312,
  },
  {
    id: 'u2',
    name: 'speed_demon',
    username: 'speed_demon',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
    country: 'United States',
    flag: '🇺🇸',
    baseWpm: 148,
    baseAccuracy: 98.9,
    baseTests: 231,
  },
  {
    id: 'u3',
    name: 'key_master',
    username: 'key_master',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    country: 'United Kingdom',
    flag: '🇬🇧',
    baseWpm: 142,
    baseAccuracy: 98.5,
    baseTests: 198,
  },
  {
    id: 'u4',
    name: 'typing_ninja',
    username: 'typing_ninja',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    country: 'Japan',
    flag: '🇯🇵',
    baseWpm: 135,
    baseAccuracy: 97.8,
    baseTests: 176,
  },
  {
    id: 'u5',
    name: 'code_writer',
    username: 'code_writer',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    country: 'Germany',
    flag: '🇩🇪',
    baseWpm: 132,
    baseAccuracy: 97.1,
    baseTests: 145,
  },
  {
    id: 'u6',
    name: 'word_hunter',
    username: 'word_hunter',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    country: 'Canada',
    flag: '🇨🇦',
    baseWpm: 128,
    baseAccuracy: 96.9,
    baseTests: 134,
  },
  {
    id: 'u7',
    name: 'type_king',
    username: 'type_king',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    country: 'Australia',
    flag: '🇦🇺',
    baseWpm: 125,
    baseAccuracy: 96.4,
    baseTests: 129,
  },
  {
    id: 'u8',
    name: 'pixel_typist',
    username: 'pixel_typist',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    country: 'India',
    flag: '🇮🇳',
    baseWpm: 123,
    baseAccuracy: 96.1,
    baseTests: 118,
  },
  {
    id: 'u9',
    name: 'alpha_keys',
    username: 'alpha_keys',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    country: 'France',
    flag: '🇫🇷',
    baseWpm: 121,
    baseAccuracy: 95.8,
    baseTests: 110,
  },
  {
    id: 'u10',
    name: 'silent_type',
    username: 'silent_type',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    country: 'Singapore',
    flag: '🇸🇬',
    baseWpm: 118,
    baseAccuracy: 95.6,
    baseTests: 104,
  },
  {
    id: 'u11',
    name: 'turbo_fingers',
    username: 'turbo_fingers',
    avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150&auto=format&fit=crop&q=80',
    country: 'Netherlands',
    flag: '🇳🇱',
    baseWpm: 115,
    baseAccuracy: 95.3,
    baseTests: 98,
  },
  {
    id: 'u12',
    name: 'quick_strike',
    username: 'quick_strike',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    country: 'South Korea',
    flag: '🇰🇷',
    baseWpm: 112,
    baseAccuracy: 95.1,
    baseTests: 92,
  },
  {
    id: 'u13',
    name: 'matrix_racer',
    username: 'matrix_racer',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',
    country: 'Brazil',
    flag: '🇧🇷',
    baseWpm: 109,
    baseAccuracy: 94.8,
    baseTests: 85,
  },
  {
    id: 'u14',
    name: 'swift_click',
    username: 'swift_click',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    country: 'Spain',
    flag: '🇪🇸',
    baseWpm: 106,
    baseAccuracy: 94.5,
    baseTests: 79,
  },
  {
    id: 'u15',
    name: 'hyper_text',
    username: 'hyper_text',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    country: 'Sweden',
    flag: '🇸🇪',
    baseWpm: 104,
    baseAccuracy: 94.2,
    baseTests: 72,
  },
  {
    id: 'u16',
    name: 'key_wizard',
    username: 'key_wizard',
    avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=150&auto=format&fit=crop&q=80',
    country: 'New Zealand',
    flag: '🇳🇿',
    baseWpm: 101,
    baseAccuracy: 94.0,
    baseTests: 68,
  },
  {
    id: 'u17',
    name: 'flow_state',
    username: 'flow_state',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80',
    country: 'Switzerland',
    flag: '🇨🇭',
    baseWpm: 98,
    baseAccuracy: 93.8,
    baseTests: 64,
  },
  {
    id: 'u18',
    name: 'rhythm_type',
    username: 'rhythm_type',
    avatar: 'https://images.unsplash.com/photo-1534751516642-a171edd2521d?w=150&auto=format&fit=crop&q=80',
    country: 'Italy',
    flag: '🇮🇹',
    baseWpm: 95,
    baseAccuracy: 93.5,
    baseTests: 59,
  },
  {
    id: 'u19',
    name: 'apex_keys',
    username: 'apex_keys',
    avatar: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=150&auto=format&fit=crop&q=80',
    country: 'Norway',
    flag: '🇳🇴',
    baseWpm: 92,
    baseAccuracy: 93.2,
    baseTests: 54,
  },
  {
    id: 'u20',
    name: 'ghost_typist',
    username: 'ghost_typist',
    avatar: 'https://images.unsplash.com/photo-1517070208541-6ddc4d3efbcb?w=150&auto=format&fit=crop&q=80',
    country: 'Ireland',
    flag: '🇮🇪',
    baseWpm: 89,
    baseAccuracy: 93.0,
    baseTests: 48,
  },
];

function generateLeaderboardData(period, duration, realEntries = [], currentUser = null) {
  let wpmOffset = 0;
  if (duration === '15') wpmOffset = 12;
  else if (duration === '30') wpmOffset = 0;
  else if (duration === '60') wpmOffset = -8;
  else if (duration === '120') wpmOffset = -15;
  else if (duration === 'all') wpmOffset = 6;

  const periodConfig = {
    today: {
      testMult: 0.12,
      minTests: 8,
      times: ['15m ago', '42m ago', '1 hour ago', '2 hours ago', '3 hours ago', '5 hours ago', '7 hours ago', '9 hours ago'],
    },
    week: {
      testMult: 0.35,
      minTests: 25,
      times: ['Today', 'Yesterday', '2 days ago', '3 days ago', '4 days ago', '5 days ago'],
    },
    month: {
      testMult: 0.7,
      minTests: 60,
      times: ['Yesterday', '3 days ago', '1 week ago', '2 weeks ago', '3 weeks ago'],
    },
    allTime: {
      testMult: 1,
      minTests: 100,
      times: ['2 hours ago', '3 hours ago', '5 hours ago', '6 hours ago', '8 hours ago', '10 hours ago', '12 hours ago'],
    },
  };

  const pCfg = periodConfig[period] || periodConfig.allTime;

  const list = BASE_DUMMY_USERS.map((user, idx) => {
    const wpm = Math.max(40, user.baseWpm + wpmOffset);
    const accuracy = Number(user.baseAccuracy.toFixed(1));
    const tests = Math.max(pCfg.minTests, Math.round(user.baseTests * pCfg.testMult));
    const time = pCfg.times[idx % pCfg.times.length];

    return {
      _id: user.id,
      name: user.name,
      username: user.username,
      avatar: user.avatar,
      country: user.country,
      flag: user.flag,
      wpm,
      accuracy,
      tests,
      date: time,
      isCurrentUser: false,
    };
  });

  // Merge real entries if present from backend
  (realEntries || []).forEach((real) => {
    const isYou = real.isCurrentUser || (currentUser && real.username === currentUser.username);
    const existingIndex = list.findIndex((m) => m.username === real.username);
    const formatted = {
      ...real,
      country: real.country || 'India',
      flag: real.flag || '🇮🇳',
      isCurrentUser: isYou,
      isYou,
      date: real.date ? formatRelativeTime(real.date) : 'Just now',
    };
    if (existingIndex >= 0) {
      list[existingIndex] = formatted;
    } else {
      list.push(formatted);
    }
  });

  // Sort by WPM descending initially
  list.sort((a, b) => (b.wpm || 0) - (a.wpm || 0));

  return list.map((item, idx) => ({
    ...item,
    rank: idx + 1,
  }));
}


/* ─── Relative Time Helper ────────────────────────────────────── */
function formatRelativeTime(dateString) {
  if (!dateString) return '2 hours ago';
  if (typeof dateString === 'string' && dateString.toLowerCase().includes('today')) return 'Today';
  if (typeof dateString === 'string' && dateString.toLowerCase().includes('week')) return 'This week';

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;

  const now = new Date();
  const diffSec = Math.floor((now - date) / 1000);
  if (diffSec < 60) return 'Just now';
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours} hours ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 30) return `${diffDays} days ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/* ─── Skeleton helpers ────────────────────────────────────────── */
function SkeletonBox({ className = '' }) {
  return <div className={`skeleton-shimmer rounded-lg ${className}`} />;
}

function PodiumSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-3">
      {[2, 1, 3].map((rank) => (
        <div
          key={rank}
          className={`ldb-card rounded-2xl border border-border bg-card px-3.5 py-4 text-center ${rank === 1 ? 'sm:order-1' : rank === 2 ? 'sm:order-0' : 'sm:order-2'}`}
        >
          <SkeletonBox className="mx-auto mb-1.5 h-4 w-4" />
          <SkeletonBox className="mx-auto h-11 w-11 rounded-full" />
          <SkeletonBox className="mx-auto mt-2 h-3.5 w-20" />
          <SkeletonBox className="mx-auto mt-1 h-2.5 w-14" />
          <div className="mt-2.5 grid grid-cols-3 gap-2">
            {[0, 1, 2].map((i) => (
              <SkeletonBox key={i} className="h-6" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function TableSkeleton({ rows = 8 }) {
  return (
    <div className="divide-y divide-border/50">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 px-4 py-3">
          <SkeletonBox className="h-5 w-8 shrink-0" />
          <SkeletonBox className="h-8 w-8 shrink-0 rounded-full" />
          <div className="flex-1 space-y-1.5">
            <SkeletonBox className="h-3.5 w-28" />
            <SkeletonBox className="h-3 w-20" />
          </div>
          <SkeletonBox className="h-4 w-12 shrink-0" />
          <SkeletonBox className="h-4 w-14 shrink-0" />
          <SkeletonBox className="h-4 w-10 shrink-0" />
          <SkeletonBox className="h-4 w-16 shrink-0" />
        </div>
      ))}
    </div>
  );
}

/* ─── Crown Badges & Laurel Wreaths (Matching Reference Design) ─── */
function CrownBadge({ rank }) {
  const configs = {
    1: {
      fill: '#F59E0B',
      glow: 'drop-shadow(0 0 14px rgba(245, 158, 11, 0.95))',
    },
    2: {
      fill: '#93C5FD',
      glow: 'drop-shadow(0 0 12px rgba(147, 197, 253, 0.9))',
    },
    3: {
      fill: '#E08A38',
      glow: 'drop-shadow(0 0 12px rgba(224, 138, 56, 0.9))',
    },
  };
  const cfg = configs[rank] || configs[1];

  return (
    <div className="relative flex items-center justify-center select-none" style={{ filter: cfg.glow }}>
      <svg width="34" height="24" viewBox="0 0 42 30" fill={cfg.fill} aria-hidden="true">
        <path d="M 4 25 L 5 8 L 13 15 L 21 3.5 L 29 15 L 37 8 L 38 25 C 38 26.5 36.8 27.5 35 27.5 H 7 C 5.2 27.5 4 26.5 4 25 Z" />
      </svg>
      <span className="absolute inset-x-0 bottom-0.5 text-center font-display text-[10.5px] font-black leading-none text-slate-950">
        {rank}
      </span>
    </div>
  );
}

function TableRankBadge({ rank }) {
  if (rank === 1) {
    return (
      <div className="flex items-center justify-center select-none">
        <svg width="20" height="15" viewBox="0 0 42 30" fill="#F59E0B" className="drop-shadow-[0_0_6px_rgba(245,158,11,0.6)]">
          <path d="M 4 25 L 5 8 L 13 15 L 21 3.5 L 29 15 L 37 8 L 38 25 C 38 26.5 36.8 27.5 35 27.5 H 7 C 5.2 27.5 4 26.5 4 25 Z" />
        </svg>
      </div>
    );
  }
  if (rank === 2) {
    return (
      <div className="flex items-center justify-center select-none">
        <svg width="20" height="15" viewBox="0 0 42 30" fill="#93C5FD" className="drop-shadow-[0_0_5px_rgba(147,197,253,0.6)]">
          <path d="M 4 25 L 5 8 L 13 15 L 21 3.5 L 29 15 L 37 8 L 38 25 C 38 26.5 36.8 27.5 35 27.5 H 7 C 5.2 27.5 4 26.5 4 25 Z" />
        </svg>
      </div>
    );
  }
  if (rank === 3) {
    return (
      <div className="flex items-center justify-center select-none">
        <svg width="20" height="15" viewBox="0 0 42 30" fill="#E08A38" className="drop-shadow-[0_0_5px_rgba(224,138,56,0.6)]">
          <path d="M 4 25 L 5 8 L 13 15 L 21 3.5 L 29 15 L 37 8 L 38 25 C 38 26.5 36.8 27.5 35 27.5 H 7 C 5.2 27.5 4 26.5 4 25 Z" />
        </svg>
      </div>
    );
  }
  return <span className="font-display text-xs font-semibold text-muted-foreground">{rank}</span>;
}

function LaurelWreath({ color = '#F59E0B' }) {
  return (
    <svg viewBox="0 0 120 74" className="pointer-events-none absolute inset-0 h-full w-full" fill="none" aria-hidden="true">
      {/* Left branch */}
      <path d="M 32 60 C 22 48 20 28 30 14" stroke={color} strokeWidth="1.8" strokeLinecap="round" opacity="0.95" />
      <path d="M 30 14 C 23 12 21 6 27 6 C 31 9 31 12 30 14 Z" fill={color} opacity="0.95" />
      <path d="M 25 24 C 18 22 16 16 22 15 C 26 18 26 21 25 24 Z" fill={color} opacity="0.95" />
      <path d="M 22 35 C 15 34 13 28 19 27 C 23 30 23 33 22 35 Z" fill={color} opacity="0.95" />
      <path d="M 22 47 C 15 47 14 41 20 40 C 24 43 24 46 22 47 Z" fill={color} opacity="0.95" />
      <path d="M 25 56 C 18 57 18 51 24 49 C 27 52 27 55 25 56 Z" fill={color} opacity="0.95" />

      {/* Right branch */}
      <path d="M 88 60 C 98 48 100 28 90 14" stroke={color} strokeWidth="1.8" strokeLinecap="round" opacity="0.95" />
      <path d="M 90 14 C 97 12 99 6 93 6 C 89 9 89 12 90 14 Z" fill={color} opacity="0.95" />
      <path d="M 95 24 C 102 22 104 16 98 15 C 94 18 94 21 95 24 Z" fill={color} opacity="0.95" />
      <path d="M 98 35 C 105 34 107 28 101 27 C 97 30 97 33 98 35 Z" fill={color} opacity="0.95" />
      <path d="M 98 47 C 105 47 106 41 100 40 C 96 43 96 46 98 47 Z" fill={color} opacity="0.95" />
      <path d="M 95 56 C 102 57 102 51 96 49 C 93 52 93 55 95 56 Z" fill={color} opacity="0.95" />
    </svg>
  );
}

/* ─── Podium Card Component ───────────────────────────────────── */
function PodiumCard({ entry, position = 1 }) {
  const configs = {
    1: {
      crownColor: '#F59E0B',
      borderColor: 'border-amber-500/60 hover:border-amber-400',
      glow: 'shadow-[0_0_28px_-5px_rgba(245,158,11,0.22)] hover:shadow-[0_16px_36px_-6px_rgba(245,158,11,0.38)]',
      topGlow: 'bg-[radial-gradient(ellipse_at_top,rgba(245,158,11,0.2)_0%,transparent_70%)]',
      wpmColor: 'text-[#F59E0B]',
      avatarRing: 'ring-2 ring-amber-500/60 ring-offset-1 ring-offset-[#0B1120]',
      elevation: 'sm:-translate-y-1 z-10 hover:sm:-translate-y-2.5 hover:-translate-y-1.5',
    },
    2: {
      crownColor: '#93C5FD',
      borderColor: 'border-blue-500/40 hover:border-blue-400/80',
      glow: 'shadow-[0_0_22px_-6px_rgba(59,130,246,0.18)] hover:shadow-[0_14px_32px_-6px_rgba(59,130,246,0.32)]',
      topGlow: 'bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.16)_0%,transparent_70%)]',
      wpmColor: 'text-foreground',
      avatarRing: 'ring-2 ring-blue-400/50 ring-offset-1 ring-offset-[#0B1120]',
      elevation: 'hover:-translate-y-1.5',
    },
    3: {
      crownColor: '#E08A38',
      borderColor: 'border-amber-700/50 hover:border-amber-600/90',
      glow: 'shadow-[0_0_22px_-6px_rgba(224,138,56,0.18)] hover:shadow-[0_14px_32px_-6px_rgba(224,138,56,0.32)]',
      topGlow: 'bg-[radial-gradient(ellipse_at_top,rgba(224,138,56,0.16)_0%,transparent_70%)]',
      wpmColor: 'text-[#E08A38]',
      avatarRing: 'ring-2 ring-amber-700/60 ring-offset-1 ring-offset-[#0B1120]',
      elevation: 'hover:-translate-y-1.5',
    },
  };

  const cfg = configs[position] || configs[1];
  const fallback = DEFAULT_TOP3[position - 1] || DEFAULT_TOP3[0];
  const safeEntry = {
    avatar: entry?.avatar || fallback.avatar,
    name: entry?.name || entry?.username || fallback.name,
    username: entry?.username || fallback.username,
    wpm: entry?.wpm ?? fallback.wpm,
    accuracy: entry?.accuracy ?? fallback.accuracy,
    tests: entry?.tests ?? fallback.tests,
  };

  return (
    <article
      className={`ldb-card group relative flex flex-col items-center rounded-2xl border ${cfg.borderColor} bg-[#0B1120] ${cfg.glow} ${cfg.elevation} px-3 pt-3.5 pb-2.5 sm:px-3.5 sm:pt-4 sm:pb-3 text-center transition-all duration-300 cursor-default select-none overflow-visible`}
    >
      {/* Ambient top light beam */}
      <div className={`pointer-events-none absolute inset-x-0 top-0 h-16 rounded-t-2xl ${cfg.topGlow}`} />

      {/* Floating Crown Badge centered on top border */}
      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-20">
        <CrownBadge rank={position} />
      </div>

      {/* Laurel Wreath & Avatar */}
      <div className="relative z-10 my-0.5 flex items-center justify-center w-24 h-14 sm:w-28 sm:h-16 mx-auto">
        <LaurelWreath color={cfg.crownColor} />
        <UserAvatar
          src={safeEntry.avatar}
          name={safeEntry.name}
          username={safeEntry.username}
          className={`h-11 w-11 sm:h-12 sm:w-12 rounded-full relative z-10 ${cfg.avatarRing}`}
          textClassName="text-xs font-bold"
        />
      </div>

      {/* Username / Name */}
      <div className="relative z-10 mt-1 min-w-0">
        <h3 className="font-display text-xs sm:text-sm font-bold text-foreground truncate max-w-[130px] sm:max-w-[150px] leading-tight">
          {safeEntry.name}
        </h3>
        <p className="text-[11px] text-muted-foreground truncate max-w-[120px] sm:max-w-[140px] mt-0.5 leading-none">
          @{safeEntry.username}
        </p>
      </div>

      {/* 3 Stats Row with Vertical Dividers */}
      <div className="relative z-10 mt-2 sm:mt-2.5 grid w-full grid-cols-3 items-center text-center pt-1.5 border-t border-white/[0.04]">
        {/* WPM */}
        <div className="px-1">
          <div className={`font-display text-base sm:text-lg font-bold ${cfg.wpmColor} leading-tight`}>
            {safeEntry.wpm}
          </div>
          <div className="mt-0.5 text-[10px] sm:text-[11px] font-medium text-muted-foreground uppercase leading-none">
            WPM
          </div>
        </div>

        {/* Accuracy with side dividers */}
        <div className="relative px-1">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-px bg-border/50" />
          <div className="font-display text-base sm:text-lg font-bold text-foreground leading-tight">
            {safeEntry.accuracy}%
          </div>
          <div className="mt-0.5 text-[10px] sm:text-[11px] font-medium text-muted-foreground uppercase leading-none">
            Accuracy
          </div>
          <div className="absolute right-0 top-1/2 -translate-y-1/2 h-5 w-px bg-border/50" />
        </div>

        {/* Tests */}
        <div className="px-1">
          <div className="font-display text-base sm:text-lg font-bold text-foreground leading-tight">
            {safeEntry.tests}
          </div>
          <div className="mt-0.5 text-[10px] sm:text-[11px] font-medium text-muted-foreground uppercase leading-none">
            Tests
          </div>
        </div>
      </div>
    </article>
  );
}



/* ─── Main Component ─────────────────────────────────────────── */
export const Leaderboard = () => {
  const { user } = useAuth();
  const [period,      setPeriod]      = useState('today');
  const [duration,    setDuration]    = useState('all');
  const [search,      setSearch]      = useState('');
  const [rows,        setRows]        = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState(false);
  const [sortField,   setSortField]   = useState('wpm');
  const [sortOrder,   setSortOrder]   = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  const fetchBoard = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const durOpt = durationOptions.find((d) => d.id === duration);
      const durVal = durOpt?.value ?? 'all';
      const res = await leaderboardService.getLeaderboard(period, durVal);
      const dynamicList = generateLeaderboardData(period, duration, res?.leaderboard || [], user);
      setRows(dynamicList);
    } catch (err) {
      console.warn('Leaderboard API offline, utilizing generated showcase data:', err);
      const fallbackList = generateLeaderboardData(period, duration, [], user);
      setRows(fallbackList);
    } finally {
      setLoading(false);
    }
  }, [period, duration, user]);

  useEffect(() => { fetchBoard(); }, [fetchBoard]);

  useEffect(() => {
    setCurrentPage(1);
  }, [period, duration, search]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === 'desc' ? 'asc' : 'desc'));
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
    setCurrentPage(1);
  };

  const filteredRows = search.trim()
    ? rows.filter(
        (r) =>
          (r.name || '').toLowerCase().includes(search.toLowerCase()) ||
          (r.username || '').toLowerCase().includes(search.toLowerCase()) ||
          (r.country || '').toLowerCase().includes(search.toLowerCase())
      )
    : rows;

  const sortedRows = [...filteredRows].sort((a, b) => {
    const valA = a[sortField] ?? 0;
    const valB = b[sortField] ?? 0;
    return sortOrder === 'desc' ? valB - valA : valA - valB;
  });

  const totalPages = Math.ceil(sortedRows.length / pageSize) || 1;
  const paginatedRows = sortedRows.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const displayTop3 = [
    sortedRows[0] || DEFAULT_TOP3[0],
    sortedRows[1] || DEFAULT_TOP3[1],
    sortedRows[2] || DEFAULT_TOP3[2],
  ];

  const yourEntry = rows.find((r) => r.isYou);
  const maxWpm = rows.length > 0 ? Math.max(...rows.map((r) => r.wpm || 0)) : (displayTop3[0]?.wpm || 154);

  const statsConfig = {
    today:   { typists: '2,480',  countries: '42+', tests: '28.4K+', highest: maxWpm },
    week:    { typists: '6,120',  countries: '68+', tests: '184K+',  highest: maxWpm },
    month:   { typists: '8,950',  countries: '79+', tests: '640K+',  highest: maxWpm },
    allTime: { typists: '10,248', countries: '85+', tests: '1.2M+',  highest: maxWpm },
  };
  const activeStats = statsConfig[period] || statsConfig.allTime;

  return (
    <div className="min-h-full bg-background text-foreground">
      <SEO
        title="Leaderboard — Tara Typing"
        description="See the fastest typists on Tara Typing. Global leaderboard rankings by WPM and accuracy — today, this week, this month and all time."
      />

      <main className="mx-auto max-w-7xl px-4 pb-16 pt-8 sm:px-6 lg:px-8">

        {/* ── HERO ── */}
        <div className="grid gap-6 lg:grid-cols-[1fr_auto] items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1.5 text-xs font-semibold text-amber-400">
              <Trophy size={13} /> Global Leaderboard
            </span>
            <h1 className="mt-3.5 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              Top Typists <span className="text-primary">Worldwide</span>
            </h1>
            <p className="mt-2.5 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              Compete, improve and see how you rank against typists from around the world.
              Every keystroke brings you closer to the top!
            </p>
          </div>

          {/* Hero Banner Card with Compact Glowing Earth Graphic */}
          <div className="hidden lg:flex items-center gap-4">
            <div className="group relative overflow-hidden rounded-2xl border border-primary/25 bg-[#081024] p-3.5 sm:px-4 sm:py-3 shadow-[0_0_30px_-8px_rgba(59,130,246,0.3)] w-[360px] sm:w-[380px] h-[126px] flex flex-col justify-between select-none transition-all duration-300 hover:-translate-y-1 hover:border-primary/55 hover:shadow-[0_0_38px_-4px_rgba(59,130,246,0.45)] cursor-default">
              {/* Globe Graphic with atmospheric glow and orbital lines */}
              <div className="pointer-events-none absolute -right-4 -top-6 w-44 h-44 transition-transform duration-500 ease-out group-hover:scale-105">
                <div className="absolute inset-2 rounded-full bg-primary/25 blur-xl group-hover:bg-primary/35 transition-colors duration-500" />
                <svg viewBox="0 0 160 160" className="w-full h-full">
                  <defs>
                    <radialGradient id="planetBody" cx="70%" cy="30%" r="65%">
                      <stop offset="0%" stopColor="#93C5FD" stopOpacity="1" />
                      <stop offset="25%" stopColor="#3B82F6" stopOpacity="0.95" />
                      <stop offset="55%" stopColor="#1E40AF" stopOpacity="0.9" />
                      <stop offset="85%" stopColor="#0F172A" stopOpacity="0.98" />
                      <stop offset="100%" stopColor="#040814" stopOpacity="1" />
                    </radialGradient>
                    <radialGradient id="planetAtmosphere" cx="50%" cy="50%" r="50%">
                      <stop offset="70%" stopColor="#60A5FA" stopOpacity="0" />
                      <stop offset="92%" stopColor="#3B82F6" stopOpacity="0.5" />
                      <stop offset="100%" stopColor="#93C5FD" stopOpacity="0.7" />
                    </radialGradient>
                  </defs>

                  {/* Back orbital rings */}
                  <ellipse cx="80" cy="80" rx="74" ry="24" fill="none" stroke="#60A5FA" strokeWidth="0.75" opacity="0.35" transform="rotate(-22 80 80)" />
                  <ellipse cx="80" cy="80" rx="78" ry="16" fill="none" stroke="#93C5FD" strokeWidth="0.6" opacity="0.25" transform="rotate(28 80 80)" />

                  {/* Atmosphere rim halo */}
                  <circle cx="80" cy="80" r="53" fill="url(#planetAtmosphere)" />

                  {/* Planet body */}
                  <circle cx="80" cy="80" r="50" fill="url(#planetBody)" />

                  {/* Continents */}
                  <g fill="#93C5FD" opacity="0.32">
                    <path d="M68 50 Q75 42 86 46 Q95 52 90 62 Q82 66 75 60 Z" />
                    <path d="M52 68 Q58 60 66 65 Q70 75 62 82 Q54 80 52 68 Z" />
                    <path d="M85 68 Q96 66 102 75 Q98 87 88 84 Q80 77 85 68 Z" />
                    <path d="M64 92 Q74 88 82 94 Q78 105 70 103 Q62 99 64 92 Z" />
                  </g>

                  {/* Front orbital ring segment */}
                  <path d="M 12 80 A 74 24 0 0 0 148 80" fill="none" stroke="#93C5FD" strokeWidth="1" opacity="0.6" transform="rotate(-22 80 80)" />
                  <circle cx="120" cy="62" r="1.5" fill="#FFFFFF" opacity="0.9" />
                </svg>
              </div>

              {/* Card Header: Type Today + A Better Tomorrow */}
              <div className="relative z-10 leading-tight">
                <div className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-foreground">
                  <span>Type Today</span>
                  <Sparkles size={13} className="text-amber-400 fill-amber-400/30 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
                </div>
                <div className="font-display text-xs sm:text-sm font-bold text-foreground">
                  A <span className="text-primary font-bold">Better Tomorrow</span>
                </div>
              </div>

              {/* 3 bullet items with blue pipe */}
              <div className="relative z-10 space-y-0.5 text-[11px] leading-tight text-muted-foreground">
                <p className="flex items-center gap-1.5"><span className="text-primary font-bold text-xs leading-none">|</span>Faster Hands</p>
                <p className="flex items-center gap-1.5"><span className="text-primary font-bold text-xs leading-none">|</span>Sharper Mind</p>
                <p className="flex items-center gap-1.5"><span className="text-primary font-bold text-xs leading-none">|</span>Brighter Future</p>
              </div>

              {/* Floating pill badge */}
              <div className="absolute bottom-2.5 right-3 z-10 flex items-center gap-2 rounded-xl border border-primary/30 bg-[#0B1328]/92 backdrop-blur-md px-2.5 py-1 shadow-md transition-colors duration-300 group-hover:border-primary/60">
                <div className="grid h-5 w-5 place-items-center rounded-lg bg-primary/20 text-primary">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="3" />
                    <path d="M12 2v3m0 14v3M2 12h3m14 0h3" />
                  </svg>
                </div>
                <div className="text-left leading-none">
                  <p className="font-display text-xs font-bold text-foreground leading-tight">1.2M+</p>
                  <p className="text-[9px] text-muted-foreground leading-tight mt-0.5">Tests Completed</p>
                </div>
              </div>
            </div>

            {/* Motivational quote on far right (desktop) */}
            <div className="hidden xl:flex flex-col justify-center max-w-[135px] text-right text-xs italic text-muted-foreground leading-relaxed pl-1 select-none">
              <span>" A little progress each day adds up to big results."</span>
              <span className="mt-1 font-semibold not-italic text-muted-foreground/80 text-[11px]">— Tara Typing</span>
            </div>
          </div>
        </div>

        {/* ── FILTER BAR ── */}
        <div className="mt-7 card-glass rounded-2xl p-3 sm:p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            {/* Period + Duration filters */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Period */}
              <div className="flex rounded-xl border border-border dark:border-[#1E293B] bg-slate-100 dark:bg-[#0B1120] p-1" role="tablist" aria-label="Time period">
                {periods.map((p) => (
                  <button
                    key={p.id}
                    role="tab"
                    aria-selected={period === p.id}
                    onClick={() => setPeriod(p.id)}
                    className={`ldb-filter-btn rounded-lg px-3.5 py-1.5 text-sm font-medium transition-all select-none ${
                      period === p.id
                        ? 'bg-primary text-white font-semibold shadow-sm shadow-primary/30'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>

              {/* Duration */}
              <div className="flex rounded-xl border border-border dark:border-[#1E293B] bg-slate-100 dark:bg-[#0B1120] p-1" role="group" aria-label="Duration">
                {durationOptions.map((d) => (
                  <button
                    key={d.id}
                    aria-pressed={duration === d.id}
                    onClick={() => setDuration(d.id)}
                    className={`ldb-filter-btn rounded-lg px-3 py-1.5 text-sm font-medium transition-all select-none ${
                      duration === d.id
                        ? 'bg-primary text-white font-semibold shadow-sm shadow-primary/30'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Search */}
            <div className="relative w-full sm:w-64">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                placeholder="Search users..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-border dark:border-[#1E293B] bg-slate-100 dark:bg-[#0B1120] py-2 pl-9 pr-8 text-sm text-slate-900 dark:text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary/70 focus:ring-1 focus:ring-primary/30 transition-colors caret-primary"
                aria-label="Search leaderboard users"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground text-xs p-1 rounded-md transition-colors"
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ── MAIN CONTENT: LEFT (PODIUM + TABLE) & RIGHT (SIDEBAR) ── */}
        <div className="mt-6 grid gap-5 lg:grid-cols-12 items-stretch">

          {/* LEFT COLUMN: PODIUM CARDS + TABLE */}
          <div className="lg:col-span-8 xl:col-span-9 flex flex-col gap-4 sm:gap-5">

            {/* ── TOP 3 PODIUM (Width equals the table below it) ── */}
            {loading ? (
              <PodiumSkeleton />
            ) : (
              <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-3 items-end pt-2" aria-label="Top 3 typists">
                {/* 2nd place (left) */}
                <div className="order-2 sm:order-1">
                  <PodiumCard entry={displayTop3[1]} position={2} />
                </div>
                {/* 1st place (center) */}
                <div className="order-1 sm:order-2">
                  <PodiumCard entry={displayTop3[0]} position={1} />
                </div>
                {/* 3rd place (right) */}
                <div className="order-3 sm:order-3">
                  <PodiumCard entry={displayTop3[2]} position={3} />
                </div>
              </div>
            )}

            {/* TABLE CARD */}
            <div className="card-glass rounded-2xl overflow-hidden shadow-sm flex-1 flex flex-col justify-between">
            {loading ? (
              <>
                <div className="px-4 py-3 border-b border-border/60">
                  <SkeletonBox className="h-4 w-48" />
                </div>
                <TableSkeleton />
              </>
            ) : error ? (
              <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
                <div className="grid h-16 w-16 place-items-center rounded-2xl bg-destructive/10 text-destructive">
                  <RefreshCw size={28} />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Unable to load leaderboard</p>
                  <p className="mt-1 text-sm text-muted-foreground">Something went wrong. Please try again.</p>
                </div>
                <button
                  onClick={fetchBoard}
                  className="mt-1 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                >
                  Try Again
                </button>
              </div>
            ) : filteredRows.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
                <div className="grid h-16 w-16 place-items-center rounded-2xl bg-amber-500/10 text-amber-500 text-3xl">🏆</div>
                <div>
                  <p className="font-semibold text-foreground">
                    {search ? `No typists found matching "${search}"` : 'No scores recorded yet'}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {search ? 'Try searching for a different username or country.' : 'Be the first to take the test and claim the top spot!'}
                  </p>
                </div>
                {search ? (
                  <button
                    type="button"
                    onClick={() => setSearch('')}
                    className="mt-1 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                  >
                    Clear Search
                  </button>
                ) : (
                  <Link to="/typing-test" className="mt-1 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90">
                    Start Typing Test
                  </Link>
                )}
              </div>
            ) : (
              <>
                {/* Table header row */}
                <div className="overflow-x-auto flex-1">
                  <table className="w-full min-w-[620px] text-sm table-fixed" role="table">
                    <thead className="bg-[#0D1527] dark:bg-[#070D1B] border-b border-border/80 sticky top-0 z-10 backdrop-blur-sm">
                      <tr className="text-left select-none">
                        <th className="w-12 px-3 py-2.5 sm:py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-center">#</th>
                        <th className="w-[27%] px-3.5 py-2.5 sm:py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">User</th>
                        <th
                          onClick={() => handleSort('wpm')}
                          className="w-[13%] px-3 py-2.5 sm:py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground transition-colors"
                        >
                          <span className="flex items-center gap-1">
                            WPM
                            <TrendingUp size={11} className={sortField === 'wpm' ? 'text-primary' : 'opacity-60'} />
                          </span>
                        </th>
                        <th
                          onClick={() => handleSort('accuracy')}
                          className="w-[14%] px-3 py-2.5 sm:py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground transition-colors"
                        >
                          <span className="flex items-center gap-1">
                            Accuracy
                            <TrendingUp size={11} className={sortField === 'accuracy' ? 'text-primary' : 'opacity-60'} />
                          </span>
                        </th>
                        <th
                          onClick={() => handleSort('tests')}
                          className="w-[11%] px-3 py-2.5 sm:py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground transition-colors"
                        >
                          <span className="flex items-center gap-1">
                            Tests
                            <TrendingUp size={11} className={sortField === 'tests' ? 'text-primary' : 'opacity-60'} />
                          </span>
                        </th>
                        <th className="w-[19%] px-3.5 py-2.5 sm:py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">Country</th>
                        <th className="w-[16%] px-3.5 py-2.5 sm:py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">Last Active</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40">
                      {paginatedRows.map((row) => (
                        <tr
                          key={`${period}-${duration}-${row.rank}-${row.username}`}
                          className={`ldb-row transition-colors ${
                            row.isYou
                              ? 'bg-primary/10 border-l-2 border-l-primary'
                              : 'hover:bg-accent/30'
                          }`}
                        >
                          {/* Rank */}
                          <td className="w-12 px-3 py-2.5 text-center">
                            <span className="inline-flex items-center justify-center h-6 w-6">
                              <TableRankBadge rank={row.rank} />
                            </span>
                          </td>

                          {/* User */}
                          <td className="px-3.5 py-2.5">
                            <span className="flex items-center gap-2.5 min-w-0">
                              <UserAvatar
                                src={row.avatar}
                                name={row.name}
                                username={row.username}
                                className="h-7 w-7 sm:h-8 sm:w-8 shrink-0"
                                textClassName="text-xs font-semibold"
                              />
                              <span className="min-w-0 truncate">
                                <p className={`font-semibold text-xs sm:text-sm truncate leading-tight ${row.isYou ? 'text-primary' : 'text-foreground'}`}>
                                  {row.name || row.username}
                                  {row.isYou && (
                                    <span className="ml-1.5 inline-flex items-center rounded bg-primary/20 px-1.5 py-0.5 text-[10px] font-bold text-primary">
                                      YOU
                                    </span>
                                  )}
                                </p>
                                <p className="text-[11px] text-muted-foreground truncate leading-tight">@{row.username || 'user'}</p>
                              </span>
                            </span>
                          </td>

                          {/* WPM */}
                          <td className="px-3 py-2.5">
                            <span className="font-display text-xs sm:text-sm font-bold text-foreground">{row.wpm}</span>
                          </td>

                          {/* Accuracy */}
                          <td className="px-3 py-2.5">
                            <span className={`text-xs sm:text-sm font-semibold ${(row.accuracy ?? 0) >= 95 ? 'text-emerald-400' : 'text-muted-foreground'}`}>
                              {row.accuracy}%
                            </span>
                          </td>

                          {/* Tests */}
                          <td className="px-3 py-2.5 text-xs sm:text-sm text-muted-foreground">{row.tests ?? 1}</td>

                          {/* Country */}
                          <td className="px-3.5 py-2.5 hidden md:table-cell">
                            <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground truncate max-w-full">
                              <span className="text-xs leading-none shrink-0" role="img" aria-label={row.country || 'Global'}>
                                {row.flag || '🌐'}
                              </span>
                              <span className="truncate">{row.country || 'Global'}</span>
                            </span>
                          </td>

                          {/* Last Active */}
                          <td className="px-3.5 py-2.5 text-xs text-muted-foreground hidden md:table-cell truncate">
                            {row.date || formatRelativeTime(row.createdAt || row.updatedAt)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination pinned flush to bottom */}
                <div className="mt-auto flex flex-col sm:flex-row items-center justify-between gap-2.5 border-t border-border/70 px-4 py-2.5 sm:py-3 select-none bg-background/40">
                  <p className="text-xs text-muted-foreground">
                    Showing top {Math.min(paginatedRows.length, pageSize)} of {filteredRows.length > 0 ? (filteredRows.length >= 20 ? '10,248' : filteredRows.length) : '0'} typists
                  </p>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="grid h-7 w-7 place-items-center rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 disabled:opacity-40 disabled:hover:border-border transition-colors cursor-pointer disabled:cursor-not-allowed"
                      aria-label="Previous page"
                    >
                      <ChevronLeft size={14} />
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <button
                        key={p}
                        onClick={() => setCurrentPage(p)}
                        className={`grid h-7 w-7 place-items-center rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                          currentPage === p
                            ? 'bg-primary text-white shadow-sm shadow-primary/30'
                            : 'border border-border text-muted-foreground hover:text-foreground hover:border-primary/40'
                        }`}
                      >
                        {p}
                      </button>
                    ))}

                    {totalPages > 5 && <span className="px-1 text-xs text-muted-foreground">...</span>}
                    {totalPages > 5 && (
                      <button
                        onClick={() => setCurrentPage(totalPages)}
                        className="grid h-7 w-7 place-items-center rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors cursor-pointer"
                      >
                        {totalPages}
                      </button>
                    )}

                    <button
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="grid h-7 w-7 place-items-center rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 disabled:opacity-40 disabled:hover:border-border transition-colors cursor-pointer disabled:cursor-not-allowed"
                      aria-label="Next page"
                    >
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* ── RIGHT SIDEBAR ── */}
        <div className="lg:col-span-4 xl:col-span-3 flex flex-col justify-between gap-4">

            {/* CARD 1 — YOUR RANK */}
            <div className="ldb-card card-glass group rounded-2xl p-4 sm:p-4.5 shadow-sm border border-border/80 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/50 hover:shadow-[0_12px_28px_-6px_rgba(99,102,241,0.25)] hover:bg-gradient-to-b hover:from-indigo-500/[0.05] hover:to-transparent cursor-default">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-display text-sm sm:text-base font-bold text-foreground group-hover:text-indigo-300 transition-colors">
                  Your Rank
                </h2>
                {yourEntry ? (
                  <div className="flex items-center gap-1.5">
                    <span className="font-display text-xl font-black text-primary">#{yourEntry.rank}</span>
                    <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs font-semibold text-emerald-400">
                      ↑ 12
                    </span>
                  </div>
                ) : user ? (
                  <span className="text-xs font-semibold text-muted-foreground bg-muted/40 px-2 py-0.5 rounded-md">
                    Unranked
                  </span>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <span className="font-display text-xl font-black text-primary">#47</span>
                    <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs font-semibold text-emerald-400">
                      ↑ 12
                    </span>
                  </div>
                )}
              </div>

              {user ? (
                <div>
                  <div className="flex items-center gap-3">
                    <UserAvatar
                      src={user.avatar}
                      name={user.name}
                      username={user.username}
                      className="h-11 w-11 rounded-full ring-2 ring-primary/40 shrink-0"
                      textClassName="text-sm font-bold"
                    />
                    <div className="min-w-0">
                      <p className="font-bold text-sm text-foreground truncate leading-tight">
                        {user.name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        @{user.username || 'typist'}
                      </p>
                    </div>
                  </div>

                  {/* 3 Stats Row */}
                  <div className="mt-3.5 grid grid-cols-3 gap-2 text-center pt-3 border-t border-border/50">
                    <div className="rounded-xl border border-border/60 bg-background/60 py-1.5">
                      <p className="font-display text-sm sm:text-base font-bold text-foreground leading-tight">
                        {yourEntry ? yourEntry.wpm : (user.bestWpm || 0)}
                      </p>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wide">WPM</p>
                    </div>
                    <div className="rounded-xl border border-border/60 bg-background/60 py-1.5">
                      <p className="font-display text-sm sm:text-base font-bold text-emerald-400 leading-tight">
                        {yourEntry ? `${yourEntry.accuracy}%` : `${user.accuracy || 0}%`}
                      </p>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Accuracy</p>
                    </div>
                    <div className="rounded-xl border border-border/60 bg-background/60 py-1.5">
                      <p className="font-display text-sm sm:text-base font-bold text-foreground leading-tight">
                        {yourEntry ? (yourEntry.tests ?? 1) : (user.testsCompleted || 0)}
                      </p>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Tests</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center gap-3">
                    <UserAvatar
                      src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"
                      name="Aman Gupta"
                      username="aman_typist"
                      className="h-11 w-11 rounded-full ring-2 ring-primary/40 shrink-0"
                      textClassName="text-sm font-bold"
                    />
                    <div className="min-w-0">
                      <p className="font-bold text-sm text-foreground truncate leading-tight">
                        Aman Gupta
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        @aman_typist
                      </p>
                    </div>
                  </div>

                  {/* 3 Stats Row (Mockup showcase values) */}
                  <div className="mt-3.5 grid grid-cols-3 gap-2 text-center pt-3 border-t border-border/50">
                    <div className="rounded-xl border border-border/60 bg-background/60 py-1.5">
                      <p className="font-display text-sm sm:text-base font-bold text-foreground leading-tight">
                        82
                      </p>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wide">WPM</p>
                    </div>
                    <div className="rounded-xl border border-border/60 bg-background/60 py-1.5">
                      <p className="font-display text-sm sm:text-base font-bold text-emerald-400 leading-tight">
                        96.2%
                      </p>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Accuracy</p>
                    </div>
                    <div className="rounded-xl border border-border/60 bg-background/60 py-1.5">
                      <p className="font-display text-sm sm:text-base font-bold text-foreground leading-tight">
                        28
                      </p>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Tests</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Start Typing Test Button */}
              <Link
                to="/typing-test"
                className="mt-3.5 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-primary/25 hover:bg-primary-hover transition-colors select-none"
              >
                <Play size={14} fill="currentColor" /> Start Typing Test
              </Link>
            </div>

            {/* CARD 2 — LEADERBOARD STATS (4 stats matching Figma mockup) */}
            <div className="ldb-card card-glass group rounded-2xl p-4 sm:p-4.5 shadow-sm border border-border/80 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/50 hover:shadow-[0_12px_28px_-6px_rgba(16,185,129,0.25)] hover:bg-gradient-to-b hover:from-emerald-500/[0.05] hover:to-transparent cursor-default">
              <h2 className="font-display text-sm sm:text-base font-bold text-foreground group-hover:text-emerald-300 transition-colors mb-3">
                Leaderboard Stats
              </h2>
              <div className="space-y-2.5">
                {/* Total Typists */}
                <div className="flex items-center gap-3">
                  <div className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-blue-500/10 text-primary">
                    <Users size={16} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-display text-sm sm:text-base font-bold text-foreground leading-tight">
                      {activeStats.typists}
                    </p>
                    <p className="text-[11px] text-muted-foreground">Total Typists</p>
                  </div>
                </div>

                {/* Countries */}
                <div className="flex items-center gap-3">
                  <div className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-cyan-500/10 text-cyan-400">
                    <Globe2 size={16} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-display text-sm sm:text-base font-bold text-foreground leading-tight">
                      {activeStats.countries || '85+'}
                    </p>
                    <p className="text-[11px] text-muted-foreground">Countries</p>
                  </div>
                </div>

                {/* Tests Completed */}
                <div className="flex items-center gap-3">
                  <div className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-purple-500/10 text-purple-400">
                    <BarChart2 size={16} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-display text-sm sm:text-base font-bold text-foreground leading-tight">
                      {activeStats.tests}
                    </p>
                    <p className="text-[11px] text-muted-foreground">Tests Completed</p>
                  </div>
                </div>

                {/* Highest Score */}
                <div className="flex items-center gap-3">
                  <div className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-amber-500/10 text-amber-400">
                    <Star size={16} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-display text-sm sm:text-base font-bold text-foreground leading-tight">
                      {activeStats.highest} WPM
                    </p>
                    <p className="text-[11px] text-muted-foreground">Highest Score</p>
                  </div>
                </div>
              </div>
            </div>

            {/* CARD 3 — MOTIVATIONAL CTA */}
            <div className="ldb-card card-glass group rounded-2xl p-4 sm:p-4.5 text-center shadow-sm border border-border/80 transition-all duration-300 hover:-translate-y-1 hover:border-amber-500/50 hover:shadow-[0_12px_28px_-6px_rgba(245,158,11,0.25)] hover:bg-gradient-to-b hover:from-amber-500/[0.05] hover:to-transparent cursor-default">
              <div>
                <div className="mx-auto grid h-10 w-10 place-items-center rounded-2xl bg-amber-500/10 text-amber-400 text-lg mb-2 select-none group-hover:scale-110 group-hover:rotate-6 transition-all duration-300" aria-hidden="true">
                  🏆
                </div>
                <h3 className="font-display text-sm font-bold text-foreground group-hover:text-amber-300 transition-colors">
                  Think you can do better?
                </h3>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                  Take a typing test and climb the ranks!
                </p>
              </div>
              <Link
                to="/typing-test"
                className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary hover:bg-primary-hover px-4 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-md shadow-primary/25 transition-all select-none"
              >
                <span>Start Typing Test</span>
                <span aria-hidden="true">→</span>
              </Link>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
};

export default Leaderboard;
