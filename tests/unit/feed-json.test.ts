// Story 002, Task 3.1 — JSON Feed builder and build clock (R3.1–R3.6).
import { describe, it, expect, afterEach, vi } from 'vitest';
import { noticeSchema } from '~/content/noticeSchema';
import { buildJsonFeed, sortNotices, type Notice } from '~/utils/feed';

const ORIGIN = 'https://obentoo.org';
const NOW = new Date('2026-10-01T00:00:00Z');
const RFC3339_UTC = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/;

const BASE = {
  id: '2026-10-02-foo-cve',
  type: 'security',
  severity: 'critical',
  title: 'foo 1.2 heap overflow',
  summary: 'A heap overflow in foo before 1.2.3.',
  body: 'First paragraph.\n\nSecond paragraph.',
  affects: [
    {
      cp: 'dev-libs/foo',
      slot: '1',
      ranges: [
        { op: '>=', ver: '1.0' },
        { op: '<', ver: '1.2.3' },
      ],
    },
  ],
  published: '2026-10-02T14:00:00Z',
  updated: '2026-10-02T14:00:00Z',
};

const notice = (over: Record<string, unknown> = {}): Notice => noticeSchema.parse({ ...BASE, ...over });

const news = (id: string, updated: string, published = '2026-09-01T00:00:00Z'): Notice =>
  notice({ id, type: 'news', severity: 'info', affects: [], published, updated });

function feedOf(ns: Notice[], now: Date = NOW, origin: string = ORIGIN) {
  const text = buildJsonFeed(ns, now, origin);
  return { text, doc: JSON.parse(text) };
}

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('the feed document (R3.1)', () => {
  it('carries the JSON Feed 1.1 fields in the fixed key order', () => {
    const { doc } = feedOf([notice()]);
    expect(Object.keys(doc)).toEqual([
      'version',
      'title',
      'home_page_url',
      'feed_url',
      'language',
      '_bentoo',
      'items',
    ]);
    expect(doc.version).toBe('https://jsonfeed.org/version/1.1');
    expect(doc.title).toBe('bentoo notices');
    expect(doc.home_page_url).toBe(`${ORIGIN}/notices/`);
    expect(doc.feed_url).toBe(`${ORIGIN}/notices.json`);
    expect(doc.language).toBe('en');
  });

  it('is 2-space indented JSON ending in exactly one newline', () => {
    const { text, doc } = feedOf([notice()]);
    expect(text).toBe(JSON.stringify(doc, null, 2) + '\n');
    expect(text.endsWith('\n\n')).toBe(false);
  });

  it('builds every URL from the origin argument, not from the environment', () => {
    vi.stubEnv('PUBLIC_SITE_URL', 'https://env.example.test');
    const { text, doc } = feedOf([notice()], NOW, 'https://param.example.test');
    expect(doc.home_page_url).toBe('https://param.example.test/notices/');
    expect(doc.feed_url).toBe('https://param.example.test/notices.json');
    expect(doc.items[0].url).toBe('https://param.example.test/notices/2026-10-02-foo-cve/');
    expect(text).not.toContain('env.example.test');
  });
});

describe('feed-level _bentoo (R3.4)', () => {
  it('serial is the build time in whole Unix seconds; expires is 30 days later', () => {
    const { doc } = feedOf([]);
    expect(Object.keys(doc._bentoo)).toEqual(['serial', 'expires']);
    expect(doc._bentoo.serial).toBe(1790812800);
    expect(Number.isInteger(doc._bentoo.serial)).toBe(true);
    expect(doc._bentoo.expires).toBe('2026-10-31T00:00:00Z');
  });

  it('drops milliseconds: serial is floored, expires carries none', () => {
    const { doc } = feedOf([], new Date('2026-10-01T00:00:00.999Z'));
    expect(doc._bentoo.serial).toBe(1790812800);
    expect(doc._bentoo.expires).toMatch(RFC3339_UTC);
    expect(doc._bentoo.expires).toBe('2026-10-31T00:00:00Z');
  });

  // 30 days is 30 × 24 h of UTC time. Adding calendar days in local time would
  // shift expires by an hour across a daylight-saving change.
  it('expires does not move across a daylight-saving change of the build host', () => {
    vi.stubEnv('TZ', 'Europe/Berlin');
    const before = new Date(2026, 9, 1).getTimezoneOffset();
    const after = new Date(2026, 9, 31).getTimezoneOffset();
    expect(before, 'the time zone did not take effect; the test would be vacuous').not.toBe(after);
    expect(feedOf([]).doc._bentoo.expires).toBe('2026-10-31T00:00:00Z');
  });
});

