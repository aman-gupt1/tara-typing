import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Keyboard,
  Trophy,
  Flame,
  BookOpen,
  Award,
  BarChart3,
  Flag,
  Megaphone,
  Settings,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Sparkles,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import UserAvatar from '../common/UserAvatar';

const navItems = [
  { path: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { path: '/admin/users', label: 'Users', icon: Users },
  { path: '/admin/typing-tests', label: 'Typing Tests', icon: Keyboard },
  { path: '/admin/leaderboard', label: 'Leaderboard', icon: Trophy },
  { path: '/admin/challenges', label: 'Daily Challenges', icon: Flame, badge: 'Active' },
  { path: '/admin/learning', label: 'Learning Content', icon: BookOpen },
  { path: '/admin/achievements', label: 'Achievements', icon: Award },
  { path: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { path: '/admin/reports', label: 'Reports & Moderation', icon: Flag },
  { path: '/admin/announcements', label: 'Announcements', icon: Megaphone },
  { path: '/admin/settings', label: 'Settings', icon: Settings },
  { path: '/admin/security', label: 'Admin Security', icon: ShieldCheck },
];

export const AdminSidebar = ({
  collapsed = false,
  setCollapsed = () => {},
  isMobileOpen = false,
  setIsMobileOpen = () => {},
}) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      if (logout) await logout();
    } finally {
      navigate('/');
    }
  };

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col border-r border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#0B1120] text-slate-700 dark:text-slate-300 transition-all duration-300 ${
          collapsed ? 'w-20' : 'w-64'
        } ${
          isMobileOpen
            ? 'translate-x-0 shadow-2xl'
            : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div
          className={`flex h-16 items-center ${
            collapsed ? 'justify-center px-2' : 'justify-between px-4'
          } border-b border-slate-200/80 dark:border-slate-800/80 relative`}
        >
          <Link
            to="/admin"
            className={`flex items-center gap-2.5 font-display focus:outline-none ${
              collapsed ? 'justify-center' : 'overflow-hidden'
            }`}
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-pink-500 shadow-sm shadow-purple-500/20 text-white">
              <Keyboard size={22} className="stroke-[2.2]" />
            </div>

            {!collapsed && (
              <div className="flex flex-col">
                <span className="text-base font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5 leading-none">
                  <span>TARA</span>
                  <span className="text-purple-600 dark:text-purple-400">TYPING</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-400 mt-1">
                  Admin Dashboard
                </span>
              </div>
            )}
          </Link>

          {/* Close for mobile drawer */}
          <button
            type="button"
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
          >
            <X size={18} />
          </button>

          {/* Collapse Toggle for Desktop */}
          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className={`hidden lg:grid place-items-center border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-all ${
              collapsed
                ? 'absolute -right-3 top-5 h-6 w-6 rounded-full shadow-md z-30 hover:scale-110'
                : 'h-7 w-7 rounded-lg'
            }`}
          >
            {collapsed ? <ChevronRight size={13} /> : <ChevronLeft size={15} />}
          </button>
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1 custom-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.exact}
                onClick={() => setIsMobileOpen(false)}
                title={collapsed ? item.label : undefined}
                className={({ isActive }) =>
                  `group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs sm:text-sm font-semibold transition-all duration-150 ${
                    isActive
                      ? 'bg-purple-600 text-white shadow-sm shadow-purple-500/25 dark:bg-purple-600 dark:text-white'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      size={18}
                      className={`shrink-0 transition-transform duration-150 group-hover:scale-110 ${
                        isActive
                          ? 'text-white'
                          : 'text-slate-400 group-hover:text-purple-500 dark:text-slate-400'
                      }`}
                    />

                    {!collapsed && (
                      <span className="truncate flex-1 font-medium">{item.label}</span>
                    )}

                    {!collapsed && item.badge && (
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : item.badge === '4'
                            ? 'bg-rose-500/10 text-rose-500 dark:bg-rose-500/20 dark:text-rose-400'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Bottom Admin Profile & Logout */}
        <div className="border-t border-slate-200/80 dark:border-slate-800/80 p-3 bg-slate-50/50 dark:bg-slate-950/30">
          <div className="flex items-center gap-3">
            <div className="relative shrink-0">
              <UserAvatar
                src={user?.avatar}
                name={user?.name}
                username={user?.username}
                className="h-9 w-9"
                textClassName="text-xs font-bold"
                rounded="rounded-xl"
                firstLetterOnly
              />
              <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
            </div>

            {!collapsed && (
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-bold text-slate-900 dark:text-white">
                  {user?.name || 'Aman Gupta'}
                </p>
                <div className="flex items-center gap-1 text-[10px] text-purple-600 dark:text-purple-400 font-semibold">
                  <Sparkles size={10} />
                  <span>Super Admin</span>
                </div>
              </div>
            )}

            {!collapsed && (
              <button
                type="button"
                onClick={handleLogout}
                aria-label="Logout"
                className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
                title="Logout"
              >
                <LogOut size={16} />
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
