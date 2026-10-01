// Story 002, Task 4.2 — notice pages, index, localized chrome, per-page canonical (R5.1–R5.3).
// Notices are discovered from the built /notices.json; the integration build
// uses NOTICES_DIR=tests/fixtures/notices. With an empty collection the
// per-notice checks are skipped with a reason.
import { test, expect, type APIRequestContext } from '@playwright/test';
import { strings as en } from '../../src/i18n/en';
import { strings as pt } from '../../src/i18n/pt';
import { strings as es } from '../../src/i18n/es';

type Item = {
  id: string;
  title: string;
  content_text: string;
  date_published: string;
  date_modified: string;
  _bentoo: { type: string; severity: string; affects: { cp: string; slot?: string; ranges: { op: string; ver: string }[] }[] };
};
const S = { en, pt, es } as unknown as Record<string, Record<string, string>>;
const NO_NOTICES = 'no notice in the build: build with NOTICES_DIR=tests/fixtures/notices';

async function items(request: APIRequestContext): Promise<Item[]> {
  const res = await request.get('/notices.json');
  expect(res.status()).toBe(200);
  return (await res.json()).items as Item[];
}

async function head(request: APIRequestContext, p: string) {
  const res = await request.get(p);
  expect(res.status(), p).toBe(200);
  const html = await res.text();
  const tags = [...html.matchAll(/<link\b[^>]*>/gi)].map((m) => m[0]);
  const attr = (tag: string, name: string) => tag.match(new RegExp(`\\b${name}=["']([^"']*)["']`, 'i'))?.[1];
  const canonical = tags.find((t) => attr(t, 'rel') === 'canonical');
  const alternates: Record<string, string> = {};
  for (const t of tags) {
    const hl = attr(t, 'hreflang');
    if (attr(t, 'rel') === 'alternate' && hl) alternates[hl] = new URL(attr(t, 'href') ?? '').pathname;
  }
  return { html, canonical: new URL(attr(canonical ?? '', 'href') ?? '').pathname, alternates };
}

const localized = (p: string) => ({ en: p, 'pt-BR': `/pt${p}`, es: `/es${p}`, 'x-default': p });

test.describe('notice pages (R5.1)', () => {
  test('each notice page renders title, type, severity, affected atoms, dates and body', async ({ page, request }) => {
    const all = await items(request);
    test.skip(all.length === 0, NO_NOTICES);
    for (const item of all) {
      const res = await page.goto(`/notices/${item.id}/`);
      expect(res?.status(), item.id).toBe(200);
      await expect(page.locator('h1')).toContainText(item.title);
      const body = await page.locator('body').innerText();
      expect(body).toContain(en[`noticeType_${item._bentoo.type}` as keyof typeof en]);
      expect(body).toContain(en[`noticeSeverity_${item._bentoo.severity}` as keyof typeof en]);
      for (const a of item._bentoo.affects) {
        if (a.ranges.length === 0) expect(body).toContain(a.cp);
        for (const r of a.ranges) expect(body).toContain(`${r.op}${a.cp}-${r.ver}`);
        if (a.slot) expect(body).toContain(a.slot);
      }
      const times = await page.locator('time[datetime]').evaluateAll((els) =>
        els.map((e) => Date.parse(e.getAttribute('datetime') ?? ''))
      );
      expect(times).toContain(Date.parse(item.date_published));
      expect(times).toContain(Date.parse(item.date_modified));
      for (const para of item.content_text.split(/\n\s*\n/).map((p) => p.trim().replace(/\s+/g, ' ')).filter(Boolean)) {
        expect(body.replace(/\s+/g, ' ')).toContain(para);
      }
    }
  });
});