describe('items (R3.2, R3.3)', () => {
  it('carry the item fields in the fixed key order', () => {
    const [item] = feedOf([notice()]).doc.items;
    expect(Object.keys(item)).toEqual([
      'id',
      'url',
      'title',
      'summary',
      'content_text',
      'date_published',
      'date_modified',
      '_bentoo',
    ]);
    expect(Object.keys(item._bentoo)).toEqual(['type', 'severity', 'affects']);
    expect(Object.keys(item._bentoo.affects[0])).toEqual(['cp', 'slot', 'ranges']);
    expect(Object.keys(item._bentoo.affects[0].ranges[0])).toEqual(['op', 'ver']);
  });

  it('map the notice fields', () => {
    const [item] = feedOf([notice()]).doc.items;
    expect(item.id).toBe('2026-10-02-foo-cve');
    expect(item.url).toBe(`${ORIGIN}/notices/2026-10-02-foo-cve/`);
    expect(item.title).toBe(BASE.title);
    expect(item.summary).toBe(BASE.summary);
    expect(item.content_text).toBe(BASE.body);
    expect(item._bentoo.type).toBe('security');
    expect(item._bentoo.severity).toBe('critical');
  });

  it('content_text is the body verbatim, paragraphs and trailing newline included', () => {
    const body = 'First paragraph,\nwrapped.\n\nSecond paragraph.\n';
    expect(feedOf([notice({ body })]).doc.items[0].content_text).toBe(body);
  });

  it('write timestamps as RFC 3339 UTC without milliseconds', () => {
    const [item] = feedOf([
      notice({ published: '2026-10-02T16:00:00.500+02:00', updated: '2026-10-03T09:30:00Z' }),
    ]).doc.items;
    expect(item.date_published).toBe('2026-10-02T14:00:00Z');
    expect(item.date_modified).toBe('2026-10-03T09:30:00Z');
  });

  it('carry affects exactly as validated, ranges in their given order', () => {
    const affects = [
      { cp: 'dev-libs/foo', slot: '1', ranges: [{ op: '<', ver: '1.2.3' }, { op: '>=', ver: '1.0' }] },
      { cp: 'dev-libs/bar', ranges: [] },
    ];
    const [item] = feedOf([notice({ affects })]).doc.items;
    expect(item._bentoo.affects).toEqual(affects);
  });

  it('omit slot when it is absent, never writing null', () => {
    const { text, doc } = feedOf([
      notice({ affects: [{ cp: 'app-portage/bentoolkit', ranges: [{ op: '<', ver: '0.9.1' }] }] }),
    ]);
    const [entry] = doc.items[0]._bentoo.affects;
    expect('slot' in entry).toBe(false);
    expect(Object.keys(entry)).toEqual(['cp', 'ranges']);
    expect(text).not.toContain('null');
  });

  // Hostile half: the same cp with and without a slot are two entries, not one.
  it('keep two entries for the same cp that differ only in slot', () => {
    const affects = [
      { cp: 'dev-lang/python', slot: '3.12', ranges: [{ op: '<', ver: '3.12.5' }] },
      { cp: 'dev-lang/python', ranges: [{ op: '<', ver: '3.12.5' }] },
    ];
    expect(feedOf([notice({ affects })]).doc.items[0]._bentoo.affects).toEqual(affects);
  });

  it('write an empty affects array for a notice without affects', () => {
    const [item] = feedOf([news('2026-10-02-news', '2026-10-02T14:00:00Z')]).doc.items;
    expect(item._bentoo.affects).toEqual([]);
  });

  it('round-trip untrusted text unchanged', () => {
    const title = 'a "quote" \\ </script> \u2028 \u00e9';
    const summary = 'ampersand & <b>bold</b> "quoted" backslash \\';
    const [item] = feedOf([notice({ title, summary })]).doc.items;
    expect(item.title).toBe(title);
    expect(item.summary).toBe(summary);
  });

  // Derived value: the page URL. Ids that differ only in punctuation must keep
  // distinct URLs, each carrying its id verbatim.
  it('give ids that differ only in punctuation distinct URLs', () => {
    const ids = ['2026-10-02-gtk+-fix', '2026-10-02-gtk-fix', '2026-10-02-gtk_fix', '2026-10-02-gtkfix'];
    const { items } = feedOf(ids.map((id) => news(id, '2026-10-02T14:00:00Z'))).doc;
    expect(items).toHaveLength(4);
    for (const item of items) expect(item.url).toBe(`${ORIGIN}/notices/${item.id}/`);
    expect(new Set(items.map((i: { url: string }) => i.url)).size).toBe(4);
  });
});

