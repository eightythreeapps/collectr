import { z } from 'zod';

export const ConditionSchema = z.enum([
  'CIB', // Complete in Box
  'Loose', // Cart/Disc only
  'Box', // Box only
  'Manual', // Manual only
  'Sealed', // New/Sealed
  'Poor', // Damaged/Poor condition
]);

export const ShelfItemSchema = z.object({
  id: z.string(), // gameId_variant format
  gameRef: z.string(), // Reference to /games/{gameId}
  gameId: z.string(),
  condition: ConditionSchema,
  notes: z.string().max(500).optional(),
  purchasePrice: z.number().positive().optional(),
  purchaseDate: z.date().optional(),
  addedAt: z.date(),
  updatedAt: z.date(),
});

export const ShelfSchema = z.object({
  userId: z.string(), // Firebase UID
  isPublic: z.boolean().default(false),
  displayName: z.string().optional(),
  bio: z.string().max(280).optional(),
  items: z.array(ShelfItemSchema).default([]),
  itemCount: z.number().int().nonnegative().default(0),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const CreateShelfItemSchema = ShelfItemSchema.omit({
  id: true,
  addedAt: true,
  updatedAt: true,
});

export const UpdateShelfItemSchema = CreateShelfItemSchema.partial().omit({
  gameRef: true,
  gameId: true,
});

export type Condition = z.infer<typeof ConditionSchema>;
export type ShelfItem = z.infer<typeof ShelfItemSchema>;
export type Shelf = z.infer<typeof ShelfSchema>;
export type CreateShelfItem = z.infer<typeof CreateShelfItemSchema>;
export type UpdateShelfItem = z.infer<typeof UpdateShelfItemSchema>;