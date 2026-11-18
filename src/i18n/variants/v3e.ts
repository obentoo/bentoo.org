import type { Lang } from '~/utils/getLang';

export interface V3eSpecRow {
  k: string;
  v: string;
  t: string;
}

export interface V3eContent {
  title: string;
  description: string;
  madeIn: string;
  cat: string;
  sideA: string;
  taglineHtml: string;
  ledeHtml: string;
  specs: V3eSpecRow[];
  btnSourceHtml: string;
  btnContactHtml: string;
  btnNotifyHtml: string;
  pinContacts: string;
  copyrightLine: string;
  notifyLabelHtml: string;
  footerCopyHtml: string;
}

export const v3e: Record<Lang, V3eContent> = {
  en: {
    title: 'BENTOO · ベントー — ARCADE LINUX CARTRIDGE',
    description: 'Bentoo is a user-friendly Stage5 of Gentoo Linux.',
    madeIn: 'MADE IN BRAZIL · JP',
    cat: 'ARCADE LINUX CARTRIDGE',
    sideA: 'SIDE A · FOR COMPUTER USE ONLY',
    taglineHtml: 'A user-friendly <em>Stage5</em> of Gentoo Linux.',
    ledeHtml:
      '<em>Source-based</em> Linux, shipped like a cartridge — insert, boot, play. <b>Stage5</b> of Gentoo: pre-compiled, pre-configured, Portage intact underneath.',
    specs: [
      { k: 'RELEASE', v: '0.1.0 · alpha', t: 'YET TO COMPILE' },
      { k: 'CHANNEL', v: 'rolling · emerge --sync', t: 'LIVE' },
      { k: 'ARCH', v: 'x86-64-v3 · -O2 -pipe', t: 'FAST' },
      { k: 'LICENSE', v: 'GPL-2.0-or-later', t: 'LIBRE' },
      { k: 'KITCHEN', v: 'Brazil ⇄ 東京', t: 'UTC-3' },
    ],
    btnSourceHtml: 'SOURCE <span class="arr">→</span>',
    btnContactHtml: 'CONTACT <span class="arr">→</span>',
    btnNotifyHtml: 'NOTIFY ME <span class="arr">→</span>',
    pinContacts: 'PIN CONTACTS',
    copyrightLine: 'BTO-001/A · © 2018–2026 BENTOO PROJECT',
    notifyLabelHtml: 'NOTIFY ME<b>RELEASE PING · ONE-SHOT</b>',
    footerCopyHtml:
      '© 2018 – 2026 <em>BENTOO.</em> · HANDCRAFTED, SOURCE-FIRST',
  },
  pt: {
    title: 'BENTOO · ベントー — CARTUCHO DE LINUX ARCADE',
    description: 'Bentoo é um Stage5 amigável do Gentoo Linux.',
    madeIn: 'FEITO NO BRASIL · JP',
    cat: 'CARTUCHO DE LINUX ARCADE',
    sideA: 'LADO A · APENAS PARA USO EM COMPUTADOR',
    taglineHtml: 'Um <em>Stage5</em> amigável do Gentoo Linux.',
    ledeHtml:
      'Linux <em>baseado em código-fonte</em>, entregue como um cartucho — insira, bootar, jogar. <b>Stage5</b> do Gentoo: pré-compilado, pré-configurado, Portage intacto por baixo.',
    specs: [
      { k: 'RELEASE', v: '0.1.0 · alpha', t: 'AINDA NÃO COMPILADO' },
      { k: 'CANAL', v: 'rolling · emerge --sync', t: 'AO VIVO' },
      { k: 'ARCH', v: 'x86-64-v3 · -O2 -pipe', t: 'RÁPIDO' },
      { k: 'LICENÇA', v: 'GPL-2.0-or-later', t: 'LIVRE' },
      { k: 'COZINHA', v: 'Brasil ⇄ 東京', t: 'UTC-3' },
    ],
    btnSourceHtml: 'FONTE <span class="arr">→</span>',
    btnContactHtml: 'CONTATO <span class="arr">→</span>',
    btnNotifyHtml: 'ME AVISE <span class="arr">→</span>',
    pinContacts: 'PINOS DE CONTATO',
    copyrightLine: 'BTO-001/A · © 2018–2026 PROJETO BENTOO',
    notifyLabelHtml: 'ME AVISE<b>PING DE LANÇAMENTO · DISPARO ÚNICO</b>',
    footerCopyHtml:
      '© 2018 – 2026 <em>BENTOO.</em> · FEITO À MÃO, CÓDIGO-FONTE PRIMEIRO',
  },
  es: {
    title: 'BENTOO · ベントー — CARTUCHO DE LINUX ARCADE',
    description: 'Bentoo es un Stage5 fácil de usar de Gentoo Linux.',
    madeIn: 'HECHO EN BRASIL · JP',
    cat: 'CARTUCHO DE LINUX ARCADE',
    sideA: 'LADO A · SOLO PARA USO EN COMPUTADOR',
    taglineHtml: 'Un <em>Stage5</em> fácil de usar de Gentoo Linux.',
    ledeHtml:
      'Linux <em>basado en código fuente</em>, entregado como un cartucho — inserta, arranca, juega. <b>Stage5</b> de Gentoo: precompilado, preconfigurado, Portage intacto debajo.',
    specs: [
      { k: 'RELEASE', v: '0.1.0 · alpha', t: 'AÚN NO COMPILADO' },
      { k: 'CANAL', v: 'rolling · emerge --sync', t: 'EN DIRECTO' },
      { k: 'ARCH', v: 'x86-64-v3 · -O2 -pipe', t: 'RÁPIDO' },
      { k: 'LICENCIA', v: 'GPL-2.0-or-later', t: 'LIBRE' },
      { k: 'COCINA', v: 'Brasil ⇄ 東京', t: 'UTC-3' },
    ],
    btnSourceHtml: 'CÓDIGO <span class="arr">→</span>',
    btnContactHtml: 'CONTACTO <span class="arr">→</span>',
    btnNotifyHtml: 'AVÍSAME <span class="arr">→</span>',
    pinContacts: 'PINES DE CONTACTO',
    copyrightLine: 'BTO-001/A · © 2018–2026 PROYECTO BENTOO',
    notifyLabelHtml: 'AVÍSAME<b>PING DE LANZAMIENTO · DISPARO ÚNICO</b>',
    footerCopyHtml:
      '© 2018 – 2026 <em>BENTOO.</em> · HECHO A MANO, CÓDIGO FUENTE PRIMERO',
  },
  ru: {
    title: 'BENTOO · ベントー — АРКАДНЫЙ LINUX-КАРТРИДЖ',
    description: 'Bentoo — удобный Stage5 Gentoo Linux.',
    madeIn: 'СДЕЛАНО В БРАЗИЛИИ · JP',
    cat: 'АРКАДНЫЙ LINUX-КАРТРИДЖ',
    sideA: 'СТОРОНА A · ТОЛЬКО ДЛЯ КОМПЬЮТЕРА',
    taglineHtml: 'Удобный <em>Stage5</em> Gentoo Linux.',
    ledeHtml: 'Linux <em>на основе исходного кода</em>, который поставляется как картридж: вставил, загрузил, играешь. <b>Stage5</b> Gentoo: заранее скомпилирован, заранее настроен, внутри — нетронутый Portage.',
    specs: [
      { k: 'RELEASE', v: '0.1.0 · alpha', t: 'ЕЩЁ НЕ СОБРАН' },
      { k: 'КАНАЛ', v: 'rolling · emerge --sync', t: 'В ЭФИРЕ' },
      { k: 'ARCH', v: 'x86-64-v3 · -O2 -pipe', t: 'БЫСТРО' },
      { k: 'ЛИЦЕНЗИЯ', v: 'GPL-2.0-or-later', t: 'СВОБОДНАЯ' },
      { k: 'КУХНЯ', v: 'Бразилия ⇄ 東京', t: 'UTC-3' },
    ],
    btnSourceHtml: 'ИСХОДНИКИ <span class="arr">→</span>',
    btnContactHtml: 'КОНТАКТЫ <span class="arr">→</span>',
    btnNotifyHtml: 'УВЕДОМИТЬ МЕНЯ <span class="arr">→</span>',
    pinContacts: 'КОНТАКТЫ НА ВЫВОДАХ',
    copyrightLine: 'BTO-001/A · © 2018–2026 ПРОЕКТ BENTOO',
    notifyLabelHtml: 'УВЕДОМИТЬ МЕНЯ<b>УВЕДОМЛЕНИЕ О РЕЛИЗЕ · ОДНОКРАТНО</b>',
    footerCopyHtml: '© 2018 – 2026 <em>BENTOO.</em> · РУЧНАЯ РАБОТА, ИСХОДНИКИ ПРЕЖДЕ ВСЕГО',
  },
  zh: {
    title: 'BENTOO · ベントー — 街机 LINUX 卡带',
    description: 'Bentoo 是易于上手的 Gentoo Linux Stage5。',
    madeIn: '巴西制造 · JP',
    cat: '街机 LINUX 卡带',
    sideA: 'A 面 · 仅限电脑使用',
    taglineHtml: '易于上手的 Gentoo Linux <em>Stage5</em>。',
    ledeHtml: '<em>基于源码</em>的 Linux，像卡带一样交付 —— 插入、启动、开玩。Gentoo 的 <b>Stage5</b>：预编译、预配置，底层 Portage 完好。',
    specs: [
      { k: 'RELEASE', v: '0.1.0 · alpha', t: '尚未编译' },
      { k: '频道', v: 'rolling · emerge --sync', t: '直播中' },
      { k: 'ARCH', v: 'x86-64-v3 · -O2 -pipe', t: '快' },
      { k: '许可证', v: 'GPL-2.0-or-later', t: '自由' },
      { k: '厨房', v: '巴西 ⇄ 東京', t: 'UTC-3' },
    ],
    btnSourceHtml: '源码 <span class="arr">→</span>',
    btnContactHtml: '联系 <span class="arr">→</span>',
    btnNotifyHtml: '通知我 <span class="arr">→</span>',
    pinContacts: '针脚触点',
    copyrightLine: 'BTO-001/A · © 2018–2026 BENTOO 项目',
    notifyLabelHtml: '通知我<b>发布提醒 · 仅一次</b>',
    footerCopyHtml: '© 2018 – 2026 <em>BENTOO.</em> · 手工打造，源码优先',
  },
};
