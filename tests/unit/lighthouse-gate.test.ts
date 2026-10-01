// @vitest-environment node
// Story 004, Task 2.1 — the Lighthouse gate audits deterministic, indexable pages
// of a production build, with unchanged thresholds (R3.1, R3.2, R3.3, R4.2).
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import yaml from 'js-yaml';

type Raw = Record<string, any>;
type Step = Raw & { run?: string; uses?: string; env?: Raw; with?: Raw };

const ROOT = process.cwd();
const RC_FILE = path.resolve(ROOT, 'lighthouserc.cjs');
const CI_FILE = path.resolve(ROOT, '.github/workflows/ci.yml');
const require = createRequire(import.meta.url);

/** Loads lighthouserc.cjs from disk, bypassing the require cache. */
function loadRc(): Raw {
  delete require.cache[require.resolve(RC_FILE)];
  return require(RC_FILE) as Raw;
}
const ciWorkflow = (): Raw => yaml.load(readFileSync(CI_FILE, 'utf8')) as Raw;

// ---------------------------------------------------------------------------
// Predicates. Each is exercised against hostile fixtures before it is trusted
// with the real files, so a predicate that fires wrongly fails here first.
// ---------------------------------------------------------------------------

const EXPECTED_PATHS = ['/notices/index.html', '/privacy/index.html', '/pt/notices/index.html'];
const LOCALES = ['pt', 'es'];

/** The path LHCI serves from staticDistDir; the host is rewritten by LHCI. */
function auditedPath(url: string): string {
  return new URL(url, 'http://localhost').pathname;
}

/** A locale root is a rotator redirect page: `/`, `/pt/`, `/es/`, in any spelling. */
function isLocaleRoot(url: string): boolean {
  const p = auditedPath(url).replace(/\/index\.html$/, '/').replace(/\/+$/, '');
  return p === '' || LOCALES.some((l) => p === `/${l}`);
}

/** A variant page (`/v/<slug>/`, `/pt/v/<slug>/`) is noindex by design. */
function isVariant(url: string): boolean {
  return /^\/([a-z]{2}\/)?v(\/|$)/.test(auditedPath(url));
}

type Assertion = unknown;
const LEVEL = (a: Assertion) => (Array.isArray(a) ? a[0] : a);
const OPTS = (a: Assertion): Raw => (Array.isArray(a) && a[1] && typeof a[1] === 'object' ? a[1] : {});

/** Fails the run (error level) when the category score is below `min`. */
function gatesMinScore(a: Assertion, min: number): boolean {
  const s = OPTS(a).minScore;
  return LEVEL(a) === 'error' && typeof s === 'number' && s >= min && s <= 1;
}

/** Fails the run (error level) when the metric exceeds `max`. */
function gatesMaxValue(a: Assertion, max: number): boolean {
  const v = OPTS(a).maxNumericValue;
  return LEVEL(a) === 'error' && typeof v === 'number' && v <= max && v >= 0;
}

const BUILD = /\bpnpm (run )?build(?![\w:-])/;
const INSTALL = /\bpnpm install\b[^\n]*--frozen-lockfile/;
const LHCI_ACTION = /^treosh\/lighthouse-ci-action@/;
const runs = (s: Step, re: RegExp) => typeof s.run === 'string' && re.test(s.run);

