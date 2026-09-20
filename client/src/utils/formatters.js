export const formatSeconds = (totalSeconds) => {
  if (totalSeconds === undefined || totalSeconds === null) return "0:00";
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
};

export const formatNumber = (num) => {
  if (num === undefined || num === null) return '0';
  return new Intl.NumberFormat('en-US').format(num);
};

export const formatDuration = (seconds) => {
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  if (remainingSeconds === 0) return `${minutes}m`;
  return `${minutes}m ${remainingSeconds}s`;
};

/**
 * Format numbers compactly for public statistics.
 * Small values: 12 -> "12", 3 -> "3", 18 -> "18"
 * Large values: 1000 -> "1K+", 1250 -> "1.2K+", 10000 -> "10K+", 250000 -> "250K+"
 * If addPlus is false: e.g. Best WPM 154 -> "154" without "+"
 */
export const formatCompactNumber = (num, addPlus = true) => {
  if (num === undefined || num === null || isNaN(Number(num))) return '—';
  const n = Number(num);
  if (n < 0) return `${n}`;
  if (n < 1000) return `${n}`;

  const formatWithUnit = (divisor, unit) => {
    const divided = n / divisor;
    if (divided % 1 === 0 || n >= 10000) {
      return `${Math.floor(divided)}${unit}${addPlus ? '+' : ''}`;
    }
    const truncated = Math.floor(divided * 10) / 10;
    return `${truncated}${unit}${addPlus ? '+' : ''}`;
  };

  if (n >= 1000000) {
    return formatWithUnit(1000000, 'M');
  }
  return formatWithUnit(1000, 'K');
};

