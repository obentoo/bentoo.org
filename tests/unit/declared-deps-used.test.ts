// Story 003, validation fix round 1 — R2.3: every declared dependency has a
// consumer. A package is used when the project imports it, runs one of its
// binaries from a package.json script or a workflow step, or names it in a
// test-runner config; `@types/<x>` is used when `<x>` is.
import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';

type Source = { rel: string; text: string };

const ROOT = process.cwd();
const pkg = JSON.parse(readFileSync(path.join(ROOT, 'package.json'), 'utf8'));
const DECLARED: string[] = [...Object.keys(pkg.dependencies ?? {}), ...Object.keys(pkg.devDependencies ?? {})];

const SOURCE_DIRS = ['src', 'tests', 'scripts'];
const ROOT_CONFIGS = ['astro.config.mjs', 'vitest.config.ts', 'playwright.config.ts', 'lighthouserc.cjs', 'tsconfig.json'];
const CODE = /\.(ts|mts|cts|js|mjs|cjs|astro|json)$/;

function walk(dir: string): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).flatMap((e) => {
    const full = path.join(dir, e);
    if (e === 'node_modules' || e === 'dist') return [];
    return statSync(full).isDirectory() ? walk(full) : CODE.test(e) ? [full] : [];
  });
}

function projectSources(): Source[] {
  const files = [...SOURCE_DIRS.flatMap((d) => walk(path.join(ROOT, d))), ...ROOT_CONFIGS.map((f) => path.join(ROOT, f))];
  return files.filter(existsSync).map((f) => ({ rel: path.relative(ROOT, f), text: readFileSync(f, 'utf8') }));
}

function commandLines(): string[] {
  const scripts = Object.values(pkg.scripts ?? {}) as string[];
  const wfDir = path.join(ROOT, '.github', 'workflows');
  const workflows = existsSync(wfDir)
    ? readdirSync(wfDir).map((f) => readFileSync(path.join(wfDir, f), 'utf8').split('\n').filter((l) => /^\s*(-\s*)?run:/.test(l)))
    : [];
  return [...scripts, ...workflows.flat()];
}

/** Binaries a package installs, read from its own package.json. */
function binsOf(name: string): string[] {
  const manifest = path.join(ROOT, 'node_modules', name, 'package.json');
  if (!existsSync(manifest)) return [];
  const { bin } = JSON.parse(readFileSync(manifest, 'utf8'));
  if (!bin) return [];
  return typeof bin === 'string' ? [name.replace(/^@[^/]+\//, '')] : Object.keys(bin);
}

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

function imported(name: string, sources: Source[]): boolean {
  const re = new RegExp(`(?:from\\s*|import\\s*\\(\\s*|require\\s*\\(\\s*|import\\s+)['"]${escape(name)}(?:/[^'"]*)?['"]`);
  return sources.some((s) => re.test(s.text));
}

function runAsBinary(bins: string[], lines: string[]): boolean {
  return bins.some((b) => lines.some((l) => new RegExp(`(?:^|[\\s;&|(])(?:pnpm\\s+exec\\s+|npx\\s+)?${escape(b)}(?:\\s|$)`).test(l)));
}

/** Names a test-runner config refers to by string rather than import (e.g. vitest's `environment: 'jsdom'`). */
function namedInConfig(name: string, sources: Source[]): boolean {
  const re = new RegExp(`(?:environment|@vitest-environment)\\s*:?\\s*['"]?${escape(name)}\\b`);
  return sources.some((s) => re.test(s.text));
}

/** `astro check` is provided by @astrojs/check. */
const SUBCOMMANDS: Record<string, RegExp> = { '@astrojs/check': /\bastro\s+check\b/ };

function consumers(name: string, sources: Source[], lines: string[], bins: (n: string) => string[]): boolean {
  if (name.startsWith('@types/')) {
    const target = name.slice('@types/'.length).replace(/^(.+)__(.+)$/, '@$1/$2');
    return consumers(target, sources, lines, bins);
  }
  if (imported(name, sources)) return true;
  if (runAsBinary(bins(name), lines)) return true;
  if (namedInConfig(name, sources)) return true;
  const sub = SUBCOMMANDS[name];
  return sub ? lines.some((l) => sub.test(l)) : false;
}

describe('the consumer detector itself', () => {
  const noBins = () => [] as string[];
  // Hostile: a declared package nobody touches must be reported.
  it('a package with no import, binary or config reference has no consumer', () => {
    const src = [{ rel: 'src/a.ts', text: "import x from 'other';\n" }];
    expect(consumers('left-pad', src, ['vitest run'], noBins)).toBe(false);
  });
  it('a mention in a comment or a longer name is not a consumer', () => {
    const src = [{ rel: 'src/a.ts', text: "// left-pad was removed\nimport y from 'left-pad-extra';\n" }];
    expect(consumers('left-pad', src, [], noBins)).toBe(false);
  });
  // Converse: each real way of using a package counts.
  it('an import, a subpath import, a require or a dynamic import counts', () => {
    for (const text of ["import a from 'pkg';", "import { b } from 'pkg/sub';", "const c = require('pkg');", "await import('pkg')", "import 'pkg';"]) {
      expect(consumers('pkg', [{ rel: 'x.ts', text }], [], noBins), text).toBe(true);
    }
  });
  it('a binary run by a script or a workflow step counts', () => {
    expect(consumers('tool', [], ['pnpm exec mytool deploy'], () => ['mytool'])).toBe(true);
    expect(consumers('tool', [], ['astro build && mytool'], () => ['mytool'])).toBe(true);
    expect(consumers('tool', [], ['notmytool run'], () => ['mytool'])).toBe(false);
  });
  it('a vitest environment and a @types package of a used package count', () => {
    expect(consumers('jsdom', [{ rel: 'vitest.config.ts', text: "environment: 'jsdom'," }], [], noBins)).toBe(true);
    expect(consumers('@types/js-yaml', [{ rel: 'x.ts', text: "import yaml from 'js-yaml';" }], [], noBins)).toBe(true);
    expect(consumers('@types/js-yaml', [], [], noBins)).toBe(false);
  });
});

describe('every declared dependency has a consumer (R2.3)', () => {
  const sources = projectSources();
  const lines = commandLines();
  it.each(DECLARED)('%s is imported, run or configured', (name) => {
    expect(consumers(name, sources, lines, binsOf)).toBe(true);
  });
});
