import { z } from 'zod';

export const RegisterSchema = z.object({
  email: z.string().trim().email({ message: 'Invalid email address format' }).max(255),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long' })
    .max(128, { message: 'Password must not exceed 128 characters' }),
  name: z.string().trim().min(2, { message: 'Name must be at least 2 characters' }).max(100),
});

export type RegisterInput = z.infer<typeof RegisterSchema>;

export const LoginSchema = z.object({
  email: z.string().trim().email({ message: 'Invalid email address format' }),
  password: z.string().min(1, { message: 'Password is required' }),
});

export type LoginInput = z.infer<typeof LoginSchema>;

export interface UserRecord {
  id: string;
  email: string;
  name: string;
  password_hash: string;
  created_at: string;
  updated_at: string;
}

export interface SafeUser {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface JWTPayload {
  userId: string;
  email: string;
}
