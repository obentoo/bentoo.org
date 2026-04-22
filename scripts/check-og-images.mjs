#!/usr/bin/env node
// CI gate: asserts every public/og/*.png is 1200x630 and <= 300KB.
import { execFileSync } from 'node:child_process';
import { readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const ogDir = resolve(root, 'public/og');
const MAX_BYTES = 300 * 1024;
const EXPECTED_W = 1200;
const EXPECTED_H = 630;

function dims(path) {
  const out = execFileSync('identify', ['-format', '%w %h', path], {
    encoding: 'utf8',
  }).trim();
  const [w, h] = out.split(/\s+/).map(Number);
  return { w, h };
}

const files = readdirSync(ogDir).filter((f) => f.endsWith('.png'));
if (files.length === 0) {
  console.error('fail: no PNGs in public/og/');
  process.exit(1);
}

let failed = 0;
for (const f of files) {
  const p = resolve(ogDir, f);
  const size = statSync(p).size;
  const { w, h } = dims(p);
  const oversized = size > MAX_BYTES;
  const wrongDims = w !== EXPECTED_W || h !== EXPECTED_H;
  if (oversized || wrongDims) {
    failed++;
    const reasons = [];
    if (oversized) reasons.push(`${size}B > ${MAX_BYTES}B`);
    if (wrongDims) reasons.push(`${w}x${h} != ${EXPECTED_W}x${EXPECTED_H}`);
    console.error(`fail: ${f} — ${reasons.join(', ')}`);
  }
}

if (failed) {
  console.error(`\n${failed}/${files.length} og:images failed`);
  process.exit(1);
}
console.log(`ok: ${files.length} og:images pass (all <= ${MAX_BYTES}B, ${EXPECTED_W}x${EXPECTED_H})`);
