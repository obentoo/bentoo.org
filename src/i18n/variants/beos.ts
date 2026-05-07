import type { Lang } from '~/utils/getLang';

export interface BeosVolumeRow {
  labelHtml: string;
  status: string;
}

export interface BeosContent {
  title: string;
  description: string;
  brandAriaLabel: string;
  winSubLeft: string;
  winSubRight: string;
  stepPill: string;
  taglineHtml: string;
  ledeHtml: string;
  volumes: [BeosVolumeRow, BeosVolumeRow, BeosVolumeRow];
  progressLabel: string;
  actionBack: string;
  actionSource: string;
  actionContact: string;
  actionNotify: string;
  statusBarOk: string;
  noteHtml: string;
  footerHandcrafted: string;
}

export const beos: Record<Lang, BeosContent> = {
  en: {
    title: 'bentoo — BeOS install wizard',
    description: 'Bentoo is a user-friendly Stage5 of Gentoo Linux.',
    brandAriaLabel: 'bentoo home',
    winSubLeft: 'bentoo-install · step 2 of 4 · SELECT VOLUME',
    winSubRight: 'BFS journal · OK',
    stepPill: 'STEP 2/4 · SELECT TARGET',
    taglineHtml: 'A user-friendly <em>Stage5</em> of Gentoo Linux.',
    ledeHtml:
      'The installer will copy <em>Bentoo 0.1.0-alpha</em> to your selected volume. <b>Bentoo</b> is a <em>source-based</em> Linux desktop — a <b>Stage5</b> of Gentoo. Pre-compiled, pre-configured, Portage still under the hood.',
    volumes: [
      {
        labelHtml: '<b>/dev/sda2</b> · bentoo-root · BFS · 40.0 GB · <em>ready</em>',
        status: 'SELECTED',
      },
      {
        labelHtml: '/dev/sda1 · BeOS 5 PE · BFS · 10.0 GB · system',
        status: 'SKIP',
      },
      {
        labelHtml: '/dev/sda3 · home · BFS · 180 GB · personal',
        status: 'KEEP',
      },
    ],
    progressLabel: 'Stage5 packages · 47% · ETA late 2026',
    actionBack: '< Back',
    actionSource: 'Source',
    actionContact: 'Contact',
    actionNotify: 'Notify me',
    statusBarOk: 'READY',
    noteHtml:
      'RELEASE PING · <b>ONE-SHOT</b> · NO NEWSLETTER · UNSUBSCRIBE BUILT-IN',
    footerHandcrafted: 'HANDCRAFTED · SOURCE-FIRST',
  },
  pt: {
    title: 'bentoo — assistente de instalação BeOS',
    description: 'Bentoo é um Stage5 amigável do Gentoo Linux.',
    brandAriaLabel: 'bentoo início',
    winSubLeft: 'bentoo-install · passo 2 de 4 · SELECIONAR VOLUME',
    winSubRight: 'BFS journal · OK',
    stepPill: 'PASSO 2/4 · SELECIONAR DESTINO',
    taglineHtml: 'Um <em>Stage5</em> amigável do Gentoo Linux.',
    ledeHtml:
      'O instalador vai copiar o <em>Bentoo 0.1.0-alpha</em> para o volume selecionado. O <b>Bentoo</b> é um desktop Linux <em>baseado em fontes</em> — um <b>Stage5</b> do Gentoo. Pré-compilado, pré-configurado, com o Portage ainda por baixo do capô.',
    volumes: [
      {
        labelHtml: '<b>/dev/sda2</b> · bentoo-root · BFS · 40.0 GB · <em>pronto</em>',
        status: 'SELECIONADO',
      },
      {
        labelHtml: '/dev/sda1 · BeOS 5 PE · BFS · 10.0 GB · sistema',
        status: 'IGNORAR',
      },
      {
        labelHtml: '/dev/sda3 · home · BFS · 180 GB · pessoal',
        status: 'MANTER',
      },
    ],
    progressLabel: 'Pacotes Stage5 · 47% · previsão fim de 2026',
    actionBack: '< Voltar',
    actionSource: 'Código',
    actionContact: 'Contato',
    actionNotify: 'Me avise',
    statusBarOk: 'PRONTO',
    noteHtml:
      'PING DE LANÇAMENTO · <b>ÚNICO</b> · SEM NEWSLETTER · DESCADASTRO INCLUÍDO',
    footerHandcrafted: 'FEITO À MÃO · CÓDIGO ABERTO',
  },
  es: {
    title: 'bentoo — asistente de instalación BeOS',
    description: 'Bentoo es un Stage5 fácil de usar de Gentoo Linux.',
    brandAriaLabel: 'bentoo inicio',
    winSubLeft: 'bentoo-install · paso 2 de 4 · SELECCIONAR VOLUMEN',
    winSubRight: 'BFS journal · OK',
    stepPill: 'PASO 2/4 · SELECCIONAR DESTINO',
    taglineHtml: 'Un <em>Stage5</em> fácil de usar de Gentoo Linux.',
    ledeHtml:
      'El instalador copiará <em>Bentoo 0.1.0-alpha</em> en el volumen seleccionado. <b>Bentoo</b> es un escritorio Linux <em>basado en fuentes</em> — un <b>Stage5</b> de Gentoo. Precompilado, preconfigurado y con Portage bajo el capó.',
    volumes: [
      {
        labelHtml: '<b>/dev/sda2</b> · bentoo-root · BFS · 40.0 GB · <em>listo</em>',
        status: 'SELECCIONADO',
      },
      {
        labelHtml: '/dev/sda1 · BeOS 5 PE · BFS · 10.0 GB · sistema',
        status: 'IGNORAR',
      },
      {
        labelHtml: '/dev/sda3 · home · BFS · 180 GB · personal',
        status: 'MANTENER',
      },
    ],
    progressLabel: 'Paquetes Stage5 · 47% · previsión finales de 2026',
    actionBack: '< Volver',
    actionSource: 'Código',
    actionContact: 'Contacto',
    actionNotify: 'Avísame',
    statusBarOk: 'LISTO',
    noteHtml:
      'PING DE LANZAMIENTO · <b>ÚNICO</b> · SIN BOLETÍN · BAJA INTEGRADA',
    footerHandcrafted: 'HECHO A MANO · CÓDIGO ABIERTO',
  },
};
