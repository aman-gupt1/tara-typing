import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Sparkles,
  LogOut,
  User,
  Settings,
  Home,
  Keyboard,
  BookOpen,
  Trophy,
  Flame,
  Info,
  GraduationCap,
} from 'lucide-react';
import UserAvatar from '../common/UserAvatar';
import RoleBadge from '../common/RoleBadge';
import { useAuth } from '../../context/AuthContext';

const mainNavItems = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/typing-test', label: 'Typing Test', icon: Keyboard },
  { path: '/practice', label: 'Practice', icon: BookOpen },
  { path: '/learn', label: 'Learn Typing', icon: GraduationCap },
  { path: '/leaderboard', label: 'Leaderboard', icon: Trophy },
  { path: '/daily-challenge', label: 'Daily Challenge', icon: Flame },
  { path: '/about', label: 'About', icon: Info },
];

export const MobileSidebar = ({ open, onClose }) => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle Escape key and lock background scrolling
  useEffect(() => {
    if (!open) return;

    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKey);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = originalOverflow;
    };
  }, [open, onClose]);

  const handleLogout = () => {
    onClose();
    logout();
    navigate('/');
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] lg:hidden" role="dialog" aria-modal="true">
          {/* Semi-transparent Dark Backdrop */}
          <motion.div
            key="mobile-sidebar-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            onClick={onClose}
            aria-hidden="true"
            className="fixed inset-0 z-40 bg-black/65 backdrop-blur-sm"
          />

          {/* Independent Fixed Sidebar Drawer (Horizontal Slide ONLY) */}
          <motion.aside
            key="mobile-sidebar-drawer"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            aria-label="Mobile navigation drawer"
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              bottom: 0,
              height: '100dvh',
              width: '280px',
              maxWidth: '85vw',
            }}
            className="z-50 flex flex-col border-r border-border bg-card text-foreground shadow-2xl overflow-hidden transition-colors duration-200"
          >
            {/* Sidebar Header */}
            <div className="flex h-16 shrink-0 items-center justify-between border-b border-border px-4 bg-card">
              <Link
                to="/"
                onClick={onClose}
                className="group flex items-center gap-1.5 select-none"
                aria-label="Tara Typing home"
              >
                <span className="font-display text-xl font-bold tracking-tight text-foreground">
                  Tara<span className="text-gradient"> Typing</span>
                </span>
                <Sparkles size={16} className="text-pink" aria-hidden="true" />
              </Link>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close menu"
                className="grid h-9 w-9 place-items-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
              >
                <X size={18} />
              </button>
            </div>

            {/* Scrollable Navigation Body */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col justify-between">
              <div>
                {/* User Section if Logged In */}
                {isAuthenticated && user && (
                  <Link
                    to="/profile"
                    onClick={onClose}
                    className="mb-4 flex items-center gap-3 rounded-xl border border-border bg-background p-3 transition-colors hover:bg-accent"
                  >
                    <UserAvatar
                      src={user.avatar}
                      name={user.name}
                      username={user.username}
                      className="h-10 w-10 shrink-0"
                      textClassName="text-sm font-semibold"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <p className="truncate text-sm font-semibold text-foreground">{user.name}</p>
                        <RoleBadge role={user.role} />
                      </div>
                      <p className="truncate text-xs text-muted-foreground">@{user.username || 'user'}</p>
                    </div>
                  </Link>
                )}

                {/* Main Navigation Links */}
                <nav className="space-y-1">
                  {mainNavItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={onClose}
                        className={({ isActive }) =>
                          `flex h-11 items-center gap-3 rounded-xl px-3.5 text-sm font-medium transition-colors select-none ${
                            isActive
                              ? 'bg-primary/15 font-semibold text-primary border border-primary/30'
                              : 'text-muted-foreground hover:bg-accent/70 hover:text-foreground'
                          }`
                        }
                      >
                        <Icon size={18} aria-hidden="true" className="shrink-0" />
                        <span>{item.label}</span>
                      </NavLink>
                    );
                  })}
                </nav>

                {/* Authenticated Typist Account Links */}
                {isAuthenticated && (
                  <div className="mt-4 border-t border-border/80 pt-4">
                    <p className="px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                      Account
                    </p>
                    <nav className="space-y-1">
                      <NavLink
                        to="/profile"
                        onClick={onClose}
                        className={({ isActive }) =>
                          `flex h-11 items-center gap-3 rounded-xl px-3.5 text-sm font-medium transition-colors select-none ${
                            isActive
                              ? 'bg-primary/15 font-semibold text-primary border border-primary/30'
                              : 'text-muted-foreground hover:bg-accent/70 hover:text-foreground'
                          }`
                        }
                      >
                        <User size={18} aria-hidden="true" className="shrink-0" />
                        <span>Profile</span>
                      </NavLink>
                      <NavLink
                        to="/settings"
                        onClick={onClose}
                        className={({ isActive }) =>
                          `flex h-11 items-center gap-3 rounded-xl px-3.5 text-sm font-medium transition-colors select-none ${
                            isActive
                              ? 'bg-primary/15 font-semibold text-primary border border-primary/30'
                              : 'text-muted-foreground hover:bg-accent/70 hover:text-foreground'
                          }`
                        }
                      >
                        <Settings size={18} aria-hidden="true" className="shrink-0" />
                        <span>Settings</span>
                      </NavLink>
                    </nav>
                  </div>
                )}
              </div>

              {/* Bottom Actions */}
              <div className="mt-6 pt-4 border-t border-border/80">
                {isAuthenticated ? (
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex h-11 w-full items-center gap-2.5 rounded-xl px-3.5 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10 select-none"
                  >
                    <LogOut size={18} aria-hidden="true" className="shrink-0" />
                    <span>Logout</span>
                  </button>
                ) : (
                  <div className="flex flex-col gap-2.5">
                    <Link
                      to="/login"
                      onClick={onClose}
                      className="grid h-11 place-items-center rounded-xl border border-border bg-background text-sm font-medium text-foreground transition-colors hover:bg-accent select-none"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      onClick={onClose}
                      className="bg-gradient-primary glow-primary grid h-11 place-items-center rounded-xl text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.02] select-none"
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default MobileSidebar;
