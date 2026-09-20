import mongoose from 'mongoose';

const dailyChallengeSchema = new mongoose.Schema(
  {
    date: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
       trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    text: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      default: 60,
       min: 1,
    },
    participantsCount: {
      type: Number,
      default: 0,
       min: 0,
    },
    topScores: [
      {
        rank: {
         type: Number,
        min: 1, 
        },
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          
        },
        name: {
          type:String,
          trim:true
        },
        username:{
          type:String,
          trim:true
        },
        avatar:{
          type:String,
          trim:true
        },
        wpm: {
          type: Number,
          min: 0,
        },

        accuracy: {
          type: Number,
          min: 0,
          max: 100,
        },
        submittedAt: {
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

export const DailyChallenge = mongoose.model('DailyChallenge', dailyChallengeSchema);
export default DailyChallenge;
