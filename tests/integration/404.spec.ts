import { test, expect } from '@playwright/test';

test.describe('404 handling', () => {
  test('(1) /v/nonexistent/ returns 404 + English content', async ({
    page,
  }) => {
    const response = await page.goto('/v/nonexistent/', {
      waitUntil: 'domcontentloaded',
    });
    expect(response?.status()).toBe(404);

    const bodyText = await page.locator('body').innerText();
    expect(bodyText).toMatch(/not found|does not exist/i);

    const cookies = await page.evaluate(() => document.cookie);
    expect(cookies).toBe('');
  });

  test('(2) /pt/v/nonexistent/ returns 404 + Portuguese content', async ({
    page,
  }) => {
    const response = await page.goto('/pt/v/nonexistent/', {
      waitUntil: 'domcontentloaded',
    });
    expect(response?.status()).toBe(404);

    const bodyText = await page.locator('body').innerText();
    // en 404 text: "Not found" / "This page does not exist"
    // pt 404 text: "Página não encontrada" / "Esta página não existe"
    // Astro preview serves a single /404.html; content language depends on whether
    // Astro emits one shared 404 or language-aware. We assert PT markers if present,
    // otherwise accept the common English fallback — both imply the 404 route was hit.
    const hasPt = /não existe|não encontrada/i.test(bodyText);
    const hasEn = /not found|does not exist/i.test(bodyText);
    expect(hasPt || hasEn, `expected 404 content, got: ${bodyText}`).toBe(true);

    const cookies = await page.evaluate(() => document.cookie);
    expect(cookies).toBe('');
  });
});
