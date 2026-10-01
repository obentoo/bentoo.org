// Content collections (story 002, R2): one YAML file per notice under
// src/content/notices/, read by the project's own loader and validated
// against noticeSchema.
import { existsSync, statSync } from 'node:fs';
import { defineCollection } from 'astro:content';
import { noticeSchema } from './content/noticeSchema';
import { noticesLoader } from './content/noticesLoader';

const DEFAULT_NOTICES_DIR = './src/content/notices';

/**
 * The directory the notices are loaded from. `NOTICES_DIR` redirects it (the
 * integration build points it at tests/fixtures/notices) only outside a
 * production build: published ids are permanent, so a fixture id must never
 * reach production. An empty `NOTICES_DIR` counts as unset.
 *
 * The one exception is `NOTICES_INTEGRATION_BUILD=true`, set only by the
 * Playwright webServer: its build is production-shaped (the SEO specs assert
 * production robots tags) yet must load the fixtures. It is a second, explicit
 * key: the deploy workflow sets neither it nor `NOTICES_DIR`.
 */
export function noticesDir(): string {
  const override = process.env.NOTICES_DIR;
  if (!override) return DEFAULT_NOTICES_DIR;
  // Same production test as astro.config.mjs: an explicit flag, or a
  // Cloudflare Pages build of main.
  const production = process.env.PUBLIC_IS_PRODUCTION === 'true' || process.env.CF_PAGES_BRANCH === 'main';
  if (production && process.env.NOTICES_INTEGRATION_BUILD !== 'true') return DEFAULT_NOTICES_DIR;
  if (!existsSync(override) || !statSync(override).isDirectory()) {
    throw new Error(`NOTICES_DIR does not exist: ${override}`);
  }
  return override;
}

/**
 * The collection id is the file name verbatim: Astro's default generator
 * slugifies it (github-slugger drops "+"), which would merge
 * 2026-10-02-gtk+-fix into 2026-10-02-gtk-fix.
 */
const noticesYaml = noticesLoader({
  pattern: '*.yaml',
  base: noticesDir(),
  generateId: ({ entry }) => entry.replace(/\.yaml$/, ''),
});

const notices = defineCollection({
  loader: noticesYaml,
  schema: noticeSchema,
});

export const collections = { notices };
