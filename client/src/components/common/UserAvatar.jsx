import { useState } from 'react';

/**
 * Checks whether an avatar string is empty or a default backend placeholder
 */
export const isDefaultOrEmptyAvatar = (avatarUrl) => {
  if (!avatarUrl || typeof avatarUrl !== 'string') return true;
  const trimmed = avatarUrl.trim();
  if (trimmed === '' || trimmed === 'null' || trimmed === 'undefined') return true;
  if (trimmed.includes('photo-1535713875002-d1d0cf377fde')) return true; // Backend default avatar
  if (trimmed.includes('dicebear')) return true; // Default dicebear robot/bottts avatars
  return false;
};

/**
 * Generates clean, intelligent first letter or initials from a user's name or username.
 * Example:
 *   "Aman Gupta" with firstLetterOnly=true -> "A"
 *   "Aman Kumar" with firstLetterOnly=false -> "AK"
 *   "Tara Typist" -> "T"
 */
export const getInitials = (name = '', username = '', firstLetterOnly = true) => {
  const cleanName = (name || '').trim();
  if (cleanName) {
    if (firstLetterOnly) {
      return cleanName.charAt(0).toUpperCase();
    }
    const parts = cleanName.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      const first = parts[0].charAt(0);
      const last = parts[parts.length - 1].charAt(0);
      return `${first}${last}`.toUpperCase();
    }
    if (parts.length === 1 && parts[0].length >= 2) {
      return parts[0].slice(0, 2).toUpperCase();
    }
    if (parts.length === 1) {
      return parts[0].charAt(0).toUpperCase();
    }
  }

  const cleanUser = (username || '').trim().replace(/^@/, '');
  if (cleanUser) {
    if (firstLetterOnly) {
      return cleanUser.charAt(0).toUpperCase();
    }
    if (cleanUser.length >= 2) {
      return cleanUser.slice(0, 2).toUpperCase();
    }
    return cleanUser.charAt(0).toUpperCase();
  }

  return 'T';
};

/**
 * Refined, deterministic gradient palette based on user identity.
 * Always produces the exact same aesthetic for the same user.
 */
const PALETTES = [
  { gradient: 'from-blue-600 to-indigo-600', text: 'text-white' },
  { gradient: 'from-indigo-600 to-violet-600', text: 'text-white' },
  { gradient: 'from-sky-500 to-blue-600', text: 'text-white' },
  { gradient: 'from-orange-500 to-amber-600', text: 'text-white' },
  { gradient: 'from-purple-600 to-violet-700', text: 'text-white' },
  { gradient: 'from-emerald-600 to-teal-700', text: 'text-white' },
  { gradient: 'from-slate-700 to-slate-900', text: 'text-white' },
];

const getDeterministicPalette = (identity = '') => {
  const str = String(identity || 'user').trim().toLowerCase();
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % PALETTES.length;
  return PALETTES[index];
};

export const UserAvatar = ({
  src,
  name = '',
  username = '',
  className = 'h-10 w-10',
  textClassName = '',
  alt,
  interactive = false,
  rounded = 'rounded-full',
  firstLetterOnly = true,
}) => {
  const [imageError, setImageError] = useState(false);

  const displayName = (name || username || 'User').trim();
  const initials = getInitials(name, username, firstLetterOnly);
  const hasUploadedCustomAvatar = !isDefaultOrEmptyAvatar(src) && !imageError;

  const hoverEffect = interactive ? 'transition-transform duration-150 hover:scale-[1.03]' : '';

  if (hasUploadedCustomAvatar) {
    return (
      <img
        src={src}
        alt={alt || displayName}
        onError={() => setImageError(true)}
        className={`${className} ${rounded} object-cover border border-border/80 dark:border-white/10 shadow-xs shrink-0 ${hoverEffect}`}
      />
    );
  }

  const palette = getDeterministicPalette(displayName || username);

  return (
    <div
      aria-label={displayName}
      role="img"
      className={`${className} ${rounded} bg-gradient-to-br ${palette.gradient} border border-white/15 dark:border-white/10 shadow-xs flex items-center justify-center font-display font-bold ${palette.text} select-none shrink-0 uppercase tracking-tight ${hoverEffect}`}
    >
      <span className={textClassName || 'text-xs sm:text-sm font-semibold'}>{initials}</span>
    </div>
  );
};

export default UserAvatar;
