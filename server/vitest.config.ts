import { defineConfig } from 'vitest/config';
import path from 'node:path';

export default defineConfig({
  test: {
    include: [
      '../tests/server/unit/**/*.test.ts',
      '../tests/server/integration/**/*.test.ts',
    ],
    coverage: {
    provider: 'v8',
    reporter: ['text', 'html'],
    include: ['../src/**/*.ts'],
    exclude:['src/**/*.d.ts', 'src/db/seed.ts'],
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});