// /notices.atom (story 002, R4): the Atom twin of /notices.json, rendered from
// the same collection and the same BUILD_TIME.
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { BUILD_TIME } from '~/utils/buildTime';
import { assertIdentity, buildAtom } from '~/utils/feed';
import { siteOrigin } from '~/utils/siteUrl';

export const GET: APIRoute = async () => {
  const entries = await getCollection('notices');
  // A notice whose id is not its file name, or a duplicate id, fails the build (R2.3, R2.4).
  assertIdentity(entries);
  const body = buildAtom(
    entries.map((e) => e.data),
    BUILD_TIME,
    siteOrigin()
  );
  // Honoured by `astro dev` only: the static build drops response headers, so
  // production serves the media type from public/_headers.
  return new Response(body, {
    status: 200,
    headers: { 'Content-Type': 'application/atom+xml; charset=utf-8' },
  });
};
