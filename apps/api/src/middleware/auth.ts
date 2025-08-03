import type { FastifyRequest, FastifyReply } from 'fastify';
import { auth } from '../utils/firebase';

declare module 'fastify' {
  interface FastifyRequest {
    user?: {
      uid: string;
      email?: string;
      emailVerified: boolean;
    };
  }
}

const PUBLIC_ROUTES = [
  '/health',
  '/v1/games/search', // Public game search
];

const PUBLIC_ROUTE_PATTERNS = [
  /^\/v1\/shelves\/[^\/]+$/, // GET /v1/shelves/{userId} - public shelf access
];

function isPublicRoute(url: string, method: string): boolean {
  // Health check is always public
  if (url === '/health') {
    return true;
  }

  // Check exact matches
  if (PUBLIC_ROUTES.includes(url)) {
    return true;
  }

  // Check pattern matches for GET requests only
  if (method === 'GET') {
    return PUBLIC_ROUTE_PATTERNS.some(pattern => pattern.test(url));
  }

  return false;
}

export async function authMiddleware(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  const { method } = request;
  // Get URL pathname without query parameters
  const pathname = new URL(request.url, 'http://localhost').pathname;

  // Skip authentication for public routes
  if (isPublicRoute(pathname, method)) {
    return;
  }

  try {
    const authorization = request.headers.authorization;
    
    if (!authorization?.startsWith('Bearer ')) {
      return reply.status(401).send({
        success: false,
        error: 'Missing or invalid authorization header',
        timestamp: new Date().toISOString(),
      });
    }

    const idToken = authorization.slice(7); // Remove 'Bearer ' prefix
    
    const decodedToken = await auth.verifyIdToken(idToken);
    
    request.user = {
      uid: decodedToken.uid,
      email: decodedToken.email || undefined,
      emailVerified: decodedToken.email_verified || false,
    };
  } catch (error) {
    request.log.warn({ error, url, method }, 'Authentication failed');
    
    return reply.status(401).send({
      success: false,
      error: 'Invalid or expired token',
      timestamp: new Date().toISOString(),
    });
  }
}