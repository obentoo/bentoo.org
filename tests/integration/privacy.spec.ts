import { test, expect, type Page } from '@playwright/test';

// Mirrors siteOrigin() in src/utils/siteUrl.ts: the webServer build inherits
// this environment, so the pages carry the same origin.
const ORIGIN = (process.env.PUBLIC_SITE_URL || 'https://obentoo.org').replace(/\/$/, '');

const PRIVACY = {
  en: '/privacy/',
  'pt-BR': '/pt/privacy/',
  es: '/es/privacy/',
} as const;

async function headLinks(page: Page) {
  const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
  const alternates = await page
    .locator('link[rel="alternate"][hreflang]')
    .evaluateAll((els) =>
      Object.fromEntries(els.map((e) => [e.getAttribute('hreflang'), e.getAttribute('href')]))
    );
  return { canonical, alternates };
}

test.describe('privacy page + consent', () => {
  test('(1) each privacy page renders, mentions Buttondown and declares itself canonical with hreflang to every locale', async ({
    page,
  }) => {
    const expectedAlternates = {
      en: `${ORIGIN}${PRIVACY.en}`,
      'pt-BR': `${ORIGIN}${PRIVACY['pt-BR']}`,
      es: `${ORIGIN}${PRIVACY.es}`,
      'x-default': `${ORIGIN}${PRIVACY.en}`,
    };

    for (const path of Object.values(PRIVACY)) {
      const response = await page.goto(path, { waitUntil: 'domcontentloaded' });
      expect(response?.status(), path).toBe(200);

      const bodyText = await page.locator('body').innerText();
      expect(bodyText, path).toMatch(/Buttondown/);

      // Own URL as canonical, never the locale root.
      const { canonical, alternates } = await headLinks(page);
      expect(canonical, path).toBe(`${ORIGIN}${path}`);
      expect(alternates, path).toEqual(expectedAlternates);

      const cookies = await page.evaluate(() => document.cookie);
      expect(cookies, path).toBe('');
    }
  });

  test('(2) the consent-notice privacy link on a variant opens the privacy page of that locale', async ({
    page,
  }) => {
    for (const [variant, lang, href] of [
      ['/v/v4/', 'en', '/privacy'],
      ['/pt/v/v4/', 'pt-BR', '/pt/privacy'],
    ] as const) {
      await page.goto(variant);
      const privacyLink = page.locator('.privacy-consent a[href$="/privacy"]');
      await expect(privacyLink, variant).toHaveCount(1);
      await expect(privacyLink, variant).toHaveAttribute('href', href);

      // The preview server answers /privacy directly; production redirects it
      // to /privacy/. Either spelling is the same page.
      await Promise.all([
        page.waitForURL((url) => url.pathname.replace(/\/$/, '') === href),
        privacyLink.click(),
      ]);
      await expect(page.locator('html'), variant).toHaveAttribute('lang', lang);
      const { canonical } = await headLinks(page);
      expect(canonical, variant).toBe(`${ORIGIN}${PRIVACY[lang]}`);

      const cookies = await page.evaluate(() => document.cookie);
      expect(cookies, variant).toBe('');
    }
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
