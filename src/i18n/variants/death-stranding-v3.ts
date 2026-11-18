import type { Lang } from '~/utils/getLang';

export interface DeathStrandingContent {
  title: string;
  description: string;
  navLanding: string;
  navSource: string;
  navContact: string;
  signalLine: string;
  taglineHtml: string;
  cubeLabelSource: string;
  cubeBoxContact: string;
  cubeBoxNotify: string;
  chiralLabelHtml: string;
  footerCopyHtml: string;
}

export const deathStrandingV3: Record<Lang, DeathStrandingContent> = {
  en: {
    title: 'bentoo — a user-friendly Stage5 of Gentoo Linux',
    description: 'Bentoo — source-based. Connecting Stage5 to the beach.',
    navLanding: 'LANDING',
    navSource: 'SOURCE',
    navContact: 'CONTACT',
    signalLine: '◉ SIGNAL · 0.62',
    taglineHtml: 'A USER-FRIENDLY <em>STAGE5</em> OF GENTOO LINUX',
    cubeLabelSource: 'SOURCE',
    cubeBoxContact: 'CONTACT',
    cubeBoxNotify: 'NOTIFY',
    chiralLabelHtml: '<b>◉</b> OPEN CHIRAL CHANNEL · SINGLE-PING',
    footerCopyHtml:
      '© 2018 – 2026 · <b>BENTOO</b> · HANDCRAFTED · SOURCE-FIRST',
  },
  pt: {
    title: 'bentoo — um Stage5 amigável do Gentoo Linux',
    description: 'Bentoo — baseado em fontes. Conectando Stage5 à praia.',
    navLanding: 'INÍCIO',
    navSource: 'CÓDIGO',
    navContact: 'CONTATO',
    signalLine: '◉ SINAL · 0.62',
    taglineHtml: 'UM <em>STAGE5</em> AMIGÁVEL DO GENTOO LINUX',
    cubeLabelSource: 'CÓDIGO',
    cubeBoxContact: 'CONTATO',
    cubeBoxNotify: 'AVISO',
    chiralLabelHtml: '<b>◉</b> ABRIR CANAL CHIRAL · SINGLE-PING',
    footerCopyHtml:
      '© 2018 – 2026 · <b>BENTOO</b> · FEITO À MÃO · CÓDIGO ABERTO',
  },
  es: {
    title: 'bentoo — un Stage5 fácil de usar de Gentoo Linux',
    description: 'Bentoo — basado en fuentes. Conectando Stage5 a la playa.',
    navLanding: 'INICIO',
    navSource: 'CÓDIGO',
    navContact: 'CONTACTO',
    signalLine: '◉ SEÑAL · 0.62',
    taglineHtml: 'UN <em>STAGE5</em> FÁCIL DE USAR DE GENTOO LINUX',
    cubeLabelSource: 'CÓDIGO',
    cubeBoxContact: 'CONTACTO',
    cubeBoxNotify: 'AVISO',
    chiralLabelHtml: '<b>◉</b> ABRIR CANAL CHIRAL · SINGLE-PING',
    footerCopyHtml:
      '© 2018 – 2026 · <b>BENTOO</b> · HECHO A MANO · CÓDIGO ABIERTO',
  },
  ru: {
    title: 'bentoo — удобный Stage5 Gentoo Linux',
    description: 'Bentoo — из исходников. Соединяем Stage5 с Берегом.',
    navLanding: 'ГЛАВНАЯ',
    navSource: 'ИСХОДНИКИ',
    navContact: 'КОНТАКТЫ',
    signalLine: '◉ СИГНАЛ · 0,62',
    taglineHtml: 'УДОБНЫЙ <em>STAGE5</em> GENTOO LINUX',
    cubeLabelSource: 'ИСХОДНИКИ',
    cubeBoxContact: 'КОНТАКТЫ',
    cubeBoxNotify: 'УВЕДОМИТЬ',
    chiralLabelHtml: '<b>◉</b> ОТКРЫТЬ ХИРАЛЬНЫЙ КАНАЛ · ОДИН ПИНГ',
    footerCopyHtml: '© 2018 – 2026 · <b>BENTOO</b> · РУЧНАЯ РАБОТА · ИСХОДНИКИ ПРЕЖДЕ ВСЕГО',
  },
  zh: {
    title: 'bentoo — 易于上手的 Gentoo Linux Stage5',
    description: 'Bentoo —— 基于源码。将 Stage5 连接到冥滩。',
    navLanding: '首页',
    navSource: '源码',
    navContact: '联系',
    signalLine: '◉ 信号 · 0.62',
    taglineHtml: '易于上手的 GENTOO LINUX <em>STAGE5</em>',
    cubeLabelSource: '源码',
    cubeBoxContact: '联系',
    cubeBoxNotify: '通知',
    chiralLabelHtml: '<b>◉</b> 开启开罗尔频道 · 单次 PING',
    footerCopyHtml: '© 2018 – 2026 · <b>BENTOO</b> · 手工打造 · 源码优先',
  },
};
