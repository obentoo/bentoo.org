// Story 002, Task 2.1 review fixes — what a YAML author sees when the loader's
// parse changes a value's type (R2.1, R2.9), and lone surrogates (R2.10).
import { describe, it, expect } from 'vitest';
import * as yaml from 'js-yaml';
import { noticeSchema } from '~/content/noticeSchema';

const NEWS = `
id: 2026-10-02-overlay-news
type: news
severity: info
title: Overlay news
summary: Something changed in the overlay.
body: Details.
published: "2026-10-02T14:00:00Z"
updated: "2026-10-02T14:00:00Z"
`;

const AFFECTS = (slot: string, ver: string) => `
affects:
  - cp: dev-libs/foo
    slot: ${slot}
    ranges:
      - { op: "<", ver: ${ver} }
`;

type Issue = { path: PropertyKey[]; message: string };

function issuesOf(input: unknown): Issue[] {
  const r = noticeSchema.safeParse(input);
  expect(r.success, `accepted ${JSON.stringify(input)}`).toBe(false);
  return r.success ? [] : r.error.issues;
}

/** The message of the issue whose path ends in `field`. */
function messageFor(input: unknown, field: string): string {
  const issues = issuesOf(input);
  const hit = issues.find((i) => String(i.path.at(-1)) === field);
  expect(hit, `no issue names "${field}": ${JSON.stringify(issues)}`).toBeDefined();
  return hit?.message ?? '';
}

// Parsed as the notices loader parses (src/content/noticesLoader.ts).
const parse = (text: string): Record<string, unknown> =>
  yaml.load(text, { schema: yaml.CORE_SCHEMA }) as Record<string, unknown>;

describe('a YAML number where a string belongs says to quote it (R2.1)', () => {
  it('an unquoted ver 1.0 (read as the number 1) is refused, asking for quotes', () => {
    const data = parse(NEWS + AFFECTS('"1"', '1.0'));
    expect(messageFor(data, 'ver')).toMatch(/quoted string/);
  });

  it('an unquoted slot 0.1 (read as a number) is refused, asking for quotes', () => {
    const data = parse(NEWS + AFFECTS('0.1', '"1.0"'));
    expect(messageFor(data, 'slot')).toMatch(/quoted string/);
  });

  it.each(['id', 'title', 'summary'])('a number in %s is refused, asking for quotes', (field) => {
    expect(messageFor({ ...parse(NEWS), [field]: 42 }, field)).toMatch(/quoted string/);
  });

  it('a number in cp is refused, asking for quotes', () => {
    const data = { ...parse(NEWS), affects: [{ cp: 42, ranges: [] }] };
    expect(messageFor(data, 'cp')).toMatch(/quoted string/);
  });

  // Converse: a missing field is not a quoting problem.
  it('a missing title keeps a message that does not ask for quotes', () => {
    const data = parse(NEWS);
    delete data.title;
    expect(messageFor(data, 'title')).not.toMatch(/quoted/);
  });
});

describe('an offset-less timestamp names the offset requirement (R2.9)', () => {
  it('a quoted timestamp without an offset is refused, naming the offset', () => {
    const data = { ...parse(NEWS), published: '2026-10-02T14:00:00' };
    expect(messageFor(data, 'published')).toMatch(/offset/);
  });
});

describe('text fields refuse lone UTF-16 surrogates (R2.10)', () => {
  const lone = ['\uD800', '\uDFFF', 'a\uD83Db', '\uDE00a'];

  it.each(lone)('rejects %j in title, summary and body', (bad) => {
    for (const field of ['title', 'summary', 'body']) {
      const issues = issuesOf({ ...parse(NEWS), [field]: `x${bad}` });
      expect(issues.some((i) => i.path.map(String).includes(field))).toBe(true);
    }
  });

  // Converse: a surrogate pair is one well-formed code point.
  it('accepts a paired surrogate (an emoji) in every text field', () => {
    const emoji = '😀';
    const r = noticeSchema.safeParse({ ...parse(NEWS), title: emoji, summary: emoji, body: emoji });
    expect(r.success, r.success ? '' : JSON.stringify(r.error.issues)).toBe(true);
  });
});
