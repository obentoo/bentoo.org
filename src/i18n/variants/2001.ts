import type { Lang } from '~/utils/getLang';

export interface V2001Content {
  title: string;
  description: string;
  navLanding: string;
  navSource: string;
  navContact: string;
  subTaglineHtml: string;
  linkContact: string;
  linkNotify: string;
  monitorLabelHtml: string;
  footerLeftHtml: string;
  footerRight: string;
}

export const v2001: Record<Lang, V2001Content> = {
  en: {
    title: 'bentoo — 2001 · source odyssey',
    description:
      'Bentoo — a user-friendly Stage5 of Gentoo Linux. Dave, my mind is going.',
    navLanding: 'landing',
    navSource: 'source',
    navContact: 'contact',
    subTaglineHtml: 'A USER-FRIENDLY <b>STAGE5</b> OF GENTOO LINUX',
    linkContact: 'CONTACT',
    linkNotify: 'NOTIFY ME',
    monitorLabelHtml: '▸ MONITOR · <b>HAL-9000</b> · SINGLE-PING PROTOCOL ◂',
    footerLeftHtml:
      '© 2018 – 2026 <b>BENTOO PROJECT</b>. ALL RIGHTS RESERVED.',
    footerRight: 'DISCOVERY ONE · JUPITER MISSION · STAGE5',
  },
  pt: {
    title: 'bentoo — 2001 · odisseia no código',
    description:
      'Bentoo — um Stage5 amigável do Gentoo Linux. Dave, minha mente está indo.',
    navLanding: 'início',
    navSource: 'código',
    navContact: 'contato',
    subTaglineHtml: 'UM <b>STAGE5</b> AMIGÁVEL DO GENTOO LINUX',
    linkContact: 'CONTATO',
    linkNotify: 'ME AVISE',
    monitorLabelHtml:
      '▸ MONITORAR · <b>HAL-9000</b> · PROTOCOLO PING-ÚNICO ◂',
    footerLeftHtml:
      '© 2018 – 2026 <b>PROJETO BENTOO</b>. TODOS OS DIREITOS RESERVADOS.',
    footerRight: 'DISCOVERY ONE · MISSÃO JÚPITER · STAGE5',
  },
  es: {
    title: 'bentoo — 2001 · odisea en el código',
    description:
      'Bentoo — un Stage5 fácil de usar de Gentoo Linux. Dave, mi mente se está yendo.',
    navLanding: 'inicio',
    navSource: 'código',
    navContact: 'contacto',
    subTaglineHtml: 'UN <b>STAGE5</b> FÁCIL DE USAR DE GENTOO LINUX',
    linkContact: 'CONTACTO',
    linkNotify: 'AVÍSAME',
    monitorLabelHtml:
      '▸ MONITORIZAR · <b>HAL-9000</b> · PROTOCOLO DE PING ÚNICO ◂',
    footerLeftHtml:
      '© 2018 – 2026 <b>PROYECTO BENTOO</b>. TODOS LOS DERECHOS RESERVADOS.',
    footerRight: 'DISCOVERY ONE · MISIÓN JÚPITER · STAGE5',
  },
  ru: {
    title: 'bentoo — 2001 · одиссея исходников',
    description: 'Bentoo — удобный Stage5 Gentoo Linux. Дейв, я теряю разум.',
    navLanding: 'главная',
    navSource: 'исходники',
    navContact: 'контакты',
    subTaglineHtml: 'УДОБНЫЙ <b>STAGE5</b> GENTOO LINUX',
    linkContact: 'КОНТАКТЫ',
    linkNotify: 'УВЕДОМИТЬ МЕНЯ',
    monitorLabelHtml: '▸ МОНИТОР · <b>HAL-9000</b> · ПРОТОКОЛ ОДНОГО ПИНГА ◂',
    footerLeftHtml: '© 2018 – 2026 <b>ПРОЕКТ BENTOO</b>. ВСЕ ПРАВА ЗАЩИЩЕНЫ.',
    footerRight: 'DISCOVERY ONE · МИССИЯ К ЮПИТЕРУ · STAGE5',
  },
  zh: {
    title: 'bentoo — 2001 · 源码漫游',
    description: 'Bentoo —— 易于上手的 Gentoo Linux Stage5。戴夫，我的意识正在消失。',
    navLanding: '首页',
    navSource: '源码',
    navContact: '联系',
    subTaglineHtml: '易于上手的 GENTOO LINUX <b>STAGE5</b>',
    linkContact: '联系',
    linkNotify: '通知我',
    monitorLabelHtml: '▸ 监视器 · <b>HAL-9000</b> · 单次 PING 协议 ◂',
    footerLeftHtml: '© 2018 – 2026 <b>BENTOO 项目</b>。保留所有权利。',
    footerRight: '发现一号 · 木星任务 · STAGE5',
  },
};
