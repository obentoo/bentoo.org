// Story 002, Task 8.2 — every workflow runs least-privilege (R7.11, Q14).
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';

type Raw = Record<string, any>;
type Step = Raw & { uses?: string; with?: Raw };

const WF_DIR = path.resolve(process.cwd(), '.github/workflows');
const FILES = readdirSync(WF_DIR)
  .filter((f) => /\.ya?ml$/.test(f))
  .sort();
const load = (text: string): Raw => (yaml.load(text) ?? {}) as Raw;
const wf = (file: string): Raw => load(readFileSync(path.join(WF_DIR, file), 'utf8'));

/**
 * Job-level permissions a workflow may grant beyond `contents: read`.
 * Empty by default. Any entry MUST be justified by a comment next to the grant in
 * the workflow itself, and is a recorded deviation from R7.11.
 */
const JOB_PERMISSION_EXCEPTIONS: ReadonlyArray<{
  file: string;
  job: string;
  scope: string;
  access: 'read' | 'write';
  why: string;
}> = [];

const SHA_PIN = /^[^@\s]+@[0-9a-f]{40}$/;

function allUses(w: Raw): string[] {
  return Object.values((w.jobs ?? {}) as Raw).flatMap((j: Raw) => [
    ...(j.uses ? [String(j.uses)] : []),
    ...((j.steps ?? []) as Step[]).filter((s) => s.uses).map((s) => String(s.uses)),
  ]);
}

function checkouts(w: Raw): { job: string; step: Step }[] {
  return (Object.entries((w.jobs ?? {}) as Raw) as [string, Raw][]).flatMap(([job, j]) =>
    ((j.steps ?? []) as Step[])
      .filter((s) => String(s.uses ?? '').startsWith('actions/checkout@'))
      .map((step) => ({ job, step })),
  );
}

/** Job-level grants that are neither `contents: read` nor an allow-listed exception. */
function unexpectedJobGrants(file: string, w: Raw): string[] {
  const bad: string[] = [];
  for (const [name, job] of Object.entries((w.jobs ?? {}) as Raw) as [string, Raw][]) {
    const p = job.permissions;
    if (p === undefined) continue;
    // `read-all` / `write-all` (and any other scalar) grant every scope at once.
    if (p === null || typeof p !== 'object') {
      bad.push(`${name}: ${String(p)}`);
      continue;
    }
    for (const [scope, access] of Object.entries(p)) {
      if (scope === 'contents' && access === 'read') continue;
      const allowed = JOB_PERMISSION_EXCEPTIONS.some(
        (e) => e.file === file && e.job === name && e.scope === scope && e.access === access,
      );
      if (!allowed) bad.push(`${name}: ${scope}: ${String(access)}`);
    }
  }
  return bad;
}

describe('workflow inventory', () => {
  // Hostile: an empty or renamed directory would make every per-file check vacuous.
  it('finds the CI and deploy workflows', () => {
    expect(FILES).toEqual(expect.arrayContaining(['ci.yml', 'deploy.yml']));
  });

  it('every exception names a real job grant and says why', () => {
    for (const e of JOB_PERMISSION_EXCEPTIONS) {
      expect(FILES, `${e.file} exists`).toContain(e.file);
      expect(wf(e.file).jobs?.[e.job]?.permissions?.[e.scope], `${e.file} ${e.job} ${e.scope}`).toBe(e.access);
      expect(e.why.trim().length, `${e.file} ${e.job} ${e.scope} justification`).toBeGreaterThan(0);
    }
  });
});

// The predicates must reject the shapes R7.11 forbids; otherwise a green below proves nothing.
describe('the rules reject what R7.11 forbids', () => {
  it('a job widening contents to write, or write-all / read-all, is flagged', () => {
    const w = load(`
permissions: { contents: read }
jobs:
  a: { permissions: { contents: write }, steps: [] }
  b: { permissions: write-all, steps: [] }
  c: { permissions: read-all, steps: [] }
  d: { permissions: { contents: read, statuses: write }, steps: [] }
  e: { permissions: { contents: read }, steps: [] }
  f: { steps: [] }
`);
    expect(unexpectedJobGrants('fixture.yml', w)).toEqual([
      'a: contents: write',
      'b: write-all',
      'c: read-all',
      'd: statuses: write',
    ]);
  });

  it('a quoted "false", a missing with: block, or a tag/short SHA is not compliant', () => {
    const w = load(`
jobs:
  j:
    steps:
      - uses: actions/checkout@v4
      - uses: actions/checkout@11d5960
        with: { persist-credentials: 'false' }
      - uses: actions/checkout@11d5960a326750d5838078e36cf38b85af677262
        with: { persist-credentials: false }
`);
    const flags = checkouts(w).map(({ step }) => step.with?.['persist-credentials']);
    expect(flags).toEqual([undefined, 'false', false]);
    expect(allUses(w).map((u) => SHA_PIN.test(u))).toEqual([false, false, true]);
  });
});

// deploy.yml already complies (Task 6.1); ci.yml is the file this task hardens.
describe.each(FILES)('%s', (file) => {
  it('workflow-level permissions are exactly contents: read', () => {
    expect(wf(file).permissions).toEqual({ contents: 'read' });
  });

  it('no job widens the token beyond allow-listed exceptions', () => {
    expect(unexpectedJobGrants(file, wf(file))).toEqual([]);
  });

  it('every actions/checkout sets persist-credentials: false', () => {
    const persisting = checkouts(wf(file))
      .filter(({ step }) => step.with?.['persist-credentials'] !== false)
      .map(({ job }) => job);
    expect(persisting, `${file}: jobs whose checkout persists the token`).toEqual([]);
  });

  it('every uses: is pinned to a 40-hex commit SHA', () => {
    const uses = allUses(wf(file));
    expect(uses.length).toBeGreaterThan(0);
    for (const u of uses) {
      if (u.startsWith('./')) continue;
      expect(u).toMatch(SHA_PIN);
    }
  });
});
