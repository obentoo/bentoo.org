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
      { kanji: '選', text: 'valores predeterminados con criterio' },
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
  ru: {
    title: 'BENTOO — neon arcade · stage5',
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
    taglineHtml: 'Удобный <em>Stage5</em> Gentoo Linux.',
    ledeHtml: 'Linux-десктоп <em>на основе исходного кода</em> для неоновой аркады — <b>Stage5</b> Gentoo, заранее скомпилированный и настроенный. Внутри — нетронутый Portage, снаружи — блеск.',
    statReleaseLabel: 'РЕЛИЗ',
    btnSource: '► ИСХОДНИКИ',
    btnContact: '✉ КОНТАКТЫ',
    btnNotify: '⚡ УВЕДОМИТЬ МЕНЯ',
    pingLabelHtml: 'УВЕДОМЛЕНИЕ О РЕЛИЗЕ · <b>ОДНОКРАТНО</b> · БЕЗ РАССЫЛКИ',
    footerCopyHtml: '© 2018 – 2026 <em>BENTOO<span class="dot">.</span></em> · РУЧНАЯ РАБОТА, ИСХОДНИКИ ПРЕЖДЕ ВСЕГО',
  },
  zh: {
    title: 'BENTOO — neon arcade · stage5',
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
    taglineHtml: '易于上手的 Gentoo Linux <em>Stage5</em>。',
    ledeHtml: '一款属于霓虹街机厅、<em>基于源码</em>的 Linux 桌面 —— Gentoo 的 <b>Stage5</b>，预编译且预配置。底层 Portage 完好，表面精心打磨。',
    statReleaseLabel: '发布',
    btnSource: '► 源码',
    btnContact: '✉ 联系',
    btnNotify: '⚡ 通知我',
    pingLabelHtml: '发布提醒 · <b>仅一次</b> · 不发新闻邮件',
    footerCopyHtml: '© 2018 – 2026 <em>BENTOO<span class="dot">.</span></em> · 手工打造，源码优先',
  },
};
