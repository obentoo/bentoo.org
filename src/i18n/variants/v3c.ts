import type { Lang } from '~/utils/getLang';

export interface V3cSpecRow {
  k: string;
  v: string;
  t: string;
}

export interface V3cContent {
  title: string;
  description: string;
  classified: string;
  sheet: string;
  tickerSpans: { kanji: string; text: string }[];
  subTaglineHtml: string;
  ledeHtml: string;
  specs: V3cSpecRow[];
  btnSource: string;
  btnContact: string;
  btnNotify: string;
  cornerLabelTL: string;
  cornerLabelBL: string;
  cornerLabelBR: string;
  svgAriaLabel: string;
  svgWidthText: string;
  metaHtml: string;
  footerLeftHtml: string;
  footerCenter: string;
  footerStamp: string;
  footerRight: string;
}

export const v3c: Record<Lang, V3cContent> = {
  en: {
    title: 'BENTOO — TECHNICAL MANUAL · BTO-001',
    description:
      'Bentoo is a user-friendly Stage5 of Gentoo Linux — a desktop distribution that ships pre-compiled, pre-configured, and ready to boot.',
    classified: 'COMING SOON',
    sheet: 'SHEET 01/01',
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
    subTaglineHtml: 'A user-friendly <em>Stage5</em> of Gentoo Linux.',
    ledeHtml:
      "Bentoo is a source-based Linux desktop that extends Gentoo's staged-install philosophy to its natural conclusion: <b>Stage5</b> — a pre-compiled, pre-configured, daily-usable system. It keeps the power of Portage and the rigor of source builds, while shipping you a complete desktop on day one.",
    specs: [
      { k: 'RELEASE', v: '0.1.0 · alpha', t: 'YET TO COMPILE' },
      { k: 'WINDOW', v: 'late 2026 — or when ready', t: '~Q4' },
      { k: 'BASE', v: 'gentoo · source-first', t: 'GPL-2.0' },
      { k: 'ARCH', v: 'x86-64-v3 · -O2 -pipe', t: 'FAST' },
      { k: 'KITCHEN', v: 'Brazil · 東京', t: 'UTC-3' },
    ],
    btnSource: 'Source · GitHub',
    btnContact: 'Contact',
    btnNotify: 'Notify me',
    cornerLabelTL: 'FIG. 01 — PRIMARY MARK',
    cornerLabelBL: 'SCALE 1:1',
    cornerLabelBR: 'SECTION A-A',
    svgAriaLabel: 'Bentoo bento illustration — fig. 01',
    svgWidthText: 'W = 189.7 mm',
    metaHtml: '! RELEASE · <b>PING</b> · ONE-SHOT',
    footerLeftHtml:
      '© 2018 – 2026 · <span class="sig"><em>bentoo<span class="dot">.</span></em></span> · handcrafted, source-first',
    footerCenter: 'BENTOO / PROJECT / TECHNICAL DIVISION',
    footerStamp: 'APPROVED · R.L.',
    footerRight: 'END OF DOCUMENT · 完',
  },
  pt: {
    title: 'BENTOO — MANUAL TÉCNICO · BTO-001',
    description:
      'Bentoo é um Stage5 amigável do Gentoo Linux — uma distribuição desktop que vem pré-compilada, pré-configurada e pronta para bootar.',
    classified: 'EM BREVE',
    sheet: 'FOLHA 01/01',
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
    subTaglineHtml: 'Um <em>Stage5</em> amigável do Gentoo Linux.',
    ledeHtml:
      'Bentoo é um desktop Linux baseado em código-fonte que leva a filosofia de instalação em estágios do Gentoo à sua conclusão natural: <b>Stage5</b> — um sistema pré-compilado, pré-configurado e utilizável no dia a dia. Mantém o poder do Portage e o rigor das builds de código-fonte, enquanto entrega a você um desktop completo desde o primeiro dia.',
    specs: [
      { k: 'RELEASE', v: '0.1.0 · alpha', t: 'AINDA NÃO COMPILADO' },
      { k: 'JANELA', v: 'final de 2026 — ou quando estiver pronto', t: '~T4' },
      { k: 'BASE', v: 'gentoo · código-fonte primeiro', t: 'GPL-2.0' },
      { k: 'ARCH', v: 'x86-64-v3 · -O2 -pipe', t: 'RÁPIDO' },
      { k: 'COZINHA', v: 'Brasil · 東京', t: 'UTC-3' },
    ],
    btnSource: 'Código-fonte · GitHub',
    btnContact: 'Contato',
    btnNotify: 'Me avise',
    cornerLabelTL: 'FIG. 01 — MARCA PRIMÁRIA',
    cornerLabelBL: 'ESCALA 1:1',
    cornerLabelBR: 'SEÇÃO A-A',
    svgAriaLabel: 'Ilustração de bento Bentoo — fig. 01',
    svgWidthText: 'L = 189,7 mm',
    metaHtml: '! LANÇAMENTO · <b>PING</b> · DISPARO ÚNICO',
    footerLeftHtml:
      '© 2018 – 2026 · <span class="sig"><em>bentoo<span class="dot">.</span></em></span> · feito à mão, código-fonte primeiro',
    footerCenter: 'BENTOO / PROJETO / DIVISÃO TÉCNICA',
    footerStamp: 'APROVADO · R.L.',
    footerRight: 'FIM DO DOCUMENTO · 完',
  },
  es: {
    title: 'BENTOO — MANUAL TÉCNICO · BTO-001',
    description:
      'Bentoo es un Stage5 fácil de usar de Gentoo Linux — una distribución de escritorio que viene precompilada, preconfigurada y lista para arrancar.',
    classified: 'PRÓXIMAMENTE',
    sheet: 'HOJA 01/01',
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
    subTaglineHtml: 'Un <em>Stage5</em> fácil de usar de Gentoo Linux.',
    ledeHtml:
      'Bentoo es un escritorio Linux basado en código fuente que lleva la filosofía de instalación por etapas de Gentoo a su conclusión natural: <b>Stage5</b> — un sistema precompilado, preconfigurado y listo para usar a diario. Conserva la potencia de Portage y el rigor de las compilaciones de código fuente, a la vez que te ofrece un escritorio completo desde el primer día.',
    specs: [
      { k: 'RELEASE', v: '0.1.0 · alpha', t: 'AÚN NO COMPILADO' },
      { k: 'VENTANA', v: 'finales de 2026 — o cuando esté listo', t: '~T4' },
      { k: 'BASE', v: 'gentoo · código fuente primero', t: 'GPL-2.0' },
      { k: 'ARCH', v: 'x86-64-v3 · -O2 -pipe', t: 'RÁPIDO' },
      { k: 'COCINA', v: 'Brasil · 東京', t: 'UTC-3' },
    ],
    btnSource: 'Código fuente · GitHub',
    btnContact: 'Contacto',
    btnNotify: 'Avísame',
    cornerLabelTL: 'FIG. 01 — MARCA PRIMARIA',
    cornerLabelBL: 'ESCALA 1:1',
    cornerLabelBR: 'SECCIÓN A-A',
    svgAriaLabel: 'Ilustración de bento Bentoo — fig. 01',
    svgWidthText: 'L = 189,7 mm',
    metaHtml: '! LANZAMIENTO · <b>PING</b> · DISPARO ÚNICO',
    footerLeftHtml:
      '© 2018 – 2026 · <span class="sig"><em>bentoo<span class="dot">.</span></em></span> · hecho a mano, código fuente primero',
    footerCenter: 'BENTOO / PROYECTO / DIVISIÓN TÉCNICA',
    footerStamp: 'APROBADO · R.L.',
    footerRight: 'FIN DEL DOCUMENTO · 完',
  },
  ru: {
    title: 'BENTOO — ТЕХНИЧЕСКОЕ РУКОВОДСТВО · BTO-001',
    description: 'Bentoo — удобный Stage5 Gentoo Linux: десктопный дистрибутив, который поставляется уже скомпилированным, настроенным и готовым к загрузке.',
    classified: 'СКОРО',
    sheet: 'ЛИСТ 01/01',
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
    subTaglineHtml: 'Удобный <em>Stage5</em> Gentoo Linux.',
    ledeHtml: 'Bentoo — Linux-десктоп на основе исходного кода, который доводит философию поэтапной установки Gentoo до логического завершения: <b>Stage5</b> — заранее скомпилированная, заранее настроенная система, готовая к повседневной работе. Он сохраняет мощь Portage и строгость сборки из исходников и при этом с первого дня даёт вам полноценный рабочий стол.',
    specs: [
      { k: 'RELEASE', v: '0.1.0 · alpha', t: 'ЕЩЁ НЕ СОБРАН' },
      { k: 'СРОК', v: 'конец 2026 — или когда будет готово', t: '~4 КВ.' },
      { k: 'BASE', v: 'gentoo · исходники прежде всего', t: 'GPL-2.0' },
      { k: 'ARCH', v: 'x86-64-v3 · -O2 -pipe', t: 'БЫСТРО' },
      { k: 'КУХНЯ', v: 'Бразилия · 東京', t: 'UTC-3' },
    ],
    btnSource: 'Исходники · GitHub',
    btnContact: 'Контакты',
    btnNotify: 'Уведомить меня',
    cornerLabelTL: 'РИС. 01 — ОСНОВНОЙ ЗНАК',
    cornerLabelBL: 'МАСШТАБ 1:1',
    cornerLabelBR: 'РАЗРЕЗ А-А',
    svgAriaLabel: 'Иллюстрация бэнто Bentoo — рис. 01',
    svgWidthText: 'Ш = 189,7 мм',
    metaHtml: '! РЕЛИЗ · <b>ПИНГ</b> · ОДНОКРАТНО',
    footerLeftHtml: '© 2018 – 2026 · <span class="sig"><em>bentoo<span class="dot">.</span></em></span> · ручная работа, исходники прежде всего',
    footerCenter: 'BENTOO / ПРОЕКТ / ТЕХНИЧЕСКИЙ ОТДЕЛ',
    footerStamp: 'УТВЕРЖДЕНО · R.L.',
    footerRight: 'КОНЕЦ ДОКУМЕНТА · 完',
  },
  zh: {
    title: 'BENTOO — 技术手册 · BTO-001',
    description: 'Bentoo 是易于上手的 Gentoo Linux Stage5 —— 一款预编译、预配置、开机即用的桌面发行版。',
    classified: '即将推出',
    sheet: '第 01/01 页',
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
    subTaglineHtml: '易于上手的 Gentoo Linux <em>Stage5</em>。',
    ledeHtml: 'Bentoo 是一款基于源码的 Linux 桌面，它把 Gentoo 分阶段安装的理念推向自然的终点：<b>Stage5</b> —— 一个预编译、预配置、可日常使用的系统。它保留了 Portage 的强大与源码构建的严谨，同时从第一天起就交给你一个完整的桌面。',
    specs: [
      { k: 'RELEASE', v: '0.1.0 · alpha', t: '尚未编译' },
      { k: '窗口期', v: '2026 年底 —— 或者准备好的时候', t: '~第四季度' },
      { k: 'BASE', v: 'gentoo · 源码优先', t: 'GPL-2.0' },
      { k: 'ARCH', v: 'x86-64-v3 · -O2 -pipe', t: '快' },
      { k: '厨房', v: '巴西 · 東京', t: 'UTC-3' },
    ],
    btnSource: '源码 · GitHub',
    btnContact: '联系',
    btnNotify: '通知我',
    cornerLabelTL: '图 01 — 主标志',
    cornerLabelBL: '比例 1:1',
    cornerLabelBR: '剖面 A-A',
    svgAriaLabel: 'Bentoo 便当插图 — 图 01',
    svgWidthText: 'W = 189.7 mm',
    metaHtml: '! 发布 · <b>PING</b> · 仅一次',
    footerLeftHtml: '© 2018 – 2026 · <span class="sig"><em>bentoo<span class="dot">.</span></em></span> · 手工打造，源码优先',
    footerCenter: 'BENTOO / 项目 / 技术部',
    footerStamp: '已批准 · R.L.',
    footerRight: '文档结束 · 完',
  },
};
