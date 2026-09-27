import React, { useState } from 'react';
import {
  ShieldCheck,
  KeyRound,
  Lock,
  UserCheck,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Globe,
  Monitor,
  RefreshCw,
  Clock,
  Eye,
} from 'lucide-react';
import { auditLogsAdminData } from '../../data/adminMockData';
import { StatusBadge } from '../../components/admin/StatusBadge';
import { AdminModal } from '../../components/admin/AdminModal';
import { Pagination } from '../../components/admin/Pagination';

const mockRolesPermissions = [
  {
    id: 'role-1',
    role: 'Super Admin',
    description: 'Full unconstrained platform control, audit logs, and settings governance.',
    members: 1,
    permissions: ['Full Access', 'User Bans', 'Anti-Cheat Bypass', 'Settings Edit', 'Audit Purge'],
    badgeColor: 'purple',
  },
  {
    id: 'role-2',
    role: 'Moderator',
    description: 'Handles user reports, leaderboard review, and flagged suspicious typing runs.',
    members: 3,
    permissions: ['Flag Tests', 'Leaderboard Disqualify', 'Inspect Telemetry', 'Resolve Reports'],
    badgeColor: 'blue',
  },
  {
    id: 'role-3',
    role: 'Content Curator',
    description: 'Manages daily challenges, passage library, and typing course curriculum.',
    members: 2,
    permissions: ['Create Challenges', 'Publish Lessons', 'Manage Announcements'],
    badgeColor: 'amber',
  },
];

const mockLoginHistory = [
  {
    id: 'lh-1',
    timestamp: 'Sep 25, 2026 12:30 PM',
    ip: '103.21.244.12',
    location: 'New Delhi, India',
    browser: 'Chrome 128 / Windows 11',
    status: 'Success',
    current: true,
  },
  {
    id: 'lh-2',
    timestamp: 'Sep 24, 2026 06:00 PM',
    ip: '103.21.244.12',
    location: 'New Delhi, India',
    browser: 'Chrome 128 / Windows 11',
    status: 'Success',
    current: false,
  },
  {
    id: 'lh-3',
    timestamp: 'Sep 23, 2026 10:15 AM',
    ip: '103.21.244.12',
    location: 'New Delhi, India',
    browser: 'Chrome 128 / Windows 11',
    status: 'Success',
    current: false,
  },
  {
    id: 'lh-4',
    timestamp: 'Sep 22, 2026 04:45 PM',
    ip: '45.112.54.21',
    location: 'Mumbai, India',
    browser: 'Firefox 129 / Linux',
    status: 'Failed (Invalid OTP)',
    current: false,
  },
];

