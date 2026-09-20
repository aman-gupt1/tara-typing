import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { toast } from 'react-toastify';
import { storage } from '../utils/storage';
import { soundEngine } from '../utils/soundEngine';
import { settingsService } from '../services/settingsService';
import { useAuth } from './AuthContext';

export const DEFAULT_SETTINGS = {
  accentColor: '#3B82F6',
  keypressSound: true,
  errorSound: true,
  soundVolume: 0.72,
  defaultDuration: 30,
  defaultMode: 'words',
  caretStyle: 'line', // 'line' | 'block' | 'underline'
  fontSize: 'medium', // 'small' | 'medium' | 'large'
  showLiveWpm: true,
  showLiveAccuracy: true,
  highlightMistakes: true,
  // Compatibility aliases
  soundType: 'mechanical',
  liveWpm: true,
  showAccuracy: true,
};

/**
 * Normalizes settings object to guarantee all required fields and backward-compatibility aliases.
 */
const normalizeSettings = (raw = {}) => {
  const merged = { ...DEFAULT_SETTINGS, ...raw };

  // Sync soundType with keypressSound
  if (raw.keypressSound !== undefined) {
    merged.keypressSound = Boolean(raw.keypressSound);
    merged.soundType = merged.keypressSound ? 'mechanical' : 'off';
  } else if (raw.soundType !== undefined) {
    merged.keypressSound = raw.soundType !== 'off';
    merged.soundType = raw.soundType;
  }

  // Sync showLiveWpm with liveWpm
  if (raw.showLiveWpm !== undefined) {
    merged.showLiveWpm = Boolean(raw.showLiveWpm);
    merged.liveWpm = merged.showLiveWpm;
  } else if (raw.liveWpm !== undefined) {
    merged.showLiveWpm = Boolean(raw.liveWpm);
    merged.liveWpm = merged.showLiveWpm;
  }

  // Sync showLiveAccuracy with showAccuracy
  if (raw.showLiveAccuracy !== undefined) {
    merged.showLiveAccuracy = Boolean(raw.showLiveAccuracy);
    merged.showAccuracy = merged.showLiveAccuracy;
  } else if (raw.showAccuracy !== undefined) {
    merged.showLiveAccuracy = Boolean(raw.showAccuracy);
    merged.showAccuracy = merged.showLiveAccuracy;
  }

  return merged;
};

/**
 * Applies physical audio synthesis and CSS theme property side effects.
 */
const applySideEffects = (s) => {
  if (!s) return;

  // Sound Engine
  soundEngine.soundType = s.keypressSound ? 'mechanical' : 'off';
  soundEngine.volume = typeof s.soundVolume === 'number' ? s.soundVolume : 0.72;
  soundEngine.errorSoundEnabled = s.errorSound !== false;

  // Accent color in DOM CSS vars
  if (s.accentColor && typeof document !== 'undefined') {
    document.documentElement.style.setProperty('--primary', s.accentColor);
    document.documentElement.style.setProperty('--ring', s.accentColor);
    localStorage.setItem('tara_accent_color', s.accentColor);
  }
};

const SettingsContext = createContext(null);

