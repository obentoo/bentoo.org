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
};
