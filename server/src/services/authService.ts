import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pg from 'pg';
import { config } from '../config/index.js';
import { RegisterInput, LoginInput, SafeUser, UserRecord, JWTPayload } from '../types/auth.js';

const BCRYPT_SALT_ROUNDS = process.env.NODE_ENV === 'test' ? 4 : 12;

export class AuthService {
  private pool: pg.Pool;

  constructor(pool: pg.Pool) {
    this.pool = pool;
  }

  async register(input: RegisterInput): Promise<{ user: SafeUser; token: string }> {
    const existingResult = await this.pool.query(
      'SELECT id FROM users WHERE LOWER(email) = LOWER($1)',
      [input.email.trim()]
    );

    if (existingResult.rows.length > 0) {
      const error = new Error('An account with this email address already exists');
      (error as any).statusCode = 409;
      (error as any).code = 'USER_ALREADY_EXISTS';
      throw error;
    }

    const passwordHash = await bcrypt.hash(input.password, BCRYPT_SALT_ROUNDS);

    const insertResult = await this.pool.query(
      `INSERT INTO users (email, name, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, email, name, created_at`,
      [input.email.toLowerCase().trim(), input.name.trim(), passwordHash]
    );

    const row = insertResult.rows[0];
    const safeUser: SafeUser = {
      id: row.id,
      email: row.email,
      name: row.name,
      createdAt: new Date(row.created_at).toISOString(),
    };

    const token = this.generateToken(safeUser);

    return { user: safeUser, token };
  }

  async login(input: LoginInput): Promise<{ user: SafeUser; token: string }> {
    const result = await this.pool.query(
      'SELECT * FROM users WHERE LOWER(email) = LOWER($1)',
      [input.email.toLowerCase().trim()]
    );

    const userRecord = result.rows[0] as UserRecord | undefined;

    if (!userRecord) {
      const error = new Error('Invalid email or password');
      (error as any).statusCode = 401;
      (error as any).code = 'INVALID_CREDENTIALS';
      throw error;
    }

    const passwordValid = await bcrypt.compare(input.password, userRecord.password_hash);
    if (!passwordValid) {
      const error = new Error('Invalid email or password');
      (error as any).statusCode = 401;
      (error as any).code = 'INVALID_CREDENTIALS';
      throw error;
    }

    const safeUser: SafeUser = {
      id: userRecord.id,
      email: userRecord.email,
      name: userRecord.name,
      createdAt: new Date(userRecord.created_at).toISOString(),
    };

    const token = this.generateToken(safeUser);

    return { user: safeUser, token };
  }

  async getUserById(userId: string): Promise<SafeUser | null> {
    const result = await this.pool.query(
      'SELECT id, email, name, created_at FROM users WHERE id = $1',
      [userId]
    );

    const userRecord = result.rows[0];

    if (!userRecord) {
      return null;
    }

    return {
      id: userRecord.id,
      email: userRecord.email,
      name: userRecord.name,
      createdAt: new Date(userRecord.created_at).toISOString(),
    };
  }

  generateToken(user: SafeUser): string {
    const payload: JWTPayload = {
      userId: user.id,
      email: user.email,
    };

    return jwt.sign(payload, config.jwtSecret, {
      expiresIn: config.jwtExpiresIn as any,
    });
  }

  verifyToken(token: string): JWTPayload {
    try {
      const decoded = jwt.verify(token, config.jwtSecret) as JWTPayload;
      return decoded;
    } catch {
      const error = new Error('Invalid or expired authentication session');
      (error as any).statusCode = 401;
      (error as any).code = 'UNAUTHORIZED';
      throw error;
    }
  }
}
