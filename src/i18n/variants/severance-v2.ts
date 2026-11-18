import type { Lang } from '~/utils/getLang';

export interface SeveranceV2Content {
  title: string;
  description: string;
  breadcrumbHtml: string;
  refiningLabel: string;
  role: string;
  memoHtml: string;
  navGithubContact: string;
  navNotify: string;
  ledeHtml: string;
  notifyLabel: string;
  footerLeftHtml: string;
  footerRightHtml: string;
}

export const severanceV2: Record<Lang, SeveranceV2Content> = {
  en: {
    title: 'bentoo — macrodata refinement',
    description:
      'Bentoo is a user-friendly Stage5 of Gentoo Linux — mysterious and important.',
    breadcrumbHtml: 'MDR · FLOOR <b>5</b> · DEPT. <b>07-G</b>',
    refiningLabel: 'REFINING · STAGE5',
    role: 'DATA REFINER / MOR',
    memoHtml: 'YOUR WORK IS<br />MYSTERIOUS AND IMPORTANT',
    navGithubContact: 'GITHUB · CONTACT',
    navNotify: 'NOTIFY ME',
    ledeHtml:
      'A user-friendly <b>Stage5</b> of Gentoo Linux.<br />Source-based · rolling · desktop-ready.',
    notifyLabel: 'File · onboard · single-ping',
    footerLeftHtml: '© 2018 – 2026 <b>bentoo</b> · handcrafted, source-first',
    footerRightHtml: 'kier eagan · praise · <b>gentoo inside</b>',
  },
  pt: {
    title: 'bentoo — refinamento de macrodados',
    description:
      'Bentoo é um Stage5 amigável do Gentoo Linux — misterioso e importante.',
    breadcrumbHtml: 'MDR · ANDAR <b>5</b> · DEPTO. <b>07-G</b>',
    refiningLabel: 'REFINANDO · STAGE5',
    role: 'REFINADOR DE DADOS / MOR',
    memoHtml: 'SEU TRABALHO É<br />MISTERIOSO E IMPORTANTE',
    navGithubContact: 'GITHUB · CONTATO',
    navNotify: 'ME AVISE',
    ledeHtml:
      'Um <b>Stage5</b> amigável do Gentoo Linux.<br />Baseado em código-fonte · rolling · pronto para desktop.',
    notifyLabel: 'Protocolar · integrar · ping único',
    footerLeftHtml: '© 2018 – 2026 <b>bentoo</b> · feito à mão, código aberto',
    footerRightHtml: 'kier eagan · louvado · <b>gentoo por dentro</b>',
  },
  es: {
    title: 'bentoo — refinamiento de macrodatos',
    description:
      'Bentoo es un Stage5 fácil de usar de Gentoo Linux — misterioso e importante.',
    breadcrumbHtml: 'MDR · PISO <b>5</b> · DEPTO. <b>07-G</b>',
    refiningLabel: 'REFINANDO · STAGE5',
    role: 'REFINADOR DE DATOS / MOR',
    memoHtml: 'TU TRABAJO ES<br />MISTERIOSO E IMPORTANTE',
    navGithubContact: 'GITHUB · CONTACTO',
    navNotify: 'AVÍSAME',
    ledeHtml:
      'Un <b>Stage5</b> fácil de usar de Gentoo Linux.<br />Basado en código fuente · rolling · listo para escritorio.',
    notifyLabel: 'Registrar · incorporar · ping único',
    footerLeftHtml: '© 2018 – 2026 <b>bentoo</b> · hecho a mano, código abierto',
    footerRightHtml: 'kier eagan · alabado · <b>gentoo por dentro</b>',
  },
  ru: {
    title: 'bentoo — обработка макроданных',
    description: 'Bentoo — удобный Stage5 Gentoo Linux. Таинственный и важный.',
    breadcrumbHtml: 'ОМД · ЭТАЖ <b>5</b> · ОТД. <b>07-G</b>',
    refiningLabel: 'ОБРАБОТКА · STAGE5',
    role: 'ОБРАБОТЧИК ДАННЫХ / ОМД',
    memoHtml: 'ВАША РАБОТА<br />ТАИНСТВЕННА И ВАЖНА',
    navGithubContact: 'GITHUB · КОНТАКТЫ',
    navNotify: 'УВЕДОМИТЬ МЕНЯ',
    ledeHtml: 'Удобный <b>Stage5</b> Gentoo Linux.<br />Из исходников · rolling · готов к десктопу.',
    notifyLabel: 'Подать заявку · оформление · один пинг',
    footerLeftHtml: '© 2018 – 2026 <b>bentoo</b> · ручная работа, исходники прежде всего',
    footerRightHtml: 'кир иган · хвала · <b>внутри — gentoo</b>',
  },
  zh: {
    title: 'bentoo — 宏观数据精炼',
    description: 'Bentoo 是易于上手的 Gentoo Linux Stage5 —— 神秘而重要。',
    breadcrumbHtml: 'MDR · <b>5</b> 楼 · 部门 <b>07-G</b>',
    refiningLabel: '精炼中 · STAGE5',
    role: '数据精炼员 / MDR',
    memoHtml: '你的工作<br />神秘而重要',
    navGithubContact: 'GITHUB · 联系',
    navNotify: '通知我',
    ledeHtml: '易于上手的 Gentoo Linux <b>Stage5</b>。<br />基于源码 · rolling · 桌面就绪。',
    notifyLabel: '归档 · 入职 · 单次 ping',
    footerLeftHtml: '© 2018 – 2026 <b>bentoo</b> · 手工打造，源码优先',
    footerRightHtml: '基尔·伊根 · 赞美 · <b>内核是 gentoo</b>',
  },
};
