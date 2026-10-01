// Story 002, Task 8.1 — production env for analytics and the newsletter (R7.10).
//
// Both values end up in the public HTML, so the deploy build must read them from
// repository variables (`vars.*`), never from secrets, and only the build step may
// carry them.
//
// Out of scope here: "a production build with PUBLIC_CF_ANALYTICS_TOKEN set emits the
// beacon with that token, one without it emits none". Rendering BaseLayout.astro needs
// Astro's Vite plugin, which this vitest config does not load, so the only faithful
// check is a real `astro build`; it lives in the sub-task's Validation instead.
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';

type Raw = Record<string, any>;
type Step = Raw & { run?: string; uses?: string; env?: Raw };

const FILE = path.resolve(process.cwd(), '.github/workflows/deploy.yml');
const wf = (): Raw => yaml.load(readFileSync(FILE, 'utf8')) as Raw;

const NAMES = ['PUBLIC_CF_ANALYTICS_TOKEN', 'PUBLIC_BUTTONDOWN_USERNAME'] as const;
const EXPECTED: Record<(typeof NAMES)[number], string> = {
  PUBLIC_CF_ANALYTICS_TOKEN: '${{ vars.PUBLIC_CF_ANALYTICS_TOKEN }}',
  PUBLIC_BUTTONDOWN_USERNAME: '${{ vars.PUBLIC_BUTTONDOWN_USERNAME }}',
};

const runs = (s: Step, re: RegExp) => typeof s.run === 'string' && re.test(s.run);
const BUILD = /\bpnpm (run )?build\b/;
const DEPLOY = /\bwrangler deploy\b/;

/** The single build step of the job that runs `wrangler deploy`, with its YAML path. */
function buildStep(w: Raw): { at: string; step: Step } {
  const jobs = Object.entries(w.jobs ?? {}) as [string, Raw][];
  const deploy = jobs.filter(([, j]) => (j.steps ?? []).some((s: Step) => runs(s, DEPLOY)));
  expect(deploy.map(([n]) => n), 'exactly one job runs wrangler deploy').toHaveLength(1);
  const [name, job] = deploy[0];
  const steps = job.steps as Step[];
  const idx = steps.map((s, i) => (runs(s, BUILD) ? i : -1)).filter((i) => i >= 0);
  expect(idx, 'exactly one pnpm build step in the deploy job').toHaveLength(1);
  return { at: `$.jobs.${name}.steps.${idx[0]}`, step: steps[idx[0]] };
}

/**
 * Every rule of R7.10 as a list of violations, so the same predicate is first proven
 * against hostile fixtures and then applied to the real file.
 */
function violations(w: Raw): string[] {
  const out: string[] = [];
  const { at, step } = buildStep(w);
  const env = step.env ?? {};

  // 1. The build step reads each value from its own repository variable, verbatim.
  for (const n of NAMES) {
    if (env[n] !== EXPECTED[n]) out.push(`build env ${n} is ${JSON.stringify(env[n])}, want ${EXPECTED[n]}`);
  }

  // 2. Nothing else in the workflow names either variable: no secrets.*, no literal,
  //    no other env block, no `>> $GITHUB_ENV` write from a run script.
  const allowed = new Set(NAMES.map((n) => `${at}.env.${n}`));
  const mention = new RegExp(`\\b(${NAMES.join('|')})\\b`, 'i');
  const walk = (v: unknown, p: string) => {
    if (typeof v === 'string') {
      if (/secrets\./i.test(v) && mention.test(v)) out.push(`${p} reads it from secrets.*`);
      else if (mention.test(v) && !allowed.has(p)) out.push(`${p} mentions it outside the build step env`);
    } else if (v && typeof v === 'object') {
      for (const [k, c] of Object.entries(v)) {
        const kp = `${p}.${k}`;
        if (mention.test(k) && !allowed.has(kp)) out.push(`${kp} carries it outside the build step env`);
        walk(c, kp);
      }
    }
  };
  walk(w, '$');
  return out;
}

/** A minimal workflow shaped like deploy.yml, with the build env under test. */
function fixture(buildEnv: Raw, extra: (w: Raw) => void = () => {}): Raw {
  const w: Raw = {
    jobs: {
      deploy: {
        steps: [
          { run: 'pnpm install --frozen-lockfile' },
          { run: 'pnpm build', env: { PUBLIC_IS_PRODUCTION: 'true', ...buildEnv } },
          { run: 'pnpm exec wrangler deploy', env: { CLOUDFLARE_API_TOKEN: '${{ secrets.CLOUDFLARE_API_TOKEN }}' } },
        ],
      },
    },
  };
  extra(w);
  return w;
}

