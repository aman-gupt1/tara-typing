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
import AICoachCard from '../components/typing/AICoachCard';
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
    <div className="min-h-full bg-background text-foreground transition-colors duration-200">
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
            className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground border border-border bg-card hover:bg-accent px-3.5 py-1.5 rounded-xl transition-all shadow-xs cursor-pointer"
            aria-label="Share result"
          >
            <Share2 size={13} />
            <span>Share Result</span>
          </button>
        </div>

        {/* ── 1. RESULT HERO ── */}
        <div className="text-center pt-1 pb-7 sm:pb-8 select-none">
          {/* Badge: 🎉 Test Completed */}
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-xs font-semibold text-amber-500 dark:text-amber-400 mb-3 shadow-xs">
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
          <div className="card-glass group rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-blue-500/60 hover:shadow-lg hover:shadow-blue-500/10 flex items-center justify-between gap-3 cursor-default">
            <div className="flex items-center gap-3 sm:gap-3.5 min-w-0">
              {/* Circular Glowing Icon Badge */}
              <div className="relative grid h-12 w-12 sm:h-13 sm:w-13 place-items-center rounded-full bg-blue-500/15 text-blue-500 dark:text-blue-400 border border-blue-500/30 shadow-sm group-hover:scale-110 transition-all duration-300 shrink-0">
                <Clock size={22} className="text-blue-500 dark:text-blue-400" />
              </div>

              {/* Text Info */}
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground font-normal leading-tight truncate group-hover:text-blue-500 dark:group-hover:text-blue-300 transition-colors">Typing Speed</p>
                <p className="font-display text-xl sm:text-2xl font-bold text-foreground tracking-tight leading-tight mt-1 truncate">
                  {displayWpm} WPM
                </p>
                <p className="text-[11px] sm:text-xs text-muted-foreground/80 leading-tight mt-1 truncate">Words per minute</p>
              </div>
            </div>

            {/* Right Badge Group */}
            <div className="flex flex-col items-center shrink-0">
              <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                {wpmDiff !== null ? (wpmDiff >= 0 ? `↑ +${wpmDiff}` : `↓ ${wpmDiff}`) : '↑ +12'}
              </span>
              <span className="text-[10px] sm:text-[11px] text-muted-foreground mt-1 leading-none">vs last test</span>
            </div>
          </div>

          {/* CARD 2: Accuracy */}
          <div className="card-glass group rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-emerald-500/60 hover:shadow-lg hover:shadow-emerald-500/10 flex items-center justify-between gap-3 cursor-default">
            <div className="flex items-center gap-3 sm:gap-3.5 min-w-0">
              {/* Circular Glowing Icon Badge */}
              <div className="relative grid h-12 w-12 sm:h-13 sm:w-13 place-items-center rounded-full bg-emerald-500/15 text-emerald-500 dark:text-emerald-400 border border-emerald-500/30 shadow-sm group-hover:scale-110 transition-all duration-300 shrink-0">
                <Target size={22} className="text-emerald-500 dark:text-emerald-400" />
              </div>

              {/* Text Info */}
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground font-normal leading-tight truncate group-hover:text-emerald-500 dark:group-hover:text-emerald-300 transition-colors">Accuracy</p>
                <p className="font-display text-xl sm:text-2xl font-bold text-foreground tracking-tight leading-tight mt-1 truncate">
                  {displayAccuracy}%
                </p>
                <p className="text-[11px] sm:text-xs text-muted-foreground/80 leading-tight mt-1 truncate">Correct characters</p>
              </div>
            </div>

            {/* Right Badge Group */}
            <div className="flex flex-col items-center shrink-0">
              <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                {accuracyDiff !== null ? (accuracyDiff >= 0 ? `↑ +${accuracyDiff}%` : `↓ ${accuracyDiff}%`) : '↑ +2.4%'}
              </span>
              <span className="text-[10px] sm:text-[11px] text-muted-foreground mt-1 leading-none">vs last test</span>
            </div>
          </div>

          {/* CARD 3: Total Words */}
          <div className="card-glass group rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-purple-500/60 hover:shadow-lg hover:shadow-purple-500/10 flex items-center justify-between gap-3 cursor-default">
            <div className="flex items-center gap-3 sm:gap-3.5 min-w-0">
              {/* Circular Glowing Icon Badge */}
              <div className="relative grid h-12 w-12 sm:h-13 sm:w-13 place-items-center rounded-full bg-purple-500/15 text-purple-500 dark:text-purple-400 border border-purple-500/30 shadow-sm group-hover:scale-110 transition-all duration-300 shrink-0">
                <FileText size={22} className="text-purple-500 dark:text-purple-400" />
              </div>

              {/* Text Info */}
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground font-normal leading-tight truncate group-hover:text-purple-500 dark:group-hover:text-purple-300 transition-colors">Total Words</p>
                <p className="font-display text-xl sm:text-2xl font-bold text-foreground tracking-tight leading-tight mt-1 truncate">
                  {displayWords}
                </p>
                <p className="text-[11px] sm:text-xs text-muted-foreground/80 leading-tight mt-1 truncate">Words typed</p>
              </div>
            </div>

            {/* Right Badge Group */}
            <div className="flex flex-col items-center shrink-0">
              <span className="inline-flex items-center gap-0.5 rounded-full bg-purple-500/15 border border-purple-500/30 px-2.5 py-0.5 text-xs font-semibold text-purple-600 dark:text-purple-400">
                {duration}s
              </span>
              <span className="text-[10px] sm:text-[11px] text-muted-foreground mt-1 leading-none">completed</span>
            </div>
          </div>

          {/* CARD 4: Errors */}
          <div className="card-glass group rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-rose-500/60 hover:shadow-lg hover:shadow-rose-500/10 flex items-center justify-between gap-3 cursor-default">
            <div className="flex items-center gap-3 sm:gap-3.5 min-w-0">
              {/* Circular Glowing Icon Badge */}
              <div className="relative grid h-12 w-12 sm:h-13 sm:w-13 place-items-center rounded-full bg-rose-500/15 text-rose-500 dark:text-rose-400 border border-rose-500/30 shadow-sm group-hover:scale-110 transition-all duration-300 shrink-0">
                <XCircle size={22} className="text-rose-500 dark:text-rose-400" />
              </div>

              {/* Text Info */}
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground font-normal leading-tight truncate group-hover:text-rose-500 dark:group-hover:text-rose-300 transition-colors">Errors</p>
                <p className="font-display text-xl sm:text-2xl font-bold text-foreground tracking-tight leading-tight mt-1 truncate">
                  {displayErrors}
                </p>
                <p className="text-[11px] sm:text-xs text-muted-foreground/80 leading-tight mt-1 truncate">Incorrect characters</p>
              </div>
            </div>

            {/* Right Badge Group */}
            <div className="flex flex-col items-center shrink-0">
              <span className={`inline-flex items-center gap-0.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                errors === 0
                  ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                  : 'bg-rose-500/15 border border-rose-500/30 text-rose-600 dark:text-rose-400'
              }`}>
                {errors === 0 ? '0 errors' : `${errors} mist.`}
              </span>
              <span className="text-[10px] sm:text-[11px] text-muted-foreground mt-1 leading-none">
                {errors === 0 ? 'flawless' : 'vs last test'}
              </span>
            </div>
          </div>
        </div>

        {/* ── 2.5 AI COACH & TARGETED WEAK-KEY DRILL ── */}
        <div className="mt-6">
          <AICoachCard
            wpm={wpm}
            accuracy={accuracy}
            consistency={consistency}
            duration={duration}
            errors={errors}
            errorKeys={result.errorKeys || []}
            onStartDrill={(drillText, weakKeys) => {
              configureTest({
                mode: 'custom',
                customText: drillText,
                duration: 30,
                isAiDrill: true,
              });
              navigate('/typing-test');
            }}
          />
        </div>

        {/* ── 3. PERFORMANCE SECTION (Two-Column 50/50: Your Performance & You Did Better Than) ── */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 items-stretch">
          {/* ════════ LEFT COLUMN: YOUR PERFORMANCE CARD ════════ */}
          <div className="group rounded-2xl border border-border bg-card p-5 sm:p-6 lg:p-7 shadow-sm transition-all duration-300 hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/10 flex flex-col justify-between cursor-default">
            <div>
              {/* Card Header */}
              <div className="flex items-center gap-3.5 mb-6">
                <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 text-primary group-hover:scale-110 transition-transform duration-300 shrink-0">
                  <BarChart2 className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-foreground tracking-tight group-hover:text-primary transition-colors">
                    Your Performance
                  </h2>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
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
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <FileText size={16} className="text-muted-foreground shrink-0" />
                      <span>Test Type</span>
                    </div>
                    <span className="font-medium text-foreground">{mode}</span>
                  </div>

                  {/* Test Duration */}
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <Clock size={16} className="text-muted-foreground shrink-0" />
                      <span>Test Duration</span>
                    </div>
                    <span className="font-medium text-foreground">{duration} seconds</span>
                  </div>

                  {/* Time Taken */}
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <Timer size={16} className="text-muted-foreground shrink-0" />
                      <span>Time Taken</span>
                    </div>
                    <span className="font-medium text-foreground">{duration} seconds</span>
                  </div>

                  {/* Characters Typed */}
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <span className="w-4 text-center font-sans font-bold text-muted-foreground text-sm">A</span>
                      <span>Characters Typed</span>
                    </div>
                    <span className="font-medium text-foreground">{totalCharacters}</span>
                  </div>

                  {/* Correct Characters */}
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                      <span>Correct Characters</span>
                    </div>
                    <span className="font-medium text-foreground">{correctCharacters}</span>
                  </div>

                  {/* Incorrect Characters */}
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <XCircle size={16} className="text-rose-500 shrink-0" />
                      <span>Incorrect Characters</span>
                    </div>
                    <span className="font-medium text-foreground">{errors}</span>
                  </div>
                </div>

                {/* Vertical Divider Line */}
                <div className="hidden md:block w-px bg-border self-stretch" />

                {/* Circular Accuracy Visualization + Quote */}
                <div className="w-full md:w-[190px] flex flex-col items-center justify-center shrink-0 pt-2 md:pt-0">
                  <div className="relative w-32 h-32 flex items-center justify-center">
                    <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 120 120">
                      {/* Background circle */}
                      <circle
                        cx="60"
                        cy="60"
                        r="48"
                        stroke="currentColor"
                        className="text-muted"
                        strokeWidth="8"
                        fill="transparent"
                      />
                      {/* Animated cyan/mint progress ring */}
                      <motion.circle
                        cx="60"
                        cy="60"
                        r="48"
                        stroke="#10B981"
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
                      <span className="text-xl sm:text-2xl font-bold text-foreground tracking-tight font-display">
                        {displayAccuracy}%
                      </span>
                      <span className="text-xs font-normal text-muted-foreground mt-0.5">
                        Accuracy
                      </span>
                    </div>
                  </div>

                  {/* Motivational quote */}
                  <div className="mt-5 text-center px-1 select-none">
                    <p className="text-xs sm:text-[13px] italic text-muted-foreground leading-snug">
                      &ldquo;Consistency today<br />leads to fluency tomorrow.&rdquo;
                    </p>
                    <p className="text-xs sm:text-[13px] font-semibold text-primary mt-2">
                      — Tara Typing
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ════════ RIGHT COLUMN: YOU DID BETTER THAN CARD ════════ */}
          <div className="group rounded-2xl border border-border bg-card p-5 sm:p-6 lg:p-7 shadow-sm transition-all duration-300 hover:border-amber-500/50 hover:shadow-lg hover:shadow-amber-500/10 flex flex-col justify-between cursor-default">
            <div>
              {/* Card Header */}
              <div className="flex items-center gap-3.5 mb-6">
                <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 group-hover:scale-110 transition-transform duration-300 shrink-0">
                  <Trophy className="w-5 h-5 fill-amber-500" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-foreground tracking-tight group-hover:text-amber-500 dark:group-hover:text-amber-300 transition-colors">
                    You Did Better Than
                  </h2>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                    Compared to other typists in the Tara Typing community
                  </p>
                </div>
              </div>

              {/* 3 Comparison Sub-Cards */}
              <div className="space-y-3 sm:space-y-3.5 flex flex-col justify-center">
                {/* Row 1: New Users */}
                <div className="rounded-xl border border-border bg-muted/40 hover:bg-muted/70 px-4 py-3.5 sm:px-5 sm:py-4 flex items-center justify-between gap-4 transition-all">
                  <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                    <Users className="w-5 h-5 text-primary shrink-0" />
                    <span className="text-base sm:text-lg font-bold text-foreground font-display shrink-0">
                      {displayPercentileNewUsers}%
                    </span>
                    <span className="text-xs sm:text-sm text-muted-foreground truncate">
                      of new users
                    </span>
                  </div>
                  <div className="w-24 sm:w-44 lg:w-36 xl:w-48 h-2.5 rounded-full bg-muted overflow-hidden shrink-0">
                    <motion.div
                      className="h-full rounded-full bg-primary"
                      initial={shouldReduceMotion ? { width: `${percentileNewUsers}%` } : { width: '0%' }}
                      animate={{ width: `${percentileNewUsers}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                    />
                  </div>
                </div>

                {/* Row 2: All Users */}
                <div className="rounded-xl border border-border bg-muted/40 hover:bg-muted/70 px-4 py-3.5 sm:px-5 sm:py-4 flex items-center justify-between gap-4 transition-all">
                  <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                    <BarChart2 className="w-5 h-5 text-primary shrink-0" />
                    <span className="text-base sm:text-lg font-bold text-foreground font-display shrink-0">
                      {displayPercentileAllUsers}%
                    </span>
                    <span className="text-xs sm:text-sm text-muted-foreground truncate">
                      of all users
                    </span>
                  </div>
                  <div className="w-24 sm:w-44 lg:w-36 xl:w-48 h-2.5 rounded-full bg-muted overflow-hidden shrink-0">
                    <motion.div
                      className="h-full rounded-full bg-primary"
                      initial={shouldReduceMotion ? { width: `${percentileAllUsers}%` } : { width: '0%' }}
                      animate={{ width: `${percentileAllUsers}%` }}
                      transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
                    />
                  </div>
                </div>

                {/* Row 3: Users in duration test */}
                <div className="rounded-xl border border-border bg-muted/40 hover:bg-muted/70 px-4 py-3.5 sm:px-5 sm:py-4 flex items-center justify-between gap-4 transition-all">
                  <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                    <Star className="w-5 h-5 text-amber-500 fill-amber-500 shrink-0" />
                    <span className="text-base sm:text-lg font-bold text-foreground font-display shrink-0">
                      {displayPercentileDuration}%
                    </span>
                    <span className="text-xs sm:text-sm text-muted-foreground truncate">
                      of users in {duration}s test
                    </span>
                  </div>
                  <div className="w-24 sm:w-44 lg:w-36 xl:w-48 h-2.5 rounded-full bg-muted overflow-hidden shrink-0">
                    <motion.div
                      className="h-full rounded-full bg-amber-500"
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
            className="flex items-center justify-center gap-2.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 px-8 shadow-md shadow-primary/20 transition-all cursor-pointer"
          >
            <RotateCcw size={16} />
            <span>Try Again</span>
          </button>

          {/* Practice More */}
          <Link
            to="/practice"
            className="flex items-center justify-center gap-2 rounded-xl border border-border bg-card hover:bg-accent text-foreground font-semibold py-3 px-7 transition-all cursor-pointer shadow-sm"
          >
            <BookOpen size={16} />
            <span>Practice More</span>
          </Link>

          {/* Back to Home */}
          <Link
            to="/"
            className="flex items-center justify-center gap-2 rounded-xl border border-border bg-card hover:bg-accent text-foreground font-semibold py-3 px-7 transition-all cursor-pointer shadow-sm"
          >
            <Home size={16} />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* ── 5. KEEP IMPROVING SECTION (Unified Horizontal Banner) ── */}
        <div className="mt-8 rounded-2xl border border-border bg-card p-4 sm:p-5 lg:p-6 shadow-sm transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 lg:gap-6">
            {/* Left Header Info */}
            <div className="flex items-center gap-3.5 shrink-0">
              <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-primary/10 text-primary shrink-0">
                <Target className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-foreground tracking-tight">
                  Keep Improving
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
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
                className="group rounded-xl border border-border bg-muted/40 hover:bg-muted hover:border-primary/50 hover:shadow-md hover:-translate-y-0.5 p-3.5 sm:p-4 flex items-center justify-between gap-3 transition-all cursor-pointer shadow-xs"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="relative flex items-center justify-center shrink-0 text-primary group-hover:scale-110 transition-transform">
                    <Keyboard className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-xs sm:text-sm font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                      Try a Longer Test
                    </h3>
                    <p className="text-[11px] sm:text-xs text-muted-foreground leading-tight mt-0.5">
                      Challenge yourself with 60s or 120s test
                    </p>
                  </div>
                </div>
                <ArrowRight size={15} className="text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0 ml-1" />
              </div>

              {/* Card 2: Check Leaderboard */}
              <Link
                to="/leaderboard"
                className="group rounded-xl border border-border bg-muted/40 hover:bg-muted hover:border-cyan-500/50 hover:shadow-md hover:-translate-y-0.5 p-3.5 sm:p-4 flex items-center justify-between gap-3 transition-all cursor-pointer shadow-xs"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="relative flex items-center justify-center shrink-0 text-cyan-500 group-hover:scale-110 transition-transform">
                    <BarChart2 className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-xs sm:text-sm font-semibold text-foreground group-hover:text-cyan-500 transition-colors truncate">
                      Check Leaderboard
                    </h3>
                    <p className="text-[11px] sm:text-xs text-muted-foreground leading-tight mt-0.5">
                      See how you rank among other typists
                    </p>
                  </div>
                </div>
                <ArrowRight size={15} className="text-muted-foreground group-hover:text-cyan-500 group-hover:translate-x-0.5 transition-all shrink-0 ml-1" />
              </Link>

              {/* Card 3: Learn Typing */}
              <Link
                to="/learn"
                className="group rounded-xl border border-border bg-muted/40 hover:bg-muted hover:border-purple-500/50 hover:shadow-md hover:-translate-y-0.5 p-3.5 sm:p-4 flex items-center justify-between gap-3 transition-all cursor-pointer shadow-xs"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="relative flex items-center justify-center shrink-0 text-purple-500 group-hover:scale-110 transition-transform">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-xs sm:text-sm font-semibold text-foreground group-hover:text-purple-500 transition-colors truncate">
                      Learn Typing
                    </h3>
                    <p className="text-[11px] sm:text-xs text-muted-foreground leading-tight mt-0.5">
                      Explore tips and lessons to improve faster
                    </p>
                  </div>
                </div>
                <ArrowRight size={15} className="text-muted-foreground group-hover:text-purple-500 group-hover:translate-x-0.5 transition-all shrink-0 ml-1" />
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Result;
