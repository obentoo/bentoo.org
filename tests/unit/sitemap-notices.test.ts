// Story 002, Task 4.3 — the sitemap lists the notice index and pages (R5.4).
import { describe, it, expect, afterEach, vi } from 'vitest';
import { noticeSchema } from '~/content/noticeSchema';
import { GET } from '~/pages/sitemap.xml';

// sitemap.xml.ts reads astro:content once it lists notices; vitest resolves it
// only through an alias to a stub in vitest.config.ts, replaced here.
const collection = vi.hoisted(() => ({ entries: [] as { id: string; data: unknown }[] }));
vi.mock('astro:content', () => ({
  getCollection: async (name: string, filter?: (e: unknown) => boolean) => {
    const all = name === 'notices' ? collection.entries : [];
    return filter ? all.filter(filter) : all;
  },
}));

const SM = 'http://www.sitemaps.org/schemas/sitemap/0.9';
const XHTML = 'http://www.w3.org/1999/xhtml';
const O = 'https://preview.example.test';

const entry = (id: string) => ({
  id,
  data: noticeSchema.parse({
    id,
    type: 'news',
    severity: 'info',
    title: id,
    summary: 's',
    body: 'b',
    published: '2026-10-02T14:00:00Z',
    updated: '2026-10-02T14:00:00Z',
  }),
});

async function sitemap(): Promise<Map<string, Record<string, string>>> {
  const body = await (await GET({} as never)).text();
  const doc = new DOMParser().parseFromString(body, 'application/xml');
  expect(doc.getElementsByTagName('parsererror')).toHaveLength(0);
  const urls = new Map<string, Record<string, string>>();
  for (const url of Array.from(doc.getElementsByTagNameNS(SM, 'url'))) {
    const loc = url.getElementsByTagNameNS(SM, 'loc')[0].textContent ?? '';
    expect(urls.has(loc), `duplicate <loc> ${loc}`).toBe(false);
    const alts: Record<string, string> = {};
    for (const l of Array.from(url.getElementsByTagNameNS(XHTML, 'link'))) {
      alts[l.getAttribute('hreflang') ?? ''] = l.getAttribute('href') ?? '';
    }
    urls.set(loc, alts);
  }
  return urls;
}

const localized = (p: string) => ({ en: `${O}${p}`, 'pt-BR': `${O}/pt${p}`, es: `${O}/es${p}`, 'x-default': `${O}${p}` });

afterEach(() => {
  vi.unstubAllEnvs();
  collection.entries = [];
});

describe('sitemap.xml with notices (R5.4)', () => {
  it('lists the roots, the notice index and every notice page in every locale', async () => {
    vi.stubEnv('PUBLIC_SITE_URL', O);
    collection.entries = [entry('2026-10-02-gtk+-fix'), entry('2026-10-02-gtk-fix')];
    const locs = [...(await sitemap()).keys()].sort();
    const expected = ['/', '/notices/', '/notices/2026-10-02-gtk+-fix/', '/notices/2026-10-02-gtk-fix/']
      .flatMap((p) => Object.values(localized(p)).slice(0, 3))
      .sort();
    expect(locs).toEqual(expected);
  });

  // Hostile half: a notice page's alternates must point at that page in each
  // locale, not at the locale roots the existing pattern emits.
  it("gives each notice page and the index their own alternates", async () => {
    vi.stubEnv('PUBLIC_SITE_URL', O);
    collection.entries = [entry('2026-10-02-gtk+-fix')];
    const urls = await sitemap();
    for (const p of ['/notices/', '/notices/2026-10-02-gtk+-fix/']) {
      for (const loc of Object.values(localized(p)).slice(0, 3)) {
        expect(urls.get(loc), loc).toEqual(localized(p));
      }
    }
  });

  it('keeps the root entries and their alternates unchanged', async () => {
    vi.stubEnv('PUBLIC_SITE_URL', O);
    collection.entries = [entry('2026-10-02-x')];
    const urls = await sitemap();
    expect(urls.get(`${O}/`)).toEqual(localized('/'));
    expect(urls.get(`${O}/pt/`)).toEqual(localized('/'));
  });

  it('lists the notice index even with no notices', async () => {
    vi.stubEnv('PUBLIC_SITE_URL', O);
    expect([...(await sitemap()).keys()].sort()).toEqual(
      [...Object.values(localized('/')).slice(0, 3), ...Object.values(localized('/notices/')).slice(0, 3)].sort()
    );
  });

  it('uses the canonical origin when PUBLIC_SITE_URL is empty', async () => {
    vi.stubEnv('PUBLIC_SITE_URL', '');
    collection.entries = [entry('2026-10-02-x')];
    for (const loc of (await sitemap()).keys()) expect(loc.startsWith('https://obentoo.org/'), loc).toBe(true);
  });
});
