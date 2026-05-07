import type { APIRoute } from 'astro';
import {
  LOCALES,
  DEFAULT_LOCALE,
  hreflangFor,
} from '~/utils/getLang';

export const GET: APIRoute = () => {
  const site = (import.meta.env.PUBLIC_SITE_URL || 'https://bentoo.org').replace(/\/$/, '');

  const localeUrl = (lang: string): string =>
    lang === DEFAULT_LOCALE ? `${site}/` : `${site}/${lang}/`;

  const altLinks = LOCALES.map(
    (l) =>
      `<xhtml:link rel="alternate" hreflang="${hreflangFor(l)}" href="${localeUrl(l)}"/>`
  ).join('');
  const xDefault = `<xhtml:link rel="alternate" hreflang="x-default" href="${site}/"/>`;

  const urls = LOCALES.map(
    (l) => `<url><loc>${localeUrl(l)}</loc>${altLinks}${xDefault}</url>`
  ).join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${urls}</urlset>`;

  return new Response(xml, {
    status: 200,
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
