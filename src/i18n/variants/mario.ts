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
  ru: {
    title: 'bentoo — мир 1-1 · stage5',
    description: 'Bentoo — удобный Stage5 Gentoo Linux. Мир 1-1.',
    brandAriaLabel: 'bentoo — главная',
    hud: { world: 'МИР', time: 'ВРЕМЯ', coins: 'МОНЕТЫ', lives: 'ЖИЗНИ', build: 'BUILD' },
    taglineUpper: 'УДОБНЫЙ STAGE5 GENTOO LINUX',
    menu: {
      github: { label: 'GITHUB', sub: '[ИСХОДНИКИ]' },
      contact: { label: 'КОНТАКТЫ', sub: '[СООБЩЕСТВО]' },
      notify: { label: 'УВЕДОМИТЬ МЕНЯ', sub: '[НОВОСТИ]' },
    },
    notifyPromptLabel: '> НАЖМИТЕ START, ЧТОБЫ ПОЛУЧАТЬ НОВОСТИ',
  },
  zh: {
    title: 'bentoo — 世界 1-1 · stage5',
    description: 'Bentoo —— 易于上手的 Gentoo Linux Stage5。世界 1-1。',
    brandAriaLabel: 'bentoo 首页',
    hud: { world: '世界', time: '时间', coins: '金币', lives: '生命', build: 'BUILD' },
    taglineUpper: '易于上手的 GENTOO LINUX STAGE5',
    menu: {
      github: { label: 'GITHUB', sub: '[源码]' },
      contact: { label: '联系', sub: '[社区]' },
      notify: { label: '通知我', sub: '[动态]' },
    },
    notifyPromptLabel: '> 按 START 接收最新动态',
  },
};
