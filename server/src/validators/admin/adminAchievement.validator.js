import { z } from 'zod';
import mongoose from 'mongoose';

/**
 * Validate MongoDB ObjectId or Unique Key identifier
 */
export const idOrKeySchema = z.string().trim().min(1, 'Identifier is required');

export const objectIdSchema = z.string().refine(
  (val) => mongoose.Types.ObjectId.isValid(val),
  { message: 'Invalid MongoDB ObjectId' }
);

/**
 * Query schema for searching, filtering, and sorting achievements
 */
export const getAchievementQuerySchema = z.object({
  category: z.string().trim().optional(),
  tier: z.string().trim().optional(),
  status: z.string().trim().optional(),
  search: z.string().trim().optional(),
  sortBy: z
    .enum(['unlocked_desc', 'rate_desc', 'points_desc', 'name_asc', 'default'])
    .default('unlocked_desc'),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(200).default(100),
});

/**
 * Schema for creating a new achievement badge
 */
export const createAchievementSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100),
  key: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9-]+$/, 'Key must contain only lowercase alphanumeric characters and dashes')
    .optional(),
  description: z.string().trim().min(5, 'Description must be at least 5 characters').max(500),
  requirement: z.string().trim().min(2, 'Requirement description is required').max(200),
  category: z
    .enum(['Speed', 'Accuracy', 'Volume', 'Streak', 'Competition', 'Learning'])
    .default('Speed'),
  tier: z
    .enum(['Common', 'Rare', 'Epic', 'Legendary'])
    .default('Common'),
  icon: z.string().trim().default('Award'),
  color: z
    .enum(['purple', 'blue', 'orange', 'pink', 'green'])
    .default('purple'),
  points: z.coerce.number().int().min(0).max(5000).default(50),
  status: z.enum(['Active', 'Disabled']).default('Active'),
  requirementConfig: z
    .object({
      type: z
        .enum(['testsCompleted', 'bestWpm', 'accuracy', 'currentStreak', 'custom'])
        .default('custom'),
      value: z.coerce.number().min(0).default(0),
    })
    .optional(),
});

/**
 * Schema for updating an existing achievement badge
 */
export const updateAchievementSchema = createAchievementSchema.partial();

/**
 * Schema for updating achievement badge status
 */
export const updateAchievementStatusSchema = z.object({
  status: z.enum(['Active', 'Disabled']).optional(),
  isActive: z.boolean().optional(),
});

/**
 * Schema for exporting achievements
 */
export const exportAchievementQuerySchema = z.object({
  category: z.string().trim().optional(),
  tier: z.string().trim().optional(),
  status: z.string().trim().optional(),
  search: z.string().trim().optional(),
  format: z.enum(['csv', 'json']).default('csv'),
});
