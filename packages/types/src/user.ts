import { z } from 'zod';

export const UserSchema = z.object({
  uid: z.string(),
  email: z.string().email(),
  displayName: z.string().optional(),
  photoURL: z.string().url().optional(),
  handle: z.string().min(3).max(20).regex(/^[a-zA-Z0-9_-]+$/).optional(),
  bio: z.string().max(280).optional(),
  location: z.string().max(100).optional(),
  website: z.string().url().optional(),
  isPrivate: z.boolean().default(true),
  emailVerified: z.boolean().default(false),
  createdAt: z.date(),
  updatedAt: z.date(),
  lastLoginAt: z.date(),
});

export const UpdateUserSchema = UserSchema.partial().omit({
  uid: true,
  email: true,
  createdAt: true,
  updatedAt: true,
  lastLoginAt: true,
});

export const PublicUserSchema = UserSchema.pick({
  uid: true,
  displayName: true,
  photoURL: true,
  handle: true,
  bio: true,
  location: true,
  website: true,
});

export type User = z.infer<typeof UserSchema>;
export type UpdateUser = z.infer<typeof UpdateUserSchema>;
export type PublicUser = z.infer<typeof PublicUserSchema>;