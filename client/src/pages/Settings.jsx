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
import { soundEngine, SOUNDPACKS } from '../utils/soundEngine';

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
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background ${
        checked ? 'bg-primary' : 'bg-muted-foreground/30'
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
    <div className="min-h-screen w-full bg-background text-foreground transition-colors duration-200 selection:bg-primary selection:text-primary-foreground">
      <SEO
        title="Settings — Tara Typing"
        description="Customize your Tara Typing appearance, sound, typing preferences, and account settings."
      />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
            
            {/* Top Header Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
              <div className="flex items-center gap-3.5">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <SettingsIcon size={24} className="text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-2.5">
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                      Settings
                    </h1>
                    {(loading || isSyncing) && (
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20 animate-pulse">
                        <Loader2 size={11} className="animate-spin" />
                        {loading ? 'Syncing...' : 'Saving...'}
                      </span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Customize your Tara Typing experience
                  </p>
                </div>
              </div>

              {/* Quote Card with Continuous Nonstop Rotating Border Lighting */}
              <div className="relative overflow-hidden rounded-2xl p-[1.5px] max-w-sm shadow-sm">
                {/* Continuous Nonstop Rotating Light Beam */}
                <div
                  className="absolute inset-[-200%] animate-[spin_3s_linear_infinite] pointer-events-none"
                  style={{
                    background: 'conic-gradient(from 0deg, transparent 0 65%, #0066FF 82%, #38BDF8 95%, transparent 100%)',
                  }}
                />
                
                {/* Inner Content Card */}
                <div className="relative flex items-start gap-2.5 rounded-[15px] bg-card px-4 py-2.5 backdrop-blur-md">
                  <span className="text-xl font-serif text-primary leading-none select-none">“</span>
                  <div>
                    <p className="text-xs text-foreground/90 italic font-medium">
                      "Better settings, better practice, better you."
                    </p>
                    <p className="text-[11px] font-semibold text-primary mt-0.5">
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
                  className="group relative rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm backdrop-blur-sm space-y-5 transition-all duration-300 ease-out hover:-translate-y-1 hover:border-purple-500/50 hover:shadow-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-500/10 text-purple-500 dark:text-purple-400 group-hover:scale-110 transition-all duration-300">
                      <Palette size={20} />
                    </div>
                    <div>
                      <h2 className="text-base font-semibold text-foreground group-hover:text-purple-500 dark:group-hover:text-purple-200 transition-colors">Appearance</h2>
                      <p className="text-xs text-muted-foreground">Personalize your accent color and dashboard theme</p>
                    </div>
                  </div>

                  <div className="pt-1">
                    {/* Accent Color picker */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3">
                      <div className="flex items-center gap-3">
                        <Target size={17} className="text-muted-foreground shrink-0 group-hover:text-purple-500 transition-colors" />
                        <div>
                          <div className="text-sm font-medium text-foreground">Accent Color</div>
                          <div className="text-xs text-muted-foreground">Choose your preferred accent color</div>
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
                              className={`h-7 w-7 rounded-full transition-transform hover:scale-125 focus:outline-none cursor-pointer ${
                                isSelected
                                  ? 'ring-2 ring-offset-2 ring-primary ring-offset-card scale-110 shadow-lg'
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
                  className="group relative rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm backdrop-blur-sm space-y-5 transition-all duration-300 ease-out hover:-translate-y-1 hover:border-cyan-500/50 hover:shadow-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-500 dark:text-cyan-400 group-hover:scale-110 transition-all duration-300">
                      <Volume2 size={20} />
                    </div>
                    <div>
                      <h2 className="text-base font-semibold text-foreground group-hover:text-cyan-500 dark:group-hover:text-cyan-200 transition-colors">Sound Effects</h2>
                      <p className="text-xs text-muted-foreground">Control audio feedback during typing tests</p>
                    </div>
                  </div>

                  <div className="divide-y divide-border pt-1">
                    
                    {/* Keypress Sound */}
                    <div
                      onClick={() => handleToggleKeypressSound(!isKeypressSoundOn)}
                      className="flex items-center justify-between gap-3 py-3.5 first:pt-2 cursor-pointer select-none hover:bg-muted/40 px-2 -mx-2 rounded-xl transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Volume1 size={17} className="text-muted-foreground shrink-0 group-hover:text-cyan-500 transition-colors" />
                        <div>
                          <div className="text-sm font-medium text-foreground">Keypress Sound</div>
                          <div className="text-xs text-muted-foreground">Tactile mechanical sound on each keystroke</div>
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
                      className="flex items-center justify-between gap-3 py-3.5 cursor-pointer select-none hover:bg-muted/40 px-2 -mx-2 rounded-xl transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <AlertCircle size={17} className="text-rose-500 shrink-0" />
                        <div>
                          <div className="text-sm font-medium text-foreground">Error Sound</div>
                          <div className="text-xs text-muted-foreground">Audio alert when typing an incorrect character</div>
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
                        <Volume2 size={17} className="text-muted-foreground shrink-0 group-hover:text-cyan-500 transition-colors" />
                        <div>
                          <div className="text-sm font-medium text-foreground">Volume</div>
                          <div className="text-xs text-muted-foreground">Adjust sound effects volume</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 min-w-[200px]">
                        <Volume2 size={16} className="text-muted-foreground shrink-0" />
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={currentVolume}
                          onChange={handleVolumeChange}
                          onMouseUp={handleVolumeMouseUp}
                          onTouchEnd={handleVolumeMouseUp}
                          className="w-full accent-cyan-500 h-1.5 bg-muted rounded-lg cursor-pointer"
                        />
                        <span className="text-xs font-medium text-foreground w-9 text-right tabular-nums">
                          {currentVolume}%
                        </span>
                      </div>
                    </div>

                    {/* Switch Soundpacks Selection */}
                    <div className="pt-3">
                      <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2.5">
                        Mechanical Switch Soundpacks
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {SOUNDPACKS.map((sp) => {
                          const active = (settings?.soundType || 'mechanical') === sp.id;
                          return (
                            <div
                              key={sp.id}
                              onClick={() => {
                                updateSetting('soundType', sp.id);
                                soundEngine.soundType = sp.id;
                                soundEngine.playKeypress(sp.id);
                              }}
                              className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer select-none ${
                                active
                                  ? 'border-cyan-500 bg-cyan-500/15 shadow-sm'
                                  : 'border-border bg-muted/40 hover:bg-muted'
                              }`}
                            >
                              <div className="min-w-0">
                                <p className={`text-xs font-semibold truncate leading-tight ${active ? 'text-cyan-600 dark:text-cyan-300 font-bold' : 'text-foreground'}`}>
                                  {sp.name}
                                </p>
                                <p className="text-[10px] text-muted-foreground truncate mt-0.5">{sp.desc}</p>
                              </div>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  soundEngine.playKeypress(sp.id);
                                }}
                                title="Preview sound"
                                className="h-6 w-6 grid place-items-center rounded-lg bg-muted hover:bg-cyan-500/20 text-muted-foreground hover:text-cyan-600 dark:hover:text-cyan-300 border border-border text-xs shrink-0 transition-colors cursor-pointer"
                              >
                                ▶
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                  </div>
                </section>

                {/* 3. ACCOUNT CARD (Emerald Glow Hover) */}
                <section
                  id="account"
                  className="group relative rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm backdrop-blur-sm space-y-5 transition-all duration-300 ease-out hover:-translate-y-1 hover:border-emerald-500/50 hover:shadow-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 group-hover:scale-110 transition-all duration-300">
                      <User size={20} />
                    </div>
                    <div>
                      <h2 className="text-base font-semibold text-foreground group-hover:text-emerald-500 dark:group-hover:text-emerald-200 transition-colors">Account Details</h2>
                      <p className="text-xs text-muted-foreground">Manage profile and credentials</p>
                    </div>
                  </div>

                  <div className="pt-1">
                    {user ? (
                      <div className="divide-y divide-border">
                        {/* Full Name & Username */}
                        <div className="flex items-center justify-between gap-3 py-3.5 first:pt-2">
                          <div className="flex items-center gap-3">
                            <User size={17} className="text-muted-foreground shrink-0 group-hover:text-emerald-500 transition-colors" />
                            <div>
                              <span className="text-sm font-medium text-foreground block">Name</span>
                              <span className="text-xs text-muted-foreground block">
                                @{user.username}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-xs sm:text-sm text-foreground font-medium">
                              {user.name}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                setEditUserName(user.name || '');
                                setEditUserUsername(user.username || '');
                                setIsEditUserModalOpen(true);
                              }}
                              className="rounded-lg border border-border bg-muted/60 px-3 py-1 text-xs font-medium text-foreground hover:border-emerald-500 hover:bg-emerald-500/15 hover:text-emerald-600 dark:hover:text-emerald-300 transition-colors cursor-pointer"
                            >
                              Edit
                            </button>
                          </div>
                        </div>

                        {/* Email */}
                        <div className="flex items-center justify-between gap-3 py-3.5">
                          <div className="flex items-center gap-3">
                            <Mail size={17} className="text-muted-foreground shrink-0 group-hover:text-emerald-500 transition-colors" />
                            <span className="text-sm font-medium text-foreground">Email</span>
                          </div>
                          <span className="text-xs sm:text-sm text-muted-foreground font-mono">
                            {user.email}
                          </span>
                        </div>

                        {/* Password */}
                        <div className="flex items-center justify-between gap-3 py-3.5">
                          <div className="flex items-center gap-3">
                            <Lock size={17} className="text-muted-foreground shrink-0 group-hover:text-emerald-500 transition-colors" />
                            <span className="text-sm font-medium text-foreground">Password</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-xs sm:text-sm text-muted-foreground tracking-widest font-mono">
                              ••••••••
                            </span>
                            <button
                              type="button"
                              onClick={() => setIsPasswordModalOpen(true)}
                              className="rounded-lg border border-border bg-muted/60 px-3 py-1 text-xs font-medium text-foreground hover:border-emerald-500 hover:bg-emerald-500/15 hover:text-emerald-600 dark:hover:text-emerald-300 transition-colors cursor-pointer"
                            >
                              Change
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="py-6 text-center space-y-3">
                        <p className="text-xs text-muted-foreground leading-relaxed max-w-xs mx-auto">
                          Sign in to link and automatically sync your typing settings across all devices.
                        </p>
                        <Link
                          to="/login"
                          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-md hover:bg-primary/90 transition-colors"
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
                  className="group relative rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm backdrop-blur-sm space-y-5 transition-all duration-300 ease-out hover:-translate-y-1 hover:border-blue-500/50 hover:shadow-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:scale-110 transition-all duration-300">
                      <Keyboard size={20} />
                    </div>
                    <div>
                      <h2 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors">Typing Preferences</h2>
                      <p className="text-xs text-muted-foreground">Configure your typing speed test parameters</p>
                    </div>
                  </div>

                  <div className="pt-2">
                    {/* Top sub-grid: Duration, Mode, Caret Style, Font Size */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pb-5 border-b border-border">
                      
                      {/* Default Duration */}
                      <div className="flex flex-col gap-2 p-3 rounded-xl bg-muted/30 border border-border hover:border-primary/40 hover:bg-muted/60 transition-all duration-200">
                        <div className="flex items-center gap-2">
                          <Clock size={16} className="text-muted-foreground" />
                          <span className="text-xs font-medium text-foreground">Default Duration</span>
                        </div>
                        <div className="inline-flex rounded-xl border border-border bg-background p-1 w-full justify-between">
                          {[15, 30, 60, 120].map((d) => {
                            const isSelected = (settings?.defaultDuration ?? 30) === d;
                            return (
                              <button
                                key={d}
                                type="button"
                                onClick={() => updateSetting('defaultDuration', d)}
                                className={`flex-1 rounded-lg py-1.5 text-xs font-medium transition-all select-none text-center cursor-pointer ${
                                  isSelected
                                    ? 'bg-primary text-primary-foreground font-semibold shadow-sm'
                                    : 'text-muted-foreground hover:text-foreground'
                                }`}
                              >
                                {d}s
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Default Mode */}
                      <div className="flex flex-col gap-2 p-3 rounded-xl bg-muted/30 border border-border hover:border-primary/40 hover:bg-muted/60 transition-all duration-200">
                        <div className="flex items-center gap-2">
                          <FileText size={16} className="text-muted-foreground" />
                          <span className="text-xs font-medium text-foreground">Default Mode</span>
                        </div>
                        <div className="inline-flex rounded-xl border border-border bg-background p-1 w-full justify-between">
                          {['words', 'quote', 'custom'].map((mode) => {
                            const isSelected = (settings?.defaultMode ?? 'words') === mode;
                            return (
                              <button
                                key={mode}
                                type="button"
                                onClick={() => updateSetting('defaultMode', mode)}
                                className={`flex-1 capitalize rounded-lg py-1.5 text-xs font-medium transition-all select-none text-center cursor-pointer ${
                                  isSelected
                                    ? 'bg-primary text-primary-foreground font-semibold shadow-sm'
                                    : 'text-muted-foreground hover:text-foreground'
                                }`}
                              >
                                {mode}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Caret Style */}
                      <div className="flex flex-col gap-2 p-3 rounded-xl bg-muted/30 border border-border hover:border-primary/40 hover:bg-muted/60 transition-all duration-200">
                        <div className="flex items-center gap-2">
                          <Sliders size={16} className="text-muted-foreground" />
                          <span className="text-xs font-medium text-foreground">Caret Style</span>
                        </div>
                        <div className="inline-flex rounded-xl border border-border bg-background p-1 w-full justify-between">
                          {['line', 'block', 'underline'].map((c) => {
                            const isSelected = (settings?.caretStyle ?? 'line') === c;
                            return (
                              <button
                                key={c}
                                type="button"
                                onClick={() => updateSetting('caretStyle', c)}
                                className={`flex-1 capitalize rounded-lg py-1.5 text-xs font-medium transition-all select-none text-center cursor-pointer ${
                                  isSelected
                                    ? 'bg-primary text-primary-foreground font-semibold shadow-sm'
                                    : 'text-muted-foreground hover:text-foreground'
                                }`}
                              >
                                {c}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Font Size */}
                      <div className="flex flex-col gap-2 p-3 rounded-xl bg-muted/30 border border-border hover:border-primary/40 hover:bg-muted/60 transition-all duration-200">
                        <div className="flex items-center gap-2">
                          <Type size={16} className="text-muted-foreground" />
                          <span className="text-xs font-medium text-foreground">Font Size</span>
                        </div>
                        <div className="inline-flex rounded-xl border border-border bg-background p-1 w-full justify-between">
                          {['small', 'medium', 'large'].map((fs) => {
                            const isSelected = (settings?.fontSize ?? 'medium') === fs;
                            return (
                              <button
                                key={fs}
                                type="button"
                                onClick={() => updateSetting('fontSize', fs)}
                                className={`flex-1 capitalize rounded-lg py-1.5 text-xs font-medium transition-all select-none text-center cursor-pointer ${
                                  isSelected
                                    ? 'bg-primary text-primary-foreground font-semibold shadow-sm'
                                    : 'text-muted-foreground hover:text-foreground'
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
                        className="flex items-center justify-between gap-3 p-3.5 rounded-xl bg-muted/30 border border-border cursor-pointer select-none hover:border-primary/40 hover:bg-muted/60 transition-all duration-200"
                      >
                        <div className="flex items-center gap-3">
                          <TrendingUp size={17} className="text-muted-foreground shrink-0 group-hover:text-primary transition-colors" />
                          <div>
                            <div className="text-sm font-medium text-foreground">Show Live WPM</div>
                            <div className="text-xs text-muted-foreground">Display words-per-minute in real-time</div>
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
                        className="flex items-center justify-between gap-3 p-3.5 rounded-xl bg-muted/30 border border-border cursor-pointer select-none hover:border-cyan-500/40 hover:bg-muted/60 transition-all duration-200"
                      >
                        <div className="flex items-center gap-3">
                          <Target size={17} className="text-muted-foreground shrink-0 group-hover:text-cyan-500 transition-colors" />
                          <div>
                            <div className="text-sm font-medium text-foreground">Show Live Accuracy</div>
                            <div className="text-xs text-muted-foreground">Display accuracy % counter while typing</div>
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
                        className="flex items-center justify-between gap-3 p-3.5 rounded-xl bg-muted/30 border border-border cursor-pointer select-none hover:border-rose-500/40 hover:bg-muted/60 transition-all duration-200"
                      >
                        <div className="flex items-center gap-3">
                          <span className="flex h-4 w-4 items-center justify-center font-bold text-xs text-rose-500">!</span>
                          <div>
                            <div className="text-sm font-medium text-foreground">Highlight Mistakes</div>
                            <div className="text-xs text-muted-foreground">Red highlight on mistyped characters</div>
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
                className="group relative rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm backdrop-blur-sm transition-all duration-300 ease-out hover:border-border"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-colors">
                      <RotateCcw size={18} />
                    </div>
                    <div>
                      <h2 className="text-base font-semibold text-foreground">Reset Settings</h2>
                      <p className="text-xs text-muted-foreground">
                        Restore all typing, sound and appearance settings to their default values.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsResetModalOpen(true)}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-muted/60 px-4 py-2.5 text-xs font-semibold text-foreground hover:bg-accent hover:border-border transition-all duration-200 focus:outline-none shrink-0 cursor-pointer"
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
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <h3 className="text-lg font-bold text-foreground">Edit Profile Details</h3>
              <button
                type="button"
                onClick={() => setIsEditUserModalOpen(false)}
                className="rounded-lg p-1 text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSaveAccountModal} className="mt-4 space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-foreground">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={editUserName}
                  onChange={(e) => setEditUserName(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-foreground">
                  Username
                </label>
                <input
                  type="text"
                  required
                  value={editUserUsername}
                  onChange={(e) => setEditUserUsername(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditUserModalOpen(false)}
                  className="rounded-xl px-4 py-2 text-xs font-medium text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updatingProfile}
                  className="rounded-xl bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground shadow-md hover:bg-primary/90 transition-colors disabled:opacity-50 cursor-pointer"
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
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <h3 className="text-lg font-bold text-foreground">Change Password</h3>
              <button
                type="button"
                onClick={() => {
                  setIsPasswordModalOpen(false);
                  setShowCurrentPassword(false);
                  setShowNewPassword(false);
                  setShowConfirmPassword(false);
                }}
                className="rounded-lg p-1 text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleChangePassword} className="mt-4 space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-foreground">
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
                    className="w-full rounded-xl border border-border bg-background pl-4 pr-10 py-2.5 text-sm text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus:outline-none p-1 cursor-pointer"
                    aria-label={showCurrentPassword ? 'Hide password' : 'Show password'}
                  >
                    {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-foreground">
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
                    className="w-full rounded-xl border border-border bg-background pl-4 pr-10 py-2.5 text-sm text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus:outline-none p-1 cursor-pointer"
                    aria-label={showNewPassword ? 'Hide password' : 'Show password'}
                  >
                    {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-foreground">
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
                    className="w-full rounded-xl border border-border bg-background pl-4 pr-10 py-2.5 text-sm text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus:outline-none p-1 cursor-pointer"
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
                  className="rounded-xl px-4 py-2 text-xs font-medium text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={changingPassword}
                  className="rounded-xl bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground shadow-md hover:bg-primary/90 transition-colors disabled:opacity-50 cursor-pointer"
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
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <RotateCcw size={16} />
                </div>
                <h3 className="text-base font-bold text-foreground">Reset settings?</h3>
              </div>
              <button
                type="button"
                disabled={isResetting}
                onClick={() => setIsResetModalOpen(false)}
                className="rounded-lg p-1 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="py-4 text-sm text-foreground/90 leading-relaxed">
              This will restore all your Tara Typing settings to their default values.
            </div>

            <div className="flex justify-end gap-2.5 pt-2 border-t border-border">
              <button
                type="button"
                disabled={isResetting}
                onClick={() => setIsResetModalOpen(false)}
                className="rounded-xl px-4 py-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isResetting}
                onClick={handleConfirmReset}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-md hover:bg-primary/90 transition-colors disabled:opacity-50 cursor-pointer"
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
