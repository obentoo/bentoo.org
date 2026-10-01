import { defineConfig } from 'astro/config';

// No sitemap integration: the sitemap is authored at src/pages/sitemap.xml.ts
// for hreflang control.
export default defineConfig({
  site: 'https://obentoo.org',
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
