import type { APIRoute } from 'astro';

export const GET: APIRoute = () => {
  const site = (import.meta.env.PUBLIC_SITE_URL || 'https://bentoo.org').replace(/\/$/, '');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml"><url><loc>${site}/</loc><xhtml:link rel="alternate" hreflang="en" href="${site}/"/><xhtml:link rel="alternate" hreflang="pt-BR" href="${site}/pt/"/><xhtml:link rel="alternate" hreflang="x-default" href="${site}/"/></url><url><loc>${site}/pt/</loc><xhtml:link rel="alternate" hreflang="en" href="${site}/"/><xhtml:link rel="alternate" hreflang="pt-BR" href="${site}/pt/"/><xhtml:link rel="alternate" hreflang="x-default" href="${site}/"/></url></urlset>`;
  return new Response(xml, {
    status: 200,
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
