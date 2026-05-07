import type { Lang } from '~/utils/getLang';

export interface SynthwaveContent {
  title: string;
  description: string;
  overTicker: string;
  taglineHtml: string;
  ledeHtml: string;
  specSpeedKey: string;
  specWindowKey: string;
  specKitchenKey: string;
  specWindowValHtml: string;
  specKitchenVal: string;
  btnSource: string;
  btnContact: string;
  btnNotify: string;
  pingLabelHtml: string;
  footerCopyHtml: string;
}

export const synthwave: Record<Lang, SynthwaveContent> = {
  en: {
    title: 'BENTOO // synthwave outrun',
    description: 'Bentoo is a user-friendly Stage5 of Gentoo Linux.',
    overTicker: '◤ OUTRUN · STAGE5 · ARRIVING 2026 ◢',
    taglineHtml: 'A user-friendly <em>Stage5</em> of Gentoo Linux',
    ledeHtml:
      'A <em>source-based</em> Linux desktop for the neon highway — <b>Stage5</b> of Gentoo. Pre-compiled, pre-configured, Portage untouched underneath. Cruise at x86-64-v3.',
    specSpeedKey: 'speed',
    specWindowKey: 'window',
    specKitchenKey: 'kitchen',
    specWindowValHtml: 'LATE <em>2026</em>',
    specKitchenVal: 'BRAZIL · 東京',
    btnSource: '► SOURCE',
    btnContact: '✉ CONTACT',
    btnNotify: '⚡ NOTIFY ME',
    pingLabelHtml: 'RELEASE PING · <b>ONE-SHOT</b> · NO NEWSLETTER',
    footerCopyHtml:
      '© 2018 – 2026 <em>BENTOO.</em> · HANDCRAFTED, SOURCE-FIRST',
  },
  pt: {
    title: 'BENTOO // synthwave outrun',
    description: 'Bentoo é um Stage5 amigável do Gentoo Linux.',
    overTicker: '◤ OUTRUN · STAGE5 · CHEGANDO EM 2026 ◢',
    taglineHtml: 'Um <em>Stage5</em> amigável do Gentoo Linux',
    ledeHtml:
      'Um desktop Linux <em>baseado em fontes</em> para a neon highway — <b>Stage5</b> do Gentoo. Pré-compilado, pré-configurado, Portage intacto por baixo. Cruze em x86-64-v3.',
    specSpeedKey: 'velocidade',
    specWindowKey: 'janela',
    specKitchenKey: 'cozinha',
    specWindowValHtml: 'FIM DE <em>2026</em>',
    specKitchenVal: 'BRASIL · 東京',
    btnSource: '► CÓDIGO',
    btnContact: '✉ CONTATO',
    btnNotify: '⚡ ME AVISE',
    pingLabelHtml: 'PING DE LANÇAMENTO · <b>ÚNICO</b> · SEM NEWSLETTER',
    footerCopyHtml:
      '© 2018 – 2026 <em>BENTOO.</em> · FEITO À MÃO, CÓDIGO ABERTO',
  },
  es: {
    title: 'BENTOO // synthwave outrun',
    description: 'Bentoo es un Stage5 fácil de usar de Gentoo Linux.',
    overTicker: '◤ OUTRUN · STAGE5 · LLEGA EN 2026 ◢',
    taglineHtml: 'Un <em>Stage5</em> fácil de usar de Gentoo Linux',
    ledeHtml:
      'Un escritorio Linux <em>basado en fuentes</em> para la neon highway — <b>Stage5</b> de Gentoo. Precompilado, preconfigurado, con Portage intacto debajo. Compilado en x86-64-v3.',
    specSpeedKey: 'velocidad',
    specWindowKey: 'ventana',
    specKitchenKey: 'cocina',
    specWindowValHtml: 'FINALES DE <em>2026</em>',
    specKitchenVal: 'BRASIL · 東京',
    btnSource: '► CÓDIGO',
    btnContact: '✉ CONTACTO',
    btnNotify: '⚡ AVÍSAME',
    pingLabelHtml: 'PING DE LANZAMIENTO · <b>ÚNICO</b> · SIN BOLETÍN',
    footerCopyHtml:
      '© 2018 – 2026 <em>BENTOO.</em> · HECHO A MANO, CÓDIGO ABIERTO',
  },
};
