// Story 002, Task 7.1 — the feed carries every field its consumers read (R3.2–R3.4, Q13).
// Consumers: bentoolkit 072 `notices.ParseFeed` (Go) reads the golden JSON;
// bentoolkit 071 `notice new` writes the YAML that noticeSchema validates.
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import * as yaml from 'js-yaml';
import { noticeSchema } from '~/content/noticeSchema';

const GOLDEN = path.resolve(process.cwd(), 'tests/fixtures/notices.golden.json');
// Go's time.RFC3339 layout.
const RFC3339 = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})$/;
type Raw = Record<string, any>;

const load = () => {
  const text = readFileSync(GOLDEN, 'utf8');
  return { text, doc: JSON.parse(text) as Raw };
};

const str = (v: unknown, what: string) => {
  expect(typeof v, what).toBe('string');
  expect((v as string).length, what).toBeGreaterThan(0);
};

describe('the golden feed carries every field bentoo-tray parses', () => {
  it('feed _bentoo.serial is a plain integer and expires an RFC 3339 time after it', () => {
    const { text, doc } = load();
    expect(Number.isSafeInteger(doc._bentoo.serial)).toBe(true);
    expect(text).toMatch(/"serial": \d+,?\n/);
    expect(doc._bentoo.expires).toMatch(RFC3339);
    expect(Date.parse(doc._bentoo.expires)).toBeGreaterThan(doc._bentoo.serial * 1000);
  });

  it('holds the four contract notices, the edge notice among them', () => {
    const ids = (load().doc.items as Raw[]).map((i) => i.id);
    expect(ids).toHaveLength(4);
    expect(ids).toContain('2026-09-28-edge+case_1');
  });

  // The edge notice pins the values a Go parser most easily gets wrong:
  // "+" and "_" in the id, "+" in the package name, a dotted slot and
  // stacked version suffixes with a zero revision.
  it('the edge notice decodes to exactly its source values', () => {
    const edge = (load().doc.items as Raw[]).find((i) => i.id === '2026-09-28-edge+case_1') as Raw;
    expect(edge._bentoo.affects).toEqual([
      {
        cp: 'dev-libs/libfoo+',
        slot: '0.1',
        ranges: [
          { op: '>=', ver: '1.0_rc1_p2' },
          { op: '<', ver: '1.0b-r0' },
        ],
      },
    ]);
    expect(edge.date_published).toBe('2026-09-28T00:00:00Z');
  });

  it('every item has id, url, title, summary and both dates with the right types', () => {
    const { doc } = load();
    expect(doc.items.length).toBeGreaterThan(0);
    for (const item of doc.items as Raw[]) {
      for (const k of ['id', 'url', 'title', 'summary']) str(item[k], `${item.id}.${k}`);
      expect(item.date_published).toMatch(RFC3339);
      expect(item.date_modified).toMatch(RFC3339);
    }
  });

  // The tray opens only https URLs on the feed's own host.
  it('every item url is https on the host of feed_url', () => {
    const { doc } = load();
    const host = new URL(doc.feed_url).host;
    for (const item of doc.items as Raw[]) {
      const u = new URL(item.url);
      expect(u.protocol, item.url).toBe('https:');
      expect(u.host, item.url).toBe(host);
    }
  });

  it('every item _bentoo has type, severity and affects in the shape ParseFeed decodes', () => {
    const { doc } = load();
    expect(doc.items.length).toBeGreaterThan(0);
    for (const item of doc.items as Raw[]) {
      const b = item._bentoo;
      expect(['security', 'release', 'news', 'announcement']).toContain(b.type);
      expect(['info', 'warning', 'critical']).toContain(b.severity);
      expect(Array.isArray(b.affects)).toBe(true);
      for (const a of b.affects as Raw[]) {
        str(a.cp, `${item.id}.cp`);
        if ('slot' in a) str(a.slot, `${item.id}.slot`);
        expect(Array.isArray(a.ranges)).toBe(true);
        for (const r of a.ranges as Raw[]) {
          expect(['<', '<=', '=', '>=', '>']).toContain(r.op);
          str(r.ver, `${item.id}.ver`);
        }
      }
    }
  });
});

describe('noticeSchema accepts what bentoolkit notice new writes (071 R4.1)', () => {
  const written = (extra: string) => `id: 2026-10-02-foo-cve
type: security
severity: critical
title: "foo 1.2 heap overflow"
summary: "A heap overflow in foo."
body: |
  Paragraph one.

  Paragraph two.
${extra}published: "2026-10-02T14:00:00Z"
updated: "2026-10-02T14:00:00Z"
`;

  it('a security notice with slot and several ranges', () => {
    const doc = yaml.load(
      written(`affects:
  - cp: dev-libs/foo
    slot: "1"
    ranges:
      - op: ">="
        ver: "1.0"
      - op: "<"
        ver: "1.2.3"
`)
    );
    expect(noticeSchema.safeParse(doc).success).toBe(true);
  });

  it('an entry without ranges', () => {
    const doc = yaml.load(written(`affects:\n  - cp: dev-libs/foo\n    ranges: []\n`));
    expect(noticeSchema.safeParse(doc).success).toBe(true);
  });

  it('a news notice with an empty affects list or none', () => {
    const news = (extra: string) =>
      yaml.load(written(extra).replace('type: security', 'type: news').replace('severity: critical', 'severity: info'));
    expect(noticeSchema.safeParse(news('affects: []\n')).success).toBe(true);
    expect(noticeSchema.safeParse(news('')).success).toBe(true);
  });
});
