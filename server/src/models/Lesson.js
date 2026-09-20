import mongoose from 'mongoose';

const sectionSchema = new mongoose.Schema(
  {
    heading: {
      type: String,
      required: true,
      trim: true,
    },

    content: {
      type: String,
      required: true,
    },

    callout: {
      type: {
        type: String,
        enum: ['tip', 'info', 'warning'],
        default: 'info',
      },

      text: {
        type: String,
        default: '',
      },
    },

    mistakes: [
      {
        type: String,
      },
    ],
  },
  {
    _id: false,
  }
);

const quizSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
      trim: true,
    },

    options: {
      type: [String],
      required: true,
      validate: {
        validator: (options) => options.length === 4,
        message: 'Quiz must have exactly 4 options',
      },
    },

    correctIndex: {
      type: Number,
      required: true,
      min: 0,
      max: 3,
    },

    explanation: {
      type: String,
      default: '',
    },
  },
  {
    _id: false,
  }
);

const lessonSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },

    lessonNumber: {
      type: Number,
      required: true,
      unique: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    categoryId: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    subtitle: {
      type: String,
      default: '',
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    difficulty: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Beginner',
    },

    duration: {
      type: String,
      default: '5 min',
    },

    highlightKeys: [
      {
        type: String,
        trim: true,
      },
    ],

    hasPostureGuide: {
      type: Boolean,
      default: false,
    },

    hasFingerGuide: {
      type: Boolean,
      default: false,
    },

    hasInteractiveKeyboard: {
      type: Boolean,
      default: false,
    },

    sections: {
      type: [sectionSchema],
      default: [],
    },

    drillText: {
      type: String,
      default: '',
    },

    quiz: {
      type: quizSchema,
      default: null,
    },

   practicePreset: {
    mode: {
        type: String,
        enum: ['time', 'words', 'quote', 'custom'],
        default: 'words',
    },

    words: {
        type: Number,
        default: 25,
        min: 1,
    },

    duration: {
        type: Number,
        default: null,
        min: 1,
    },

    customText: {
        type: String,
        default: '',
    },
}, 

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Lesson = mongoose.model('Lesson', lessonSchema);

export default Lesson;