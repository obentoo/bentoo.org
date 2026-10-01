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
      // `astro:content` is an Astro virtual module Vite cannot resolve in tests;
      // the stub lets modules load and `vi.mock('astro:content', ...)` replace it.
      'astro:content': fileURLToPath(new URL('./tests/unit/stubs/astro-content.ts', import.meta.url)),
    },
  },
  test: {
    globals: true,
    passWithNoTests: true,
    server: {
      deps: {
        // Load the notice schema through Node's own import (Node >= 22.18 strips
        // TypeScript types natively) so its instance survives vi.resetModules():
        // feed-identity.test.ts re-imports content.config per case and asserts
        // the collection holds the very noticeSchema it imported. The file must
        // therefore stay loadable by plain Node: no path aliases, and relative
        // imports with explicit extensions.
        external: [/\/src\/content\/noticeSchema\.ts$/],
      },
    },
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
