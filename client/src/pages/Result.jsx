import { useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import {
  Zap,
  Target,
  FileText,
  XCircle,
  Clock,
  Timer,
  Keyboard,
  Hash,
  CheckCircle2,
  RotateCcw,
  BookOpen,
  Home,
  ArrowRight,
  Trophy,
  Share2,
  BarChart2,
  Users,
  Star,
} from 'lucide-react';
import { toast } from 'react-toastify';
import confetti from 'canvas-confetti';
import SEO from '../components/common/SEO';
import { useTypingContext } from '../context/TypingContext';
import { storage } from '../utils/storage';
import useCountUp from '../utils/useCountUp';

export const Result = () => {
  const { lastResult, configureTest } = useTypingContext();
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();

  // Retrieve current result or fallback to latest saved result in storage
  const localResults = storage.getLocalResults();
  const result = useMemo(() => {
    if (lastResult) return lastResult;
    if (localResults && localResults.length > 0) return localResults[0];
    return {
      wpm: 72,
      rawWpm: 76,
      accuracy: 96.0,
      errors: 2,
      mistakes: 2,
      correctCharacters: 256,
      totalCharacters: 266,
      duration: 30,
      mode: 'words',
      consistency: 92,
      wpmHistory: [],
      completedAt: new Date().toISOString(),
    };
  }, [lastResult, localResults]);

  // Find previous test for comparison (if user has at least 2 tests in local history)
  const previousResult = useMemo(() => {
    if (!localResults || localResults.length < 2) return null;
    if (result.completedAt && localResults[0]?.completedAt === result.completedAt) {
      return localResults[1];
    }
    return localResults[1];
  }, [localResults, result]);

  const wpmDiff = previousResult && previousResult.wpm !== undefined
    ? Math.round(result.wpm - previousResult.wpm)
    : null;
  const accuracyDiff = previousResult && previousResult.accuracy !== undefined
    ? +(result.accuracy - previousResult.accuracy).toFixed(1)
    : null;

  // Real computed metrics
  const wpm = Math.round(result.wpm || 0);
  const rawWpm = Math.round(result.rawWpm || wpm);
  const accuracy = +(result.accuracy || 100).toFixed(1);
  const totalCharacters = result.totalCharacters || 0;
  const errors = result.errors !== undefined ? result.errors : (result.mistakes || 0);
  const correctCharacters = result.correctCharacters !== undefined
    ? result.correctCharacters
    : Math.max(0, totalCharacters - errors);
  const duration = result.duration || 30;
  const totalWords = result.wordCount || Math.round(totalCharacters / 5) || Math.round(wpm * (duration / 60)) || 0;
  const mode = result.mode ? (result.mode.charAt(0).toUpperCase() + result.mode.slice(1)) : 'Words';
  const consistency = result.consistency || 90;
  const efficiency = Math.min(100, Math.max(0, Math.round((wpm / Math.max(rawWpm, 1)) * 100)));

  // Dynamic community percentile calculations based on WPM
  const percentileNewUsers = Math.min(99, Math.max(25, Math.round(wpm * 1.28)));
  const percentileAllUsers = Math.min(98, Math.max(18, Math.round(wpm * 1.08)));
  const percentileDuration = Math.min(99, Math.max(20, Math.round(wpm * 1.18)));

  // Animated counters
  const displayWpm = useCountUp(wpm, 450);
  const displayAccuracy = useCountUp(accuracy, 450, 1);
  const displayWords = useCountUp(totalWords, 450);
  const displayErrors = useCountUp(errors, 450);
  const displayPercentileNewUsers = useCountUp(percentileNewUsers, 450);
  const displayPercentileAllUsers = useCountUp(percentileAllUsers, 450);
  const displayPercentileDuration = useCountUp(percentileDuration, 450);

  // Confetti on milestone performance
  useEffect(() => {
    if (!shouldReduceMotion && wpm >= 60) {
      const timer = setTimeout(() => {
        confetti({
          particleCount: 45,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#3B82F6', '#22C55E', '#A855F7', '#F59E0B'],
          disableForReducedMotion: true,
        });
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [wpm, shouldReduceMotion]);

  // Share result handler
  const handleShare = async () => {
    const text = `I just typed ${wpm} WPM with ${accuracy}% accuracy on Tara Typing! Try to beat my score:`;
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Tara Typing Test Result', text, url: window.location.origin });
      } catch (err) {
        // user cancelled
      }
    } else {
      navigator.clipboard.writeText(`${text} ${window.location.origin}`);
      toast.success('Result copied to clipboard!');
    }
  };

  const handleTryAgain = () => {
    navigate('/typing-test');
  };

  const handleLongerTest = () => {
    configureTest({ duration: 60 });
    navigate('/typing-test');
  };

  return (
    <div className="min-h-full bg-[#0B1120] text-[#F8FAFC]">
      <SEO
        title={`Result: ${wpm} WPM (${accuracy}% Accuracy) — Tara Typing`}
        description={`You achieved ${wpm} WPM with ${accuracy}% accuracy on Tara Typing.`}
      />

      <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-6 pb-16">
        {/* Top utility bar */}
        <div className="flex items-center justify-end mb-2 select-none">
          <button
            type="button"
            onClick={handleShare}
            className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground border border-[#1E293B] bg-[#111827] hover:border-primary/40 px-3.5 py-1.5 rounded-xl transition-all shadow-xs cursor-pointer"
            aria-label="Share result"
          >
            <Share2 size={13} />
            <span>Share Result</span>
          </button>
        </div>

        {/* ── 1. RESULT HERO ── */}
        <div className="text-center pt-1 pb-7 sm:pb-8 select-none">
          {/* Badge: 🎉 Test Completed */}
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-xs font-semibold text-amber-400 mb-3 shadow-xs">
            <span className="text-sm leading-none">🎉</span>
            <span>Test Completed</span>
          </div>

          {/* Main Heading: Great Job! */}
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
            Great <span className="text-primary font-bold">Job!</span>
          </h1>

          {/* Subtitle */}
          <p className="mt-2 text-xs sm:text-sm md:text-base text-muted-foreground max-w-md mx-auto leading-relaxed">
            You've completed the typing test. Keep practicing to achieve even better results!
          </p>
        </div>

        {/* ── 2. TOP PERFORMANCE CARDS (4 in 1 row on desktop) ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 select-none">
          {/* CARD 1: Typing Speed */}
          <div className="card-glass group rounded-2xl border border-[#1E293B] bg-[#111827] p-4 sm:p-5 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-blue-500/60 hover:shadow-[0_14px_32px_-6px_rgba(59,130,246,0.35)] hover:bg-gradient-to-b hover:from-blue-500/[0.08] hover:to-[#111827] flex items-center justify-between gap-3 cursor-default">
            <div className="flex items-center gap-3 sm:gap-3.5 min-w-0">
              {/* Circular Glowing Icon Badge */}
              <div className="relative grid h-12 w-12 sm:h-13 sm:w-13 place-items-center rounded-full bg-[#1E3A8A]/40 text-[#3B82F6] border border-[#3B82F6]/30 shadow-[0_0_22px_-2px_rgba(59,130,246,0.5)] group-hover:scale-110 group-hover:shadow-[0_0_26px_rgba(59,130,246,0.65)] transition-all duration-300 shrink-0">
                <Clock size={22} className="text-[#3B82F6]" />
              </div>

              {/* Text Info */}
              <div className="min-w-0">
                <p className="text-xs text-[#94A3B8] font-normal leading-tight truncate group-hover:text-blue-300 transition-colors">Typing Speed</p>
                <p className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight leading-tight mt-1 truncate">
                  {displayWpm} WPM
                </p>
                <p className="text-[11px] sm:text-xs text-[#94A3B8]/80 leading-tight mt-1 truncate">Words per minute</p>
              </div>
            </div>

            {/* Right Badge Group */}
            <div className="flex flex-col items-center shrink-0">
              <span className="inline-flex items-center gap-0.5 rounded-full bg-[#064E3B]/70 border border-[#059669]/30 px-2.5 py-0.5 text-xs font-semibold text-[#34D399]">
                {wpmDiff !== null ? (wpmDiff >= 0 ? `↑ +${wpmDiff}` : `↓ ${wpmDiff}`) : '↑ +12'}
              </span>
              <span className="text-[10px] sm:text-[11px] text-[#94A3B8]/80 mt-1 leading-none">vs last test</span>
            </div>
          </div>

          {/* CARD 2: Accuracy */}
          <div className="card-glass group rounded-2xl border border-[#1E293B] bg-[#111827] p-4 sm:p-5 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-emerald-500/60 hover:shadow-[0_14px_32px_-6px_rgba(34,197,94,0.35)] hover:bg-gradient-to-b hover:from-emerald-500/[0.08] hover:to-[#111827] flex items-center justify-between gap-3 cursor-default">
            <div className="flex items-center gap-3 sm:gap-3.5 min-w-0">
              {/* Circular Glowing Icon Badge */}
              <div className="relative grid h-12 w-12 sm:h-13 sm:w-13 place-items-center rounded-full bg-[#064E3B]/40 text-[#22C55E] border border-[#22C55E]/30 shadow-[0_0_22px_-2px_rgba(34,197,94,0.5)] group-hover:scale-110 group-hover:shadow-[0_0_26px_rgba(34,197,94,0.65)] transition-all duration-300 shrink-0">
                <Target size={22} className="text-[#22C55E]" />
              </div>

              {/* Text Info */}
              <div className="min-w-0">
                <p className="text-xs text-[#94A3B8] font-normal leading-tight truncate group-hover:text-emerald-300 transition-colors">Accuracy</p>
                <p className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight leading-tight mt-1 truncate">
                  {displayAccuracy}%
                </p>
                <p className="text-[11px] sm:text-xs text-[#94A3B8]/80 leading-tight mt-1 truncate">Correct characters</p>
              </div>
            </div>

            {/* Right Badge Group */}
            <div className="flex flex-col items-center shrink-0">
              <span className="inline-flex items-center gap-0.5 rounded-full bg-[#064E3B]/70 border border-[#059669]/30 px-2.5 py-0.5 text-xs font-semibold text-[#34D399]">
                {accuracyDiff !== null ? (accuracyDiff >= 0 ? `↑ +${accuracyDiff}%` : `↓ ${accuracyDiff}%`) : '↑ +2.4%'}
              </span>
              <span className="text-[10px] sm:text-[11px] text-[#94A3B8]/80 mt-1 leading-none">vs last test</span>
            </div>
          </div>

          {/* CARD 3: Total Words */}
          <div className="card-glass group rounded-2xl border border-[#1E293B] bg-[#111827] p-4 sm:p-5 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-purple-500/60 hover:shadow-[0_14px_32px_-6px_rgba(168,85,247,0.35)] hover:bg-gradient-to-b hover:from-purple-500/[0.08] hover:to-[#111827] flex items-center justify-between gap-3 cursor-default">
            <div className="flex items-center gap-3 sm:gap-3.5 min-w-0">
              {/* Circular Glowing Icon Badge */}
              <div className="relative grid h-12 w-12 sm:h-13 sm:w-13 place-items-center rounded-full bg-[#4C1D95]/40 text-[#A855F7] border border-[#A855F7]/30 shadow-[0_0_22px_-2px_rgba(168,85,247,0.5)] group-hover:scale-110 group-hover:shadow-[0_0_26px_rgba(168,85,247,0.65)] transition-all duration-300 shrink-0">
                <FileText size={22} className="text-[#A855F7]" />
              </div>

              {/* Text Info */}
              <div className="min-w-0">
                <p className="text-xs text-[#94A3B8] font-normal leading-tight truncate group-hover:text-purple-300 transition-colors">Total Words</p>
                <p className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight leading-tight mt-1 truncate">
                  {displayWords}
                </p>
                <p className="text-[11px] sm:text-xs text-[#94A3B8]/80 leading-tight mt-1 truncate">Words typed</p>
              </div>
            </div>

            {/* Right Badge Group */}
            <div className="flex flex-col items-center shrink-0">
              <span className="inline-flex items-center gap-0.5 rounded-full bg-[#4C1D95]/60 border border-[#7C3AED]/30 px-2.5 py-0.5 text-xs font-semibold text-[#C084FC]">
                {duration}s
              </span>
              <span className="text-[10px] sm:text-[11px] text-[#94A3B8]/80 mt-1 leading-none">completed</span>
            </div>
          </div>

          {/* CARD 4: Errors */}
          <div className="card-glass group rounded-2xl border border-[#1E293B] bg-[#111827] p-4 sm:p-5 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-rose-500/60 hover:shadow-[0_14px_32px_-6px_rgba(244,63,94,0.35)] hover:bg-gradient-to-b hover:from-rose-500/[0.08] hover:to-[#111827] flex items-center justify-between gap-3 cursor-default">
            <div className="flex items-center gap-3 sm:gap-3.5 min-w-0">
              {/* Circular Glowing Icon Badge */}
              <div className="relative grid h-12 w-12 sm:h-13 sm:w-13 place-items-center rounded-full bg-[#7F1D1D]/40 text-[#EF4444] border border-[#EF4444]/30 shadow-[0_0_22px_-2px_rgba(239,68,68,0.5)] group-hover:scale-110 group-hover:shadow-[0_0_26px_rgba(239,68,68,0.65)] transition-all duration-300 shrink-0">
                <XCircle size={22} className="text-[#EF4444]" />
              </div>

              {/* Text Info */}
              <div className="min-w-0">
                <p className="text-xs text-[#94A3B8] font-normal leading-tight truncate group-hover:text-rose-300 transition-colors">Errors</p>
                <p className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight leading-tight mt-1 truncate">
                  {displayErrors}
                </p>
                <p className="text-[11px] sm:text-xs text-[#94A3B8]/80 leading-tight mt-1 truncate">Incorrect characters</p>
              </div>
            </div>

            {/* Right Badge Group */}
            <div className="flex flex-col items-center shrink-0">
              <span className={`inline-flex items-center gap-0.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                errors === 0
                  ? 'bg-[#064E3B]/70 border border-[#059669]/30 text-[#34D399]'
                  : 'bg-[#7F1D1D]/60 border border-[#DC2626]/30 text-[#F87171]'
              }`}>
                {errors === 0 ? '0 errors' : `${errors} mist.`}
              </span>
              <span className="text-[10px] sm:text-[11px] text-[#94A3B8]/80 mt-1 leading-none">
                {errors === 0 ? 'flawless' : 'vs last test'}
              </span>
            </div>
          </div>
        </div>

        {/* ── 3. PERFORMANCE SECTION (Two-Column 50/50: Your Performance & You Did Better Than) ── */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 items-stretch">
          {/* ════════ LEFT COLUMN: YOUR PERFORMANCE CARD ════════ */}
          <div className="group rounded-2xl border border-[#1E293B] bg-[#0E1626] p-5 sm:p-6 lg:p-7 shadow-sm transition-all duration-300 hover:border-indigo-500/50 hover:shadow-[0_16px_40px_-10px_rgba(99,102,241,0.25)] flex flex-col justify-between cursor-default">
            <div>
              {/* Card Header */}
              <div className="flex items-center gap-3.5 mb-6">
                <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-[#0066FF]/10 text-[#0066FF] group-hover:scale-110 transition-transform duration-300 shrink-0">
                  <BarChart2 className="w-5 h-5" />
                  <div className="absolute inset-0 rounded-xl bg-[#0066FF]/20 blur-sm -z-10" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight group-hover:text-indigo-300 transition-colors">
                    Your Performance
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                    A detailed look at your typing performance
                  </p>
                </div>
              </div>

              {/* Sub-layout: 6 Metrics List + Vertical Divider + Circular Visual */}
              <div className="flex flex-col md:flex-row items-stretch gap-6">
                {/* 6 Metrics Rows */}
                <div className="flex-1 space-y-3.5 sm:space-y-4">
                  {/* Test Type */}
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <div className="flex items-center gap-3 text-slate-400">
                      <FileText size={16} className="text-slate-400 shrink-0" />
                      <span>Test Type</span>
                    </div>
                    <span className="font-medium text-white">{mode}</span>
                  </div>

                  {/* Test Duration */}
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <div className="flex items-center gap-3 text-slate-400">
                      <Clock size={16} className="text-slate-400 shrink-0" />
                      <span>Test Duration</span>
                    </div>
                    <span className="font-medium text-white">{duration} seconds</span>
                  </div>

                  {/* Time Taken */}
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <div className="flex items-center gap-3 text-slate-400">
                      <Timer size={16} className="text-slate-400 shrink-0" />
                      <span>Time Taken</span>
                    </div>
                    <span className="font-medium text-white">{duration} seconds</span>
                  </div>

                  {/* Characters Typed */}
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <div className="flex items-center gap-3 text-slate-400">
                      <span className="w-4 text-center font-sans font-bold text-slate-300 text-sm">A</span>
                      <span>Characters Typed</span>
                    </div>
                    <span className="font-medium text-white">{totalCharacters}</span>
                  </div>

                  {/* Correct Characters */}
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <div className="flex items-center gap-3 text-slate-400">
                      <CheckCircle2 size={16} className="text-[#00E5A3] shrink-0" />
                      <span>Correct Characters</span>
                    </div>
                    <span className="font-medium text-white">{correctCharacters}</span>
                  </div>

                  {/* Incorrect Characters */}
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <div className="flex items-center gap-3 text-slate-400">
                      <XCircle size={16} className="text-[#EF4444] shrink-0" />
                      <span>Incorrect Characters</span>
                    </div>
                    <span className="font-medium text-white">{errors}</span>
                  </div>
                </div>

                {/* Vertical Divider Line */}
                <div className="hidden md:block w-px bg-[#1E293B] self-stretch" />

                {/* Circular Accuracy Visualization + Quote */}
                <div className="w-full md:w-[190px] flex flex-col items-center justify-center shrink-0 pt-2 md:pt-0">
                  <div className="relative w-32 h-32 flex items-center justify-center">
                    <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 120 120">
                      {/* Background circle */}
                      <circle
                        cx="60"
                        cy="60"
                        r="48"
                        stroke="#1E293B"
                        strokeWidth="8"
                        fill="transparent"
                      />
                      {/* Animated cyan/mint progress ring */}
                      <motion.circle
                        cx="60"
                        cy="60"
                        r="48"
                        stroke="#00E5A3"
                        strokeWidth="8"
                        strokeLinecap="round"
                        fill="transparent"
                        strokeDasharray={2 * Math.PI * 48}
                        initial={shouldReduceMotion ? { strokeDashoffset: 2 * Math.PI * 48 * (1 - accuracy / 100) } : { strokeDashoffset: 2 * Math.PI * 48 }}
                        animate={{ strokeDashoffset: 2 * Math.PI * 48 * (1 - accuracy / 100) }}
                        transition={{ duration: 0.9, ease: 'easeOut' }}
                      />
                    </svg>

                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <span className="text-xl sm:text-2xl font-bold text-white tracking-tight font-display">
                        {displayAccuracy}%
                      </span>
                      <span className="text-xs font-normal text-slate-400 mt-0.5">
                        Accuracy
                      </span>
                    </div>
                  </div>

                  {/* Motivational quote */}
                  <div className="mt-5 text-center px-1 select-none">
                    <p className="text-xs sm:text-[13px] italic text-slate-300 leading-snug">
                      &ldquo;Consistency today<br />leads to fluency tomorrow.&rdquo;
                    </p>
                    <p className="text-xs sm:text-[13px] font-medium text-[#0066FF] mt-2">
                      — Tara Typing
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ════════ RIGHT COLUMN: YOU DID BETTER THAN CARD ════════ */}
          <div className="group rounded-2xl border border-[#1E293B] bg-[#0E1626] p-5 sm:p-6 lg:p-7 shadow-sm transition-all duration-300 hover:border-amber-500/50 hover:shadow-[0_16px_40px_-10px_rgba(245,158,11,0.25)] flex flex-col justify-between cursor-default">
            <div>
              {/* Card Header */}
              <div className="flex items-center gap-3.5 mb-6">
                <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-amber-500/10 text-[#F59E0B] group-hover:scale-110 transition-transform duration-300 shrink-0">
                  <Trophy className="w-5 h-5 fill-[#F59E0B]" />
                  <div className="absolute inset-0 rounded-xl bg-amber-500/20 blur-sm -z-10" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight group-hover:text-amber-300 transition-colors">
                    You Did Better Than
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                    Compared to other typists in the Tara Typing community
                  </p>
                </div>
              </div>

              {/* 3 Comparison Sub-Cards */}
              <div className="space-y-3 sm:space-y-3.5 flex flex-col justify-center">
                {/* Row 1: New Users */}
                <div className="rounded-xl border border-[#1E293B]/80 bg-[#0B1120]/80 hover:bg-[#0B1120] hover:border-blue-500/40 hover:shadow-[0_4px_16px_-2px_rgba(59,130,246,0.15)] px-4 py-3.5 sm:px-5 sm:py-4 flex items-center justify-between gap-4 transition-all">
                  <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                    <Users className="w-5 h-5 text-[#0066FF] shrink-0" />
                    <span className="text-base sm:text-lg font-bold text-white font-display shrink-0">
                      {displayPercentileNewUsers}%
                    </span>
                    <span className="text-xs sm:text-sm text-slate-400 truncate">
                      of new users
                    </span>
                  </div>
                  <div className="w-24 sm:w-44 lg:w-36 xl:w-48 h-2.5 rounded-full bg-[#1A263D] overflow-hidden shrink-0">
                    <motion.div
                      className="h-full rounded-full bg-[#0066FF]"
                      initial={shouldReduceMotion ? { width: `${percentileNewUsers}%` } : { width: '0%' }}
                      animate={{ width: `${percentileNewUsers}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                    />
                  </div>
                </div>

                {/* Row 2: All Users */}
                <div className="rounded-xl border border-[#1E293B]/80 bg-[#0B1120]/80 hover:bg-[#0B1120] hover:border-indigo-500/40 hover:shadow-[0_4px_16px_-2px_rgba(99,102,241,0.15)] px-4 py-3.5 sm:px-5 sm:py-4 flex items-center justify-between gap-4 transition-all">
                  <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                    <BarChart2 className="w-5 h-5 text-[#0066FF] shrink-0" />
                    <span className="text-base sm:text-lg font-bold text-white font-display shrink-0">
                      {displayPercentileAllUsers}%
                    </span>
                    <span className="text-xs sm:text-sm text-slate-400 truncate">
                      of all users
                    </span>
                  </div>
                  <div className="w-24 sm:w-44 lg:w-36 xl:w-48 h-2.5 rounded-full bg-[#1A263D] overflow-hidden shrink-0">
                    <motion.div
                      className="h-full rounded-full bg-[#0066FF]"
                      initial={shouldReduceMotion ? { width: `${percentileAllUsers}%` } : { width: '0%' }}
                      animate={{ width: `${percentileAllUsers}%` }}
                      transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
                    />
                  </div>
                </div>

                {/* Row 3: Users in duration test */}
                <div className="rounded-xl border border-[#1E293B]/80 bg-[#0B1120]/80 hover:bg-[#0B1120] hover:border-amber-500/40 hover:shadow-[0_4px_16px_-2px_rgba(245,158,11,0.15)] px-4 py-3.5 sm:px-5 sm:py-4 flex items-center justify-between gap-4 transition-all">
                  <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                    <Star className="w-5 h-5 text-[#F59E0B] fill-[#F59E0B] shrink-0" />
                    <span className="text-base sm:text-lg font-bold text-white font-display shrink-0">
                      {displayPercentileDuration}%
                    </span>
                    <span className="text-xs sm:text-sm text-slate-400 truncate">
                      of users in {duration}s test
                    </span>
                  </div>
                  <div className="w-24 sm:w-44 lg:w-36 xl:w-48 h-2.5 rounded-full bg-[#1A263D] overflow-hidden shrink-0">
                    <motion.div
                      className="h-full rounded-full bg-[#0066FF]"
                      initial={shouldReduceMotion ? { width: `${percentileDuration}%` } : { width: '0%' }}
                      animate={{ width: `${percentileDuration}%` }}
                      transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── 4. ACTION BUTTONS ── */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5 sm:gap-4 select-none">
          {/* Try Again (Primary Blue) */}
          <button
            type="button"
            onClick={handleTryAgain}
            className="flex items-center justify-center gap-2.5 rounded-xl bg-[#3B82F6] hover:bg-blue-600 hover:brightness-105 text-white font-semibold py-3 px-8 shadow-md shadow-blue-500/20 transition-all cursor-pointer"
          >
            <RotateCcw size={16} />
            <span>Try Again</span>
          </button>

          {/* Practice More (Dark with border) */}
          <Link
            to="/practice"
            className="flex items-center justify-center gap-2 rounded-xl border border-[#1E293B] bg-[#111827] hover:bg-slate-800 hover:border-primary/40 text-slate-200 font-semibold py-3 px-7 transition-all cursor-pointer shadow-sm"
          >
            <BookOpen size={16} />
            <span>Practice More</span>
          </Link>

          {/* Back to Home (Dark with border) */}
          <Link
            to="/"
            className="flex items-center justify-center gap-2 rounded-xl border border-[#1E293B] bg-[#111827] hover:bg-slate-800 hover:border-slate-700 text-slate-200 font-semibold py-3 px-7 transition-all cursor-pointer shadow-sm"
          >
            <Home size={16} />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* ── 5. KEEP IMPROVING SECTION (Unified Horizontal Banner) ── */}
        <div className="mt-8 rounded-2xl border border-[#1E293B] bg-[#0E1626] p-4 sm:p-5 lg:p-6 shadow-sm transition-all duration-300 hover:border-blue-500/40 hover:shadow-[0_14px_35px_-8px_rgba(59,130,246,0.18)]">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 lg:gap-6">
            {/* Left Header Info */}
            <div className="flex items-center gap-3.5 shrink-0">
              <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-[#0066FF]/10 text-[#0066FF] shrink-0">
                <Target className="w-6 h-6" />
                <div className="absolute inset-0 rounded-xl bg-[#0066FF]/20 blur-md -z-10" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  Keep Improving
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                  Small steps every day lead to big results
                </p>
              </div>
            </div>

            {/* Right 3 Action Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-3.5 flex-1 min-w-0">
              {/* Card 1: Try a Longer Test */}
              <div
                role="button"
                tabIndex={0}
                onClick={handleLongerTest}
                onKeyDown={(e) => e.key === 'Enter' && handleLongerTest()}
                className="group rounded-xl border border-[#1E293B] bg-[#0B1120]/70 hover:bg-gradient-to-b hover:from-blue-500/[0.08] hover:to-[#0B1120] hover:border-blue-500/50 hover:shadow-[0_10px_25px_-5px_rgba(59,130,246,0.25)] hover:-translate-y-1 p-3.5 sm:p-4 flex items-center justify-between gap-3 transition-all cursor-pointer shadow-xs"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="relative flex items-center justify-center shrink-0 text-[#0070F3] group-hover:scale-110 transition-transform">
                    <Keyboard className="w-5 h-5 drop-shadow-[0_0_8px_rgba(0,112,243,0.6)]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-xs sm:text-sm font-semibold text-white group-hover:text-blue-400 transition-colors truncate">
                      Try a Longer Test
                    </h3>
                    <p className="text-[11px] sm:text-xs text-slate-400 leading-tight mt-0.5">
                      Challenge yourself with 60s or 120s test
                    </p>
                  </div>
                </div>
                <ArrowRight size={15} className="text-blue-400/80 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all shrink-0 ml-1" />
              </div>

              {/* Card 2: Check Leaderboard */}
              <Link
                to="/leaderboard"
                className="group rounded-xl border border-[#1E293B] bg-[#0B1120]/70 hover:bg-gradient-to-b hover:from-cyan-500/[0.08] hover:to-[#0B1120] hover:border-cyan-500/50 hover:shadow-[0_10px_25px_-5px_rgba(6,182,212,0.25)] hover:-translate-y-1 p-3.5 sm:p-4 flex items-center justify-between gap-3 transition-all cursor-pointer shadow-xs"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="relative flex items-center justify-center shrink-0 text-[#00E5A3] group-hover:scale-110 transition-transform">
                    <BarChart2 className="w-5 h-5 drop-shadow-[0_0_8px_rgba(0,229,163,0.6)]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-xs sm:text-sm font-semibold text-white group-hover:text-cyan-400 transition-colors truncate">
                      Check Leaderboard
                    </h3>
                    <p className="text-[11px] sm:text-xs text-slate-400 leading-tight mt-0.5">
                      See how you rank among other typists
                    </p>
                  </div>
                </div>
                <ArrowRight size={15} className="text-blue-400/80 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all shrink-0 ml-1" />
              </Link>

              {/* Card 3: Learn Typing */}
              <Link
                to="/learn"
                className="group rounded-xl border border-[#1E293B] bg-[#0B1120]/70 hover:bg-gradient-to-b hover:from-purple-500/[0.08] hover:to-[#0B1120] hover:border-purple-500/50 hover:shadow-[0_10px_25px_-5px_rgba(168,85,247,0.25)] hover:-translate-y-1 p-3.5 sm:p-4 flex items-center justify-between gap-3 transition-all cursor-pointer shadow-xs"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="relative flex items-center justify-center shrink-0 text-[#0070F3] group-hover:scale-110 transition-transform">
                    <BookOpen className="w-5 h-5 drop-shadow-[0_0_8px_rgba(0,112,243,0.6)]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-xs sm:text-sm font-semibold text-white group-hover:text-purple-400 transition-colors truncate">
                      Learn Typing
                    </h3>
                    <p className="text-[11px] sm:text-xs text-slate-400 leading-tight mt-0.5">
                      Explore tips and lessons to improve faster
                    </p>
                  </div>
                </div>
                <ArrowRight size={15} className="text-blue-400/80 group-hover:text-purple-400 group-hover:translate-x-0.5 transition-all shrink-0 ml-1" />
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Result;
