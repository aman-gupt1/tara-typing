import { z } from 'zod';
import mongoose from 'mongoose';

/**
 * Validate MongoDB ObjectId or Slug identifier
 */
export const idOrSlugSchema = z.string().trim().min(1, 'Identifier is required');

export const objectIdSchema = z.string().refine(
  (val) => mongoose.Types.ObjectId.isValid(val),
  { message: 'Invalid MongoDB ObjectId' }
);

/**
 * Validator schema for querying courses or lessons
 */
export const getLearningQuerySchema = z.object({
  category: z.string().trim().optional(),
  difficulty: z.string().trim().optional(),
  status: z.string().trim().optional(),
  sortBy: z
    .enum([
      'default',
      'views_desc',
      'completion_desc',
      'wpm_desc',
      'title_asc',
      'lessonNumber_asc',
    ])
    .default('default'),
  search: z.string().trim().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(50),
});

/**
 * Validator schema for creating a Course/Module
 */
export const createCourseSchema = z.object({
  title: z.string().trim().min(2, 'Title must be at least 2 characters').max(120),
  slug: z.string().trim().toLowerCase().optional(),
  description: z.string().trim().min(5, 'Description must be at least 5 characters').max(1000),
  category: z.string().trim().min(2, 'Category is required'),
  categoryId: z.string().trim().optional(),
  difficulty: z
    .enum(['Beginner', 'Intermediate', 'Advanced', 'Expert'])
    .default('Beginner'),
  lessons: z.coerce.number().int().min(0).default(0),
  lessonRange: z.string().trim().optional(),
  lessonSlugs: z.array(z.string().trim()).default([]),
  status: z.enum(['Published', 'Draft']).default('Draft'),
  views: z.coerce.number().min(0).default(0),
  completionRate: z.coerce.number().min(0).max(100).default(0),
  avgWpmGain: z.coerce.number().min(0).default(15.0),
});

/**
 * Validator schema for updating a Course/Module
 */
export const updateCourseSchema = createCourseSchema.partial();

/**
 * Validator schema for toggling publish status
 */
export const toggleStatusSchema = z.object({
  status: z.enum(['Published', 'Draft']).optional(),
  isActive: z.boolean().optional(),
});

/**
 * Validator schema for creating a Lesson
 */
export const createLessonSchema = z.object({
  title: z.string().trim().min(2, 'Title must be at least 2 characters').max(150),
  slug: z.string().trim().toLowerCase().optional(),
  lessonNumber: z.coerce.number().int().positive().optional(),
  category: z.string().trim().min(2, 'Category is required'),
  categoryId: z.string().trim().optional(),
  subtitle: z.string().trim().default(''),
  description: z.string().trim().min(5, 'Description must be at least 5 characters'),
  difficulty: z
    .enum(['Beginner', 'Intermediate', 'Advanced', 'Expert'])
    .default('Beginner'),
  duration: z.string().trim().default('5 min'),
  highlightKeys: z
    .union([z.array(z.string().trim()), z.string()])
    .transform((val) => {
      if (Array.isArray(val)) return val.map((s) => s.toUpperCase());
      if (typeof val === 'string') {
        return val
          .split(',')
          .map((s) => s.trim().toUpperCase())
          .filter(Boolean);
      }
      return [];
    })
    .default([]),
  drillText: z.string().default(''),
  hasPostureGuide: z.boolean().default(false),
  hasFingerGuide: z.boolean().default(false),
  hasInteractiveKeyboard: z.boolean().default(false),
  sections: z
    .array(
      z.object({
        heading: z.string().trim().min(1),
        content: z.string().min(1),
        callout: z
          .object({
            type: z.enum(['tip', 'info', 'warning']).default('info'),
            text: z.string().default(''),
          })
          .optional(),
        mistakes: z.array(z.string()).default([]),
      })
    )
    .default([]),
  quiz: z
    .object({
      question: z.string().trim().min(1),
      options: z.array(z.string()).length(4),
      correctIndex: z.number().int().min(0).max(3),
      explanation: z.string().default(''),
    })
    .nullable()
    .optional(),
  practicePreset: z
    .object({
      mode: z.enum(['time', 'words', 'quote', 'custom']).default('words'),
      words: z.number().min(1).default(25),
      duration: z.number().nullable().optional(),
      customText: z.string().default(''),
    })
    .optional(),
  status: z.enum(['Published', 'Draft']).optional(),
  isActive: z.boolean().optional(),
});

/**
 * Validator schema for updating a Lesson
 */
export const updateLessonSchema = createLessonSchema.partial();

/**
 * Validator schema for exporting learning data
 */
export const exportLearningQuerySchema = z.object({
  type: z.enum(['courses', 'lessons', 'all']).default('lessons'),
  category: z.string().trim().optional(),
  difficulty: z.string().trim().optional(),
  status: z.string().trim().optional(),
  format: z.enum(['json', 'csv']).default('json'),
});
