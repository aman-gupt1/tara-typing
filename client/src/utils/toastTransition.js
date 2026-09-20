import { cssTransition } from 'react-toastify';

/**
 * Premium toast transition conforming to Tara Typing animation specifications:
 * Entrance: fade + translateY(8px) (200ms, cubic-bezier ease-out)
 * Exit: fade + translateY(-4px) (150ms, ease-in)
 */
export const taraToastTransition = cssTransition({
  enter: 'tara-toast-enter',
  exit: 'tara-toast-exit',
  duration: [200, 150],
});

export default taraToastTransition;
