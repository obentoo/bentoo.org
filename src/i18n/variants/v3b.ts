import type { Lang } from '~/utils/getLang';

export interface V3bContent {
  title: string;
  description: string;
  tickerSpans: { kanji: string; text: string }[];
  taglineHtml: string;
  ledeHtml: string;
  statReleaseLabel: string;
  btnSource: string;
  btnContact: string;
  btnNotify: string;
  pingLabelHtml: string;
  footerCopyHtml: string;
}

export const v3b: Record<Lang, V3bContent> = {
  en: {
    title: 'BENTOO — neon arcade · stage5',
    description: 'Bentoo is a user-friendly Stage5 of Gentoo Linux.',
    tickerSpans: [
      { kanji: '源', text: 'source-based linux' },
      { kanji: '常', text: 'rolling release' },
      { kanji: '包', text: '100+ new ebuilds' },
      { kanji: '守', text: 'desktop ready' },
      { kanji: '速', text: '-march=x86-64-v3' },
      { kanji: '自', text: 'daily driver' },
      { kanji: '選', text: 'opinionated defaults' },
      { kanji: '味', text: 'gentoo inside' },
    ],
    taglineHtml: 'A user-friendly <em>Stage5</em> of Gentoo Linux.',
    ledeHtml:
      'A <em>source-based</em> Linux desktop for the neon arcade — <b>Stage5</b> of Gentoo, pre-compiled and pre-configured. Portage intact underneath, polish on top.',
    statReleaseLabel: 'RELEASE',
    btnSource: '► SOURCE',
    btnContact: '✉ CONTACT',
    btnNotify: '⚡ NOTIFY ME',
    pingLabelHtml: 'RELEASE PING · <b>ONE-SHOT</b> · NO NEWSLETTER',
    footerCopyHtml:
      '© 2018 – 2026 <em>BENTOO<span class="dot">.</span></em> · HANDCRAFTED, SOURCE-FIRST',
  },
  pt: {
    title: 'BENTOO — neon arcade · stage5',
    description: 'Bentoo é um Stage5 amigável do Gentoo Linux.',
    tickerSpans: [
      { kanji: '源', text: 'linux baseado em código-fonte' },
      { kanji: '常', text: 'rolling release' },
      { kanji: '包', text: '100+ ebuilds novos' },
      { kanji: '守', text: 'desktop pronto' },
      { kanji: '速', text: '-march=x86-64-v3' },
      { kanji: '自', text: 'uso diário' },
      { kanji: '選', text: 'padrões opiniativos' },
      { kanji: '味', text: 'gentoo por dentro' },
    ],
    taglineHtml: 'Um <em>Stage5</em> amigável do Gentoo Linux.',
    ledeHtml:
      'Um desktop Linux <em>baseado em código-fonte</em> para o arcade neon — <b>Stage5</b> do Gentoo, pré-compilado e pré-configurado. Portage intacto por baixo, polimento por cima.',
    statReleaseLabel: 'LANÇAMENTO',
    btnSource: '► FONTE',
    btnContact: '✉ CONTATO',
    btnNotify: '⚡ ME AVISE',
    pingLabelHtml:
      'PING DE LANÇAMENTO · <b>DISPARO ÚNICO</b> · SEM NEWSLETTER',
    footerCopyHtml:
      '© 2018 – 2026 <em>BENTOO<span class="dot">.</span></em> · FEITO À MÃO, CÓDIGO-FONTE PRIMEIRO',
  },
  es: {
    title: 'BENTOO — neon arcade · stage5',
    description: 'Bentoo es un Stage5 fácil de usar de Gentoo Linux.',
    tickerSpans: [
      { kanji: '源', text: 'linux basado en código fuente' },
      { kanji: '常', text: 'rolling release' },
      { kanji: '包', text: '+100 ebuilds nuevos' },
      { kanji: '守', text: 'escritorio listo' },
      { kanji: '速', text: '-march=x86-64-v3' },
      { kanji: '自', text: 'uso diario' },
      { kanji: '選', text: 'estándares opinativos' },
      { kanji: '味', text: 'gentoo por dentro' },
    ],
    taglineHtml: 'Un <em>Stage5</em> fácil de usar de Gentoo Linux.',
    ledeHtml:
      'Un escritorio Linux <em>basado en código fuente</em> para el arcade neón — <b>Stage5</b> de Gentoo, precompilado y preconfigurado. Portage intacto debajo, pulido encima.',
    statReleaseLabel: 'LANZAMIENTO',
    btnSource: '► CÓDIGO',
    btnContact: '✉ CONTACTO',
    btnNotify: '⚡ AVÍSAME',
    pingLabelHtml:
      'PING DE LANZAMIENTO · <b>DISPARO ÚNICO</b> · SIN BOLETÍN',
    footerCopyHtml:
      '© 2018 – 2026 <em>BENTOO<span class="dot">.</span></em> · HECHO A MANO, CÓDIGO FUENTE PRIMERO',
  },
};
