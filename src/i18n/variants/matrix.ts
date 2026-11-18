import type { Lang } from '~/utils/getLang';

export interface MatrixContent {
  title: string;
  description: string;
  tabSource: string;
  searchLabel: string;
  addrPath: string;
  subWake: string;
  pillStay: string;
  pillChoose: string;
  linkContact: string;
  linkNotify: string;
  descriptionHtml: string;
  footerCopyHtml: string;
}

export const matrix: Record<Lang, MatrixContent> = {
  en: {
    title: 'bentoo — wake up, gentoo',
    description:
      'Bentoo — a user-friendly Stage5 of Gentoo Linux. Source is power.',
    tabSource: 'Source',
    searchLabel: '⌕ search',
    addrPath: '/wake-up/gentoo',
    subWake: 'WAKE UP, GENTOO',
    pillStay: 'Stay Gentoo',
    pillChoose: 'Choose Bentoo',
    linkContact: 'CONTACT',
    linkNotify: 'NOTIFY ME',
    descriptionHtml:
      'A <b>minimalist</b>, <em>source-based</em> distribution derived from <em>Gentoo</em>.<br />Built for speed and ultimate optimization. Explore the <b>Matrix</b>.',
    footerCopyHtml: '© 2024 <b>BENTOO</b> project · Source is power.',
  },
  pt: {
    title: 'bentoo — acorde, gentoo',
    description:
      'Bentoo — um Stage5 amigável do Gentoo Linux. O código é poder.',
    tabSource: 'Código',
    searchLabel: '⌕ buscar',
    addrPath: '/acorde/gentoo',
    subWake: 'ACORDE, GENTOO',
    pillStay: 'Continue Gentoo',
    pillChoose: 'Escolha Bentoo',
    linkContact: 'CONTATO',
    linkNotify: 'ME AVISE',
    descriptionHtml:
      'Uma distribuição <b>minimalista</b>, <em>baseada em código-fonte</em> derivada do <em>Gentoo</em>.<br />Feita para velocidade e otimização extrema. Explore a <b>Matrix</b>.',
    footerCopyHtml: '© 2024 projeto <b>BENTOO</b> · O código é poder.',
  },
  es: {
    title: 'bentoo — despierta, gentoo',
    description:
      'Bentoo — un Stage5 fácil de usar de Gentoo Linux. El código es poder.',
    tabSource: 'Código',
    searchLabel: '⌕ buscar',
    addrPath: '/despierta/gentoo',
    subWake: 'DESPIERTA, GENTOO',
    pillStay: 'Sigue con Gentoo',
    pillChoose: 'Elige Bentoo',
    linkContact: 'CONTACTO',
    linkNotify: 'AVÍSAME',
    descriptionHtml:
      'Una distribución <b>minimalista</b>, <em>basada en código fuente</em> derivada de <em>Gentoo</em>.<br />Hecha para velocidad y optimización extrema. Explora la <b>Matrix</b>.',
    footerCopyHtml: '© 2024 proyecto <b>BENTOO</b> · El código es poder.',
  },
  ru: {
    title: 'bentoo — проснись, gentoo',
    description: 'Bentoo — удобный Stage5 Gentoo Linux. Исходный код — это сила.',
    tabSource: 'Исходники',
    searchLabel: '⌕ поиск',
    addrPath: '/проснись/gentoo',
    subWake: 'ПРОСНИСЬ, GENTOO',
    pillStay: 'Остаться на Gentoo',
    pillChoose: 'Выбрать Bentoo',
    linkContact: 'КОНТАКТЫ',
    linkNotify: 'УВЕДОМИТЬ МЕНЯ',
    descriptionHtml: '<b>Минималистичный</b> дистрибутив <em>на основе исходного кода</em>, производный от <em>Gentoo</em>.<br />Создан ради скорости и предельной оптимизации. Исследуйте <b>Матрицу</b>.',
    footerCopyHtml: '© 2024 проект <b>BENTOO</b> · Исходный код — это сила.',
  },
  zh: {
    title: 'bentoo — 醒醒，gentoo',
    description: 'Bentoo —— 易于上手的 Gentoo Linux Stage5。源码就是力量。',
    tabSource: '源码',
    searchLabel: '⌕ 搜索',
    addrPath: '/醒醒/gentoo',
    subWake: '醒醒，GENTOO',
    pillStay: '留在 Gentoo',
    pillChoose: '选择 Bentoo',
    linkContact: '联系',
    linkNotify: '通知我',
    descriptionHtml: '一款源自 <em>Gentoo</em>、<b>极简</b>且<em>基于源码</em>的发行版。<br />为速度与极致优化而生。探索<b>矩阵</b>。',
    footerCopyHtml: '© 2024 <b>BENTOO</b> 项目 · 源码就是力量。',
  },
};
