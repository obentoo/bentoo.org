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
};
