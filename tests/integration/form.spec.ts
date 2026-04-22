import { test, expect } from '@playwright/test';

test.describe('subscribe form', () => {
  test('(1) happy path: mock 200 → form replaced by .bentoo-form-success', async ({
    page,
  }) => {
    let mockHits = 0;
    await page.route('**/buttondown.com/**', async (route) => {
      mockHits += 1;
      await route.fulfill({
        status: 200,
        contentType: 'text/html',
        body: '<html></html>',
      });
    });

    await page.goto('/v/v4/');
    await page.waitForSelector('form[data-bentoo-subscribe]');
    await page.fill('form[data-bentoo-subscribe] input[type="email"]', 'tester@example.com');
    await page.click('form[data-bentoo-subscribe] button[type="submit"]');

    await expect(page.locator('.bentoo-form-success')).toBeVisible();
    await expect(page.locator('form[data-bentoo-subscribe]')).toHaveCount(0);

    await expect.poll(() => mockHits, { timeout: 5000 }).toBeGreaterThanOrEqual(1);

    const cookies = await page.evaluate(() => document.cookie);
    expect(cookies).toBe('');
  });

  test('(2) failure path: mock never fulfills → error appears, email preserved', async ({
    page,
  }) => {
    await page.route('**/buttondown.com/**', () => {
      // Intentionally never fulfill — triggers the 10s handler timeout
    });

    await page.goto('/v/v4/');
    await page.waitForSelector('form[data-bentoo-subscribe]');
    const emailValue = 'preserve-me@example.com';
    await page.fill('form[data-bentoo-subscribe] input[type="email"]', emailValue);
    await page.click('form[data-bentoo-subscribe] button[type="submit"]');

    // form-handler's TIMEOUT_MS is 10_000 — wait 11s
    await page.waitForTimeout(11000);

    await expect(page.locator('.bentoo-form-error')).toBeVisible();
    const currentEmail = await page.inputValue(
      'form[data-bentoo-subscribe] input[type="email"]'
    );
    expect(currentEmail).toBe(emailValue);

    const cookies = await page.evaluate(() => document.cookie);
    expect(cookies).toBe('');
  });
});
