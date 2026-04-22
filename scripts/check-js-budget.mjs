#!/usr/bin/env node
// CI gate for R5.2 (JS budget).
//
// Budget tiers (per inline <script> block, gzip size):
//   CORE    (rotator on /, /pt/; form-handler on every variant)  <= 1536 B
//   VARIANT (retro interactive scripts inside a variant page,    <= 4096 B
//            e.g. v3i install.exe shell, v3j IRIX xterm, mario
//            ground-tile, matrix rain, clocks)
//
// Rationale: R5.2 is spirit-of "zero framework JS + small rotator +
// small form handler". Variant-local interactive vanilla-DOM scripts
// are the variant experience (locked by R8.1 bit-for-bit fidelity) and
// are budget-capped to keep page weight under the R5.1 CWV budget.
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import { fileURLToPath } from 'node:url';
import { dirname, resolve, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const distDir = resolve(root, 'dist');
const CORE_MAX = 1536;
const VARIANT_MAX = 4096;

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const s = statSync(full);
    if (s.isDirectory()) out.push(...walk(full));
    else if (full.endsWith('.html')) out.push(full);
  }
  return out;
}

function extractInlineScripts(html) {
  const out = [];
  const re = /<script(\s[^>]*)?>([\s\S]*?)<\/script>/g;
  let m;
  while ((m = re.exec(html)) !== null) {
    const attrs = (m[1] || '').toLowerCase();
    if (attrs.includes('src=')) continue;
    if (attrs.includes('application/ld+json')) continue;
    out.push(m[2]);
  }
  return out;
}

function classify(body) {
  // Rotator: contains 'bentoo-variant' localStorage key
  if (body.includes('bentoo-variant')) return 'core-rotator';
  // Form handler: contains 'bd-sink' iframe name or 'data-bentoo-subscribe'
  if (body.includes('bd-sink') || body.includes('data-bentoo-subscribe')) return 'core-form';
  // Language toggle (emitted by BaseLayout footer script)
  if (body.includes('bentoo-lang-toggle')) return 'core-lang';
  // Anything else is a variant-local interactive script
  return 'variant';
}

const files = walk(distDir);
if (files.length === 0) {
  console.error('fail: no HTML files in dist — run build first');
  process.exit(1);
}

let failed = 0;
let worstCore = { size: 0, file: '' };
let worstVariant = { size: 0, file: '' };
let scriptsSeen = 0;

for (const file of files) {
  const html = readFileSync(file, 'utf8');
  const scripts = extractInlineScripts(html);
  for (const [i, body] of scripts.entries()) {
    const size = gzipSync(body).length;
    const kind = classify(body);
    const budget = kind === 'variant' ? VARIANT_MAX : CORE_MAX;
    scriptsSeen++;
    if (kind === 'variant' && size > worstVariant.size) worstVariant = { size, file: `${file}#${i}` };
    else if (kind !== 'variant' && size > worstCore.size) worstCore = { size, file: `${file}#${i}` };
    if (size > budget) {
      failed++;
      console.error(`fail: ${file} script[${i}] (${kind}) gzip=${size}B > ${budget}B`);
    }
  }
}

if (failed) {
  console.error(`\n${failed} inline scripts exceed their budget`);
  process.exit(1);
}
const relCore = worstCore.file.replace(root + '/', '');
const relVariant = worstVariant.file.replace(root + '/', '');
console.log(
  `ok: ${scriptsSeen} inline scripts scanned`
);
console.log(`  core    (max ${CORE_MAX}B):    worst ${worstCore.size}B at ${relCore || '(none)'}`);
console.log(`  variant (max ${VARIANT_MAX}B): worst ${worstVariant.size}B at ${relVariant || '(none)'}`);
