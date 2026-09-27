import React, { useState } from 'react';
import { Settings, Save, AlertTriangle, ShieldCheck, Keyboard, Users, Bell, ToggleLeft, ToggleRight } from 'lucide-react';
import { initialPlatformSettings } from '../../data/adminMockData';

export const AdminSettings = () => {
  const [settings, setSettings] = useState(initialPlatformSettings);
  const [savedFeedback, setSavedFeedback] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 2500);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-display">
            Platform Configuration & Settings
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Control global test parameters, anti-cheat limits, and platform accessibility.
          </p>
        </div>

        {savedFeedback && (
          <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 animate-in fade-in">
            ✓ Settings saved successfully
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: General Settings */}
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
            <Settings size={18} className="text-purple-600 dark:text-purple-400" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white font-display">
              General Identity & Support
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Platform Name
              </label>
              <input
                type="text"
                value={settings.platformName}
                onChange={(e) => setSettings({ ...settings, platformName: e.target.value })}
                className="w-full h-9 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 px-3 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Primary Support Email
              </label>
              <input
                type="email"
                value={settings.supportEmail}
                onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                className="w-full h-9 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 px-3 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Typing Engine Parameters */}
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
            <Keyboard size={18} className="text-purple-600 dark:text-purple-400" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white font-display">
              Typing Test Engine Defaults
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Default Test Duration
              </label>
              <select
                value={settings.defaultTestDuration}
                onChange={(e) => setSettings({ ...settings, defaultTestDuration: e.target.value })}
                className="w-full h-9 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 px-2.5 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500"
              >
                <option value="15">15 Seconds</option>
                <option value="30">30 Seconds</option>
                <option value="60">60 Seconds (Recommended)</option>
                <option value="120">120 Seconds</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Min Passage Words
              </label>
              <input
                type="number"
                value={settings.minWordCount}
                onChange={(e) => setSettings({ ...settings, minWordCount: Number(e.target.value) })}
                className="w-full h-9 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 px-3 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Max Passage Words
              </label>
              <input
                type="number"
                value={settings.maxWordCount}
                onChange={(e) => setSettings({ ...settings, maxWordCount: Number(e.target.value) })}
                className="w-full h-9 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 px-3 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Anti-Cheat & Leaderboard Policies */}
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
            <ShieldCheck size={18} className="text-purple-600 dark:text-purple-400" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white font-display">
              Anti-Cheat & Leaderboard Policies
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Auto-Flag Speed Cutoff (WPM)
              </label>
              <input
                type="number"
                value={settings.autoFlagSpeedThreshold}
                onChange={(e) =>
                  setSettings({ ...settings, autoFlagSpeedThreshold: Number(e.target.value) })
                }
                className="w-full h-9 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 px-3 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Scores above this speed trigger moderation audit.
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Strict Keystroke Jitter Telemetry
              </label>
              <div className="flex items-center justify-between h-9 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60">
                <span className="text-xs text-slate-700 dark:text-slate-300">
                  {settings.strictAntiCheat ? 'Enabled (Active)' : 'Disabled'}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setSettings({ ...settings, strictAntiCheat: !settings.strictAntiCheat })
                  }
                  className="text-purple-600 dark:text-purple-400"
                >
                  {settings.strictAntiCheat ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: Maintenance Mode & Access */}
        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/[0.02] dark:bg-amber-950/[0.05] p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-amber-500/10">
            <AlertTriangle size={18} className="text-amber-500" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white font-display">
              Access Control & Emergency Maintenance
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">
                Platform Maintenance Mode
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                When active, non-admin visitors see a maintenance screen.
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                setSettings({ ...settings, maintenanceMode: !settings.maintenanceMode })
              }
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
                settings.maintenanceMode
                  ? 'bg-rose-600 text-white hover:bg-rose-700'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {settings.maintenanceMode ? 'Active (Site Offline)' : 'Standby (Site Live)'}
            </button>
          </div>
        </div>

        {/* Submit Bar */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-xl bg-purple-600 hover:bg-purple-700 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-sm shadow-purple-500/30 transition-colors"
          >
            <Save size={16} />
            <span>Save Platform Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminSettings;
