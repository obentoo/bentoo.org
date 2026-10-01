// Story 002, Task 7.1 — what consumer-contract.test.ts leaves open (R3.2–R3.4, Q13).
//
// That file checks that every field bentoo-tray reads is present with the
// right type. This one adds the rest of the contract:
//
//  1. the value rules bentoolkit 072 `notices.ParseFeed` enforces on every item
//     (it rejects the whole feed on one bad item, keeping stale notices);
//  2. the golden values 072's contract_test.go pins on its copy of the golden;
//  3. `bentoo notice new` output (bentoolkit 071 `RenderSiteYAML`), read by the
//     site's own notices loader — js-yaml CORE_SCHEMA, then noticeSchema —
//     decodes to the values bentoolkit wrote.
//
// The consumer rules below are copied from bentoolkit, not derived from the
// site: that is the point of a contract test. Sources, bentoolkit @ c204a7f:
//   internal/common/ebuild/version.go  validVersionRegex (IsValidVersion)
//   internal/notice/affects.go         cpRe, slotRe
//   internal/notice/notice.go          nameRe, maxNameLen (GLEP 42 short name)
//   .epic/stories/072-bentoo-tray/design.md  `internal/notices` validation
//   .epic/stories/072-bentoo-tray/.draft/authored-tests/internal/notices/contract_test.go
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { noticeSchema, type Notice } from '~/content/noticeSchema';
import { noticesLoader } from '~/content/noticesLoader';

type Raw = Record<string, any>;

const ROOT = process.cwd();
const GOLDEN = path.resolve(ROOT, 'tests/fixtures/notices.golden.json');
const NOTICE_NEW_DIR = path.resolve(ROOT, 'tests/fixtures/notice-new');

const golden = (): Raw => JSON.parse(readFileSync(GOLDEN, 'utf8'));
const clone = <T>(v: T): T => structuredClone(v);

// ---- the tray's per-item validation (bentoolkit 072 ParseFeed) ------------

const TRAY_VERSION_RE = /^[0-9]+(\.[0-9]+)*[a-z]?(_(alpha|beta|pre|rc|p)[0-9]*)*(-r[0-9]+)?$/;
const TRAY_CP_RE = /^[A-Za-z0-9+_.-]+\/[A-Za-z0-9+_-]+$/;
const TRAY_SLOT_RE = /^[A-Za-z0-9+_.-]+$/;
const TRAY_ID_RE = /^(\d{4})-(\d{2})-(\d{2})-([a-z0-9+_-]{1,20})$/;
const TRAY_TYPES = ['security', 'release', 'news', 'announcement'];
const TRAY_SEVERITIES = ['info', 'warning', 'critical'];
const TRAY_OPS = ['<', '<=', '=', '>=', '>'];
const JSON_FEED_1_1 = 'https://jsonfeed.org/version/1.1';
// Go's time.Parse(time.RFC3339, …) layout.
const RFC3339 = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})$/;

/** Go's time.Parse rejects an impossible date such as 2026-02-30. */
function isCalendarDate(y: number, m: number, d: number): boolean {
  const t = new Date(Date.UTC(2000, m - 1, d));
  t.setUTCFullYear(y);
  return t.getUTCFullYear() === y && t.getUTCMonth() === m - 1 && t.getUTCDate() === d;
}

/**
 * Every reason bentoo-tray's ParseFeed would reject `doc`, as `<id>.<field>`
 * (feed-level ones as `feed.<field>`). Empty means the tray accepts it.
 */
