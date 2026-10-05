import React, { useState, useEffect } from 'react';
import { Sparkles, Zap, Target, ArrowRight, RefreshCw, Wand2, ShieldAlert, Award } from 'lucide-react';
import { aiService } from '../../services/aiService';
import { toast } from 'react-toastify';

export default function AICoachCard({
  wpm = 0,
  accuracy = 100,
  consistency = 85,
  duration = 30,
  errors = 0,
  errorKeys = [],
  onStartDrill,
}) {
  const [insight, setInsight] = useState('');
  const [loadingFeedback, setLoadingFeedback] = useState(false);
  const [loadingDrill, setLoadingDrill] = useState(false);

  // Derive unique weak keys
  const weakKeys = Array.from(
    new Set(
      errorKeys
        .map((k) => String(k).toLowerCase().trim())
        .filter((k) => k.length === 1 && /[a-z0-9;,.]/.test(k))
    )
  ).slice(0, 5);

  useEffect(() => {
    let isMounted = true;

    async function fetchInsight() {
      setLoadingFeedback(true);
      try {
        const res = await aiService.getCoachFeedback({
          wpm,
          accuracy,
          consistency,
          duration,
          mistakesCount: errors,
        });
        if (isMounted && res?.data?.insight) {
          setInsight(res.data.insight);
        }
      } catch (err) {
        if (isMounted) {
          setInsight('Great effort on this test! Focus on maintaining rhythm to boost speed and accuracy.');
        }
      } finally {
        if (isMounted) setLoadingFeedback(false);
      }
    }

    fetchInsight();

    return () => {
      isMounted = false;
    };
  }, [wpm, accuracy, consistency, duration, errors]);

  const handleGenerateDrill = async () => {
    if (weakKeys.length === 0) {
      toast.info('No weak keys detected in this test! Great job!');
      return;
    }

    setLoadingDrill(true);
    try {
      const res = await aiService.generateWeakKeyDrill({
        weakKeys,
        wordCount: 35,
      });

      if (res?.data?.text || res?.text) {
        const drillText = res?.data?.text || res?.text;
        toast.success(`🎯 AI Targeted Drill ready for keys: [${weakKeys.map(k => k.toUpperCase()).join(', ')}]`);
        if (onStartDrill) {
          onStartDrill(drillText, weakKeys);
        }
      }
    } catch (err) {
      toast.error('Failed to generate drill. Please try again.');
    } finally {
      setLoadingDrill(false);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-sm text-foreground transition-all duration-300">
      {/* Decorative Glow */}
      <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary/10 blur-2xl" />
      <div className="pointer-events-none absolute -left-10 -bottom-10 h-32 w-32 rounded-full bg-purple-500/10 blur-2xl" />

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between gap-2 border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-tr from-primary to-purple-600 text-white shadow-md shadow-primary/25">
            <Sparkles size={16} />
          </div>
          <div>
            <h3 className="font-display text-sm sm:text-base font-bold text-foreground flex items-center gap-1.5">
              AI Typing Coach
              <span className="rounded bg-primary/15 border border-primary/20 px-1.5 py-0.2 text-[9px] font-bold text-primary tracking-wider uppercase">
                Live Insights
              </span>
            </h3>
          </div>
        </div>

        {weakKeys.length > 0 && (
          <div className="flex items-center gap-1 text-[11px] font-semibold text-amber-500 dark:text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-lg">
            <ShieldAlert size={12} />
            <span>{weakKeys.length} Weak {weakKeys.length === 1 ? 'Key' : 'Keys'} Detected</span>
          </div>
        )}
      </div>

      {/* AI Coach Feedback Text */}
      <div className="relative z-10 mt-3 rounded-xl bg-muted/50 p-3 border border-border">
        {loadingFeedback ? (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="h-3 w-3 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            <span>AI Coach is analyzing your keystroke rhythm...</span>
          </div>
        ) : (
          <p className="text-xs sm:text-sm text-foreground/90 italic leading-relaxed">
            "{insight || 'Great effort! Focus on relaxing your fingers for a smooth flow on the next test.'}"
          </p>
        )}
      </div>

      {/* Weak Keys & Quick Drill Action */}
      {weakKeys.length > 0 ? (
        <div className="relative z-10 mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2">
          {/* Key Badges */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-semibold text-muted-foreground">Struggled on:</span>
            <div className="flex items-center gap-1.5">
              {weakKeys.map((key) => (
                <span
                  key={key}
                  className="grid h-6 w-6 place-items-center rounded-md border border-amber-500/40 bg-amber-500/15 font-mono text-xs font-bold text-amber-600 dark:text-amber-300 shadow-sm uppercase"
                >
                  {key}
                </span>
              ))}
            </div>
          </div>

          {/* Drill Button */}
          <button
            type="button"
            onClick={handleGenerateDrill}
            disabled={loadingDrill}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700 px-4 py-2 text-xs font-bold text-white shadow-md shadow-primary/25 transition-all cursor-pointer disabled:opacity-50 select-none"
          >
            {loadingDrill ? (
              <>
                <div className="h-3.5 w-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                <span>Crafting AI Drill...</span>
              </>
            ) : (
              <>
                <Wand2 size={13} />
                <span>Start AI Weak-Key Drill</span>
                <ArrowRight size={13} />
              </>
            )}
          </button>
        </div>
      ) : (
        <div className="relative z-10 mt-2 flex items-center gap-2 text-xs text-emerald-500 dark:text-emerald-400 pt-1">
          <Award size={14} />
          <span>Flawless key accuracy! No weak keys detected on this run.</span>
        </div>
      )}
    </div>
  );
}
