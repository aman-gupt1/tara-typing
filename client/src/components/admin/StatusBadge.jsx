import React from 'react';

export const StatusBadge = ({ status, className = '' }) => {
  const norm = String(status || '').toLowerCase().trim();

  let styles = 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700';

  if (['active', 'valid', 'published', 'resolved', 'success'].includes(norm)) {
    styles = 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
  } else if (['suspended', 'suspicious', 'flagged', 'disabled', 'failed'].includes(norm)) {
    styles = 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20';
  } else if (['pending', 'under review', 'open', 'warning'].includes(norm)) {
    styles = 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
  } else if (['scheduled', 'draft', 'info'].includes(norm)) {
    styles = 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20';
  } else if (['completed', 'expired', 'dismissed'].includes(norm)) {
    styles = 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20';
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
      {status}
    </span>
  );
};

export default StatusBadge;
