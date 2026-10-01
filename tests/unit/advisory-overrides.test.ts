// Story 003, Task 4.1 — narrow, justified overrides and dated exceptions (R2.1, R2.2, R2.4, R2.5).
import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';

type Raw = Record<string, any>;
type Version = [number, number, number];

const ROOT = process.cwd();
const WORKSPACE = path.join(ROOT, 'pnpm-workspace.yaml');
const OSV = path.join(ROOT, 'osv-scanner.toml');
const TRIVY_YAML = path.join(ROOT, '.trivyignore.yaml');
const TRIVY_PLAIN = path.join(ROOT, '.trivyignore');
const GHSA = /GHSA-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{4}/;
/** miniflare pinned undici 7.29.0 exactly; 7.29.1 is the first patched 7.x old enough. */
const UNDICI_PATCHED: Version = [7, 29, 1];

const workspaceText = (): string => readFileSync(WORKSPACE, 'utf8');
const overrides = (): Raw => ((yaml.load(workspaceText()) as Raw)?.overrides ?? {}) as Raw;
const lock = (): Raw => yaml.load(readFileSync(path.join(ROOT, 'pnpm-lock.yaml'), 'utf8')) as Raw;

// ---------------------------------------------------------------- versions

function parseVersion(v: string): Version | null {
  const m = v.match(/^(\d+)\.(\d+)\.(\d+)/);
  return m ? [Number(m[1]), Number(m[2]), Number(m[3])] : null;
}
function cmp(a: Version, b: Version): number {
  for (let i = 0; i < 3; i++) if (a[i] !== b[i]) return a[i] - b[i];
  return 0;
}
const lockName = (key: string): string => key.slice(0, key.lastIndexOf('@'));
const lockVersion = (key: string): string => key.slice(key.lastIndexOf('@') + 1);

// ---------------------------------------------------------------- override comments

const stripComment = (line: string): string => line.replace(/(^|\s)#.*$/, '');
const inlineComment = (line: string): string => line.match(/(?:^|\s)#(.*)$/)?.[1].trim() ?? '';

/**
 * Map each entry of the top-level `overrides` block to its own comment: the contiguous
 * comment lines directly above it plus its trailing comment. A blank line or another
 * entry breaks adjacency, so one comment never covers two overrides.
 */
function overrideComments(text: string): Map<string, string> {
  const lines = text.split(/\r?\n/);
  const start = lines.findIndex((l) => /^overrides\s*:/.test(l));
  const out = new Map<string, string>();
  if (start < 0) return out;
  let pending: string[] = [];
  let indent = -1;
  for (const line of lines.slice(start + 1)) {
    const t = line.trim();
    if (t === '') { pending = []; continue; }
    if (t.startsWith('#')) { pending.push(t.slice(1).trim()); continue; }
    const lead = line.length - line.trimStart().length;
    if (lead === 0) break;
    if (indent < 0) indent = lead;
    if (lead > indent) { pending = []; continue; }
    const key = Object.keys((yaml.load(stripComment(t)) ?? {}) as Raw)[0];
    out.set(key, [...pending, inlineComment(t)].filter(Boolean).join(' '));
    pending = [];
  }
  return out;
}

/** Overrides whose own comment names no GHSA id. */
function unjustified(text: string): string[] {
  const parsed = ((yaml.load(text) as Raw)?.overrides ?? {}) as Raw;
  const comments = overrideComments(text);
  return Object.keys(parsed).filter((k) => !GHSA.test(comments.get(k) ?? ''));
}

// ---------------------------------------------------------------- override shape

/** pnpm's `parent>child` separator: a `>` followed by a package name, never the `>` of `>=`. */
const PARENT_SEP = />(?=[@a-z])/i;
const targetOf = (key: string): string => key.split(PARENT_SEP).pop() ?? key;
const isParentScoped = (key: string): boolean => PARENT_SEP.test(key);

/** The major an override selector is confined to, e.g. "undici@7" -> 7; null when unscoped. */
function selectorMajor(key: string): number | null {
  const target = targetOf(key);
  const at = target.lastIndexOf('@');
  if (at <= 0) return null; // no selector (a leading "@" is the scope)
  const sel = target.slice(at + 1).trim();
  const single = sel.match(/^[\^~]?(\d+)(?:\.(?:\d+|x|\*)){0,2}$/);
  if (single) return Number(single[1]);
  const bounded = sel.match(/^>=\s*(\d+)\.\d+\.\d+\s+<\s*(\d+)\.(\d+)\.(\d+)$/);
  if (bounded) {
    const [lo, hiMajor, hiMinor, hiPatch] = bounded.slice(1).map(Number);
    if (hiMajor === lo || (hiMajor === lo + 1 && hiMinor === 0 && hiPatch === 0)) return lo;
  }
  return null;
}

/** Problem with one override, or null: scoped to one major and pinned to an exact release of it. */
function overrideProblem(key: string, value: unknown): string | null {
  const major = selectorMajor(key);
  if (major === null) return `${key}: not scoped to the vulnerable major`;
  if (typeof value !== 'string' || !/^\d+\.\d+\.\d+$/.test(value)) return `${key}: ${JSON.stringify(value)} is not an exact release`;
  if (parseVersion(value)![0] !== major) return `${key}: ${value} leaves major ${major}`;
  return null;
}

// ---------------------------------------------------------------- exceptions

const isDate = (v: unknown): boolean => {
  if (v instanceof Date) return !Number.isNaN(v.getTime());
  if (typeof v !== 'string') return false;
  const m = v.match(/^(\d{4})-(\d{2})-(\d{2})(?:[T ][\d:.]+(?:Z|[+-]\d{2}:?\d{2})?)?$/);
  if (!m) return false;
  const d = new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3])));
  return d.getUTCFullYear() === Number(m[1]) && d.getUTCMonth() === Number(m[2]) - 1 && d.getUTCDate() === Number(m[3]);
};
const nonEmpty = (v: unknown): boolean => typeof v === 'string' && v.trim().length > 0;
const ADVISORY_ID = /^[A-Z][A-Za-z0-9]*-[A-Za-z0-9-]+$/;

