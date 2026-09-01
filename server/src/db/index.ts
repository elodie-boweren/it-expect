import pg from 'pg';
import { config } from '../config/index.js';
import { seedDatabase } from './seed.js';

const { Client, Pool } = pg;

let poolInstance: pg.Pool | null = null;

/**
 * Automatically verifies if the target database exists in PostgreSQL.
 * If not, connects to the default administrative database ('postgres') and creates it.
 */
export async function ensureDatabaseExists(customUrl?: string): Promise<void> {
  const targetUrl = customUrl || config.databaseUrl;

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(targetUrl);
  } catch (err) {
    console.warn('[C-137 POSTGRES] Invalid DATABASE_URL format. Skipping automatic database creation check.');
    return;
  }

  // Extract target database name (e.g. '/c137_todo' -> 'c137_todo')
  const dbName = parsedUrl.pathname.replace(/^\//, '');
  if (!dbName || dbName === 'postgres' || dbName === 'template1') {
    return;
  }

  // Validate database name identifier to prevent SQL injection
  if (!/^[a-zA-Z0-9_-]+$/.test(dbName)) {
    console.warn(`[C-137 POSTGRES] Database identifier "${dbName}" contains non-standard characters. Skipping auto-create.`);
    return;
  }

  // Connect to default administrative 'postgres' database
  const adminUrl = new URL(targetUrl);
  adminUrl.pathname = '/postgres';

  const adminClient = new Client({
    connectionString: adminUrl.toString(),
    connectionTimeoutMillis: 5000,
  });

  try {
    await adminClient.connect();

    // Check if target database already exists
    const checkRes = await adminClient.query(
      'SELECT 1 FROM pg_database WHERE datname = $1',
      [dbName]
    );

    if (checkRes.rowCount === 0) {
      console.log(`[C-137 POSTGRES] Database "${dbName}" does not exist. Creating database automatically...`);
      await adminClient.query(`CREATE DATABASE "${dbName}"`);
      console.log(`[C-137 POSTGRES] Database "${dbName}" successfully created.`);
    }
  } catch (err: any) {
    console.warn(`[C-137 POSTGRES] Auto-create database check notice: ${err.message}`);
  } finally {
    try {
      await adminClient.end();
    } catch {
      // Ignore cleanup error
    }
  }
}

export function getPool(customUrl?: string): pg.Pool {
  if (poolInstance && !customUrl) {
    return poolInstance;
  }

  const connectionString = customUrl || config.databaseUrl;

  const pool = new Pool({
    connectionString,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
  });

  pool.on('error', (err) => {
    console.error('[C-137 POSTGRES] Unexpected error on idle client', err);
  });

  if (!customUrl) {
    poolInstance = pool;
  }

  return pool;
}

export async function initSchema(pool: pg.Pool): Promise<void> {
  // 1. Ensure database exists before running queries
  await ensureDatabaseExists();

  const schemaSql = `
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      email VARCHAR(255) UNIQUE NOT NULL,
      name VARCHAR(255) NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE INDEX IF NOT EXISTS idx_users_email ON users(LOWER(email));

    CREATE TABLE IF NOT EXISTS tasks (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      title VARCHAR(255) NOT NULL,
      description TEXT DEFAULT '',
      completed BOOLEAN NOT NULL DEFAULT FALSE,
      priority VARCHAR(50) NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
      category VARCHAR(100) NOT NULL DEFAULT 'general',
      due_date TIMESTAMPTZ DEFAULT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id);
    CREATE INDEX IF NOT EXISTS idx_tasks_completed ON tasks(user_id, completed);
    CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(user_id, priority);
    CREATE INDEX IF NOT EXISTS idx_tasks_category ON tasks(user_id, category);
  `;

  await pool.query(schemaSql);
  console.log('[C-137 POSTGRES] Database schema initialized.');

  // Auto-seed if database is empty
  await seedDatabase(pool);
}

export async function closePool(): Promise<void> {
  if (poolInstance) {
    await poolInstance.end();
    poolInstance = null;
    console.log('[C-137 POSTGRES] Connection pool closed.');
  }
}
