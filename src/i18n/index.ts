import type { Lang } from '~/utils/getLang';
import type { Strings } from './types';
import { strings as enStrings } from './en';
import { strings as ptStrings } from './pt';
import { strings as esStrings } from './es';
import { strings as ruStrings } from './ru';
import { strings as zhStrings } from './zh';

export const I18N: Record<Lang, Strings> = {
  en: enStrings,
  pt: ptStrings,
  es: esStrings,
  ru: ruStrings,
  zh: zhStrings,
};

export function stringsFor(lang: Lang): Strings {
  return I18N[lang];
}
