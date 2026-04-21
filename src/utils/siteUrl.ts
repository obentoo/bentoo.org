import type { Lang } from './getLang';
import type { VariantSlug } from '~/data/variants';

const FALLBACK_SITE = 'https://bentoo.org';

function site(): string {
  const envSite = import.meta.env.PUBLIC_SITE_URL;
  return (envSite && envSite.length > 0 ? envSite : FALLBACK_SITE).replace(/\/$/, '');
}

export function rootUrl(lang: Lang): string {
  return lang === 'pt' ? `${site()}/pt/` : `${site()}/`;
}

export function siblingPath(path: string): string {
  if (path === '/pt' || path === '/pt/') return '/';
  if (path.startsWith('/pt/')) return path.slice(3);
  if (path === '/') return '/pt/';
  return `/pt${path.startsWith('/') ? '' : '/'}${path}`;
}

export function canonicalForVariant(_slug: VariantSlug, lang: Lang): string {
  return rootUrl(lang);
}
