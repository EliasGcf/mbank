import { viteRequire } from 'vite-require';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [tsconfigPaths(), viteRequire()],
  test: {
    globals: true,
    setupFiles: ['dotenv/config'],
    environmentMatchGlobs: [
      ['test/**', './test/mongo-test-environment.mts'],
      ['./src/**/*.spec.ts', './test/mongo-test-environment.mts'],
    ],
  },
  resolve: { alias: { graphql: 'graphql/index.js' } },
});
