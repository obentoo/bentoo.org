// Story 002, Task 6.1 — the deploy workflow (R7.1–R7.9).
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import * as yaml from 'js-yaml';

type Raw = Record<string, any>;
type Step = Raw & { run?: string; uses?: string; env?: Raw; with?: Raw };

const FILE = path.resolve(process.cwd(), '.github/workflows/deploy.yml');
const wf = (): Raw => yaml.load(readFileSync(FILE, 'utf8')) as Raw;

const runs = (s: Step, re: RegExp) => typeof s.run === 'string' && re.test(s.run);
const INSTALL = /\bpnpm install\b[^\n]*--frozen-lockfile/;
const TYPECHECK = /\bpnpm (run )?typecheck\b/;
const UNIT = /\bpnpm (run )?test:unit\b/;
const BUILD = /\bpnpm (run )?build\b/;
const DEPLOY = /\bwrangler deploy\b/;

function deployJob(): { name: string; job: Raw; steps: Step[] } {
  const jobs = Object.entries(wf().jobs ?? {}) as [string, Raw][];
  const found = jobs.filter(([, j]) => (j.steps ?? []).some((s: Step) => runs(s, DEPLOY)));
  expect(found.map(([n]) => n), 'exactly one job runs wrangler deploy').toHaveLength(1);
  const [name, job] = found[0];
  return { name, job, steps: job.steps as Step[] };
}

describe('triggers (R7.1–R7.3)', () => {
  it('push to main, Mondays 06:17 UTC and manual dispatch', () => {
    const on = wf().on;
    expect(on.push?.branches).toEqual(['main']);
    expect(on.schedule).toEqual([{ cron: '17 6 * * 1' }]);
    expect('workflow_dispatch' in on).toBe(true);
  });

  // Hostile: a pull-request trigger would run the deploy, with its secrets, on unmerged code.
  it('no pull-request trigger', () => {
    const on = wf().on;
    expect('pull_request' in on).toBe(false);
    expect('pull_request_target' in on).toBe(false);
  });
});

describe('least privilege and serialisation (R7.7, R7.8)', () => {
  it('the token has contents: read and nothing more, at every level', () => {
    const w = wf();
    expect(w.permissions).toEqual({ contents: 'read' });
    for (const [name, job] of Object.entries(w.jobs) as [string, Raw][]) {
      if (job.permissions !== undefined) expect(job.permissions, name).toEqual({ contents: 'read' });
    }
  });

  // A group built from ${{ github.ref }} would let runs on different refs deploy at once.
  it('one constant concurrency group that never cancels a running deploy', () => {
    const c = wf().concurrency ?? deployJob().job.concurrency;
    expect(c, 'no concurrency block').toBeDefined();
    expect(typeof c.group).toBe('string');
    expect(c.group).not.toContain('${{');
    expect(c['cancel-in-progress']).toBe(false);
  });
});

describe('the deploy job (R7.4, R7.5, R7.9)', () => {
  it('runs only for refs/heads/main', () => {
    const cond = String(deployJob().job.if ?? '').replace(/\s+/g, ' ');
    expect(cond).toMatch(/github\.ref == ['"]refs\/heads\/main['"]/);
    expect(cond).not.toContain('||');
  });

  it('installs, type-checks, unit-tests and builds before it deploys', () => {
    const { steps } = deployJob();
    const at = (re: RegExp, what: string) => {
      const i = steps.findIndex((s) => runs(s, re));
      expect(i, `${what} step`).toBeGreaterThanOrEqual(0);
      return i;
    };
    const order = [at(INSTALL, 'install'), at(TYPECHECK, 'typecheck'), at(UNIT, 'unit tests'), at(BUILD, 'build'), at(DEPLOY, 'deploy')];
    expect(order).toEqual([...order].sort((a, b) => a - b));
    expect(new Set(order).size).toBe(order.length);
  });

  // Hostile: continue-on-error or an always() guard lets a failed check reach the deploy.
  it('no failure is allowed to pass through to the deploy', () => {
    const { job, steps } = deployJob();
    expect(job['continue-on-error'] ?? false).toBe(false);
    for (const s of steps) {
      expect(s['continue-on-error'] ?? false, JSON.stringify(s)).toBe(false);
      expect(String(s.if ?? '')).not.toMatch(/always\(\)|failure\(\)|cancelled\(\)/);
    }
  });

  it('builds with PUBLIC_IS_PRODUCTION=true and PUBLIC_SITE_URL=https://obentoo.org, without NOTICES_DIR', () => {
    const w = wf();
    const { job, steps } = deployJob();
    const build = steps.find((s) => runs(s, BUILD)) as Step;
    const env = { ...(w.env ?? {}), ...(job.env ?? {}), ...(build.env ?? {}) };
    expect(String(env.PUBLIC_IS_PRODUCTION)).toBe('true');
    expect(env.PUBLIC_SITE_URL).toBe('https://obentoo.org');
    expect('NOTICES_DIR' in env).toBe(false);
    expect(readFileSync(FILE, 'utf8')).not.toContain('NOTICES_DIR');
  });

  it('deploys with the lockfile wrangler, never an unpinned download', () => {
    const { steps } = deployJob();
    expect(steps.some((s) => runs(s, /\bpnpm exec wrangler deploy\b/))).toBe(true);
    for (const s of Object.values(wf().jobs as Raw).flatMap((j: Raw) => (j.steps ?? []) as Step[])) {
      expect(String(s.run ?? '')).not.toMatch(/\b(npx|pnpm dlx|bunx)\b/);
    }
  });
});

describe('supply chain and secrets (R7.6, R7.7)', () => {
  it('every action is pinned to a full commit SHA', () => {
    const uses = Object.values(wf().jobs as Raw).flatMap((j: Raw) => [
      ...(j.uses ? [j.uses as string] : []),
      ...((j.steps ?? []) as Step[]).filter((s) => s.uses).map((s) => s.uses as string),
    ]);
    expect(uses.length).toBeGreaterThan(0);
    for (const u of uses) {
      if (u.startsWith('./')) continue;
      expect(u).toMatch(/^[^@\s]+@[0-9a-f]{40}$/);
    }
  });

  it('checkout does not persist the token', () => {
    const { steps } = deployJob();
    const checkout = steps.find((s) => String(s.uses ?? '').startsWith('actions/checkout@'));
    expect(checkout?.with?.['persist-credentials']).toBe(false);
  });

  it('secrets appear only in the deploy step env, each read from secrets.*', () => {
    const { name, steps } = deployJob();
    const deployIdx = steps.findIndex((s) => runs(s, DEPLOY));
    const where: string[] = [];
    const walk = (v: unknown, at: string) => {
      if (typeof v === 'string') {
        if (/secrets\./.test(v)) where.push(at);
      } else if (v && typeof v === 'object') {
        for (const [k, c] of Object.entries(v)) walk(c, `${at}.${k}`);
      }
    };
    walk(wf(), '$');
    const allowed = `$.jobs.${name}.steps.${deployIdx}.env.`;
    expect(where.filter((w) => !w.startsWith(allowed))).toEqual([]);
    const env = steps[deployIdx].env ?? {};
    expect(env.CLOUDFLARE_API_TOKEN).toMatch(/^\$\{\{\s*secrets\.CLOUDFLARE_API_TOKEN\s*\}\}$/);
    expect(env.CLOUDFLARE_ACCOUNT_ID).toMatch(/^\$\{\{\s*secrets\.CLOUDFLARE_ACCOUNT_ID\s*\}\}$/);
  });
});