export const AdminSecurity = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLog, setSelectedLog] = useState(null);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const itemsPerPage = 5;

  const filteredLogs = auditLogsAdminData.filter((log) => {
    const matchesSearch =
      log.admin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.target.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAction = actionFilter === 'All' || log.action.toLowerCase().includes(actionFilter.toLowerCase());
    return matchesSearch && matchesAction;
  });

  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage) || 1;
  const paginatedLogs = filteredLogs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-display">
            Security & Audit Governance
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Monitor administrative privileges, security posture, session history, and immutable platform logs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <ShieldCheck size={14} /> Shield Active
          </span>
        </div>
      </div>

      {/* Grid: Admin Profile & Security Posture */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white font-bold text-lg flex items-center justify-center shadow-md shadow-purple-500/25">
              AG
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white font-display">Aman Gupta</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">@aman_gupt1 • Root Super Admin</p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
              <span className="text-slate-500 dark:text-slate-400">Assigned Role</span>
              <span className="font-semibold px-2 py-0.5 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                Super Admin
              </span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
              <span className="text-slate-500 dark:text-slate-400">Session Status</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Active & Authenticated
              </span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
              <span className="text-slate-500 dark:text-slate-400">Current IP Address</span>
              <span className="font-mono text-slate-700 dark:text-slate-300 font-medium">103.21.244.12</span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="text-slate-500 dark:text-slate-400">Last Password Change</span>
              <span className="text-slate-700 dark:text-slate-300">14 days ago</span>
            </div>
          </div>
        </div>

        {/* Security Controls */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <KeyRound size={18} className="text-purple-600 dark:text-purple-400" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white font-display">
              Authentication & Security Hardening
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Lock size={16} className="text-purple-600 dark:text-purple-400" />
                  <span className="text-xs font-bold text-slate-900 dark:text-white">Two-Factor Authentication</span>
                </div>
                <button
                  type="button"
                  onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    twoFactorEnabled ? 'bg-purple-600' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      twoFactorEnabled ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                Requires hardware authenticator app (TOTP) verification on every administrative sign-in.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <UserCheck size={16} className="text-indigo-600 dark:text-indigo-400" />
                  <span className="text-xs font-bold text-slate-900 dark:text-white">Session Inactivity Timeout</span>
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-200/60 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  30 mins
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                Automatically invalidates authenticated browser tokens after 30 minutes of idle inactivity.
              </p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-purple-500/5 border border-purple-500/10 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-purple-700 dark:text-purple-300 font-medium">
              <CheckCircle2 size={15} /> All 5 super admin security checkpoints are currently compliant.
            </div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">Strict Anti-Cheat: ON</span>
          </div>
        </div>
      </div>

      {/* Roles & Permissions Table */}
      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white font-display">
              Administrative Roles & Scope
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Role-based access control matrix configured across the Tara Typing administration portal.
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            3 Active Roles
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 dark:bg-slate-950/50 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200/80 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Role Title</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4">Assigned Permissions</th>
                <th className="py-3 px-4 text-center">Active Admins</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {mockRolesPermissions.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-purple-500" />
                      {r.role}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-xs text-slate-600 dark:text-slate-300 max-w-xs">{r.description}</td>
                  <td className="py-3.5 px-4">
                    <div className="flex flex-wrap gap-1.5">
                      {r.permissions.map((p, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/50 dark:border-slate-700/50"
                        >
                          {p}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="font-bold text-slate-900 dark:text-white px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800">
                      {r.members}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Admin Login History */}
      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white font-display">Recent Admin Sessions</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Audit log of authentication attempts to the admin control panel.
            </p>
          </div>
          <span className="text-xs text-slate-400">Last updated: Just now</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 dark:bg-slate-950/50 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200/80 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">IP Address</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Device & Client</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {mockLoginHistory.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4 whitespace-nowrap text-slate-700 dark:text-slate-300 font-medium">
                    <span className="flex items-center gap-1.5">
                      <Clock size={13} className="text-slate-400" />
                      {item.timestamp}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-xs text-slate-700 dark:text-slate-300">{item.ip}</td>
                  <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <Globe size={13} className="text-slate-400" />
                      {item.location}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <Monitor size={13} className="text-slate-400" />
                      {item.browser}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    {item.current ? (
                      <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        Current Session
                      </span>
                    ) : item.status.includes('Failed') ? (
                      <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                        {item.status}
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-lg text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                        {item.status}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden space-y-4 p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white font-display">System Audit Trail</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Immutable trail of all administrative actions, bans, settings updates, and system operations.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
              {filteredLogs.length} Total Logs
            </span>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <div className="relative w-full sm:flex-1">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search audit trail by actor, action, target..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full h-9 pl-9 pr-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter size={15} className="text-slate-400 shrink-0" />
            <select
              value={actionFilter}
              onChange={(e) => {
                setActionFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="h-9 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500"
            >
              <option value="All">All Actions</option>
              <option value="Suspended">Suspension</option>
              <option value="Published">Publish</option>
              <option value="Updated">Settings Update</option>
              <option value="Rotated">System Rotation</option>
              <option value="Login">Login</option>
            </select>
          </div>
        </div>

        {/* Logs Table */}
        <div className="overflow-x-auto border border-slate-200/60 dark:border-slate-800 rounded-xl">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 dark:bg-slate-950/50 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200/80 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Log ID</th>
                <th className="py-3 px-4">Admin / Actor</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Target Entity</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">IP Address</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {paginatedLogs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-xs text-slate-400">
                    No audit log records match your filter criteria.
                  </td>
                </tr>
              ) : (
                paginatedLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-mono font-semibold text-xs text-slate-500 dark:text-slate-400">
                      {log.id}
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-900 dark:text-white whitespace-nowrap">
                      {log.admin}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap font-semibold text-purple-600 dark:text-purple-400">
                      {log.action}
                    </td>
                    <td className="py-3 px-4 text-slate-700 dark:text-slate-300 font-mono text-xs">{log.target}</td>
                    <td className="py-3 px-4 text-slate-500 dark:text-slate-400 whitespace-nowrap">{log.date}</td>
                    <td className="py-3 px-4 font-mono text-xs text-slate-500 dark:text-slate-400">{log.ip}</td>
                    <td className="py-3 px-4 text-center">
                      <StatusBadge status={log.status} />
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedLog(log)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title="View Full Audit Record"
                      >
                        <Eye size={15} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          itemsPerPage={itemsPerPage}
          totalItems={filteredLogs.length}
        />
      </div>

      {/* Audit Log Detail Modal */}
      {selectedLog && (
        <AdminModal
          isOpen={true}
          onClose={() => setSelectedLog(null)}
          title={`Audit Record: ${selectedLog.id}`}
        >
          <div className="space-y-4 text-xs sm:text-sm">
            <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/70 dark:border-slate-800">
              <div>
                <span className="text-[11px] text-slate-400 block mb-0.5">Admin Actor</span>
                <span className="font-bold text-slate-900 dark:text-white">{selectedLog.admin}</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block mb-0.5">Action Executed</span>
                <span className="font-bold text-purple-600 dark:text-purple-400">{selectedLog.action}</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block mb-0.5">Target Entity</span>
                <span className="font-mono text-slate-700 dark:text-slate-300">{selectedLog.target}</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block mb-0.5">Outcome Status</span>
                <StatusBadge status={selectedLog.status} />
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block mb-0.5">Timestamp (IST)</span>
                <span className="text-slate-700 dark:text-slate-300">{selectedLog.date}</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block mb-0.5">Origin IP</span>
                <span className="font-mono text-slate-700 dark:text-slate-300">{selectedLog.ip}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-purple-500/5 border border-purple-500/10 text-xs text-purple-700 dark:text-purple-300">
              🔒 This entry is digitally sealed on the platform audit ledger. It cannot be edited or erased by standard administrative workflows.
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setSelectedLog(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                Close Audit Record
              </button>
            </div>
          </div>
        </AdminModal>
      )}
    </div>
  );
};

export default AdminSecurity;
