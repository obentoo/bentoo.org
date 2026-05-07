import type { Lang } from '~/utils/getLang';

export interface TickerSpan {
  kanji: string;
  text: string;
}

export interface VariantContent {
  title: string;
  description: string;
  brandAriaLabel: string;
  taglineHtml: string;
  ledeHtml: string;
  jpAccent: string;
  notifyNoteHtml: string;
  tickerSpans: TickerSpan[];
}

export type VariantI18N = Record<Lang, VariantContent>;
