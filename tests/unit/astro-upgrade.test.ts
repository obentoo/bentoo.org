// @vitest-environment node
// Story 003, Task 3.2 — Astro 7 with the advisory fixed and today's HTML output (R3.1, R3.3, Q10).
// Runs under Node, not jsdom: importing astro.config.mjs loads esbuild, whose
// TextEncoder/Uint8Array invariant fails across jsdom's realm (see vitest.config.ts).
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import * as yaml from 'js-yaml';

type Raw = Record<string, any>;
type Version = [number, number, number];

const ROOT = process.cwd();
/** GHSA-26w7-cxv4-gfx2 is fixed from astro 7.2.8. */
const ASTRO_FIXED: Version = [7, 2, 8];
/** vitest 5.0.0 (2026-09-03) postdates 4.1.11, the release patched for the vitest / @vitest/mocker advisories. */
const VITEST_FIXED: Version = [5, 0, 0];

const pkg = (): Raw => JSON.parse(readFileSync(path.join(ROOT, 'package.json'), 'utf8')) as Raw;
const lock = (): Raw => yaml.load(readFileSync(path.join(ROOT, 'pnpm-lock.yaml'), 'utf8')) as Raw;

function parseVersion(v: string): Version | null {
  const m = v.match(/^(\d+)\.(\d+)\.(\d+)/);
  return m ? [Number(m[1]), Number(m[2]), Number(m[3])] : null;
}

function cmp(a: Version, b: Version): number {
  for (let i = 0; i < 3; i++) if (a[i] !== b[i]) return a[i] - b[i];
  return 0;
}

/** The lowest version a caret/tilde/exact range admits, e.g. "^7.3.4" -> 7.3.4. */
function rangeFloor(range: string): Version | null {
  const m = range.trim().match(/^(?:\^|~|>=\s*)?(\d+)\.(\d+)\.(\d+)$/);
  return m ? [Number(m[1]), Number(m[2]), Number(m[3])] : null;
}

/** True when every version a range admits is on `major` and at least `fixed`. */
function rangeIsSafe(range: unknown, fixed: Version): boolean {
  if (typeof range !== 'string') return false;
  const floor = rangeFloor(range);
  if (!floor || floor[0] !== fixed[0] || cmp(floor, fixed) < 0) return false;
  return !range.trim().startsWith('>='); // an open upper bound would admit the next major
}

/** Versions of `name` resolved in the lockfile `packages` section. */
function lockedVersions(name: string): string[] {
  return Object.keys(lock().packages ?? {})
    .filter((k) => k.slice(0, k.lastIndexOf('@')) === name)
    .map((k) => k.slice(k.lastIndexOf('@') + 1));
}

const below = (versions: string[], fixed: Version): string[] =>
  versions.filter((v) => {
    const p = parseVersion(v);
    return !p || p[0] !== fixed[0] || cmp(p, fixed) < 0;
  });

describe('the guards themselves reject the wrong shapes', () => {
  // Hostile: "^7.0.0" names the right major yet admits the vulnerable 7.0.0–7.2.7.
  it('a range whose floor is still vulnerable is refused', () => {
    expect(rangeIsSafe('^7.0.0', ASTRO_FIXED)).toBe(false);
    expect(rangeIsSafe('^6.2.2', ASTRO_FIXED)).toBe(false);
    expect(rangeIsSafe('>=7.2.8', ASTRO_FIXED)).toBe(false);
    expect(rangeIsSafe('latest', ASTRO_FIXED)).toBe(false);
  });

  it('a range whose floor is the fix or later, within major 7, is accepted', () => {
    expect(rangeIsSafe('^7.3.4', ASTRO_FIXED)).toBe(true);
    expect(rangeIsSafe('~7.2.8', ASTRO_FIXED)).toBe(true);
    expect(rangeIsSafe('7.3.4', ASTRO_FIXED)).toBe(true);
  });

  // Hostile: a stray second copy of the old major hides behind a patched one.
  it('one vulnerable copy among patched ones is reported', () => {
    expect(below(['7.3.4', '6.2.2'], ASTRO_FIXED)).toEqual(['6.2.2']);
    expect(below(['7.3.4', '7.2.8'], ASTRO_FIXED)).toEqual([]);
  });
});

describe('the build uses an Astro in which GHSA-26w7-cxv4-gfx2 is fixed (R3.1)', () => {
  it('package.json admits only astro 7 releases at or after 7.2.8', () => {
    const range = pkg().dependencies?.astro;
    expect(rangeIsSafe(range, ASTRO_FIXED), `astro range ${JSON.stringify(range)}`).toBe(true);
  });

  it('the lockfile resolves astro, and only patched 7.x copies of it', () => {
    const versions = lockedVersions('astro');
    expect(versions.length).toBeGreaterThan(0);
    expect(below(versions, ASTRO_FIXED)).toEqual([]);
  });

  it('the installed astro is a patched 7.x', () => {
    const installed = JSON.parse(readFileSync(path.join(ROOT, 'node_modules/astro/package.json'), 'utf8')).version as string;
    expect(below([installed], ASTRO_FIXED), `installed astro ${installed}`).toEqual([]);
  });
});

describe('vitest stays on major 5, patched', () => {
  it('package.json admits only vitest 5 releases', () => {
    const range = pkg().devDependencies?.vitest;
    expect(rangeIsSafe(range, VITEST_FIXED), `vitest range ${JSON.stringify(range)}`).toBe(true);
  });

  it('the lockfile resolves only 5.x copies of vitest and its @vitest packages', () => {
    const names = Object.keys(lock().packages ?? {})
      .map((k) => k.slice(0, k.lastIndexOf('@')))
      .filter((n) => n === 'vitest' || n.startsWith('@vitest/'));
    const unique = [...new Set(names)];
    expect(unique).toContain('vitest');
    for (const name of unique) {
      expect(below(lockedVersions(name), VITEST_FIXED), name).toEqual([]);
    }
  });
});

describe('rendering parity: whitespace handling is unchanged (R3.3)', () => {
  // Hostile: Astro 7's default is 'jsx', which strips whitespace between inline elements.
  it('astro.config.mjs sets compressHTML: true', async () => {
    const mod = await import(pathToFileURL(path.join(ROOT, 'astro.config.mjs')).href);
    expect(mod.default.compressHTML).toBe(true);
  });
});

describe('the declared runtime stays supported (Q10)', () => {
  it('engines.node stays >=22.18.0, inside Astro 7\'s >=22.12.0', () => {
    expect(pkg().engines?.node).toBe('>=22.18.0');
  });
});
