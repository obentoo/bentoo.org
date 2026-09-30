// Story 002, Task 3.2 — Atom builder (R4.1, R4.2, R4.3).
import { describe, it, expect, afterEach, vi } from 'vitest';
import { noticeSchema } from '~/content/noticeSchema';
import { buildAtom, xmlEscape, type Notice } from '~/utils/feed';

const ATOM = 'http://www.w3.org/2005/Atom';
const ORIGIN = 'https://obentoo.org';
const NOW = new Date('2026-10-20T00:00:00Z');
const RFC3339 = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})$/;

const BASE = {
  id: '2026-10-02-foo-cve',
  type: 'security',
  severity: 'critical',
  title: 'foo 1.2 heap overflow',
  summary: 'A heap overflow in foo before 1.2.3.',
  body: 'Body text.',
  affects: [{ cp: 'dev-libs/foo', ranges: [{ op: '<', ver: '1.2.3' }] }],
  published: '2026-10-02T14:00:00Z',
  updated: '2026-10-02T14:00:00Z',
};

const raw = (over: Record<string, unknown> = {}) => ({ ...BASE, ...over });
const notice = (over: Record<string, unknown> = {}): Notice => noticeSchema.parse(raw(over));

function parse(xml: string): Document {
  const doc = new DOMParser().parseFromString(xml, 'application/xml');
  expect(doc.getElementsByTagName('parsererror').length, `not well-formed:\n${xml}`).toBe(0);
  return doc;
}

const kids = (el: Element, name: string): Element[] =>
  Array.from(el.children).filter((c) => c.namespaceURI === ATOM && c.localName === name);

function only(el: Element, name: string): Element {
  const found = kids(el, name);
  expect(found, `<${name}> count under <${el.localName}>`).toHaveLength(1);
  return found[0];
}

const text = (el: Element, name: string): string => only(el, name).textContent ?? '';
const links = (el: Element, rel: string) => kids(el, 'link').filter((l) => l.getAttribute('rel') === rel);
const instant = (s: string): number => {
  expect(s).toMatch(RFC3339);
  return new Date(s).getTime();
};

function atom(ns: Notice[], now: Date = NOW, origin: string = ORIGIN): Element {
  return parse(buildAtom(ns, now, origin)).documentElement;
}

function entryById(feed: Element, id: string): Element {
  const found = kids(feed, 'entry').filter((e) => text(e, 'id') === id);
  expect(found, `entry ${id}`).toHaveLength(1);
  return found[0];
}

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('the feed element (R4.1)', () => {
  it('is an Atom feed with id, title, self link and alternate link', () => {
    const feed = atom([notice()]);
    expect(feed.localName).toBe('feed');
    expect(feed.namespaceURI).toBe(ATOM);
    expect(text(feed, 'id')).toBe(`${ORIGIN}/notices.atom`);
    expect(text(feed, 'title').trim()).not.toBe('');
    expect(links(feed, 'self').map((l) => l.getAttribute('href'))).toEqual([`${ORIGIN}/notices.atom`]);
    expect(links(feed, 'alternate').map((l) => l.getAttribute('href'))).toEqual([`${ORIGIN}/notices/`]);
  });

  // Hostile half first: neither the newest publication, nor the last entry in
  // input order, nor the build time — the newest update.
  it('updated is the newest entry update', () => {
    const feed = atom([
      notice({ id: '2026-10-05-a', published: '2026-10-05T00:00:00Z', updated: '2026-10-05T00:00:00Z' }),
      notice({ id: '2026-10-01-b', published: '2026-10-01T00:00:00Z', updated: '2026-10-07T09:30:00Z' }),
      notice({ id: '2026-10-03-c', published: '2026-10-03T00:00:00Z', updated: '2026-10-03T00:00:00Z' }),
    ]);
    expect(instant(text(feed, 'updated'))).toBe(Date.parse('2026-10-07T09:30:00Z'));
  });

  it('with no notices, updated is the build time and there are no entries', () => {
    const feed = atom([]);
    expect(instant(text(feed, 'updated'))).toBe(NOW.getTime());
    expect(kids(feed, 'entry')).toHaveLength(0);
    expect(text(feed, 'id')).toBe(`${ORIGIN}/notices.atom`);
  });

  it('builds URLs from the origin argument, not from the environment', () => {
    vi.stubEnv('PUBLIC_SITE_URL', 'https://env.example.test');
    const xml = buildAtom([notice()], NOW, 'https://param.example.test');
    expect(xml).not.toContain('env.example.test');
    const feed = parse(xml).documentElement;
    expect(text(feed, 'id')).toBe('https://param.example.test/notices.atom');
    expect(text(only(feed, 'entry'), 'id')).toBe('https://param.example.test/notices/2026-10-02-foo-cve/');
  });
});

