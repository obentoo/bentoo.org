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

/** True when one paragraph names Dependabot, its config file and the seven-day cooldown. */
const statesDependabotPolicy = (md: string): boolean =>
  paragraphs(md).some((p) => /dependabot/i.test(p) && /dependabot\.yml/.test(p) && /cooldown/i.test(p) && /\b(7|seven)[ -]days?\b/i.test(p));

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
  // Hostile (wrong collapse): Dependabot and the seven-day cooldown in unrelated paragraphs
  // do not state the policy.
  it('Dependabot and the cooldown in separate paragraphs do not count', () => {
    const md = '## Updates\n\nDependabot reads `.github/dependabot.yml`.\n\n## Caching\n\nA seven-day cooldown on the CDN.\n';
    expect(statesDependabotPolicy(md)).toBe(false);
  });

  it('a paragraph that ties Dependabot, its config and the seven-day cooldown counts', () => {
    expect(statesDependabotPolicy('Dependabot (`.github/dependabot.yml`) opens PRs only after a seven-day `cooldown`.')).toBe(true);
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

describe('the update bot and its age rule are documented (R5.2)', () => {
  it.each(['README.md', 'docs/deploy.md'])('%s says Dependabot waits seven days, and where it is configured', (file) => {
    expect(statesDependabotPolicy(read(file))).toBe(true);
  });
});

describe('the docs name only commands that exist (Q9)', () => {
  it.each(['README.md', 'docs/deploy.md'])('every pnpm command in %s is a script or a pnpm built-in', (file) => {
    expect(unknownPnpmCommands(read(file), scripts())).toEqual([]);
  });
});