function trayViolations(doc: Raw): string[] {
  const out: string[] = [];
  if (doc.version !== JSON_FEED_1_1) out.push('feed.version');
  const b = doc._bentoo;
  if (!b || !Number.isSafeInteger(b.serial) || b.serial <= 0) out.push('feed.serial');
  if (!b || typeof b.expires !== 'string' || !RFC3339.test(b.expires)) out.push('feed.expires');
  if (!Array.isArray(doc.items)) return [...out, 'feed.items'];

  const seen = new Set<string>();
  for (const item of doc.items as Raw[]) {
    const id = String(item.id);
    const bad = (field: string) => out.push(`${id}.${field}`);
    const m = typeof item.id === 'string' ? item.id.match(TRAY_ID_RE) : null;
    if (!m || !isCalendarDate(Number(m[1]), Number(m[2]), Number(m[3]))) bad('id');
    if (seen.has(id)) bad('id (duplicate)');
    seen.add(id);
    for (const k of ['date_published', 'date_modified']) {
      if (typeof item[k] !== 'string' || !RFC3339.test(item[k])) bad(k);
    }
    const nb = item._bentoo ?? {};
    if (!TRAY_TYPES.includes(nb.type)) bad('type');
    if (!TRAY_SEVERITIES.includes(nb.severity)) bad('severity');
    if (!Array.isArray(nb.affects)) {
      bad('affects');
      continue;
    }
    for (const a of nb.affects as Raw[]) {
      if (typeof a.cp !== 'string' || !TRAY_CP_RE.test(a.cp)) bad('cp');
      if ('slot' in a && (typeof a.slot !== 'string' || !TRAY_SLOT_RE.test(a.slot))) bad('slot');
      if (!Array.isArray(a.ranges)) {
        bad('ranges');
        continue;
      }
      for (const r of a.ranges as Raw[]) {
        if (!TRAY_OPS.includes(r.op)) bad('op');
        if (typeof r.ver !== 'string' || !TRAY_VERSION_RE.test(r.ver)) bad('ver');
      }
    }
  }
  return out;
}

const EDGE = '2026-09-28-edge+case_1';
const item = (doc: Raw, id: string): Raw => (doc.items as Raw[]).find((i) => i.id === id) as Raw;

describe('bentoo-tray ParseFeed accepts every item of the golden feed', () => {
  it('the golden breaks none of the tray rules', () => {
    expect(trayViolations(golden())).toEqual([]);
  });

  // The converse: each mutation must be caught, or the check above proves
  // nothing. One field per case, named as the tray's ItemError names it.
  const cases: [string, (d: Raw) => void, string][] = [
    ['JSON Feed 1.0', (d) => void (d.version = 'https://jsonfeed.org/version/1'), 'feed.version'],
    ['serial as text', (d) => void (d._bentoo.serial = String(d._bentoo.serial)), 'feed.serial'],
    ['serial 0', (d) => void (d._bentoo.serial = 0), 'feed.serial'],
    ['expires without offset', (d) => void (d._bentoo.expires = '2026-10-31T00:00:00'), 'feed.expires'],
    ['impossible date in id', (d) => void (item(d, EDGE).id = '2026-02-30-edge'), '2026-02-30-edge.id'],
    ['21-char short name', (d) => void (item(d, EDGE).id = '2026-09-28-abcdefghijklmnopqrstu'), '2026-09-28-abcdefghijklmnopqrstu.id'],
    ['uppercase short name', (d) => void (item(d, EDGE).id = '2026-09-28-Edge'), '2026-09-28-Edge.id'],
    ['duplicate id', (d) => void (d.items[1].id = d.items[0].id), '2026-09-30-foo-cve.id (duplicate)'],
    ['unknown type', (d) => void (item(d, EDGE)._bentoo.type = 'advisory'), `${EDGE}.type`],
    ['unknown severity', (d) => void (item(d, EDGE)._bentoo.severity = 'urgent'), `${EDGE}.severity`],
    ['cp without category', (d) => void (item(d, EDGE)._bentoo.affects[0].cp = 'libfoo'), `${EDGE}.cp`],
    ['slot with a subslot', (d) => void (item(d, EDGE)._bentoo.affects[0].slot = '0/1'), `${EDGE}.slot`],
    ['null slot', (d) => void (item(d, EDGE)._bentoo.affects[0].slot = null), `${EDGE}.slot`],
    ['operator ~>', (d) => void (item(d, EDGE)._bentoo.affects[0].ranges[0].op = '~>'), `${EDGE}.op`],
    ['non-PMS version', (d) => void (item(d, EDGE)._bentoo.affects[0].ranges[1].ver = '1.0-beta'), `${EDGE}.ver`],
    ['date without offset', (d) => void (item(d, EDGE).date_modified = '2026-09-28T00:00:00'), `${EDGE}.date_modified`],
  ];
  it.each(cases)('the check catches %s', (_name, mutate, field) => {
    const doc = clone(golden());
    mutate(doc);
    expect(trayViolations(doc)).toContain(field);
  });
});

