import { Crown, Medal, Award, Zap, Target } from 'lucide-react';
import UserAvatar from '../common/UserAvatar';

export const PodiumCard = ({ user, rank }) => {
  if (!user) return null;

  const ranksConfig = {
    1: {
      title: "1st Place",
      badgeBg: "bg-amber-400 text-dark-950",
      ringColor: "ring-amber-400 shadow-amber-400/30",
      borderColor: "border-amber-400/40",
      bgGradient: "from-amber-500/15 via-dark-900 to-dark-900",
      icon: Crown,
      iconColor: "text-amber-400",
      height: "sm:-mt-4",
    },
    2: {
      title: "2nd Place",
      badgeBg: "bg-slate-300 text-dark-950",
      ringColor: "ring-slate-300 shadow-slate-300/20",
      borderColor: "border-slate-400/30",
      bgGradient: "from-slate-400/10 via-dark-900 to-dark-900",
      icon: Medal,
      iconColor: "text-slate-300",
      height: "sm:mt-2",
    },
    3: {
      title: "3rd Place",
      badgeBg: "bg-amber-700 text-white",
      ringColor: "ring-amber-600 shadow-amber-600/20",
      borderColor: "border-amber-700/30",
      bgGradient: "from-amber-700/10 via-dark-900 to-dark-900",
      icon: Award,
      iconColor: "text-amber-600",
      height: "sm:mt-4",
    },
  };

  const config = ranksConfig[rank] || ranksConfig[1];
  const Icon = config.icon;
  const staggerDelay = rank === 1 ? 'stagger-0' : rank === 2 ? 'stagger-1' : 'stagger-2';

  return (
    <div
      className={`animate-page-enter ${staggerDelay} relative rounded-3xl bg-gradient-to-b ${config.bgGradient} border ${config.borderColor} p-6 shadow-2xl backdrop-blur-xl flex flex-col items-center text-center transition-transform hover:-translate-y-1 ${config.height}`}
    >
      {/* Rank Badge */}
      <div className="absolute -top-3.5 px-3 py-1 rounded-full font-bold text-xs shadow-lg uppercase tracking-wider flex items-center gap-1.5" style={{ background: config.badgeBg }}>
        <Icon className="w-3.5 h-3.5" />
        {config.title}
      </div>

      {/* Avatar */}
      <div className="relative mt-3 mb-4">
        <UserAvatar
          src={user.avatar}
          name={user.name}
          username={user.username}
          className={`w-20 h-20 rounded-2xl ring-4 ${config.ringColor} shadow-xl`}
          textClassName="text-2xl"
        />
        {rank === 1 && (
          <div className="absolute -top-3 -right-2 p-1.5 rounded-full bg-amber-400 text-dark-950 shadow-md">
            <Crown className="w-4 h-4 fill-dark-950" />
          </div>
        )}
      </div>

      {/* Name & Username */}
      <h3 className="text-base font-bold text-white max-w-full truncate">{user.name}</h3>
      <p className="text-xs text-slate-400 -mt-0.5 mb-4 font-mono">@{user.username}</p>

      {/* Stats Pill */}
      <div className="w-full grid grid-cols-2 gap-2 bg-dark-850/90 border border-white/[0.06] rounded-2xl p-2.5">
        <div className="flex flex-col items-center">
          <span className="text-[10px] font-semibold uppercase text-slate-400 flex items-center gap-1">
            <Zap className="w-3 h-3 text-brand-pink" /> Speed
          </span>
          <span className="text-lg font-extrabold text-brand-pink font-mono">{user.wpm} <span className="text-xs text-slate-400">WPM</span></span>
        </div>
        <div className="flex flex-col items-center border-l border-white/[0.06]">
          <span className="text-[10px] font-semibold uppercase text-slate-400 flex items-center gap-1">
            <Target className="w-3 h-3 text-brand-cyan" /> Acc
          </span>
          <span className="text-lg font-extrabold text-brand-cyan font-mono">{user.accuracy}%</span>
        </div>
      </div>
    </div>
  );
};

export default PodiumCard;
