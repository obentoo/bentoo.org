import { test, expect } from '@playwright/test';
import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';

/**
 * NOTE: `astro preview` serves `dist/` statically — it does NOT apply the
 * Cloudflare Pages `_redirects` or `_headers` files. Those are honored only
 * by the CF Pages edge. Truly verifying the redirect behavior requires a
 * deployed CF Pages preview (Task 13.2). Here we assert the FILE CONTENTS
 * in `dist/` so regressions in the rule set are caught locally + in CI.
 */

const DIST_DIR = path.resolve(process.cwd(), 'dist');

test.describe('CF Pages _redirects + _headers (static file assertions)', () => {
  test('(1) dist/_redirects contains all 3 rules → / with 301', () => {
    const file = path.join(DIST_DIR, '_redirects');
    expect(existsSync(file), `missing ${file}; run npm run build first`).toBe(
      true
    );
    const contents = readFileSync(file, 'utf8');

    // /hub/*, /coming-soon/*, /old/* all → / with status 301
    expect(contents).toMatch(/\/hub\/\*\s+\/\s+301/);
    expect(contents).toMatch(/\/coming-soon\/\*\s+\/\s+301/);
    expect(contents).toMatch(/\/old\/\*\s+\/\s+301/);
  });

  test('(2) dist/_headers contains required security headers', () => {
    const file = path.join(DIST_DIR, '_headers');
    expect(existsSync(file), `missing ${file}; run npm run build first`).toBe(
      true
    );
    const contents = readFileSync(file, 'utf8');

    expect(contents).toMatch(/X-Content-Type-Options/);
    expect(contents).toMatch(/X-Frame-Options/);
    expect(contents).toMatch(/Referrer-Policy/);
    expect(contents).toMatch(/Content-Security-Policy/);
  });
});
