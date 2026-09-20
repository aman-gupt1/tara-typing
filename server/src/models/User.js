import mongoose from 'mongoose';


const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,  
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
     location:{
      type:String,
      default:""
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    },
   
    avatar: {
      type: String,
      default: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    },
    bio: {
      type: String,
      default: 'Dedicated to typing faster and thinking sharper.',
    },
    bestWpm: {
      type: Number,
      default: 0,
    },
    averageWpm: {
      type: Number,
      default: 0,
    },
    accuracy: {
      type: Number,
      default: 0,
    },
    totalCorrectCharacters: {
      type: Number,
      default: 0,
    },

    totalCharacters: {
      type: Number,
      default: 0,
    },
    testsCompleted: {
      type: Number,
      default: 0,
    },
    totalTypingTime: {
      type: Number,
      default: 0,
    },
    currentStreak: {
      type: Number,
      default: 1,
    },
    lastTypingDate: {
      type: Date,
      default: null,
    },
   achievements: [
  {
    key: {
      type: String,
      required: true,
    },
    unlockedAt: {
      type: Date,
      default: Date.now,
    },
  },
],
  },
  {
    timestamps: true,
  }
);


export const User = mongoose.model('User', userSchema);
export default User;
