import type { FastifyError, FastifyRequest, FastifyReply } from 'fastify';
import { ZodError } from 'zod';

export async function errorHandler(
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  const timestamp = new Date().toISOString();

  // Log the error
  request.log.error({
    error: {
      message: error.message,
      stack: error.stack,
      code: error.code,
    },
    url: request.url,
    method: request.method,
    userId: request.user?.uid,
  }, 'Request error');

  // Handle Zod validation errors
  if (error instanceof ZodError) {
    return reply.status(400).send({
      success: false,
      error: 'Validation error',
      details: error.errors.map(err => ({
        path: err.path.join('.'),
        message: err.message,
      })),
      timestamp,
    });
  }

  // Handle Fastify validation errors
  if (error.validation) {
    return reply.status(400).send({
      success: false,
      error: 'Request validation failed',
      details: error.validation,
      timestamp,
    });
  }

  // Handle specific error codes
  switch (error.statusCode) {
    case 400:
      return reply.status(400).send({
        success: false,
        error: error.message || 'Bad Request',
        timestamp,
      });
    
    case 401:
      return reply.status(401).send({
        success: false,
        error: 'Unauthorized',
        timestamp,
      });
    
    case 403:
      return reply.status(403).send({
        success: false,
        error: 'Forbidden',
        timestamp,
      });
    
    case 404:
      return reply.status(404).send({
        success: false,
        error: 'Not Found',
        timestamp,
      });
    
    case 429:
      return reply.status(429).send({
        success: false,
        error: 'Too Many Requests',
        timestamp,
      });
    
    default:
      // Internal server error - don't expose details in production
      const isDevelopment = process.env.NODE_ENV === 'development';
      
      return reply.status(500).send({
        success: false,
        error: 'Internal Server Error',
        ...(isDevelopment && { details: error.message }),
        timestamp,
      });
  }
}