import { z } from 'zod';
import { GameSchema, CreateGameSchema } from './game';
import { ShelfItemSchema, CreateShelfItemSchema, UpdateShelfItemSchema } from './shelf';

// API Response wrappers
export const ApiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    data: dataSchema.optional(),
    error: z.string().optional(),
    timestamp: z.string().datetime(),
  });

export const PaginatedResponseSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
  z.object({
    success: z.boolean(),
    data: z.object({
      items: z.array(itemSchema),
      nextCursor: z.string().optional(),
      hasMore: z.boolean(),
      total: z.number().int().nonnegative().optional(),
    }).optional(),
    error: z.string().optional(),
    timestamp: z.string().datetime(),
  });

// Search API schemas
export const GameSearchParamsSchema = z.object({
  q: z.string().min(1, 'Search query is required'),
  platform: z.string().optional(),
  limit: z.number().int().min(1).max(50).default(20),
  offset: z.number().int().nonnegative().default(0),
});

export const GameSearchResultSchema = GameSchema.extend({
  relevanceScore: z.number().min(0).max(1).optional(),
});

// Shelf API schemas
export const ShelfParamsSchema = z.object({
  cursor: z.string().optional(),
  limit: z.number().int().min(1).max(100).default(20),
  condition: z.string().optional(),
  platform: z.string().optional(),
  sortBy: z.enum(['addedAt', 'title', 'year', 'platform']).default('addedAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

// Error schemas
export const ApiErrorSchema = z.object({
  code: z.string(),
  message: z.string(),
  details: z.record(z.any()).optional(),
});

// IGDB integration schemas
export const IGDBGameSchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string().optional(),
  summary: z.string().optional(),
  cover: z.object({
    id: z.number(),
    url: z.string(),
  }).optional(),
  platforms: z.array(z.object({
    id: z.number(),
    name: z.string(),
    abbreviation: z.string().optional(),
  })).optional(),
  involved_companies: z.array(z.object({
    company: z.object({
      name: z.string(),
    }),
    publisher: z.boolean().optional(),
  })).optional(),
  first_release_date: z.number().optional(),
});

export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
};

export type PaginatedResponse<T> = {
  success: boolean;
  data?: {
    items: T[];
    nextCursor?: string;
    hasMore: boolean;
    total?: number;
  };
  error?: string;
  timestamp: string;
};

export type GameSearchParams = z.infer<typeof GameSearchParamsSchema>;
export type GameSearchResult = z.infer<typeof GameSearchResultSchema>;
export type ShelfParams = z.infer<typeof ShelfParamsSchema>;
export type ApiError = z.infer<typeof ApiErrorSchema>;
export type IGDBGame = z.infer<typeof IGDBGameSchema>;