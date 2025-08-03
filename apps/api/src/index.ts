import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';

import { authMiddleware } from './middleware/auth';
import { errorHandler } from './middleware/error';
import { gameRoutes } from './routes/games';
import { shelfRoutes } from './routes/shelves';
import { userRoutes } from './routes/users';
import { initializeFirebase } from './utils/firebase';

const PORT = parseInt(process.env.PORT || '3001', 10);
const HOST = process.env.HOST || '0.0.0.0';
const NODE_ENV = process.env.NODE_ENV || 'development';

const server = Fastify({
  logger: {
    level: NODE_ENV === 'development' ? 'debug' : 'info',
    transport: NODE_ENV === 'development' ? {
      target: 'pino-pretty',
      options: {
        colorize: true,
      },
    } : undefined,
  },
});

async function buildServer() {
  // Initialize Firebase Admin
  await initializeFirebase();

  // Register plugins
  await server.register(helmet, {
    contentSecurityPolicy: false, // Allow for API usage
  });

  await server.register(cors, {
    origin: NODE_ENV === 'development' 
      ? ['http://localhost:3000', 'http://127.0.0.1:3000']
      : [process.env.ALLOWED_ORIGINS?.split(',') || []].flat(),
    credentials: true,
  });

  await server.register(rateLimit, {
    max: 100,
    timeWindow: '1 minute',
  });

  // Register middleware
  server.addHook('preHandler', authMiddleware);
  server.setErrorHandler(errorHandler);

  // Health check
  server.get('/health', async () => {
    return { 
      status: 'ok', 
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '0.1.0',
    };
  });

  // Register routes
  await server.register(gameRoutes, { prefix: '/v1/games' });
  await server.register(shelfRoutes, { prefix: '/v1/shelves' });
  await server.register(userRoutes, { prefix: '/v1/users' });

  return server;
}

async function start() {
  try {
    const app = await buildServer();
    
    await app.listen({ 
      port: PORT, 
      host: HOST,
    });
    
    console.log(`🚀 API server running on http://${HOST}:${PORT}`);
    console.log(`📋 Health check: http://${HOST}:${PORT}/health`);
  } catch (error) {
    console.error('❌ Error starting server:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  console.log('📋 SIGTERM received, shutting down gracefully...');
  await server.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('📋 SIGINT received, shutting down gracefully...');
  await server.close();
  process.exit(0);
});

if (require.main === module) {
  start();
}

export { buildServer };