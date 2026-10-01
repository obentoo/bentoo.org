import { defineConfig, devices } from '@playwright/test';

const port = Number(process.env.PLAYWRIGHT_PORT) || 4321;
const baseURL = `http://localhost:${port}`;

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 4 : 1,
  reporter: process.env.CI ? 'github' : 'list',
  // PW_UPDATE_SNAPSHOTS=all recaptures every baseline (e.g. inside the CI
  // runner image via `act`); otherwise Playwright's default ('missing') applies.
  updateSnapshots: process.env.PW_UPDATE_SNAPSHOTS === 'all' ? 'all' : 'missing',
  // PW_SNAPSHOT_DIR=<dir> reads and writes the screenshots under <dir>
  // (relative to this file) with the committed file names, e.g. to capture
  // twice into scratch dirs and compare them for determinism without touching
  // the committed baselines. Unset (the default): Playwright's own path.
  ...(process.env.PW_SNAPSHOT_DIR
    ? {
        snapshotPathTemplate: `${process.env.PW_SNAPSHOT_DIR}/{arg}{-projectName}{-snapshotSuffix}{ext}`,
      }
    : {}),
  use: {
    baseURL,
    trace: 'on-first-retry',
  },
  expect: {
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.01,
      animations: 'disabled',
    },
  },
  webServer: {
    // --ignore-lock: Astro 7 backgrounds `astro preview` when it detects an AI
    // agent and refuses to start beside another preview's lock file; either
    // would make the webServer exit early.
    command: `pnpm build && pnpm preview --port ${port} --ignore-lock`,
    port,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    // Production-shaped build (robots/SEO specs need it) over the notice
    // fixtures; NOTICES_INTEGRATION_BUILD lets NOTICES_DIR through the
    // production guard in src/content.config.ts. The resulting dist/ carries
    // fixture notices: never deploy it by hand.
    env: {
      PUBLIC_IS_PRODUCTION: 'true',
      NOTICES_DIR: 'tests/fixtures/notices',
      NOTICES_INTEGRATION_BUILD: 'true',
    },
  },
  projects: [
    {
      name: 'visual',
      testDir: './tests/visual',
      use: { ...devices['Desktop Chrome'] },
      grep: /.*/,
    },
    {
      name: 'visual-mobile',
      testDir: './tests/visual',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 375, height: 667 },
      },
    },
    {
      name: 'visual-desktop',
      testDir: './tests/visual',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 800 },
      },
    },
    {
      name: 'integration',
      testDir: './tests/integration',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