/** Minimal reader for osv-scanner.toml: array-of-tables with `key = value` scalars. */
function tomlTables(text: string): { table: string; fields: Record<string, string> }[] {
  const out: { table: string; fields: Record<string, string> }[] = [];
  let current: { table: string; fields: Record<string, string> } | null = null;
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    const header = line.match(/^\[\[?\s*([^\]]+?)\s*\]\]?$/);
    if (header) { current = { table: header[1], fields: {} }; out.push(current); continue; }
    const kv = line.match(/^([A-Za-z0-9_.-]+)\s*=\s*(.*)$/);
    if (!kv || !current) continue;
    let value = kv[2].trim();
    const quoted = value.match(/^"((?:[^"\\]|\\.)*)"|^'([^']*)'/);
    value = quoted ? (quoted[1] ?? quoted[2]) : value.replace(/\s+#.*$/, '').trim();
    current.fields[kv[1]] = value;
  }
  return out;
}

/** Every osv-scanner exception must expire and say why. */
function osvProblems(text: string): string[] {
  const problems: string[] = [];
  for (const { table, fields } of tomlTables(text)) {
    if (table === 'IgnoredVulns') {
      const id = fields.id ?? '(no id)';
      if (!ADVISORY_ID.test(fields.id ?? '')) problems.push(`${id}: id is not an advisory id`);
      if (!isDate(fields.ignoreUntil)) problems.push(`${id}: ignoreUntil is not a date`);
      if (!nonEmpty(fields.reason)) problems.push(`${id}: no reason`);
    } else if (table === 'PackageOverrides') {
      const name = fields.name ?? '(no name)';
      if (!isDate(fields.effectiveUntil)) problems.push(`${name}: PackageOverrides without effectiveUntil`);
      if (!nonEmpty(fields.reason)) problems.push(`${name}: PackageOverrides without reason`);
    }
  }
  return problems;
}

/** Every trivy exception must expire and say why. */
function trivyProblems(doc: Raw): string[] {
  const problems: string[] = [];
  for (const kind of ['vulnerabilities', 'misconfigurations', 'secrets', 'licenses']) {
    for (const entry of (doc?.[kind] ?? []) as Raw[]) {
      const id = String(entry.id ?? '(no id)');
      if (!nonEmpty(entry.id)) problems.push(`${kind}: entry without id`);
      if (!isDate(entry.expired_at)) problems.push(`${id}: expired_at is not a date`);
      if (!nonEmpty(entry.statement)) problems.push(`${id}: no statement`);
    }
  }
  return problems;
}

