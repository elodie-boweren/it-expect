import { Router, Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import { AuthService } from '../services/authService.js';
import { RegisterSchema, LoginSchema } from '../types/auth.js';
import { createAuthMiddleware } from '../middleware/authMiddleware.js';
import { config } from '../config/index.js';

// Rate limiting for auth endpoints (15 requests per 15 minutes)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: {
      code: 'TOO_MANY_REQUESTS',
      message: 'Too many authentication attempts. Please try again in 15 minutes.',
    },
  },
});

export function createAuthRoutes(authService: AuthService): Router {
  const router = Router();
  const authMiddleware = createAuthMiddleware(authService);

  const cookieOptions = {
    httpOnly: true,
    secure: config.nodeEnv === 'production',
    sameSite: 'lax' as const,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/',
  };

  // POST /api/auth/register
  router.post('/register', authLimiter, async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedInput = RegisterSchema.parse(req.body);
      const { user, token } = await authService.register(validatedInput);

      res.cookie(config.cookieName, token, cookieOptions);
      res.status(201).json({
        user,
        message: 'Account created successfully',
      });
    } catch (error) {
      next(error);
    }
  });

  // POST /api/auth/login
  router.post('/login', authLimiter, async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedInput = LoginSchema.parse(req.body);
      const { user, token } = await authService.login(validatedInput);

      res.cookie(config.cookieName, token, cookieOptions);
      res.status(200).json({
        user,
        message: 'Authenticated successfully',
      });
    } catch (error) {
      next(error);
    }
  });

  // POST /api/auth/logout
  router.post('/logout', (_req: Request, res: Response) => {
    res.clearCookie(config.cookieName, {
      httpOnly: true,
      secure: config.nodeEnv === 'production',
      sameSite: 'lax',
      path: '/',
    });

    res.status(200).json({
      message: 'Logged out successfully',
    });
  });

  // GET /api/auth/me
  router.get('/me', authMiddleware, (req: Request, res: Response) => {
    res.status(200).json({
      user: req.user,
    });
  });

  return router;
}
