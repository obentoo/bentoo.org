// Story 003, Task 2.1 — no declared dependency that nothing uses (R2.3).
import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';

type Raw = Record<string, any>;

const ROOT = process.cwd();
// @testing-library/dom: scaffold leftover, found by the story-003 audit (validation fix round 1).
const REMOVED = ['@lhci/cli', '@astrojs/sitemap', '@testing-library/dom'] as const;
const THIS_FILE = 'tests/unit/unused-deps.test.ts';
const SCANNED_DIRS = ['src', 'scripts', 'tests', '.github'];
const SCANNED_EXT = /\.(ts|mts|cts|mjs|cjs|js|json|jsonc|ya?ml|astro)$/;
const SKIP_DIRS = new Set(['node_modules', 'dist', '.git', '__snapshots__']);

const pkg = (): Raw => JSON.parse(readFileSync(path.join(ROOT, 'package.json'), 'utf8')) as Raw;
const lock = (): Raw => yaml.load(readFileSync(path.join(ROOT, 'pnpm-lock.yaml'), 'utf8')) as Raw;

/** Package name of a lockfile `packages` key such as `'@lhci/cli@0.15.1'` or `undici@7.29.0`. */
const lockName = (key: string): string => key.slice(0, key.lastIndexOf('@'));

/** A reference is the package name, or the `lhci` CLI being invoked. */
const REFERENCE = /@lhci\/cli|@astrojs\/sitemap|\blhci\s/;

/** Drop JS comments, for lighthouserc.cjs whose comments may name the hosted LHCI. */
const withoutJsComments = (src: string): string => src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1');

/** Files that name a removed package. Comments count everywhere except in lighthouserc.cjs. */
function referencesIn(files: { rel: string; text: string }[]): string[] {
  return files
    .filter(({ rel }) => rel !== THIS_FILE)
    .filter(({ rel, text }) => REFERENCE.test(rel === 'lighthouserc.cjs' ? withoutJsComments(text) : text))
    .map(({ rel }) => rel);
}

function walk(dir: string): string[] {
  const out: string[] = [];
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir)) {
    if (SKIP_DIRS.has(entry)) continue;
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...walk(full));
    else if (SCANNED_EXT.test(entry)) out.push(full);
  }
  return out;
}

function projectFiles(): { rel: string; text: string }[] {
  const rootFiles = readdirSync(ROOT)
    .filter((f) => SCANNED_EXT.test(f) && f !== 'pnpm-lock.yaml' && statSync(path.join(ROOT, f)).isFile())
    .map((f) => path.join(ROOT, f));
  const nested = SCANNED_DIRS.flatMap((d) => walk(path.join(ROOT, d)));
  return [...rootFiles, ...nested].map((full) => ({
    rel: path.relative(ROOT, full).split(path.sep).join('/'),
    text: readFileSync(full, 'utf8'),
  }));
}

describe('the guard itself tells a reference from a remark', () => {
  // Hostile: removed from package.json but still imported — the build would break.
  it('an import of a removed package is a reference', () => {
    const files = [{ rel: 'astro.config.mjs', text: "import sitemap from '@astrojs/sitemap';\n" }];
    expect(referencesIn(files)).toEqual(['astro.config.mjs']);
  });

  it('a script that runs the lhci CLI is a reference', () => {
    const files = [{ rel: '.github/workflows/ci.yml', text: 'run: pnpm exec lhci autorun\n' }];
    expect(referencesIn(files)).toEqual(['.github/workflows/ci.yml']);
  });

  // Converse: a comment in lighthouserc.cjs about the hosted LHCI is not a dependency.
  it('a comment in lighthouserc.cjs is not a reference, its code is', () => {
    expect(referencesIn([{ rel: 'lighthouserc.cjs', text: '// read by treosh/lighthouse-ci-action, not @lhci/cli\nmodule.exports = {};\n' }])).toEqual([]);
    expect(referencesIn([{ rel: 'lighthouserc.cjs', text: "require('@lhci/cli');\n" }])).toEqual(['lighthouserc.cjs']);
  });

  it('a file that never names them is clean', () => {
    expect(referencesIn([{ rel: 'src/pages/sitemap.xml.ts', text: 'export const GET = () => new Response("");\n' }])).toEqual([]);
  });
});

describe('the removed packages are gone from the manifest and the lockfile (R2.3)', () => {
  it.each(REMOVED)('package.json declares no %s', (name) => {
    const p = pkg();
    for (const field of ['dependencies', 'devDependencies', 'optionalDependencies', 'peerDependencies']) {
      expect(Object.keys(p[field] ?? {}), field).not.toContain(name);
    }
  });

  it.each(REMOVED)('the lockfile importer declares no %s', (name) => {
    const importer: Raw = lock().importers?.['.'] ?? {};
    for (const field of ['dependencies', 'devDependencies', 'optionalDependencies']) {
      expect(Object.keys(importer[field] ?? {}), field).not.toContain(name);
    }
  });

  it.each(REMOVED)('the lockfile resolves no %s package at all', (name) => {
    const keys = Object.keys(lock().packages ?? {});
    expect(keys.filter((k) => lockName(k) === name)).toEqual([]);
  });
});

describe('nothing in the project still needs them (R2.3)', () => {
  it('no source, script, test, workflow or root config names them', () => {
    expect(referencesIn(projectFiles())).toEqual([]);
  });
});
