import { useState } from 'react';
import { HelpCircle, CheckCircle2, XCircle, Sparkles } from 'lucide-react';

export const QuizCard = ({ quiz, onQuizSubmit }) => {
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  if (!quiz) return null;

  const isCorrect = selectedIdx === quiz.correctIndex;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedIdx === null || submitted) return;
    setSubmitted(true);
    if (onQuizSubmit) {
      onQuizSubmit(isCorrect ? 100 : 50);
    }
  };

  const handleRetry = () => {
    setSelectedIdx(null);
    setSubmitted(false);
  };

  return (
    <div className="card-glass rounded-2xl p-5 sm:p-6 shadow-xl space-y-4 border border-border/60 hover:border-purple-500/40 hover:shadow-[0_12px_28px_-6px_rgba(168,85,247,0.15)] transition-all duration-300" aria-label="Knowledge Check Quiz">
      <div className="flex items-center justify-between border-b border-border/70 pb-3">
        <div className="flex items-center gap-2">
          <HelpCircle className="text-pink" size={18} />
          <h3 className="font-display text-base font-bold text-foreground">Knowledge Check</h3>
        </div>
        <span className="text-xs font-semibold text-primary">Mini Quiz</span>
      </div>

      <p className="text-sm font-medium text-foreground leading-relaxed">{quiz.question}</p>

      <form onSubmit={handleSubmit} className="space-y-2.5">
        {quiz.options.map((opt, idx) => {
          let optionStyle = 'border-border bg-background/60 hover:bg-accent text-foreground';

          if (submitted) {
            if (idx === quiz.correctIndex) {
              optionStyle = 'border-success bg-success/15 text-success font-semibold shadow-sm';
            } else if (idx === selectedIdx && !isCorrect) {
              optionStyle = 'border-destructive bg-destructive/15 text-destructive';
            } else {
              optionStyle = 'border-border/40 opacity-50 text-muted-foreground';
            }
          } else if (selectedIdx === idx) {
            optionStyle = 'border-primary bg-primary/15 text-primary font-semibold shadow-sm';
          }

          return (
            <button
              key={idx}
              type="button"
              disabled={submitted}
              onClick={() => setSelectedIdx(idx)}
              className={`w-full flex items-center justify-between rounded-xl border p-3.5 text-left text-xs sm:text-sm transition-all select-none ${optionStyle}`}
            >
              <span>{opt}</span>
              {submitted && idx === quiz.correctIndex && <CheckCircle2 size={16} className="text-success shrink-0" />}
              {submitted && idx === selectedIdx && !isCorrect && <XCircle size={16} className="text-destructive shrink-0" />}
            </button>
          );
        })}

        {!submitted ? (
          <button
            type="submit"
            disabled={selectedIdx === null}
            className="bg-gradient-primary glow-primary mt-3 w-full rounded-xl py-3 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed select-none"
          >
            Submit Answer
          </button>
        ) : (
          <div className="pt-2 space-y-3">
            <div
              className={`rounded-xl border p-3.5 text-xs sm:text-sm ${
                isCorrect
                  ? 'border-success/30 bg-success/10 text-success'
                  : 'border-destructive/30 bg-destructive/10 text-destructive'
              }`}
            >
              <div className="flex items-center gap-1.5 font-bold mb-1">
                {isCorrect ? <Sparkles size={16} /> : <XCircle size={16} />}
                <span>{isCorrect ? 'Correct! Excellent understanding.' : 'Not quite right.'}</span>
              </div>
              <p className="text-foreground/90 leading-relaxed">{quiz.explanation}</p>
            </div>

            {!isCorrect && (
              <button
                type="button"
                onClick={handleRetry}
                className="w-full rounded-xl border border-border bg-card py-2.5 text-xs font-semibold text-foreground hover:bg-accent transition-colors select-none"
              >
                Try Again
              </button>
            )}
          </div>
        )}
      </form>
    </div>
  );
};

export default QuizCard;
