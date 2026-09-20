import { useRef, useEffect } from 'react';
import { useSettings } from '../../context/SettingsContext';

export const TypingArea = ({
  targetText = '',
  typedText = '',
  currentIndex = 0,
  status = 'idle',
  onKeyDown,
}) => {
  const { settings } = useSettings();
  const containerRef = useRef(null);
  const activeCharRef = useRef(null);
  const hiddenInputRef = useRef(null);

  // Focus hidden input on click or mount
  const handleContainerClick = () => {
    if (hiddenInputRef.current) {
      hiddenInputRef.current.focus();
    }
  };

  useEffect(() => {
    if (hiddenInputRef.current) {
      hiddenInputRef.current.focus();
    }
  }, []);

  // Auto-scroll to keep active line centered
  useEffect(() => {
    if (activeCharRef.current && containerRef.current) {
      const charTop = activeCharRef.current.offsetTop;
      const containerHeight = containerRef.current.clientHeight;
      const scrollTarget = charTop - containerHeight / 2 + 30;
      
      containerRef.current.scrollTo({
        top: Math.max(0, scrollTarget),
        behavior: 'smooth'
      });
    }
  }, [currentIndex]);

  const fontSizes = {
    small: 'text-lg leading-relaxed',
    medium: 'text-xl sm:text-2xl leading-relaxed sm:leading-loose',
    large: 'text-2xl sm:text-3xl leading-loose',
  };

  const caretStyles = {
    line: 'w-0.5 bg-brand-pink h-6 sm:h-8 inline-block animate-caret align-middle -mr-0.5 shadow-glow-pink',
    block: 'bg-brand-pink/60 text-white rounded px-0.5 animate-caret',
    underline: 'border-b-2 border-brand-pink animate-caret',
  };

  return (
    <div
      ref={containerRef}
      onClick={handleContainerClick}
      className="relative w-full min-h-[180px] max-h-[260px] overflow-y-auto rounded-3xl bg-dark-900/90 border border-white/[0.08] p-6 sm:p-8 font-mono shadow-2xl backdrop-blur-xl cursor-text select-none focus-within:border-brand-purple/50 transition-colors"
    >
      {/* Hidden input to capture keystrokes reliably across all browsers & touch devices */}
      <input
        ref={hiddenInputRef}
        type="text"
        className="absolute opacity-0 pointer-events-none w-0 h-0"
        autoCapitalize="off"
        autoCorrect="off"
        autoComplete="off"
        spellCheck="false"
        onKeyDown={onKeyDown}
      />

      {/* Helper prompt when idle */}
      {status === 'idle' && (
        <div className="absolute top-3 right-6 text-xs text-slate-300 font-sans flex items-center gap-2 pointer-events-none">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          Click or press any key to begin
        </div>
      )}

      {/* Render Text Characters */}
      <div className={`tracking-wide select-none ${fontSizes[settings.fontSize || 'medium']}`}>
        {targetText.split('').map((char, index) => {
          const isTyped = index < typedText.length;
          const isCurrent = index === currentIndex;
          const isCorrect = isTyped && typedText[index] === char;
          const isError = isTyped && !isCorrect;

          let charClass = "transition-colors duration-75 ";
          if (isCorrect) {
            charClass += "text-slate-100 font-semibold";
          } else if (isError) {
            charClass += settings.highlightMistakes
              ? "text-red-400 bg-red-500/25 rounded px-0.5 font-bold underline decoration-red-400"
              : "text-red-400";
          } else {
            charClass += "text-slate-400";
          }

          return (
            <span
              key={index}
              ref={isCurrent ? activeCharRef : null}
              className={`relative inline-block ${charClass}`}
            >
              {/* Caret before current character */}
              {isCurrent && settings.caretStyle === 'line' && (
                <span className={caretStyles.line} />
              )}
              {isCurrent && settings.caretStyle === 'block' ? (
                <span className={caretStyles.block}>{char}</span>
              ) : (
                char
              )}
            </span>
          );
        })}
      </div>
    </div>
  );
};

export default TypingArea;
