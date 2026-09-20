import { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Sparkles, Moon, Sun, Menu, User, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import MobileSidebar from './MobileSidebar';
import UserAvatar from '../common/UserAvatar';
import RoleBadge from '../common/RoleBadge';

const navLinks = [
  { path: '/', label: 'Home' },
  { path: '/typing-test', label: 'Typing Test' },
  { path: '/practice', label: 'Practice' },
  { path: '/learn', label: 'Learn Typing' },
  { path: '/leaderboard', label: 'Leaderboard' },
  { path: '/daily-challenge', label: 'Daily Challenge' },
  { path: '/about', label: 'About' },
];

export const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const shouldReduceMotion = useReducedMotion();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const triggerRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown on outside click or Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && dropdownOpen) {
        setDropdownOpen(false);
        triggerRef.current?.focus();
      }
    };

    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [dropdownOpen]);

  const handleLogout = () => {
    setDropdownOpen(false);
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-xl">
      <nav
        className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <Link
          to="/"
          className="group flex items-center gap-1.5 select-none"
          aria-label="Tara Typing home"
        >
          <span className="font-display text-xl font-bold tracking-tight text-foreground">
            Tara<span className="text-gradient"> Typing</span>
          </span>
          <Sparkles
            size={16}
            className="text-pink transition-transform duration-300 group-hover:rotate-12"
            aria-hidden="true"
          />
        </Link>

        {/* Center Desktop Navigation */}
        <div className="hidden items-center gap-6 lg:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `relative py-1 text-sm transition-colors hover:text-foreground ${
                  isActive
                    ? 'font-semibold text-foreground after:absolute after:-bottom-[21px] after:left-0 after:right-0 after:h-0.5 after:bg-primary after:rounded-full'
                    : 'text-muted-foreground'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        {/* Right Desktop Controls */}
        <div className="hidden items-center gap-3 md:flex">
          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            className="grid h-9 w-9 place-items-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
          >
            {theme === 'dark' ? <Moon size={16} /> : <Sun size={16} />}
          </button>

          {/* Authenticated / Unauthenticated UI */}
          {isAuthenticated && user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                ref={triggerRef}
                type="button"
                onClick={() => setDropdownOpen((prev) => !prev)}
                className="flex items-center gap-2 rounded-lg border border-border dark:border-[#1E293B] bg-slate-100/80 dark:bg-[#0B1120] hover:bg-slate-200/80 dark:hover:bg-[#131D33] p-1 pr-2.5 transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus:outline-none select-none cursor-pointer"
                aria-expanded={dropdownOpen}
                aria-haspopup="true"
                aria-label={`Account menu for ${user.name || user.username || 'User'}`}
              >
                {/* Rectangle Avatar on left */}
                <UserAvatar
                  src={user.avatar}
                  name={user.name}
                  username={user.username}
                  className="h-8 w-8"
                  textClassName="text-xs font-bold"
                  rounded="rounded-md"
                />

                {/* 0-index Name on right */}
                <span className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white truncate max-w-[110px]">
                  {(user.name || user.username || 'User').trim().split(/\s+/)[0]}
                </span>
              </button>

              {/* Profile Dropdown Menu */}
              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    role="menu"
                    aria-orientation="vertical"
                    aria-label="User account menu"
                    initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.98, y: -6 }}
                    animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
                    exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.98, y: -4 }}
                    transition={{
                      duration: shouldReduceMotion ? 0.05 : 0.16,
                      exit: { duration: shouldReduceMotion ? 0.05 : 0.12, ease: 'easeIn' },
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="absolute right-0 mt-2.5 w-64 rounded-xl border border-[#1E293B] bg-[#0B1120] p-2 shadow-2xl shadow-black/80 backdrop-blur-xl z-50 select-none origin-top-right"
                  >
                    {/* User Profile Header with Role Badge */}
                    <div className="flex items-center gap-3 border-b border-[#1E293B] p-2.5 pb-3">
                      <UserAvatar
                        src={user.avatar}
                        name={user.name}
                        username={user.username}
                        className="h-12 w-12"
                        textClassName="text-sm font-bold"
                        rounded="rounded-lg"
                      />
                      <div className="min-w-0 flex-1 overflow-hidden">
                        <div className="flex items-center justify-between gap-1.5">
                          <p className="truncate text-sm font-bold text-white">{user.name}</p>
                          <RoleBadge role={user.role} />
                        </div>
                        <p className="truncate text-xs text-slate-400 mt-0.5">@{user.username || 'user'}</p>
                      </div>
                    </div>

                    {/* Navigation Links */}
                    <div className="py-1" role="none">
                      <Link
                        to="/profile"
                        role="menuitem"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-200 select-none cursor-pointer"
                      >
                        <User size={17} className="text-slate-400 shrink-0" />
                        <span>Profile</span>
                      </Link>
                      <Link
                        to="/settings"
                        role="menuitem"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-200 select-none cursor-pointer"
                      >
                        <Settings size={17} className="text-slate-400 shrink-0" />
                        <span>Settings</span>
                      </Link>
                    </div>

                    {/* Divider & Logout Action */}
                    <div className="border-t border-[#1E293B] pt-1" role="none">
                      <button
                        type="button"
                        role="menuitem"
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-[#EF4444] select-none cursor-pointer"
                      >
                        <LogOut size={17} className="text-[#EF4444] shrink-0" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent select-none"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-gradient-primary glow-primary rounded-lg px-4 py-2 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.03] select-none"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            className="grid h-9 w-9 place-items-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:text-foreground"
          >
            {theme === 'dark' ? <Moon size={16} /> : <Sun size={16} />}
          </button>
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            className="grid h-9 w-9 place-items-center rounded-lg border border-border text-foreground transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-ring"
          >
            <Menu size={18} />
          </button>
        </div>
      </nav>

      {/* Mobile Slide-Over Sidebar */}
      <MobileSidebar open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </header>
  );
};

export default Navbar;