export const SettingsProvider = ({ children }) => {
  const { user } = useAuth();

  // Initial state from localStorage or defaults
  const [settings, setSettings] = useState(() => {
    const saved = storage.getSettings();
    const initial = normalizeSettings(saved || DEFAULT_SETTINGS);
    applySideEffects(initial);
    return initial;
  });

  const [loading, setLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // Debounce ref for volume slider
  const volumeDebounceRef = useRef(null);
  const pendingUpdatesRef = useRef({});

  /**
   * Fetch settings from MongoDB for logged-in users.
   */
  const fetchSettings = useCallback(async () => {
    if (!user) {
      // Guest mode: load from localStorage
      const saved = storage.getSettings();
      const normalized = normalizeSettings(saved || DEFAULT_SETTINGS);
      setSettings(normalized);
      applySideEffects(normalized);
      return;
    }

    setLoading(true);
    try {
      const res = await settingsService.getSettings();
      if (res?.settings) {
        const normalized = normalizeSettings(res.settings);
        setSettings(normalized);
        applySideEffects(normalized);
        storage.setSettings(normalized);
      }
    } catch (err) {
      // Keep existing settings on failure and alert user
      const saved = storage.getSettings();
      const normalized = normalizeSettings(saved || DEFAULT_SETTINGS);
      setSettings(normalized);
      applySideEffects(normalized);

      // Only notify if not a silent 401 unauthenticated check
      if (err?.status !== 401) {
        toast.error("Unable to load settings. Please try again.", { toastId: 'settings-load-error' });
      }
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Load settings whenever user login status changes
  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  /**
   * Dispatch PATCH /api/settings to server with changed settings.
   */
  const sendPatchRequest = async (payload) => {
    if (!user) return;
    setIsSyncing(true);
    try {
      const res = await settingsService.updateSettings(payload);
      if (res?.settings) {
        setSettings((prev) => {
          const synced = normalizeSettings({ ...prev, ...res.settings });
          applySideEffects(synced);
          storage.setSettings(synced);
          return synced;
        });
      }
    } catch (err) {
      toast.error("Unable to save setting. Please try again.", { toastId: 'settings-save-error' });
    } finally {
      setIsSyncing(false);
    }
  };

  /**
   * Update a single setting optimistically, syncing to localStorage and backend.
   */
  const updateSetting = (key, value) => {
    // Determine corresponding backend API field
    let apiPayloadKey = key;
    let apiPayloadValue = value;

    if (key === 'soundType') {
      apiPayloadKey = 'keypressSound';
      apiPayloadValue = value !== 'off';
    } else if (key === 'liveWpm') {
      apiPayloadKey = 'showLiveWpm';
    } else if (key === 'showAccuracy') {
      apiPayloadKey = 'showLiveAccuracy';
    }

    // 1. Immediate optimistic UI update
    setSettings((prev) => {
      const next = normalizeSettings({ ...prev, [key]: value, [apiPayloadKey]: apiPayloadValue });
      applySideEffects(next);
      storage.setSettings(next);
      return next;
    });

    if (!user) return;

    // 2. Debounce volume slider movements to prevent spamming PATCH requests
    if (apiPayloadKey === 'soundVolume') {
      pendingUpdatesRef.current[apiPayloadKey] = apiPayloadValue;
      if (volumeDebounceRef.current) {
        clearTimeout(volumeDebounceRef.current);
      }
      volumeDebounceRef.current = setTimeout(() => {
        const payload = { ...pendingUpdatesRef.current };
        pendingUpdatesRef.current = {};
        sendPatchRequest(payload);
      }, 400);
    } else {
      // Immediate PATCH for toggles, select, and colors
      // If a volume debounce was pending, include it in this request
      const payload = { ...pendingUpdatesRef.current, [apiPayloadKey]: apiPayloadValue };
      pendingUpdatesRef.current = {};
      if (volumeDebounceRef.current) {
        clearTimeout(volumeDebounceRef.current);
      }
      sendPatchRequest(payload);
    }
  };

  /**
   * Update multiple settings simultaneously.
   */
  const updateSettings = (newSettings) => {
    setSettings((prev) => {
      const next = normalizeSettings({ ...prev, ...newSettings });
      applySideEffects(next);
      storage.setSettings(next);
      return next;
    });

    if (user && Object.keys(newSettings).length > 0) {
      sendPatchRequest(newSettings);
    }
  };

  /**
   * Reset all settings to defaults via POST /api/settings/reset
   */
  const resetSettings = async () => {
    if (user) {
      try {
        const res = await settingsService.resetSettings();
        const resetData = res?.settings ? normalizeSettings(res.settings) : normalizeSettings(DEFAULT_SETTINGS);
        setSettings(resetData);
        applySideEffects(resetData);
        storage.setSettings(resetData);
        toast.success("Settings reset successfully", { toastId: 'settings-reset-success' });
        return resetData;
      } catch (err) {
        toast.error("Unable to reset settings. Please try again.", { toastId: 'settings-reset-error' });
        throw err;
      }
    } else {
      // Guest reset
      const resetData = normalizeSettings(DEFAULT_SETTINGS);
      setSettings(resetData);
      applySideEffects(resetData);
      storage.setSettings(resetData);
      toast.success("Settings reset successfully", { toastId: 'settings-reset-success' });
      return resetData;
    }
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        loading,
        isSyncing,
        updateSetting,
        updateSettings,
        resetSettings,
        refreshSettings: fetchSettings,
        // Backward-compatibility aliases
        soundEnabled: settings.keypressSound,
        soundType: settings.soundType,
        soundVolume: settings.soundVolume,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};

export default SettingsContext;
