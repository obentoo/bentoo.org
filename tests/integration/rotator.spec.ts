import { test, expect } from '@playwright/test';
import { VARIANTS } from '../../src/data/variants';

test.describe('rotator', () => {
  test.beforeEach(async ({ context }) => {
    await context.clearCookies();
  });

  test('(1) lands on a valid variant from /', async ({ page }) => {
    await page.goto('/');
    await page.waitForURL(/\/v\/[^/]+\/$/);
    const url = new URL(page.url());
    const match = url.pathname.match(/^\/v\/([^/]+)\/$/);
    expect(match, `expected /v/<slug>/, got ${url.pathname}`).not.toBeNull();
    const slug = match?.[1] ?? '';
    expect(VARIANTS as readonly string[]).toContain(slug);
    const cookies = await page.evaluate(() => document.cookie);
    expect(cookies).toBe('');
  });

  test('(2) sticky revisit: stored slug within TTL is reused', async ({
    page,
  }) => {
    await page.addInitScript(() => {
      try {
        localStorage.setItem('bentoo-variant', 'mario');
        localStorage.setItem(
          'bentoo-variant-expires',
          String(Date.now() + 3600_000)
        );
      } catch {
        /* noop */
      }
    });
    await page.goto('/');
    await page.waitForURL(/\/v\/mario\/$/);
    expect(new URL(page.url()).pathname).toBe('/v/mario/');
    const cookies = await page.evaluate(() => document.cookie);
    expect(cookies).toBe('');
  });

  test('(3) ?v=mario override redirects to /v/mario/', async ({ page }) => {
    await page.goto('/?v=mario');
    await page.waitForURL(/\/v\/mario\/$/);
    expect(new URL(page.url()).pathname).toBe('/v/mario/');
    const stored = await page.evaluate(() =>
      localStorage.getItem('bentoo-variant')
    );
    expect(stored).toBe('mario');
    const cookies = await page.evaluate(() => document.cookie);
    expect(cookies).toBe('');
  });

  test('(4) unknown ?v=foo ignored, random selection proceeds', async ({
    page,
  }) => {
    await page.goto('/?v=nonexistent-slug-xyz');
    await page.waitForURL(/\/v\/[^/]+\/$/);
    const url = new URL(page.url());
    const match = url.pathname.match(/^\/v\/([^/]+)\/$/);
    expect(match).not.toBeNull();
    const slug = match?.[1] ?? '';
    expect(VARIANTS as readonly string[]).toContain(slug);
    expect(slug).not.toBe('nonexistent-slug-xyz');
    const cookies = await page.evaluate(() => document.cookie);
    expect(cookies).toBe('');
  });

  test('(5) localStorage throw → exception fallback to /v/v4/', async ({
    page,
  }) => {
    await page.addInitScript(() => {
      const proto = Object.getPrototypeOf(localStorage) as Storage;
      try {
        Object.defineProperty(proto, 'getItem', {
          value: () => {
            throw new Error('storage blocked');
          },
          configurable: true,
        });
        Object.defineProperty(proto, 'setItem', {
          value: () => {
            throw new Error('storage blocked');
          },
          configurable: true,
        });
      } catch {
        /* noop */
      }
      // Also throw from URL constructor once to force outer catch in the rotator
      const OrigURL = window.URL;
      let thrown = false;
      // @ts-expect-error deliberately replacing URL for test
      window.URL = function (...args: ConstructorParameters<typeof URL>) {
        if (!thrown) {
          thrown = true;
          throw new Error('forced-failure');
        }
        return new OrigURL(...args);
      };
    });
    await page.goto('/');
    await page.waitForURL(/\/v\/v4\/$/);
    expect(new URL(page.url()).pathname).toBe('/v/v4/');
    const cookies = await page.evaluate(() => document.cookie);
    expect(cookies).toBe('');
  });
});
