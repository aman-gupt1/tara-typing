import { forwardRef } from 'react';

const Button = forwardRef(({
  children,
  variant = 'primary', // 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size = 'md', // 'sm' | 'md' | 'lg'
  className = '',
  disabled = false,
  onClick,
  type = 'button',
  icon: Icon,
  iconPosition = 'left',
  ...props
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]";

  const sizes = {
    sm: "px-3 py-1.5 text-xs gap-1.5",
    md: "px-4 py-2.5 text-sm gap-2",
    lg: "px-6 py-3.5 text-base gap-2.5 font-semibold",
  };

  const variants = {
    primary: "bg-gradient-primary glow-primary text-primary-foreground border border-primary/20 hover:scale-[1.01]",
    secondary: "bg-card hover:bg-accent text-foreground border border-border",
    outline: "bg-transparent hover:bg-primary/10 text-primary border border-primary/40 hover:border-primary",
    ghost: "bg-transparent hover:bg-accent text-muted-foreground hover:text-foreground",
    danger: "bg-destructive/15 hover:bg-destructive/25 text-destructive border border-destructive/30",
  };

  return (
    <button
      ref={ref}
      type={type}
      className={`${baseStyles} ${sizes[size]} ${variants[variant]} ${className}`}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {Icon && iconPosition === 'left' && <Icon className={size === 'sm' ? 'w-3.5 h-3.5' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'} />}
      {children}
      {Icon && iconPosition === 'right' && <Icon className={size === 'sm' ? 'w-3.5 h-3.5' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'} />}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;
