import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { config } from '../config/index.js';

export function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  // Handle Zod validation errors
  if (err instanceof ZodError) {
    res.status(422).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid input parameters provided',
        details: err.flatten().fieldErrors,
      },
    });
    return;
  }

  // Handle known HTTP errors
  const statusCode = err.statusCode || 500;
  const errorCode = err.code || (statusCode === 500 ? 'INTERNAL_SERVER_ERROR' : 'ERROR');
  const message = statusCode === 500 && config.nodeEnv === 'production' 
    ? 'An unexpected error occurred' 
    : (err.message || 'An error occurred');

  if (statusCode === 500) {
    console.error('[SERVER ERROR]', err);
  }

  res.status(statusCode).json({
    error: {
      code: errorCode,
      message,
    },
  });
}
