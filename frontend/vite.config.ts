import { loadEnv } from 'vite';
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const apiUrl = env.VITE_API_URL || 'http://localhost:4000';

  return {
    plugins: [react()],
    define: {
      __API_URL__: JSON.stringify(apiUrl),
    },
    test: {
      environment: 'jsdom',
      setupFiles: './test/setup.ts',
      globals: true,
      coverage: {
        provider: 'v8',
        include: ['src/**/*.{ts,tsx}'],
        exclude: ['src/main.tsx'],
      },
    },
  };
});
