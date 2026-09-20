import { z } from 'zod';

const usernameRegex = /^[a-z0-9_]+$/;

export const registerSchema = z.object({
    name: z
      .string()
      .trim()
      .min(2, 'Name must be at least 2 characters')
      .max(50, 'Name cannot exceed 50 characters'),

    email: z
      .string()
      .trim()
      .toLowerCase()
      .email('Please provide a valid email')
      .max(254, 'Email cannot exceed 254 characters'),

    username: z
      .string()
      .trim()
      .toLowerCase()
      .min(3, 'Username must be at least 3 characters')
      .max(20, 'Username cannot exceed 20 characters')
      .regex(
        usernameRegex,
        'Username can only contain letters, numbers, and underscores'
      ),

    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(128, 'Password cannot exceed 128 characters')
      .regex(
        /[A-Z]/,
        'Password must contain at least one uppercase letter'
      )
      .regex(
        /[a-z]/,
        'Password must contain at least one lowercase letter'
      )
      .regex(
        /[0-9]/,
        'Password must contain at least one number'
      )
      .regex(
        /[^A-Za-z0-9\s]/,
        'Password must contain at least one special character'
      )
      .refine(
        (password) => !/\s/.test(password),
        'Password cannot contain spaces'
      ),

    confirmPassword: z
      .string()
      .min(1, 'Please confirm your password'),
  })
  .strict()
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });


export const loginSchema = z.object({
    identifier: z
      .string()
      .trim()
      .min(1, 'Email or username is required')
      .max(254, 'Email or username is too long'),

    password: z
      .string()
      .min(1, 'Password is required')
      .max(128, 'Password is too long'),
  })
  .strict();

export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, 'Current password is required'),

    newPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(128, 'Password cannot exceed 128 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number')
      .regex(
        /[^A-Za-z0-9]/,
        'Password must contain at least one special character'
      ),

    confirmPassword: z
      .string()
      .min(1, 'Please confirm your password'),
  })
  .strict()
  .refine(
    (data) => data.newPassword === data.confirmPassword,
    {
      message: 'Passwords do not match',
      path: ['confirmPassword'],
    }
  );
