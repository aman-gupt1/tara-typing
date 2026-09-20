import mongoose from 'mongoose';

const userSettingsSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },

    // Appearance
    accentColor: {
      type: String,
      enum: [
        '#3B82F6', // Blue
        '#8B5CF6', // Purple
        '#10B981', // Green
        '#F59E0B', // Orange
        '#EF4444', // Red
        '#EC4899', // Pink
      ],
      default: '#3B82F6',
    },

    // Sound Effects
    keypressSound: {
      type: Boolean,
      default: true,
    },

    errorSound: {
      type: Boolean,
      default: true,
    },

    soundVolume: {
      type: Number,
      min: 0,
      max: 1,
      default: 0.72,
    },

    // Typing Preferences
    defaultDuration: {
      type: Number,
      enum: [15, 30, 60, 120],
      default: 30,
    },

    defaultMode: {
      type: String,
      enum: ['words', 'quote', 'custom'],
      default: 'words',
    },

    caretStyle: {
      type: String,
      enum: ['line', 'block', 'underline'],
      default: 'line',
    },

    fontSize: {
      type: String,
      enum: ['small', 'medium', 'large'],
      default: 'medium',
    },

    showLiveWpm: {
      type: Boolean,
      default: true,
    },

    showLiveAccuracy: {
      type: Boolean,
      default: true,
    },

    highlightMistakes: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const UserSettings = mongoose.model(
  'UserSettings',
  userSettingsSchema
);

export default UserSettings;