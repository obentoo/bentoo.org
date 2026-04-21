#!/usr/bin/env node
// Asserts that the slug array inlined in src/scripts/rotator.inline.ts
// matches src/data/variants.ts. CI gate for manual-duplication decision.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

const variantsSrc = readFileSync(resolve(root, 'src/data/variants.ts'), 'utf8');
const rotatorSrc = readFileSync(resolve(root, 'src/scripts/rotator.inline.ts'), 'utf8');

const variantsMatch = variantsSrc.match(
  /export const VARIANTS\s*=\s*\[([^\]]+)\]/
);
if (!variantsMatch) {
  console.error('fail: could not extract VARIANTS array from src/data/variants.ts');
  process.exit(1);
}
const variantsList = [...variantsMatch[1].matchAll(/'([^']+)'/g)].map((m) => m[1]);

const inlineMatch = rotatorSrc.match(/V=\[([^\]]+)\]/);
if (!inlineMatch) {
  console.error('fail: could not extract inline V array from rotator.inline.ts');
  process.exit(1);
}
const inlineList = [...inlineMatch[1].matchAll(/"([^"]+)"/g)].map((m) => m[1]);

const a = JSON.stringify(variantsList);
const b = JSON.stringify(inlineList);

if (a !== b) {
  console.error('fail: rotator.inline.ts slug array drifted from src/data/variants.ts');
  console.error(`  variants.ts: ${a}`);
  console.error(`  rotator.inline.ts: ${b}`);
  process.exit(1);
}

console.log(`ok: ${variantsList.length} variants synced`);
process.exit(0);
