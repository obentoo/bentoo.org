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
  ru: {
    title: 'BENTOO // synthwave outrun',
    description: 'Bentoo — удобный Stage5 Gentoo Linux.',
    overTicker: '◤ OUTRUN · STAGE5 · ПРИБЫТИЕ В 2026 ◢',
    taglineHtml: 'Удобный <em>Stage5</em> Gentoo Linux',
    ledeHtml: 'Linux-десктоп <em>на основе исходного кода</em> для неонового шоссе — <b>Stage5</b> Gentoo. Заранее скомпилирован, заранее настроен, а внизу — нетронутый Portage. Круиз на x86-64-v3.',
    specSpeedKey: 'скорость',
    specWindowKey: 'срок',
    specKitchenKey: 'кухня',
    specWindowValHtml: 'КОНЕЦ <em>2026</em>',
    specKitchenVal: 'БРАЗИЛИЯ · 東京',
    btnSource: '► ИСХОДНИКИ',
    btnContact: '✉ КОНТАКТЫ',
    btnNotify: '⚡ УВЕДОМИТЬ МЕНЯ',
    pingLabelHtml: 'УВЕДОМЛЕНИЕ О РЕЛИЗЕ · <b>ОДНОКРАТНО</b> · БЕЗ РАССЫЛКИ',
    footerCopyHtml: '© 2018 – 2026 <em>BENTOO.</em> · РУЧНАЯ РАБОТА, ИСХОДНИКИ ПРЕЖДЕ ВСЕГО',
  },
  zh: {
    title: 'BENTOO // synthwave outrun',
    description: 'Bentoo 是易于上手的 Gentoo Linux Stage5。',
    overTicker: '◤ OUTRUN · STAGE5 · 2026 年抵达 ◢',
    taglineHtml: '易于上手的 Gentoo Linux <em>Stage5</em>',
    ledeHtml: '一款驰骋霓虹公路、<em>基于源码</em>的 Linux 桌面 —— Gentoo 的 <b>Stage5</b>。预编译、预配置，底层 Portage 原封不动。以 x86-64-v3 巡航。',
    specSpeedKey: '速度',
    specWindowKey: '窗口期',
    specKitchenKey: '厨房',
    specWindowValHtml: '<em>2026</em> 年底',
    specKitchenVal: '巴西 · 東京',
    btnSource: '► 源码',
    btnContact: '✉ 联系',
    btnNotify: '⚡ 通知我',
    pingLabelHtml: '发布提醒 · <b>仅一次</b> · 不发新闻邮件',
    footerCopyHtml: '© 2018 – 2026 <em>BENTOO.</em> · 手工打造，源码优先',
  },
};
