import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import {
  LOCALES,
  DEFAULT_LOCALE,
  hreflangFor,
} from '~/utils/getLang';
import { siteOrigin } from '~/utils/siteUrl';

export const GET: APIRoute = async () => {
  const site = siteOrigin();

  // `path` is locale-neutral and starts and ends with "/"; the default locale
  // is unprefixed, the others carry their code (R5.4).
  const localeUrl = (lang: string, path = '/'): string =>
    lang === DEFAULT_LOCALE ? `${site}${path}` : `${site}/${lang}${path}`;

  // One <url> per locale, each with alternates to that same page in every
  // locale plus x-default (the default locale's page).
  const entriesFor = (path: string): string => {
    const altLinks = LOCALES.map(
      (l) =>
        `<xhtml:link rel="alternate" hreflang="${hreflangFor(l)}" href="${localeUrl(l, path)}"/>`
    ).join('');
    const xDefault = `<xhtml:link rel="alternate" hreflang="x-default" href="${localeUrl(DEFAULT_LOCALE, path)}"/>`;
    return LOCALES.map(
      (l) => `<url><loc>${localeUrl(l, path)}</loc>${altLinks}${xDefault}</url>`
    ).join('');
  };

  // Notice ids are limited to [a-z0-9+_-] by the schema, so they need no
  // XML escaping.
  const notices = await getCollection('notices');
  const paths = ['/', '/notices/', ...notices.map((n) => `/notices/${n.id}/`)];
  const urls = paths.map(entriesFor).join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${urls}</urlset>`;

  return new Response(xml, {
    status: 200,
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
