// Story 003, Task 6.1 — the policy is documented where the maintainer looks (R5.1, R5.2, Q9).
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const read = (rel: string): string => readFileSync(path.join(ROOT, rel), 'utf8');
const scripts = (): string[] => Object.keys(JSON.parse(read('package.json')).scripts ?? {});

/** pnpm commands that are pnpm's own, not package.json scripts. */
const PNPM_BUILTINS = new Set([
  'add', 'approve-builds', 'audit', 'config', 'dedupe', 'dlx', 'env', 'exec', 'i', 'install',
  'licenses', 'list', 'ls', 'outdated', 'prune', 'rebuild', 'remove', 'rm', 'setup', 'store',
  'up', 'update', 'view', 'why',
]);

/** Paragraphs of a markdown document (blank-line separated; headings start a new one). */
const paragraphs = (md: string): string[] => md.split(/\n\s*\n|\n(?=#)/).map((p) => p.trim()).filter(Boolean);

/** True when one paragraph says Renovate needs its GitHub App installed. */
const statesRenovateActivation = (md: string): boolean =>
  paragraphs(md).some((p) => /renovate/i.test(p) && /github app/i.test(p) && /install/i.test(p));

/** Code in a markdown document: fenced blocks and inline spans. */
function codeIn(md: string): string[] {
  const fenced = [...md.matchAll(/^```[^\n]*\n([\s\S]*?)^```/gm)].map((m) => m[1]);
  const prose = md.replace(/^```[^\n]*\n[\s\S]*?^```/gm, '');
  const inline = [...prose.matchAll(/`([^`\n]+)`/g)].map((m) => m[1]);
  return [...fenced, ...inline];
}

/** `pnpm <name>` commands in the document's code that name neither a script nor a built-in. */
function unknownPnpmCommands(md: string, known: string[]): string[] {
  const out: string[] = [];
  for (const code of codeIn(md)) {
    for (const m of code.matchAll(/\bpnpm\s+(?:run\s+)?([a-z][\w:-]*)/g)) {
      const name = m[1];
      if (!PNPM_BUILTINS.has(name) && !known.includes(name)) out.push(name);
    }
  }
  return out;
}

describe('the guards themselves tell a statement from a near miss', () => {
  // Hostile (wrong collapse): Renovate and "GitHub App" in unrelated paragraphs are not
  // the activation step.
  it('Renovate and the GitHub App in separate paragraphs do not count', () => {
    const md = '## Updates\n\nRenovate opens update PRs.\n\n## Secrets\n\nInstall the Cloudflare GitHub App.\n';
    expect(statesRenovateActivation(md)).toBe(false);
  });

  it('a paragraph that ties the App installation to Renovate counts', () => {
    expect(statesRenovateActivation('Renovate takes effect only once its GitHub App is installed on the repository.')).toBe(true);
  });

  it('a pnpm command that is neither a script nor a built-in is reported, in a fence or inline', () => {
    const md = 'Run `pnpm check:deps`.\n\n```sh\npnpm run audit:all\npnpm test:unit\npnpm install --frozen-lockfile\n```\n';
    expect(unknownPnpmCommands(md, ['test:unit']).sort()).toEqual(['audit:all', 'check:deps']);
  });

  it('prose that merely mentions pnpm is not a command', () => {
    expect(unknownPnpmCommands('pnpm is pinned in `packageManager`; use pnpm (version 10).', [])).toEqual([]);
  });
});

describe('docs/deploy.md documents the release-age policy (R5.1)', () => {
  it('states the seven-day minimum release age and its pnpm setting in minutes', () => {
    const md = read('docs/deploy.md');
    expect(md).toContain('minimumReleaseAge');
    expect(md).toContain('10080');
    expect(md).toMatch(/\b(7|seven)[ -]days?\b/i);
  });

  it('states the overrides rule: narrow overrides, each naming its GHSA ids', () => {
    const md = read('docs/deploy.md');
    expect(md).toMatch(/\boverrides\b/);
    expect(md).toMatch(/GHSA/);
  });

  it('states how an exception is recorded and expires, for osv-scanner and trivy', () => {
    const md = read('docs/deploy.md');
    expect(md).toContain('osv-scanner.toml');
    expect(md).toContain('ignoreUntil');
    expect(md).toContain('.trivyignore.yaml');
    expect(md).toContain('expired_at');
  });
});

describe('Renovate activation is documented (R5.2)', () => {
  it.each(['README.md', 'docs/deploy.md'])('%s says Renovate needs its GitHub App installed', (file) => {
    expect(statesRenovateActivation(read(file))).toBe(true);
  });
});

describe('the docs name only commands that exist (Q9)', () => {
  it.each(['README.md', 'docs/deploy.md'])('every pnpm command in %s is a script or a pnpm built-in', (file) => {
    expect(unknownPnpmCommands(read(file), scripts())).toEqual([]);
  });
});
