import { motion, useReducedMotion } from 'framer-motion';

/**
 * Standardized route page transition wrapper.
 * Entrance: opacity 0 -> 1, translateY 8px -> 0 (220ms ease-out)
 * Exit: opacity 1 -> 0, translateY 0 -> -4px (140ms ease-out)
 * Automatically complies with prefers-reduced-motion.
 */
export const PageTransition = ({ children, className = '' }) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -4 }}
      transition={{
        duration: shouldReduceMotion ? 0.05 : 0.22,
        exit: { duration: shouldReduceMotion ? 0.05 : 0.14 },
        ease: [0.16, 1, 0.3, 1],
      }}
      className={`w-full flex-1 flex flex-col ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
