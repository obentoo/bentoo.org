import { defineConfig } from 'astro/config';

// Note: @astrojs/sitemap is installed but NOT loaded as integration.
// The sitemap is authored at src/pages/sitemap.xml.ts for hreflang control
// (see tasks.md Task 8.1 GOTCHA).
export default defineConfig({
  site: 'https://bentoo.org',
  integrations: [],
  vite: {
    define: {
      'import.meta.env.PUBLIC_IS_PRODUCTION': JSON.stringify(
        process.env.CF_PAGES_BRANCH === 'main' ||
          process.env.PUBLIC_IS_PRODUCTION === 'true'
      ),
    },
  },
});
