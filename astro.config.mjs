import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://bentoo.org',
  integrations: [
    sitemap({
      filter: (page) => /^https:\/\/bentoo\.org\/(pt\/)?$/.test(page),
    }),
  ],
  vite: {
    define: {
      'import.meta.env.PUBLIC_IS_PRODUCTION': JSON.stringify(
        process.env.CF_PAGES_BRANCH === 'main'
      ),
    },
  },
});
