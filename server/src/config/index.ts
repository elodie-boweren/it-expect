import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '4000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'c137-quantum-portal-secret-key-32-chars-min-prod',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  cookieName: 'c137_auth_session',
  databaseUrl: process.env.DATABASE_URL || 'postgresql://c137_user:c137_password@localhost:5432/c137_todo',
  clientOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
};
