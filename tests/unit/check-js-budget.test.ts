// Story 003, Task 5.1 — the inline-script budget sees every inline script (R4.1, R4.2, R3.5).
import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
import { copyFileSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { spawnSync } from 'node:child_process';
import { randomBytes } from 'node:crypto';

type Extract = (html: string) => string[];

const SCRIPT = path.resolve(process.cwd(), 'scripts/check-js-budget.mjs');

let extractInlineScripts: Extract;
const importEffects = { exit: 0, log: 0, error: 0 };

beforeAll(async () => {
  // Importing the module must not run the check: no scan of dist/, no output, no exit.
  const exit = vi.spyOn(process, 'exit').mockImplementation((() => undefined) as never);
  const log = vi.spyOn(console, 'log').mockImplementation(() => undefined);
  const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
  try {
    const mod = (await import(pathToFileURL(SCRIPT).href)) as { extractInlineScripts: Extract };
    extractInlineScripts = mod.extractInlineScripts;
  } finally {
    importEffects.exit = exit.mock.calls.length;
    importEffects.log = log.mock.calls.length;
    importEffects.error = error.mock.calls.length;
    exit.mockRestore();
    log.mockRestore();
    error.mockRestore();
  }
});

describe('the extractor is importable without running the check', () => {
  it('exports extractInlineScripts', () => {
    expect(typeof extractInlineScripts).toBe('function');
  });

  it('importing scans nothing, prints nothing and does not exit', () => {
    expect(importEffects).toEqual({ exit: 0, log: 0, error: 0 });
  });
});

describe('an end tag in any spelling closes the script (R4.1)', () => {
  it.each([
    ['upper case', '</SCRIPT>'],
    ['mixed case', '</Script>'],
    ['a space before >', '</script >'],
    ['a newline before >', '</script\n>'],
    ['a tab before >', '</script\t>'],
    ['an attribute', '</script foo="x">'],
    ['upper case and an attribute', '</SCRIPT data-x>'],
  ])('%s: %s', (_label, endTag) => {
    expect(extractInlineScripts(`<p>a</p><script>run()${endTag}<p>b</p>`)).toEqual(['run()']);
  });

  // Hostile (wrong collapse): with an unrecognised end tag, two scripts merge into one
  // body that swallows the HTML between them.
  it('a script closed by </SCRIPT > stays apart from the next script', () => {
    const html = '<script>a()</SCRIPT ><p>between</p><script>b()</script>';
    expect(extractInlineScripts(html)).toEqual(['a()', 'b()']);
  });

  // Hostile: JSON-LD closed by an unusual end tag must not hide the inline script after it.
  it('JSON-LD closed by </SCRIPT > does not swallow the inline script that follows', () => {
    const html = '<script type="application/ld+json">{"@type":"WebSite"}</SCRIPT ><script>track()</script>';
    expect(extractInlineScripts(html)).toEqual(['track()']);
  });

  it('an upper-case start tag, or one spread over lines, opens a script', () => {
    expect(extractInlineScripts('<SCRIPT>up()</SCRIPT>')).toEqual(['up()']);
    expect(extractInlineScripts('<script\n  type="module"\n>m()</script>')).toEqual(['m()']);
  });

  it('several scripts on a page are each counted, in order', () => {
    const html = '<script>one()</script><div></div><script type="module">two()</script ><SCRIPT>three()</Script>';
    expect(extractInlineScripts(html)).toEqual(['one()', 'two()', 'three()']);
  });
});

describe('only script elements count (R4.1)', () => {
  // Hostile (wrong collapse): look-alike tags are not scripts.
  it('<scripts>, <scripting> and <noscript> are not scripts', () => {
    expect(extractInlineScripts('<scripts>x()</scripts>')).toEqual([]);
    expect(extractInlineScripts('<scripting>x()</scripting>')).toEqual([]);
    expect(extractInlineScripts('<noscript><p>enable JS</p></noscript>')).toEqual([]);
  });

  // Third element: a look-alike END tag inside the body does not end the script.
  it('</scripts> inside a script body does not close it', () => {
    expect(extractInlineScripts('<script>a("</scripts>");b()</script>')).toEqual(['a("</scripts>");b()']);
  });

  it('a page with no script yields nothing', () => {
    expect(extractInlineScripts('<html><body><p>hi</p></body></html>')).toEqual([]);
  });
});

describe('external scripts and JSON-LD stay out of the budget (R4.2)', () => {
  it('a script with src is skipped, in any case', () => {
    expect(extractInlineScripts('<script src="/a.js"></script>')).toEqual([]);
    expect(extractInlineScripts('<script SRC="/a.js"></SCRIPT>')).toEqual([]);
    expect(extractInlineScripts("<script type=\"module\" src='/a.js'></script>")).toEqual([]);
  });

  // Converse (wrong split): the same external script, spelled with spaces around "=".
  it('a script with src = "…" (spaced) is still external', () => {
    expect(extractInlineScripts('<script src = "/a.js"></script>')).toEqual([]);
  });

  // Hostile (wrong collapse): an inline script that merely carries a data-src attribute
  // is inline, and must not pass as external.
  it('an inline script with a data-src attribute is counted', () => {
    expect(extractInlineScripts('<script data-src="/lazy.js">inline()</script>')).toEqual(['inline()']);
  });

  it('JSON-LD is skipped, in any case and quoting', () => {
    expect(extractInlineScripts('<script type="application/ld+json">{}</script>')).toEqual([]);
    expect(extractInlineScripts('<script TYPE="Application/LD+JSON">{}</script>')).toEqual([]);
    expect(extractInlineScripts("<script type='application/ld+json'>{}</script>")).toEqual([]);
  });

  it('module and classic inline scripts are counted', () => {
    expect(extractInlineScripts('<script type="module">m()</script><script>c()</script>')).toEqual(['m()', 'c()']);
  });
});

describe('run as a command, the check still enforces the budget (R3.5, R4.1)', () => {
  let dir: string;

  beforeAll(() => {
    dir = mkdtempSync(path.join(tmpdir(), 'check-js-budget-'));
    mkdirSync(path.join(dir, 'scripts'));
    copyFileSync(SCRIPT, path.join(dir, 'scripts', 'check-js-budget.mjs'));
  });

  afterAll(() => {
    rmSync(dir, { recursive: true, force: true });
  });

  /** Run `node scripts/check-js-budget.mjs`, as `pnpm check:js` does, over a one-page dist/. */
  function runOver(html: string) {
    rmSync(path.join(dir, 'dist'), { recursive: true, force: true });
    mkdirSync(path.join(dir, 'dist'));
    writeFileSync(path.join(dir, 'dist', 'index.html'), html);
    return spawnSync(process.execPath, ['scripts/check-js-budget.mjs'], { cwd: dir, encoding: 'utf8' });
  }

  // Incompressible, so its gzip size is far over the 5120 B variant budget.
  const oversized = () => `var blob = "${randomBytes(12000).toString('base64')}";`;

  // Hostile: the exact bypass CodeQL flagged — an oversized script ended by </SCRIPT >.
  it('fails on an oversized script whose end tag is </SCRIPT >, naming the page', () => {
    const r = runOver(`<html><body><script>${oversized()}</SCRIPT ></body></html>`);
    expect(r.status, r.stdout + r.stderr).not.toBe(0);
    expect(r.stderr).toContain('index.html');
  });

  it('fails on an oversized script with an attribute in its end tag', () => {
    const r = runOver(`<html><body><script>${oversized()}</script data-x="1"></body></html>`);
    expect(r.status, r.stdout + r.stderr).not.toBe(0);
  });

  it('passes a small script, and reports that it scanned it', () => {
    const r = runOver('<html><body><script>document.title = "ok";</SCRIPT></body></html>');
    expect(r.status, r.stdout + r.stderr).toBe(0);
    expect(r.stdout).toMatch(/\b1 inline scripts? scanned/);
  });

  it('does not count an external or JSON-LD script against the budget', () => {
    const r = runOver(`<html><head><script type="application/ld+json">${oversized()}</script><script src="/a.js"></script></head></html>`);
    expect(r.status, r.stdout + r.stderr).toBe(0);
    expect(r.stdout).toMatch(/\b0 inline scripts? scanned/);
  });
});
