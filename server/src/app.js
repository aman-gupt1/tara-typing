import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';

// Import Routes
import publicStatsRoutes from './routes/publicStats.routes.js';
import dailyChallengeRoutes from './routes/dailyChallenge.routes.js';
import achievementRoutes from './routes/achievement.routes.js';
import authRoutes from './routes/auth.routes.js';
import profileRoutes from './routes/profile.routes.js';
import typingRoutes from './routes/typing.routes.js';
import leaderboardRoutes from './routes/leaderboard.routes.js';
import challengeRoutes from './routes/challenge.routes.js';
import practiceRoutes from './routes/practice.routes.js';
import lessonRoutes from './routes/lesson.routes.js';
import settingsRoutes from './routes/setting.routes.js'
// Import Middleware
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import { apiLimiter } from './middleware/rateLimiter.js';

dotenv.config();

const app = express();

// Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, true); // Allow during dev
      }
    },
    credentials: true,
  })
);

// Logging
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Rate Limiter
app.use('/api', apiLimiter);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'Tara Typing API',
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/typing', typingRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/daily-challenge', challengeRoutes);
app.use('/api/practice', practiceRoutes);
app.use('/api/achievements', achievementRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/daily-challenge', dailyChallengeRoutes);
app.use('/api/public/stats', publicStatsRoutes);
app.use('/api/settings', settingsRoutes);
// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

export default app;