test.describe('notice index (R5.2)', () => {
  test('lists every notice in the feed order with title, type, severity and update date, linking to its page', async ({ page, request }) => {
    const all = await items(request);
    const res = await page.goto('/notices/');
    expect(res?.status()).toBe(200);
    if (all.length === 0) {
      await expect(page.locator('body')).toContainText(en.noticesEmpty);
      return;
    }
    const hrefs = await page.locator('main a[href*="/notices/"]').evaluateAll((els) =>
      els.map((e) => new URL((e as HTMLAnchorElement).href).pathname).filter((p) => /^\/notices\/[^/]+\/$/.test(p))
    );
    // /notices.json already lists the items in the R3.5 order.
    expect([...new Set(hrefs)]).toEqual(all.map((i) => `/notices/${i.id}/`));
    for (const item of all) {
      const row = page
        .locator(`a[href$="/notices/${item.id}/"]`)
        .first()
        .locator('xpath=ancestor::*[self::li or self::article or self::tr][1]');
      await expect(row).toContainText(item.title);
      await expect(row).toContainText(en[`noticeType_${item._bentoo.type}` as keyof typeof en]);
      await expect(row).toContainText(en[`noticeSeverity_${item._bentoo.severity}` as keyof typeof en]);
      const times = await row.locator('time[datetime]').evaluateAll((els) =>
        els.map((e) => Date.parse(e.getAttribute('datetime') ?? ''))
      );
      expect(times, item.id).toContain(Date.parse(item.date_modified));
    }
  });

  test('ends with visible links to both feeds, after the last notice', async ({ page, request }) => {
    const all = await items(request);
    await page.goto('/notices/');
    await expect(page.locator('main')).toContainText(en.noticesFeedLinks);
    for (const feed of ['/notices.json', '/notices.atom']) {
      const link = page.locator(`main a[href$="${feed}"]`);
      await expect(link, feed).toHaveCount(1);
      await expect(link, feed).toBeVisible();
      if (all.length === 0) continue;
      const last = page.locator(`main a[href$="/notices/${all[all.length - 1].id}/"]`).first();
      const after = await last.evaluate(
        (a, sel) => {
          const f = document.querySelector(sel);
          return !!f && !!(a.compareDocumentPosition(f) & Node.DOCUMENT_POSITION_FOLLOWING);
        },
        `main a[href$="${feed}"]`
      );
      expect(after, `${feed} link follows the list`).toBe(true);
    }
  });
});

test.describe('locales, canonical and hreflang (R5.3)', () => {
  test('the index has its own canonical and hreflang alternates in every locale', async ({ request }) => {
    for (const [lang, p] of [['en', '/notices/'], ['pt', '/pt/notices/'], ['es', '/es/notices/']] as const) {
      const h = await head(request, p);
      expect(h.canonical, p).toBe(p);
      expect(h.alternates, p).toEqual(localized('/notices/'));
      expect(h.html, p).toContain(S[lang].noticesTitle);
    }
  });

  // Hostile half: a notice page must not declare the locale root canonical.
  test('each notice page declares itself canonical, with alternates to its locale twins', async ({ request }) => {
    const all = await items(request);
    test.skip(all.length === 0, NO_NOTICES);
    const canonicals = new Set<string>();
    for (const item of all) {
      for (const prefix of ['', '/pt', '/es']) {
        const p = `${prefix}/notices/${item.id}/`;
        const h = await head(request, p);
        expect(h.canonical, p).toBe(p);
        expect(h.alternates, p).toEqual(localized(`/notices/${item.id}/`));
        canonicals.add(h.canonical);
      }
    }
    expect(canonicals.size).toBe(all.length * 3);
  });

  test('pt and es notice pages show their locale chrome with the notice in English', async ({ page, request }) => {
    const all = await items(request);
    test.skip(all.length === 0, NO_NOTICES);
    const item = all[0];
    for (const [lang, htmlLang] of [['pt', 'pt-BR'], ['es', 'es']] as const) {
      await page.goto(`/${lang}/notices/${item.id}/`);
      await expect(page.locator('html')).toHaveAttribute('lang', htmlLang);
      await expect(page.locator('h1')).toContainText(item.title);
      await expect(page.locator('body')).toContainText(S[lang].noticePublished);
      await expect(page.locator('body')).toContainText(S[lang][`noticeType_${item._bentoo.type}`]);
    }
    await page.goto('/es/notices/');
    const hrefs = await page.locator(`a[href*="/notices/${item.id}/"]`).evaluateAll((els) =>
      els.map((e) => new URL((e as HTMLAnchorElement).href).pathname)
    );
    expect(hrefs).toContain(`/es/notices/${item.id}/`);
  });

  // Converse: the BaseLayout change must leave the locale roots as they were.
  test('the locale roots keep their canonical and alternates', async ({ request }) => {
    for (const p of ['/', '/pt/', '/es/']) {
      const h = await head(request, p);
      expect(h.canonical, p).toBe(p);
      expect(h.alternates, p).toEqual(localized('/'));
    }
  });
});