describe('entries (R4.2)', () => {
  it('one entry per notice', () => {
    const feed = atom([notice({ id: '2026-10-02-a' }), notice({ id: '2026-10-02-b' }), notice({ id: '2026-10-02-c' })]);
    expect(kids(feed, 'entry')).toHaveLength(3);
  });

  it('carries id, title, published, updated, summary, alternate link, category and author', () => {
    const n = notice({ type: 'release', published: '2026-10-02T14:00:00Z', updated: '2026-10-04T08:15:00Z' });
    const page = `${ORIGIN}/notices/2026-10-02-foo-cve/`;
    const entry = entryById(atom([n]), page);
    expect(text(entry, 'title')).toBe(BASE.title);
    expect(instant(text(entry, 'published'))).toBe(Date.parse('2026-10-02T14:00:00Z'));
    expect(instant(text(entry, 'updated'))).toBe(Date.parse('2026-10-04T08:15:00Z'));
    const summary = only(entry, 'summary');
    expect(summary.getAttribute('type')).toBe('text');
    expect(summary.textContent).toBe(BASE.summary);
    expect(links(entry, 'alternate').map((l) => l.getAttribute('href'))).toEqual([page]);
    expect(only(entry, 'category').getAttribute('term')).toBe('release');
    expect(text(only(entry, 'author'), 'name')).toBe('bentoo');
  });

  // Derived value: the entry id is the page URL. Ids that differ only in
  // punctuation keep distinct entry ids, and none equals the feed id.
  it('ids that differ only in punctuation give distinct entry ids', () => {
    const ids = ['2026-10-02-gtk+-fix', '2026-10-02-gtk-fix', '2026-10-02-gtk_fix', '2026-10-02-gtkfix'];
    const feed = atom(ids.map((id) => notice({ id })));
    const entryIds = kids(feed, 'entry').map((e) => text(e, 'id'));
    expect(entryIds.sort()).toEqual(ids.map((id) => `${ORIGIN}/notices/${id}/`).sort());
    expect(entryIds).not.toContain(text(feed, 'id'));
  });
});

describe('escaping (R4.3)', () => {
  // Hostile strings first: markup, entities that must not be decoded twice,
  // a CDATA terminator and both quote kinds.
  it('notice-supplied text survives a parse unchanged', () => {
    const title = `<b>x</b> & "q" 'a' ]]>`;
    const summary = `&amp; &lt; &#x26; <![CDATA[y]]> <script>alert(1)</script>`;
    const entry = only(atom([notice({ title, summary })]), 'entry');
    expect(text(entry, 'title')).toBe(title);
    expect(only(entry, 'summary').textContent).toBe(summary);
  });

  // Every character the schema allows (R2.10-R2.12) must survive: the five
  // XML specials everywhere, a character outside the BMP, and tab and line
  // feed in the multi-line body.
  it('a notice using every allowed special character round-trips through an XML parse', () => {
    const tab = String.fromCharCode(9);
    const lf = String.fromCharCode(10);
    const emoji = String.fromCodePoint(0x1f512);
    const title = `& < > " ' ${emoji} ]]>`;
    const summary = `Fix & <b>bold</b> "double" 'single' ${emoji} &amp; ]]>`;
    const body = `line${tab}one & <x>${lf}${lf}"two" 'three' ${emoji}${lf}`;
    const parsed = noticeSchema.safeParse(
      raw({ id: '2026-09-28-edge+case_1', title, summary, body, affects: [{ cp: 'dev-libs/libfoo+', ranges: [] }] })
    );
    expect(parsed.success, parsed.success ? '' : JSON.stringify(parsed.error.issues)).toBe(true);
    if (!parsed.success) return;
    const feed = parse(buildAtom([parsed.data], NOW, ORIGIN)).documentElement;
    const entry = only(feed, 'entry');
    expect(text(entry, 'title')).toBe(title);
    expect(only(entry, 'summary').textContent).toBe(summary);
    expect(text(entry, 'id')).toBe(`${ORIGIN}/notices/2026-09-28-edge+case_1/`);
    // The body is not required in Atom; if an element carries it, it is exact.
    for (const el of Array.from(entry.children)) {
      if ((el.textContent ?? '').includes('line')) expect(el.textContent).toBe(body);
    }
  });

  it('the page URL of an id with "+" survives in id and href', () => {
    const entry = only(atom([notice({ id: '2026-10-02-gtk+-fix' })]), 'entry');
    const page = `${ORIGIN}/notices/2026-10-02-gtk+-fix/`;
    expect(text(entry, 'id')).toBe(page);
    expect(links(entry, 'alternate')[0].getAttribute('href')).toBe(page);
  });
});

describe('xmlEscape (R4.3)', () => {
  const roundTrip = (s: string) => {
    const esc = xmlEscape(s);
    const el = parse(`<x a="${esc}" b='${esc}'>${esc}</x>`).documentElement;
    return { esc, text: el.textContent, a: el.getAttribute('a'), b: el.getAttribute('b') };
  };

  it('escapes the five XML special characters for text and both attribute quotes', () => {
    const r = roundTrip(`&<>"'`);
    expect(r.esc).not.toMatch(/[<>"']/);
    expect(r.esc).not.toMatch(/&(?!(amp|lt|gt|quot|apos|#\d+|#x[0-9a-fA-F]+);)/);
    expect([r.text, r.a, r.b]).toEqual([`&<>"'`, `&<>"'`, `&<>"'`]);
  });

  it('escapes an existing entity again instead of passing it through', () => {
    expect(roundTrip('&lt;&amp;').text).toBe('&lt;&amp;');
  });

  it('leaves plain text alone', () => {
    expect(xmlEscape('plain text 1.2.3')).toBe('plain text 1.2.3');
  });
});
