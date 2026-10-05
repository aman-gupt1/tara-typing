import 'dotenv/config';
import http from 'http';
import app from './app.js';
import { connectDB } from './config/db.js';
import createAdmin from './seeds/admin.seed.js';
import DailyChallengeRotationService from './services/dailyChallengeRotation.service.js';
import DailyChallenge from './models/DailyChallenge.js';
import { initRaceSocket } from './socket/raceSocket.js';

const PORT = process.env.PORT || 5000;

const dailyChallengeRotationService = new DailyChallengeRotationService(DailyChallenge);

const startServer = async () => {
  try {
    // connect database
    await connectDB();

    // create default admin 
    await createAdmin();

    // Ensure today's India-based daily challenge exists
    const todayChallenge = await dailyChallengeRotationService.ensureTodayChallenge();

    console.log(
      `Daily Challenge - ${todayChallenge.date} - ${todayChallenge.title}`
    );

    const httpServer = http.createServer(app);

    // Initialize Socket.io for Realtime Racing
    initRaceSocket(httpServer);

    httpServer.listen(PORT, () => {
      console.log(
        `Server - Tara Typing Backend running on port ${PORT} in development mode`
      );
    });
  } catch (error) {
    console.error('[Server] Failed to start:', error.message);
    process.exit(1);
  }
};

startServer();
