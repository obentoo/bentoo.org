// A locale's code is also its URL prefix (`/ru/`, `/zh/`) and the value the
// language menu stores in `bentoo-lang`; the default locale is unprefixed.
// Chinese is `zh`, not `zh-cn`: the site ships one Chinese script, so the
// short prefix is enough, and a prefix match on navigator.language picks it
// for every zh-* browser (zh, zh-CN, zh-Hans, zh-SG, also zh-TW/zh-HK, which
// otherwise would get English). The region lives in `htmlLangFor`.
export type Lang = 'en' | 'pt' | 'es' | 'ru' | 'zh';

export const LOCALES: readonly Lang[] = ['en', 'pt', 'es', 'ru', 'zh'] as const;
export const DEFAULT_LOCALE: Lang = 'en';

const LANG_PREFIXES: { prefix: string; lang: Lang }[] = LOCALES.filter(
  (l) => l !== DEFAULT_LOCALE,
).map((lang) => ({ prefix: `/${lang}`, lang }));

export function getLang(pathname: string): Lang {
  for (const { prefix, lang } of LANG_PREFIXES) {
    if (pathname === prefix || pathname.startsWith(`${prefix}/`)) return lang;
  }
  return DEFAULT_LOCALE;
}

/** BCP 47 tag for `<html lang>`, hreflang and Intl formatting. */
const HTML_LANG: Record<Lang, string> = {
  en: 'en',
  pt: 'pt-BR',
  es: 'es',
  ru: 'ru',
  zh: 'zh-CN',
};

/** Open Graph `og:locale` value (language_TERRITORY). */
const OG_LOCALE: Record<Lang, string> = {
  en: 'en_US',
  pt: 'pt_BR',
  es: 'es_ES',
  ru: 'ru_RU',
  zh: 'zh_CN',
};

export function htmlLangFor(lang: Lang): string {
  return HTML_LANG[lang];
}

export function ogLocaleFor(lang: Lang): string {
  return OG_LOCALE[lang];
}

export function hreflangFor(lang: Lang): string {
  return htmlLangFor(lang);
}
