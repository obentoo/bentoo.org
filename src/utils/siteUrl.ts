import { DEFAULT_LOCALE, LOCALES, type Lang } from './getLang';
import type { VariantSlug } from '~/data/variants';

const FALLBACK_SITE = 'https://bentoo.org';

function site(): string {
  const envSite = import.meta.env.PUBLIC_SITE_URL;
  return (envSite && envSite.length > 0 ? envSite : FALLBACK_SITE).replace(/\/$/, '');
}

function langPrefix(lang: Lang): string {
  return lang === DEFAULT_LOCALE ? '' : `/${lang}`;
}

export function rootUrl(lang: Lang): string {
  return `${site()}${langPrefix(lang)}/`;
}

function stripLangPrefix(path: string): { rest: string } {
  for (const lang of LOCALES) {
    if (lang === DEFAULT_LOCALE) continue;
    const prefix = `/${lang}`;
    if (path === prefix || path === `${prefix}/`) return { rest: '/' };
    if (path.startsWith(`${prefix}/`)) return { rest: path.slice(prefix.length) };
  }
  return { rest: path };
}

export function localizedPath(path: string, target: Lang): string {
  const { rest } = stripLangPrefix(path);
  const normalized = rest.startsWith('/') ? rest : `/${rest}`;
  if (target === DEFAULT_LOCALE) return normalized;
  if (normalized === '/') return `/${target}/`;
  return `/${target}${normalized}`;
}

export function siblingPath(path: string): string {
  const { rest } = stripLangPrefix(path);
  const isDefault = rest === path;
  const target: Lang = isDefault ? 'pt' : DEFAULT_LOCALE;
  return localizedPath(path, target);
}

export function canonicalForVariant(_slug: VariantSlug, lang: Lang): string {
  return rootUrl(lang);
}
