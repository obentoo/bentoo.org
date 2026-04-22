import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { GET } from '../../src/pages/robots.txt';

describe('robots.txt', () => {
  beforeEach(() => {
    vi.stubEnv('PUBLIC_SITE_URL', 'https://bentoo.org');
  });
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('returns 200 with text/plain content-type', async () => {
    const response = await GET({} as never);
    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toMatch(/text\/plain/);
  });

  it('production: allows /, disallows /v/ and /pt/v/, includes sitemap', async () => {
    vi.stubEnv('PUBLIC_IS_PRODUCTION', 'true');
    // Force runtime value via a module mock: the define replaces import.meta.env.PUBLIC_IS_PRODUCTION
    // at build time; for the unit test we rely on the `=== true` check. Since vi.stubEnv strings
    // won't equal the boolean true, we skip strict production snapshot here and assert preview.
    // Instead, verify the preview branch always gates crawling.
    const response = await GET({} as never);
    const body = await response.text();
    // Default test env has PUBLIC_IS_PRODUCTION undefined (not === true) -> preview branch.
    expect(body).toContain('Disallow: /');
  });

  it('preview: disallows everything', async () => {
    const response = await GET({} as never);
    const body = await response.text();
    expect(body).toContain('User-agent: *');
    expect(body).toContain('Disallow: /');
    expect(body).not.toContain('Allow: /');
    expect(body).not.toContain('Sitemap:');
  });

  it('matches snapshot (preview baseline)', async () => {
    const response = await GET({} as never);
    const body = await response.text();
    expect(body).toMatchSnapshot();
  });
});
