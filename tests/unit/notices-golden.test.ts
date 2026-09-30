// Story 002, Task 3.3 — endpoints and the golden fixture (R3.1, R4.1, Q13).
//
// tests/fixtures/notices.golden.json is the contract bentoolkit stories 071/072
// test against. It is generated once from the fixture notices by the
// implementation and committed; this test fails while it is missing.
import { describe, it, expect, afterEach, vi } from 'vitest';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
// js-yaml is what Astro's loader parses YAML data entries with (devDependency, task 3.3).
import yaml from 'js-yaml';
import { noticeSchema } from '~/content/noticeSchema';
import { buildJsonFeed, type Notice } from '~/utils/feed';

const collection = vi.hoisted(() => ({ entries: [] as { id: string; data: unknown }[] }));
vi.mock('astro:content', () => ({
  getCollection: async (name: string) => (name === 'notices' ? collection.entries : []),
}));

const FIXTURES = path.resolve(process.cwd(), 'tests/fixtures');
const FIXTURE_DIR = path.join(FIXTURES, 'notices');
const GOLDEN = path.join(FIXTURES, 'notices.golden.json');
const ORIGIN = 'https://obentoo.org';

type Raw = Record<string, any>;

function fixtures(): { id: string; raw: Raw; data: Notice }[] {
  return readdirSync(FIXTURE_DIR)
    .filter((f) => f.endsWith('.yaml'))
    .sort()
    .map((file) => {
      const raw = yaml.load(readFileSync(path.join(FIXTURE_DIR, file), 'utf8')) as Raw;
      return { id: file.replace(/\.yaml$/, ''), raw, data: noticeSchema.parse(raw) };
    });
}

function golden(): { text: string; doc: Raw } {
  expect(existsSync(GOLDEN), `missing ${GOLDEN}: generate it from the fixture notices`).toBe(true);
  const text = readFileSync(GOLDEN, 'utf8');
  return { text, doc: JSON.parse(text) };
}

const rfc3339 = (v: unknown) => new Date(v as string).toISOString().replace(/\.\d{3}Z$/, 'Z');

afterEach(() => {
  vi.unstubAllEnvs();
  collection.entries = [];
});

describe('fixture notices', () => {
  it('are the four contract notices, each named after its id', () => {
    const fx = fixtures();
    expect(fx.map((f) => f.id)).toEqual([
      '2026-09-27-gui+tray',
      '2026-09-28-edge+case_1',
      '2026-09-29-bentoolkit-0-32',
      '2026-09-30-foo-cve',
    ]);
    for (const f of fx) expect(f.data.id).toBe(f.id);
  });

  it('are dated at midnight UTC with updated equal to published', () => {
    for (const f of fixtures()) {
      expect(f.data.published.toISOString(), f.id).toMatch(/T00:00:00\.000Z$/);
      expect(f.data.updated.getTime(), f.id).toBe(f.data.published.getTime());
    }
  });

  it('exercise the contract edge cases: slot present and absent, no affects, "+" in an id, two ranges', () => {
    const entries = fixtures().flatMap((f) => (f.raw.affects ?? []) as Raw[]);
    expect(entries.some((e) => 'slot' in e)).toBe(true);
    expect(entries.some((e) => !('slot' in e))).toBe(true);
    expect(entries.some((e) => (e.ranges ?? []).length >= 2)).toBe(true);
    expect(fixtures().some((f) => (f.raw.affects ?? []).length === 0)).toBe(true);
    expect(fixtures().some((f) => f.id.includes('+'))).toBe(true);
  });
});

