// Story 002, Task 5.1 — feed discovery links and media-type rules (R6.1–R6.3).
// `astro preview` ignores public/_headers, so the rules are asserted as text in
// dist/_headers (as redirects.spec.ts does); the served Content-Type is proved
// with `wrangler dev` in the task Validation.
import { test, expect } from '@playwright/test';
import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';

const DIST = path.resolve(process.cwd(), 'dist');
const FEEDS = {
  '/notices.json': 'application/feed+json; charset=utf-8',
  '/notices.atom': 'application/atom+xml; charset=utf-8',
} as const;

type Rule = { pattern: string; lines: string[] };

function rules(): Rule[] {
  const file = path.join(DIST, '_headers');
  expect(existsSync(file), `missing ${file}; run pnpm build first`).toBe(true);
  const out: Rule[] = [];
  for (const line of readFileSync(file, 'utf8').split('\n')) {
    if (!line.trim() || line.trim().startsWith('#')) continue;
    if (/^\S/.test(line)) out.push({ pattern: line.trim(), lines: [] });
    else out.at(-1)?.lines.push(line.trim());
  }
  return out;
}

// Cloudflare _headers path matching: "*" is a splat, ":name" one segment.
const matches = (pattern: string, p: string) =>
  new RegExp(
    '^' +
      pattern
        .replace(/[.+?^${}()|[\]\\]/g, '\\$&')
        .replace(/\*/g, '.*')
        .replace(/:[A-Za-z]\w*/g, '[^/]+') +
      '$'
  ).test(p);

const setsContentType = (r: Rule) => r.lines.some((l) => /^content-type\s*:/i.test(l));

test.describe('media types in dist/_headers (R6.1, R6.2)', () => {
  for (const [feed, type] of Object.entries(FEEDS)) {
    test(`${feed} detaches the default Content-Type, then sets ${type}`, () => {
      expect(existsSync(path.join(DIST, feed.slice(1))), `dist${feed} is not built`).toBe(true);
      const rule = rules().find((r) => r.pattern === feed);
      expect(rule, `no rule for ${feed}`).toBeDefined();
      const lines = rule!.lines.map((l) => l.toLowerCase());
      const detach = lines.indexOf('! content-type');
      const set = lines.indexOf(`content-type: ${type}`);
      expect(detach, `"! Content-Type" missing under ${feed}`).toBeGreaterThanOrEqual(0);
      expect(set, `"Content-Type: ${type}" missing under ${feed}`).toBeGreaterThan(detach);
      expect(rules().filter((r) => setsContentType(r) && matches(r.pattern, feed))).toHaveLength(1);
    });
  }

  // Hostile half: a broad rule would serve the HTML notice pages as a feed.
  test('no Content-Type rule matches an HTML page', () => {
    for (const p of ['/', '/notices/', '/notices/2026-10-02-foo/', '/pt/notices/', '/privacy', '/v/v4/']) {
      const hits = rules().filter((r) => setsContentType(r) && matches(r.pattern, p));
      expect(hits.map((r) => r.pattern), p).toEqual([]);
    }
  });
});

test.describe('feed discovery links (R6.3)', () => {
  const pages = ['/', '/pt/', '/es/', '/privacy', '/pt/privacy', '/v/v4/', '/pt/v/v4/', '/notices/', '/pt/notices/', '/es/notices/'];

  test('every page head links each feed exactly once', async ({ request }) => {
    const items = (await (await request.get('/notices.json')).json()).items as { id: string }[];
    const all = [...pages, ...items.slice(0, 1).map((i) => `/notices/${i.id}/`)];
    for (const p of all) {
      const res = await request.get(p);
      expect(res.status(), p).toBe(200);
      const headHtml = (await res.text()).split(/<\/head>/i)[0];
      const tags = [...headHtml.matchAll(/<link\b[^>]*>/gi)].map((m) => m[0]);
      for (const [feed, type] of Object.entries(FEEDS)) {
        const mime = type.split(';')[0];
        const found = tags.filter((t) => /rel=["']alternate["']/i.test(t) && t.includes(`type="${mime}"`));
        expect(found, `${p}: ${mime}`).toHaveLength(1);
        const href = found[0].match(/href=["']([^"']+)["']/i)?.[1] ?? '';
        expect(new URL(href, 'https://x.invalid').pathname, `${p}: ${mime}`).toBe(feed);
      }
    }
  });

  test('both linked feeds are served', async ({ request }) => {
    const json = await request.get('/notices.json');
    expect(json.status()).toBe(200);
    expect((await json.json()).version).toBe('https://jsonfeed.org/version/1.1');
    const atom = await request.get('/notices.atom');
    expect(atom.status()).toBe(200);
    expect(await atom.text()).toMatch(/<feed\b[^>]*xmlns="http:\/\/www\.w3\.org\/2005\/Atom"/);
  });
});