// ================================================================ guard self-checks

describe('the guards themselves reject the wrong shapes', () => {
  // Hostile (wrong collapse): one comment above two overrides justifies only the first.
  it('one GHSA comment does not cover the override below it', () => {
    const text = 'overrides:\n  # GHSA-aaaa-bbbb-cccc (miniflare)\n  undici@7: 7.29.1\n  fast-uri@3: 3.1.1\n';
    expect(unjustified(text)).toEqual(['fast-uri@3']);
  });

  it("an override's trailing comment does not cover the next one", () => {
    const text = 'overrides:\n  undici@7: 7.29.1 # GHSA-aaaa-bbbb-cccc\n  fast-uri@3: 3.1.1\n';
    expect(unjustified(text)).toEqual(['fast-uri@3']);
  });

  it('a comment with no GHSA id does not justify an override', () => {
    expect(unjustified('overrides:\n  # security fix\n  undici@7: 7.29.1\n')).toEqual(['undici@7']);
  });

  // Hostile (wrong split): the same justification in another shape must still be accepted.
  it('a comment above, a trailing comment, a multi-line comment and a quoted scoped key all pass', () => {
    const text = [
      'overrides:',
      '  # GHSA-aaaa-bbbb-cccc, GHSA-dddd-eeee-ffff',
      '  # parent: miniflare pins undici 7.29.0 exactly',
      '  undici@7: 7.29.1',
      "  '@scope/pkg@2': 2.0.1 # GHSA-1111-2222-3333",
      '',
    ].join('\n');
    expect(unjustified(text)).toEqual([]);
  });

  // Hostile (wrong collapse): an unscoped override drags every major onto one version.
  it('an override with no major selector, a range value, or a cross-major value is refused', () => {
    expect(overrideProblem('undici', '7.29.1')).not.toBeNull();
    expect(overrideProblem('@scope/pkg', '2.0.1')).not.toBeNull();
    expect(overrideProblem('undici@7', '^7.29.1')).not.toBeNull();
    expect(overrideProblem('undici@7', 'latest')).not.toBeNull();
    expect(overrideProblem('undici@7', '8.0.0')).not.toBeNull();
    expect(overrideProblem('undici@<7.29.1', '7.29.1')).not.toBeNull(); // also rewrites 6.x
  });

  // Hostile (wrong split): every way of naming one major is the same scope.
  it('a major selector in any of its spellings, scoped or parent-qualified, is accepted', () => {
    for (const key of ['undici@7', 'undici@7.x', 'undici@^7.0.0', 'undici@>=7.0.0 <8.0.0', 'miniflare>undici@7', '@scope/pkg@2']) {
      const value = key.startsWith('@scope') ? '2.0.1' : '7.29.1';
      expect(overrideProblem(key, value), key).toBeNull();
    }
  });

  it('an osv-scanner exception without expiry, with a non-date expiry, or without reason is refused', () => {
    expect(osvProblems('[[IgnoredVulns]]\nid = "GHSA-aaaa-bbbb-cccc"\nreason = "undici via miniflare"\n')).toHaveLength(1);
    expect(osvProblems('[[IgnoredVulns]]\nid = "GHSA-aaaa-bbbb-cccc"\nignoreUntil = "never"\nreason = "x"\n')).toHaveLength(1);
    expect(osvProblems('[[IgnoredVulns]]\nid = "GHSA-aaaa-bbbb-cccc"\nignoreUntil = 2026-13-45\nreason = "x"\n')).toHaveLength(1);
    expect(osvProblems('[[IgnoredVulns]]\nid = "GHSA-aaaa-bbbb-cccc"\nignoreUntil = 2026-10-08\nreason = ""\n')).toHaveLength(1);
  });

  // Hostile: a package-wide ignore with no end date silences every future advisory.
  it('an osv-scanner PackageOverrides block without expiry is refused', () => {
    expect(osvProblems('[[PackageOverrides]]\nname = "undici"\nignore = true\n')).toHaveLength(2);
  });

  it('dated, reasoned osv-scanner exceptions pass in either date spelling', () => {
    const text = [
      '[[IgnoredVulns]]',
      'id = "GHSA-aaaa-bbbb-cccc"',
      'ignoreUntil = 2026-10-08',
      'reason = "fast-uri 3.1.1 via ajv; patched release eligible 2026-10-08"',
      '',
      '[[IgnoredVulns]]',
      "id = 'CVE-2026-12345'",
      'ignoreUntil = 2026-10-08T00:00:00Z # eligible then',
      'reason = "yaml via yaml-language-server"',
    ].join('\n');
    expect(osvProblems(text)).toEqual([]);
  });

  it('a trivy exception without expired_at or statement is refused; a complete one passes', () => {
    expect(trivyProblems({ vulnerabilities: [{ id: 'CVE-2026-1' }] })).toHaveLength(2);
    expect(trivyProblems({ vulnerabilities: [{ id: 'CVE-2026-1', expired_at: 'soon', statement: 'x' }] })).toHaveLength(1);
    expect(trivyProblems({ vulnerabilities: [{ id: 'CVE-2026-1', expired_at: new Date('2026-10-08'), statement: 'undici via miniflare' }] })).toEqual([]);
  });
});

