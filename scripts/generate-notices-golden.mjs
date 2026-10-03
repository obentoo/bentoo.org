#!/usr/bin/env node
// Regenerates tests/fixtures/notices.golden.json (story 002, Q13): the JSON Feed
// built from the fixture notices at a fixed build time and origin. bentoolkit
// stories 071/072 test against this file, so it changes only with the contract.
//
// Usage: node scripts/generate-notices-golden.mjs
// Needs Node >= 22.18, which strips TypeScript types natively: the script runs
// the site's own schema and builder, so the golden is exactly what
// /notices.json serves for these notices.
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as yaml from 'js-yaml';
import { noticeSchema } from '../src/content/noticeSchema.ts';
import { buildJsonFeed } from '../src/utils/feed.ts';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const fixtureDir = resolve(root, 'tests/fixtures/notices');
const goldenPath = resolve(root, 'tests/fixtures/notices.golden.json');

const NOW = new Date('2026-10-01T00:00:00Z');
const ORIGIN = 'https://obentoo.org';

const notices = readdirSync(fixtureDir)
  .filter((f) => f.endsWith('.yaml'))
  .sort()
  .map((file) => {
    const raw = yaml.load(readFileSync(resolve(fixtureDir, file), 'utf8'), { schema: yaml.CORE_SCHEMA });
    const parsed = noticeSchema.safeParse(raw);
    if (!parsed.success) {
      throw new Error(`fixture ${file} fails the notice schema`, { cause: parsed.error });
    }
    return parsed.data;
  });

writeFileSync(goldenPath, buildJsonFeed(notices, NOW, ORIGIN));
console.log(JSON.stringify({ event: 'golden_written', path: goldenPath, items: notices.length }));
