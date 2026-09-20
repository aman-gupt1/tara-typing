import mongoose from 'mongoose';

const userLessonProgressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },

    completedLessons: [
      {
        type: String,
        trim: true,
      },
    ],

    bookmarkedLessons: [
      {
        type: String,
        trim: true,
      },
    ],

    quizScores: {
      type: Map,
      of: Number,
      default: {},
    },

    lastVisitedLesson: {
      type: String,
      default: '',
      trim: true,
    },

    totalCompleted: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const UserLessonProgress = mongoose.model(
  'UserLessonProgress',
  userLessonProgressSchema
);

export default UserLessonProgress;