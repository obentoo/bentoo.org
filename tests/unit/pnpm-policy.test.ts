// Story 003, Task 1.1 — pnpm enforces the seven-day minimum release age (R1.1, R1.2).
import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import * as yaml from 'js-yaml';

type Raw = Record<string, any>;

const ROOT = process.cwd();
const WORKSPACE = path.join(ROOT, 'pnpm-workspace.yaml');
const PACKAGE_JSON = path.join(ROOT, 'package.json');
const NPMRC = path.join(ROOT, '.npmrc');

/** pnpm reads `minimumReleaseAge` in MINUTES: seven days is 10080. */
const SEVEN_DAYS_IN_MINUTES = 7 * 24 * 60;

const workspaceText = (): string => readFileSync(WORKSPACE, 'utf8');
const workspace = (): Raw => (yaml.load(workspaceText()) ?? {}) as Raw;
const pkg = (): Raw => JSON.parse(readFileSync(PACKAGE_JSON, 'utf8')) as Raw;

/** True when a pnpm `minimumReleaseAge` value holds back anything younger than seven days. */
function holdsSevenDays(value: unknown): boolean {
  return typeof value === 'number' && Number.isInteger(value) && value >= SEVEN_DAYS_IN_MINUTES;
}

const stripComment = (line: string): string => line.replace(/(^|\s)#.*$/, '');
const inlineComment = (line: string): string => line.match(/(?:^|\s)#(.*)$/)?.[1].trim() ?? '';

/**
 * The comment that belongs to each entry of a top-level YAML block: the contiguous
 * comment lines directly above the entry plus its own trailing comment. A blank line
 * or another entry breaks the adjacency, so one comment never covers two entries.
 * Returns null when the key is absent.
 */
function entryComments(text: string, top: string): { entry: string; comment: string }[] | null {
  const lines = text.split(/\r?\n/);
  const keyRe = new RegExp(`^${top.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*:(.*)$`);
  const start = lines.findIndex((l) => keyRe.test(l));
  if (start < 0) return null;
  const rest = lines[start].match(keyRe)![1];
  const flow = stripComment(rest).trim();
  if (flow) {
    const parsed = yaml.load(flow) as unknown;
    const items = Array.isArray(parsed) ? parsed.map(String) : Object.keys((parsed ?? {}) as Raw);
    const c = inlineComment(rest);
    return items.map((entry) => ({ entry, comment: items.length === 1 ? c : '' }));
  }
  const out: { entry: string; comment: string }[] = [];
  let pending: string[] = [];
  let indent = -1;
  for (const line of lines.slice(start + 1)) {
    const t = line.trim();
    if (t === '') { pending = []; continue; }
    if (t.startsWith('#')) { pending.push(t.slice(1).trim()); continue; }
    const lead = line.length - line.trimStart().length;
    if (lead === 0) break; // next top-level key
    if (indent < 0) indent = lead;
    if (lead > indent) { pending = []; continue; } // nested under the previous entry
    const body = stripComment(t);
    const parsed = yaml.load(body) as unknown;
    const entry = Array.isArray(parsed) ? String(parsed[0]) : Object.keys((parsed ?? {}) as Raw)[0];
    out.push({ entry, comment: [...pending, inlineComment(t)].filter(Boolean).join(' ') });
    pending = [];
  }
  return out;
}

/** Problems with a release-age exclusion list: every entry must carry its own justification. */
function exclusionProblems(text: string): string[] {
  const entries = entryComments(text, 'minimumReleaseAgeExclude');
  if (entries === null) return ['minimumReleaseAgeExclude is not declared'];
  return entries.filter((e) => e.comment.length === 0).map((e) => `${e.entry} has no recorded reason`);
}

describe('the guards themselves reject the wrong shapes', () => {
  // Hostile: days mistaken for minutes lets anything older than seven MINUTES in.
  it('a release age of 7 is refused (minutes, not days)', () => {
    expect(holdsSevenDays(7)).toBe(false);
  });

  it('hours mistaken for minutes (168) and a quoted number are refused', () => {
    expect(holdsSevenDays(168)).toBe(false);
    expect(holdsSevenDays('10080')).toBe(false);
    expect(holdsSevenDays(undefined)).toBe(false);
  });

  it('10080 and anything longer hold the line', () => {
    expect(holdsSevenDays(10080)).toBe(true);
    expect(holdsSevenDays(20160)).toBe(true);
  });

  // Hostile: one comment above two excluded packages justifies only the first.
  it('one comment does not justify two exclusions', () => {
    const text = 'minimumReleaseAgeExclude:\n  # GHSA-aaaa-bbbb-cccc: fix only in a young release\n  - foo\n  - bar\n';
    expect(exclusionProblems(text)).toEqual(['bar has no recorded reason']);
  });

  it('an exclusion with no comment at all is refused, in block or flow style', () => {
    expect(exclusionProblems('minimumReleaseAgeExclude:\n  - foo\n')).toEqual(['foo has no recorded reason']);
    expect(exclusionProblems('minimumReleaseAgeExclude: [foo, bar]\n')).toHaveLength(2);
  });

  it('an empty list, or entries each with their own reason (above or trailing), pass', () => {
    expect(exclusionProblems('minimumReleaseAgeExclude: []\n')).toEqual([]);
    const text =
      'minimumReleaseAgeExclude:\n  # GHSA-aaaa-bbbb-cccc\n  - foo\n  - bar # vendor hotfix, see docs/deploy.md\n';
    expect(exclusionProblems(text)).toEqual([]);
  });
});

describe('pnpm-workspace.yaml holds the resolution policy (R1.1)', () => {
  it('exists', () => {
    expect(existsSync(WORKSPACE), 'pnpm-workspace.yaml at the project root').toBe(true);
  });

  it('sets minimumReleaseAge to at least seven days, in minutes', () => {
    const age = workspace().minimumReleaseAge;
    expect(holdsSevenDays(age), `minimumReleaseAge = ${JSON.stringify(age)}`).toBe(true);
  });

  it('keeps the build-script allow-list for esbuild and sharp', () => {
    const allowed = workspace().onlyBuiltDependencies;
    expect(Array.isArray(allowed)).toBe(true);
    expect(allowed).toEqual(expect.arrayContaining(['esbuild', 'sharp']));
  });
});

describe('the release-age exclusion list stays justified (R1.2)', () => {
  it('declares minimumReleaseAgeExclude as a list', () => {
    expect(Array.isArray(workspace().minimumReleaseAgeExclude)).toBe(true);
  });

  it('every excluded package records the advisory or reason that justifies it', () => {
    expect(exclusionProblems(workspaceText())).toEqual([]);
  });
});

describe('one source for the pnpm settings', () => {
  // Hostile: the same settings in package.json and pnpm-workspace.yaml drift apart.
  it('package.json has no "pnpm" field', () => {
    expect('pnpm' in pkg()).toBe(false);
  });

  // Hostile: an .npmrc setting can lower the gate behind the workspace file's back.
  it('.npmrc does not set a release age of its own', () => {
    const npmrc = existsSync(NPMRC) ? readFileSync(NPMRC, 'utf8') : '';
    expect(npmrc).not.toMatch(/^\s*minimum-?release-?age/im);
  });
});

/** The lowest version in a `>=x.y.z` floor, or null when the range has no such floor. */
function floorOf(range: unknown): [number, number, number] | null {
  const m = typeof range === 'string' ? range.trim().match(/^>=\s*(\d+)\.(\d+)\.(\d+)$/) : null;
  return m ? [Number(m[1]), Number(m[2]), Number(m[3])] : null;
}
const atLeast = (v: [number, number, number], min: [number, number, number]): boolean =>
  v[0] !== min[0] ? v[0] > min[0] : v[1] !== min[1] ? v[1] > min[1] : v[2] >= min[2];
const PNPM_WITH_RELEASE_AGE: [number, number, number] = [10, 16, 0];

describe('the pnpm floor honours minimumReleaseAge (R1.1)', () => {
  // Hostile: pnpm 10.0–10.15 ignore minimumReleaseAge without an error.
  it('the guard refuses a floor below 10.16.0 and accepts 10.16.0 and above', () => {
    expect(atLeast(floorOf('>=10.0.0')!, PNPM_WITH_RELEASE_AGE)).toBe(false);
    expect(atLeast(floorOf('>=10.15.9')!, PNPM_WITH_RELEASE_AGE)).toBe(false);
    expect(atLeast(floorOf('>=10.16.0')!, PNPM_WITH_RELEASE_AGE)).toBe(true);
    expect(atLeast(floorOf('>= 11.0.0')!, PNPM_WITH_RELEASE_AGE)).toBe(true);
    expect(floorOf('^10.16.0')).toBeNull();
  });

  it('engines.pnpm admits no pnpm below 10.16.0', () => {
    const floor = floorOf(pkg().engines?.pnpm);
    expect(floor, `engines.pnpm is ${JSON.stringify(pkg().engines?.pnpm)}`).not.toBeNull();
    expect(atLeast(floor!, PNPM_WITH_RELEASE_AGE)).toBe(true);
  });

  it('packageManager pins a pnpm that honours the setting', () => {
    const m = String(pkg().packageManager ?? '').match(/^pnpm@(\d+)\.(\d+)\.(\d+)/);
    expect(m, `packageManager is ${pkg().packageManager}`).not.toBeNull();
    expect(atLeast([Number(m![1]), Number(m![2]), Number(m![3])], PNPM_WITH_RELEASE_AGE)).toBe(true);
  });
});
