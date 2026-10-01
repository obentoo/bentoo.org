import { test, expect } from '@playwright/test';

test.describe('language routing', () => {
  test('(1) language picker navigates + persists bentoo-lang', async ({
    page,
  }) => {
    await page.goto('/v/v4/');
    const trigger = page.locator('[data-bd-lang-trigger]');
    await trigger.click();
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');

    const ptItem = page.locator('.bd-lang-item[data-target-lang="pt"]');
    await expect(ptItem).toHaveAttribute('href', '/pt/v/v4/');

    await Promise.all([
      page.waitForURL(/\/pt\/v\/v4\/$/),
      ptItem.click(),
    ]);

    expect(page.url()).toMatch(/\/pt\/v\/v4\/$/);
    const stored = await page.evaluate(() =>
      localStorage.getItem('bentoo-lang')
    );
    expect(stored).toBe('pt');

    const cookies = await page.evaluate(() => document.cookie);
    expect(cookies).toBe('');
  });

  test('(2) navigator.language=pt + no bentoo-lang redirects / to /pt/', async ({
    page,
  }) => {
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'language', {
        value: 'pt-BR',
        configurable: true,
      });
      Object.defineProperty(navigator, 'languages', {
        value: ['pt-BR', 'pt'],
        configurable: true,
      });
    });

    await page.goto('/');
    // First redirect: / → /pt/, then rotator picks variant → /pt/v/<slug>/
    await page.waitForURL(/\/pt\/v\/[^/]+\/$/);
    expect(page.url()).toMatch(/\/pt\/v\/[^/]+\/$/);

    const cookies = await page.evaluate(() => document.cookie);
    expect(cookies).toBe('');
  });

  test('(3) bentoo-lang=en overrides navigator.language=pt', async ({
    page,
  }) => {
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'language', {
        value: 'pt-BR',
        configurable: true,
      });
      Object.defineProperty(navigator, 'languages', {
        value: ['pt-BR', 'pt'],
        configurable: true,
      });
      try {
        localStorage.setItem('bentoo-lang', 'en');
        localStorage.setItem(
          'bentoo-lang-expires',
          String(Date.now() + 3600_000)
        );
      } catch {
        /* noop */
      }
    });

    await page.goto('/');
    await page.waitForURL(/\/v\/[^/]+\/$/);
    expect(page.url()).not.toMatch(/\/pt\//);

    const cookies = await page.evaluate(() => document.cookie);
    expect(cookies).toBe('');
  });

  test('(4) navigator.language=es-ES + no bentoo-lang redirects / to /es/', async ({
    page,
  }) => {
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'language', {
        value: 'es-ES',
        configurable: true,
      });
      Object.defineProperty(navigator, 'languages', {
        value: ['es-ES', 'es'],
        configurable: true,
      });
    });

    await page.goto('/');
    await page.waitForURL(/\/es\/v\/[^/]+\/$/);
    expect(page.url()).toMatch(/\/es\/v\/[^/]+\/$/);

    const cookies = await page.evaluate(() => document.cookie);
    expect(cookies).toBe('');
  });
});