describe('the golden values bentoolkit 072 contract_test.go pins', () => {
  // The fixture's build time: NOW in scripts/generate-notices-golden.mjs.
  const BUILT = Date.UTC(2026, 9, 1) / 1000;

  it('serial is the build time in whole seconds and expires exactly 30 days later (R3.4)', () => {
    const { _bentoo } = golden();
    expect(_bentoo.serial).toBe(BUILT);
    expect(Date.parse(_bentoo.expires) / 1000).toBe(_bentoo.serial + 30 * 86400);
  });

  it('every item is dated midnight UTC with date_modified equal to date_published', () => {
    for (const i of golden().items as Raw[]) {
      expect(i.date_published, i.id).toMatch(/T00:00:00Z$/);
      expect(i.date_modified, i.id).toBe(i.date_published);
    }
  });

  // The tray compares the url to this literal form. A "+" id is served at the
  // %2B path and the literal one answers 307, so opening it relies on the
  // browser following the redirect.
  it('every item url is the notice page on the feed origin, id written verbatim', () => {
    const doc = golden();
    const origin = new URL(doc.feed_url).origin;
    for (const i of doc.items as Raw[]) expect(i.url).toBe(`${origin}/notices/${i.id}/`);
  });

  it('items are newest first by date_modified, ties by id in code-unit order (R3.5)', () => {
    const items = golden().items as Raw[];
    for (let k = 1; k < items.length; k++) {
      const [a, b] = [items[k - 1], items[k]];
      const [ta, tb] = [Date.parse(a.date_modified), Date.parse(b.date_modified)];
      expect(ta > tb || (ta === tb && a.id < b.id), `${a.id} before ${b.id}`).toBe(true);
    }
  });

  it('holds one security, one release, the edge notice and one announcement in the pinned shapes', () => {
    const items = golden().items as Raw[];
    const edge = items.find((i) => i.id === EDGE) as Raw;
    const rest = items.filter((i) => i.id !== EDGE);
    const byType = (t: string) => rest.filter((i) => i._bentoo.type === t);
    expect(byType('security')).toHaveLength(1);
    expect(byType('release')).toHaveLength(1);
    expect(byType('announcement')).toHaveLength(1);

    expect(edge._bentoo.type).toBe('news');
    expect(edge._bentoo.severity).toBe('info');

    const [security] = byType('security');
    expect(security._bentoo.severity).toBe('critical');
    expect(security._bentoo.affects).toHaveLength(1);
    const [sa] = security._bentoo.affects;
    expect(sa.cp.length > 0 && typeof sa.slot === 'string' && sa.slot.length > 0).toBe(true);
    expect(sa.ranges).toHaveLength(2);

    const [release] = byType('release');
    expect(release._bentoo.affects).toHaveLength(1);
    expect(release._bentoo.affects[0].cp).toBe('app-portage/bentoolkit');
    expect(release._bentoo.affects[0].ranges.map((r: Raw) => r.op)).toEqual(['<']);

    const [announcement] = byType('announcement');
    expect(announcement._bentoo.affects).toEqual([]);
    expect(announcement.id.slice('2026-01-01-'.length)).toContain('+');
  });
});

// ---- bentoo notice new → the site's loader --------------------------------

type Entry = { id: string; data: Notice };

/** Runs the site's notices loader over `dir`, validating like Astro with noticeSchema. */
async function loadWithSiteLoader(dir: string): Promise<Map<string, Notice>> {
  const entries = new Map<string, Notice>();
  const loader = noticesLoader({ pattern: '*.yaml', base: dir, generateId: ({ entry }) => entry.replace(/\.yaml$/, '') });
  const noop = () => {};
  await loader.load({
    collection: 'notices',
    store: { clear: () => entries.clear(), set: (e: Entry) => (entries.set(e.id, e.data), true) },
    config: { root: pathToFileURL(ROOT + path.sep) },
    logger: { warn: noop, info: noop, error: noop, debug: noop },
    generateDigest: () => 'digest',
    parseData: async ({ id, data }: { id: string; data: unknown }) => {
      const r = noticeSchema.safeParse(data);
      if (!r.success) throw new Error(`${id}: ${JSON.stringify(r.error.issues)}`);
      return r.data;
    },
  } as never);
  return entries;
}

