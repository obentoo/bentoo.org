import { DEFAULT_LOCALE, LOCALES, type Lang } from './getLang';
import type { VariantSlug } from '~/data/variants';

const FALLBACK_SITE = 'https://obentoo.org';

/**
 * The site origin, with no trailing slash: `PUBLIC_SITE_URL` when non-empty,
 * else the canonical `https://obentoo.org`. The single origin derivation in `src/`.
 */
export function siteOrigin(): string {
  const envSite = import.meta.env.PUBLIC_SITE_URL;
  return (envSite && envSite.length > 0 ? envSite : FALLBACK_SITE).replace(/\/$/, '');
}

/**
 * Absolute URL for a site-relative `path`. The path must start with "/" so the
 * result never loses or doubles the separator; it is appended verbatim.
 */
export function pageUrl(path: string): string {
  if (!path.startsWith('/')) {
    throw new Error(`pageUrl: path must start with "/": ${path}`);
  }
  return siteOrigin() + path;
}

function langPrefix(lang: Lang): string {
  return lang === DEFAULT_LOCALE ? '' : `/${lang}`;
}

export function rootUrl(lang: Lang): string {
  return `${siteOrigin()}${langPrefix(lang)}/`;
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
