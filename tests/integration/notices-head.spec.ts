// Story 002, Task 4 review fixes: what the notice pages declare about
// themselves beyond the frozen R5 specs.
import { test, expect } from '@playwright/test';

const PAGES = ['/notices/', '/pt/notices/', '/notices/2026-09-28-edge+case_1/', '/es/notices/2026-09-28-edge+case_1/'];

for (const path of PAGES) {
  test(`${path} carries no SoftwareApplication JSON-LD`, async ({ page }) => {
    // The layout's JSON-LD describes the Bentoo application; on a notice page
    // it would present the notice summary as the application's description,
    // and a summary is author text that must not reach a raw <script>.
    await page.goto(path);
    await expect(page.locator('script[type="application/ld+json"]')).toHaveCount(0);
  });

  test(`${path} marks its chrome with the page's own language code`, async ({ page }) => {
    await page.goto(path);
    const htmlLang = await page.locator('html').getAttribute('lang');
    const chromeLangs = await page
      .locator('main [lang]:not([lang="en"])')
      .evaluateAll((els) => els.map((e) => e.getAttribute('lang')));
    for (const l of chromeLangs) expect(l).toBe(htmlLang);
  });
}

// Read the served HTML: the home page's rotator may navigate to a variant.
test('the home page keeps its JSON-LD', async ({ request }) => {
  const html = await (await request.get('/')).text();
  expect(html.match(/<script type="application\/ld\+json"/g) ?? []).toHaveLength(1);
});
