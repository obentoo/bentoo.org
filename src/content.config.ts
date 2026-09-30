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
 */
export function noticesDir(): string {
  const override = process.env.NOTICES_DIR;
  if (process.env.PUBLIC_IS_PRODUCTION === 'true' || !override) return DEFAULT_NOTICES_DIR;
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
