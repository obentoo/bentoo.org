import type { VariantSlug } from '~/data/variants';

export type { VariantContent, VariantI18N, TickerSpan } from './types';

const I18N_SLUGS = [
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
type I18NSlug = (typeof I18N_SLUGS)[number];

export function hasVariantI18N(slug: VariantSlug): slug is I18NSlug {
  return (I18N_SLUGS as readonly string[]).includes(slug);
}

export function localizedSlugs(): I18NSlug[] {
  return [...I18N_SLUGS];
}
