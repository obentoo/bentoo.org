export type Lang = 'en' | 'pt' | 'es';

export const LOCALES: readonly Lang[] = ['en', 'pt', 'es'] as const;
export const DEFAULT_LOCALE: Lang = 'en';

const LANG_PREFIXES: { prefix: string; lang: Lang }[] = [
  { prefix: '/pt', lang: 'pt' },
  { prefix: '/es', lang: 'es' },
];

export function getLang(pathname: string): Lang {
  for (const { prefix, lang } of LANG_PREFIXES) {
    if (pathname === prefix || pathname.startsWith(`${prefix}/`)) return lang;
  }
  return DEFAULT_LOCALE;
}

export function htmlLangFor(lang: Lang): string {
  if (lang === 'pt') return 'pt-BR';
  return lang;
}

export function ogLocaleFor(lang: Lang): string {
  if (lang === 'pt') return 'pt_BR';
  if (lang === 'es') return 'es_ES';
  return 'en_US';
}

export function hreflangFor(lang: Lang): string {
  return htmlLangFor(lang);
}
