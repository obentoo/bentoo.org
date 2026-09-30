// Story 002, Task 1.2 — visible contact and remaining origin text (R1.3, R1.4).
//
// This file is itself inside the R1.4 search scope, so it never spells the retired
// host literally: HOST is assembled at run time.
import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { stringsFor } from '~/i18n';
import { LOCALES } from '~/utils/getLang';

const ROOT = process.cwd();
const HOST = ['bentoo', 'org'].join('.');
const CONTACT = 'contact@obentoo.org';

/**
 * R1.4 predicate: the offending occurrences of the retired host in `text`.
 * An occurrence is allowed only when it is part of `obentoo.org` (preceded by
 * "o") or is the GitHub repository name `obentoo/<host>`. Hosts are
 * case-insensitive, so the search is too.
 */
function retiredHostHits(text: string): string[] {
  const hits: string[] = [];
  const re = new RegExp(HOST.replace('.', '\\.'), 'gi');
  for (const m of text.matchAll(re)) {
    const at = m.index ?? 0;
    const before = text.slice(0, at);
    if (/o$/i.test(before)) continue;
    if (/obentoo\/$/i.test(before)) continue;
    hits.push(text.slice(Math.max(0, at - 20), at + HOST.length + 5));
  }
  return hits;
}

describe('the R1.4 predicate itself', () => {
  // Hostile half first: forms the rule must catch, including the ones a
  // lookbehind that also skips "/" would let through.
  it.each([
    [`https://${HOST}`],
    [`https://${HOST}/pt/`],
    [`founder@${HOST}`],
    [`https://preview.${HOST}`],
    [`github.com/someone/${HOST}`],
    [`"${HOST} — coming-soon"`],
    [`https://${HOST.toUpperCase()}/`],
    [`© 2026 ${HOST[0].toUpperCase()}${HOST.slice(1)}`],
  ])('flags %s', (text) => {
    expect(retiredHostHits(text)).toHaveLength(1);
  });

  it.each([
    ['https://obentoo.org'],
    ['https://www.obentoo.org/'],
    ['contact@obentoo.org'],
    [`https://github.com/obentoo/${HOST}.git`],
    [`https://github.com/obentoo/${HOST}/issues`],
  ])('allows %s', (text) => {
    expect(retiredHostHits(text)).toEqual([]);
  });
});

function walk(dir: string): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).flatMap((name) => {
    const full = path.join(dir, name);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
}

// Binary files (images, fonts) are recognised by a NUL byte, so extensionless
// text files such as public/_headers and public/_redirects stay in scope.
function isText(file: string): boolean {
  return !readFileSync(file).includes(0);
}
const SCANNED_DIRS = ['src', 'tests', 'scripts', 'public', '.github'];
const SCANNED_FILES = [
  'astro.config.mjs',
  'package.json',
  '.env.example',
  'wrangler.jsonc',
  'playwright.config.ts',
  'vitest.config.ts',
  'tsconfig.json',
  'lighthouserc.cjs',
];

function scannedFiles(): string[] {
  const fromDirs = SCANNED_DIRS.flatMap((d) => walk(path.join(ROOT, d)));
  const named = SCANNED_FILES.map((f) => path.join(ROOT, f)).filter((f) => existsSync(f));
  return [...fromDirs, ...named].filter(isText);
}

describe('no source, configuration or test file names the retired host (R1.4)', () => {
  it('the search covers the configuration files and the source tree', () => {
    const files = scannedFiles().map((f) => path.relative(ROOT, f));
    expect(files).toContain('astro.config.mjs');
    expect(files).toContain('package.json');
    expect(files.some((f) => f.startsWith(`src${path.sep}`))).toBe(true);
    expect(files.some((f) => f.startsWith(`tests${path.sep}`))).toBe(true);
    expect(files).toContain(path.join('public', '_headers'));
  });

  it('finds no occurrence outside obentoo.org and the obentoo/ repository name', () => {
    const offenders: string[] = [];
    for (const file of scannedFiles()) {
      readFileSync(file, 'utf8')
        .split('\n')
        .forEach((line, i) => {
          for (const hit of retiredHostHits(line)) {
            offenders.push(`${path.relative(ROOT, file)}:${i + 1}: …${hit}…`);
          }
        });
    }
    expect(offenders).toEqual([]);
  });
});

describe('the visible contact address is contact@obentoo.org in every locale (R1.3)', () => {
  it.each(LOCALES.map((l) => [l]))('the %s privacy page names contact@obentoo.org', (lang) => {
    expect(stringsFor(lang).privacyPageBody).toContain(CONTACT);
  });

  it.each(LOCALES.map((l) => [l]))(
    'every project address in the %s strings is contact@obentoo.org',
    (lang) => {
      const text = Object.values(stringsFor(lang))
        .filter((v): v is string => typeof v === 'string')
        .join('\n');
      const addresses = [...text.matchAll(/[\w.+-]+@(?:[\w-]+\.)*o?bentoo\.org/gi)].map(
        (m) => m[0]
      );
      expect(addresses.length).toBeGreaterThan(0);
      for (const a of addresses) expect(a.toLowerCase()).toBe(CONTACT);
    }
  );

  // A third address such as founder@obentoo.org passes the host rule above but
  // is still not the contact address the requirement names.
  it('no page source under src/ shows a project address other than contact@obentoo.org', () => {
    const offenders: string[] = [];
    for (const file of walk(path.join(ROOT, 'src')).filter(isText)) {
      const text = readFileSync(file, 'utf8');
      for (const m of text.matchAll(/[\w.+-]+@(?:[\w-]+\.)*o?bentoo\.org/gi)) {
        if (m[0].toLowerCase() !== CONTACT) offenders.push(`${path.relative(ROOT, file)}: ${m[0]}`);
      }
    }
    expect(offenders).toEqual([]);
  });
});
