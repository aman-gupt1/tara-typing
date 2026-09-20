import React from 'react';

const rows = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Shift', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'Shift'],
  ['Ctrl', 'Alt', ' ', 'Alt', 'Ctrl'],
];

const widthClasses = {
  Shift: 'flex-[1.4] sm:flex-[1.7]',
  ' ': 'flex-[5] sm:flex-[6]',
  Ctrl: 'flex-[1.1] sm:flex-[1.3]',
  Alt: 'flex-[1.1] sm:flex-[1.3]',
};

const renderKeyLabel = (label) => {
  if (label === ' ') {
    return 'Space';
  }
  return label;
};

export const Keyboard = ({ nextChar = '', lastKey = null }) => {
  const [activeKey, setActiveKey] = React.useState(null);

  React.useEffect(() => {
    if (!lastKey) return;
    const key = lastKey.key === ' ' ? ' ' : lastKey.key.toUpperCase();
    setActiveKey({ key, correct: lastKey.correct });
    const timer = setTimeout(() => setActiveKey(null), 120);
    return () => clearTimeout(timer);
  }, [lastKey]);

  const targetKey = nextChar === ' ' ? ' ' : (nextChar || '').toUpperCase();

  return (
    <div
      className="flex w-full flex-col gap-1.5 sm:gap-2 select-none"
      aria-hidden="true"
    >
      {rows.map((row, rIdx) => (
        <div
          key={rIdx}
          className={`flex gap-1 sm:gap-2 ${
            rIdx === 1 ? 'px-[4%] sm:px-[5%]' : ''
          }`}
        >
          {row.map((keyLabel, kIdx) => {
            let state = 'idle';
            if (activeKey && activeKey.key === keyLabel) {
              state = activeKey.correct ? 'correct' : 'incorrect';
            } else if (targetKey === keyLabel) {
              state = 'next';
            }

            const stateStyles = {
              idle: 'border border-[#1E293B] bg-[#0A101D] text-slate-300 hover:border-slate-600 shadow-sm',
              next: 'border-2 border-[#1E6BFF] bg-[#0E1A33] text-white shadow-[0_0_15px_rgba(30,107,255,0.7)] ring-1 ring-[#1E6BFF]/40 font-bold scale-[1.02]',
              correct: 'border border-emerald-500/70 bg-emerald-500/20 text-emerald-400 font-semibold',
              incorrect: 'border border-red-500/70 bg-red-500/20 text-red-400 font-semibold',
            }[state];

            return (
              <span
                key={`${keyLabel}-${kIdx}`}
                className={`keycap flex h-9 xs:h-10 sm:h-11 md:h-12 flex-1 items-center justify-center rounded-xl text-xs sm:text-sm font-medium transition-all duration-150 overflow-hidden ${
                  widthClasses[keyLabel] ?? ''
                } ${stateStyles}`}
              >
                {renderKeyLabel(keyLabel)}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default Keyboard;
