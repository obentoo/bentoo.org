import { test, expect } from '@playwright/test';

test.describe('SEO metadata', () => {
  test('(1) / emits JSON-LD SoftwareApplication', async ({ page }) => {
    // Use response-level fetch: navigating to / triggers the rotator redirect,
    // so we need the HTML before the redirect occurs.
    const response = await page.request.get('/');
    expect(response.status()).toBe(200);
    const html = await response.text();

    const match = html.match(
      /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/i
    );
    expect(match, 'expected <script type="application/ld+json"> on /').not.toBeNull();

    const jsonText = (match?.[1] ?? '').trim();
    const data = JSON.parse(jsonText) as {
      '@type'?: string;
      '@context'?: string;
    };
    expect(data['@context']).toBe('https://schema.org');
    expect(data['@type']).toBe('SoftwareApplication');
  });

  test('(2) variant page emits noindex,follow + canonical to root', async ({
    page,
  }) => {
    const response = await page.request.get('/v/v4/');
    expect(response.status()).toBe(200);
    const html = await response.text();

    expect(html).toMatch(
      /<meta\s+name=["']robots["']\s+content=["']noindex,follow["']/i
    );

    const canonicalMatch = html.match(
      /<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i
    );
    expect(canonicalMatch, 'canonical link missing on /v/v4/').not.toBeNull();
    const canonicalHref = canonicalMatch?.[1] ?? '';
    // Canonical must resolve to the root of the same language tree —
    // it ends with "/" and is NOT a /v/ URL.
    expect(canonicalHref.endsWith('/')).toBe(true);
    expect(canonicalHref).not.toMatch(/\/v\//);
  });

  test('(3) variant page emits hreflang alternates (en, pt-BR, x-default)', async ({
    page,
  }) => {
    const response = await page.request.get('/v/v4/');
    const html = await response.text();

    expect(html).toMatch(
      /<link\s+rel=["']alternate["']\s+hreflang=["']en["']/i
    );
    expect(html).toMatch(
      /<link\s+rel=["']alternate["']\s+hreflang=["']pt-BR["']/i
    );
    expect(html).toMatch(
      /<link\s+rel=["']alternate["']\s+hreflang=["']x-default["']/i
    );
  });

  test('(4) /sitemap.xml is 200 XML with one <loc> per locale', async ({
    page,
  }) => {
    const response = await page.request.get('/sitemap.xml');
    expect(response.status()).toBe(200);
    const contentType = response.headers()['content-type'] ?? '';
    expect(contentType).toMatch(/(application|text)\/xml/);

    const body = await response.text();
    const locMatches = body.match(/<loc>[^<]+<\/loc>/g) ?? [];
    expect(locMatches.length).toBe(3);
    expect(body).toMatch(/<loc>[^<]*\/<\/loc>/);
    expect(body).toMatch(/<loc>[^<]*\/pt\/<\/loc>/);
    expect(body).toMatch(/<loc>[^<]*\/es\/<\/loc>/);
  });
});
