export const VARIANTS = [
  '2001',
  'beos',
  'breaking-bad',
  'castlevania',
  'death-stranding-v3',
  'mario',
  'matrix',
  'minecraft',
  'severance-v2',
  'synthwave',
  'v3',
  'v3a',
  'v3b',
  'v3c',
  'v3e',
  'v3f',
  'v3h',
  'v3i',
  'v3j',
  'v3-vaporwave',
  'v4',
] as const;

export type VariantSlug = (typeof VARIANTS)[number];

export const DEFAULT_VARIANT: VariantSlug = 'v4';

export function isVariant(slug: string): slug is VariantSlug {
  return (VARIANTS as readonly string[]).includes(slug);
}
