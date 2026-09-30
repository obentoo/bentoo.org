// Story 002, Task 1.1 — one origin helper, used everywhere (R1.1, R1.2).
import { describe, it, expect, afterEach, vi } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { siteOrigin, pageUrl, rootUrl, canonicalForVariant } from '~/utils/siteUrl';
import { GET as sitemapGET } from '~/pages/sitemap.xml';

// The sitemap gains notice pages later in this story (Task 4.3) and will then
// read the notices collection; an empty collection keeps this file about the origin.
vi.mock('astro:content', () => ({ getCollection: async () => [] }));

const CANONICAL = 'https://obentoo.org';
const ROOT = process.cwd();

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('siteOrigin (R1.1)', () => {
  it('falls back to https://obentoo.org when PUBLIC_SITE_URL is empty', () => {
    vi.stubEnv('PUBLIC_SITE_URL', '');
    expect(siteOrigin()).toBe(CANONICAL);
  });

  it('uses PUBLIC_SITE_URL when it is set', () => {
    vi.stubEnv('PUBLIC_SITE_URL', 'https://preview.example.test');
    expect(siteOrigin()).toBe('https://preview.example.test');
  });

  it('removes a trailing slash from PUBLIC_SITE_URL', () => {
    vi.stubEnv('PUBLIC_SITE_URL', 'https://preview.example.test/');
    expect(siteOrigin()).toBe('https://preview.example.test');
  });
});

describe('pageUrl (R1.1)', () => {
  it('prefixes a path with the canonical origin', () => {
    vi.stubEnv('PUBLIC_SITE_URL', '');
    expect(pageUrl('/notices.json')).toBe(`${CANONICAL}/notices.json`);
  });

  it('follows PUBLIC_SITE_URL, with no doubled slash', () => {
    vi.stubEnv('PUBLIC_SITE_URL', 'https://preview.example.test/');
    expect(pageUrl('/notices/')).toBe('https://preview.example.test/notices/');
  });

  it('keeps notice-id characters verbatim', () => {
    vi.stubEnv('PUBLIC_SITE_URL', '');
    expect(pageUrl('/notices/2026-10-02-gtk+-fix/')).toBe(
      `${CANONICAL}/notices/2026-10-02-gtk+-fix/`
    );
  });
});

describe('existing helpers resolve through the same origin (R1.1)', () => {
  it('rootUrl and canonicalForVariant fall back to https://obentoo.org', () => {
    vi.stubEnv('PUBLIC_SITE_URL', '');
    expect(rootUrl('en')).toBe(`${CANONICAL}/`);
    expect(rootUrl('pt')).toBe(`${CANONICAL}/pt/`);
    expect(canonicalForVariant('mario', 'es')).toBe(`${CANONICAL}/es/`);
  });
});

describe('sitemap.xml builds absolute URLs from the canonical origin (R1.1)', () => {
  it('every <loc> starts with https://obentoo.org/ when PUBLIC_SITE_URL is empty', async () => {
    vi.stubEnv('PUBLIC_SITE_URL', '');
    const body = await (await sitemapGET({} as never)).text();
    const locs = [...body.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
    expect(locs.length).toBeGreaterThan(0);
    for (const loc of locs) expect(loc.startsWith(`${CANONICAL}/`), loc).toBe(true);
    const hrefs = [...body.matchAll(/href="([^"]+)"/g)].map((m) => m[1]);
    for (const href of hrefs) expect(href.startsWith(`${CANONICAL}/`), href).toBe(true);
  });
});

describe('astro.config.mjs site setting (R1.1)', () => {
  it('is https://obentoo.org when PUBLIC_SITE_URL is empty', async () => {
    vi.stubEnv('PUBLIC_SITE_URL', '');
    const configUrl = pathToFileURL(path.join(ROOT, 'astro.config.mjs')).href;
    const config = (await import(/* @vite-ignore */ configUrl)).default as { site?: string };
    expect(String(config.site).replace(/\/$/, '')).toBe(CANONICAL);
  });
});

// R1.2: the origin is derived in exactly one place. Every other way of reaching it
// is a re-derivation: the env variable, Astro's own `site`, or a hard-coded origin.
function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = path.join(dir, name);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
}

describe('the origin has a single derivation (R1.2)', () => {
  const HELPER = path.join(ROOT, 'src/utils/siteUrl.ts');
  const codeFiles = walk(path.join(ROOT, 'src')).filter(
    (f) => /\.(ts|mts|js|mjs|astro)$/.test(f) && !f.endsWith('.d.ts') && f !== HELPER
  );

  it('no file under src/ other than siteUrl.ts reads PUBLIC_SITE_URL, Astro.site or import.meta.env.SITE', () => {
    const offenders: string[] = [];
    for (const file of codeFiles) {
      readFileSync(file, 'utf8')
        .split('\n')
        .forEach((line, i) => {
          if (/PUBLIC_SITE_URL|Astro\.site\b|import\.meta\.env\.SITE\b/.test(line)) {
            offenders.push(`${path.relative(ROOT, file)}:${i + 1}: ${line.trim()}`);
          }
        });
    }
    expect(offenders).toEqual([]);
  });

  it('no page, layout or utility outside siteUrl.ts hard-codes the site origin', () => {
    const urlBuilders = codeFiles.filter((f) =>
      /[/\\]src[/\\](pages|layouts|utils)[/\\]/.test(f)
    );
    const offenders: string[] = [];
    for (const file of urlBuilders) {
      readFileSync(file, 'utf8')
        .split('\n')
        .forEach((line, i) => {
          if (/https?:\/\/(www\.)?o?bentoo\.org/i.test(line)) {
            offenders.push(`${path.relative(ROOT, file)}:${i + 1}: ${line.trim()}`);
          }
        });
    }
    expect(offenders).toEqual([]);
  });
});
