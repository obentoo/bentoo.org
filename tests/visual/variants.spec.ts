import { test, expect } from '@playwright/test';
import { VARIANTS } from '../../src/data/variants';

// Fixed instant every capture renders at: the variants' live clocks read
// `new Date()`, so a moving clock would change pixels between runs.
const FROZEN_TIME = new Date('2026-10-01T12:00:00Z');

// Google Fonts stylesheet (css2?family=...) and font files (/s/<family>/...):
// the URL names the family, so a failure message can name it too.
const WEB_FONT_URL = /^https:\/\/fonts\.(googleapis|gstatic)\.com\//;

for (const slug of VARIANTS) {
  for (const lang of ['en', 'pt'] as const) {
    test(`${lang}/${slug}`, async ({ page }) => {
      const path = lang === 'pt' ? `/pt/v/${slug}/` : `/v/${slug}/`;

      // A failed font request leaves the page on a fallback font (a failed
      // stylesheet even leaves `document.fonts` empty), which the in-page
      // check below cannot see; record every failure to name it.
      const fontFailures: string[] = [];
      page.on('requestfailed', (request) => {
        if (WEB_FONT_URL.test(request.url())) {
          fontFailures.push(`${request.failure()?.errorText ?? 'failed'} ${request.url()}`);
        }
      });
      page.on('response', (response) => {
        // 304: a cache revalidation, served from the browser cache.
        if (WEB_FONT_URL.test(response.url()) && !response.ok() && response.status() !== 304) {
          fontFailures.push(`HTTP ${response.status()} ${response.url()}`);
        }
      });

      // Freeze time before the page exists: install() fakes Date and every
      // timer (setInterval, setTimeout, requestAnimationFrame), and pauseAt()
      // stops the fake clock, so the page renders at FROZEN_TIME and no
      // interval ever ticks.
      await page.clock.install({ time: FROZEN_TIME });
      await page.clock.pauseAt(FROZEN_TIME);

      await page.goto(path);
      // The Google Fonts stylesheet can arrive after `document.fonts.ready`
      // first resolves; wait until the network is quiet so the stylesheet and
      // the font files the layout asked for have all been fetched.
      await page.waitForLoadState('networkidle');
      expect(fontFailures, `web font requests failed on ${path}`).toEqual([]);

      const notLoaded = await page.evaluate(async () => {
        // Force a layout so every face the rendered text needs has been
        // requested, then wait for those loads to settle.
        document.body.getBoundingClientRect();
        await document.fonts.ready;
        // Google Fonts declares one face per unicode-range subset and the
        // browser fetches only the subsets the page's text uses, so faces it
        // never needed stay 'unloaded'; a face still 'loading' or in 'error'
        // would render with a fallback font.
        return [...document.fonts]
          .filter((face) => face.status === 'loading' || face.status === 'error')
          .map((face) => `${face.family} ${face.weight} ${face.style} (${face.status})`);
      });
      expect(notLoaded, `web fonts not loaded on ${path}`).toEqual([]);

      await expect(page).toHaveScreenshot({ fullPage: true });
    });
  }
}
