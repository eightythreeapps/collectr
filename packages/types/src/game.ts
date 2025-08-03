import { z } from 'zod';

export const PlatformSchema = z.enum([
  'SNES', 'NES', 'N64', 'GameCube', 'Wii', 'WiiU', 'Switch',
  'PS1', 'PS2', 'PS3', 'PS4', 'PS5', 'PSP', 'PSVita',
  'Xbox', 'Xbox360', 'XboxOne', 'XboxSeriesX',
  'GameBoy', 'GameBoyColor', 'GameBoyAdvance', 'DS', '3DS',
  'Genesis', 'DreamCast', 'Saturn', 'Atari2600', 'Other'
]);

export const GameSchema = z.object({
  id: z.string(),
  title: z.string().min(1, 'Title is required'),
  platform: PlatformSchema,
  publisher: z.string().min(1, 'Publisher is required'),
  year: z.number().int().min(1970).max(new Date().getFullYear() + 5),
  coverUrl: z.string().url().optional(),
  coverAltText: z.string().optional(),
  synopsis: z.string().optional(),
  igdbId: z.number().optional(),
  upc: z.string().optional(),
  createdBy: z.string(), // Firebase UID
  createdAt: z.date(),
  updatedAt: z.date(),
  pendingReview: z.boolean().default(true),
});

export const CreateGameSchema = GameSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const UpdateGameSchema = CreateGameSchema.partial();

export type Platform = z.infer<typeof PlatformSchema>;
export type Game = z.infer<typeof GameSchema>;
export type CreateGame = z.infer<typeof CreateGameSchema>;
export type UpdateGame = z.infer<typeof UpdateGameSchema>;