export const Card = ({
  children,
  className = '',
  hover = false,
  glow = false,
  onClick,
  ...props
}) => {
  return (
    <div
      onClick={onClick}
      className={`card-glass rounded-2xl p-6 ${
        hover ? 'transition-all duration-300 hover:border-primary/40 hover:-translate-y-1 hover:shadow-[0_12px_28px_-6px_rgba(59,130,246,0.18)] cursor-pointer' : ''
      } ${glow ? 'glow-primary' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
