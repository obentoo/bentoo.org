import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { GET } from '../../src/pages/sitemap.xml';

describe('sitemap.xml', () => {
  beforeEach(() => {
    vi.stubEnv('PUBLIC_SITE_URL', 'https://obentoo.org');
  });
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('returns 200 with application/xml content-type', async () => {
    const response = await GET({} as never);
    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toMatch(/application\/xml/);
  });

  it('lists exactly 3 urls: /, /pt/, /es/', async () => {
    const response = await GET({} as never);
    const body = await response.text();
    const locs = [...body.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
    expect(locs).toEqual([
      'https://obentoo.org/',
      'https://obentoo.org/pt/',
      'https://obentoo.org/es/',
    ]);
  });

  it('emits hreflang alternates for each url', async () => {
    const response = await GET({} as never);
    const body = await response.text();
    expect(body).toContain('hreflang="en"');
    expect(body).toContain('hreflang="pt-BR"');
    expect(body).toContain('hreflang="es"');
    expect(body).toContain('hreflang="x-default"');
  });

  it('uses PUBLIC_SITE_URL when provided', async () => {
    vi.stubEnv('PUBLIC_SITE_URL', 'https://preview.obentoo.org');
    const response = await GET({} as never);
    const body = await response.text();
    expect(body).toContain('https://preview.obentoo.org/');
    expect(body).toContain('https://preview.obentoo.org/pt/');
  });

  it('matches snapshot (production baseline)', async () => {
    const response = await GET({} as never);
    const body = await response.text();
    expect(body).toMatchSnapshot();
  });
});
