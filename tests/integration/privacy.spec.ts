import { test, expect } from '@playwright/test';

test.describe('privacy page + consent', () => {
  test('(1) /privacy renders + mentions Buttondown + has pt sibling link', async ({
    page,
  }) => {
    const response = await page.goto('/privacy', {
      waitUntil: 'domcontentloaded',
    });
    expect(response?.status()).toBe(200);

    const bodyText = await page.locator('body').innerText();
    expect(bodyText).toMatch(/Buttondown/);

    // Footer language toggle points to the pt sibling /pt/privacy
    const toggle = page.locator('a[data-bentoo-lang-toggle]').first();
    await expect(toggle).toHaveAttribute('href', '/pt/privacy');

    const cookies = await page.evaluate(() => document.cookie);
    expect(cookies).toBe('');
  });

  test('(2) footer privacy link from /v/v4/ resolves to /privacy', async ({
    page,
  }) => {
    await page.goto('/v/v4/');
    const privacyLink = page.locator('footer.bentoo-footer a[href="/privacy"]');
    await expect(privacyLink).toHaveCount(1);
    await Promise.all([
      page.waitForURL(/\/privacy$/),
      privacyLink.click(),
    ]);
    expect(new URL(page.url()).pathname).toBe('/privacy');

    const cookies = await page.evaluate(() => document.cookie);
    expect(cookies).toBe('');
  });

  test('(3) privacy consent text present next to subscribe form on variant', async ({
    page,
  }) => {
    await page.goto('/v/v4/');
    await page.waitForSelector('form[data-bentoo-subscribe]');
    const consent = page.locator('.privacy-consent');
    await expect(consent).toBeVisible();
    const consentLink = consent.locator('a[href="/privacy"]');
    await expect(consentLink).toHaveCount(1);

    const cookies = await page.evaluate(() => document.cookie);
    expect(cookies).toBe('');
  });
});
