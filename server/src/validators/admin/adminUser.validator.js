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
 * Validator schema for GET /api/admin/users query parameters
 */
export const getUsersQuerySchema = z.object({
  search: z.string().trim().optional(),
  status: z
    .enum([
      'All',
      'all',
      'active',
      'suspended',
      'inactive',
      'Active',
      'Suspended',
      'Inactive',
    ])
    .optional(),
  speedTier: z
    .enum([
      'All',
      'all',
      'beginner',
      'intermediate',
      'advanced',
      'elite',
      'Beginner',
      'Intermediate',
      'Advanced',
      'Elite',
    ])
    .optional(),
  sortBy: z
    .enum([
      'createdAt',
      'newest',
      'name',
      'bestWpm',
      'speed',
      'averageWpm',
      'testsCompleted',
      'tests',
      'accuracy',
      'currentStreak',
      'streak',
      'curriculum',
      'lastLoginAt',
    ])
    .optional(),
  sortOrder: z.enum(['asc', 'desc', '1', '-1']).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

/**
 * Validator schema for PATCH /api/admin/users/:id/role
 */
export const updateRoleSchema = z.object({
  role: z.enum(['user', 'admin'], {
    errorMap: () => ({ message: "Role must be either 'user' or 'admin'" }),
  }),
});

/**
 * Validator schema for PATCH /api/admin/users/:id/status
 */
export const updateStatusSchema = z.object({
  status: z
    .enum(['active', 'suspended', 'inactive', 'Active', 'Suspended', 'Inactive'], {
      errorMap: () => ({
        message: "Status must be 'active', 'suspended', or 'inactive'",
      }),
    })
    .transform((val) => val.toLowerCase()),
});

/**
 * Validator schema for GET /api/admin/users/export
 */
export const exportUsersQuerySchema = z.object({
  format: z.enum(['csv', 'json']).default('csv'),
});

