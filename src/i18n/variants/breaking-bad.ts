import type { Lang } from '~/utils/getLang';

export interface BreakingBadElement {
  num: string;
  sym: string;
  name: string;
  mass: string;
}

export interface BreakingBadQuote {
  name: string;
  role: string;
  qHtml: string;
}

export interface BreakingBadContent {
  title: string;
  description: string;
  brandAriaLabel: string;
  nav: {
    landing: string;
    science: string;
    install: string;
    community: string;
    about: string;
  };
  scrollerSpans: string[];
  elements: BreakingBadElement[];
  taglineHtml: string;
  quotes: {
    walt: BreakingBadQuote;
    jesse: BreakingBadQuote;
    saul: BreakingBadQuote;
    gus: BreakingBadQuote;
  };
  miniMenu: {
    githubLabel: string;
    contactLabel: string;
    notifyLabel: string;
  };
  cookNoteHtml: string;
  footerCopyHtml: string;
}

export const breakingBad: Record<Lang, BreakingBadContent> = {
  en: {
    title: 'bentoo — say my name · 99.1% pure stage5',
    description:
      'Bentoo — a Linux distribution for the masses. Say my name. I am the one who compiles.',
    brandAriaLabel: 'bentoo home',
    nav: {
      landing: 'LANDING',
      science: 'SCIENCE',
      install: 'INSTALL',
      community: 'COMMUNITY',
      about: 'ABOUT',
    },
    scrollerSpans: [
      '99.1% PURE',
      'SAY MY NAME',
      'YEAH SCIENCE, BITCH',
      'BETTER CALL SAUL',
      'LOS POLLOS HERMANOS',
      'I AM THE ONE WHO COMPILES',
      'FOLLOW THE MONEY',
      'TREAD LIGHTLY',
    ],
    elements: [
      { num: '5', sym: 'B', name: 'Boron', mass: '10.811' },
      { num: '99', sym: 'Es', name: 'Einsteinium', mass: '[252]' },
      { num: '7', sym: 'N', name: 'Nitrogen', mass: '14.007' },
      { num: '22', sym: 'Ti', name: 'Titanium', mass: '47.867' },
      { num: '8', sym: 'O', name: 'Oxygen', mass: '15.999' },
      { num: '8', sym: 'O', name: 'Oxygen', mass: '15.999' },
    ],
    taglineHtml: 'A USER-FRIENDLY <b>STAGE5</b> OF GENTOO LINUX',
    quotes: {
      walt: {
        name: 'Walter H. White',
        role: 'Chemistry Teacher · Heisenberg',
        qHtml:
          '"I am not in danger, Skyler. I <em>am</em> the danger. I am the one who <em>compiles</em>."',
      },
      jesse: {
        name: 'Jesse Pinkman',
        role: 'Apprentice · "yo bitch"',
        qHtml:
          '"Yeah <em>science</em>, Mr. White! Source-based, yo! Rolling release, bitch!"',
      },
      saul: {
        name: 'Saul Goodman',
        role: "Criminal Lawyer · S'all good",
        qHtml:
          '"Better <em>call</em> Bentoo. Free consultations. Ebuilds filed same day."',
      },
      gus: {
        name: 'Gustavo "Gus" Fring',
        role: 'Los Pollos · distribution',
        qHtml:
          '"We are <em>not</em> the same. Our mirrors are faster. Our repos cleaner."',
      },
    },
    miniMenu: {
      githubLabel: 'GITHUB',
      contactLabel: 'CONTACT',
      notifyLabel: 'NOTIFY ME',
    },
    cookNoteHtml:
      '▸ <b>99.1% pure</b> · single-shot ping · no newsletter · <em>tread lightly</em>',
    footerCopyHtml:
      '© 2024 <b>BENTOO</b> · A LINUX DISTRIBUTION FOR THE MASSES · ALBUQUERQUE, NM',
  },
  pt: {
    title: 'bentoo — say my name · stage5 99,1% puro',
    description:
      'Bentoo — uma distribuição Linux para as massas. Say my name. Eu sou aquele que compila.',
    brandAriaLabel: 'bentoo início',
    nav: {
      landing: 'INÍCIO',
      science: 'CIÊNCIA',
      install: 'INSTALAR',
      community: 'COMUNIDADE',
      about: 'SOBRE',
    },
    scrollerSpans: [
      '99,1% PURO',
      'SAY MY NAME',
      'YEAH SCIENCE, BITCH',
      'BETTER CALL SAUL',
      'LOS POLLOS HERMANOS',
      'I AM THE ONE WHO COMPILES',
      'SIGA O DINHEIRO',
      'TREAD LIGHTLY',
    ],
    elements: [
      { num: '5', sym: 'B', name: 'Boro', mass: '10.811' },
      { num: '99', sym: 'Es', name: 'Einstênio', mass: '[252]' },
      { num: '7', sym: 'N', name: 'Nitrogênio', mass: '14.007' },
      { num: '22', sym: 'Ti', name: 'Titânio', mass: '47.867' },
      { num: '8', sym: 'O', name: 'Oxigênio', mass: '15.999' },
      { num: '8', sym: 'O', name: 'Oxigênio', mass: '15.999' },
    ],
    taglineHtml: 'UM <b>STAGE5</b> AMIGÁVEL DO GENTOO LINUX',
    quotes: {
      walt: {
        name: 'Walter H. White',
        role: 'Professor de Química · Heisenberg',
        qHtml:
          '"Eu não estou em perigo, Skyler. Eu <em>sou</em> o perigo. Eu sou aquele que <em>compila</em>."',
      },
      jesse: {
        name: 'Jesse Pinkman',
        role: 'Aprendiz · "yo bitch"',
        qHtml:
          '"É <em>ciência</em>, Sr. White! Baseado em código-fonte, yo! Rolling release, bitch!"',
      },
      saul: {
        name: 'Saul Goodman',
        role: "Advogado Criminal · S'all good",
        qHtml:
          '"Better <em>call</em> Bentoo. Consultas grátis. Ebuilds protocolados no mesmo dia."',
      },
      gus: {
        name: 'Gustavo "Gus" Fring',
        role: 'Los Pollos · distribuição',
        qHtml:
          '"Nós <em>não</em> somos iguais. Nossos espelhos são mais rápidos. Nossos repos mais limpos."',
      },
    },
    miniMenu: {
      githubLabel: 'GITHUB',
      contactLabel: 'CONTATO',
      notifyLabel: 'ME AVISE',
    },
    cookNoteHtml:
      '▸ <b>99,1% puro</b> · ping único · sem newsletter · <em>tread lightly</em>',
    footerCopyHtml:
      '© 2024 <b>BENTOO</b> · UMA DISTRIBUIÇÃO LINUX PARA AS MASSAS · ALBUQUERQUE, NM',
  },
  es: {
    title: 'bentoo — say my name · stage5 99,1% puro',
    description:
      'Bentoo — una distribución Linux para las masas. Say my name. Soy el que compila.',
    brandAriaLabel: 'bentoo inicio',
    nav: {
      landing: 'INICIO',
      science: 'CIENCIA',
      install: 'INSTALAR',
      community: 'COMUNIDAD',
      about: 'ACERCA DE',
    },
    scrollerSpans: [
      '99,1% PURO',
      'SAY MY NAME',
      'YEAH SCIENCE, BITCH',
      'BETTER CALL SAUL',
      'LOS POLLOS HERMANOS',
      'I AM THE ONE WHO COMPILES',
      'SIGA EL DINERO',
      'TREAD LIGHTLY',
    ],
    elements: [
      { num: '5', sym: 'B', name: 'Boro', mass: '10.811' },
      { num: '99', sym: 'Es', name: 'Einstenio', mass: '[252]' },
      { num: '7', sym: 'N', name: 'Nitrógeno', mass: '14.007' },
      { num: '22', sym: 'Ti', name: 'Titanio', mass: '47.867' },
      { num: '8', sym: 'O', name: 'Oxígeno', mass: '15.999' },
      { num: '8', sym: 'O', name: 'Oxígeno', mass: '15.999' },
    ],
    taglineHtml: 'UN <b>STAGE5</b> FÁCIL DE USAR DE GENTOO LINUX',
    quotes: {
      walt: {
        name: 'Walter H. White',
        role: 'Profesor de Química · Heisenberg',
        qHtml:
          '«No estoy en peligro, Skyler. Yo <em>soy</em> el peligro. Yo soy el que <em>compila</em>.»',
      },
      jesse: {
        name: 'Jesse Pinkman',
        role: 'Aprendiz · «yo bitch»',
        qHtml:
          '«¡Es <em>ciencia</em>, Sr. White! ¡Basado en código fuente, yo! ¡Rolling release, bitch!»',
      },
      saul: {
        name: 'Saul Goodman',
        role: "Abogado Penal · S'all good",
        qHtml:
          '«Better <em>call</em> Bentoo. Consultas gratuitas. Ebuilds registrados el mismo día.»',
      },
      gus: {
        name: 'Gustavo "Gus" Fring',
        role: 'Los Pollos · distribución',
        qHtml:
          '«<em>No</em> somos iguales. Nuestros espejos son más rápidos. Nuestros repositorios más limpios.»',
      },
    },
    miniMenu: {
      githubLabel: 'GITHUB',
      contactLabel: 'CONTACTO',
      notifyLabel: 'AVÍSAME',
    },
    cookNoteHtml:
      '▸ <b>99,1% puro</b> · ping único · sin boletín · <em>tread lightly</em>',
    footerCopyHtml:
      '© 2024 <b>BENTOO</b> · UNA DISTRIBUCIÓN LINUX PARA LAS MASAS · ALBUQUERQUE, NM',
  },
};