/** True when a step puts a downloaded artifact into dist/, or fetches the `dist` artifact at all. */
function downloadsDist(s: Step): boolean {
  if (!String(s.uses ?? '').startsWith('actions/download-artifact@')) return false;
  const name = s.with?.name;
  const dest = String(s.with?.path ?? '.')
    .replace(/^\.\//, '')
    .replace(/\/+$/, '');
  return name === 'dist' || dest === 'dist' || dest.startsWith('dist/');
}

/** Effective env of a step: workflow, then job, then step (GitHub's precedence). */
function effectiveEnv(w: Raw, job: Raw, s: Step): Record<string, string> {
  const out: Record<string, string> = {};
  for (const layer of [w.env, job.env, s.env]) {
    for (const [k, v] of Object.entries((layer ?? {}) as Raw)) out[k] = String(v);
  }
  return out;
}

/** A build step that produces the production, indexable site. */
function isProductionBuild(w: Raw, job: Raw, s: Step): boolean {
  if (!runs(s, BUILD)) return false;
  const env = effectiveEnv(w, job, s);
  return env.PUBLIC_IS_PRODUCTION === 'true' && (env.PUBLIC_SITE_URL ?? '').replace(/\/+$/, '') === 'https://obentoo.org';
}

describe('predicates fire on the right inputs (hostile halves first)', () => {
  it('locale-root detection: near-identical pages that are NOT roots stay apart', () => {
    // Would wrongly collapse: share a locale prefix or an index.html suffix with a root.
    for (const u of [
      'http://localhost/pt/notices/index.html',
      'http://localhost/notices/index.html',
      'http://localhost/privacy/index.html',
      'http://localhost/pt/privacy/index.html',
      'http://localhost/ptx/index.html',
    ]) {
      expect(isLocaleRoot(u), u).toBe(false);
    }
  });

  it('locale-root detection: every spelling of a root is caught', () => {
    // Would wrongly split: same redirect page, different shape.
    for (const u of [
      'http://localhost/index.html',
      'http://localhost/',
      'http://localhost',
      'http://localhost/pt/index.html',
      'http://localhost/pt/',
      'http://localhost/pt',
      'http://localhost/es/index.html',
      'http://localhost/es/',
      'http://localhost/index.html?v=v4',
      '/pt/index.html',
    ]) {
      expect(isLocaleRoot(u), u).toBe(true);
    }
  });

  it('variant detection: /v/ pages in any locale, but not paths merely containing "v"', () => {
    expect(isVariant('http://localhost/privacy/index.html')).toBe(false);
    expect(isVariant('http://localhost/notices/v1/index.html')).toBe(false);
    expect(isVariant('http://localhost/pt/notices/index.html')).toBe(false);
    for (const u of [
      'http://localhost/v/v4/index.html',
      'http://localhost/pt/v/v4/index.html',
      'http://localhost/es/v/mario/',
      'http://localhost/v/',
    ]) {
      expect(isVariant(u), u).toBe(true);
    }
  });

  it('category gate: a lowered threshold or a non-error level is rejected', () => {
    expect(gatesMinScore(['error', { minScore: 0.9 }], 0.95)).toBe(false);
    expect(gatesMinScore(['warn', { minScore: 0.95 }], 0.95)).toBe(false);
    expect(gatesMinScore(['off', { minScore: 0.95 }], 0.95)).toBe(false);
    expect(gatesMinScore('error', 0.95)).toBe(false);
    expect(gatesMinScore(['error', {}], 0.95)).toBe(false);
    expect(gatesMinScore(undefined, 0.95)).toBe(false);
    expect(gatesMinScore(['error', { minScore: 0.95 }], 0.95)).toBe(true);
    expect(gatesMinScore(['error', { minScore: 1 }], 0.95)).toBe(true);
  });

  it('metric gate: a raised ceiling or a non-error level is rejected', () => {
    expect(gatesMaxValue(['error', { maxNumericValue: 3000 }], 2500)).toBe(false);
    expect(gatesMaxValue(['warn', { maxNumericValue: 2500 }], 2500)).toBe(false);
    expect(gatesMaxValue(['error', { minScore: 0.9 }], 2500)).toBe(false);
    expect(gatesMaxValue(['error', { maxNumericValue: 0.25 }], 0.1)).toBe(false);
    expect(gatesMaxValue(['error', { maxNumericValue: 2500 }], 2500)).toBe(true);
    expect(gatesMaxValue(['error', { maxNumericValue: 0.1 }], 0.1)).toBe(true);
  });

  it('dist download: every route to the ci artifact is caught, other artifacts are not', () => {
    const dl = 'actions/download-artifact@d3f86a106a0bac45b974a628896c90dbdf5c8093';
    // Would wrongly split: same dist artifact / same destination, different spelling.
    expect(downloadsDist({ uses: dl, with: { name: 'dist', path: 'dist' } })).toBe(true);
    expect(downloadsDist({ uses: dl, with: { name: 'dist' } })).toBe(true);
    expect(downloadsDist({ uses: dl, with: { name: 'dist', path: './dist/' } })).toBe(true);
    expect(downloadsDist({ uses: dl, with: { path: 'dist' } })).toBe(true);
    expect(downloadsDist({ uses: dl, with: { name: 'build', path: 'dist/sub' } })).toBe(true);
    // Would wrongly collapse: an unrelated artifact outside dist/, or an upload of dist.
    expect(downloadsDist({ uses: dl, with: { name: 'reports', path: 'reports' } })).toBe(false);
    expect(downloadsDist({ uses: dl, with: { name: 'distro-notes', path: 'distro' } })).toBe(false);
    expect(
      downloadsDist({ uses: 'actions/upload-artifact@ea165f8d65b6e75b540449e92b4886f43607fa02', with: { name: 'dist', path: 'dist' } }),
    ).toBe(false);
  });

  it('production build: a missing or wrong flag, a wrong origin or another script is rejected', () => {
    const w = {};
    const job = {};
    const env = { PUBLIC_IS_PRODUCTION: 'true', PUBLIC_SITE_URL: 'https://obentoo.org' };
    expect(isProductionBuild(w, job, { run: 'pnpm build' })).toBe(false);
    expect(isProductionBuild(w, job, { run: 'pnpm build', env: { PUBLIC_SITE_URL: 'https://obentoo.org' } })).toBe(false);
    expect(isProductionBuild(w, job, { run: 'pnpm build', env: { ...env, PUBLIC_IS_PRODUCTION: 'false' } })).toBe(false);
    expect(isProductionBuild(w, job, { run: 'pnpm build', env: { ...env, PUBLIC_IS_PRODUCTION: 'True' } })).toBe(false);
    expect(isProductionBuild(w, job, { run: 'pnpm build', env: { PUBLIC_IS_PRODUCTION: 'true' } })).toBe(false);
    expect(isProductionBuild(w, job, { run: 'pnpm build', env: { ...env, PUBLIC_SITE_URL: 'https://preview.obentoo.org' } })).toBe(false);
    expect(isProductionBuild(w, job, { run: 'pnpm build:og', env })).toBe(false);
    expect(isProductionBuild(w, job, { run: 'pnpm typecheck', env })).toBe(false);
    // A step-level override wins over a production flag set higher up.
    expect(
      isProductionBuild({ env }, job, { run: 'pnpm build', env: { PUBLIC_IS_PRODUCTION: 'false' } }),
    ).toBe(false);
    expect(isProductionBuild(w, job, { run: 'pnpm build', env })).toBe(true);
    expect(isProductionBuild(w, job, { run: 'pnpm run build', env: { ...env, PUBLIC_IS_PRODUCTION: true } })).toBe(true);
  });
});

describe('lighthouserc.cjs audits deterministic, indexable pages (R3.1, R3.3)', () => {
  const urls = (): string[] => loadRc().ci?.collect?.url as string[];

  it('serves the audited pages from the built dist/', () => {
    expect(path.normalize(String(loadRc().ci?.collect?.staticDistDir))).toBe('dist');
  });

  // Hostile: a rotator redirect page lands on a random noindex variant.
  it('audits no locale root', () => {
    const roots = urls().filter(isLocaleRoot);
    expect(roots, 'locale roots redirect to a random variant').toEqual([]);
  });

  // Hostile: variants are noindex,follow by design and fail SEO whatever the build.
  it('audits no variant page', () => {
    expect(urls().filter(isVariant), 'variant pages are noindex').toEqual([]);
  });

  it('audits exactly the privacy page and the notice index in the default locale and in pt', () => {
    const list = urls();
    expect(Array.isArray(list)).toBe(true);
    expect(list.map(auditedPath).sort()).toEqual(EXPECTED_PATHS);
    // No query or fragment that could steer a page (e.g. `?v=<slug>`).
    for (const u of list) {
      const parsed = new URL(u, 'http://localhost');
      expect(parsed.search + parsed.hash, u).toBe('');
    }
  });

  // Hostile: three entries that collapse to the same page would satisfy a count.
  it('the audited URLs are pairwise distinct pages', () => {
    const paths = urls().map(auditedPath);
    expect(new Set(paths).size).toBe(paths.length);
  });

  it('two loads of the config audit the same URLs (R3.3)', () => {
    expect(loadRc().ci.collect.url).toEqual(loadRc().ci.collect.url);
  });

  // Hostile: skipping the crawlability audit would hide a noindex build from SEO.
  it('does not skip the crawlability audit', () => {
    const skipped = (loadRc().ci?.collect?.settings?.skipAudits ?? []) as string[];
    expect(skipped).not.toContain('is-crawlable');
  });
});

describe('lighthouserc.cjs keeps its thresholds (R3.2)', () => {
  const assertions = (): Raw => loadRc().ci?.assert?.assertions ?? {};

  it.each(['performance', 'accessibility', 'best-practices', 'seo'])(
    'categories:%s fails the job below 0.95',
    (cat) => {
      const a = assertions()[`categories:${cat}`];
      expect(gatesMinScore(a, 0.95), JSON.stringify(a)).toBe(true);
    },
  );

  it('largest-contentful-paint fails the job above 2500 ms', () => {
    const a = assertions()['largest-contentful-paint'];
    expect(gatesMaxValue(a, 2500), JSON.stringify(a)).toBe(true);
  });

  it('cumulative-layout-shift fails the job above 0.1', () => {
    const a = assertions()['cumulative-layout-shift'];
    expect(gatesMaxValue(a, 0.1), JSON.stringify(a)).toBe(true);
  });
});

describe('ci.yml lighthouse job audits its own production build (R3.1, R4.2)', () => {
  function lighthouseJob(): { w: Raw; job: Raw; steps: Step[]; action: number } {
    const w = ciWorkflow();
    const job = w.jobs?.lighthouse as Raw;
    expect(job, 'job `lighthouse` exists').toBeDefined();
    const steps = (job.steps ?? []) as Step[];
    const actions = steps.flatMap((s, i) => (LHCI_ACTION.test(String(s.uses ?? '')) ? [i] : []));
    expect(actions, 'exactly one lighthouse-ci-action step').toHaveLength(1);
    return { w, job, steps, action: actions[0] };
  }

  // Hostile: the `ci` job's dist is a non-production build, noindex on every page.
  it('does not download the ci job\'s dist artifact', () => {
    const { steps } = lighthouseJob();
    const downloads = steps.filter(downloadsDist).map((s) => JSON.stringify(s.with ?? {}));
    expect(downloads, 'download-artifact into dist/').toEqual([]);
  });

  it('builds dist/ for production before the Lighthouse action', () => {
    const { w, job, steps, action } = lighthouseJob();
    const builds = steps.flatMap((s, i) => (runs(s, BUILD) ? [i] : []));
    expect(builds.length, 'a `pnpm build` step').toBeGreaterThan(0);
    const before = builds.filter((i) => i < action);
    expect(before.length, '`pnpm build` runs before the action').toBeGreaterThan(0);
    // Hostile: every build before the action must be the production one; the last
    // one decides what dist/ holds when Lighthouse reads it.
    const last = steps[before[before.length - 1]];
    expect(
      isProductionBuild(w, job, last),
      `env: ${JSON.stringify(effectiveEnv(w, job, last))}`,
    ).toBe(true);
  });

  it('installs dependencies with the frozen lockfile before building', () => {
    const { steps, action } = lighthouseJob();
    const install = steps.findIndex((s) => runs(s, INSTALL));
    const build = steps.findIndex((s, i) => i < action && runs(s, BUILD));
    expect(install, 'pnpm install --frozen-lockfile').toBeGreaterThanOrEqual(0);
    expect(build, '`pnpm build` before the action').toBeGreaterThanOrEqual(0);
    expect(install, 'install precedes build').toBeLessThan(build);
  });

  // Hostile: an action-level `urls:` input would override the config's URL list.
  it('the action reads lighthouserc.cjs and nothing overrides its URLs', () => {
    const { steps, action } = lighthouseJob();
    const w = (steps[action].with ?? {}) as Raw;
    expect(path.normalize(String(w.configPath))).toBe('lighthouserc.cjs');
    expect(w.urls, 'action `urls` input').toBeUndefined();
  });
});

// Story 004, 4.1 fix: a single run per URL let cold-start noise on the first
// URL (TBT 310 ms on a page with no executable script) fail the gate. The gate
// judges the median of at least three runs; the thresholds stay unchanged.
describe('each URL is judged on the median of several runs', () => {
  it('collect.numberOfRuns is an integer of at least 3', () => {
    const runs = loadRc().ci?.collect?.numberOfRuns;
    expect(Number.isInteger(runs), `numberOfRuns is ${JSON.stringify(runs)}`).toBe(true);
    expect(runs).toBeGreaterThanOrEqual(3);
  });
});
