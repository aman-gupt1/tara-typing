import { useState, useEffect } from 'react';

const rows = [
  ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace'],
  ['Tab', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '[', ']'],
  ['Caps', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';', "'", 'Enter'],
  ['Shift', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '/', 'Shift'],
  ['Ctrl', 'Alt', ' ', 'Alt', 'Ctrl'],
];

const widthClasses = {
  Backspace: 'flex-[1.8]',
  Tab: 'flex-[1.4]',
  Caps: 'flex-[1.6]',
  Enter: 'flex-[1.8]',
  Shift: 'flex-[2.1]',
  ' ': 'flex-[6]',
  Ctrl: 'flex-[1.3]',
  Alt: 'flex-[1.3]',
};

export const InteractiveKeyboard = ({ highlightKeys = [], activeKey = null, title = '' }) => {
  const [pressedKey, setPressedKey] = useState(null);

  // Listen to physical keystrokes if interactive
  useEffect(() => {
    const handleDown = (e) => {
      const k = e.key === ' ' ? ' ' : e.key.toUpperCase();
      setPressedKey(k);
    };
    const handleUp = () => setPressedKey(null);

    window.addEventListener('keydown', handleDown);
    window.addEventListener('keyup', handleUp);
    return () => {
      window.removeEventListener('keydown', handleDown);
      window.removeEventListener('keyup', handleUp);
    };
  }, []);

  const highlightedSet = new Set(highlightKeys.map((k) => k.toUpperCase()));

  return (
    <div className="card-glass w-full rounded-2xl p-4 sm:p-6 shadow-xl border border-border/60 hover:border-primary/40 hover:shadow-[0_12px_28px_-6px_rgba(59,130,246,0.15)] transition-all duration-300" aria-label="Interactive Keyboard Visualizer">
      {title && (
        <div className="mb-3 flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {title}
          </span>
          <span className="text-[11px] text-muted-foreground">
            {highlightKeys.length > 0 ? `${highlightKeys.length} highlighted keys` : 'Press any key to test'}
          </span>
        </div>
      )}

      <div className="flex flex-col gap-1.5 select-none">
        {rows.map((row, rIdx) => (
          <div key={rIdx} className="flex gap-1 sm:gap-1.5">
            {row.map((keyLabel, kIdx) => {
              const upper = keyLabel.toUpperCase();
              const isHighlighted = highlightedSet.has(upper) || (upper === 'SHIFT' && highlightedSet.has('SHIFT'));
              const isPressed = pressedKey === upper || (keyLabel === ' ' && pressedKey === ' ') || activeKey === upper;
              const isFJ = keyLabel === 'F' || keyLabel === 'J';

              let keyStyle = 'border-border bg-secondary/60 text-muted-foreground';

              if (isPressed) {
                keyStyle = 'border-pink bg-pink/30 text-pink scale-95 shadow-[0_0_15px_rgba(236,72,153,0.4)]';
              } else if (isHighlighted) {
                keyStyle =
                  'border-primary/80 bg-primary/20 text-primary font-bold shadow-[0_0_12px_rgba(139,92,246,0.3)] scale-[1.02]';
              }

              return (
                <span
                  key={`${keyLabel}-${kIdx}`}
                  className={`relative flex h-8 sm:h-10 flex-1 items-center justify-center rounded-lg border text-[11px] sm:text-xs font-medium transition-all duration-100 ${
                    widthClasses[keyLabel] ?? ''
                  } ${keyStyle}`}
                >
                  {keyLabel === ' ' ? 'Spacebar' : keyLabel}
                  {isFJ && (
                    <span
                      className="absolute bottom-1 h-0.5 w-2.5 rounded-full bg-primary/60"
                      title="Tactile Guide Bump"
                    />
                  )}
                </span>
              );
            })}
          </div>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-border/60 text-[11px] text-muted-foreground">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-primary" />
          <span>Target Lesson Keys</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-pink" />
          <span>Active Keystroke</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="inline-block h-0.5 w-2 rounded-full bg-primary" />
          <span>F/J tactile ridges</span>
        </div>
      </div>
    </div>
  );
};

export default InteractiveKeyboard;
