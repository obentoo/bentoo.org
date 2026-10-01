import { defineConfig } from 'astro/config';

// No sitemap integration: the sitemap is authored at src/pages/sitemap.xml.ts
// for hreflang control.
export default defineConfig({
  site: 'https://obentoo.org',
  // Astro 7 defaults to 'jsx', which strips whitespace between inline elements
  // and changes the variants' rendering; `true` keeps the HTML compression the
  // pages were built with under Astro 6.
  compressHTML: true,
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
