import mongoose from 'mongoose';

const achievementSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    requirement: {
      type: String,
      required: true,
      trim: true,
    },
    requirementConfig: {
      type: {
        type: String,
        enum: ['testsCompleted', 'bestWpm', 'accuracy', 'currentStreak', 'custom'],
        default: 'custom',
      },
      value: {
        type: Number,
        default: 0,
      },
    },
    category: {
      type: String,
      enum: ['Speed', 'Accuracy', 'Volume', 'Streak', 'Competition', 'Learning'],
      default: 'Speed',
      index: true,
    },
    tier: {
      type: String,
      enum: ['Common', 'Rare', 'Epic', 'Legendary'],
      default: 'Common',
      index: true,
    },
    icon: {
      type: String,
      default: 'Award',
      trim: true,
    },
    color: {
      type: String,
      enum: ['purple', 'blue', 'orange', 'pink', 'green'],
      default: 'purple',
    },
    points: {
      type: Number,
      default: 50,
      min: 0,
    },
    status: {
      type: String,
      enum: ['Active', 'Disabled'],
      default: 'Active',
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Synchronize title with name if not provided
achievementSchema.pre('save', function (next) {
  if (!this.title) {
    this.title = this.name;
  }
  next();
});

// Virtual id field
achievementSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

achievementSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    if (!ret.title && ret.name) ret.title = ret.name;
    return ret;
  },
});

export const Achievement = mongoose.model('Achievement', achievementSchema);
export default Achievement;
