// Story 003, Task 1.2 — automated updates respect the seven-day rule and pin Actions (R1.3, R1.4).
// Dependabot replaced Renovate as the only updater; these guards carry the same guarantees.
import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import * as yaml from 'js-yaml';

type Raw = Record<string, any>;

const ROOT = process.cwd();
const DEPENDABOT = path.join(ROOT, '.github/dependabot.yml');
const dependabot = (): Raw => yaml.load(readFileSync(DEPENDABOT, 'utf8')) as Raw;
const pkg = (): Raw => JSON.parse(readFileSync(path.join(ROOT, 'package.json'), 'utf8')) as Raw;
const updates = (config: Raw): Raw[] => (config?.updates ?? []) as Raw[];
const entry = (config: Raw, ecosystem: string): Raw | undefined =>
  updates(config).find((u) => u['package-ecosystem'] === ecosystem && (u.directory ?? '/') === '/');

const COOLDOWN_KEYS = ['default-days', 'semver-major-days', 'semver-minor-days', 'semver-patch-days'] as const;

/** Every cooldown key of every entry must hold seven whole days; a missing default-days is a hole. */
function weakenedCooldowns(config: Raw): string[] {
  const out: string[] = [];
  updates(config).forEach((u, i) => {
    const c: Raw = u.cooldown ?? {};
    const label = `updates[${i}] (${u['package-ecosystem']})`;
    if (!('default-days' in c)) out.push(`${label}.cooldown.default-days missing`);
    for (const k of COOLDOWN_KEYS) {
      if (!(k in c)) continue;
      const v = c[k];
      if (typeof v !== 'number' || !Number.isInteger(v) || v < 7) out.push(`${label}.cooldown.${k} = ${JSON.stringify(v)}`);
    }
    // An include list narrows the cooldown to the named packages; everything else would skip it.
    if (Array.isArray(c.include) && c.include.length > 0 && !c.include.includes('*')) out.push(`${label}.cooldown.include narrows the gate`);
    if (Array.isArray(c.exclude) && c.exclude.length > 0) out.push(`${label}.cooldown.exclude punches a hole`);
  });
  return out;
}

describe('the guards themselves reject the wrong shapes', () => {
  // Hostile: a missing or short cooldown, a string, or a narrowed scope is not seven days for everyone.
  it('a missing, short, non-numeric or narrowed cooldown is reported', () => {
    expect(weakenedCooldowns({ updates: [{ 'package-ecosystem': 'npm' }] })).toHaveLength(1);
    expect(weakenedCooldowns({ updates: [{ 'package-ecosystem': 'npm', cooldown: { 'default-days': 6 } }] })).toHaveLength(1);
    expect(weakenedCooldowns({ updates: [{ 'package-ecosystem': 'npm', cooldown: { 'default-days': '7' } }] })).toHaveLength(1);
    expect(weakenedCooldowns({ updates: [{ 'package-ecosystem': 'npm', cooldown: { 'default-days': 7, 'semver-patch-days': 1 } }] })).toHaveLength(1);
    expect(weakenedCooldowns({ updates: [{ 'package-ecosystem': 'npm', cooldown: { 'default-days': 7, include: ['astro'] } }] })).toHaveLength(1);
    expect(weakenedCooldowns({ updates: [{ 'package-ecosystem': 'npm', cooldown: { 'default-days': 7, exclude: ['wrangler'] } }] })).toHaveLength(1);
  });

  // Hostile (converse): seven days or more, on every key, passes.
  it('seven days or more on every key is accepted', () => {
    expect(weakenedCooldowns({ updates: [{ 'package-ecosystem': 'npm', cooldown: { 'default-days': 7, 'semver-major-days': 30 } }] })).toEqual([]);
  });
});

describe('.github/dependabot.yml withholds young releases (R1.3)', () => {
  it('exists and is valid YAML, schema version 2', () => {
    expect(existsSync(DEPENDABOT), '.github/dependabot.yml').toBe(true);
    expect(dependabot().version).toBe(2);
  });

  it('covers npm (pnpm) and GitHub Actions at the repository root', () => {
    expect(entry(dependabot(), 'npm'), 'npm entry for /').toBeDefined();
    expect(entry(dependabot(), 'github-actions'), 'github-actions entry for /').toBeDefined();
  });

  it('every entry waits at least seven days, on every update type', () => {
    expect(weakenedCooldowns(dependabot())).toEqual([]);
  });

  // Exact pins stay exact only under `increase`; `widen` or `increase-if-necessary` would
  // turn a pinned devDependency into a range or leave it behind.
  it('keeps devDependencies pinned', () => {
    expect(entry(dependabot(), 'npm')?.['versioning-strategy']).toBe('increase');
    const ranged = Object.entries((pkg().devDependencies ?? {}) as Record<string, string>).filter(([, v]) => !/^\d+\.\d+\.\d+$/.test(v));
    expect(ranged, 'devDependencies with a range instead of an exact version').toEqual([]);
  });

  it('keeps TypeScript below 7 until @astrojs/check supports it', () => {
    const ignore: Raw[] = entry(dependabot(), 'npm')?.ignore ?? [];
    expect(ignore.some((r) => r['dependency-name'] === 'typescript' && (r.versions ?? []).includes('>=7'))).toBe(true);
  });
});

describe('Dependabot PRs are merged by a human (no automerge, no CI bypass)', () => {
  const workflows = (): [string, string][] => {
    const dir = path.join(ROOT, '.github/workflows');
    return readdirSync(dir).filter((f) => /\.ya?ml$/.test(f)).map((f) => [f, readFileSync(path.join(dir, f), 'utf8')]);
  };

  // Hostile: a merge made with GITHUB_TOKEN skips deploy.yml's push trigger, and an
  // automerge step is how a major would land without review.
  it('no workflow merges pull requests or enables auto-merge', () => {
    const merging = workflows().filter(([, src]) => /\bgh\s+pr\s+merge\b|enablePullRequestAutoMerge|merge-method|fetch-metadata/.test(src));
    expect(merging.map(([f]) => f)).toEqual([]);
  });
});

describe('no second updater bypasses the gate (R1.3)', () => {
  // Hostile: a leftover Renovate config would revive a second updater with its own rules.
  it('no Renovate configuration remains', () => {
    expect('renovate' in pkg()).toBe(false);
    for (const f of ['renovate.json', 'renovate.json5', '.github/renovate.json', '.github/renovate.json5', '.gitlab/renovate.json', '.renovaterc', '.renovaterc.json', '.renovaterc.json5']) {
      expect(existsSync(path.join(ROOT, f)), f).toBe(false);
    }
  });

  // Hostile: Dependabot reads one file; a second spelling is silent drift.
  it('.github/dependabot.yml is the only Dependabot configuration', () => {
    expect(existsSync(path.join(ROOT, '.github/dependabot.yaml'))).toBe(false);
  });
});
