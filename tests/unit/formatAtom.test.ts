// Story 002, Task 4.1 — rendering helpers and chrome strings (R5.1, R5.2, R5.3).
import { describe, it, expect } from 'vitest';
import { formatAtom } from '~/utils/formatAtom';
import { stringsFor } from '~/i18n';
import { LOCALES } from '~/utils/getLang';

// Literal sets (R2.5), so these checks do not lean on the schema module.
const NOTICE_TYPES = ['security', 'release', 'news', 'announcement'] as const;
const SEVERITIES = ['info', 'warning', 'critical'] as const;

type Affects = Parameters<typeof formatAtom>[0];
const fmt = (a: unknown): string[] => formatAtom(a as Affects);

describe('formatAtom (R5.1)', () => {
  it('renders the design example exactly', () => {
    expect(
      fmt([{ cp: 'dev-libs/foo', slot: '1', ranges: [{ op: '>=', ver: '1.2' }, { op: '<', ver: '2' }] }])
    ).toEqual(['>=dev-libs/foo-1.2 and <dev-libs/foo-2 (slot 1)']);
  });

  it('renders one range without a slot as a bare atom', () => {
    const [line] = fmt([{ cp: 'app-portage/bentoolkit', ranges: [{ op: '<', ver: '0.9.1' }] }]);
    expect(line).toContain('<app-portage/bentoolkit-0.9.1');
    expect(line).not.toMatch(/slot/i);
  });

  it('keeps a revision in the version', () => {
    expect(fmt([{ cp: 'dev-libs/foo', ranges: [{ op: '=', ver: '1.2.3-r1' }] }])[0]).toContain(
      '=dev-libs/foo-1.2.3-r1'
    );
  });

  it('renders an entry without ranges as the package, with no version', () => {
    const [line] = fmt([{ cp: 'dev-libs/foo', ranges: [] }]);
    expect(line.startsWith('dev-libs/foo')).toBe(true);
    expect(line).not.toContain('dev-libs/foo-');
  });

  it('returns no line for no entries', () => {
    expect(fmt([])).toEqual([]);
  });

  // Hostile half: entries for the same package must not collapse into one line.
  it('gives one distinct line per entry, in order, for the same cp in two slots', () => {
    const lines = fmt([
      { cp: 'dev-lang/python', slot: '3.12', ranges: [{ op: '<', ver: '3.12.5' }] },
      { cp: 'dev-lang/python', slot: '3.13', ranges: [{ op: '<', ver: '3.13.1' }] },
    ]);
    expect(lines).toHaveLength(2);
    expect(lines[0]).toContain('3.12.5');
    expect(lines[1]).toContain('3.13.1');
  });

  it('keeps the same cp and range with and without a slot apart', () => {
    const lines = fmt([
      { cp: 'dev-libs/foo', slot: '1', ranges: [{ op: '<', ver: '2' }] },
      { cp: 'dev-libs/foo', ranges: [{ op: '<', ver: '2' }] },
    ]);
    expect(lines).toHaveLength(2);
    expect(lines[0]).not.toBe(lines[1]);
  });
});

describe('notice chrome strings (R5.1, R5.2, R5.3)', () => {
  const keys = [
    'noticesTitle',
    'noticesIntro',
    'noticeAffects',
    'noticePublished',
    'noticeUpdated',
    'noticesEmpty',
    'noticesFeedLinks',
    ...NOTICE_TYPES.map((t) => `noticeType_${t}`),
    ...SEVERITIES.map((s) => `noticeSeverity_${s}`),
  ];

  it.each(LOCALES.map((l) => [l]))('%s defines every notice chrome key', (lang) => {
    const s = stringsFor(lang) as unknown as Record<string, unknown>;
    for (const k of keys) {
      expect(typeof s[k], `${lang}.${k}`).toBe('string');
      expect((s[k] as string).trim(), `${lang}.${k}`).not.toBe('');
    }
  });

  it.each(LOCALES.map((l) => [l]))('%s labels every type and severity distinctly', (lang) => {
    const s = stringsFor(lang) as unknown as Record<string, string>;
    expect(new Set(NOTICE_TYPES.map((t) => s[`noticeType_${t}`])).size).toBe(NOTICE_TYPES.length);
    expect(new Set(SEVERITIES.map((v) => s[`noticeSeverity_${v}`])).size).toBe(SEVERITIES.length);
  });

  it.each(['pt', 'es'] as const)('%s chrome is translated, not English', (lang) => {
    const en = stringsFor('en') as unknown as Record<string, string>;
    const s = stringsFor(lang) as unknown as Record<string, string>;
    expect(s.noticesTitle).not.toBe(en.noticesTitle);
    expect(s.noticesEmpty).not.toBe(en.noticesEmpty);
  });
});
