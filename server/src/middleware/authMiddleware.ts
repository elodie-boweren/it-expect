import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/authService.js';
import { getPool } from '../db/index.js';
import { config } from '../config/index.js';
import { SafeUser } from '../types/auth.js';

declare global {
  namespace Express {
    interface Request {
      user?: SafeUser;
    }
  }
}

export function createAuthMiddleware(authService?: AuthService) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const service = authService || new AuthService(getPool());

    // Check cookie first, then fallback to Authorization header
    let token = req.cookies?.[config.cookieName];

    if (!token && req.headers.authorization) {
      const parts = req.headers.authorization.split(' ');
      if (parts.length === 2 && parts[0] === 'Bearer') {
        token = parts[1];
      }
    }

    if (!token) {
      res.status(401).json({
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required to access this resource',
        },
      });
      return;
    }

    try {
      const payload = service.verifyToken(token);
      const user = await service.getUserById(payload.userId);

      if (!user) {
        res.status(401).json({
          error: {
            code: 'UNAUTHORIZED',
            message: 'User associated with session not found',
          },
        });
        return;
      }

      req.user = user;
      next();
    } catch {
      res.status(401).json({
        error: {
          code: 'UNAUTHORIZED',
          message: 'Invalid or expired authentication session',
        },
      });
    }
  };
}
