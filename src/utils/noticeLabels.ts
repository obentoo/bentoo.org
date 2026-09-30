// Localized chrome for notice metadata, shared by NoticeArticle and NoticeList.
import type { Notice } from '~/content/noticeSchema';
import type { Strings } from '~/i18n/types';
import { htmlLangFor, type Lang } from '~/utils/getLang';

export const typeLabel = (s: Strings, type: Notice['type']): string => s[`noticeType_${type}`];

export const severityLabel = (s: Strings, severity: Notice['severity']): string => s[`noticeSeverity_${severity}`];

/** A calendar date in the page's locale, read in UTC so it matches the feed. */
export function formatNoticeDate(date: Date, lang: Lang): string {
  return new Intl.DateTimeFormat(htmlLangFor(lang), { dateStyle: 'long', timeZone: 'UTC' }).format(date);
}

/** Body text split into paragraphs on blank lines. */
export function bodyParagraphs(body: string): string[] {
  return body
    .split(/\n[ \t]*\n/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);
}
