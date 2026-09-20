/**
 * Standard Typing Formulae & Calculations
 */

// Net WPM: (correct characters / 5) / elapsed minutes
export const calculateWPM = (correctChars, elapsedSeconds) => {
  if (!elapsedSeconds || elapsedSeconds <= 0) return 0;
  const minutes = elapsedSeconds / 60;
  const words = correctChars / 5;
  return Math.max(0, Math.round(words / minutes));
};

// Raw WPM: (total typed characters / 5) / elapsed minutes
export const calculateRawWPM = (totalChars, elapsedSeconds) => {
  if (!elapsedSeconds || elapsedSeconds <= 0) return 0;
  const minutes = elapsedSeconds / 60;
  const words = totalChars / 5;
  return Math.max(0, Math.round(words / minutes));
};

// Accuracy: (correct characters / total typed characters) * 100
export const calculateAccuracy = (correctChars, totalChars) => {
  if (!totalChars || totalChars <= 0) return 100;
  const acc = (correctChars / totalChars) * 100;
  return Math.min(100, Math.max(0, Math.round(acc * 10) / 10));
};

// Consistency: Calculates stability of typing speed across interval checkpoints (0-100%)
export const calculateConsistency = (wpmHistory = []) => {
  if (wpmHistory.length < 3) return 95;
  const values = wpmHistory.map(h => (typeof h === 'number' ? h : h.wpm || 0)).filter(v => v > 0);
  if (values.length < 2) return 95;

  const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
  if (mean === 0) return 0;

  const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
  const stdDev = Math.sqrt(variance);
  const coefficientOfVariation = (stdDev / mean) * 100;

  // Map CV to consistency (lower variance = higher consistency)
  const consistency = Math.max(0, Math.min(100, Math.round(100 - coefficientOfVariation)));
  return consistency;
};

// Performance classification and feedback
export const getPerformanceRating = (wpm, accuracy) => {
  if (wpm >= 100 && accuracy >= 97) {
    return {
      tier: "Legendary",
      badge: "⚡ Master Typist",
      color: "from-amber-400 to-yellow-500",
      textColor: "text-amber-400",
      borderColor: "border-amber-500/40",
      bgGlow: "shadow-amber-500/20",
      message: "Phenomenal speed and laser precision! You are in the top 1% of typists."
    };
  } else if (wpm >= 75 && accuracy >= 95) {
    return {
      tier: "Excellent",
      badge: "🔥 Speed Demon",
      color: "from-brand-purple to-brand-pink",
      textColor: "text-brand-pink",
      borderColor: "border-brand-purple/40",
      bgGlow: "shadow-brand-purple/25",
      message: "Outstanding performance! Your typing flow is exceptionally smooth and fast."
    };
  } else if (wpm >= 50 && accuracy >= 90) {
    return {
      tier: "Great",
      badge: "✨ Swift Typist",
      color: "from-brand-cyan to-blue-500",
      textColor: "text-brand-cyan",
      borderColor: "border-brand-cyan/40",
      bgGlow: "shadow-brand-cyan/20",
      message: "Great rhythm and solid accuracy! Keep practicing to breach higher speed tiers."
    };
  } else if (wpm >= 30) {
    return {
      tier: "Good",
      badge: "🎯 Steady Pacer",
      color: "from-emerald-400 to-teal-500",
      textColor: "text-emerald-400",
      borderColor: "border-emerald-500/40",
      bgGlow: "shadow-emerald-500/20",
      message: "Good effort! Focus on muscle memory and accuracy to naturally unlock more speed."
    };
  } else {
    return {
      tier: "Keep Practicing",
      badge: "🌱 Rising Star",
      color: "from-indigo-400 to-purple-500",
      textColor: "text-indigo-400",
      borderColor: "border-indigo-500/40",
      bgGlow: "shadow-indigo-500/20",
      message: "Every practice test builds finger agility. Consistent daily practice makes all the difference."
    };
  }
};
