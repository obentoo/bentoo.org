import type { Lang } from '~/utils/getLang';

export interface V3aSpecRow {
  k: string;
  v: string;
  t: string;
}

export interface V3aContent {
  title: string;
  description: string;
  taglineHtml: string;
  ledeHtml: string;
  specs: V3aSpecRow[];
  btnSource: string;
  btnContact: string;
  btnNotify: string;
  subscribeTtl: string;
  pingLabelHtml: string;
  footerCopyHtml: string;
}

export const v3a: Record<Lang, V3aContent> = {
  en: {
    title: 'BENTOO.EXE — アーケード・リナックス',
    description: 'Bentoo is a user-friendly Stage5 of Gentoo Linux.',
    taglineHtml: 'A user-friendly <em>Stage5</em> of Gentoo Linux.',
    ledeHtml:
      '<b>BENTOO</b> is a <em>source-based</em> Linux desktop — a <b>Stage5</b> extension of Gentoo, pre-compiled and pre-configured. Portage stays intact, USE flags untouched, desktop ready from first boot.',
    specs: [
      { k: 'VERSION:', v: '0.1.0-alpha · rolling', t: 'YET TO COMPILE' },
      { k: 'ARCH:', v: 'x86-64-v3 · -O2 -pipe', t: 'FAST' },
      { k: 'BASE:', v: 'gentoo · source-first', t: 'GPL-2.0' },
      { k: 'KITCHEN:', v: 'Brazil ⇄ 東京', t: 'UTC-3' },
    ],
    btnSource: '► SOURCE',
    btnContact: '✉ CONTACT',
    btnNotify: '⚡ NOTIFY ME',
    subscribeTtl: 'release-ping — subscribe',
    pingLabelHtml:
      'RELEASE PING <span>ONE-SHOT · NO NEWSLETTER</span>',
    footerCopyHtml:
      '© 2018 – 2026 <em>BENTOO<span class="dot">.</span></em> · HANDCRAFTED · SOURCE-FIRST',
  },
  pt: {
    title: 'BENTOO.EXE — アーケード・リナックス',
    description: 'Bentoo é um Stage5 amigável do Gentoo Linux.',
    taglineHtml: 'Um <em>Stage5</em> amigável do Gentoo Linux.',
    ledeHtml:
      '<b>BENTOO</b> é um desktop Linux <em>baseado em código-fonte</em> — uma extensão <b>Stage5</b> do Gentoo, pré-compilada e pré-configurada. Portage intacto, USE flags preservadas, desktop pronto desde o primeiro boot.',
    specs: [
      { k: 'VERSÃO:', v: '0.1.0-alpha · rolling', t: 'AINDA NÃO COMPILADO' },
      { k: 'ARCH:', v: 'x86-64-v3 · -O2 -pipe', t: 'RÁPIDO' },
      { k: 'BASE:', v: 'gentoo · código-fonte primeiro', t: 'GPL-2.0' },
      { k: 'COZINHA:', v: 'Brasil ⇄ 東京', t: 'UTC-3' },
    ],
    btnSource: '► FONTE',
    btnContact: '✉ CONTATO',
    btnNotify: '⚡ ME AVISE',
    subscribeTtl: 'ping-de-lancamento — inscreva-se',
    pingLabelHtml:
      'PING DE LANÇAMENTO <span>DISPARO ÚNICO · SEM NEWSLETTER</span>',
    footerCopyHtml:
      '© 2018 – 2026 <em>BENTOO<span class="dot">.</span></em> · FEITO À MÃO · CÓDIGO-FONTE PRIMEIRO',
  },
  es: {
    title: 'BENTOO.EXE — アーケード・リナックス',
    description: 'Bentoo es un Stage5 fácil de usar de Gentoo Linux.',
    taglineHtml: 'Un <em>Stage5</em> fácil de usar de Gentoo Linux.',
    ledeHtml:
      '<b>BENTOO</b> es un escritorio Linux <em>basado en código fuente</em> — una extensión <b>Stage5</b> de Gentoo, precompilada y preconfigurada. Portage intacto, USE flags conservadas, escritorio listo desde el primer arranque.',
    specs: [
      { k: 'VERSIÓN:', v: '0.1.0-alpha · rolling', t: 'AÚN NO COMPILADO' },
      { k: 'ARCH:', v: 'x86-64-v3 · -O2 -pipe', t: 'RÁPIDO' },
      { k: 'BASE:', v: 'gentoo · código fuente primero', t: 'GPL-2.0' },
      { k: 'COCINA:', v: 'Brasil ⇄ 東京', t: 'UTC-3' },
    ],
    btnSource: '► CÓDIGO',
    btnContact: '✉ CONTACTO',
    btnNotify: '⚡ AVÍSAME',
    subscribeTtl: 'release-ping — suscríbete',
    pingLabelHtml:
      'PING DE LANZAMIENTO <span>ENVÍO ÚNICO · SIN BOLETÍN</span>',
    footerCopyHtml:
      '© 2018 – 2026 <em>BENTOO<span class="dot">.</span></em> · HECHO A MANO · CÓDIGO FUENTE PRIMERO',
  },
};
