import { Gauge, CheckCircle, AlertTriangle, ArrowRight } from 'lucide-react';

export const WpmVisualizer = () => {
  return (
    <div className="card-glass rounded-2xl p-5 sm:p-6 shadow-xl space-y-6 border border-border/60 hover:border-pink/40 hover:shadow-[0_12px_28px_-6px_rgba(236,72,153,0.15)] transition-all duration-300" aria-label="WPM Metrics Comparison">
      <div className="border-b border-border/70 pb-3">
        <h3 className="font-display text-base font-bold text-foreground flex items-center gap-2">
          <Gauge className="text-pink" size={18} />
          <span>Raw WPM vs Net WPM & Accuracy Tradeoff</span>
        </h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          See why precision always outperforms reckless speed in real-world productivity.
        </p>
      </div>

      {/* Case Study Comparison */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Typist A */}
        <div className="group rounded-xl border border-destructive/30 bg-destructive/5 p-4 space-y-3 transition-all duration-300 hover:border-destructive/60 hover:shadow-[0_10px_24px_-4px_rgba(239,68,68,0.18)] hover:-translate-y-1 hover:bg-gradient-to-b hover:from-destructive/[0.08] hover:to-transparent">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-destructive flex items-center gap-1.5">
              <AlertTriangle size={14} className="transition-transform duration-300 group-hover:scale-110" /> Typist A (Rushing)
            </span>
            <span className="text-xs font-mono font-bold text-destructive">82% Acc</span>
          </div>

          <div className="flex items-baseline gap-3">
            <div>
              <span className="text-2xl font-bold font-display text-foreground">90</span>
              <span className="text-xs text-muted-foreground ml-1">Raw WPM</span>
            </div>
            <ArrowRight size={14} className="text-muted-foreground" />
            <div>
              <span className="text-2xl font-bold font-display text-destructive">58</span>
              <span className="text-xs text-destructive ml-1">Net Real WPM</span>
            </div>
          </div>

          <p className="text-xs text-muted-foreground leading-relaxed">
            High raw speed, but loses <strong>32 WPM</strong> stopping to backspace and re-type errors. Flow state is constantly interrupted.
          </p>
        </div>

        {/* Typist B */}
        <div className="group rounded-xl border border-success/30 bg-success/5 p-4 space-y-3 transition-all duration-300 hover:border-success/60 hover:shadow-[0_10px_24px_-4px_rgba(16,185,129,0.18)] hover:-translate-y-1 hover:bg-gradient-to-b hover:from-success/[0.08] hover:to-transparent">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-success flex items-center gap-1.5">
              <CheckCircle size={14} className="transition-transform duration-300 group-hover:scale-110" /> Typist B (Smooth & Accurate)
            </span>
            <span className="text-xs font-mono font-bold text-success">99% Acc</span>
          </div>

          <div className="flex items-baseline gap-3">
            <div>
              <span className="text-2xl font-bold font-display text-foreground">72</span>
              <span className="text-xs text-muted-foreground ml-1">Raw WPM</span>
            </div>
            <ArrowRight size={14} className="text-muted-foreground" />
            <div>
              <span className="text-2xl font-bold font-display text-success">71</span>
              <span className="text-xs text-success ml-1">Net Real WPM</span>
            </div>
          </div>

          <p className="text-xs text-muted-foreground leading-relaxed">
            Maintains zero backspacing and steady rhythm. Completes essays, code, and documents <strong>22% faster</strong> than Typist A!
          </p>
        </div>
      </div>

      {/* Standard Formula Summary */}
      <div className="rounded-xl border border-border bg-background/60 p-4 grid gap-3 sm:grid-cols-3 text-center transition-all duration-300 hover:border-primary/40 hover:shadow-[0_8px_20px_-4px_rgba(59,130,246,0.12)]">
        <div>
          <p className="text-[11px] text-muted-foreground uppercase font-semibold">Standard Unit</p>
          <p className="font-display font-bold text-sm text-foreground mt-0.5">1 Word = 5 Keystrokes</p>
        </div>
        <div>
          <p className="text-[11px] text-muted-foreground uppercase font-semibold">Raw WPM Formula</p>
          <p className="font-mono text-xs text-primary font-bold mt-0.5">(Chars / 5) / Minutes</p>
        </div>
        <div>
          <p className="text-[11px] text-muted-foreground uppercase font-semibold">Net WPM Formula</p>
          <p className="font-mono text-xs text-pink font-bold mt-0.5">Raw WPM - Errors/Min</p>
        </div>
      </div>
    </div>
  );
};

export default WpmVisualizer;
