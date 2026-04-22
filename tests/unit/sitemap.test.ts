import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { GET } from '../../src/pages/sitemap.xml';

describe('sitemap.xml', () => {
  beforeEach(() => {
    vi.stubEnv('PUBLIC_SITE_URL', 'https://bentoo.org');
  });
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('returns 200 with application/xml content-type', async () => {
    const response = await GET({} as never);
    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toMatch(/application\/xml/);
  });

  it('lists exactly 2 urls: / and /pt/', async () => {
    const response = await GET({} as never);
    const body = await response.text();
    const locs = [...body.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
    expect(locs).toEqual(['https://bentoo.org/', 'https://bentoo.org/pt/']);
  });

  it('emits hreflang alternates for each url', async () => {
    const response = await GET({} as never);
    const body = await response.text();
    expect(body).toContain('hreflang="en"');
    expect(body).toContain('hreflang="pt-BR"');
    expect(body).toContain('hreflang="x-default"');
  });

  it('uses PUBLIC_SITE_URL when provided', async () => {
    vi.stubEnv('PUBLIC_SITE_URL', 'https://preview.bentoo.org');
    const response = await GET({} as never);
    const body = await response.text();
    expect(body).toContain('https://preview.bentoo.org/');
    expect(body).toContain('https://preview.bentoo.org/pt/');
  });

  it('matches snapshot (production baseline)', async () => {
    const response = await GET({} as never);
    const body = await response.text();
    expect(body).toMatchSnapshot();
  });
});
