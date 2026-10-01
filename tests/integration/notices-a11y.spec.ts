// Story 002, Task 4.3 — axe reports no violation on the notice pages (R5.5).
// Unlike a11y.spec.ts (variant pages, allowlisted rules), every WCAG 2 A/AA
// rule is enforced here, color-contrast included: R5.5 says "no violation".
import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

async function audit(page: Page, route: string) {
  const res = await page.goto(route, { waitUntil: 'domcontentloaded' });
  expect(res?.status(), route).toBe(200);
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
  expect(results.violations, `violations on ${route}: ${JSON.stringify(results.violations, null, 2)}`).toEqual([]);
}

for (const route of ['/notices/', '/pt/notices/', '/es/notices/']) {
  test(`a11y ${route}`, async ({ page }) => {
    await audit(page, route);
  });
}

test('a11y notice pages', async ({ page, request }) => {
  const items = (await (await request.get('/notices.json')).json()).items as { id: string }[];
  test.skip(items.length === 0, 'no notice in the build: build with NOTICES_DIR=tests/fixtures/notices');
  for (const { id } of items) {
    await audit(page, `/notices/${id}/`);
    await audit(page, `/pt/notices/${id}/`);
  }
});
