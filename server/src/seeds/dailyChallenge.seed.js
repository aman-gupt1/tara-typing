import dotenv from 'dotenv';
import mongoose from 'mongoose';

import DailyChallenge from '../models/DailyChallenge.js';

dotenv.config();

const getIndiaDate = (date = new Date()) => {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
};

const seedDailyChallenge = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGODB_URI is not defined in .env');
    }

    await mongoose.connect(process.env.MONGO_URI);

    console.log('MongoDB connected');

    const today = getIndiaDate();

    const existingChallenge = await DailyChallenge.findOne({
      date: today,
    });

    if (existingChallenge) {
      console.log(
        `Daily challenge already exists for ${today}`
      );
      console.log(`Challenge ID: ${existingChallenge._id}`);

      await mongoose.disconnect();
      return;
    }

    const challenge = await DailyChallenge.create({
      date: today,

      title: 'Daily Speed Sprint',

      description:
        'Push your typing speed while maintaining excellent accuracy.',

      text:
        'Touch typing becomes faster and easier when your fingers learn the keyboard through consistent practice. Focus on rhythm, accuracy, and keeping your eyes on the screen.',

      duration: 60,

      participantsCount: 0,

      topScores: [],
    });

    console.log('Daily challenge seeded successfully');
    console.log(`Date: ${challenge.date}`);
    console.log(`Challenge ID: ${challenge._id}`);
    console.log(`Title: ${challenge.title}`);

    await mongoose.disconnect();
    console.log('MongoDB disconnected');
  } catch (error) {
    console.error(
      'Daily challenge seed failed:',
      error.message
    );

    await mongoose.disconnect();
    process.exit(1);
  }
};

seedDailyChallenge();