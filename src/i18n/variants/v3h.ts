import type { Lang } from '~/utils/getLang';

export interface V3hContent {
  title: string;
  description: string;
  tickerSpans: { kanji: string; text: string }[];
  taglineHtml: string;
  ledeHtml: string;
  windowKey: string;
  windowVal: string;
  kitchenKey: string;
  kitchenVal: string;
  btnSource: string;
  btnContact: string;
  btnNotify: string;
  pingLabelHtml: string;
  footerCopyHtml: string;
}

export const v3h: Record<Lang, V3hContent> = {
  en: {
    title: 'BENTOO · 24時 新宿 — ARCADE LINUX',
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
    taglineHtml: 'A USER-FRIENDLY <em>STAGE5</em> OF GENTOO LINUX',
    ledeHtml:
      'A <em>source-based</em> Linux desktop glowing under the neon of an all-night arcade — <b>Stage5</b> of Gentoo. Pre-compiled, pre-configured, Portage intact. Ready to boot when the last train leaves.',
    windowKey: 'WINDOW',
    windowVal: 'LATE 2026',
    kitchenKey: 'KITCHEN',
    kitchenVal: 'BRAZIL · 東京',
    btnSource: '► SOURCE',
    btnContact: '✉ CONTACT',
    btnNotify: '⚡ NOTIFY ME',
    pingLabelHtml:
      'RELEASE PING · <b>ONE-SHOT</b> · NO NEWSLETTER · UNSUBSCRIBE BUILT-IN',
    footerCopyHtml:
      '© 2018 – 2026 <em>BENTOO.</em> · HANDCRAFTED, SOURCE-FIRST',
  },
  pt: {
    title: 'BENTOO · 24時 新宿 — LINUX ARCADE',
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
    taglineHtml: 'UM <em>STAGE5</em> AMIGÁVEL DO GENTOO LINUX',
    ledeHtml:
      'Um desktop Linux <em>baseado em código-fonte</em> brilhando sob o neon de um arcade 24 horas — <b>Stage5</b> do Gentoo. Pré-compilado, pré-configurado, Portage intacto. Pronto para bootar quando o último trem parte.',
    windowKey: 'JANELA',
    windowVal: 'FINAL 2026',
    kitchenKey: 'COZINHA',
    kitchenVal: 'BRASIL · 東京',
    btnSource: '► FONTE',
    btnContact: '✉ CONTATO',
    btnNotify: '⚡ ME AVISE',
    pingLabelHtml:
      'PING DE LANÇAMENTO · <b>DISPARO ÚNICO</b> · SEM NEWSLETTER · UNSUBSCRIBE EMBUTIDO',
    footerCopyHtml:
      '© 2018 – 2026 <em>BENTOO.</em> · FEITO À MÃO, CÓDIGO-FONTE PRIMEIRO',
  },
  es: {
    title: 'BENTOO · 24時 新宿 — LINUX ARCADE',
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
    taglineHtml: 'UN <em>STAGE5</em> FÁCIL DE USAR DE GENTOO LINUX',
    ledeHtml:
      'Un escritorio Linux <em>basado en código fuente</em> brillando bajo el neón de un arcade abierto 24 horas — <b>Stage5</b> de Gentoo. Precompilado, preconfigurado, Portage intacto. Listo para arrancar cuando sale el último tren.',
    windowKey: 'VENTANA',
    windowVal: 'FINALES 2026',
    kitchenKey: 'COCINA',
    kitchenVal: 'BRASIL · 東京',
    btnSource: '► CÓDIGO',
    btnContact: '✉ CONTACTO',
    btnNotify: '⚡ AVÍSAME',
    pingLabelHtml:
      'PING DE LANZAMIENTO · <b>DISPARO ÚNICO</b> · SIN BOLETÍN · BAJA INTEGRADA',
    footerCopyHtml:
      '© 2018 – 2026 <em>BENTOO.</em> · HECHO A MANO, CÓDIGO FUENTE PRIMERO',
  },
};
