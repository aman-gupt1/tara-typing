import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Settings as SettingsIcon,
  Palette,
  Keyboard,
  Volume2,
  Volume1,
  User,
  Clock,
  FileText,
  TrendingUp,
  Target,
  Mail,
  Lock,
  X,
  Sliders,
  Type,
  AlertCircle,
  Eye,
  EyeOff,
  RotateCcw,
  Loader2
} from 'lucide-react';
import { toast } from 'react-toastify';
import SEO from '../components/common/SEO';
import { useSettings } from '../context/SettingsContext';
import { useAuth } from '../context/AuthContext';
import { profileService } from '../services/profileService';
import { soundEngine } from '../utils/soundEngine';

const ACCENT_COLORS = [
  { name: 'Blue', hex: '#3B82F6' },
  { name: 'Cobalt', hex: '#0066FF' },
  { name: 'Purple', hex: '#8B5CF6' },
  { name: 'Green', hex: '#10B981' },
  { name: 'Orange', hex: '#F59E0B' },
  { name: 'Red', hex: '#EF4444' },
  { name: 'Pink', hex: '#EC4899' },
];

/**
 * Robust, fully accessible iOS-style toggle switch.
 * Uses standard Tailwind classes with smooth translate transition.
 */
function ToggleSwitch({ checked, onChange, ariaLabel }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel || 'Toggle setting'}
      onClick={(e) => {
        e.stopPropagation();
        onChange(!checked);
      }}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-[#0B1220] ${
        checked ? 'bg-[#0066FF]' : 'bg-slate-700'
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  );
}

