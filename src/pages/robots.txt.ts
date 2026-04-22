import type { APIRoute } from 'astro';

export const GET: APIRoute = () => {
  const isProduction = import.meta.env.PUBLIC_IS_PRODUCTION === true;
  const site = (import.meta.env.PUBLIC_SITE_URL || 'https://bentoo.org').replace(/\/$/, '');

  const body = isProduction
    ? `User-agent: *
Allow: /
Disallow: /v/
Disallow: /pt/v/

Sitemap: ${site}/sitemap.xml
`
    : `User-agent: *
Disallow: /
`;

  return new Response(body, {
    status: 200,
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
