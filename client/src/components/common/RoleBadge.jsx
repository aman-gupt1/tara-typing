import React from 'react';

/**
 * RoleBadge Component
 *
 * Renders an accessible, refined badge indicating whether the user is a standard USER or an ADMIN.
 * Does not rely solely on color to communicate state.
 */
export const RoleBadge = ({ role = 'user', className = '' }) => {
  const normalized = (role || 'user').toLowerCase().trim();
  const isAdmin = normalized === 'admin';

  if (isAdmin) {
    return (
      <span
        className={`inline-flex items-center gap-1 rounded-md border border-blue-500/30 bg-blue-500/10 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 select-none shadow-xs ${className}`}
        aria-label="Account role: ADMIN"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-blue-600 dark:bg-blue-400 shrink-0" aria-hidden="true" />
        ADMIN
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md border border-border bg-muted/80 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground select-none ${className}`}
      aria-label="Account role: USER"
    >
      USER
    </span>
  );
};

export default RoleBadge;
