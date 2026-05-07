import type { Lang } from '~/utils/getLang';

export interface V3Content {
  title: string;
  description: string;
  arcadeTickerHeader: string;
  tickerSpans: { kanji: string; text: string }[];
  pillStatusHtml: string;
  taglineHtml: string;
  ledeHtml: string;
  btnContact: string;
  btnNotify: string;
  imgAlt: string;
  highScoreLabel: string;
  footerCopyHtml: string;
}

export const v3: Record<Lang, V3Content> = {
  en: {
    title: 'BENTOO — arcade source-based linux',
    description: 'Bentoo is a user-friendly Stage5 of Gentoo Linux.',
    arcadeTickerHeader: '1CC · INSERT COIN TO COMPILE',
    tickerSpans: [
      { kanji: '源', text: 'SOURCE-BASED LINUX' },
      { kanji: '常', text: 'ROLLING RELEASE' },
      { kanji: '包', text: '100+ NEW EBUILDS' },
      { kanji: '守', text: 'DESKTOP READY' },
      { kanji: '速', text: '-MARCH=X86-64-V3' },
      { kanji: '自', text: 'DAILY DRIVER' },
      { kanji: '選', text: 'OPINIONATED DEFAULTS' },
      { kanji: '味', text: 'GENTOO INSIDE' },
    ],
    pillStatusHtml: '<b>●</b> COMING SOON · 0.1.0-ALPHA',
    taglineHtml: 'A user-friendly <em>Stage5</em> of Gentoo Linux.',
    ledeHtml:
      "Bentoo is a <em>source-based</em> Linux desktop that extends Gentoo's staged-install philosophy to its natural conclusion: <b>Stage5</b>. Pre-compiled, pre-configured, ready to boot — Portage still under the hood, kitchen still yours.",
    btnContact: '► CONTACT',
    btnNotify: '► NOTIFY ME',
    imgAlt: 'BENTOO arcade marquee',
    highScoreLabel: 'RELEASE PING',
    footerCopyHtml:
      '© 2018 – 2026 <em>BENTOO</em><span class="dot">.</span> · HANDCRAFTED · SOURCE-FIRST',
  },
  pt: {
    title: 'BENTOO — linux de arcade baseado em código-fonte',
    description: 'Bentoo é um Stage5 amigável do Gentoo Linux.',
    arcadeTickerHeader: '1CC · INSIRA MOEDA PARA COMPILAR',
    tickerSpans: [
      { kanji: '源', text: 'LINUX BASEADO EM CÓDIGO-FONTE' },
      { kanji: '常', text: 'ROLLING RELEASE' },
      { kanji: '包', text: '100+ EBUILDS NOVOS' },
      { kanji: '守', text: 'DESKTOP PRONTO' },
      { kanji: '速', text: '-MARCH=X86-64-V3' },
      { kanji: '自', text: 'USO DIÁRIO' },
      { kanji: '選', text: 'PADRÕES OPINIATIVOS' },
      { kanji: '味', text: 'GENTOO POR DENTRO' },
    ],
    pillStatusHtml: '<b>●</b> EM BREVE · 0.1.0-ALPHA',
    taglineHtml: 'Um <em>Stage5</em> amigável do Gentoo Linux.',
    ledeHtml:
      'Bentoo é um desktop Linux <em>baseado em código-fonte</em> que leva a filosofia de instalação em estágios do Gentoo à sua conclusão natural: <b>Stage5</b>. Pré-compilado, pré-configurado, pronto para bootar — Portage ainda por baixo, cozinha ainda sua.',
    btnContact: '► CONTATO',
    btnNotify: '► ME AVISE',
    imgAlt: 'Marquise arcade BENTOO',
    highScoreLabel: 'PING DE LANÇAMENTO',
    footerCopyHtml:
      '© 2018 – 2026 <em>BENTOO</em><span class="dot">.</span> · FEITO À MÃO · CÓDIGO-FONTE PRIMEIRO',
  },
  es: {
    title: 'BENTOO — linux de arcade basado en código fuente',
    description: 'Bentoo es un Stage5 fácil de usar de Gentoo Linux.',
    arcadeTickerHeader: '1CC · INTRODUCE MONEDA PARA COMPILAR',
    tickerSpans: [
      { kanji: '源', text: 'LINUX BASADO EN CÓDIGO FUENTE' },
      { kanji: '常', text: 'ROLLING RELEASE' },
      { kanji: '包', text: '+100 EBUILDS NUEVOS' },
      { kanji: '守', text: 'ESCRITORIO LISTO' },
      { kanji: '速', text: '-MARCH=X86-64-V3' },
      { kanji: '自', text: 'USO DIARIO' },
      { kanji: '選', text: 'ESTÁNDARES OPINATIVOS' },
      { kanji: '味', text: 'GENTOO POR DENTRO' },
    ],
    pillStatusHtml: '<b>●</b> PRÓXIMAMENTE · 0.1.0-ALPHA',
    taglineHtml: 'Un <em>Stage5</em> fácil de usar de Gentoo Linux.',
    ledeHtml:
      'Bentoo es un escritorio Linux <em>basado en código fuente</em> que lleva la filosofía de instalación por etapas de Gentoo a su conclusión natural: <b>Stage5</b>. Precompilado, preconfigurado, listo para arrancar — Portage sigue debajo, la cocina sigue siendo tuya.',
    btnContact: '► CONTACTO',
    btnNotify: '► AVÍSAME',
    imgAlt: 'Marquesina arcade BENTOO',
    highScoreLabel: 'PING DE LANZAMIENTO',
    footerCopyHtml:
      '© 2018 – 2026 <em>BENTOO</em><span class="dot">.</span> · HECHO A MANO · CÓDIGO FUENTE PRIMERO',
  },
};
