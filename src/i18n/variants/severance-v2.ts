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
};
