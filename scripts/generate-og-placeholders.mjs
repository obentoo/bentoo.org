#!/usr/bin/env node
// Generates placeholder og:images for all 21 variants + default.
// Output: public/og/<slug>.png at 1200x630, <= 300KB each.
// Real variant-aesthetic og:images are a follow-up optimization; for launch
// readiness each URL needs a valid 1200x630 PNG for social-share previews.
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const outDir = resolve(root, 'public/og');
if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

const variantsSrc = readFileSync(resolve(root, 'src/data/variants.ts'), 'utf8');
const match = variantsSrc.match(/export const VARIANTS\s*=\s*\[([^\]]+)\]/);
const VARIANTS = [...match[1].matchAll(/'([^']+)'/g)].map((m) => m[1]);

function make(slug, outPath) {
  const sub = slug ? slug : 'a user-friendly Stage5 of Gentoo Linux';
  const args = [
    '-size', '1200x630',
    'gradient:#fafafa-#f0ecde',
    '-gravity', 'center',
    '-fill', '#1a1a2e',
    '-font', 'DejaVu-Sans-Bold',
    '-pointsize', '150',
    '-annotate', '+0-60', 'bentoo',
    '-fill', '#5f5fd3',
    '-font', 'DejaVu-Sans',
    '-pointsize', '48',
    '-annotate', '+0+80', sub,
    '-strip',
    '-quality', '85',
    outPath,
  ];
  execFileSync('magick', args, { stdio: 'pipe' });
}

console.log('generating og:images...');
make('', resolve(outDir, 'default.png'));
for (const slug of VARIANTS) {
  const outPath = resolve(outDir, `${slug}.png`);
  make(slug, outPath);
  process.stdout.write('.');
}
console.log(`\nok: ${VARIANTS.length + 1} og:images generated at ${outDir}`);
