import { z } from 'zod';

// schema untuk register user
export const registerUserSchema = z.object({
  email: z.email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  role: z.enum(['penyalur', 'penerima']).optional(),
});

// schema untuk update user (semua field optional)
export const updateUserSchema = z.object({

  email: z
    .email('Format email tidak valid')
    .max(255, 'Email maksimal 255 karakter')
    .optional(),

  password: z
    .string()
    .min(6, 'Password must be at least 6 characters long')
    .optional(),
});

// schema untuk validasi parameter
export const userIdSchema = z.object({
  id: z.string().regex(/^\d+$/, 'ID harus berupa angka'),
});

// infer TS types dari schema
export type UpdateUserSchema = z.infer<typeof updateUserSchema>;
export type RegisterUserSchema = z.infer<typeof registerUserSchema>;
export type UserIdSchema = z.infer<typeof userIdSchema>;