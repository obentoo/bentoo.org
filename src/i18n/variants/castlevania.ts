import type { Lang } from '~/utils/getLang';

export interface CastlevaniaContent {
  title: string;
  description: string;
  menu: string;
  taglineHtml: string;
  ornament: string;
  linkContact: string;
  linkNotify: string;
  summonsLabel: string;
  footerCopyHtml: string;
}

export const castlevania: Record<Lang, CastlevaniaContent> = {
  en: {
    title: 'bentoo — symphony of the source',
    description:
      'Bentoo — a user-friendly Stage5 of Gentoo Linux. Source-based darkness.',
    menu: 'Prologue · Source · Castle',
    taglineHtml: 'A user-friendly <em>Stage5</em> of Gentoo Linux',
    ornament: '✧ Symphony of the Source ✧',
    linkContact: 'CONTACT',
    linkNotify: 'NOTIFY ME',
    summonsLabel: '▸ Receive the summons when the castle opens ◂',
    footerCopyHtml:
      '© 2018 – 2026 · <b>BENTOO</b> · SOURCE-BASED DARKNESS',
  },
  pt: {
    title: 'bentoo — sinfonia do código-fonte',
    description:
      'Bentoo — um Stage5 amigável do Gentoo Linux. Escuridão baseada em código-fonte.',
    menu: 'Prólogo · Código · Castelo',
    taglineHtml: 'Um <em>Stage5</em> amigável do Gentoo Linux',
    ornament: '✧ Sinfonia do Código-Fonte ✧',
    linkContact: 'CONTATO',
    linkNotify: 'ME AVISE',
    summonsLabel: '▸ Receba a convocação quando o castelo abrir ◂',
    footerCopyHtml:
      '© 2018 – 2026 · <b>BENTOO</b> · ESCURIDÃO BASEADA EM CÓDIGO-FONTE',
  },
  es: {
    title: 'bentoo — sinfonía del código fuente',
    description:
      'Bentoo — un Stage5 fácil de usar de Gentoo Linux. Oscuridad basada en código fuente.',
    menu: 'Prólogo · Código · Castillo',
    taglineHtml: 'Un <em>Stage5</em> fácil de usar de Gentoo Linux',
    ornament: '✧ Sinfonía del Código Fuente ✧',
    linkContact: 'CONTACTO',
    linkNotify: 'AVÍSAME',
    summonsLabel: '▸ Recibe la convocatoria cuando el castillo abra ◂',
    footerCopyHtml:
      '© 2018 – 2026 · <b>BENTOO</b> · OSCURIDAD BASADA EN CÓDIGO FUENTE',
  },
  ru: {
    title: 'bentoo — симфония исходников',
    description: 'Bentoo — удобный Stage5 Gentoo Linux. Тьма из исходников.',
    menu: 'Пролог · Исходники · Замок',
    taglineHtml: 'Удобный <em>Stage5</em> Gentoo Linux',
    ornament: '✧ Симфония исходников ✧',
    linkContact: 'КОНТАКТЫ',
    linkNotify: 'УВЕДОМИТЬ МЕНЯ',
    summonsLabel: '▸ Получите зов, когда замок откроет врата ◂',
    footerCopyHtml: '© 2018 – 2026 · <b>BENTOO</b> · ТЬМА ИЗ ИСХОДНИКОВ',
  },
  zh: {
    title: 'bentoo — 源码交响曲',
    description: 'Bentoo —— 易于上手的 Gentoo Linux Stage5。源自源码的黑暗。',
    menu: '序章 · 源码 · 城堡',
    taglineHtml: '易于上手的 Gentoo Linux <em>Stage5</em>',
    ornament: '✧ 源码交响曲 ✧',
    linkContact: '联系',
    linkNotify: '通知我',
    summonsLabel: '▸ 城堡开启之时，接受召唤 ◂',
    footerCopyHtml: '© 2018 – 2026 · <b>BENTOO</b> · 源自源码的黑暗',
  },
};
