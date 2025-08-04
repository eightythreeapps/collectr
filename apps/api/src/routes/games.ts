import type { FastifyInstance } from 'fastify';
import type { GameSearchParams, GameSearchResult, ApiResponse } from '@collectr/types';
import { GameSearchService } from '../services/gameSearch';

let gameSearchService: GameSearchService;

export async function gameRoutes(fastify: FastifyInstance) {
  // Initialize search service
  if (!gameSearchService) {
    const igdbClientId = process.env.IGDB_CLIENT_ID;
    const igdbClientSecret = process.env.IGDB_CLIENT_SECRET;
    const rawgApiKey = process.env.RAWG_API_KEY;

    if (!igdbClientId || !igdbClientSecret) {
      fastify.log.warn('IGDB credentials not configured - game search will be limited');
    }

    gameSearchService = new GameSearchService(
      igdbClientId || '',
      igdbClientSecret || '',
      rawgApiKey
    );
  }

  // Search games - public endpoint
  fastify.get<{
    Querystring: GameSearchParams;
    Reply: ApiResponse<GameSearchResult[]>;
  }>('/search', async (request, reply) => {
    const { q, platform, limit = 20, offset = 0 } = request.query as GameSearchParams;

    if (!q || q.trim().length < 2) {
      return reply.status(400).send({
        success: false,
        error: 'Search query must be at least 2 characters',
        timestamp: new Date().toISOString(),
      });
    }

    try {
      const results = await gameSearchService.searchGames({ q: q.trim(), platform, limit, offset });
      
      return reply.send({
        success: true,
        data: results,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      request.log.error({ error, query: q, platform, limit, offset }, 'Game search failed');
      
      return reply.status(500).send({
        success: false,
        error: 'Search service temporarily unavailable',
        timestamp: new Date().toISOString(),
      });
    }
  });

  // Search by barcode/UPC - public endpoint
  fastify.get<{
    Querystring: { upc: string };
    Reply: ApiResponse<GameSearchResult[]>;
  }>('/barcode', async (request, reply) => {
    const { upc } = request.query;

    if (!upc || upc.trim().length < 8) {
      return reply.status(400).send({
        success: false,
        error: 'UPC must be at least 8 characters',
        timestamp: new Date().toISOString(),
      });
    }

    try {
      const results = await gameSearchService.searchByBarcode(upc.trim());
      
      return reply.send({
        success: true,
        data: results,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      request.log.error({ error, upc }, 'Barcode search failed');
      
      return reply.status(500).send({
        success: false,
        error: 'Barcode search service temporarily unavailable',
        timestamp: new Date().toISOString(),
      });
    }
  });

  // Create new game - authenticated
  fastify.post('/', async (request, reply) => {
    if (!request.user) {
      return reply.status(401).send({
        success: false,
        error: 'Authentication required',
        timestamp: new Date().toISOString(),
      });
    }

    // TODO: Implement game creation with validation and AI enrichment
    
    return reply.status(501).send({
      success: false,
      error: 'Not implemented yet',
      timestamp: new Date().toISOString(),
    });
  });

  // Get game by ID - public
  fastify.get<{
    Params: { gameId: string };
  }>('/:gameId', async (request, reply) => {
    const { gameId } = request.params;

    // TODO: Implement game retrieval from Firestore
    
    return reply.status(404).send({
      success: false,
      error: 'Game not found',
      timestamp: new Date().toISOString(),
    });
  });
}