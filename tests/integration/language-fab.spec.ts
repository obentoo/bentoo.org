import { test, expect } from '@playwright/test';

test.describe('floating language picker (FAB above the shuffle cube)', () => {
  test('(1) trigger toggles is-open + aria-expanded', async ({ page }) => {
    await page.goto('/v/v4/');
    const fab = page.locator('[data-bd-lang-fab]');
    const trigger = page.locator('[data-bd-lang-trigger]');

    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect(fab).not.toHaveClass(/is-open/);

    await trigger.click();
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await expect(fab).toHaveClass(/is-open/);

    await trigger.click();
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect(fab).not.toHaveClass(/is-open/);
  });

  test('(2) ESC closes the menu', async ({ page }) => {
    await page.goto('/v/v4/');
    const fab = page.locator('[data-bd-lang-fab]');
    const trigger = page.locator('[data-bd-lang-trigger]');

    await trigger.click();
    await expect(fab).toHaveClass(/is-open/);

    await page.keyboard.press('Escape');
    await expect(fab).not.toHaveClass(/is-open/);
  });

  test('(3) click outside closes the menu', async ({ page }) => {
    await page.goto('/v/v4/');
    const fab = page.locator('[data-bd-lang-fab]');
    const trigger = page.locator('[data-bd-lang-trigger]');

    await trigger.click();
    await expect(fab).toHaveClass(/is-open/);

    // Click on the page background (top-left area, far from the FAB).
    await page.mouse.click(20, 20);
    await expect(fab).not.toHaveClass(/is-open/);
  });

  test('(4) clicking pt menu item navigates + persists bentoo-lang', async ({
    page,
  }) => {
    await page.goto('/v/v4/');
    // Open the menu programmatically — DOM-stable, avoids stagger race.
    await page.evaluate(() => {
      (document.querySelector('[data-bd-lang-trigger]') as HTMLButtonElement).click();
    });
    const ptItem = page.locator('.bd-lang-item[data-target-lang="pt"]');
    await expect(ptItem).toHaveAttribute('href', '/pt/v/v4/');
    await expect(ptItem).toHaveAttribute('hreflang', 'pt-BR');

    await Promise.all([
      page.waitForURL(/\/pt\/v\/v4\/$/),
      page.evaluate(() => {
        (document.querySelector('.bd-lang-item[data-target-lang="pt"]') as HTMLAnchorElement).click();
      }),
    ]);

    expect(page.url()).toMatch(/\/pt\/v\/v4\/$/);
    const stored = await page.evaluate(() =>
      localStorage.getItem('bentoo-lang')
    );
    expect(stored).toBe('pt');

    const cookies = await page.evaluate(() => document.cookie);
    expect(cookies).toBe('');
  });

  test('(5) trigger reflects current language across en/pt/es', async ({
    page,
  }) => {
    for (const { path, expectedTargets } of [
      { path: '/v/v4/', expectedTargets: ['pt', 'es'] },
      { path: '/pt/v/v4/', expectedTargets: ['en', 'es'] },
      { path: '/es/v/v4/', expectedTargets: ['en', 'pt'] },
    ]) {
      await page.goto(path);
      const items = page.locator('.bd-lang-item');
      await expect(items).toHaveCount(2);
      const targets = await items.evaluateAll((nodes) =>
        nodes.map((n) => n.getAttribute('data-target-lang'))
      );
      expect(targets).toEqual(expectedTargets);
    }
  });
});
