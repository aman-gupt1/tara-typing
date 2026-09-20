/**
 * Reusable subtle shimmer skeleton loader component.
 * Adapts seamlessly across light and dark modes.
 */
export const Skeleton = ({ className = '', ...props }) => {
  return (
    <div
      aria-hidden="true"
      className={`skeleton-shimmer rounded-lg ${className}`}
      {...props}
    />
  );
};

export default Skeleton;
