import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const hoverStyles = {
  blue: {
    card: 'group hover:-translate-y-1.5 hover:z-10 hover:shadow-xl hover:shadow-blue-500/25 hover:border-blue-500/60 dark:hover:border-blue-400/60',
    icon: 'group-hover:scale-110 transition-transform duration-300',
    decor: (
      <div className="pointer-events-none absolute -right-6 -bottom-6 h-20 w-20 rounded-full bg-blue-500/15 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    ),
  },
  purple: {
    card: 'group hover:-translate-y-1.5 hover:z-10 hover:shadow-xl hover:shadow-purple-500/25 hover:border-purple-500/60 dark:hover:border-purple-400/60',
    icon: 'group-hover:scale-110 transition-transform duration-300',
    decor: (
      <div className="pointer-events-none absolute -right-6 -bottom-6 h-20 w-20 rounded-full bg-purple-500/15 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    ),
  },
  emerald: {
    card: 'group hover:-translate-y-1.5 hover:z-10 hover:shadow-xl hover:shadow-emerald-500/25 hover:border-emerald-500/60 dark:hover:border-emerald-400/60',
    icon: 'group-hover:scale-110 transition-transform duration-300',
    decor: (
      <div className="pointer-events-none absolute -right-6 -bottom-6 h-20 w-20 rounded-full bg-emerald-500/15 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    ),
  },
  amber: {
    card: 'group hover:-translate-y-1.5 hover:z-10 hover:shadow-xl hover:shadow-amber-500/25 hover:border-amber-500/60 dark:hover:border-amber-400/60',
    icon: 'group-hover:scale-110 transition-transform duration-300',
    decor: (
      <div className="pointer-events-none absolute -right-6 -bottom-6 h-20 w-20 rounded-full bg-amber-500/15 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    ),
  },
  pink: {
    card: 'group hover:-translate-y-1.5 hover:z-10 hover:shadow-xl hover:shadow-pink-500/25 hover:border-pink-500/60 dark:hover:border-pink-400/60',
    icon: 'group-hover:scale-110 transition-transform duration-300',
    decor: (
      <div className="pointer-events-none absolute -right-6 -bottom-6 h-20 w-20 rounded-full bg-pink-500/15 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    ),
  },
  teal: {
    card: 'group hover:-translate-y-1.5 hover:z-10 hover:shadow-xl hover:shadow-teal-500/25 hover:border-teal-500/60 dark:hover:border-teal-400/60',
    icon: 'group-hover:scale-110 transition-transform duration-300',
    decor: (
      <div className="pointer-events-none absolute -right-6 -bottom-6 h-20 w-20 rounded-full bg-teal-500/15 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    ),
  },
  rose: {
    card: 'group hover:-translate-y-1.5 hover:z-10 hover:shadow-xl hover:shadow-rose-500/25 hover:border-rose-500/60 dark:hover:border-rose-400/60',
    icon: 'group-hover:scale-110 transition-transform duration-300',
    decor: (
      <div className="pointer-events-none absolute -right-6 -bottom-6 h-20 w-20 rounded-full bg-rose-500/15 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    ),
  },
  cyan: {
    card: 'group hover:-translate-y-1.5 hover:z-10 hover:shadow-xl hover:shadow-cyan-500/25 hover:border-cyan-500/60 dark:hover:border-cyan-400/60',
    icon: 'group-hover:scale-110 transition-transform duration-300',
    decor: (
      <div className="pointer-events-none absolute -right-6 -bottom-6 h-20 w-20 rounded-full bg-cyan-500/15 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    ),
  },
  indigo: {
    card: 'group hover:-translate-y-1.5 hover:z-10 hover:shadow-xl hover:shadow-indigo-500/25 hover:border-indigo-500/60 dark:hover:border-indigo-400/60',
    icon: 'group-hover:scale-110 transition-transform duration-300',
    decor: (
      <div className="pointer-events-none absolute -right-6 -bottom-6 h-20 w-20 rounded-full bg-indigo-500/15 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    ),
  },
};

export const StatCard = ({
  title,
  value,
  change,
  isPositive = true,
  timeframe = 'vs last month',
  icon: Icon,
  colorClass = 'from-purple-500/20 to-indigo-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
  hoverEffect = 'blue',
  className = '',
}) => {
  const currentEffect = hoverStyles[hoverEffect] || hoverStyles.blue;

  return (
    <div
      className={`relative overflow-hidden rounded-xl sm:rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900/90 p-3 sm:p-4 shadow-sm transition-all duration-300 transform-gpu cursor-default ${currentEffect.card} ${className}`}
    >
      {/* Decorative hover gradient/glow element */}
      {currentEffect.decor}

      <div className="flex items-start justify-between gap-2 relative z-10">
        <div className="min-w-0 flex-1">
          <p className="text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 truncate leading-tight">
            {title}
          </p>
          <h3 className="mt-1 text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-display leading-tight truncate">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </h3>
        </div>

        {Icon && (
          <div
            className={`grid h-8 w-8 sm:h-9 sm:w-9 shrink-0 place-items-center rounded-lg sm:rounded-xl border bg-gradient-to-br transition-all duration-300 ${colorClass} ${currentEffect.icon}`}
          >
            <Icon size={16} className="stroke-[2.2] sm:w-[17px] sm:h-[17px]" />
          </div>
        )}
      </div>

      <div className="mt-2.5 flex items-center gap-1.5 text-[11px] relative z-10">
        {change !== undefined && (
          <span
            className={`inline-flex items-center gap-0.5 font-bold shrink-0 ${
              isPositive
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-rose-600 dark:text-rose-400'
            }`}
          >
            {isPositive ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
            {Math.abs(change)}%
          </span>
        )}
        <span className="text-slate-400 dark:text-slate-500 truncate text-[10px] sm:text-[11px]">
          {timeframe}
        </span>
      </div>
    </div>
  );
};

export default StatCard;
