import { createApp } from './app.js';
import { config } from './config/index.js';
import { getPool, initSchema, closePool } from './db/index.js';

async function bootstrap() {
  try {
    const pool = getPool();
    await initSchema(pool);

    const app = createApp(pool);

    const server = app.listen(config.port, () => {
      console.log(`[C-137 SERVER] Protocol active on http://localhost:${config.port}`);
      console.log(`[C-137 SERVER] Database: PostgreSQL connected`);
      console.log(`[C-137 SERVER] Environment: ${config.nodeEnv}`);
    });

    // Graceful shutdown
    async function shutdown(signal: string) {
      console.log(`[C-137 SERVER] Received ${signal}. Closing server & database pool...`);
      server.close(async () => {
        await closePool();
        console.log('[C-137 SERVER] Clean shutdown completed.');
        process.exit(0);
      });
    }

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
  } catch (error) {
    console.error('[C-137 SERVER FATAL] Failed to bootstrap server:', error);
    process.exit(1);
  }
}

bootstrap();
