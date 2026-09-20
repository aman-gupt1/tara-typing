import mongoose from 'mongoose';

const dailyChallengeResultSchema = new mongoose.Schema(
  {
    challenge: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DailyChallenge',
      required: true,
      index: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    wpm: {
      type: Number,
      required: true,
      min: 0,
    },

    rawWpm: {
      type: Number,
      default: 0,
      min: 0,
    },

    accuracy: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },

    mistakes: {
      type: Number,
      default: 0,
      min: 0,
    },

    correctCharacters: {
      type: Number,
      default: 0,
      min: 0,
    },

    totalCharacters: {
      type: Number,
      default: 0,
      min: 0,
    },

    consistency: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    completed: {
      type: Boolean,
      default: true,
    },

    submittedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

/*
 * One user can have only one official submission
 * for a particular daily challenge.
 */
dailyChallengeResultSchema.index(
  { challenge: 1, user: 1 },
  { unique: true }
);

export const DailyChallengeResult = mongoose.model(
  'DailyChallengeResult',
  dailyChallengeResultSchema
);

export default DailyChallengeResult;