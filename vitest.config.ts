import { configDefaults, defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';

// Unit tests that import Node-only tooling (astro.config.mjs pulls in esbuild via
// `astro/config`) run in the `node` environment: under jsdom, esbuild's
// `TextEncoder ... instanceof Uint8Array` invariant fails across realms.
const NODE_ENV_TESTS = ['tests/unit/siteOrigin.test.ts'];

export default defineConfig({
  resolve: {
    alias: {
      '~': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    globals: true,
    passWithNoTests: true,
    // include/exclude/environment live only in the projects: with `extends: true`
    // some array options are concatenated with the root rather than replaced.
    projects: [
      {
        extends: true,
        test: {
          name: 'jsdom',
          environment: 'jsdom',
          include: ['tests/unit/**/*.test.ts'],
          exclude: [...configDefaults.exclude, ...NODE_ENV_TESTS],
        },
      },
      {
        extends: true,
        test: {
          name: 'node',
          environment: 'node',
          include: NODE_ENV_TESTS,
        },
      },
    ],
  },
});
