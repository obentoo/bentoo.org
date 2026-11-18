import type { APIRoute } from 'astro';
import { siteOrigin } from '~/utils/siteUrl';
import { DEFAULT_LOCALE, LOCALES } from '~/utils/getLang';

export const GET: APIRoute = () => {
  const isProduction = import.meta.env.PUBLIC_IS_PRODUCTION === true;
  const site = siteOrigin();
  // Variant pages are noindex in every locale tree, not just the default one.
  const variantDisallows = LOCALES.filter((l) => l !== DEFAULT_LOCALE)
    .map((l) => `Disallow: /${l}/v/\n`)
    .join('');

  const body = isProduction
    ? `User-agent: *
Allow: /
Disallow: /v/
${variantDisallows}
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
