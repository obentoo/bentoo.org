#!/usr/bin/env node
// CI gate: every variant HTML has correct form attributes + no /hub/ or
// /coming-soon/ content leaked into dist. Enforces R3.1, R3.7, R6.5,
// R8.6, R8.7.
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const distDir = resolve(root, 'dist');

function walk(dir) {
  const out = [];
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const s = statSync(full);
    if (s.isDirectory()) out.push(...walk(full));
    else if (full.endsWith('.html')) out.push(full);
  }
  return out;
}

let failed = 0;
const variantFiles = walk(distDir).filter((f) =>
  /\/v\/[^/]+\/index\.html$/.test(f) || /\/pt\/v\/[^/]+\/index\.html$/.test(f)
);

if (variantFiles.length === 0) {
  console.error('fail: no variant HTML files in dist — run build first');
  process.exit(1);
}

for (const file of variantFiles) {
  const html = readFileSync(file, 'utf8');

  const formMatch = html.match(/<form[^>]*data-bentoo-subscribe[^>]*>/);
  if (!formMatch) {
    failed++;
    console.error(`fail: ${file} — missing <form data-bentoo-subscribe>`);
    continue;
  }
  const formTag = formMatch[0];

  const checks = {
    'data-success-msg': /data-success-msg="[^"]+"/,
    'data-error-msg': /data-error-msg="[^"]+"/,
    'action (non-empty)': /action="[^"]+"/,
    'method="post"': /method="post"/i,
  };
  for (const [label, pattern] of Object.entries(checks)) {
    if (!pattern.test(formTag)) {
      failed++;
      console.error(`fail: ${file} — form missing ${label}`);
    }
  }

  if (!/<input[^>]*type="hidden"[^>]*name="embed"[^>]*value="1"[^>]*>/.test(html) &&
      !/<input[^>]*name="embed"[^>]*value="1"[^>]*type="hidden"[^>]*>/.test(html) &&
      !/<input[^>]*value="1"[^>]*name="embed"[^>]*>/.test(html)) {
    failed++;
    console.error(`fail: ${file} — missing <input type="hidden" name="embed" value="1">`);
  }

  const isPt = file.includes('/pt/v/');
  const expectedPrivacy = isPt ? '/pt/privacy' : '/privacy';
  if (!html.includes(`href="${expectedPrivacy}"`)) {
    failed++;
    console.error(`fail: ${file} — missing privacy consent link to ${expectedPrivacy}`);
  }
}

const hubDir = resolve(distDir, 'hub');
if (existsSync(hubDir)) {
  failed++;
  console.error(`fail: dist/hub/ exists (R8.6 requires /hub/ dropped)`);
}

const comingSoonDir = resolve(distDir, 'coming-soon');
if (existsSync(comingSoonDir)) {
  failed++;
  console.error(`fail: dist/coming-soon/ exists (R8.7 requires mockups untouched)`);
}

if (failed) {
  console.error(`\n${failed} form/contract checks failed across ${variantFiles.length} variants`);
  process.exit(1);
}
console.log(`ok: ${variantFiles.length} variant HTMLs pass form contract + R8.6/R8.7 scope`);
