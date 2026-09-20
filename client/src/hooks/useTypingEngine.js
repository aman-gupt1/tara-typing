import { useState, useEffect, useRef, useCallback } from 'react';
import { calculateWPM, calculateRawWPM, calculateAccuracy, calculateConsistency } from '../utils/typingCalculations';
import { soundEngine } from '../utils/soundEngine';

export const useTypingEngine = ({
  targetText = '',
  duration = 30,
  mode = 'words',
  onComplete,
}) => {
  const [typedText, setTypedText] = useState('');
  const [status, setStatus] = useState('idle'); // 'idle' | 'running' | 'completed'
  const [timeLeft, setTimeLeft] = useState(duration);
  const [activeKey, setActiveKey] = useState(null);

  const [stats, setStats] = useState({
    wpm: 0,
    rawWpm: 0,
    accuracy: 100,
    errors: 0,
    correctChars: 0,
    totalChars: 0,
    consistency: 100,
    wpmHistory: [],
  });

  const timerRef = useRef(null);
  const startTimeRef = useRef(null);
  const wpmHistoryRef = useRef([]);
  const errorsCountRef = useRef(0);
  const targetTextRef = useRef(targetText);
  const statusRef = useRef(status);
  const typedTextRef = useRef(typedText);

  // Sync refs
  useEffect(() => {
    targetTextRef.current = targetText;
  }, [targetText]);

  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  useEffect(() => {
    typedTextRef.current = typedText;
  }, [typedText]);

  // Reset function
  const resetTest = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setStatus('idle');
    setTypedText('');
    setTimeLeft(duration);
    setActiveKey(null);
    errorsCountRef.current = 0;
    wpmHistoryRef.current = [];
    setStats({
      wpm: 0,
      rawWpm: 0,
      accuracy: 100,
      errors: 0,
      correctChars: 0,
      totalChars: 0,
      consistency: 100,
      wpmHistory: [],
    });
  }, [duration]);

  // Finish test
  const finishTest = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setStatus('completed');
    soundEngine.playCompletion();

    const elapsed = Math.max(1, duration - timeLeft);
    const text = typedTextRef.current;
    const target = targetTextRef.current;

    let correct = 0;
    for (let i = 0; i < text.length; i++) {
      if (text[i] === target[i]) correct++;
    }

    const finalWpm = calculateWPM(correct, elapsed);
    const finalRawWpm = calculateRawWPM(text.length, elapsed);
    const finalAccuracy = calculateAccuracy(correct, text.length);
    const finalConsistency = calculateConsistency(wpmHistoryRef.current);

    const finalResult = {
      wpm: finalWpm,
      rawWpm: finalRawWpm,
      accuracy: finalAccuracy,
      errors: errorsCountRef.current,
      correctCharacters: correct,
      totalCharacters: text.length,
      consistency: finalConsistency,
      duration: elapsed,
      totalDuration: duration,
      mode,
      wpmHistory: wpmHistoryRef.current.length > 0 ? wpmHistoryRef.current : [
        { second: 1, wpm: finalWpm, rawWpm: finalRawWpm }
      ],
      completedAt: new Date().toISOString(),
    };

    setStats((prev) => ({
      ...prev,
      wpm: finalWpm,
      rawWpm: finalRawWpm,
      accuracy: finalAccuracy,
      consistency: finalConsistency,
      correctChars: correct,
      totalChars: text.length,
    }));

    if (onComplete) {
      onComplete(finalResult);
    }
  }, [duration, timeLeft, mode, onComplete]);

  // Timer Tick
  useEffect(() => {
    if (status === 'running') {
      startTimeRef.current = Date.now();
      timerRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timerRef.current);
            finishTest();
            return 0;
          }

          const newTime = prevTime - 1;
          const elapsed = duration - newTime;
          const currentTyped = typedTextRef.current;
          const target = targetTextRef.current;

          let correct = 0;
          for (let i = 0; i < currentTyped.length; i++) {
            if (currentTyped[i] === target[i]) correct++;
          }

          const currentWpm = calculateWPM(correct, elapsed);
          const currentRawWpm = calculateRawWPM(currentTyped.length, elapsed);
          const currentAcc = calculateAccuracy(correct, currentTyped.length);

          const historyPoint = {
            second: elapsed,
            wpm: currentWpm,
            rawWpm: currentRawWpm,
          };
          wpmHistoryRef.current.push(historyPoint);

          setStats((prev) => ({
            ...prev,
            wpm: currentWpm,
            rawWpm: currentRawWpm,
            accuracy: currentAcc,
            correctChars: correct,
            totalChars: currentTyped.length,
            wpmHistory: [...wpmHistoryRef.current],
          }));

          return newTime;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [status, duration, finishTest]);

  // Handle Keystroke
  const handleKeyDown = useCallback((e) => {
    if (statusRef.current === 'completed') return;

    // Hotkey: Tab + Enter or Tab to restart
    if (e.key === 'Tab') {
      e.preventDefault();
      resetTest();
      return;
    }

    // Ignore modifier standalone keys
    if (['Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 'Escape', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
      setActiveKey(e.key);
      setTimeout(() => setActiveKey(null), 120);
      return;
    }

    // Start timer on first printable keystroke or Backspace
    if (statusRef.current === 'idle') {
      setStatus('running');
    }

    const currentTyped = typedTextRef.current;
    const target = targetTextRef.current;
    const currentIndex = currentTyped.length;

    setActiveKey(e.key);
    setTimeout(() => setActiveKey(null), 120);

    if (e.key === 'Backspace') {
      if (currentTyped.length > 0) {
        soundEngine.playKeypress();
        const updated = currentTyped.slice(0, -1);
        setTypedText(updated);
      }
      return;
    }

    if (e.key.length === 1) {
      // Single character typed
      const expectedChar = target[currentIndex];
      const isCorrect = e.key === expectedChar;

      if (isCorrect) {
        soundEngine.playKeypress();
      } else {
        soundEngine.playError();
        errorsCountRef.current += 1;
      }

      const updated = currentTyped + e.key;
      setTypedText(updated);

      // Check if target text is completed
      if (updated.length >= target.length) {
        finishTest();
      }
    }
  }, [resetTest, finishTest]);

  return {
    typedText,
    currentIndex: typedText.length,
    status,
    timeLeft,
    activeKey,
    stats: {
      ...stats,
      errors: errorsCountRef.current,
    },
    resetTest,
    finishTest,
    handleKeyDown,
  };
};
