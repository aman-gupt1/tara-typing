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
 * Validator schema for GET /api/admin/typing-tests query parameters
 */
export const getTypingTestsQuerySchema = z.object({
  search: z.string().trim().optional(),
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
      'custom',
      'Custom',
      'daily challenge',
      'Daily Challenge',
      'challenge',
      'Challenge',
    ])
    .optional(),
  status: z
    .enum(['All', 'all', 'valid', 'Valid', 'suspicious', 'Suspicious'])
    .optional(),
  sortBy: z
    .enum([
      'newest',
      'createdAt',
      'speed_desc',
      'speed',
      'wpm',
      'accuracy_desc',
      'accuracy',
      'risk_desc',
      'risk',
    ])
    .optional(),
  sortOrder: z.enum(['asc', 'desc', '1', '-1']).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

/**
 * Validator schema for PATCH /api/admin/typing-tests/:id/validity
 */
export const updateValiditySchema = z.object({
  status: z
    .enum(['valid', 'suspicious', 'Valid', 'Suspicious'])
    .optional()
    .transform((val) => (val ? val.toLowerCase() : undefined)),
  isSuspicious: z.boolean().optional(),
});

/**
 * Validator schema for GET /api/admin/typing-tests/export
 */
export const exportTypingTestsQuerySchema = z.object({
  format: z.enum(['csv', 'json']).default('csv'),
});
