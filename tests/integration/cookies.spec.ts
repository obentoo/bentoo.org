import { test, expect } from '@playwright/test';

/**
 * Comprehensive zero-cookie invariant (R2.7, R6.1, R6.2, R6.7): after a
 * rotator redirect + form submission + language switch (floating picker),
 * document.cookie must remain empty. Other specs also assert document.cookie === '' as a
 * closing invariant per their own scenario; this test stitches the three
 * together end-to-end.
 */
test('zero cookies after rotator + form submit + language switch', async ({
  page,
  context,
}) => {
  await context.clearCookies();

  let mockHits = 0;
  await page.route('**/buttondown.com/**', async (route) => {
    mockHits += 1;
    await route.fulfill({
      status: 200,
      contentType: 'text/html',
      body: '<html></html>',
    });
  });

  // 1. Let the rotator redirect from / to a variant page. Pin the variant
  //    via ?v=v4 so the test isn't flaky when the rotator picks a variant
  //    whose internal <footer> overlaps the BaseLayout footer.
  await page.goto('/?v=v4');
  await page.waitForURL(/\/v\/v4\/$/);

  let cookies = await page.evaluate(() => document.cookie);
  expect(cookies, 'cookies after rotator').toBe('');

  // 2. Submit the subscribe form (mocked 200 → success paragraph).
  await page.waitForSelector('form[data-bentoo-subscribe]');
  await page.fill(
    'form[data-bentoo-subscribe] input[type="email"]',
    'cookie-test@example.com'
  );
  await page.click('form[data-bentoo-subscribe] button[type="submit"]');
  await expect(page.locator('.bentoo-form-success')).toBeVisible();
  await expect.poll(() => mockHits).toBeGreaterThanOrEqual(1);

  cookies = await page.evaluate(() => document.cookie);
  expect(cookies, 'cookies after form submit').toBe('');

  // 3. Switch language through the floating language picker (FAB):
  //    open the menu, choose pt → navigates to the pt sibling.
  const trigger = page.locator('[data-bd-lang-trigger]');
  await trigger.click();
  await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  const ptItem = page.locator('.bd-lang-item[data-target-lang="pt"]');
  await Promise.all([
    page.waitForURL(/\/pt\/v\/[^/]+\/$/),
    ptItem.click(),
  ]);

  cookies = await page.evaluate(() => document.cookie);
  expect(cookies, 'cookies after language switch').toBe('');

  // 4. Browser-level cookie jar must also be empty.
  const jarCookies = await context.cookies();
  expect(jarCookies, 'browser cookie jar').toEqual([]);
});
