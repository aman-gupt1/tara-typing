import React, { useState, useEffect, useLayoutEffect, useRef, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  RotateCcw, Sliders, Play, Clock, Zap, Target, XCircle,
  Volume2, VolumeX, Eye, Check, Keyboard as KeyboardIcon,
  Sparkles, RefreshCw, AlertCircle, CheckSquare,
  TrendingUp, Lightbulb, Settings as SettingsIcon,
} from 'lucide-react';
import SEO from '../components/common/SEO';
import Keyboard from '../components/typing/Keyboard';
import CustomTextModal from '../components/typing/CustomTextModal';
import { useTypingContext } from '../context/TypingContext';
import { useSettings } from '../context/SettingsContext';
import { useAuth } from '../context/AuthContext';
import { typingService } from '../services/typingService';
import { practiceService } from '../services/practiceService';
import { challengeService } from '../services/challengeService';
import { toast } from 'react-toastify';
import { soundEngine } from '../utils/soundEngine';
import { getRandomWords, commonWords } from '../data/words';
import { getRandomQuote } from '../data/quotes';

const durations = [15, 30, 60, 120];

const modes = [
  { id: 'words',  label: 'Words'  },
  { id: 'quote',  label: 'Quote'  },
  { id: 'code',   label: 'Code'   },
  { id: 'custom', label: 'Custom' },
];

const difficulties = [
  { id: 'easy',   label: 'Easy'   },
  { id: 'medium', label: 'Medium' },
  { id: 'hard',   label: 'Hard'   },
];

const wordCountByDuration = {
  15: 50,
  30: 90,
  60: 160,
  120: 300,
};

const CODE_SNIPPETS = [
  "const calculateScore = (wpm, accuracy) => { const score = Math.round(wpm * (accuracy / 100)); return score; };",
  "function debounce(func, wait) { let timeout; return function(...args) { clearTimeout(timeout); timeout = setTimeout(() => func.apply(this, args), wait); }; }",
  "import React, { useState, useEffect } from 'react'; export default function App() { const [count, setCount] = useState(0); return <button onClick={() => setCount(count + 1)}>{count}</button>; }",
  "const filterValidUsers = (users) => users.filter(user => user.isActive && user.wpm >= 60).sort((a, b) => b.wpm - a.wpm);",
  "async function fetchData(url) { try { const res = await fetch(url); const data = await res.json(); return data; } catch (err) { console.error(err); } }",
  "const matrix = Array.from({ length: 5 }, () => Array(5).fill(0)); for (let r = 0; r < 5; r++) matrix[r][r] = 1;",
];

const EASY_WORDS = [
  "the", "be", "to", "of", "and", "a", "in", "that", "have", "it",
  "for", "not", "on", "with", "he", "as", "you", "do", "at", "this",
  "but", "his", "by", "from", "they", "we", "say", "her", "she", "or",
  "an", "will", "my", "one", "all", "would", "there", "their", "what", "so",
  "up", "out", "if", "about", "who", "get", "which", "go", "me", "when",
  "make", "can", "like", "time", "no", "just", "him", "know", "take", "into",
  "year", "your", "good", "some", "could", "them", "see", "other", "than", "then",
  "now", "look", "only", "come", "its", "over", "think", "also", "back", "after",
  "use", "two", "how", "our", "work", "first", "well", "way", "even", "new",
  "want", "any", "day", "most", "us", "fast", "hand", "mind", "life", "book"
];

const HARD_WORDS = [
  "Algorithm", "asynchronous", "concurrency", "cryptography", "polymorphism",
  "optimization!", "infrastructure;", "architecture", "microservices", "encapsulation",
  "scalability", "distributed", "kubernetes", "multithreading", "serialization",
  "vulnerability", "dependency", "authentication", "authorization", "reconciliation",
  "deterministic", "synchronization", "resilience", "interoperability", "virtualization",
  "asymptotic", "functional", "recursive", "declarative", "imperative", "compilation"
];

function normalizePassage(raw) {
  if (!raw) return '';
  return raw
    .replace(/\r\n/g, ' ')
    .replace(/\r/g, ' ')
    .replace(/\u2014|\u2013/g, '-') // em-dash, en-dash
    .replace(/[\u2018\u2019]/g, "'") // curly single quotes
    .replace(/[\u201C\u201D]/g, '"') // curly double quotes
    .replace(/\u00A0/g, ' ')         // non-breaking space
    .replace(/^\s+/, '');            // NEVER allow leading whitespace at index 0!
}

function getTextForMode(mode, duration, difficulty = 'easy', customText = '') {
  let rawText = '';
  if (mode === 'quote') {
    const q = getRandomQuote();
    rawText = `${q.text} - ${q.author}`;
  } else if (mode === 'code') {
    const snippet = CODE_SNIPPETS[Math.floor(Math.random() * CODE_SNIPPETS.length)];
    rawText = snippet;
  } else if (mode === 'custom' && customText) {
    rawText = customText;
  } else {
    const count = wordCountByDuration[duration] || 50;

    if (difficulty === 'easy') {
      const shuffled = [...EASY_WORDS].sort(() => 0.5 - Math.random());
      let res = [];
      while (res.length < count) res = res.concat(shuffled);
      rawText = res.slice(0, count).join(" ");
    } else if (difficulty === 'hard') {
      const shuffled = [...HARD_WORDS, ...commonWords.slice(20, 60)].sort(() => 0.5 - Math.random());
      let res = [];
      while (res.length < count) res = res.concat(shuffled);
      rawText = res.slice(0, count).join(" ");
    } else {
      // Medium (standard default)
      rawText = getRandomWords(count);
    }
  }

  return normalizePassage(rawText);
}