const at = (iso: string) => new Date(iso);

// What bentoolkit's RenderSiteYAML was given for each file in
// tests/fixtures/notice-new/ (see its README).
const WRITTEN: Record<string, Notice> = {
  // bentoolkit internal/notice/testdata/site.golden.yaml, byte for byte.
  '2026-10-02-foo-cve': {
    id: '2026-10-02-foo-cve',
    type: 'security',
    severity: 'critical',
    title: 'foo 1.2 heap overflow',
    summary: 'A crafted archive overflows a heap buffer in foo before 1.2.3.',
    body:
      'A crafted archive overflows a heap buffer in libfoo when it is unpacked, which lets an attacker run code as the user running the extraction.\n' +
      '\nWhat to do\n==========\n\n\tUpgrade to dev-libs/foo-1.2.3 or later, then rebuild every package linked against it.\n',
    affects: [
      { cp: 'dev-libs/foo', slot: '1', ranges: [{ op: '>=', ver: '1.0' }, { op: '<', ver: '1.2.3' }] },
      { cp: 'dev-libs/foo', slot: '0', ranges: [{ op: '<', ver: '0.9.8' }] },
      { cp: 'app-misc/foo-tools', ranges: [] },
    ],
    published: at('2026-10-02T00:00:00Z'),
    updated: at('2026-10-02T00:00:00Z'),
  },
  // A revised notice (updated moved off midnight), free text a plain scalar
  // would retype, a tab-led literal body line and a range-less entry.
  '2026-10-02-edge+case_1': {
    id: '2026-10-02-edge+case_1',
    type: 'security',
    severity: 'critical',
    title: 'null',
    summary: '2026-10-02 10:00:00Z',
    body: 'tab\tinside\n\ttab-led line\n',
    affects: [
      { cp: 'dev-libs/libfoo+', slot: '0.1', ranges: [{ op: '>=', ver: '1.0_rc1_p2' }, { op: '<', ver: '1.0b-r0' }] },
      { cp: 'dev-libs/foo', slot: '1', ranges: [{ op: '=', ver: '1.10' }] },
      { cp: 'app-misc/true', ranges: [] },
    ],
    published: at('2026-10-02T00:00:00Z'),
    updated: at('2026-10-05T13:04:05Z'),
  },
  // The double-quoted body RenderSiteYAML falls back to for a leading line feed.
  '2026-10-02-leadnl': {
    id: '2026-10-02-leadnl',
    type: 'announcement',
    severity: 'warning',
    title: '#not a comment: really',
    summary: `- starts like a list, has "quotes" and 'single'`,
    body: '\nleading blank line\n\n  indented\n',
    affects: [],
    published: at('2026-10-02T00:00:00Z'),
    updated: at('2026-10-05T13:04:05Z'),
  },
  // …and for U+2028/U+2029, which yaml.v3 escapes as \L and \P.
  '2026-10-02-u2028': {
    id: '2026-10-02-u2028',
    type: 'news',
    severity: 'info',
    title: 'yes',
    summary: '1.10',
    body: 'line one still one and\n\nparagraph two\n',
    affects: [],
    published: at('2026-10-02T00:00:00Z'),
    updated: at('2026-10-02T00:00:00Z'),
  },
};

describe('the site loader reads bentoo notice new output as written (071 R4.1)', () => {
  it('loads every RenderSiteYAML sample, each to the values bentoolkit rendered', async () => {
    const loaded = await loadWithSiteLoader(NOTICE_NEW_DIR);
    expect([...loaded.keys()].sort()).toEqual(Object.keys(WRITTEN).sort());
    for (const [id, want] of Object.entries(WRITTEN)) expect(loaded.get(id), id).toEqual(want);
  });
});
