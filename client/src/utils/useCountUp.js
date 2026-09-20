import { useState, useEffect } from 'react';
import { useReducedMotion } from 'framer-motion';

/**
 * Lightweight, hardware-friendly count-up animation hook for results & metrics.
 * Runs in ~400ms without blocking UI or re-rendering unnecessarily.
 */
export function useCountUp(target = 0, duration = 400, decimals = 0) {
  const [value, setValue] = useState(0);
  const shouldReduce = useReducedMotion();

  useEffect(() => {
    const num = Number(target) || 0;
    if (shouldReduce || num <= 0) {
      setValue(num);
      return;
    }

    let start = null;
    let frameId;

    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      // Smooth ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = eased * num;
      setValue(decimals > 0 ? +current.toFixed(decimals) : Math.round(current));

      if (progress < 1) {
        frameId = requestAnimationFrame(step);
      } else {
        setValue(num);
      }
    };

    frameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameId);
  }, [target, duration, decimals, shouldReduce]);

  return value;
}

export default useCountUp;