// ================================================================ the real tree

describe('every override is narrow and justified (R2.4)', () => {
  it('pnpm-workspace.yaml exists', () => {
    expect(existsSync(WORKSPACE)).toBe(true);
  });

  it('each override is scoped to one major and pinned to an exact release of it', () => {
    const problems = Object.entries(overrides())
      .map(([k, v]) => overrideProblem(k, v))
      .filter((p): p is string => p !== null);
    expect(problems).toEqual([]);
  });

  it('each override has its own comment naming the GHSA ids it closes', () => {
    expect(unjustified(workspaceText())).toEqual([]);
  });

  it('the lockfile records exactly the overrides the workspace declares', () => {
    expect(lock().overrides ?? {}).toEqual(overrides());
  });

  // Side effect: an override that pnpm did not apply leaves the vulnerable copy in place.
  it('each override took effect: every locked copy in that major is the pinned release', () => {
    const keys = Object.keys(lock().packages ?? {});
    const stray: string[] = [];
    for (const [selector, pinned] of Object.entries(overrides())) {
      const target = targetOf(selector);
      const name = target.slice(0, target.lastIndexOf('@'));
      const major = selectorMajor(selector);
      if (isParentScoped(selector)) continue; // parent-scoped: other parents may keep their own copy
      for (const k of keys.filter((k) => lockName(k) === name)) {
        const v = parseVersion(lockVersion(k));
        if (v && v[0] === major && lockVersion(k) !== pinned) stray.push(k);
      }
    }
    expect(stray).toEqual([]);
  });
});

describe('the known undici advisories are closed (R2.1)', () => {
  // Story 002's wrangler 4.136.3 brought undici 7.29.0 through miniflare's exact pin.
  it('the lockfile resolves no undici 7.x older than 7.29.1', () => {
    const vulnerable = Object.keys(lock().packages ?? {})
      .filter((k) => lockName(k) === 'undici')
      .filter((k) => {
        const v = parseVersion(lockVersion(k));
        return v !== null && v[0] === 7 && cmp(v, UNDICI_PATCHED) < 0;
      });
    expect(vulnerable).toEqual([]);
  });
});

describe('every exception names its advisory, carries a reason and expires (R2.5)', () => {
  it('osv-scanner.toml exceptions are dated and reasoned', () => {
    if (!existsSync(OSV)) return; // no exception recorded
    expect(osvProblems(readFileSync(OSV, 'utf8'))).toEqual([]);
  });

  it('.trivyignore.yaml exceptions are dated and reasoned', () => {
    if (!existsSync(TRIVY_YAML)) return;
    expect(trivyProblems(yaml.load(readFileSync(TRIVY_YAML, 'utf8')) as Raw)).toEqual([]);
  });

  // Hostile: trivy reads a plain .trivyignore by default, and it cannot carry an expiry.
  it('no plain .trivyignore exists', () => {
    expect(existsSync(TRIVY_PLAIN)).toBe(false);
  });
});
