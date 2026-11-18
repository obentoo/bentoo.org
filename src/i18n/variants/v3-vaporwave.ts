import type { Lang } from '~/utils/getLang';

export interface V3VaporwaveContent {
  title: string;
  description: string;
  taglineHtml: string;
  ledeHtml: string;
  specWindowKey: string;
  specKitchenKey: string;
  specWindowValHtml: string;
  specKitchenVal: string;
  btnContact: string;
  btnNotify: string;
  pingLabelHtml: string;
  footerCopyHtml: string;
}

export const v3Vaporwave: Record<Lang, V3VaporwaveContent> = {
  en: {
    title: 'BENTOO // ベントー — shibuya 1989',
    description: 'Bentoo is a user-friendly Stage5 of Gentoo Linux.',
    taglineHtml: 'A user-friendly <em>Stage5</em> of Gentoo Linux',
    ledeHtml:
      'A <em>source-based</em> Linux desktop with the heat of a Shibuya neon sign in 1989 — <b>Stage5</b> of Gentoo. Pre-compiled, pre-configured, Portage untouched. Feel the synth.',
    specWindowKey: 'window',
    specKitchenKey: 'kitchen',
    specWindowValHtml: 'LATE <em>2026</em>',
    specKitchenVal: 'BRAZIL · 東京',
    btnContact: '✉ CONTACT',
    btnNotify: '⚡ NOTIFY ME',
    pingLabelHtml: 'RELEASE PING · <b>ONE-SHOT</b> · NO NEWSLETTER',
    footerCopyHtml:
      '© 2018 – 2026 <em>BENTOO.</em> · HANDCRAFTED, SOURCE-FIRST',
  },
  pt: {
    title: 'BENTOO // ベントー — shibuya 1989',
    description: 'Bentoo é um Stage5 amigável do Gentoo Linux.',
    taglineHtml: 'Um <em>Stage5</em> amigável do Gentoo Linux',
    ledeHtml:
      'Um desktop Linux <em>baseado em código-fonte</em> com o calor de um letreiro de neon de Shibuya em 1989 — <b>Stage5</b> do Gentoo. Pré-compilado, pré-configurado, Portage intacto. Sinta o synth.',
    specWindowKey: 'janela',
    specKitchenKey: 'cozinha',
    specWindowValHtml: 'FIM DE <em>2026</em>',
    specKitchenVal: 'BRASIL · 東京',
    btnContact: '✉ CONTATO',
    btnNotify: '⚡ ME AVISE',
    pingLabelHtml: 'AVISO DE LANÇAMENTO · <b>ÚNICO</b> · SEM NEWSLETTER',
    footerCopyHtml:
      '© 2018 – 2026 <em>BENTOO.</em> · FEITO À MÃO, CÓDIGO-FONTE PRIMEIRO',
  },
  es: {
    title: 'BENTOO // ベントー — shibuya 1989',
    description: 'Bentoo es un Stage5 fácil de usar de Gentoo Linux.',
    taglineHtml: 'Un <em>Stage5</em> fácil de usar de Gentoo Linux',
    ledeHtml:
      'Un escritorio Linux <em>basado en código fuente</em> con la calidez de un letrero de neón de Shibuya en 1989 — <b>Stage5</b> de Gentoo. Precompilado, preconfigurado, Portage intacto. Siente el synth.',
    specWindowKey: 'ventana',
    specKitchenKey: 'cocina',
    specWindowValHtml: 'FINALES DE <em>2026</em>',
    specKitchenVal: 'BRASIL · 東京',
    btnContact: '✉ CONTACTO',
    btnNotify: '⚡ AVÍSAME',
    pingLabelHtml: 'AVISO DE LANZAMIENTO · <b>ÚNICO</b> · SIN BOLETÍN',
    footerCopyHtml:
      '© 2018 – 2026 <em>BENTOO.</em> · HECHO A MANO, CÓDIGO FUENTE PRIMERO',
  },
  ru: {
    title: 'BENTOO // ベントー — shibuya 1989',
    description: 'Bentoo — удобный Stage5 Gentoo Linux.',
    taglineHtml: 'Удобный <em>Stage5</em> Gentoo Linux',
    ledeHtml: 'Linux-десктоп <em>на основе исходного кода</em>, горячий, как неоновая вывеска Сибуи в 1989-м, — <b>Stage5</b> Gentoo. Заранее скомпилирован, заранее настроен, Portage не тронут. Почувствуй синт.',
    specWindowKey: 'срок',
    specKitchenKey: 'кухня',
    specWindowValHtml: 'КОНЕЦ <em>2026</em>',
    specKitchenVal: 'БРАЗИЛИЯ · 東京',
    btnContact: '✉ КОНТАКТЫ',
    btnNotify: '⚡ УВЕДОМИТЬ МЕНЯ',
    pingLabelHtml: 'УВЕДОМЛЕНИЕ О РЕЛИЗЕ · <b>ОДНОКРАТНО</b> · БЕЗ РАССЫЛКИ',
    footerCopyHtml: '© 2018 – 2026 <em>BENTOO.</em> · РУЧНАЯ РАБОТА, ИСХОДНИКИ ПРЕЖДЕ ВСЕГО',
  },
  zh: {
    title: 'BENTOO // ベントー — shibuya 1989',
    description: 'Bentoo 是易于上手的 Gentoo Linux Stage5。',
    taglineHtml: '易于上手的 Gentoo Linux <em>Stage5</em>',
    ledeHtml: '一款<em>基于源码</em>的 Linux 桌面，带着 1989 年涩谷霓虹招牌的热度 —— Gentoo 的 <b>Stage5</b>。预编译、预配置，Portage 原封不动。感受合成器之声。',
    specWindowKey: '窗口期',
    specKitchenKey: '厨房',
    specWindowValHtml: '<em>2026</em> 年底',
    specKitchenVal: '巴西 · 東京',
    btnContact: '✉ 联系',
    btnNotify: '⚡ 通知我',
    pingLabelHtml: '发布提醒 · <b>仅一次</b> · 不发新闻邮件',
    footerCopyHtml: '© 2018 – 2026 <em>BENTOO.</em> · 手工打造，源码优先',
  },
};
