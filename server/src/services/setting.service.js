import UserSettings from '../models/UserSetting.js';

const DEFAULT_SETTINGS = {
  accentColor: '#3B82F6',

  keypressSound: true,
  errorSound: true,
  soundVolume: 0.72,

  defaultDuration: 30,
  defaultMode: 'words',
  caretStyle: 'line',
  fontSize: 'medium',

  showLiveWpm: true,
  showLiveAccuracy: true,
  highlightMistakes: true,
};

class SettingsService {
  constructor(UserSettingsModel) {
    this.UserSettings = UserSettingsModel;
  }

  /**
   * Get user settings.
   * If settings don't exist yet, create them with defaults.
   */
  async getSettings(userId) {
    if (!userId) {
      const error = new Error('User ID is required');
      error.statusCode = 400;
      throw error;
    }

    let settings = await this.UserSettings.findOne({
      user: userId,
    }).lean();

    if (!settings) {
      settings = await this.UserSettings.create({
        user: userId,
        ...DEFAULT_SETTINGS,
      });

      settings = settings.toObject();
    }

    return this.formatSettings(settings);
  }

  /**
   * Update one or multiple settings.
   */
  async updateSettings(userId, updates) {
    if (!userId) {
      const error = new Error('User ID is required');
      error.statusCode = 400;
      throw error;
    }

    if (!updates || typeof updates !== 'object') {
      const error = new Error('Settings data is required');
      error.statusCode = 400;
      throw error;
    }

    const allowedFields = [
      'accentColor',
      'keypressSound',
      'errorSound',
      'soundVolume',
      'defaultDuration',
      'defaultMode',
      'caretStyle',
      'fontSize',
      'showLiveWpm',
      'showLiveAccuracy',
      'highlightMistakes',
    ];

    const sanitizedUpdates = {};

    for (const field of allowedFields) {
      if (Object.prototype.hasOwnProperty.call(updates, field)) {
        sanitizedUpdates[field] = updates[field];
      }
    }

    if (Object.keys(sanitizedUpdates).length === 0) {
      const error = new Error('No valid settings provided');
      error.statusCode = 400;
      throw error;
    }

    const settings = await this.UserSettings.findOneAndUpdate(
      {
        user: userId,
      },
      {
        $set: sanitizedUpdates,
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      }
    ).lean();

    return this.formatSettings(settings);
  }

  /**
   * Reset all settings to default values.
   */
  async resetSettings(userId) {
    if (!userId) {
      const error = new Error('User ID is required');
      error.statusCode = 400;
      throw error;
    }

    const settings = await this.UserSettings.findOneAndUpdate(
      {
        user: userId,
      },
      {
        $set: DEFAULT_SETTINGS,
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      }
    ).lean();

    return this.formatSettings(settings);
  }

  /**
   * Return only settings fields.
   * Prevents MongoDB/internal fields from leaking to frontend.
   */
  formatSettings(settings) {
    return {
      accentColor: settings.accentColor,

      keypressSound: settings.keypressSound,
      errorSound: settings.errorSound,
      soundVolume: settings.soundVolume,

      defaultDuration: settings.defaultDuration,
      defaultMode: settings.defaultMode,
      caretStyle: settings.caretStyle,
      fontSize: settings.fontSize,

      showLiveWpm: settings.showLiveWpm,
      showLiveAccuracy: settings.showLiveAccuracy,
      highlightMistakes: settings.highlightMistakes,
    };
  }
}

const settingsService = new SettingsService(UserSettings);

export default settingsService;