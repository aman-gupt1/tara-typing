import { CheckCircle2, XCircle, ShieldCheck, HeartPulse, Eye, Move } from 'lucide-react';

const rules = [
  {
    icon: ShieldCheck,
    title: 'Spine & Back',
    good: 'Sit tall with lower back supported against chair backrest.',
    bad: 'Slouching forward or hunching shoulders over keyboard.',
  },
  {
    icon: Move,
    title: 'Wrists & Hands',
    good: 'Hover wrists neutrally above desk; glide hands across rows.',
    bad: 'Anchoring wrists hard against desk edges while reaching keys.',
  },
  {
    icon: HeartPulse,
    title: 'Elbows & Arms',
    good: 'Keep elbows bent at comfortable 90°–100° angles near your side.',
    bad: 'Flaring elbows outward or reaching far forward for keyboard.',
  },
  {
    icon: Eye,
    title: 'Monitor Height',
    good: 'Top edge of monitor at eye level, roughly 50–70 cm (arm’s length) away.',
    bad: 'Tilting head downward to look at laptop on your lap.',
  },
];

export const PostureGuide = () => {
  return (
    <div className="card-glass rounded-2xl p-5 sm:p-6 shadow-xl" aria-label="Ergonomic Posture Guide">
      <div className="mb-4 flex items-center justify-between border-b border-border/70 pb-3">
        <div>
          <h3 className="font-display text-base font-bold text-foreground">Ergonomic Typing Posture</h3>
          <p className="text-xs text-muted-foreground">Good posture maximizes typing endurance and eliminates wrist strain.</p>
        </div>
        <span className="rounded-full bg-success/15 px-3 py-1 text-xs font-semibold text-success border border-success/30">
          Zero Strain
        </span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {rules.map((rule, rIdx) => {
          const Icon = rule.icon;
          const hoverStyles = [
            'hover:border-blue-500/50 hover:shadow-[0_10px_24px_-4px_rgba(59,130,246,0.18)] hover:bg-gradient-to-b hover:from-blue-500/[0.05] hover:to-transparent',
            'hover:border-emerald-500/50 hover:shadow-[0_10px_24px_-4px_rgba(16,185,129,0.18)] hover:bg-gradient-to-b hover:from-emerald-500/[0.05] hover:to-transparent',
            'hover:border-purple-500/50 hover:shadow-[0_10px_24px_-4px_rgba(168,85,247,0.18)] hover:bg-gradient-to-b hover:from-purple-500/[0.05] hover:to-transparent',
            'hover:border-amber-500/50 hover:shadow-[0_10px_24px_-4px_rgba(245,158,11,0.18)] hover:bg-gradient-to-b hover:from-amber-500/[0.05] hover:to-transparent',
          ];
          const iconColors = [
            'text-blue-400 group-hover:scale-110',
            'text-emerald-400 group-hover:scale-110',
            'text-purple-400 group-hover:scale-110',
            'text-amber-400 group-hover:scale-110',
          ];
          return (
            <div
              key={rule.title}
              className={`group rounded-xl border border-border bg-background/50 p-4 space-y-3 transition-all duration-300 hover:-translate-y-1 ${hoverStyles[rIdx % hoverStyles.length]}`}
            >
              <div className="flex items-center gap-2">
                <Icon size={18} className={`transition-transform duration-300 ${iconColors[rIdx % iconColors.length]}`} />
                <h4 className="text-sm font-semibold text-foreground">{rule.title}</h4>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex items-start gap-2 text-success">
                  <CheckCircle2 size={14} className="shrink-0 mt-0.5" />
                  <span className="text-foreground">{rule.good}</span>
                </div>
                <div className="flex items-start gap-2 text-destructive">
                  <XCircle size={14} className="shrink-0 mt-0.5" />
                  <span className="text-muted-foreground line-through opacity-80">{rule.bad}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PostureGuide;
