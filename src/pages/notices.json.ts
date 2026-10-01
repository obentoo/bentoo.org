// /notices.json (story 002, R3): the JSON Feed 1.1 of every notice, the
// contract bentoolkit reads. Prerendered once per build from BUILD_TIME.
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { BUILD_TIME } from '~/utils/buildTime';
import { assertIdentity, buildJsonFeed } from '~/utils/feed';
import { siteOrigin } from '~/utils/siteUrl';

export const GET: APIRoute = async () => {
  const entries = await getCollection('notices');
  // A notice whose id is not its file name, or a duplicate id, fails the build (R2.3, R2.4).
  assertIdentity(entries);
  const body = buildJsonFeed(
    entries.map((e) => e.data),
    BUILD_TIME,
    siteOrigin()
  );
  // Honoured by `astro dev` only: the static build drops response headers, so
  // production serves the media type from public/_headers.
  return new Response(body, {
    status: 200,
    headers: { 'Content-Type': 'application/feed+json; charset=utf-8' },
  });
};
