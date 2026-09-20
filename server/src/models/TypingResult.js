import mongoose from 'mongoose';

const typingResultSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    mode: {
      type: String,
      enum: ['words', 'quote', 'custom'],
      default: 'words',
      index: true,
    },
    duration: {
      type: Number,
      required: true,
      index: true,
    },
    wpm: {
      type: Number,
      required: true,
      index: true,
    },
    rawWpm: {
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
    correctCharacters: {
      type: Number,
      required: true,
    },
    totalCharacters: {
      type: Number,
      required: true,
    },
    consistency: {
      type: Number,
       required: true,
    },
    wpmHistory: [
      {
        second: Number,
        wpm: Number,
        rawWpm: Number,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Indexes for fast leaderboard queries
typingResultSchema.index({ duration: 1, wpm: -1, createdAt: -1 });
typingResultSchema.index({ createdAt: -1 });

export const TypingResult = mongoose.model('TypingResult', typingResultSchema);
export default TypingResult;
