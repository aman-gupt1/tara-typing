import { Hand } from 'lucide-react';

const leftHand = [
  { finger: 'Pinky', key: 'A', reaches: 'Q, A, Z, 1, Tab, Shift', color: 'border-pink/40 bg-pink/10 text-pink' },
  { finger: 'Ring', key: 'S', reaches: 'W, S, X, 2', color: 'border-purple-500/40 bg-purple-500/10 text-purple-400' },
  { finger: 'Middle', key: 'D', reaches: 'E, D, C, 3', color: 'border-blue-500/40 bg-blue-500/10 text-blue-400' },
  { finger: 'Index', key: 'F', reaches: 'R, T, F, G, V, B, 4, 5', color: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400' },
];

const rightHand = [
  { finger: 'Index', key: 'J', reaches: 'Y, U, H, J, N, M, 6, 7', color: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400' },
  { finger: 'Middle', key: 'K', reaches: 'I, K, ,, 8', color: 'border-blue-500/40 bg-blue-500/10 text-blue-400' },
  { finger: 'Ring', key: 'L', reaches: 'O, L, ., 9', color: 'border-purple-500/40 bg-purple-500/10 text-purple-400' },
  { finger: 'Pinky', key: ';', reaches: 'P, ;, /, 0, -, Enter', color: 'border-pink/40 bg-pink/10 text-pink' },
];

export const FingerGuide = () => {
  return (
    <div className="card-glass rounded-2xl p-5 sm:p-6 shadow-xl border border-border/60 hover:border-primary/40 hover:shadow-[0_12px_28px_-6px_rgba(59,130,246,0.15)] transition-all duration-300" aria-label="Finger Placement Guide">
      <div className="mb-4 flex items-center justify-between border-b border-border/70 pb-3">
        <div className="flex items-center gap-2">
          <Hand size={18} className="text-primary" />
          <h3 className="font-display text-base font-bold text-foreground">Finger-to-Key Mapping Guide</h3>
        </div>
        <span className="text-xs text-muted-foreground">Both Hands & Thumbs</span>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Left Hand Card */}
        <div className="rounded-xl border border-border/80 bg-background/50 p-4 transition-all duration-300 hover:border-blue-500/40 hover:shadow-[0_8px_20px_-4px_rgba(59,130,246,0.12)] hover:-translate-y-0.5">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">Left Hand</span>
            <span className="text-[11px] text-muted-foreground">Home Row: A - S - D - F</span>
          </div>

          <div className="space-y-2">
            {leftHand.map((item) => (
              <div
                key={item.finger}
                className={`flex items-center justify-between rounded-lg border p-2.5 transition-colors ${item.color}`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="grid h-7 w-7 place-items-center rounded-md font-display text-xs font-bold border border-current/30">
                    {item.key}
                  </span>
                  <div>
                    <p className="text-xs font-semibold">{item.finger} Finger</p>
                    <p className="text-[10px] opacity-80">Home: {item.key}</p>
                  </div>
                </div>
                <span className="text-[11px] font-mono opacity-90">{item.reaches}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Hand Card */}
        <div className="rounded-xl border border-border/80 bg-background/50 p-4 transition-all duration-300 hover:border-purple-500/40 hover:shadow-[0_8px_20px_-4px_rgba(168,85,247,0.12)] hover:-translate-y-0.5">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">Right Hand</span>
            <span className="text-[11px] text-muted-foreground">Home Row: J - K - L - ;</span>
          </div>

          <div className="space-y-2">
            {rightHand.map((item) => (
              <div
                key={item.finger}
                className={`flex items-center justify-between rounded-lg border p-2.5 transition-colors ${item.color}`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="grid h-7 w-7 place-items-center rounded-md font-display text-xs font-bold border border-current/30">
                    {item.key}
                  </span>
                  <div>
                    <p className="text-xs font-semibold">{item.finger} Finger</p>
                    <p className="text-[10px] opacity-80">Home: {item.key}</p>
                  </div>
                </div>
                <span className="text-[11px] font-mono opacity-90">{item.reaches}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Thumbs Bar */}
      <div className="mt-4 flex items-center justify-between rounded-xl border border-primary/30 bg-primary/10 p-3 text-xs text-foreground transition-all duration-300 hover:border-emerald-500/50 hover:shadow-[0_8px_20px_-4px_rgba(16,185,129,0.15)]">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-primary">Both Thumbs:</span>
          <span>Rest lightly over the <strong>Spacebar</strong>. Use whichever thumb feels most natural.</span>
        </div>
        <span className="font-mono text-xs font-bold text-primary">Space [␣]</span>
      </div>
    </div>
  );
};

export default FingerGuide;
