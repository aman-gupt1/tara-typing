import { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, CheckCircle2, Zap } from 'lucide-react';
import { soundEngine } from '../../utils/soundEngine';

export const InLessonPractice = ({ drillText = '', onDrillComplete }) => {
  const [typed, setTyped] = useState('');
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [elapsed, setElapsed] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    setTyped('');
    setStarted(false);
    setFinished(false);
    setStartTime(null);
    setElapsed(0);
  }, [drillText]);

  useEffect(() => {
    let timer;
    if (started && !finished) {
      timer = setInterval(() => {
        if (startTime) {
          setElapsed((Date.now() - startTime) / 1000);
        }
      }, 200);
    }
    return () => clearInterval(timer);
  }, [started, finished, startTime]);

  const handleInput = (e) => {
    if (finished) return;
    const val = e.target.value;

    if (!started) {
      setStarted(true);
      setStartTime(Date.now());
    }

    // Sound effect
    const lastChar = val[val.length - 1];
    const expectedChar = drillText[val.length - 1];
    if (lastChar === expectedChar) {
      soundEngine.playKey();
    } else {
      soundEngine.playError();
    }

    setTyped(val);

    if (val.length >= drillText.length) {
      setFinished(true);
      const totalTime = Math.max((Date.now() - (startTime || Date.now())) / 1000, 1);
      const totalWords = drillText.length / 5;
      const wpm = Math.round((totalWords / totalTime) * 60);
      if (onDrillComplete) {
        onDrillComplete(wpm);
      }
    }
  };

  const handleReset = () => {
    setTyped('');
    setStarted(false);
    setFinished(false);
    setStartTime(null);
    setElapsed(0);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  // Metrics
  let correctCount = 0;
  for (let i = 0; i < typed.length; i++) {
    if (typed[i] === drillText[i]) correctCount++;
  }
  const accuracy = typed.length > 0 ? Math.round((correctCount / typed.length) * 100) : 100;
  const currentWords = typed.length / 5;
  const currentWpm = elapsed > 0 ? Math.round((currentWords / elapsed) * 60) : 0;

  return (
    <div
      className="card-glass rounded-2xl p-5 sm:p-6 shadow-xl space-y-4 border border-border/60 hover:border-primary/50 hover:shadow-[0_12px_28px_-6px_rgba(59,130,246,0.18)] transition-all duration-300"
      onClick={() => inputRef.current?.focus()}
      aria-label="In-Lesson Practice Drill"
    >
      <div className="flex items-center justify-between border-b border-border/70 pb-3">
        <div className="flex items-center gap-2">
          <Zap className="text-primary" size={18} />
          <h3 className="font-display text-base font-bold text-foreground">Interactive Lesson Drill</h3>
        </div>
        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="text-muted-foreground">WPM: <strong className="text-foreground">{currentWpm}</strong></span>
          <span className="text-muted-foreground">Accuracy: <strong className={accuracy < 90 ? 'text-destructive' : 'text-success'}>{accuracy}%</strong></span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleReset();
            }}
            className="flex items-center gap-1 rounded-lg border border-border px-2 py-1 text-xs text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
          >
            <RotateCcw size={12} /> Reset
          </button>
        </div>
      </div>

      {/* Typing Display */}
      <div className="relative rounded-xl border border-border bg-background/80 p-4 font-mono text-base sm:text-lg leading-relaxed tracking-wide select-none min-h-[90px] flex flex-wrap items-center">
        {drillText.split('').map((ch, idx) => {
          let charClass = 'char-pending';
          if (idx < typed.length) {
            charClass = typed[idx] === ch ? 'char-correct' : 'char-incorrect';
          } else if (idx === typed.length) {
            charClass = 'char-current';
          }

          return (
            <span key={idx} className={`${charClass} whitespace-pre`}>
              {ch}
            </span>
          );
        })}

        {/* Hidden Input for Capturing Typing */}
        <input
          ref={inputRef}
          type="text"
          value={typed}
          onChange={handleInput}
          disabled={finished}
          className="absolute inset-0 opacity-0 cursor-default"
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck="false"
        />
      </div>

      {/* Footer status */}
      <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
        {finished ? (
          <span className="inline-flex items-center gap-1.5 text-success font-semibold">
            <CheckCircle2 size={16} /> Drill Completed! Speed: {currentWpm} WPM · Accuracy: {accuracy}%
          </span>
        ) : (
          <span>Click the box and start typing to test your muscle memory.</span>
        )}
      </div>
    </div>
  );
};

export default InLessonPractice;