export const Settings = () => {
  const { user, updateUser, changePassword } = useAuth();
  const { settings, loading, isSyncing, updateSetting, resetSettings } = useSettings();

  // Accent Color derived directly from synchronized settings
  const accentColor = settings?.accentColor || '#3B82F6';

  const handleSetAccentColor = (hex) => {
    updateSetting('accentColor', hex);
    toast.info('Accent color updated!', { autoClose: 1200 });
  };

  // Account editing states
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
  const [editUserName, setEditUserName] = useState(user?.name || '');
  const [editUserUsername, setEditUserUsername] = useState(user?.username || '');

  useEffect(() => {
    if (user) {
      setEditUserName(user.name || '');
      setEditUserUsername(user.username || '');
    }
  }, [user]);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [changingPassword, setChangingPassword] = useState(false);
  const [updatingProfile, setUpdatingProfile] = useState(false);

  // Reset Settings state
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  // Sound settings
  const isKeypressSoundOn = settings?.keypressSound ?? (settings?.soundType !== 'off');
  const isErrorSoundOn = settings?.errorSound !== false;
  const currentVolume = settings?.soundVolume !== undefined ? Math.round(settings.soundVolume * 100) : 72;

  const handleToggleKeypressSound = (enabled) => {
    updateSetting('keypressSound', enabled);
    if (enabled) {
      soundEngine.playKeypress();
    }
  };

  const handleToggleErrorSound = (enabled) => {
    updateSetting('errorSound', enabled);
    if (enabled) {
      soundEngine.playError();
    }
  };

  const handleVolumeChange = (e) => {
    const val = Number(e.target.value);
    const floatVal = val / 100;
    updateSetting('soundVolume', floatVal);
    soundEngine.volume = floatVal;
  };

  const handleVolumeMouseUp = () => {
    if (isKeypressSoundOn) {
      soundEngine.playKeypress();
    }
  };

  const handleConfirmReset = async () => {
    if (isResetting) return;
    setIsResetting(true);
    try {
      await resetSettings();
      setIsResetModalOpen(false);
    } catch {
      // toast error handled in resetSettings
    } finally {
      setIsResetting(false);
    }
  };



  // Save Account Profile
  const handleSaveAccountModal = async (e) => {
    e.preventDefault();
    setUpdatingProfile(true);
    try {
      const updated = await profileService.updateProfile({
        name: editUserName,
        username: editUserUsername,
      });
      if (updateUser) {
        updateUser(updated);
      }
      toast.success('Profile updated successfully!');
      setIsEditUserModalOpen(false);
    } catch (err) {
      toast.error(err.message || 'Failed to update profile');
    } finally {
      setUpdatingProfile(false);
    }
  };

  // Change Password
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setChangingPassword(true);
    try {
      await changePassword(passwordForm.currentPassword, passwordForm.newPassword);
      toast.success('Password updated successfully!');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setShowCurrentPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);
      setIsPasswordModalOpen(false);
    } catch (err) {
      // Toast displayed by AuthContext or error
    } finally {
      setChangingPassword(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#06090F] text-slate-100 selection:bg-blue-600 selection:text-white">
      <SEO
        title="Settings — Tara Typing"
        description="Customize your Tara Typing appearance, sound, typing preferences, and account settings."
      />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
            
            {/* Top Header Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
              <div className="flex items-center gap-3.5">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600/20 text-[#0066FF]">
                  <SettingsIcon size={24} className="text-[#0066FF]" />
                </div>
                <div>
                  <div className="flex items-center gap-2.5">
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                      Settings
                    </h1>
                    {(loading || isSyncing) && (
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20 animate-pulse">
                        <Loader2 size={11} className="animate-spin" />
                        {loading ? 'Syncing...' : 'Saving...'}
                      </span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-400">
                    Customize your Tara Typing experience
                  </p>
                </div>
              </div>

              {/* Quote Card with Continuous Nonstop Rotating Border Lighting */}
              <div className="relative overflow-hidden rounded-2xl p-[1.5px] max-w-sm shadow-[0_0_25px_-5px_rgba(0,102,255,0.35)]">
                {/* Continuous Nonstop Rotating Light Beam */}
                <div
                  className="absolute inset-[-200%] animate-[spin_3s_linear_infinite] pointer-events-none"
                  style={{
                    background: 'conic-gradient(from 0deg, transparent 0 65%, #0066FF 82%, #38BDF8 95%, transparent 100%)',
                  }}
                />
                
                {/* Inner Content Card */}
                <div className="relative flex items-start gap-2.5 rounded-[15px] bg-[#0A101D] px-4 py-2.5 backdrop-blur-md">
                  <span className="text-xl font-serif text-[#0066FF] leading-none select-none">“</span>
                  <div>
                    <p className="text-xs text-slate-200 italic font-medium">
                      "Better settings, better practice, better you."
                    </p>
                    <p className="text-[11px] font-semibold text-[#0066FF] mt-0.5">
                      — Tara Typing
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* ======================================================== */}
            {/* ROW 1: Appearance, Sound Effects, Account Details (3 Cols) */}
            {/* ======================================================== */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">

                {/* 1. APPEARANCE CARD (Purple Glow Hover) */}
                <section
                  id="appearance"
                  className="group relative rounded-2xl border border-slate-800/80 bg-[#0B1220]/90 p-5 sm:p-6 shadow-xl backdrop-blur-sm space-y-5 transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-purple-500/50 hover:shadow-[0_12px_30px_-6px_rgba(168,85,247,0.25)] hover:bg-gradient-to-b hover:from-[#13112E] hover:to-[#0B1220]"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400 group-hover:scale-110 group-hover:bg-purple-500/20 group-hover:text-purple-300 transition-all duration-300">
                      <Palette size={20} />
                    </div>
                    <div>
                      <h2 className="text-base font-semibold text-white group-hover:text-purple-200 transition-colors">Appearance</h2>
                      <p className="text-xs text-slate-400">Personalize your accent color and dashboard theme</p>
                    </div>
                  </div>

                  <div className="pt-1">
                    {/* Accent Color picker */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3">
                      <div className="flex items-center gap-3">
                        <Target size={17} className="text-slate-400 shrink-0 group-hover:text-purple-400 transition-colors" />
                        <div>
                          <div className="text-sm font-medium text-slate-200">Accent Color</div>
                          <div className="text-xs text-slate-400">Choose your preferred accent color</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2.5">
                        {ACCENT_COLORS.map((col) => {
                          const isSelected = accentColor.toLowerCase() === col.hex.toLowerCase();
                          return (
                            <button
                              key={col.hex}
                              type="button"
                              onClick={() => handleSetAccentColor(col.hex)}
                              title={col.name}
                              className={`h-7 w-7 rounded-full transition-transform hover:scale-125 focus:outline-none ${
                                isSelected
                                  ? 'ring-2 ring-offset-2 ring-white ring-offset-[#0B1220] scale-110 shadow-lg'
                                  : 'opacity-80 hover:opacity-100'
                              }`}
                              style={{ backgroundColor: col.hex }}
                            />
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </section>

                {/* 2. SOUND CARD (Cyan Glow Hover) */}
                <section
                  id="sound"
                  className="group relative rounded-2xl border border-slate-800/80 bg-[#0B1220]/90 p-5 sm:p-6 shadow-xl backdrop-blur-sm space-y-5 transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-cyan-500/50 hover:shadow-[0_12px_30px_-6px_rgba(6,182,212,0.25)] hover:bg-gradient-to-b hover:from-[#091D2C] hover:to-[#0B1220]"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400 group-hover:scale-110 group-hover:bg-cyan-500/20 group-hover:text-cyan-300 transition-all duration-300">
                      <Volume2 size={20} />
                    </div>
                    <div>
                      <h2 className="text-base font-semibold text-white group-hover:text-cyan-200 transition-colors">Sound Effects</h2>
                      <p className="text-xs text-slate-400">Control audio feedback during typing tests</p>
                    </div>
                  </div>

                  <div className="divide-y divide-slate-800/60 pt-1">
                    
                    {/* Keypress Sound */}
                    <div
                      onClick={() => handleToggleKeypressSound(!isKeypressSoundOn)}
                      className="flex items-center justify-between gap-3 py-3.5 first:pt-2 cursor-pointer select-none hover:bg-white/[0.04] px-2 -mx-2 rounded-xl transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Volume1 size={17} className="text-slate-400 shrink-0 group-hover:text-cyan-400 transition-colors" />
                        <div>
                          <div className="text-sm font-medium text-slate-200">Keypress Sound</div>
                          <div className="text-xs text-slate-400">Tactile mechanical sound on each keystroke</div>
                        </div>
                      </div>
                      <ToggleSwitch
                        checked={isKeypressSoundOn}
                        onChange={handleToggleKeypressSound}
                        ariaLabel="Keypress sound"
                      />
                    </div>

                    {/* Error Sound */}
                    <div
                      onClick={() => handleToggleErrorSound(!isErrorSoundOn)}
                      className="flex items-center justify-between gap-3 py-3.5 cursor-pointer select-none hover:bg-white/[0.04] px-2 -mx-2 rounded-xl transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <AlertCircle size={17} className="text-red-400 shrink-0" />
                        <div>
                          <div className="text-sm font-medium text-slate-200">Error Sound</div>
                          <div className="text-xs text-slate-400">Audio alert when typing an incorrect character</div>
                        </div>
                      </div>
                      <ToggleSwitch
                        checked={isErrorSoundOn}
                        onChange={handleToggleErrorSound}
                        ariaLabel="Error sound"
                      />
                    </div>

                    {/* Volume Slider */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-4">
                      <div className="flex items-center gap-3">
                        <Volume2 size={17} className="text-slate-400 shrink-0 group-hover:text-cyan-400 transition-colors" />
                        <div>
                          <div className="text-sm font-medium text-slate-200">Volume</div>
                          <div className="text-xs text-slate-400">Adjust sound effects volume</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 min-w-[200px]">
                        <Volume2 size={16} className="text-slate-400 shrink-0" />
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={currentVolume}
                          onChange={handleVolumeChange}
                          onMouseUp={handleVolumeMouseUp}
                          onTouchEnd={handleVolumeMouseUp}
                          className="w-full accent-cyan-500 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
                        />
                        <span className="text-xs font-medium text-slate-300 w-9 text-right tabular-nums">
                          {currentVolume}%
                        </span>
                      </div>
                    </div>

                  </div>
                </section>

                {/* 3. ACCOUNT CARD (Emerald Glow Hover) */}
                <section
                  id="account"
                  className="group relative rounded-2xl border border-slate-800/80 bg-[#0B1220]/90 p-5 sm:p-6 shadow-xl backdrop-blur-sm space-y-5 transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-emerald-500/50 hover:shadow-[0_12px_30px_-6px_rgba(16,185,129,0.25)] hover:bg-gradient-to-b hover:from-[#09221C] hover:to-[#0B1220]"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 group-hover:scale-110 group-hover:bg-emerald-500/20 group-hover:text-emerald-300 transition-all duration-300">
                      <User size={20} />
                    </div>
                    <div>
                      <h2 className="text-base font-semibold text-white group-hover:text-emerald-200 transition-colors">Account Details</h2>
                      <p className="text-xs text-slate-400">Manage profile and credentials</p>
                    </div>
                  </div>

                  <div className="pt-1">
                    {user ? (
                      <div className="divide-y divide-slate-800/60">
                        {/* Full Name & Username */}
                        <div className="flex items-center justify-between gap-3 py-3.5 first:pt-2">
                          <div className="flex items-center gap-3">
                            <User size={17} className="text-slate-400 shrink-0 group-hover:text-emerald-400 transition-colors" />
                            <div>
                              <span className="text-sm font-medium text-slate-200 block">Name</span>
                              <span className="text-xs text-slate-400 block">
                                @{user.username}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-xs sm:text-sm text-slate-300 font-medium">
                              {user.name}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                setEditUserName(user.name || '');
                                setEditUserUsername(user.username || '');
                                setIsEditUserModalOpen(true);
                              }}
                              className="rounded-lg border border-slate-700/80 bg-slate-800/40 px-3 py-1 text-xs font-medium text-slate-200 hover:border-emerald-500/60 hover:bg-emerald-500/15 hover:text-emerald-300 transition-colors"
                            >
                              Edit
                            </button>
                          </div>
                        </div>

                        {/* Email */}
                        <div className="flex items-center justify-between gap-3 py-3.5">
                          <div className="flex items-center gap-3">
                            <Mail size={17} className="text-slate-400 shrink-0 group-hover:text-emerald-400 transition-colors" />
                            <span className="text-sm font-medium text-slate-200">Email</span>
                          </div>
                          <span className="text-xs sm:text-sm text-slate-400 font-mono">
                            {user.email}
                          </span>
                        </div>

                        {/* Password */}
                        <div className="flex items-center justify-between gap-3 py-3.5">
                          <div className="flex items-center gap-3">
                            <Lock size={17} className="text-slate-400 shrink-0 group-hover:text-emerald-400 transition-colors" />
                            <span className="text-sm font-medium text-slate-200">Password</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-xs sm:text-sm text-slate-400 tracking-widest font-mono">
                              ••••••••
                            </span>
                            <button
                              type="button"
                              onClick={() => setIsPasswordModalOpen(true)}
                              className="rounded-lg border border-slate-700/80 bg-slate-800/40 px-3 py-1 text-xs font-medium text-slate-200 hover:border-emerald-500/60 hover:bg-emerald-500/15 hover:text-emerald-300 transition-colors"
                            >
                              Change
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="py-6 text-center space-y-3">
                        <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto">
                          Sign in to link and automatically sync your typing settings across all devices.
                        </p>
                        <Link
                          to="/login"
                          className="inline-flex items-center gap-2 rounded-xl bg-[#0066FF] px-4 py-2 text-xs font-semibold text-white shadow-md hover:bg-blue-600 transition-colors"
                        >
                          Sign In
                        </Link>
                      </div>
                    )}
                  </div>
                </section>
            </div>

            {/* ======================================================== */}
            {/* ROW 2: Typing Preferences (Full Width)                   */}
            {/* ======================================================== */}
            <div className="w-full">
                {/* 4. TYPING PREFERENCES CARD (Cobalt Performance Glow) */}
                <section
                  id="typing"
                  className="group relative rounded-2xl border border-slate-800/80 bg-[#0B1220]/90 p-5 sm:p-6 shadow-xl backdrop-blur-sm space-y-5 transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-blue-500/50 hover:shadow-[0_16px_36px_-6px_rgba(0,102,255,0.25)] hover:bg-gradient-to-b hover:from-[#081530] hover:to-[#0B1220]"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10 text-[#0066FF] group-hover:scale-110 group-hover:bg-blue-500/20 group-hover:text-blue-300 transition-all duration-300">
                      <Keyboard size={20} />
                    </div>
                    <div>
                      <h2 className="text-base font-semibold text-white group-hover:text-blue-200 transition-colors">Typing Preferences</h2>
                      <p className="text-xs text-slate-400">Configure your typing speed test parameters</p>
                    </div>
                  </div>

                  <div className="pt-2">
                    {/* Top sub-grid: Duration, Mode, Caret Style, Font Size */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pb-5 border-b border-slate-800/60">
                      
                      {/* Default Duration */}
                      <div className="flex flex-col gap-2 p-3 rounded-xl bg-slate-900/40 border border-slate-800/50 hover:border-blue-500/40 hover:bg-slate-800/50 transition-all duration-200 hover:-translate-y-0.5">
                        <div className="flex items-center gap-2">
                          <Clock size={16} className="text-slate-400" />
                          <span className="text-xs font-medium text-slate-300">Default Duration</span>
                        </div>
                        <div className="inline-flex rounded-xl border border-slate-800 bg-[#070B14] p-1 w-full justify-between">
                          {[15, 30, 60, 120].map((d) => {
                            const isSelected = (settings?.defaultDuration ?? 30) === d;
                            return (
                              <button
                                key={d}
                                type="button"
                                onClick={() => updateSetting('defaultDuration', d)}
                                className={`flex-1 rounded-lg py-1.5 text-xs font-medium transition-all select-none text-center ${
                                  isSelected
                                    ? 'bg-[#0066FF] text-white shadow-sm'
                                    : 'text-slate-400 hover:text-slate-200'
                                }`}
                              >
                                {d}s
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Default Mode */}
                      <div className="flex flex-col gap-2 p-3 rounded-xl bg-slate-900/40 border border-slate-800/50 hover:border-blue-500/40 hover:bg-slate-800/50 transition-all duration-200 hover:-translate-y-0.5">
                        <div className="flex items-center gap-2">
                          <FileText size={16} className="text-slate-400" />
                          <span className="text-xs font-medium text-slate-300">Default Mode</span>
                        </div>
                        <div className="inline-flex rounded-xl border border-slate-800 bg-[#070B14] p-1 w-full justify-between">
                          {['words', 'quote', 'custom'].map((mode) => {
                            const isSelected = (settings?.defaultMode ?? 'words') === mode;
                            return (
                              <button
                                key={mode}
                                type="button"
                                onClick={() => updateSetting('defaultMode', mode)}
                                className={`flex-1 capitalize rounded-lg py-1.5 text-xs font-medium transition-all select-none text-center ${
                                  isSelected
                                    ? 'bg-[#0066FF] text-white shadow-sm'
                                    : 'text-slate-400 hover:text-slate-200'
                                }`}
                              >
                                {mode}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Caret Style */}
                      <div className="flex flex-col gap-2 p-3 rounded-xl bg-slate-900/40 border border-slate-800/50 hover:border-blue-500/40 hover:bg-slate-800/50 transition-all duration-200 hover:-translate-y-0.5">
                        <div className="flex items-center gap-2">
                          <Sliders size={16} className="text-slate-400" />
                          <span className="text-xs font-medium text-slate-300">Caret Style</span>
                        </div>
                        <div className="inline-flex rounded-xl border border-slate-800 bg-[#070B14] p-1 w-full justify-between">
                          {['line', 'block', 'underline'].map((c) => {
                            const isSelected = (settings?.caretStyle ?? 'line') === c;
                            return (
                              <button
                                key={c}
                                type="button"
                                onClick={() => updateSetting('caretStyle', c)}
                                className={`flex-1 capitalize rounded-lg py-1.5 text-xs font-medium transition-all select-none text-center ${
                                  isSelected
                                    ? 'bg-[#0066FF] text-white shadow-sm'
                                    : 'text-slate-400 hover:text-slate-200'
                                }`}
                              >
                                {c}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Font Size */}
                      <div className="flex flex-col gap-2 p-3 rounded-xl bg-slate-900/40 border border-slate-800/50 hover:border-blue-500/40 hover:bg-slate-800/50 transition-all duration-200 hover:-translate-y-0.5">
                        <div className="flex items-center gap-2">
                          <Type size={16} className="text-slate-400" />
                          <span className="text-xs font-medium text-slate-300">Font Size</span>
                        </div>
                        <div className="inline-flex rounded-xl border border-slate-800 bg-[#070B14] p-1 w-full justify-between">
                          {['small', 'medium', 'large'].map((fs) => {
                            const isSelected = (settings?.fontSize ?? 'medium') === fs;
                            return (
                              <button
                                key={fs}
                                type="button"
                                onClick={() => updateSetting('fontSize', fs)}
                                className={`flex-1 capitalize rounded-lg py-1.5 text-xs font-medium transition-all select-none text-center ${
                                  isSelected
                                    ? 'bg-[#0066FF] text-white shadow-sm'
                                    : 'text-slate-400 hover:text-slate-200'
                                }`}
                              >
                                {fs}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                    </div>

                    {/* Bottom sub-grid: Live WPM, Live Accuracy, Highlight Mistakes */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                      
                      {/* Show Live WPM */}
                      <div
                        onClick={() => updateSetting('showLiveWpm', !(settings?.showLiveWpm ?? settings?.liveWpm ?? true))}
                        className="flex items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-900/30 border border-slate-800/50 cursor-pointer select-none hover:border-blue-500/40 hover:bg-blue-950/20 hover:scale-[1.01] transition-all duration-200"
                      >
                        <div className="flex items-center gap-3">
                          <TrendingUp size={17} className="text-slate-400 shrink-0 group-hover:text-blue-400 transition-colors" />
                          <div>
                            <div className="text-sm font-medium text-slate-200">Show Live WPM</div>
                            <div className="text-xs text-slate-400">Display words-per-minute in real-time</div>
                          </div>
                        </div>
                        <ToggleSwitch
                          checked={settings?.showLiveWpm ?? settings?.liveWpm ?? true}
                          onChange={(val) => updateSetting('showLiveWpm', val)}
                          ariaLabel="Show live WPM"
                        />
                      </div>

                      {/* Show Live Accuracy */}
                      <div
                        onClick={() => updateSetting('showLiveAccuracy', !(settings?.showLiveAccuracy ?? settings?.showAccuracy ?? true))}
                        className="flex items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-900/30 border border-slate-800/50 cursor-pointer select-none hover:border-cyan-500/40 hover:bg-cyan-950/20 hover:scale-[1.01] transition-all duration-200"
                      >
                        <div className="flex items-center gap-3">
                          <Target size={17} className="text-slate-400 shrink-0 group-hover:text-cyan-400 transition-colors" />
                          <div>
                            <div className="text-sm font-medium text-slate-200">Show Live Accuracy</div>
                            <div className="text-xs text-slate-400">Display accuracy % counter while typing</div>
                          </div>
                        </div>
                        <ToggleSwitch
                          checked={settings?.showLiveAccuracy ?? settings?.showAccuracy ?? true}
                          onChange={(val) => updateSetting('showLiveAccuracy', val)}
                          ariaLabel="Show live accuracy"
                        />
                      </div>

                      {/* Highlight Mistakes */}
                      <div
                        onClick={() => updateSetting('highlightMistakes', !(settings?.highlightMistakes ?? true))}
                        className="flex items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-900/30 border border-slate-800/50 cursor-pointer select-none hover:border-red-500/40 hover:bg-red-950/20 hover:scale-[1.01] transition-all duration-200"
                      >
                        <div className="flex items-center gap-3">
                          <span className="flex h-4 w-4 items-center justify-center font-bold text-xs text-red-400">!</span>
                          <div>
                            <div className="text-sm font-medium text-slate-200">Highlight Mistakes</div>
                            <div className="text-xs text-slate-400">Red highlight on mistyped characters</div>
                          </div>
                        </div>
                        <ToggleSwitch
                          checked={settings?.highlightMistakes ?? true}
                          onChange={(val) => updateSetting('highlightMistakes', val)}
                          ariaLabel="Highlight mistakes"
                        />
                      </div>

                    </div>

                  </div>
                </section>
            </div>

            {/* ======================================================== */}
            {/* ROW 3: Reset Settings (Subtle & Professional)            */}
            {/* ======================================================== */}
            <div className="w-full">
              <section
                id="reset-settings"
                className="group relative rounded-2xl border border-slate-800/80 bg-[#0B1220]/90 p-5 sm:p-6 shadow-xl backdrop-blur-sm transition-all duration-300 ease-out hover:border-slate-700/80"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800 text-slate-400 group-hover:text-slate-200 transition-colors">
                      <RotateCcw size={18} />
                    </div>
                    <div>
                      <h2 className="text-base font-semibold text-white">Reset Settings</h2>
                      <p className="text-xs text-slate-400">
                        Restore all typing, sound and appearance settings to their default values.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsResetModalOpen(true)}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700/80 bg-slate-800/60 px-4 py-2.5 text-xs font-semibold text-slate-200 hover:border-blue-500/40 hover:bg-blue-500/10 hover:text-blue-300 transition-all duration-200 focus:outline-none shrink-0"
                  >
                    <RotateCcw size={14} />
                    <span>Reset to Default</span>
                  </button>
                </div>
              </section>
            </div>

      </main>

      {/* ============================================================ */}
      {/* EDIT PROFILE MODAL                                           */}
      {/* ============================================================ */}
      {isEditUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-[#0B1220] p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white">Edit Profile Details</h3>
              <button
                type="button"
                onClick={() => setIsEditUserModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSaveAccountModal} className="mt-4 space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-300">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={editUserName}
                  onChange={(e) => setEditUserName(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-[#070B14] px-4 py-2.5 text-sm text-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-300">
                  Username
                </label>
                <input
                  type="text"
                  required
                  value={editUserUsername}
                  onChange={(e) => setEditUserUsername(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-[#070B14] px-4 py-2.5 text-sm text-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditUserModalOpen(false)}
                  className="rounded-xl px-4 py-2 text-xs font-medium text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updatingProfile}
                  className="rounded-xl bg-[#0066FF] px-5 py-2 text-xs font-semibold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-600 transition-colors disabled:opacity-50"
                >
                  {updatingProfile ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* CHANGE PASSWORD MODAL                                         */}
      {/* ============================================================ */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-[#0B1220] p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white">Change Password</h3>
              <button
                type="button"
                onClick={() => {
                  setIsPasswordModalOpen(false);
                  setShowCurrentPassword(false);
                  setShowNewPassword(false);
                  setShowConfirmPassword(false);
                }}
                className="rounded-lg p-1 text-slate-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleChangePassword} className="mt-4 space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-300">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={passwordForm.currentPassword}
                    onChange={(e) =>
                      setPasswordForm((p) => ({ ...p, currentPassword: e.target.value }))
                    }
                    className="w-full rounded-xl border border-slate-700 bg-[#070B14] pl-4 pr-10 py-2.5 text-sm text-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors focus:outline-none p-1"
                    aria-label={showCurrentPassword ? 'Hide password' : 'Show password'}
                  >
                    {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-300">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    required
                    placeholder="At least 6 characters"
                    value={passwordForm.newPassword}
                    onChange={(e) =>
                      setPasswordForm((p) => ({ ...p, newPassword: e.target.value }))
                    }
                    className="w-full rounded-xl border border-slate-700 bg-[#070B14] pl-4 pr-10 py-2.5 text-sm text-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors focus:outline-none p-1"
                    aria-label={showNewPassword ? 'Hide password' : 'Show password'}
                  >
                    {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-300">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    placeholder="Repeat new password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) =>
                      setPasswordForm((p) => ({ ...p, confirmPassword: e.target.value }))
                    }
                    className="w-full rounded-xl border border-slate-700 bg-[#070B14] pl-4 pr-10 py-2.5 text-sm text-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors focus:outline-none p-1"
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsPasswordModalOpen(false);
                    setShowCurrentPassword(false);
                    setShowNewPassword(false);
                    setShowConfirmPassword(false);
                  }}
                  className="rounded-xl px-4 py-2 text-xs font-medium text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={changingPassword}
                  className="rounded-xl bg-[#0066FF] px-5 py-2 text-xs font-semibold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-600 transition-colors disabled:opacity-50"
                >
                  {changingPassword ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* RESET SETTINGS CONFIRMATION MODAL                            */}
      {/* ============================================================ */}
      {isResetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-[#0B1220] p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
                  <RotateCcw size={16} />
                </div>
                <h3 className="text-base font-bold text-white">Reset settings?</h3>
              </div>
              <button
                type="button"
                disabled={isResetting}
                onClick={() => setIsResetModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:text-white transition-colors disabled:opacity-50"
              >
                <X size={18} />
              </button>
            </div>

            <div className="py-4 text-sm text-slate-300 leading-relaxed">
              This will restore all your Tara Typing settings to their default values.
            </div>

            <div className="flex justify-end gap-2.5 pt-2 border-t border-slate-800/80">
              <button
                type="button"
                disabled={isResetting}
                onClick={() => setIsResetModalOpen(false)}
                className="rounded-xl px-4 py-2 text-xs font-medium text-slate-400 hover:text-white transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isResetting}
                onClick={handleConfirmReset}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-500 transition-colors disabled:opacity-50"
              >
                {isResetting ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    <span>Resetting...</span>
                  </>
                ) : (
                  <span>Reset to Default</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Settings;
