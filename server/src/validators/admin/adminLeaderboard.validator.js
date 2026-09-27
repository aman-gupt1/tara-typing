import { z } from 'zod';
import mongoose from 'mongoose';

/**
 * Validate MongoDB ObjectId
 */
export const objectIdSchema = z.string().refine(
  (val) => mongoose.Types.ObjectId.isValid(val),
  { message: 'Invalid MongoDB ObjectId' }
);

/**
 * Validator schema for GET /api/admin/leaderboard
 */
export const getLeaderboardQuerySchema = z.object({
  timeframe: z
    .enum([
      'global',
      'daily',
      'weekly',
      'monthly',
      'allTime',
      'today',
      'thisWeek',
      'thisMonth',
    ])
    .default('global'),
  mode: z
    .enum([
      'All',
      'all',
      'timed',
      'Timed',
      'words',
      'Words',
      'quote',
      'Quote',
      'code',
      'Code',
      'daily challenge',
      'Daily Challenge',
      'challenge',
      'Challenge',
    ])
    .optional(),
  status: z
    .enum(['All', 'all', 'Verified', 'verified', 'Flagged', 'flagged'])
    .optional(),
  sortBy: z
    .enum([
      'rank',
      'speed_desc',
      'accuracy_desc',
      'tests_desc',
      'risk_desc',
    ])
    .default('rank'),
  search: z.string().trim().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

/**
 * Validator schema for PATCH /api/admin/leaderboard/entry/:testId/flag
 */
export const toggleFlagSchema = z.object({
  isFlagged: z.boolean().optional(),
  status: z
    .enum(['Verified', 'verified', 'Flagged', 'flagged'])
    .optional()
    .transform((val) => (val ? val.toLowerCase() : undefined)),
});

/**
 * Validator schema for GET /api/admin/leaderboard/export
 */
export const exportLeaderboardQuerySchema = z.object({
  timeframe: z
    .enum([
      'global',
      'daily',
      'weekly',
      'monthly',
      'allTime',
      'today',
      'thisWeek',
      'thisMonth',
    ])
    .default('global'),
  format: z.enum(['csv', 'json']).default('csv'),
});
