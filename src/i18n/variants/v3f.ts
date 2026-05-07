import type { Lang } from '~/utils/getLang';

export interface V3fContent {
  title: string;
  description: string;
  catNoEdition: string;
  region: string;
  cat: string;
  subTaglineHtml: string;
  ledeHtml: string;
  ribbon: string;
  playersRow: string;
  rating: string;
  cartSize: string;
  specWindowKey: string;
  specWindowValHtml: string;
  specKitchenKey: string;
  specKitchenVal: string;
  btnSource: string;
  btnContact: string;
  btnNotify: string;
  releasePingLabel: string;
  releasePingSub: string;
  footerCopyHtml: string;
}

export const v3f: Record<Lang, V3fContent> = {
  en: {
    title: 'BENTOO · SUPER FAMICOM BOX',
    description: 'Bentoo is a user-friendly Stage5 of Gentoo Linux.',
    catNoEdition: 'SUPER FAMICOM BOX EDITION',
    region: 'BRAZIL / JP',
    cat: 'ROLE-PLAYING · ARCADE LINUX DISTRIBUTION',
    subTaglineHtml: 'A user-friendly <em>Stage5</em> of Gentoo Linux.',
    ledeHtml:
      'A <em>source-based</em> Linux desktop shipped like a Super Famicom — boxed, catalogued, ready to play. <b>Stage5</b> of Gentoo: pre-compiled, pre-configured, Portage still under the hood.',
    ribbon: 'LICENSED PRODUCT',
    playersRow: 'PLAYERS · 1+ · ROLLING RELEASE',
    rating: '★ ALL · GPL-2.0',
    cartSize: 'CART SIZE: 30,412 EBUILDS',
    specWindowKey: 'Window',
    specWindowValHtml: 'late <em>2026</em>',
    specKitchenKey: 'Kitchen',
    specKitchenVal: 'Brazil · 東京',
    btnSource: 'SOURCE →',
    btnContact: 'CONTACT →',
    btnNotify: 'NOTIFY ME →',
    releasePingLabel: 'RELEASE PING',
    releasePingSub: 'ONE-SHOT · NO NEWSLETTER',
    footerCopyHtml:
      '© 2018 – 2026 <em>BENTOO.</em> · HANDCRAFTED, SOURCE-FIRST',
  },
  pt: {
    title: 'BENTOO · CAIXA SUPER FAMICOM',
    description: 'Bentoo é um Stage5 amigável do Gentoo Linux.',
    catNoEdition: 'EDIÇÃO CAIXA SUPER FAMICOM',
    region: 'BRASIL / JP',
    cat: 'RPG · DISTRIBUIÇÃO LINUX ARCADE',
    subTaglineHtml: 'Um <em>Stage5</em> amigável do Gentoo Linux.',
    ledeHtml:
      'Um desktop Linux <em>baseado em código-fonte</em> entregue como um Super Famicom — encaixotado, catalogado, pronto para jogar. <b>Stage5</b> do Gentoo: pré-compilado, pré-configurado, Portage ainda por baixo.',
    ribbon: 'PRODUTO LICENCIADO',
    playersRow: 'JOGADORES · 1+ · ROLLING RELEASE',
    rating: '★ TODOS · GPL-2.0',
    cartSize: 'TAMANHO CART: 30.412 EBUILDS',
    specWindowKey: 'Janela',
    specWindowValHtml: 'final de <em>2026</em>',
    specKitchenKey: 'Cozinha',
    specKitchenVal: 'Brasil · 東京',
    btnSource: 'FONTE →',
    btnContact: 'CONTATO →',
    btnNotify: 'ME AVISE →',
    releasePingLabel: 'PING DE LANÇAMENTO',
    releasePingSub: 'DISPARO ÚNICO · SEM NEWSLETTER',
    footerCopyHtml:
      '© 2018 – 2026 <em>BENTOO.</em> · FEITO À MÃO, CÓDIGO-FONTE PRIMEIRO',
  },
  es: {
    title: 'BENTOO · CAJA SUPER FAMICOM',
    description: 'Bentoo es un Stage5 fácil de usar de Gentoo Linux.',
    catNoEdition: 'EDICIÓN CAJA SUPER FAMICOM',
    region: 'BRASIL / JP',
    cat: 'RPG · DISTRIBUCIÓN LINUX ARCADE',
    subTaglineHtml: 'Un <em>Stage5</em> fácil de usar de Gentoo Linux.',
    ledeHtml:
      'Un escritorio Linux <em>basado en código fuente</em> entregado como una Super Famicom — encajado, catalogado, listo para jugar. <b>Stage5</b> de Gentoo: precompilado, preconfigurado, Portage aún bajo el capó.',
    ribbon: 'PRODUCTO CON LICENCIA',
    playersRow: 'JUGADORES · 1+ · ROLLING RELEASE',
    rating: '★ TODOS · GPL-2.0',
    cartSize: 'TAMAÑO CART: 30.412 EBUILDS',
    specWindowKey: 'Ventana',
    specWindowValHtml: 'finales de <em>2026</em>',
    specKitchenKey: 'Cocina',
    specKitchenVal: 'Brasil · 東京',
    btnSource: 'CÓDIGO →',
    btnContact: 'CONTACTO →',
    btnNotify: 'AVÍSAME →',
    releasePingLabel: 'PING DE LANZAMIENTO',
    releasePingSub: 'DISPARO ÚNICO · SIN BOLETÍN',
    footerCopyHtml:
      '© 2018 – 2026 <em>BENTOO.</em> · HECHO A MANO, CÓDIGO FUENTE PRIMERO',
  },
};