describe('the golden fixture (Q13)', () => {
  it('equals buildJsonFeed(fixtures, its build time, https://obentoo.org) byte for byte', () => {
    const { text, doc } = golden();
    const now = new Date(doc._bentoo.serial * 1000);
    expect(buildJsonFeed(fixtures().map((f) => f.data), now, ORIGIN)).toBe(text);
  });

  it('is canonical JSON with no null value', () => {
    const { text, doc } = golden();
    expect(text).toBe(JSON.stringify(doc, null, 2) + '\n');
    expect(text).not.toMatch(/:\s*null\b/);
  });

  it('is built at 2026-10-01T00:00:00Z: serial 1790812800, expires 2026-10-31T00:00:00Z', () => {
    const { doc } = golden();
    expect(doc._bentoo).toEqual({ serial: 1790812800, expires: '2026-10-31T00:00:00Z' });
  });

  it('lists the items in the contract order', () => {
    expect((golden().doc.items as Raw[]).map((i) => i.id)).toEqual([
      '2026-09-30-foo-cve',
      '2026-09-29-bentoolkit-0-32',
      '2026-09-28-edge+case_1',
      '2026-09-27-gui+tray',
    ]);
  });

  it('expires is exactly 30 days after serial', () => {
    const { doc } = golden();
    expect(Number.isInteger(doc._bentoo.serial)).toBe(true);
    expect(Date.parse(doc._bentoo.expires)).toBe((doc._bentoo.serial + 30 * 86400) * 1000);
  });

  it('holds one item per fixture, with the fixture data re-derived from the raw YAML', () => {
    const { doc } = golden();
    expect(doc.items).toHaveLength(4);
    const byId = new Map(fixtures().map((f) => [f.id, f.raw]));
    expect(doc.items.map((i: Raw) => i.id).sort()).toEqual([...byId.keys()].sort());
    for (const item of doc.items as Raw[]) {
      const raw = byId.get(item.id) as Raw;
      expect(item.url).toBe(`${ORIGIN}/notices/${item.id}/`);
      expect(item.title).toBe(raw.title);
      expect(item.summary).toBe(raw.summary);
      expect(item.content_text).toBe(raw.body);
      expect(item.date_published).toBe(rfc3339(raw.published));
      expect(item.date_modified).toBe(rfc3339(raw.updated));
      expect(item._bentoo).toEqual({ type: raw.type, severity: raw.severity, affects: raw.affects ?? [] });
    }
  });

  it('carries the edge notice exactly', () => {
    const edge = (golden().doc.items as Raw[]).find((i) => i.id === '2026-09-28-edge+case_1');
    expect(edge?.url).toBe(`${ORIGIN}/notices/2026-09-28-edge+case_1/`);
    expect(edge?._bentoo).toEqual({
      type: 'news',
      severity: 'info',
      affects: [
        {
          cp: 'dev-libs/libfoo+',
          slot: '0.1',
          ranges: [
            { op: '>=', ver: '1.0_rc1_p2' },
            { op: '<', ver: '1.0b-r0' },
          ],
        },
      ],
    });
  });

  it('orders items by date_modified newest first, ties by id', () => {
    const { doc } = golden();
    const ids = doc.items.map((i: Raw) => i.id);
    const expected = [...(doc.items as Raw[])]
      .sort((a, b) =>
        a.date_modified === b.date_modified
          ? a.id < b.id ? -1 : 1
          : Date.parse(b.date_modified) - Date.parse(a.date_modified)
      )
      .map((i) => i.id);
    expect(ids).toEqual(expected);
  });
});

// The endpoints read astro:content; vitest resolves it only through an alias
// to a stub in vitest.config.ts, which vi.mock above then replaces.
async function endpoint(file: 'notices.json' | 'notices.atom', buildTime: number) {
  vi.resetModules();
  vi.stubEnv('NOTICES_BUILD_TIME', String(buildTime));
  vi.stubEnv('PUBLIC_SITE_URL', '');
  const mod =
    file === 'notices.json' ? await import('~/pages/notices.json') : await import('~/pages/notices.atom');
  return mod.GET({} as never) as Promise<Response>;
}

const asEntries = () => fixtures().map((f) => ({ id: f.id, data: f.data }));

describe('GET /notices.json (R3.1, Q13)', () => {
  it('serves the golden document byte for byte', async () => {
    const { text, doc } = golden();
    collection.entries = asEntries();
    const res = await endpoint('notices.json', doc._bentoo.serial);
    expect(await res.text()).toBe(text);
  });

  // Hostile: the build must fail rather than publish an entry whose id is not
  // its file name.
  it('fails when a notice id differs from its file name', async () => {
    const [first] = fixtures();
    collection.entries = [{ id: `${first.id}-renamed`, data: first.data }];
    await expect(endpoint('notices.json', 1790812800)).rejects.toThrow(first.id);
  });
});

describe('GET /notices.atom (R4.1)', () => {
  it('serves a well-formed Atom feed with one entry per notice', async () => {
    collection.entries = asEntries();
    const xml = await (await endpoint('notices.atom', 1790812800)).text();
    const doc = new DOMParser().parseFromString(xml, 'application/xml');
    expect(doc.getElementsByTagName('parsererror')).toHaveLength(0);
    expect(doc.documentElement.localName).toBe('feed');
    expect(doc.getElementsByTagName('entry')).toHaveLength(fixtures().length);
    expect(xml).toContain(`${ORIGIN}/notices.atom`);
  });

  it('fails when a notice id differs from its file name', async () => {
    const [first] = fixtures();
    collection.entries = [{ id: `${first.id}-renamed`, data: first.data }];
    await expect(endpoint('notices.atom', 1790812800)).rejects.toThrow(first.id);
  });

  // Both feeds read one build clock: with no notices, Atom's updated is the
  // same instant as the JSON serial.
  it('shares the build clock with /notices.json', async () => {
    const t = 1790812800;
    const json = JSON.parse(await (await endpoint('notices.json', t)).text());
    const xml = await (await endpoint('notices.atom', t)).text();
    const updated = new DOMParser()
      .parseFromString(xml, 'application/xml')
      .documentElement.getElementsByTagName('updated')[0].textContent;
    expect(json._bentoo.serial).toBe(t);
    expect(Date.parse(updated ?? '')).toBe(t * 1000);
  });
});
