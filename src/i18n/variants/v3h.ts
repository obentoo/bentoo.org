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
  ru: {
    title: 'BENTOO · 24時 新宿 — АРКАДНЫЙ LINUX',
    description: 'Bentoo — удобный Stage5 Gentoo Linux.',
    tickerSpans: [
      { kanji: '源', text: 'linux из исходников' },
      { kanji: '常', text: 'rolling release' },
      { kanji: '包', text: '100+ новых ebuild' },
      { kanji: '守', text: 'готовый десктоп' },
      { kanji: '速', text: '-march=x86-64-v3' },
      { kanji: '自', text: 'на каждый день' },
      { kanji: '選', text: 'продуманные умолчания' },
      { kanji: '味', text: 'внутри — gentoo' },
    ],
    taglineHtml: 'УДОБНЫЙ <em>STAGE5</em> GENTOO LINUX',
    ledeHtml: 'Linux-десктоп <em>на основе исходного кода</em>, светящийся в неоне круглосуточной аркады, — <b>Stage5</b> Gentoo. Заранее скомпилирован, заранее настроен, Portage цел. Готов к загрузке, когда уйдёт последняя электричка.',
    windowKey: 'СРОК',
    windowVal: 'КОНЕЦ 2026',
    kitchenKey: 'КУХНЯ',
    kitchenVal: 'БРАЗИЛИЯ · 東京',
    btnSource: '► ИСХОДНИКИ',
    btnContact: '✉ КОНТАКТЫ',
    btnNotify: '⚡ УВЕДОМИТЬ МЕНЯ',
    pingLabelHtml: 'УВЕДОМЛЕНИЕ О РЕЛИЗЕ · <b>ОДНОКРАТНО</b> · БЕЗ РАССЫЛКИ · ОТПИСКА ВСТРОЕНА',
    footerCopyHtml: '© 2018 – 2026 <em>BENTOO.</em> · РУЧНАЯ РАБОТА, ИСХОДНИКИ ПРЕЖДЕ ВСЕГО',
  },
  zh: {
    title: 'BENTOO · 24時 新宿 — 街机 LINUX',
    description: 'Bentoo 是易于上手的 Gentoo Linux Stage5。',
    tickerSpans: [
      { kanji: '源', text: '基于源码的 linux' },
      { kanji: '常', text: 'rolling release' },
      { kanji: '包', text: '100+ 个新 ebuild' },
      { kanji: '守', text: '桌面就绪' },
      { kanji: '速', text: '-march=x86-64-v3' },
      { kanji: '自', text: '日常主力' },
      { kanji: '選', text: '有主见的默认配置' },
      { kanji: '味', text: '内核是 gentoo' },
    ],
    taglineHtml: '易于上手的 GENTOO LINUX <em>STAGE5</em>',
    ledeHtml: '一款在通宵街机厅霓虹下发光、<em>基于源码</em>的 Linux 桌面 —— Gentoo 的 <b>Stage5</b>。预编译、预配置，Portage 完好。末班车开走时，它已准备好启动。',
    windowKey: '窗口期',
    windowVal: '2026 年底',
    kitchenKey: '厨房',
    kitchenVal: '巴西 · 東京',
    btnSource: '► 源码',
    btnContact: '✉ 联系',
    btnNotify: '⚡ 通知我',
    pingLabelHtml: '发布提醒 · <b>仅一次</b> · 不发新闻邮件 · 内置退订',
    footerCopyHtml: '© 2018 – 2026 <em>BENTOO.</em> · 手工打造，源码优先',
  },
};