describe('item order (R3.5)', () => {
  // Hostile half first: order follows date_modified, never date_published.
  it('puts the most recently updated notice first even if it was published earliest', () => {
    const ns = [
      news('2026-10-05-new-quiet', '2026-10-05T00:00:00Z', '2026-10-05T00:00:00Z'),
      news('2026-09-01-old-revised', '2026-10-07T00:00:00Z', '2026-09-01T00:00:00Z'),
      news('2026-10-03-middle', '2026-10-06T00:00:00Z', '2026-10-03T00:00:00Z'),
    ];
    expect(feedOf(ns).doc.items.map((i: { id: string }) => i.id)).toEqual([
      '2026-09-01-old-revised',
      '2026-10-03-middle',
      '2026-10-05-new-quiet',
    ]);
  });

  it('treats one instant written with different offsets as a tie, broken by id', () => {
    const ns = [news('2026-10-02-b', '2026-10-02T14:00:00+02:00'), news('2026-10-02-a', '2026-10-02T12:00:00Z')];
    expect(feedOf(ns).doc.items.map((i: { id: string }) => i.id)).toEqual(['2026-10-02-a', '2026-10-02-b']);
  });

  // Ties break by id in code-unit order, the order the byte-exact golden
  // fixture and its Go consumer rely on; locale collation orders
  // punctuation differently ("_" < "-" < "+").
  it('breaks ties by id in code-unit order, independent of locale collation', () => {
    const ids = ['2026-10-02-xa', '2026-10-02-x_a', '2026-10-02-x-a', '2026-10-02-x+a'];
    const ns = ids.map((id) => news(id, '2026-10-02T14:00:00Z'));
    expect(feedOf(ns).doc.items.map((i: { id: string }) => i.id)).toEqual([
      '2026-10-02-x+a',
      '2026-10-02-x-a',
      '2026-10-02-x_a',
      '2026-10-02-xa',
    ]);
  });

  it('does not depend on input order', () => {
    const ns = [
      news('2026-10-02-a', '2026-10-02T14:00:00Z'),
      news('2026-10-02-b', '2026-10-02T14:00:00Z'),
      news('2026-10-01-c', '2026-10-09T00:00:00Z'),
    ];
    expect(feedOf(ns).text).toBe(feedOf([...ns].reverse()).text);
  });

  it('sortNotices returns every notice in the same order', () => {
    const ns = [
      news('2026-10-02-b', '2026-10-02T14:00:00Z'),
      news('2026-10-02-a', '2026-10-02T14:00:00Z'),
      news('2026-10-01-c', '2026-10-09T00:00:00Z'),
    ];
    expect(sortNotices(ns).map((n) => n.id)).toEqual(['2026-10-01-c', '2026-10-02-a', '2026-10-02-b']);
  });
});

describe('an empty collection (R3.6)', () => {
  it('yields a complete feed with an empty items array', () => {
    const { doc } = feedOf([]);
    expect(doc.items).toEqual([]);
    expect(doc.version).toBe('https://jsonfeed.org/version/1.1');
    expect(doc.feed_url).toBe(`${ORIGIN}/notices.json`);
    expect(doc._bentoo.serial).toBe(1790812800);
  });
});

describe('BUILD_TIME', () => {
  it('reads NOTICES_BUILD_TIME as Unix seconds', async () => {
    vi.resetModules();
    vi.stubEnv('NOTICES_BUILD_TIME', '1790812800');
    const { BUILD_TIME } = await import('~/utils/buildTime');
    expect(BUILD_TIME).toBeInstanceOf(Date);
    expect(BUILD_TIME.toISOString()).toBe('2026-10-01T00:00:00.000Z');
  });

  it('falls back to the current time, truncated to whole seconds', async () => {
    vi.resetModules();
    const saved = process.env.NOTICES_BUILD_TIME;
    delete process.env.NOTICES_BUILD_TIME;
    try {
      const before = Math.floor(Date.now() / 1000) * 1000;
      const { BUILD_TIME } = await import('~/utils/buildTime');
      const after = Date.now();
      expect(BUILD_TIME.getTime()).toBeGreaterThanOrEqual(before);
      expect(BUILD_TIME.getTime()).toBeLessThanOrEqual(after);
      expect(BUILD_TIME.getTime() % 1000).toBe(0);
    } finally {
      if (saved !== undefined) process.env.NOTICES_BUILD_TIME = saved;
    }
  });
});
