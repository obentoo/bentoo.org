import type { Lang } from '~/utils/getLang';
import type { Strings } from './types';
import { strings as enStrings } from './en';
import { strings as ptStrings } from './pt';
import { strings as esStrings } from './es';

export const I18N: Record<Lang, Strings> = {
  en: enStrings,
  pt: ptStrings,
  es: esStrings,
};

export function stringsFor(lang: Lang): Strings {
  return I18N[lang];
}
