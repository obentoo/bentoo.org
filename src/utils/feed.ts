// Feed builders (story 002, R3, R4): pure rendering of validated notices.
import type { Affects, Notice } from '../content/noticeSchema';

export type { Notice };

/** How long a client may trust a feed: 30 × 24 h of UTC time, not calendar days (R3.4). */
const EXPIRES_AFTER_SECONDS = 30 * 86400;

/** Whole Unix seconds of an instant; milliseconds are dropped. */
const unixSeconds = (d: Date): number => Math.floor(d.getTime() / 1000);

/** RFC 3339 in UTC without milliseconds, e.g. `2026-10-02T14:00:00Z`. */
const rfc3339 = (d: Date): string => d.toISOString().replace(/\.\d{3}Z$/, 'Z');

/**
 * Feed order (R3.5): `updated` newest first (to the second), ties by `id` ascending in UTF-16
 * code-unit order (`<`, never `localeCompare`, which collates punctuation by
 * locale). Returns a new array; the input is left untouched.
 */
export function sortNotices(n: Notice[]): Notice[] {
  return [...n].sort((a, b) => {
    // Whole seconds, as `date_modified` prints them: a client re-sorting the
    // feed by (date_modified, id) must get the same order.
    const byUpdated = unixSeconds(b.updated) - unixSeconds(a.updated);
    if (byUpdated !== 0) return byUpdated;
    if (a.id === b.id) return 0;
    return a.id < b.id ? -1 : 1;
  });
}

/** `affects` in the fixed key order; `slot` is omitted when absent, never null. */
function affectsJson(affects: Affects) {
  return affects.map(({ cp, slot, ranges }) => ({
    cp,
    ...(slot === undefined ? {} : { slot }),
    ranges: ranges.map(({ op, ver }) => ({ op, ver })),
  }));
}

/**
 * The JSON Feed 1.1 document of `/notices.json` (R3.1-R3.6), keys in the fixed
 * order of design.md at every level. Every URL is built from `origin` (no
 * trailing slash); `now` is the build time behind the feed-level `_bentoo`.
 */
export function buildJsonFeed(n: Notice[], now: Date, origin: string): string {
  const serial = unixSeconds(now);
  const feed = {
    version: 'https://jsonfeed.org/version/1.1',
    title: 'bentoo notices',
    home_page_url: `${origin}/notices/`,
    feed_url: `${origin}/notices.json`,
    language: 'en',
    _bentoo: {
      serial,
      expires: rfc3339(new Date((serial + EXPIRES_AFTER_SECONDS) * 1000)),
    },
    items: sortNotices(n).map((notice) => ({
      id: notice.id,
      url: `${origin}/notices/${notice.id}/`,
      title: notice.title,
      summary: notice.summary,
      content_text: notice.body,
      date_published: rfc3339(notice.published),
      date_modified: rfc3339(notice.updated),
      _bentoo: {
        type: notice.type,
        severity: notice.severity,
        affects: affectsJson(notice.affects),
      },
    })),
  };
  return JSON.stringify(feed, null, 2) + '\n';
}

/**
 * Escapes the five XML special characters (R4.3) so a string is safe as element
 * text and inside either attribute quote. `&` goes first, so an existing entity
 * such as `&lt;` is escaped again (`&amp;lt;`) rather than passed through.
 * Characters XML 1.0 forbids outright are refused upstream by the schema.
 */
export function xmlEscape(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/** One Atom entry; every interpolated value goes through `xmlEscape`. */
function atomEntry(notice: Notice, origin: string): string {
  const page = xmlEscape(`${origin}/notices/${notice.id}/`);
  return [
    '  <entry>',
    `    <id>${page}</id>`,
    `    <title type="text">${xmlEscape(notice.title)}</title>`,
    `    <published>${rfc3339(notice.published)}</published>`,
    `    <updated>${rfc3339(notice.updated)}</updated>`,
    `    <summary type="text">${xmlEscape(notice.summary)}</summary>`,
    `    <link rel="alternate" type="text/html" href="${page}"/>`,
    `    <category term="${xmlEscape(notice.type)}"/>`,
    '    <author>',
    '      <name>bentoo</name>',
    '    </author>',
    '  </entry>',
  ].join('\n');
}

/**
 * The Atom (RFC 4287) document of `/notices.atom` (R4.1-R4.3). Entries follow
 * `sortNotices`; the feed `updated` is the newest entry update, or `now` when
 * there are no notices. Every URL is built from `origin` (no trailing slash).
 */
export function buildAtom(n: Notice[], now: Date, origin: string): string {
  const notices = sortNotices(n);
  const updated = notices.length > 0 ? notices[0].updated : now;
  const feedUrl = xmlEscape(`${origin}/notices.atom`);
  const lines = [
    '<?xml version="1.0" encoding="utf-8"?>',
    '<feed xmlns="http://www.w3.org/2005/Atom" xml:lang="en">',
    `  <id>${feedUrl}</id>`,
    '  <title type="text">bentoo notices</title>',
    `  <updated>${rfc3339(updated)}</updated>`,
    `  <link rel="self" type="application/atom+xml" href="${feedUrl}"/>`,
    `  <link rel="alternate" type="text/html" href="${xmlEscape(`${origin}/notices/`)}"/>`,
    ...notices.map((notice) => atomEntry(notice, origin)),
    '</feed>',
  ];
  return lines.join('\n') + '\n';
}

/**
 * Fails the build when a notice's `id` differs from its file name (R2.3) or two
 * notices share an `id` (R2.4). `entries` are collection entries, whose `id` is
 * the file name without `.yaml`. Ids are compared verbatim: "+", "-" and "_"
 * are significant.
 */
export function assertIdentity(entries: { id: string; data: Notice }[]): void {
  const fileById = new Map<string, string>();
  for (const { id: fileId, data } of entries) {
    if (data.id !== fileId) {
      throw new Error(`notice ${fileId}.yaml: id "${data.id}" differs from file name "${fileId}"`);
    }
    const first = fileById.get(data.id);
    if (first !== undefined) {
      throw new Error(`notices ${first}.yaml and ${fileId}.yaml share id "${data.id}"`);
    }
    fileById.set(data.id, fileId);
  }
}
