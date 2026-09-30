// Story 002, Task 2.1 — the notice schema (R2.1, R2.2, R2.5, R2.6, R2.7, R2.8).
import { describe, it, expect } from 'vitest';
import {
  noticeSchema,
  NOTICE_TYPES,
  SEVERITIES,
  RANGE_OPS,
  ID_PATTERN,
  VERSION_PATTERN,
} from '~/content/noticeSchema';

type Raw = Record<string, unknown>;

const SECURITY: Raw = {
  id: '2026-10-02-foo-cve',
  type: 'security',
  severity: 'critical',
  title: 'foo 1.2 heap overflow',
  summary: 'A heap overflow in foo before 1.2.3.',
  body: 'First paragraph.\n\nSecond paragraph.\n',
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

// A notice type that needs no `affects`, so single-field tests stay isolated.
const NEWS: Raw = {
  id: '2026-10-02-overlay-news',
  type: 'news',
  severity: 'info',
  title: 'Overlay news',
  summary: 'Something changed in the overlay.',
  body: 'Details.',
  published: '2026-10-02T14:00:00Z',
  updated: '2026-10-02T14:00:00Z',
};

function accepts(input: Raw): void {
  const r = noticeSchema.safeParse(input);
  expect(r.success, r.success ? '' : JSON.stringify(r.error.issues, null, 2)).toBe(true);
}

function rejects(input: Raw): { path: PropertyKey[] }[] {
  const r = noticeSchema.safeParse(input);
  expect(r.success, `accepted ${JSON.stringify(input)}`).toBe(false);
  return r.success ? [] : r.error.issues;
}

/** The failure must name the field (R2.1; Astro adds the file name). */
function rejectsNaming(input: Raw, field: string): void {
  const issues = rejects(input);
  expect(
    issues.some((i) => i.path.map(String).includes(field)),
    `no issue names "${field}": ${JSON.stringify(issues)}`
  ).toBe(true);
}

const withAffects = (affects: unknown): Raw => ({ ...SECURITY, affects });
const withRange = (range: unknown): Raw =>
  withAffects([{ cp: 'dev-libs/foo', ranges: [range] }]);

describe('exported constants', () => {
  it('NOTICE_TYPES, SEVERITIES and RANGE_OPS are exactly the allowed sets (R2.5, R2.6)', () => {
    expect([...NOTICE_TYPES].sort()).toEqual(['announcement', 'news', 'release', 'security']);
    expect([...SEVERITIES].sort()).toEqual(['critical', 'info', 'warning']);
    expect([...RANGE_OPS].sort()).toEqual(['<', '<=', '=', '>', '>=']);
  });

  it('ID_PATTERN and VERSION_PATTERN match what they name', () => {
    expect(ID_PATTERN.test('2026-10-02-gtk+-fix')).toBe(true);
    expect(ID_PATTERN.test('2026-10-02-Foo')).toBe(false);
    expect(VERSION_PATTERN.test('1.0_rc1_p2-r1')).toBe(true);
    expect(VERSION_PATTERN.test('v1.0')).toBe(false);
  });
});

describe('a well-formed notice', () => {
  it('is accepted, with its timestamps coerced to Dates', () => {
    const data = noticeSchema.parse(SECURITY);
    expect(data.published).toBeInstanceOf(Date);
    expect(data.updated).toBeInstanceOf(Date);
    expect(data.published.toISOString()).toBe('2026-10-02T14:00:00.000Z');
  });

  it('is accepted when YAML delivered the timestamps as Date objects (unquoted)', () => {
    accepts({
      ...SECURITY,
      published: new Date('2026-10-02T14:00:00Z'),
      updated: new Date('2026-10-03T08:00:00Z'),
    });
  });
});

describe('required fields (R2.1)', () => {
  it.each(['id', 'type', 'severity', 'title', 'summary', 'body', 'published', 'updated'])(
    'a notice without "%s" fails naming that field',
    (field) => {
      const input = { ...NEWS };
      delete input[field];
      rejectsNaming(input, field);
    }
  );

  it('title is 1 to 50 characters', () => {
    rejectsNaming({ ...NEWS, title: '' }, 'title');
    rejectsNaming({ ...NEWS, title: 'x'.repeat(51) }, 'title');
    accepts({ ...NEWS, title: 'x'.repeat(50) });
  });

  it('summary is 1 to 300 characters', () => {
    rejectsNaming({ ...NEWS, summary: '' }, 'summary');
    rejectsNaming({ ...NEWS, summary: 'x'.repeat(301) }, 'summary');
    accepts({ ...NEWS, summary: 'x'.repeat(300) });
  });

  it('body is not empty', () => {
    rejectsNaming({ ...NEWS, body: '' }, 'body');
  });

  it('a timestamp that is not a date fails naming the field', () => {
    rejectsNaming({ ...NEWS, published: 'yesterday' }, 'published');
    rejectsNaming({ ...NEWS, updated: 'not a date' }, 'updated');
  });
});

describe('id is a GLEP 42 news item name (R2.2)', () => {
  // Hostile half first: near-valid ids that must be refused.
  it.each([
    ['2026-02-30-foo', 'February 30'],
    ['2026-02-29-foo', 'February 29 in a common year'],
    ['2100-02-29-foo', 'February 29 in a century common year'],
    ['2026-13-01-foo', 'month 13'],
    ['2026-00-10-foo', 'month 00'],
    ['2026-10-00-foo', 'day 00'],
    ['2026-10-32-foo', 'day 32'],
    ['2026-10-2-foo', 'one-digit day'],
    ['26-10-02-foo', 'two-digit year'],
    ['2026-10-02_foo', 'underscore separator after the date'],
    ['2026-10-02-', 'empty short name'],
    [`2026-10-02-${'a'.repeat(21)}`, '21-character short name'],
    ['2026-10-02-Foo', 'uppercase'],
    ['2026-10-02-foo.bar', 'dot'],
    ['2026-10-02-foo/bar', 'slash'],
    ['2026-10-02-foo bar', 'space'],
    ['2026-10-02-föo', 'non-ASCII letter'],
    ['2026-10-02-foo\n', 'trailing newline'],
    [' 2026-10-02-foo', 'leading space'],
  ])('rejects %j (%s)', (id) => {
    rejectsNaming({ ...NEWS, id }, 'id');
  });

  it.each([
    ['2028-02-29-leap', 'February 29 in a leap year'],
    ['2000-02-29-leap', 'February 29 in a leap century'],
    ['2026-10-02-gtk+-fix', '"+"'],
    ['2026-10-02-a_b', '"_"'],
    ['2026-10-02-9', 'one digit'],
    [`2026-10-02-${'a'.repeat(20)}`, '20-character short name'],
    ['2026-12-31-x', 'last day of the year'],
  ])('accepts %j (%s)', (id) => {
    accepts({ ...NEWS, id });
  });
});

describe('type and severity (R2.5)', () => {
  it.each(['Security', 'SECURITY', 'security ', 'advisory', ''])('rejects type %j', (type) => {
    rejectsNaming({ ...SECURITY, type }, 'type');
  });

  it.each(['high', 'Critical', 'error', ''])('rejects severity %j', (severity) => {
    rejectsNaming({ ...SECURITY, severity }, 'severity');
  });

  it.each(['security', 'release', 'news', 'announcement'])('accepts type %j', (type) => {
    accepts({ ...SECURITY, type });
  });

  it.each(['info', 'warning', 'critical'])('accepts severity %j', (severity) => {
    accepts({ ...SECURITY, severity });
  });
});

describe('affects entries (R2.6)', () => {
  it.each([
    ['foo', 'no category'],
    ['dev-libs/', 'empty package'],
    ['/foo', 'empty category'],
    ['dev-libs/foo/bar', 'three segments'],
    ['dev-libs/foo:1', 'slot inside cp'],
    ['>=dev-libs/foo', 'operator inside cp'],
    ['dev-libs/foo-1.2', 'a versioned atom instead of a cp'],
    ['dev libs/foo', 'space'],
    ['', 'empty'],
  ])('rejects cp %j (%s)', (cp) => {
    rejectsNaming(withAffects([{ cp, ranges: [] }]), 'cp');
  });

  it.each(['dev-libs/foo', 'app-portage/bentoolkit', 'x11-libs/gtk+', 'dev-python/py_foo', 'virtual/libc'])(
    'accepts cp %j',
    (cp) => {
      accepts(withAffects([{ cp, ranges: [] }]));
    }
  );

  it('slot is optional', () => {
    accepts(withAffects([{ cp: 'dev-libs/foo', ranges: [{ op: '<', ver: '2' }] }]));
  });

  it.each(['1', '2.7', '0.1'])('accepts slot %j', (slot) => {
    accepts(withAffects([{ cp: 'dev-libs/foo', slot, ranges: [] }]));
  });

  // A slot never carries a subslot (R2.6): the tray compares slots only.
  it.each(['', '1/', ' 1', '1/2', '0/1.2'])('rejects slot %j', (slot) => {
    rejectsNaming(withAffects([{ cp: 'dev-libs/foo', slot, ranges: [] }]), 'slot');
  });

  // An empty `slot:` in YAML arrives as null. It must never reach the feed as
  // null: either the schema refuses it or it is treated as absent.
  it('a null slot is refused or treated as absent', () => {
    const r = noticeSchema.safeParse(withAffects([{ cp: 'dev-libs/foo', slot: null, ranges: [] }]));
    if (r.success) expect(r.data.affects[0].slot).toBeUndefined();
  });

  it('zero ranges are accepted', () => {
    accepts(withAffects([{ cp: 'dev-libs/foo', ranges: [] }]));
  });

  it.each(['!=', '==', '=>', '=<', '~', '', '< '])('rejects operator %j', (op) => {
    rejectsNaming(withRange({ op, ver: '1.0' }), 'op');
  });

  it.each(['<', '<=', '=', '>=', '>'])('accepts operator %j', (op) => {
    accepts(withRange({ op, ver: '1.0' }));
  });

  // Hostile half first: strings that look like versions but break PMS 3.2.
  it.each([
    ['v1.0', 'leading v'],
    ['1.0-rc1', 'hyphenated suffix'],
    ['1..2', 'empty component'],
    ['1.0.', 'trailing dot'],
    ['.1', 'leading dot'],
    ['1.0-r', 'revision without number'],
    ['1.0-r1-r2', 'two revisions'],
    ['1.0-r1_p1', 'suffix after the revision'],
    ['1.0_foo', 'unknown suffix'],
    ['1.0ab', 'two letters'],
    ['1.0 ', 'trailing space'],
    ['', 'empty'],
  ])('rejects version %j (%s)', (ver) => {
    rejectsNaming(withRange({ op: '<', ver }), 'ver');
  });

  it.each([
    '0',
    '1',
    '1.2.3',
    '1.0a',
    '1.0_rc1',
    '1.0_rc',
    '1.0_p',
    '1.0_p20260101',
    '1.0_alpha_beta2',
    '2.0-r1',
    '1.2.3a_alpha1_beta2_pre3_rc4_p5-r6',
    '9999',
  ])('accepts version %j', (ver) => {
    accepts(withRange({ op: '<', ver }));
  });
});

describe('timestamps are RFC 3339 with an explicit offset (R2.9)', () => {
  // Hostile half first: strings Date() would happily parse.
  it.each([
    ['2026-10-02T14:00:00', 'no offset (read in the build host time zone)'],
    ['2026-10-02', 'date only'],
    ['Oct 2 2026 14:00 UTC', 'not ISO'],
    ['Fri, 02 Oct 2026 14:00:00 GMT', 'RFC 2822'],
    [1790812800, 'plain number'],
    ['10000-01-01T00:00:00Z', 'year 10000'],
    ['+010000-01-01T00:00:00Z', 'expanded year'],
    ['0000-12-31T00:00:00Z', 'year 0000'],
    ['2026-10-02T14:00:00+2:00', 'one-digit offset hour'],
  ])('rejects %j (%s)', (value) => {
    rejectsNaming({ ...NEWS, published: value, updated: '2026-10-09T00:00:00Z' }, 'published');
    rejectsNaming({ ...NEWS, published: '0001-01-01T00:00:00Z', updated: value }, 'updated');
  });

  it.each([
    ['2026-10-02T14:00:00Z', 'Z'],
    ['2026-10-02T16:00:00+02:00', '+02:00'],
    ['2026-10-02T11:00:00-03:00', '-03:00'],
    ['2026-10-02T14:00:00.5Z', 'fractional seconds'],
  ])('accepts %j (%s)', (value) => {
    accepts({ ...NEWS, published: value, updated: value });
  });

  it('accepts a Date object (an unquoted YAML timestamp)', () => {
    const d = new Date('2026-10-02T14:00:00Z');
    accepts({ ...NEWS, published: d, updated: d });
  });

  it('accepts the year bounds 0001 and 9999', () => {
    accepts({ ...NEWS, published: '0001-01-01T00:00:00Z', updated: '9999-12-31T23:59:59Z' });
  });
});

describe('string fields refuse characters XML cannot carry (R2.10)', () => {
  const ch = (code: number) => String.fromCharCode(code);
  const refused = [0, 1, 8, 11, 12, 13, 27, 31, 0xfffe, 0xffff];

  it.each(refused)('rejects character %i in title, summary and body', (code) => {
    rejectsNaming({ ...NEWS, title: `a${ch(code)}b` }, 'title');
    rejectsNaming({ ...NEWS, summary: `a${ch(code)}b` }, 'summary');
    rejectsNaming({ ...NEWS, body: `a${ch(code)}b` }, 'body');
  });

  // Converse: the body is multi-line text; tab and line feed stay accepted there.
  it('accepts tab and line feed in the body', () => {
    accepts({ ...NEWS, body: `p1${ch(10)}${ch(10)}p2${ch(9)}x${ch(10)}` });
  });
});

describe('title and summary are single-line (R2.12)', () => {
  const ch = (code: number) => String.fromCharCode(code);

  it.each([
    [9, 'tab'],
    [10, 'line feed'],
  ])('rejects a %i (%s) in title and in summary', (code) => {
    rejectsNaming({ ...NEWS, title: `a${ch(code)}b` }, 'title');
    rejectsNaming({ ...NEWS, summary: `a${ch(code)}b` }, 'summary');
    rejectsNaming({ ...NEWS, summary: `trailing${ch(code)}` }, 'summary');
  });
});

describe('title and summary lengths count code points (R2.11)', () => {
  const emoji = String.fromCodePoint(0x1f600);

  it('a 50-emoji title is accepted and a 51-emoji title refused', () => {
    accepts({ ...NEWS, title: emoji.repeat(50) });
    rejectsNaming({ ...NEWS, title: emoji.repeat(51) }, 'title');
  });

  it('a 300-emoji summary is accepted and a 301-emoji summary refused', () => {
    accepts({ ...NEWS, summary: emoji.repeat(300) });
    rejectsNaming({ ...NEWS, summary: emoji.repeat(301) }, 'summary');
  });

  it('an empty title is refused', () => {
    rejectsNaming({ ...NEWS, title: '' }, 'title');
  });
});

describe('updated is not earlier than published (R2.7)', () => {
  // Hostile halves first. The same instant can be written with different
  // offsets; the comparison is between instants, never between strings.
  it('rejects an updated instant that is earlier although its text sorts later', () => {
    rejectsNaming(
      { ...NEWS, published: '2026-10-02T12:00:00Z', updated: '2026-10-02T13:00:00+02:00' },
      'updated'
    );
  });

  it('accepts an updated instant that is later although its text sorts earlier', () => {
    accepts({ ...NEWS, published: '2026-10-02T14:00:00+02:00', updated: '2026-10-02T13:00:00Z' });
  });

  it('accepts a Date and a string that denote the same instant', () => {
    accepts({ ...NEWS, published: new Date('2026-10-02T14:00:00Z'), updated: '2026-10-02T16:00:00+02:00' });
  });

  it('rejects updated one second before published', () => {
    rejectsNaming({ ...NEWS, published: '2026-10-02T14:00:00Z', updated: '2026-10-02T13:59:59Z' }, 'updated');
  });

  it('accepts updated equal to published', () => {
    accepts({ ...NEWS, published: '2026-10-02T14:00:00Z', updated: '2026-10-02T14:00:00Z' });
  });
});

describe('security and release notices name what they affect (R2.8)', () => {
  it.each(['security', 'release'])('a %s notice with an empty affects list fails naming affects', (type) => {
    rejectsNaming({ ...SECURITY, type, affects: [] }, 'affects');
  });

  it.each(['security', 'release'])('a %s notice without affects fails naming affects', (type) => {
    const input: Raw = { ...SECURITY, type };
    delete input.affects;
    rejectsNaming(input, 'affects');
  });

  it.each(['news', 'announcement'])('a %s notice may omit affects or leave it empty', (type) => {
    accepts({ ...NEWS, type });
    accepts({ ...NEWS, type, affects: [] });
  });
});
