import type { Lang } from '~/utils/getLang';

export interface MarioMenuItem {
  label: string;
  sub: string;
}

export interface MarioContent {
  title: string;
  description: string;
  brandAriaLabel: string;
  hud: {
    world: string;
    time: string;
    coins: string;
    lives: string;
    build: string;
  };
  taglineUpper: string;
  menu: {
    github: MarioMenuItem;
    contact: MarioMenuItem;
    notify: MarioMenuItem;
  };
  notifyPromptLabel: string;
}

export const mario: Record<Lang, MarioContent> = {
  en: {
    title: 'bentoo — world 1-1 · stage5',
    description: 'Bentoo — a user-friendly Stage5 of Gentoo Linux. World 1-1.',
    brandAriaLabel: 'bentoo home',
    hud: {
      world: 'WORLD',
      time: 'TIME',
      coins: 'COINS',
      lives: 'LIVES',
      build: 'BUILD',
    },
    taglineUpper: 'A USER-FRIENDLY STAGE5 OF GENTOO LINUX',
    menu: {
      github: { label: 'GITHUB', sub: '[SOURCE]' },
      contact: { label: 'CONTACT', sub: '[COMMUNITY]' },
      notify: { label: 'NOTIFY ME', sub: '[UPDATES]' },
    },
    notifyPromptLabel: '> PRESS START TO RECEIVE UPDATES',
  },
  pt: {
    title: 'bentoo — mundo 1-1 · stage5',
    description: 'Bentoo — um Stage5 amigável do Gentoo Linux. Mundo 1-1.',
    brandAriaLabel: 'bentoo início',
    hud: {
      world: 'MUNDO',
      time: 'TEMPO',
      coins: 'MOEDAS',
      lives: 'VIDAS',
      build: 'BUILD',
    },
    taglineUpper: 'UM STAGE5 AMIGÁVEL DO GENTOO LINUX',
    menu: {
      github: { label: 'GITHUB', sub: '[CÓDIGO]' },
      contact: { label: 'CONTATO', sub: '[COMUNIDADE]' },
      notify: { label: 'ME AVISE', sub: '[NOVIDADES]' },
    },
    notifyPromptLabel: '> APERTE START PARA RECEBER NOVIDADES',
  },
  es: {
    title: 'bentoo — mundo 1-1 · stage5',
    description: 'Bentoo — un Stage5 fácil de usar de Gentoo Linux. Mundo 1-1.',
    brandAriaLabel: 'bentoo inicio',
    hud: {
      world: 'MUNDO',
      time: 'TIEMPO',
      coins: 'MONEDAS',
      lives: 'VIDAS',
      build: 'BUILD',
    },
    taglineUpper: 'UN STAGE5 FÁCIL DE USAR DE GENTOO LINUX',
    menu: {
      github: { label: 'GITHUB', sub: '[CÓDIGO]' },
      contact: { label: 'CONTACTO', sub: '[COMUNIDAD]' },
      notify: { label: 'AVÍSAME', sub: '[NOVEDADES]' },
    },
    notifyPromptLabel: '> PULSA START PARA RECIBIR NOVEDADES',
  },
};
