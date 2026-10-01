// Story 002, Task 4.2 — the integration-build exception to the NOTICES_DIR
// production guard (src/content.config.ts, noticesDir).
import { describe, it, expect, afterEach, vi } from 'vitest';
import path from 'node:path';

vi.mock('astro:content', async () => ({
  defineCollection: (c: unknown) => c,
  z: (await import('astro/zod')).z,
}));

async function baseOf(env: Record<string, string>): Promise<string> {
  vi.resetModules();
  vi.stubEnv('NOTICES_DIR', '');
  vi.stubEnv('PUBLIC_IS_PRODUCTION', '');
  vi.stubEnv('NOTICES_INTEGRATION_BUILD', '');
  vi.stubEnv('CF_PAGES_BRANCH', '');
  for (const [k, v] of Object.entries(env)) vi.stubEnv(k, v);
  const { collections } = await import('~/content.config');
  const notices = (collections as Record<string, any>).notices;
  return path.resolve(String(notices.loader.options.base));
}

const FIXTURE_DIR = path.resolve('tests/fixtures/notices');
const REAL_DIR = path.resolve('src/content/notices');

describe('noticesDir under NOTICES_INTEGRATION_BUILD', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('lets NOTICES_DIR through a production-shaped build when set to "true"', async () => {
    expect(
      await baseOf({ NOTICES_DIR: FIXTURE_DIR, PUBLIC_IS_PRODUCTION: 'true', NOTICES_INTEGRATION_BUILD: 'true' })
    ).toBe(FIXTURE_DIR);
  });

  // Hostile half: any other value keeps the guard closed.
  it('keeps the production guard for any other value', async () => {
    for (const flag of ['', '1', 'yes', 'TRUE']) {
      expect(
        await baseOf({ NOTICES_DIR: FIXTURE_DIR, PUBLIC_IS_PRODUCTION: 'true', NOTICES_INTEGRATION_BUILD: flag }),
        flag
      ).toBe(REAL_DIR);
    }
  });

  it('does nothing on its own: without NOTICES_DIR the real notices load', async () => {
    expect(await baseOf({ PUBLIC_IS_PRODUCTION: 'true', NOTICES_INTEGRATION_BUILD: 'true' })).toBe(REAL_DIR);
  });
});

describe('noticesDir treats a Cloudflare Pages build of main as production', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  // astro.config.mjs derives production from CF_PAGES_BRANCH === 'main' too;
  // the guard must agree, or a Pages build of main would honour NOTICES_DIR.
  it('ignores NOTICES_DIR when CF_PAGES_BRANCH is main', async () => {
    expect(await baseOf({ NOTICES_DIR: FIXTURE_DIR, CF_PAGES_BRANCH: 'main' })).toBe(REAL_DIR);
  });

  it('still honours NOTICES_DIR on another Pages branch', async () => {
    expect(await baseOf({ NOTICES_DIR: FIXTURE_DIR, CF_PAGES_BRANCH: 'preview' })).toBe(FIXTURE_DIR);
  });
});
