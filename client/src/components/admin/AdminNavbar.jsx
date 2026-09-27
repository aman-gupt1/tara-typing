import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Menu,
  Sun,
  Moon,
  Bell,
  CheckCircle2,
  AlertTriangle,
  Settings,
  ShieldCheck,
  LogOut,
  ExternalLink,
  ChevronDown,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import UserAvatar from '../common/UserAvatar';

export const AdminNavbar = ({ onOpenMobile = () => {} }) => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const profileRef = useRef(null);
  const notificationsRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(e.target)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      if (logout) await logout();
    } finally {
      navigate('/');
    }
  };

  const dummyNotifications = [
    {
      id: 1,
      title: 'Suspicious Score Detected',
      desc: '@fast_typist scored 287 WPM on 60s test',
      time: '12m ago',
      type: 'warning',
    },
    {
      id: 2,
      title: 'Daily Challenge Published',
      desc: 'Tech Words Sprint auto-rotated for today',
      time: '1h ago',
      type: 'success',
    },
    {
      id: 3,
      title: 'System Health Check',
      desc: 'All services operating at 99.98% uptime',
      time: '3h ago',
      type: 'info',
    },
  ];

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200/80 dark:border-slate-800/80 bg-white/95 dark:bg-[#0B1120]/95 backdrop-blur-md px-4 sm:px-6">
      {/* Left: Mobile Menu Toggle */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobile}
          className="lg:hidden grid h-9 w-9 place-items-center rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Open mobile menu"
        >
          <Menu size={18} />
        </button>
      </div>

      {/* Right: Actions, Theme, Notifications & Admin Menu */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Theme Toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
          className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} theme`}
        >
          {theme === 'dark' ? (
            <Sun size={17} className="text-amber-400" />
          ) : (
            <Moon size={17} className="text-purple-600" />
          )}
        </button>

        {/* Notifications Dropdown */}
        <div className="relative" ref={notificationsRef}>
          <button
            type="button"
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            aria-label="Notifications"
            className="relative grid h-9 w-9 place-items-center rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <Bell size={17} />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900" />
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-2 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                <p className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Admin Alerts
                </p>
                <span className="text-[10px] font-semibold text-purple-600 dark:text-purple-400">
                  3 New
                </span>
              </div>

              <div className="py-1 space-y-1">
                {dummyNotifications.map((notif) => (
                  <div
                    key={notif.id}
                    className="flex items-start gap-2.5 rounded-xl p-2.5 text-xs hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
                  >
                    {notif.type === 'warning' ? (
                      <AlertTriangle size={15} className="text-amber-500 shrink-0 mt-0.5" />
                    ) : (
                      <CheckCircle2 size={15} className="text-emerald-500 shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                        {notif.title}
                      </p>
                      <p className="text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5 text-[11px]">
                        {notif.desc}
                      </p>
                      <span className="text-[10px] text-slate-400 mt-1 block">
                        {notif.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-1 border-t border-slate-100 dark:border-slate-800 text-center">
                <Link
                  to="/admin/reports"
                  onClick={() => setNotificationsOpen(false)}
                  className="block py-1.5 text-xs font-semibold text-purple-600 dark:text-purple-400 hover:underline"
                >
                  View Moderation Queue
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Admin Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            type="button"
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-1.5 pr-2.5 text-left transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/80"
          >
            <UserAvatar
              src={user?.avatar}
              name={user?.name}
              username={user?.username}
              className="h-7 w-7"
              textClassName="text-[11px] font-bold"
              rounded="rounded-lg"
              firstLetterOnly
            />
            <div className="hidden md:block">
              <p className="text-xs font-bold text-slate-900 dark:text-white leading-none truncate max-w-[110px]">
                {user?.name || 'Aman Gupta'}
              </p>
              <span className="text-[10px] font-semibold text-purple-600 dark:text-purple-400">
                Super Admin
              </span>
            </div>
            <ChevronDown size={14} className="text-slate-400 hidden sm:block" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-60 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-2 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
              {/* Header */}
              <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2.5">
                <UserAvatar
                  src={user?.avatar}
                  name={user?.name}
                  username={user?.username}
                  className="h-9 w-9"
                  textClassName="text-xs font-bold"
                  rounded="rounded-lg"
                  firstLetterOnly
                />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {user?.name || 'Aman Gupta'}
                  </p>
                  <p className="text-[11px] text-slate-400 truncate">
                    {user?.email || 'admin@taratyping.com'}
                  </p>
                </div>
              </div>

              {/* Menu items */}
              <div className="py-1 space-y-0.5">
                <Link
                  to="/"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <ExternalLink size={15} className="text-slate-400" />
                  <span>Public Website</span>
                </Link>
                
                <Link
                  to="/admin/settings"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <Settings size={15} className="text-slate-400" />
                  <span>Settings</span>
                </Link>
              </div>

              {/* Logout */}
              <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
                >
                  <LogOut size={15} className="text-rose-500" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AdminNavbar;
