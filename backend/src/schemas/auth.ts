import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email().max(255),
  password: z.string().min(6).max(255),
});

export const registerSchema = z.object({
  email: z.string().email().max(255),
  password: z.string().min(6).max(255),
  username: z.string().min(3).max(100),
  firstName: z.string().min(2).max(100),
  lastName: z.string().min(2).max(100),
});

export const refreshTokenSchema = z.object({
  token: z.string(),
});

export const userUpdateSchema = z.object({
  firstName: z.string().min(2).max(100).optional(),
  lastName: z.string().min(2).max(100).optional(),
  phone: z.string().max(20).optional(),
  profilePicture: z.string().optional(),
});

export const organizationCreateSchema = z.object({
  organizationName: z.string().min(3).max(200),
  slug: z.string().min(3).max(200),
  email: z.string().email().max(255).optional(),
});
