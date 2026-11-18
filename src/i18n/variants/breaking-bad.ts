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
  ru: {
    title: 'bentoo — назови моё имя · Stage5 чистотой 99,1%',
    description: 'Bentoo — дистрибутив Linux для масс. Назови моё имя. Я тот, кто компилирует.',
    brandAriaLabel: 'bentoo — главная',
    nav: {
      landing: 'ГЛАВНАЯ',
      science: 'НАУКА',
      install: 'УСТАНОВКА',
      community: 'СООБЩЕСТВО',
      about: 'О ПРОЕКТЕ',
    },
    scrollerSpans: [
      'ЧИСТОТА 99,1%',
      'НАЗОВИ МОЁ ИМЯ',
      'ДА, НАУКА, СУЧКА',
      'ЛУЧШЕ ЗВОНИТЕ СОЛУ',
      'LOS POLLOS HERMANOS',
      'Я ТОТ, КТО КОМПИЛИРУЕТ',
      'СЛЕДУЙ ЗА ДЕНЬГАМИ',
      'НЕ ИСКУШАЙ СУДЬБУ',
    ],
    elements: [
      { num: '5', sym: 'B', name: 'Бор', mass: '10.811' },
      { num: '99', sym: 'Es', name: 'Эйнштейний', mass: '[252]' },
      { num: '7', sym: 'N', name: 'Азот', mass: '14.007' },
      { num: '22', sym: 'Ti', name: 'Титан', mass: '47.867' },
      { num: '8', sym: 'O', name: 'Кислород', mass: '15.999' },
      { num: '8', sym: 'O', name: 'Кислород', mass: '15.999' },
    ],
    taglineHtml: 'УДОБНЫЙ <b>STAGE5</b> GENTOO LINUX',
    quotes: {
      walt: {
        name: 'Walter H. White',
        role: 'Учитель химии · Хайзенберг',
        qHtml: '«Я не в опасности, Скайлер. Я <em>и есть</em> опасность. Я тот, кто <em>компилирует</em>».',
      },
      jesse: {
        name: 'Jesse Pinkman',
        role: 'Ученик · «йоу, сучка»',
        qHtml: '«Да, <em>наука</em>, мистер Уайт! Из исходников, йоу! Rolling release, сучка!»',
      },
      saul: {
        name: 'Saul Goodman',
        role: 'Адвокат по уголовным делам · Всё ништяк',
        qHtml: '«Лучше <em>звоните</em> Bentoo. Бесплатные консультации. Ebuild — в день обращения».',
      },
      gus: {
        name: 'Gustavo "Gus" Fring',
        role: 'Los Pollos · дистрибуция',
        qHtml: '«Мы <em>не</em> одинаковые. Наши зеркала быстрее. Наши репозитории чище».',
      },
    },
    miniMenu: { githubLabel: 'GITHUB', contactLabel: 'КОНТАКТЫ', notifyLabel: 'УВЕДОМИТЬ МЕНЯ' },
    cookNoteHtml: '▸ <b>чистота 99,1%</b> · один-единственный пинг · без рассылки · <em>не искушай судьбу</em>',
    footerCopyHtml: '© 2024 <b>BENTOO</b> · ДИСТРИБУТИВ LINUX ДЛЯ МАСС · АЛЬБУКЕРКЕ, НЬЮ-МЕКСИКО',
  },
  zh: {
    title: 'bentoo — 说出我的名字 · 纯度 99.1% 的 stage5',
    description: 'Bentoo —— 面向大众的 Linux 发行版。说出我的名字。我就是那个编译的人。',
    brandAriaLabel: 'bentoo 首页',
    nav: { landing: '首页', science: '科学', install: '安装', community: '社区', about: '关于' },
    scrollerSpans: [
      '纯度 99.1%',
      '说出我的名字',
      '耶，科学，贱人',
      '风骚律师',
      'LOS POLLOS HERMANOS',
      '我就是那个编译的人',
      '跟着钱走',
      '小心行事',
    ],
    elements: [
      { num: '5', sym: 'B', name: '硼', mass: '10.811' },
      { num: '99', sym: 'Es', name: '锿', mass: '[252]' },
      { num: '7', sym: 'N', name: '氮', mass: '14.007' },
      { num: '22', sym: 'Ti', name: '钛', mass: '47.867' },
      { num: '8', sym: 'O', name: '氧', mass: '15.999' },
      { num: '8', sym: 'O', name: '氧', mass: '15.999' },
    ],
    taglineHtml: '易于上手的 GENTOO LINUX <b>STAGE5</b>',
    quotes: {
      walt: {
        name: 'Walter H. White',
        role: '化学老师 · 海森堡',
        qHtml: '“我没有身处危险，斯凯勒。我<em>就是</em>危险。我就是那个<em>编译</em>的人。”',
      },
      jesse: {
        name: 'Jesse Pinkman',
        role: '徒弟 · “yo bitch”',
        qHtml: '“耶，<em>科学</em>，怀特先生！基于源码，yo！Rolling release，贱人！”',
      },
      saul: {
        name: 'Saul Goodman',
        role: '刑事律师 · 一切都好',
        qHtml: '“最好<em>找</em> Bentoo。免费咨询。Ebuild 当天提交。”',
      },
      gus: {
        name: 'Gustavo "Gus" Fring',
        role: 'Los Pollos · 分销',
        qHtml: '“我们<em>不</em>一样。我们的镜像更快。我们的仓库更干净。”',
      },
    },
    miniMenu: { githubLabel: 'GITHUB', contactLabel: '联系', notifyLabel: '通知我' },
    cookNoteHtml: '▸ <b>纯度 99.1%</b> · 仅一次提醒 · 不发新闻邮件 · <em>小心行事</em>',
    footerCopyHtml: '© 2024 <b>BENTOO</b> · 面向大众的 LINUX 发行版 · 新墨西哥州阿尔伯克基',
  },
};