const ACHIEVEMENT_TITLES = {
  'first-test': 'First Steps',
  'speed-30': 'Getting Started (30 WPM)',
  'speed-50': 'Speed Typist (50 WPM)',
  'speed-75': 'Fast Fingers (75 WPM)',
  'speed-100': 'Century (100 WPM)',
  'accuracy-95': 'Precise (95% Accuracy)',
  'accuracy-100': 'Perfect Accuracy (100%)',
  'tests-10': 'Regular Typist (10 Tests)',
  'tests-50': 'Dedicated Typist (50 Tests)',
  'streak-7': 'Weekly Streak (7 Days)',
};

export const TypingTest = () => {
  const { testConfig, setTestConfig, setLastResult } = useTypingContext();
  const { soundEnabled, soundType, soundVolume } = useSettings();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [duration, setDuration]     = useState(testConfig.duration || 30);
  const [mode, setMode]             = useState(testConfig.mode || 'words');
  const [difficulty, setDifficulty] = useState('easy');
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);

  // Settings state (with localStorage persistence)
  const [showLiveWpm, setShowLiveWpm]             = useState(() => localStorage.getItem('tara_live_wpm') !== 'false');
  const [showLiveAccuracy, setShowLiveAccuracy]   = useState(() => localStorage.getItem('tara_live_acc') !== 'false');
  const [highlightLetter, setHighlightLetter]     = useState(() => localStorage.getItem('tara_hl_letter') !== 'false');
  const [soundOnError, setSoundOnError]           = useState(() => localStorage.getItem('tara_snd_err') === 'true');
  const [showKeyboard, setShowKeyboard]           = useState(() => localStorage.getItem('tara_show_kb') !== 'false');
  const [smoothCaret, setSmoothCaret]             = useState(() => localStorage.getItem('tara_smooth_caret') !== 'false');

  const [text, setText]           = useState(() => getTextForMode(mode, duration, difficulty, testConfig.customText));
  const [typed, setTyped]         = useState('');
  const [started, setStarted]     = useState(false);
  const [finished, setFinished]   = useState(false);
  const [timeLeft, setTimeLeft]   = useState(duration);
  const [elapsed, setElapsed]     = useState(0);
  const [lastKey, setLastKey]     = useState(null);

  // Synchronous refs to prevent race conditions or stale closures
  const textRef = useRef(text);
  textRef.current = text;
  const typedRef = useRef('');
  const startedRef = useRef(false);
  const finishedRef = useRef(false);

  const inputRef = useRef(null);
  const textContainerRef = useRef(null);
  const textWrapperRef = useRef(null);
  const caretRef = useRef(null);
  const firstCharRef = useRef(null);
  const [lineHeight, setLineHeight] = useState(0);
  const [lineOffset, setLineOffset] = useState(0);
  const startTimeRef = useRef(null);
  const wpmHistoryRef = useRef([]);
  const durationRef = useRef(duration);
  durationRef.current = duration;

  // Persist settings
  useEffect(() => {
    localStorage.setItem('tara_live_wpm', showLiveWpm);
    localStorage.setItem('tara_live_acc', showLiveAccuracy);
    localStorage.setItem('tara_hl_letter', highlightLetter);
    localStorage.setItem('tara_snd_err', soundOnError);
    localStorage.setItem('tara_show_kb', showKeyboard);
    localStorage.setItem('tara_smooth_caret', smoothCaret);
  }, [showLiveWpm, showLiveAccuracy, highlightLetter, soundOnError, showKeyboard, smoothCaret]);

  // Live stats calculation
  const stats = useMemo(() => {
    let correct = 0;
    let errors = 0;
    for (let i = 0; i < typed.length; i++) {
      if (typed[i] === text[i]) correct++;
      else errors++;
    }
    const minutes = Math.max(elapsed, 1) / 60;
    const wpm = started && elapsed > 0 ? Math.round(correct / 5 / minutes) : 0;
    const rawWpm = started && elapsed > 0 ? Math.round(typed.length / 5 / minutes) : 0;
    const accuracy = typed.length ? +((correct / typed.length) * 100).toFixed(1) : 100;
    return { correct, errors, wpm, rawWpm, accuracy, totalChars: typed.length };
  }, [typed, text, elapsed, started]);

  // Word counts for progress display (e.g. "0 / 50 words")
  const totalWords = useMemo(() => text.trim().split(/\s+/).filter(Boolean).length, [text]);
  const completedWords = useMemo(() => {
    if (!typed) return 0;
    return text.slice(0, typed.length).trim().split(/\s+/).filter(Boolean).length;
  }, [typed, text]);

  // Restart function
  const restart = useCallback(
    (newDuration = durationRef.current, newMode = mode, newDiff = difficulty, newCustom = '') => {
      const nextText = getTextForMode(newMode, newDuration, newDiff, newCustom || testConfig.customText);
      textRef.current = nextText;
      typedRef.current = '';
      startedRef.current = false;
      finishedRef.current = false;

      setText(nextText);
      setTyped('');
      setLineOffset(0);
      setStarted(false);
      setFinished(false);
      setElapsed(0);
      setTimeLeft(newDuration);
      setLastKey(null);
      wpmHistoryRef.current = [];
      setTimeout(() => inputRef.current?.focus(), 50);
    },
    [mode, difficulty, testConfig.customText]
  );

  // Reset function (resets progress on same text)
  const reset = useCallback(() => {
    typedRef.current = '';
    startedRef.current = false;
    finishedRef.current = false;

    setTyped('');
    setLineOffset(0);
    setStarted(false);
    setFinished(false);
    setElapsed(0);
    setTimeLeft(durationRef.current);
    setLastKey(null);
    wpmHistoryRef.current = [];
    setTimeout(() => inputRef.current?.focus(), 50);
  }, []);

  // Live stats ref to keep timer effect stable without teardown on every keystroke
  const statsRef = useRef(stats);
  statsRef.current = stats;

  // Finish function
  const handleFinish = useCallback(
    async (totalSeconds) => {
      if (finishedRef.current) return;
      finishedRef.current = true;
      setFinished(true);

      const minutes = Math.max(totalSeconds, 1) / 60;
      let correct = 0;
      let errors = 0;
      const completedTyped = typedRef.current;
      const targetText = textRef.current;
      for (let i = 0; i < completedTyped.length; i++) {
        if (completedTyped[i] === targetText[i]) correct++;
        else errors++;
      }
      const finalWpm = Math.round(correct / 5 / minutes);
      const finalRawWpm = Math.round(completedTyped.length / 5 / minutes);
      const finalAccuracy = completedTyped.length ? +((correct / completedTyped.length) * 100).toFixed(1) : 100;
      const consistency = Math.min(100, Math.max(70, Math.round(100 - (errors / Math.max(completedTyped.length, 1)) * 100)));

      const resultPayload = {
        wpm: finalWpm,
        rawWpm: finalRawWpm,
        accuracy: finalAccuracy,
        errors,
        mistakes: errors,
        correctCharacters: correct,
        totalCharacters: completedTyped.length,
        duration: durationRef.current,
        mode,
        consistency,
        wpmHistory: wpmHistoryRef.current.length > 0 ? wpmHistoryRef.current : [{ second: 1, wpm: finalWpm }],
        completedAt: new Date().toISOString(),
      };

      setLastResult(resultPayload);

      // Save typing result to backend / local storage
      try {
        const res = await typingService.saveResult(resultPayload);
        if (res?.result?.newlyUnlocked && Array.isArray(res.result.newlyUnlocked)) {
          res.result.newlyUnlocked.forEach((key) => {
            const title = ACHIEVEMENT_TITLES[key] || key;
            toast.success(`🏆 Achievement Unlocked: ${title}!`);
          });
        }
      } catch (err) {
        console.warn('Typing save error:', err.message);
      }

      // Save session to practice history
      try {
        await practiceService.saveSession({
          mode,
          targetParam: `${durationRef.current}s`,
          wpm: finalWpm,
          accuracy: finalAccuracy,
          mistakes: errors,
          duration: durationRef.current,
        });
      } catch (err) {
        console.warn('Practice session save error:', err.message);
      }

      // If this was a daily challenge, submit to challenge API (authenticated typists only)
      if (testConfig?.isDailyChallenge && testConfig?.challengeId) {
        if (isAuthenticated) {
          try {
            const res = await challengeService.submitChallengeScore({
              challengeId: testConfig.challengeId,
              wpm: finalWpm,
              rawWpm: finalRawWpm,
              accuracy: finalAccuracy,
              mistakes: errors,
              correctCharacters: correct,
              totalCharacters: completedTyped.length,
              consistency,
            });
            if (res?.rank) {
              toast.success(`🎯 Daily Challenge completed! Today's Rank: #${res.rank}`);
            }
          } catch (err) {
            if (err?.status === 409) {
              toast.info("You have already completed today's challenge.");
            } else {
              console.warn('Challenge submit notice:', err.message);
            }
          }
        } else {
          toast.info("Log in to save your score on the official Daily Challenge leaderboard!");
        }
      }

      try {
        if (soundEnabled) {
          if (typeof soundEngine.playVictory === 'function') soundEngine.playVictory();
          else if (typeof soundEngine.playCompletion === 'function') soundEngine.playCompletion();
        }
      } catch (err) {
        console.warn('Sound play notice:', err);
      }

      navigate('/result');
    },
    [mode, navigate, setLastResult, soundEnabled, testConfig, isAuthenticated]
  );

  // Countdown timer
  useEffect(() => {
    if (!started || finished) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const currentElapsed = Math.max(
        Math.floor((now - (startTimeRef.current || now)) / 1000),
        1
      );
      setElapsed(currentElapsed);
      const remaining = durationRef.current - currentElapsed;
      setTimeLeft(Math.max(remaining, 0));

      wpmHistoryRef.current.push({
        second: currentElapsed,
        wpm: statsRef.current.wpm,
        rawWpm: statsRef.current.rawWpm,
      });

      if (remaining <= 0) {
        clearInterval(interval);
        handleFinish(durationRef.current);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [started, finished, handleFinish]);

  // Measure exact rendered line height whenever text or window width changes
  useLayoutEffect(() => {
    const updateLineHeight = () => {
      if (!textWrapperRef.current) return;
      const children = textWrapperRef.current.children;
      if (children && children.length > 0) {
        const baseTop = children[0].offsetTop;
        for (let i = 1; i < children.length; i++) {
          const diff = children[i].offsetTop - baseTop;
          if (diff > 15) {
            setLineHeight(diff);
            return;
          }
        }
      }
      const computed = window.getComputedStyle(textWrapperRef.current);
      const lh = parseFloat(computed.lineHeight);
      if (lh && !isNaN(lh) && lh > 15) {
        setLineHeight(lh);
      }
    };

    updateLineHeight();
    window.addEventListener('resize', updateLineHeight);
    return () => {
      window.removeEventListener('resize', updateLineHeight);
    };
  }, [text]);

  // Line-aware viewport scrolling: maintains a fixed 3-line window
  // Initial lines 1, 2, 3 remain stable without movement
  // When reaching line 4 and beyond, smoothly moves upward line-by-line
  useLayoutEffect(() => {
    const updateViewportOffset = () => {
      if (!textContainerRef.current || !textWrapperRef.current) return;
      textContainerRef.current.scrollTop = 0;

      if (typed.length === 0) {
        setLineOffset(0);
        return;
      }

      const firstChar = firstCharRef.current;
      const caret = caretRef.current || textWrapperRef.current.children[typed.length - 1];
      if (!caret || !firstChar) return;

      const lh = lineHeight || (textContainerRef.current.clientHeight ? textContainerRef.current.clientHeight / 3 : 28);
      const caretTop = Math.max(0, caret.offsetTop - firstChar.offsetTop);
      const currentLine = Math.max(0, Math.round(caretTop / lh));

      // Fixed 3-line box: lines 0, 1, 2 visible at offset 0 (Line 3 is at bottom of viewport)
      // When reaching Line 4 (index 3), offset shifts by 1 line so Lines 2, 3, 4 are visible
      // Current typing line remains comfortable in the lower-middle safe area
      const targetLine = currentLine >= 2 ? currentLine - 2 : 0;
      let targetOffset = targetLine * lh;

      // Clamp offset so text never scrolls past the end of the passage into blank space
      const viewportHeight = textContainerRef.current.clientHeight || (lh * 3);
      const maxScroll = Math.max(0, textWrapperRef.current.scrollHeight - viewportHeight);
      targetOffset = Math.min(targetOffset, maxScroll);
      targetOffset = Math.max(0, targetOffset);

      setLineOffset(targetOffset);
    };

    updateViewportOffset();
    window.addEventListener('resize', updateViewportOffset);
    return () => window.removeEventListener('resize', updateViewportOffset);
  }, [typed.length, lineHeight, text]);

  // Focus input on configuration change
  useEffect(() => {
    inputRef.current?.focus();
  }, [duration, mode, difficulty]);

  // Sync testConfig changes (e.g. from Daily Challenge or Custom Test)
  useEffect(() => {
    if (testConfig?.isDailyChallenge && testConfig?.customText) {
      const d = testConfig.duration || 60;
      setDuration(d);
      setMode('custom');
      restart(d, 'custom', difficulty, testConfig.customText);
    }
  }, [testConfig?.isDailyChallenge, testConfig?.challengeId, testConfig?.customText]);

  // Handle keystrokes with synchronous refs & pure 1-to-1 character matching
  const handleKeyDown = (e) => {
    if (finishedRef.current || isCustomModalOpen) return;

    // Quick restart via Tab or Ctrl+Enter
    if (e.key === 'Tab' || (e.key === 'Enter' && e.ctrlKey)) {
      e.preventDefault();
      restart(duration, mode, difficulty);
      return;
    }

    // Ignore modifier combos (Ctrl+C, Ctrl+V, Alt+Tab, Meta) except Ctrl+Backspace
    if (e.altKey || e.metaKey || (e.ctrlKey && e.key !== 'Backspace')) {
      return;
    }

    // Backspace handling
    if (e.key === 'Backspace') {
      e.preventDefault();
      const currentTyped = typedRef.current;
      if (currentTyped.length === 0) return;

      let newTyped = '';
      if (e.ctrlKey) {
        // Ctrl + Backspace: Delete current word back to previous word boundary
        const trimmed = currentTyped.trimEnd();
        const lastSpace = trimmed.lastIndexOf(' ');
        newTyped = lastSpace === -1 ? '' : trimmed.slice(0, lastSpace + 1);
      } else {
        // Single Backspace: delete exactly one character
        newTyped = currentTyped.slice(0, -1);
      }

      typedRef.current = newTyped;
      setTyped(newTyped);

      const targetText = textRef.current;
      const prevChar = newTyped.length > 0 ? newTyped[newTyped.length - 1] : null;
      const prevExpected = newTyped.length > 0 ? targetText[newTyped.length - 1] : null;
      setLastKey({
        key: 'Backspace',
        correct: prevChar ? prevChar === prevExpected : true,
        id: Date.now(),
      });

      if (soundEnabled) {
        try {
          soundEngine.playClick?.(soundType, soundVolume);
        } catch (err) {}
      }
      return;
    }

    // Only process single printable characters
    if (e.key.length !== 1) return;

    const currentText = textRef.current;
    const currentTyped = typedRef.current;
    const currentIndex = currentTyped.length;

    // Cannot type beyond passage length
    if (currentIndex >= currentText.length) return;

    // 1. Prevent accidental leading space before test begins
    if (currentIndex === 0 && e.key === ' ' && currentText[0] !== ' ') {
      e.preventDefault();
      return;
    }

    e.preventDefault();

    // Start timer on first valid keypress
    if (!startedRef.current) {
      startedRef.current = true;
      setStarted(true);
      startTimeRef.current = Date.now();
    }

    // Pure 1-to-1 character comparison
    const expectedChar = currentText[currentIndex];
    const isCorrect = e.key === expectedChar;

    const newTyped = currentTyped + e.key;
    typedRef.current = newTyped;
    setTyped(newTyped);

    setLastKey({ key: e.key, correct: isCorrect, id: Date.now() });

    if (soundEnabled) {
      try {
        if (isCorrect) {
          soundEngine.playClick?.(soundType, soundVolume);
        } else if (soundOnError) {
          soundEngine.playError?.(soundVolume);
        }
      } catch (err) {}
    }

    // Finished when user types the entire passage
    if (newTyped.length >= currentText.length) {
      const totalSec = Math.max(
        Math.floor((Date.now() - (startTimeRef.current || Date.now())) / 1000),
        1
      );
      handleFinish(totalSec);
    }
  };

  const handleDurationChange = (d) => {
    setDuration(d);
    setTestConfig((prev) => ({ ...prev, duration: d }));
    restart(d, mode, difficulty);
  };

  const handleModeChange = (m) => {
    if (m === 'custom') {
      setIsCustomModalOpen(true);
      return;
    }
    setMode(m);
    setTestConfig((prev) => ({ ...prev, mode: m }));
    restart(duration, m, difficulty);
  };

  const handleDifficultyChange = (diff) => {
    setDifficulty(diff);
    restart(duration, mode, diff);
  };

  const handleApplyCustomText = (custom) => {
    setMode('custom');
    setTestConfig((prev) => ({ ...prev, mode: 'custom', customText: custom }));
    restart(duration, 'custom', difficulty, custom);
  };

  // Timer circular stroke progress calculation
  const timeProgress = duration > 0 ? (duration - timeLeft) / duration : 0;
  const strokeDashoffset = 88 - 88 * timeProgress;

  return (
    <div className="min-h-full bg-[#0B1120] text-[#F8FAFC]">
      <SEO
        title="Typing Speed Test — Tara Typing"
        description="Test Your Typing Speed. Type as accurately and fast as you can. Track live WPM, accuracy, and climb the ranks!"
      />

      <main
        className="mx-auto max-w-7xl px-4 pb-16 pt-8 sm:px-6 lg:px-8 select-none"
        onClick={() => inputRef.current?.focus()}
      >
        {/* Hidden screen-reader heading */}
        <h1 className="sr-only">Typing Test — Test Your Typing Speed</h1>

        {/* ── HERO SECTION ── */}
        <div className="grid gap-6 lg:grid-cols-[1fr_auto] items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1.5 text-xs font-semibold text-amber-400">
              <span className="text-sm leading-none">⚡</span> Typing Test
            </span>
            <h2 className="mt-3.5 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              Test Your <span className="text-primary">Typing Speed</span>
            </h2>
            <p className="mt-2.5 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              Type the text below as accurately and fast as you can. Track your progress and
              see how much you can improve!
            </p>
          </div>

          {/* Hero Promotional Card with Glowing Isometric Keyboard Graphic */}
          <div className="hidden lg:flex items-center gap-4">
            <div className="group relative overflow-hidden rounded-2xl border border-primary/25 bg-[#081024] p-3.5 sm:px-4 sm:py-3 shadow-[0_0_30px_-8px_rgba(59,130,246,0.3)] w-[360px] sm:w-[380px] h-[126px] flex flex-col justify-between select-none transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-[0_0_35px_-4px_rgba(59,130,246,0.45)] cursor-default">
              {/* Isometric Keyboard Graphic with Atmospheric Glow */}
              <div className="pointer-events-none absolute -right-3 -top-2 w-48 h-40 transition-transform duration-500 ease-out group-hover:scale-105">
                <div className="absolute inset-4 rounded-full bg-primary/25 blur-xl group-hover:bg-primary/35 transition-colors duration-500" />
                <svg viewBox="0 0 200 140" className="w-full h-full">
                  <defs>
                    <linearGradient id="kbBody" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#1E3A8A" stopOpacity="0.8" />
                      <stop offset="50%" stopColor="#0F172A" stopOpacity="0.95" />
                      <stop offset="100%" stopColor="#040814" stopOpacity="1" />
                    </linearGradient>
                    <linearGradient id="keyGlow" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.9" />
                      <stop offset="100%" stopColor="#2563EB" stopOpacity="0.7" />
                    </linearGradient>
                  </defs>

                  {/* Keyboard Frame Base (Perspective) */}
                  <polygon
                    points="30,45 170,18 190,95 48,125"
                    fill="url(#kbBody)"
                    stroke="#3B82F6"
                    strokeWidth="1.2"
                    strokeOpacity="0.6"
                    className="drop-shadow-lg"
                  />

                  {/* Inner Tray */}
                  <polygon
                    points="36,48 166,23 184,92 52,120"
                    fill="#0A1124"
                    stroke="#1E40AF"
                    strokeWidth="0.8"
                    strokeOpacity="0.5"
                  />

                  {/* Key Rows in Isometric Grid */}
                  <g fill="#172554" stroke="#3B82F6" strokeWidth="0.6" strokeOpacity="0.45">
                    {/* Row 1 */}
                    <polygon points="44,52 64,48 68,56 48,60" />
                    <polygon points="68,47 88,43 92,51 72,55" />
                    <polygon points="92,42 112,38 116,46 96,50" />
                    <polygon points="116,37 136,33 140,41 120,45" />
                    <polygon points="140,32 160,28 164,36 144,40" />

                    {/* Row 2 */}
                    <polygon points="48,64 68,60 72,68 52,72" />
                    {/* Highlighted active key in row 2 */}
                    <polygon points="72,59 92,55 96,63 76,67" fill="url(#keyGlow)" stroke="#93C5FD" strokeWidth="1" strokeOpacity="0.9" />
                    <polygon points="96,54 116,50 120,58 100,62" />
                    <polygon points="120,49 140,45 144,53 124,57" />
                    <polygon points="144,44 164,40 168,48 148,52" />

                    {/* Row 3 */}
                    <polygon points="52,76 74,72 78,80 56,84" />
                    <polygon points="78,71 98,67 102,75 82,79" />
                    <polygon points="102,66 122,62 126,70 106,74" />
                    <polygon points="126,61 146,57 150,65 130,69" />
                    <polygon points="150,56 170,52 174,60 154,64" />

                    {/* Row 4 (Spacebar row) */}
                    <polygon points="58,88 80,84 84,92 62,96" />
                    <polygon points="84,83 148,70 152,78 88,91" fill="#1E3A8A" stroke="#60A5FA" strokeWidth="0.8" strokeOpacity="0.6" />
                    <polygon points="152,69 174,65 178,73 156,77" />
                  </g>
                </svg>
              </div>

              {/* Card Header: Better Typing + A Brighter Tomorrow */}
              <div className="relative z-10 leading-tight">
                <div className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-foreground">
                  <span>Better Typing</span>
                </div>
                <div className="font-display text-xs sm:text-sm font-bold text-foreground">
                  A Brighter <span className="text-primary font-bold">Tomorrow</span>{' '}
                  <Sparkles size={13} className="inline text-amber-400 fill-amber-400/30 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
                </div>
              </div>

              {/* 3 bullet items with blue pipe */}
              <div className="relative z-10 space-y-0.5 text-[11px] leading-tight text-muted-foreground">
                <p className="flex items-center gap-1.5"><span className="text-primary font-bold text-xs leading-none">|</span>Practice Daily</p>
                <p className="flex items-center gap-1.5"><span className="text-primary font-bold text-xs leading-none">|</span>Track Progress</p>
                <p className="flex items-center gap-1.5"><span className="text-primary font-bold text-xs leading-none">|</span>Be Your Best</p>
              </div>
            </div>

            {/* Motivational quote on far right (desktop) */}
            <div className="hidden xl:flex flex-col justify-center max-w-[135px] text-right text-xs italic text-muted-foreground leading-relaxed pl-1 select-none">
              <span>"Small steps every day lead to big results."</span>
              <span className="mt-1 font-semibold not-italic text-muted-foreground/80 text-[11px]">— Tara Typing</span>
            </div>
          </div>
        </div>

        {/* ── TEST CONTROL BAR (Figma Mockup) ── */}
        <div className="mt-7 card-glass rounded-2xl p-3 sm:p-4 border border-[#1E293B] bg-[#111827] transition-all duration-300 hover:border-primary/40 hover:shadow-[0_8px_30px_-6px_rgba(59,130,246,0.15)]">
          <div className="flex flex-wrap items-center justify-between gap-3.5">
            {/* Left Controls: Duration + Text Type + Difficulty */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">

              {/* SECTION 1: TEST DURATION */}
              <div>
                <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                  Test Duration
                </p>
                <div className="flex items-center gap-1 rounded-xl border border-border bg-[#0B1120] p-1">
                  {durations.map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => handleDurationChange(d)}
                      aria-pressed={duration === d}
                      className={`rounded-lg px-3.5 py-1.5 text-xs sm:text-sm font-medium transition-all select-none ${
                        duration === d
                          ? 'bg-primary text-white font-semibold shadow-sm shadow-primary/30'
                          : 'text-muted-foreground hover:text-foreground hover:bg-slate-800/60'
                      }`}
                    >
                      {d}s
                    </button>
                  ))}
                </div>
              </div>

              {/* Subtle vertical divider */}
              <div className="hidden md:block h-10 w-px bg-border/60" />

              {/* SECTION 2: TEXT TYPE */}
              <div>
                <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                  Text Type
                </p>
                <div className="flex items-center gap-1 rounded-xl border border-border bg-[#0B1120] p-1">
                  {modes.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => handleModeChange(m.id)}
                      aria-pressed={mode === m.id}
                      className={`rounded-lg px-3.5 py-1.5 text-xs sm:text-sm font-medium transition-all select-none ${
                        mode === m.id
                          ? 'bg-primary text-white font-semibold shadow-sm shadow-primary/30'
                          : 'text-muted-foreground hover:text-foreground hover:bg-slate-800/60'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Subtle vertical divider */}
              <div className="hidden lg:block h-10 w-px bg-border/60" />

              {/* SECTION 3: DIFFICULTY */}
              <div>
                <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                  Difficulty
                </p>
                <div className="flex items-center gap-1 rounded-xl border border-border bg-[#0B1120] p-1">
                  {difficulties.map((diff) => (
                    <button
                      key={diff.id}
                      type="button"
                      onClick={() => handleDifficultyChange(diff.id)}
                      aria-pressed={difficulty === diff.id}
                      className={`rounded-lg px-3.5 py-1.5 text-xs sm:text-sm font-medium transition-all select-none ${
                        difficulty === diff.id
                          ? 'bg-primary text-white font-semibold shadow-sm shadow-primary/30'
                          : 'text-muted-foreground hover:text-foreground hover:bg-slate-800/60'
                      }`}
                    >
                      {diff.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: New Test Button */}
            <button
              type="button"
              onClick={() => restart(duration, mode, difficulty)}
              aria-label="Generate new test"
              className="mt-auto flex items-center gap-2 rounded-xl border border-border bg-[#0B1120] hover:border-primary/60 hover:text-white px-4 py-2.5 text-xs sm:text-sm font-semibold text-foreground transition-all shadow-sm select-none"
            >
              <RotateCcw size={15} />
              <span>New Test</span>
            </button>
          </div>
        </div>

        {/* ── MAIN CONTENT (70% Left / 30% Right) ── */}
        <div className="mt-6 grid gap-6 lg:grid-cols-12 items-start">

          {/* ══════════════ LEFT COLUMN (70%): PASSAGE + KEYBOARD ══════════════ */}
          <div className="lg:col-span-8 flex flex-col gap-6">

            {/* 1. TYPING PASSAGE CARD */}
            <div
              className="card-glass rounded-2xl border border-[#1E293B] bg-[#111827] py-[6px] sm:py-2 px-5 sm:px-7 md:px-8 shadow-sm transition-all duration-300 hover:border-primary/45 hover:shadow-[0_8px_30px_-6px_rgba(59,130,246,0.2)] focus-within:border-primary/60 focus-within:shadow-[0_0_25px_-4px_rgba(59,130,246,0.25)] relative cursor-text"
              onClick={() => inputRef.current?.focus()}
            >
              {/* Strict Letter-by-Letter Character Passage (Fixed 3-Line Box, No scrollbar, Smooth line movement) */}
              <div
                ref={textContainerRef}
                onWheel={(e) => e.preventDefault()}
                className="font-mono font-normal text-lg sm:text-xl md:text-2xl lg:text-[25px] leading-[1.55] overflow-hidden relative select-none focus:outline-none no-scrollbar text-left"
                style={{
                  height: lineHeight ? `${lineHeight * 3}px` : '4.65em',
                  maxHeight: lineHeight ? `${lineHeight * 3}px` : '4.65em',
                  contain: 'paint layout',
                }}
                aria-label="Typing test passage"
              >
                <div
                  ref={textWrapperRef}
                  className={`font-mono font-normal text-lg sm:text-xl md:text-2xl lg:text-[25px] leading-[1.55] tracking-[0.5px] will-change-transform ${
                    smoothCaret ? 'transition-transform duration-200 ease-out' : 'transition-none'
                  }`}
                  style={{
                    transform: `translateY(-${lineOffset}px)`,
                  }}
                >
                  {text.split('').map((char, index) => {
                    const attachRef = (el) => {
                      if (index === 0) firstCharRef.current = el;
                      if (index === typed.length) caretRef.current = el;
                    };

                    // State 1: Already typed
                    if (index < typed.length) {
                      const isCorrect = typed[index] === char;
                      if (isCorrect) {
                        return (
                          <span
                            key={index}
                            ref={attachRef}
                            className="text-[#22C55E] font-normal transition-colors duration-75"
                          >
                            {char}
                          </span>
                        );
                      } else {
                        return (
                          <span
                            key={index}
                            ref={attachRef}
                            className="text-[#EF4444] font-normal transition-colors duration-75"
                          >
                            {char === ' ' ? '·' : char}
                          </span>
                        );
                      }
                    }

                    // State 2: Current character (Clean white text, NO underline, NO background)
                    if (index === typed.length) {
                      if (char === ' ') {
                        return (
                          <span
                            key={index}
                            ref={attachRef}
                            className="inline-block min-w-[0.55em] align-baseline transition-colors duration-75"
                          >
                            &nbsp;
                          </span>
                        );
                      } else {
                        return (
                          <span
                            key={index}
                            ref={attachRef}
                            className={`${
                              highlightLetter ? 'text-white' : 'text-[#94A3B8]/60 dark:text-[#64748B]'
                            } font-normal transition-colors duration-75`}
                          >
                            {char}
                          </span>
                        );
                      }
                    }

                    // State 3: Pending characters
                    return (
                      <span
                        key={index}
                        ref={attachRef}
                        className="text-[#94A3B8]/60 dark:text-[#64748B] font-normal"
                      >
                        {char}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Hidden input listener to capture real keystrokes reliably */}
              <input
                ref={inputRef}
                type="text"
                value=""
                onChange={() => {}}
                aria-label="Keyboard input listener"
                className="absolute h-px w-px opacity-0 pointer-events-none"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck={false}
                onKeyDown={handleKeyDown}
                onBlur={() => !finished && !isCustomModalOpen && inputRef.current?.focus()}
              />
            </div>

            {/* 2. ON-SCREEN KEYBOARD CARD (Contains ONLY the keyboard) */}
            {showKeyboard && (
              <div className="card-glass rounded-2xl border border-[#1E293B] bg-[#111827] p-4 sm:p-5 shadow-sm transition-all duration-300 hover:border-primary/40 hover:shadow-[0_8px_30px_-6px_rgba(59,130,246,0.15)] cursor-default">
                <Keyboard nextChar={text[typed.length]} lastKey={lastKey} />
              </div>
            )}

            {/* 3. HELPER TEXT & ACTION BUTTONS (Completely OUTSIDE keyboard container, directly on page background) */}
            <div className="-mt-2 flex flex-col items-center">
              {/* Helper text */}
              <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground text-center select-none px-2">
                <span className="flex items-center justify-center h-4 w-4 rounded-full border border-muted-foreground/60 text-[10px] font-bold text-muted-foreground">i</span>
                <span>Type the text above</span>
                <span className="text-slate-600">•</span>
                <span>Current letter is highlighted</span>
                <span className="text-slate-600">•</span>
                <span><span className="text-[#EF4444] font-medium">Red</span> = incorrect</span>
                <span className="text-slate-600">•</span>
                <span>Keep going!</span>
              </div>

              {/* Action Buttons: Restart & Reset */}
              <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => restart(duration, mode, difficulty)}
                  aria-label="Restart Test"
                  className="flex items-center justify-center gap-2.5 rounded-xl bg-[#3B82F6] hover:bg-blue-600 hover:brightness-105 text-white font-semibold py-2.5 px-8 shadow-md shadow-blue-500/20 transition-all select-none cursor-pointer"
                >
                  <Play size={14} fill="currentColor" />
                  <span>Restart Test</span>
                </button>
                <button
                  type="button"
                  onClick={reset}
                  aria-label="Reset Test"
                  className="flex items-center justify-center gap-2 rounded-xl border border-[#1E293B] bg-transparent hover:bg-slate-800 hover:border-slate-600 text-slate-200 font-semibold py-2.5 px-6 transition-all select-none cursor-pointer"
                >
                  <RotateCcw size={14} />
                  <span>Reset</span>
                </button>
              </div>
            </div>
          </div>

          {/* ══════════════ RIGHT COLUMN (30%): STATS + SETTINGS + TIP ══════════════ */}
          <div className="lg:col-span-4 flex flex-col gap-5">

            {/* 1. FOUR STATS IN 2X2 GRID */}
            <div className="grid grid-cols-2 gap-3.5">
              {/* Card 1: Time Left */}
              <div className="card-glass rounded-2xl border border-[#1E293B] bg-[#111827] p-4 flex items-center justify-between shadow-sm transition-all duration-300 hover:border-blue-500/50 hover:shadow-[0_8px_25px_-6px_rgba(59,130,246,0.25)] cursor-default">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-blue-500/15 text-blue-400">
                    <Clock size={18} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] text-muted-foreground leading-none">Time Left</p>
                    <p className="mt-1 font-display text-lg sm:text-xl font-bold text-foreground leading-tight">
                      {timeLeft}s
                    </p>
                  </div>
                </div>

                {/* Circular Countdown Progress Ring */}
                <div className="relative h-8 w-8 shrink-0">
                  <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="14" fill="none" stroke="#1E293B" strokeWidth="3" />
                    <circle
                      cx="18"
                      cy="18"
                      r="14"
                      fill="none"
                      stroke="#3B82F6"
                      strokeWidth="3"
                      strokeDasharray={88}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                      className="transition-all duration-300"
                    />
                  </svg>
                </div>
              </div>

              {/* Card 2: WPM */}
              <div className="card-glass rounded-2xl border border-[#1E293B] bg-[#111827] p-4 flex items-center gap-3 shadow-sm transition-all duration-300 hover:border-emerald-500/50 hover:shadow-[0_8px_25px_-6px_rgba(34,197,94,0.25)] cursor-default">
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-emerald-500/15 text-emerald-400">
                  <Zap size={18} />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] text-muted-foreground leading-none">WPM</p>
                  <p className="mt-1 font-display text-lg sm:text-xl font-bold text-foreground leading-tight">
                    {showLiveWpm ? stats.wpm : '—'}
                  </p>
                </div>
              </div>

              {/* Card 3: Accuracy */}
              <div className="card-glass rounded-2xl border border-[#1E293B] bg-[#111827] p-4 flex items-center gap-3 shadow-sm transition-all duration-300 hover:border-purple-500/50 hover:shadow-[0_8px_25px_-6px_rgba(168,85,247,0.25)] cursor-default">
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-purple-500/15 text-purple-400">
                  <Target size={18} />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] text-muted-foreground leading-none">Accuracy</p>
                  <p className="mt-1 font-display text-lg sm:text-xl font-bold text-foreground leading-tight">
                    {showLiveAccuracy ? `${stats.accuracy}%` : '—'}
                  </p>
                </div>
              </div>

              {/* Card 4: Errors */}
              <div className="card-glass rounded-2xl border border-[#1E293B] bg-[#111827] p-4 flex items-center gap-3 shadow-sm transition-all duration-300 hover:border-red-500/50 hover:shadow-[0_8px_25px_-6px_rgba(239,68,68,0.25)] cursor-default">
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-red-500/15 text-red-400">
                  <XCircle size={18} />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] text-muted-foreground leading-none">Errors</p>
                  <p className="mt-1 font-display text-lg sm:text-xl font-bold text-foreground leading-tight">
                    {stats.errors}
                  </p>
                </div>
              </div>
            </div>

            {/* 2. TEST SETTINGS CARD */}
            <div className="card-glass rounded-2xl border border-[#1E293B] bg-[#111827] p-5 shadow-sm transition-all duration-300 hover:border-primary/40 hover:shadow-[0_8px_25px_-6px_rgba(59,130,246,0.15)] cursor-default">
              <div className="flex items-center gap-2 mb-4">
                <SettingsIcon size={16} className="text-slate-300" />
                <h3 className="font-display text-sm font-bold text-foreground">Test Settings</h3>
              </div>

              <div className="space-y-3.5">
                {/* Setting 1: Show Live WPM */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="grid h-6 w-6 place-items-center rounded-md border border-emerald-500/40 bg-emerald-500/10 text-emerald-400">
                      <TrendingUp size={13} />
                    </div>
                    <span className="text-xs sm:text-sm font-medium text-slate-200">Show Live WPM</span>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={showLiveWpm}
                    onClick={() => setShowLiveWpm((v) => !v)}
                    className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      showLiveWpm ? 'bg-[#0066FF]' : 'bg-slate-700'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                        showLiveWpm ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* Setting 2: Show Live Accuracy */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="grid h-6 w-6 place-items-center rounded-md border border-emerald-500/40 bg-emerald-500/10 text-emerald-400">
                      <Target size={13} />
                    </div>
                    <span className="text-xs sm:text-sm font-medium text-slate-200">Show Live Accuracy</span>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={showLiveAccuracy}
                    onClick={() => setShowLiveAccuracy((v) => !v)}
                    className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      showLiveAccuracy ? 'bg-[#0066FF]' : 'bg-slate-700'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                        showLiveAccuracy ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* Setting 3: Highlight Current Letter */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="grid h-6 w-6 place-items-center rounded-md border border-emerald-500/40 bg-emerald-500/10 text-emerald-400">
                      <CheckSquare size={13} />
                    </div>
                    <span className="text-xs sm:text-sm font-medium text-slate-200">Highlight Current Letter</span>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={highlightLetter}
                    onClick={() => setHighlightLetter((v) => !v)}
                    className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      highlightLetter ? 'bg-[#0066FF]' : 'bg-slate-700'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                        highlightLetter ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* Setting 4: Play Sound on Error */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="grid h-6 w-6 place-items-center rounded-md border border-emerald-500/40 bg-emerald-500/10 text-emerald-400">
                      <Volume2 size={13} />
                    </div>
                    <span className="text-xs sm:text-sm font-medium text-slate-200">Play Sound on Error</span>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={soundOnError}
                    onClick={() => setSoundOnError((v) => !v)}
                    className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      soundOnError ? 'bg-[#0066FF]' : 'bg-slate-700'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                        soundOnError ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* Setting 5: Show On-screen Keyboard */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="grid h-6 w-6 place-items-center rounded-md border border-emerald-500/40 bg-emerald-500/10 text-emerald-400">
                      <KeyboardIcon size={13} />
                    </div>
                    <span className="text-xs sm:text-sm font-medium text-slate-200">Show On-screen Keyboard</span>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={showKeyboard}
                    onClick={() => setShowKeyboard((v) => !v)}
                    className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      showKeyboard ? 'bg-[#0066FF]' : 'bg-slate-700'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                        showKeyboard ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* 3. PRO TIP CARD */}
            <div className="card-glass rounded-2xl border border-[#1E293B] bg-[#111827] p-5 shadow-sm transition-all duration-300 hover:border-amber-500/50 hover:shadow-[0_8px_25px_-6px_rgba(245,158,11,0.2)] cursor-default">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                <Lightbulb size={18} className="text-amber-400 fill-amber-400" />
                <span className="font-display font-bold text-foreground">Pro Tip</span>
              </div>
              <p className="mt-2 text-xs sm:text-sm text-slate-400 leading-relaxed">
                Keep your posture straight, relax your hands, and focus on accuracy. Speed will come naturally!
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Custom Practice Text Modal */}
      <CustomTextModal
        isOpen={isCustomModalOpen}
        onClose={() => setIsCustomModalOpen(false)}
        onApplyCustomText={handleApplyCustomText}
      />
    </div>
  );
};

export default TypingTest;

