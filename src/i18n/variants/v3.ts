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
  ru: {
    title: 'BENTOO — аркадный linux из исходников',
    description: 'Bentoo — удобный Stage5 Gentoo Linux.',
    arcadeTickerHeader: '1CC · ВСТАВЬТЕ МОНЕТУ, ЧТОБЫ СКОМПИЛИРОВАТЬ',
    tickerSpans: [
      { kanji: '源', text: 'LINUX ИЗ ИСХОДНИКОВ' },
      { kanji: '常', text: 'ROLLING RELEASE' },
      { kanji: '包', text: '100+ НОВЫХ EBUILD' },
      { kanji: '守', text: 'ГОТОВЫЙ ДЕСКТОП' },
      { kanji: '速', text: '-MARCH=X86-64-V3' },
      { kanji: '自', text: 'НА КАЖДЫЙ ДЕНЬ' },
      { kanji: '選', text: 'ПРОДУМАННЫЕ УМОЛЧАНИЯ' },
      { kanji: '味', text: 'ВНУТРИ — GENTOO' },
    ],
    pillStatusHtml: '<b>●</b> СКОРО · 0.1.0-ALPHA',
    taglineHtml: 'Удобный <em>Stage5</em> Gentoo Linux.',
    ledeHtml: 'Bentoo — Linux-десктоп <em>на основе исходного кода</em>, который доводит философию поэтапной установки Gentoo до логического завершения: <b>Stage5</b>. Заранее скомпилирован, заранее настроен, готов к загрузке — под капотом всё тот же Portage, а кухня по-прежнему ваша.',
    btnContact: '► КОНТАКТЫ',
    btnNotify: '► УВЕДОМИТЬ МЕНЯ',
    imgAlt: 'Аркадная вывеска BENTOO',
    highScoreLabel: 'УВЕДОМЛЕНИЕ О РЕЛИЗЕ',
    footerCopyHtml: '© 2018 – 2026 <em>BENTOO</em><span class="dot">.</span> · РУЧНАЯ РАБОТА · ИСХОДНИКИ ПРЕЖДЕ ВСЕГО',
  },
  zh: {
    title: 'BENTOO — 街机风的源码 linux',
    description: 'Bentoo 是易于上手的 Gentoo Linux Stage5。',
    arcadeTickerHeader: '1CC · 投币开始编译',
    tickerSpans: [
      { kanji: '源', text: '基于源码的 LINUX' },
      { kanji: '常', text: 'ROLLING RELEASE' },
      { kanji: '包', text: '100+ 个新 EBUILD' },
      { kanji: '守', text: '桌面就绪' },
      { kanji: '速', text: '-MARCH=X86-64-V3' },
      { kanji: '自', text: '日常主力' },
      { kanji: '選', text: '有主见的默认配置' },
      { kanji: '味', text: '内核是 GENTOO' },
    ],
    pillStatusHtml: '<b>●</b> 即将推出 · 0.1.0-ALPHA',
    taglineHtml: '易于上手的 Gentoo Linux <em>Stage5</em>。',
    ledeHtml: 'Bentoo 是一款<em>基于源码</em>的 Linux 桌面，它把 Gentoo 分阶段安装的理念推向自然的终点：<b>Stage5</b>。预编译、预配置、开机即用 —— 底层依然是 Portage，厨房依然归你。',
    btnContact: '► 联系',
    btnNotify: '► 通知我',
    imgAlt: 'BENTOO 街机招牌',
    highScoreLabel: '发布提醒',
    footerCopyHtml: '© 2018 – 2026 <em>BENTOO</em><span class="dot">.</span> · 手工打造 · 源码优先',
  },
};
