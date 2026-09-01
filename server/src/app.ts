import express, { Express, Request, Response } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import pg from 'pg';
import { config } from './config/index.js';
import { getPool } from './db/index.js';
import { AuthService } from './services/authService.js';
import { TaskService } from './services/taskService.js';
import { createAuthRoutes } from './routes/authRoutes.js';
import { createTaskRoutes } from './routes/taskRoutes.js';
import { errorHandler } from './middleware/errorMiddleware.js';

export function createApp(customPool?: pg.Pool): Express {
  const app = express();
  const pool = customPool || getPool();

  const authService = new AuthService(pool);
  const taskService = new TaskService(pool);

  // Security Headers
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", 'data:'],
          connectSrc: ["'self'"],
        },
      },
      crossOriginEmbedderPolicy: false,
    })
  );

  // CORS Configuration
  app.use(
    cors({
      origin: config.clientOrigin,
      credentials: true,
      methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  );

  // Parsers with size restrictions
  app.use(express.json({ limit: '512kb' }));
  app.use(express.urlencoded({ extended: true, limit: '512kb' }));
  app.use(cookieParser());

  // Health Check Endpoint
  app.get('/api/health', (_req: Request, res: Response) => {
    res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    });
  });

  // API Routes
  app.use('/api/auth', createAuthRoutes(authService));
  app.use('/api/tasks', createTaskRoutes(taskService, authService));

  // 404 Route Handler
  app.use('*', (_req: Request, res: Response) => {
    res.status(404).json({
      error: {
        code: 'NOT_FOUND',
        message: 'The requested resource was not found',
      },
    });
  });

  // Global Error Handler
  app.use(errorHandler);

  return app;
}