const GOOD = { ...EXPECTED };

// Hostile half first: each fixture would wrongly satisfy a looser reading of R7.10.
// These pass today by design — they prove the predicate fires before it is trusted.
describe('the R7.10 predicate rejects every wrong source (hostile fixtures)', () => {
  it.each([
    ['read from secrets', { ...GOOD, PUBLIC_CF_ANALYTICS_TOKEN: '${{ secrets.PUBLIC_CF_ANALYTICS_TOKEN }}' }],
    ['a literal token', { ...GOOD, PUBLIC_CF_ANALYTICS_TOKEN: '0123456789abcdef0123456789abcdef' }],
    ['a literal username', { ...GOOD, PUBLIC_BUTTONDOWN_USERNAME: 'bentoo' }],
    ['a vars expression with a literal fallback', { ...GOOD, PUBLIC_CF_ANALYTICS_TOKEN: "${{ vars.PUBLIC_CF_ANALYTICS_TOKEN || 'tok' }}" }],
    // Wrongly collapse: two distinct variables fed from one source.
    ['both fed from the token variable', { ...GOOD, PUBLIC_BUTTONDOWN_USERNAME: '${{ vars.PUBLIC_CF_ANALYTICS_TOKEN }}' }],
    ['the two swapped', { PUBLIC_CF_ANALYTICS_TOKEN: GOOD.PUBLIC_BUTTONDOWN_USERNAME, PUBLIC_BUTTONDOWN_USERNAME: GOOD.PUBLIC_CF_ANALYTICS_TOKEN }],
    // A third, like-named variable is not the one R7.10 names.
    ['a like-named variable', { ...GOOD, PUBLIC_CF_ANALYTICS_TOKEN: '${{ vars.PUBLIC_CF_ANALYTICS_TOKEN_STAGING }}' }],
    ['one of them missing', { PUBLIC_CF_ANALYTICS_TOKEN: GOOD.PUBLIC_CF_ANALYTICS_TOKEN }],
  ])('build env %s', (_label, env) => {
    expect(violations(fixture(env))).not.toEqual([]);
  });

  // Wrongly split: the right build env, but a second copy elsewhere.
  it.each([
    ['also in the deploy step env', (w: Raw) => { w.jobs.deploy.steps[2].env.PUBLIC_CF_ANALYTICS_TOKEN = GOOD.PUBLIC_CF_ANALYTICS_TOKEN; }],
    ['also at workflow level', (w: Raw) => { w.env = { PUBLIC_BUTTONDOWN_USERNAME: GOOD.PUBLIC_BUTTONDOWN_USERNAME }; }],
    ['also at job level', (w: Raw) => { w.jobs.deploy.env = { PUBLIC_CF_ANALYTICS_TOKEN: GOOD.PUBLIC_CF_ANALYTICS_TOKEN }; }],
    ['written to $GITHUB_ENV by a run step', (w: Raw) => {
      w.jobs.deploy.steps.splice(1, 0, { run: 'echo "PUBLIC_CF_ANALYTICS_TOKEN=${{ secrets.CF_TOKEN }}" >> "$GITHUB_ENV"' });
    }],
    ['a secret elsewhere under the same name', (w: Raw) => { w.jobs.deploy.steps[0].env = { X: '${{ secrets.PUBLIC_BUTTONDOWN_USERNAME }}' }; }],
  ])('correct build env, %s', (_label, mutate) => {
    expect(violations(fixture(GOOD, mutate))).not.toEqual([]);
  });

  // Benign half last: the shape R7.10 asks for has no violation.
  it('accepts exactly the two vars.* expressions on the build step', () => {
    expect(violations(fixture(GOOD))).toEqual([]);
  });
});

describe('.github/workflows/deploy.yml (R7.10)', () => {
  it('the build step reads PUBLIC_CF_ANALYTICS_TOKEN and PUBLIC_BUTTONDOWN_USERNAME from vars.*', () => {
    const env = buildStep(wf()).step.env ?? {};
    expect(env.PUBLIC_CF_ANALYTICS_TOKEN).toBe('${{ vars.PUBLIC_CF_ANALYTICS_TOKEN }}');
    expect(env.PUBLIC_BUTTONDOWN_USERNAME).toBe('${{ vars.PUBLIC_BUTTONDOWN_USERNAME }}');
  });

  it('neither appears as secrets.*, as a literal, or in any other step', () => {
    expect(violations(wf())).toEqual([]);
  });

  // The build still keeps the production env it already had.
  it('the build step keeps PUBLIC_IS_PRODUCTION=true', () => {
    expect(String(buildStep(wf()).step.env?.PUBLIC_IS_PRODUCTION)).toBe('true');
  });
});
