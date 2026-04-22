import { test, expect } from '@playwright/test';
import { VARIANTS } from '../../src/data/variants';

for (const slug of VARIANTS) {
  for (const lang of ['en', 'pt'] as const) {
    test(`${lang}/${slug}`, async ({ page }) => {
      const path = lang === 'pt' ? `/pt/v/${slug}/` : `/v/${slug}/`;
      await page.goto(path);
      await page.evaluate(() =>
        document.fonts ? document.fonts.ready : Promise.resolve()
      );
      await expect(page).toHaveScreenshot({ fullPage: true });
    });
  }
}
