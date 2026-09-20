import mongoose from 'mongoose';

const practiceSessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    mode: {
      type: String,
      enum: ['time', 'words', 'quote', 'custom'],
      required: true,
    },
    targetParam: {
      type: String, // e.g. "30s", "50 words", etc.
    },
    wpm: {
      type: Number,
      required: true,
    },
    accuracy: {
      type: Number,
      required: true,
    },
    mistakes: {
      type: Number,
      default: 0,
    },
    duration: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

export const PracticeSession = mongoose.model('PracticeSession', practiceSessionSchema);
export default PracticeSession;
