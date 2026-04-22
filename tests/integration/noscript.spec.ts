import { test, expect } from '@playwright/test';
import { VARIANTS } from '../../src/data/variants';

test.describe('noscript fallback', () => {
  test.use({ javaScriptEnabled: false });

  test('(1) with JS disabled, / shows 21 anchor links and does not redirect', async ({
    page,
  }) => {
    const response = await page.goto('/', { waitUntil: 'domcontentloaded' });
    expect(response?.status()).toBe(200);

    // Rotator never ran: URL still at /
    expect(new URL(page.url()).pathname).toBe('/');

    // <noscript> block is rendered inline in the HTML — without JS, its
    // content becomes visible. Read the full DOM so we can verify anchors
    // regardless of hidden <noscript> rendering semantics.
    const html = await page.content();
    for (const slug of VARIANTS) {
      expect(html).toContain(`/v/${slug}/`);
    }

    // No cookies set (no scripts ran, and our baseline forbids cookies anyway)
    const cookies = await page.evaluate(() => document.cookie);
    expect(cookies).toBe('');
  });
});
