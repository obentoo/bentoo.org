// The notices collection as the notice pages read it (story 002, R5).
import { getCollection } from 'astro:content';
import type { Notice } from '~/content/noticeSchema';
import { assertIdentity } from '~/utils/feed';

/**
 * Every notice, after the same identity check the feed endpoints run (R2.3,
 * R2.4). The pages run it themselves so `astro dev`, which renders a page on
 * request without touching the endpoints, fails on the same files the build does.
 */
export async function loadNotices(): Promise<Notice[]> {
  const entries = await getCollection('notices');
  assertIdentity(entries);
  return entries.map((e) => e.data);
}
