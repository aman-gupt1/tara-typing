import { Trophy, Zap, Target, Flame, Lock, Award, Calendar, Star } from 'lucide-react';

const ACHIEVEMENTS_DEF = [
  { key: 'first-test', name: 'First Steps', desc: 'Complete 1 test', icon: Target, color: 'blue' },
  { key: 'speed-30', name: 'Getting Started', desc: 'Reach 30 WPM', icon: Zap, color: 'purple' },
  { key: 'speed-50', name: 'Speed Typist', desc: 'Reach 50 WPM', icon: Zap, color: 'orange' },
  { key: 'speed-75', name: 'Fast Fingers', desc: 'Reach 75 WPM', icon: Flame, color: 'pink' },
  { key: 'speed-100', name: 'Century', desc: 'Reach 100 WPM', icon: Trophy, color: 'orange' },
  { key: 'accuracy-95', name: 'Precise', desc: '95% accuracy', icon: Target, color: 'green' },
  { key: 'accuracy-100', name: 'Perfect Accuracy', desc: '100% accuracy', icon: Award, color: 'purple' },
  { key: 'tests-10', name: 'Regular Typist', desc: 'Complete 10 tests', icon: Calendar, color: 'blue' },
  { key: 'tests-50', name: 'Dedicated Typist', desc: 'Complete 50 tests', icon: Star, color: 'orange' },
  { key: 'streak-7', name: 'Weekly Streak', desc: '7-day streak', icon: Flame, color: 'pink' },
];

const colorStyles = {
  orange: 'icon-box-achievements',
  green: 'icon-box-accuracy',
  blue: 'icon-box-primary',
  purple: 'icon-box-lessons',
  pink: 'icon-box-streak',
  cyan: 'icon-box-practice',
};

const hoverThemes = {
  orange: {
    border: 'hover:border-orange-500/50',
    shadow: 'hover:shadow-[0_10px_25px_-5px_rgba(249,115,22,0.25)]',
    bg: 'hover:bg-gradient-to-b hover:from-orange-500/[0.08] hover:to-transparent',
    iconHover: 'group-hover:scale-110 group-hover:shadow-[0_0_12px_rgba(249,115,22,0.35)]',
    textHover: 'group-hover:text-orange-400',
  },
  green: {
    border: 'hover:border-emerald-500/50',
    shadow: 'hover:shadow-[0_10px_25px_-5px_rgba(16,185,129,0.25)]',
    bg: 'hover:bg-gradient-to-b hover:from-emerald-500/[0.08] hover:to-transparent',
    iconHover: 'group-hover:scale-110 group-hover:shadow-[0_0_12px_rgba(16,185,129,0.35)]',
    textHover: 'group-hover:text-emerald-400',
  },
  blue: {
    border: 'hover:border-blue-500/50',
    shadow: 'hover:shadow-[0_10px_25px_-5px_rgba(59,130,246,0.25)]',
    bg: 'hover:bg-gradient-to-b hover:from-blue-500/[0.08] hover:to-transparent',
    iconHover: 'group-hover:scale-110 group-hover:shadow-[0_0_12px_rgba(59,130,246,0.35)]',
    textHover: 'group-hover:text-blue-400',
  },
  purple: {
    border: 'hover:border-purple-500/50',
    shadow: 'hover:shadow-[0_10px_25px_-5px_rgba(168,85,247,0.25)]',
    bg: 'hover:bg-gradient-to-b hover:from-purple-500/[0.08] hover:to-transparent',
    iconHover: 'group-hover:scale-110 group-hover:shadow-[0_0_12px_rgba(168,85,247,0.35)]',
    textHover: 'group-hover:text-purple-400',
  },
  pink: {
    border: 'hover:border-pink-500/50',
    shadow: 'hover:shadow-[0_10px_25px_-5px_rgba(236,72,153,0.25)]',
    bg: 'hover:bg-gradient-to-b hover:from-pink-500/[0.08] hover:to-transparent',
    iconHover: 'group-hover:scale-110 group-hover:shadow-[0_0_12px_rgba(236,72,153,0.35)]',
    textHover: 'group-hover:text-pink-400',
  },
  cyan: {
    border: 'hover:border-cyan-500/50',
    shadow: 'hover:shadow-[0_10px_25px_-5px_rgba(6,182,212,0.25)]',
    bg: 'hover:bg-gradient-to-b hover:from-cyan-500/[0.08] hover:to-transparent',
    iconHover: 'group-hover:scale-110 group-hover:shadow-[0_0_12px_rgba(6,182,212,0.35)]',
    textHover: 'group-hover:text-cyan-400',
  },
};

export const AchievementsGrid = ({ achievements = [] }) => {
  const earnedKeys = new Set(
    (achievements || [])
      .filter((a) => {
        if (typeof a === 'string') return true;
        if (typeof a?.unlocked === 'boolean') return a.unlocked;
        return Boolean(a?.key);
      })
      .map((a) => (typeof a === 'string' ? a : a?.key))
      .filter(Boolean)
  );

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {ACHIEVEMENTS_DEF.map((item, idx) => {
        const earned = earnedKeys.has(item.key);
        const Icon = earned ? item.icon : Lock;
        const colorClass = colorStyles[item.color] || colorStyles.purple;
        const theme = hoverThemes[item.color] || hoverThemes.purple;
        const staggerClass = `stagger-${Math.min(idx, 4)}`;

        return (
          <div
            key={item.key}
            className={`group relative card-glass animate-page-enter ${staggerClass} flex flex-col items-center gap-1.5 p-4 text-center rounded-2xl border border-slate-800/80 bg-[#0B132B]/60 transition-all duration-300 ease-out hover:-translate-y-1.5 cursor-default ${
              earned
                ? `${theme.border} ${theme.shadow} ${theme.bg}`
                : 'opacity-40 hover:opacity-70 hover:border-slate-700'
            }`}
          >
            <div
              className={`grid h-11 w-11 place-items-center rounded-xl transition-all duration-300 ease-out ${
                earned ? `${colorClass} shadow-xs ${theme.iconHover}` : 'text-muted-foreground bg-muted/40 group-hover:scale-105'
              }`}
            >
              <Icon size={20} aria-hidden="true" />
            </div>
            <span className={`text-sm font-semibold text-foreground transition-colors duration-200 ${earned ? theme.textHover : ''}`}>
              {item.name}
            </span>
            <span className="text-[11px] text-muted-foreground transition-colors group-hover:text-slate-300">
              {earned ? 'Earned' : item.desc}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default AchievementsGrid;
