// Every locale carries every string, in every module, with the markup of the
// English source. TypeScript's Record<Lang, …> types already refuse a missing
// locale or key at build time; these tests also catch what the types allow:
// an empty string, a locale left in English, and HTML tags lost or changed
// in translation.
import { describe, it, expect } from 'vitest';
import { LOCALES, DEFAULT_LOCALE, type Lang } from '~/utils/getLang';
import { I18N } from '~/i18n';

type Tree = string | Tree[] | { [k: string]: Tree };

const modules = import.meta.glob<Record<string, unknown>>('../../src/i18n/variants/*.ts', { eager: true });

// Each variant file exports one Record<Lang, Content>; index.ts and types.ts export none.
const variants: [string, Record<Lang, Tree>][] = Object.entries(modules).flatMap(([file, mod]) =>
  Object.entries(mod)
    .filter(([, v]) => typeof v === 'object' && v !== null && DEFAULT_LOCALE in v)
    .map(([name, v]) => [`${file.split('/').pop()}#${name}`, v as Record<Lang, Tree>] as [string, Record<Lang, Tree>]),
);

/** Leaf paths of a tree; array indices are kept so tag checks compare like for like. */
function leaves(t: Tree, path = '', out = new Map<string, string>()): Map<string, string> {
  if (typeof t === 'string') out.set(path, t);
  else if (Array.isArray(t)) t.forEach((v, i) => leaves(v, `${path}[${i}]`, out));
  else for (const [k, v] of Object.entries(t)) leaves(v, path ? `${path}.${k}` : k, out);
  return out;
}

/** Object keys of a tree, ignoring array lengths (a translated text block may wrap differently). */
function shape(t: Tree): unknown {
  if (typeof t === 'string') return 'string';
  if (Array.isArray(t)) return ['array', ...new Set(t.map((v) => JSON.stringify(shape(v))))];
  return Object.fromEntries(Object.keys(t).sort().map((k) => [k, shape((t as Record<string, Tree>)[k])]));
}

/** Sorted tags and entities of an HTML string; their text is translated, they are not. */
const markup = (s: string): string[] => (s.match(/<[^>]+>|&[a-z]+;/g) ?? []).sort();

const NON_DEFAULT = LOCALES.filter((l) => l !== DEFAULT_LOCALE);

describe('locales', () => {
  it('lists ru and zh next to en, pt and es', () => {
    expect([...LOCALES]).toEqual(['en', 'pt', 'es', 'ru', 'zh']);
  });

  it('finds every themed variant module', () => {
    expect(variants.length).toBe(21);
  });
});

describe('UI strings (src/i18n/<lang>.ts)', () => {
  const en = I18N[DEFAULT_LOCALE] as Record<string, string>;

  it.each(LOCALES)('%s has exactly the English keys, none empty', (lang) => {
    const s = I18N[lang] as Record<string, string>;
    expect(Object.keys(s).sort()).toEqual(Object.keys(en).sort());
    for (const [k, v] of Object.entries(s)) expect(v.trim(), `${lang}.${k}`).not.toBe('');
  });

  it.each(NON_DEFAULT)('%s translates the page chrome rather than copying English', (lang) => {
    const s = I18N[lang] as Record<string, string>;
    for (const k of ['subscribeButton', 'privacyPageBody', 'notFoundTitle', 'noticesTitle', 'noticesIntro']) {
      expect(s[k], `${lang}.${k}`).not.toBe(en[k]);
    }
  });

  it.each(NON_DEFAULT)('%s privacy text keeps the facts it must state', (lang) => {
    const body = (I18N[lang] as Record<string, string>).privacyPageBody;
    for (const fact of ['Buttondown', 'Cloudflare Web Analytics', 'localStorage', '"bentoo-variant"', '"bentoo-lang"', '24', 'contact@obentoo.org']) {
      expect(body, `${lang} privacy: ${fact}`).toContain(fact);
    }
    expect(body.split(/\n\s*\n/)).toHaveLength(en.privacyPageBody.split(/\n\s*\n/).length);
  });
});

describe.each(variants)('variant %s', (_name, content) => {
  const en = content[DEFAULT_LOCALE];
  const enLeaves = leaves(en);

  it.each(LOCALES)('%s is present with the English shape', (lang) => {
    expect(content[lang], lang).toBeDefined();
    expect(shape(content[lang])).toEqual(shape(en));
  });

  it.each(NON_DEFAULT)('%s keeps the English markup in every HTML string', (lang) => {
    for (const [path, value] of leaves(content[lang])) {
      if (!/Html$|Html[.[]/.test(path) && !/<|&[a-z]+;/.test(enLeaves.get(path) ?? '')) continue;
      const source = enLeaves.get(path);
      if (source === undefined) continue; // a re-wrapped text block has more lines than English
      expect(markup(value), `${lang} ${path}`).toEqual(markup(source));
    }
  });

  it.each(NON_DEFAULT)('%s has no empty title or description', (lang) => {
    const top = content[lang] as Record<string, Tree>;
    for (const k of ['title', 'description']) {
      if (typeof top[k] === 'string') expect((top[k] as string).trim(), `${lang}.${k}`).not.toBe('');
    }
  });
});
