export const Badge = ({
  children,
  variant = 'purple', // 'purple' | 'pink' | 'cyan' | 'emerald' | 'amber' | 'neutral'
  className = '',
  size = 'md',
}) => {
  const variants = {
    purple: 'bg-primary/15 text-primary border-primary/30',
    pink: 'bg-pink/15 text-pink border-pink/30',
    cyan: 'bg-chart-3/15 text-chart-3 border-chart-3/30',
    emerald: 'bg-success/15 text-success border-success/30',
    amber: 'bg-amber-500/15 text-amber-500 border-amber-500/30',
    neutral: 'bg-muted text-muted-foreground border-border',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs font-semibold',
    lg: 'px-3 py-1.5 text-sm font-semibold',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border ${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
