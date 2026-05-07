import type { Lang } from '~/utils/getLang';

export interface V3iJokes {
  new: string;
  open: string;
  save: string;
  print: string;
  exit: string;
  undo: string;
  redo: string;
  copy: string;
  paste: string;
  find: string;
  'view-install': string;
  'view-progress': string;
  'view-terminal': string;
  'zoom-in': string;
  'zoom-out': string;
  'help-topics': string;
  tips: string;
}

export interface V3iShellCmds {
  helpLines: string[];
  dirLines: string[];
  ver: string;
  cd: string;
  timePrefix: string;
  datePrefix: string;
  whoami: string;
  readmeLines: string[];
  releaseLines: string[];
  makeConfLines: string[];
  emergeInfoLines: string[];
  neofetchLines: string[];
  fortuneQuotes: string[];
  bananaLines: string[];
  exitMsg: string;
  shutdownMsg: string;
  formatMsg: string;
  delMsg: string;
  fileNotFoundPrefix: string;
  badCommand: string;
}

export interface V3iSpecRow {
  k: string;
  v: string;
  t: string;
}

export interface V3iContent {
  title: string;
  description: string;
  fileMenuLetter: string;
  fileMenuLabel: string;
  editMenuLetter: string;
  editMenuLabel: string;
  viewMenuLetter: string;
  viewMenuLabel: string;
  helpMenuLetter: string;
  helpMenuLabel: string;
  fileNew: string;
  fileOpen: string;
  fileSave: string;
  filePrint: string;
  fileExit: string;
  editUndo: string;
  editRedo: string;
  editCopy: string;
  editPaste: string;
  editFind: string;
  viewInstall: string;
  viewProgress: string;
  viewZoomIn: string;
  viewZoomOut: string;
  helpTopics: string;
  helpTips: string;
  helpDocs: string;
  helpAbout: string;
  navBack: string;
  navHub: string;
  jokes: V3iJokes;
  aboutTitle: string;
  aboutCloseAria: string;
  aboutVersionLineHtml: string;
  aboutDescriptionHtml: string;
  aboutCopyrightHtml: string;
  aboutFooterMsg: string;
  winMenuFile: string;
  winMenuEdit: string;
  winMenuOptions: string;
  winMenuHelp: string;
  wizWelcomeHtml: string;
  taglineHtml: string;
  ledeHtml: string;
  specs: V3iSpecRow[];
  progressTopLabelHtml: string;
  progressText: string;
  pingLabelHtml: string;
  btnContact: string;
  btnCancel: string;
  msdosTitle: string;
  msdosHelpHint: string;
  inputAriaLabel: string;
  statusReady: string;
  startBtn: string;
  shell: V3iShellCmds;
}

export const v3i: Record<Lang, V3iContent> = {
  en: {
    title: 'bentoo — install.exe',
    description:
      'Bentoo is a user-friendly Stage5 of Gentoo Linux — a desktop distribution that ships pre-compiled, pre-configured, and ready to boot.',
    fileMenuLetter: 'F',
    fileMenuLabel: 'ile',
    editMenuLetter: 'E',
    editMenuLabel: 'dit',
    viewMenuLetter: 'V',
    viewMenuLabel: 'iew',
    helpMenuLetter: 'H',
    helpMenuLabel: 'elp',
    fileNew: 'New setup...',
    fileOpen: 'Open ISO...',
    fileSave: 'Save progress',
    filePrint: 'Print handbook',
    fileExit: 'Exit',
    editUndo: 'Undo',
    editRedo: 'Redo',
    editCopy: 'Copy',
    editPaste: 'Paste',
    editFind: 'Find...',
    viewInstall: 'Install wizard',
    viewProgress: 'Progress',
    viewZoomIn: 'Zoom in',
    viewZoomOut: 'Zoom out',
    helpTopics: 'Help topics',
    helpTips: 'Tips & tricks',
    helpDocs: 'Online docs',
    helpAbout: 'About bentoo...',
    navBack: 'Back to rotator',
    navHub: 'Variation hub',
    jokes: {
      new: 'New setup — you are already installing. Patience.',
      open: 'Open ISO — try emerge instead. It is our way.',
      save: 'Progress saved to ~/.bentoo/state.ini (not really).',
      print: 'No printer found. Print to file? Fax? Windows 95? Nothing works.',
      exit: 'This is a webpage. You cannot exit. You can only close the tab.',
      undo: 'Undo what, exactly? Existence?',
      redo: 'There is no redo. Only emerge --resume.',
      copy: 'Copied: `A user-friendly Stage5 of Gentoo Linux.`',
      paste: 'Pasted nothing. (Nothing to paste.)',
      find: 'Find what? We are still looking for the right release date.',
      'view-install': 'You are looking at it.',
      'view-progress': 'Progress: 47%. Always 47%. It is a philosophy.',
      'view-terminal': 'Terminal is right there. ↓',
      'zoom-in':
        'Zoom with Ctrl+= in your browser. This is a webpage, remember?',
      'zoom-out': 'Zoom with Ctrl+- in your browser.',
      'help-topics': 'Type HELP in the terminal for real commands.',
      tips: 'Tip: try BANANA in the terminal.',
    },
    aboutTitle: 'About bentoo — install.exe',
    aboutCloseAria: 'close',
    aboutVersionLineHtml: 'Version <b>0.1.0-alpha</b> · build 2026.04',
    aboutDescriptionHtml:
      'A <em>user-friendly Stage5</em> of Gentoo Linux — a source-based desktop that ships pre-compiled, pre-configured, and ready to boot.',
    aboutCopyrightHtml:
      'Copyright © 2018 – 2026 <b>bentoo</b> project.<br />Licensed under GPL-2.0-or-later.',
    aboutFooterMsg:
      'This program was written with love, long emerge sessions, and an unreasonable amount of tea.',
    winMenuFile: 'F',
    winMenuEdit: 'E',
    winMenuOptions: 'O',
    winMenuHelp: 'H',
    wizWelcomeHtml: '<em>Welcome to</em> the Bentoo Setup Wizard',
    taglineHtml: 'A user-friendly <em>Stage5</em> of Gentoo Linux.',
    ledeHtml:
      'This program will install a <b>source-based Linux desktop</b> — a <em>Stage5</em> of Gentoo — onto your machine. Every package pre-compiled, every default deliberate. Please close all other applications before continuing.',
    specs: [
      {
        k: 'Version:',
        v: '0.1.0-alpha · rolling',
        t: 'YET TO COMPILE',
      },
      { k: 'Kernel:', v: '6.19.12-LTS · MGLRU', t: 'LINUX' },
      { k: 'Portage:', v: '3.0.65 · ::bentoo overlay', t: 'SOURCE' },
      { k: 'Arch:', v: 'x86-64-v3 · -O2 -pipe', t: 'FAST' },
      { k: 'License:', v: 'GPL-2.0-or-later', t: 'LIBRE' },
    ],
    progressTopLabelHtml: 'Compiling <em>world</em> — ETA: late 2026',
    progressText: '47% · 321 / 680 packages · zero failures',
    pingLabelHtml:
      '<b>[ ! ]</b> <span>ONE-SHOT · NO NEWSLETTER · UNSUBSCRIBE BUILT-IN</span>',
    btnContact: 'Contact',
    btnCancel: 'Cancel',
    msdosTitle: 'Microsoft(R) MS-DOS(R) Version 6.22',
    msdosHelpHint: 'Type <span class="yel">HELP</span> for a list of commands.',
    inputAriaLabel: 'terminal input',
    statusReady: 'Ready',
    startBtn: 'Start',
    shell: {
      helpLines: [
        'BENTOO DOS — available commands',
        '',
        '  <span class="yel">HELP</span>          show this list',
        '  <span class="yel">DIR</span>           list files',
        '  <span class="yel">CD</span>            change directory',
        '  <span class="yel">TYPE</span> &lt;file&gt;  print a text file',
        '  <span class="yel">VER</span>           show version',
        '  <span class="yel">TIME</span>          show current time',
        '  <span class="yel">DATE</span>          show current date',
        '  <span class="yel">EMERGE --INFO</span> show portage config',
        '  <span class="yel">NEOFETCH</span>      system summary',
        '  <span class="yel">WHOAMI</span>        current user',
        '  <span class="yel">FORTUNE</span>       random gentoo wisdom',
        '  <span class="yel">BANANA</span>        🍌',
        '  <span class="yel">CLS</span>           clear screen',
        '  <span class="yel">EXIT</span>          try it',
        '',
        '<span class="pink">hint: ARROWS navigate history · CTRL+L clears</span>',
      ],
      dirLines: [
        ' Volume in drive C is BENTOO',
        ' Directory of C:\\BENTOO',
        '',
        'BOOT         &lt;DIR&gt;    04-20-26  15:23',
        'ETC          &lt;DIR&gt;    04-20-26  15:23',
        'USR          &lt;DIR&gt;    04-20-26  15:23',
        'VAR          &lt;DIR&gt;    04-20-26  15:23',
        'README   TXT     1,248  04-20-26  15:23',
        'RELEASE  INI       512  04-20-26  15:23',
        'MAKE     CONF    2,048  04-20-26  15:23',
        '        7 File(s)     3,808 bytes',
        '                 never-enough bytes free',
      ],
      ver: 'Bentoo DOS Stage5 Extensions, Version 0.1.0-alpha',
      cd: 'C:\\BENTOO',
      timePrefix: 'Current time: ',
      datePrefix: 'Current date: ',
      whoami: 'BENTOO\\ROOT',
      readmeLines: [
        '=== README.TXT ==================================================',
        '',
        '  BENTOO — a user-friendly Stage5 of Gentoo Linux',
        '',
        '  Bentoo is a source-based Linux desktop that extends Gentoo',
        '  staged-install philosophy to its natural conclusion: a',
        '  pre-compiled, pre-configured, daily-usable system.',
        '',
        '  - Portage, unchanged',
        '  - USE flags, unchanged',
        '  - Rolling release',
        '  - -march=x86-64-v3',
        '  - Desktop ready from first boot',
        '',
        '  See you in late 2026.',
        '',
        '=================================================================',
      ],
      releaseLines: [
        '[bentoo]',
        'version=0.1.0-alpha',
        'codename=kitchen-is-open',
        'channel=rolling',
        'arch=x86-64-v3',
        'license=GPL-2.0-or-later',
        'home=https://obentoo.org/',
      ],
      makeConfLines: [
        'CFLAGS="-march=x86-64-v3 -O2 -pipe -fno-plt"',
        'CXXFLAGS="${CFLAGS}"',
        'CHOST="x86_64-pc-linux-gnu"',
        'MAKEOPTS="-j12"',
        'USE="wayland pipewire vulkan X dbus elogind"',
        'ACCEPT_LICENSE="-* @FREE @BINARY-REDISTRIBUTABLE"',
        'PORTDIR_OVERLAY="/var/db/repos/bentoo"',
      ],
      emergeInfoLines: [
        'Portage 3.0.65 (python 3.13.2, default/linux/amd64/17.1/desktop/bentoo, gcc-14.2)',
        'CFLAGS="-march=x86-64-v3 -O2 -pipe -fno-plt"',
        'USE="wayland pipewire vulkan X dbus elogind"',
        'FEATURES="parallel-fetch ebuild-locks sandbox"',
        'source-based Linux desktop · Stage5 · ready-to-boot',
      ],
      neofetchLines: [
        '   <span class="cyan">___           __             </span>   <span class="yel">BENTOO.EXE</span>',
        '  <span class="cyan">/ _ )___ ___  / /____  ___    </span>   ----------',
        ' <span class="cyan">/ _  / -_) _ \\/ __/ _ \\/ _ \\  </span>   OS:   bentoo 0.1.0-alpha',
        '<span class="cyan">/____/\\__/_//_/\\__/\\___/\\___/  </span>   KERN: 6.19.12-LTS',
        '',
        '<span class="pink">弁当 · ベントー</span>             SHELL: bash 5.2',
        '<span class="yel">Stage5 · source-based</span>        ARCH:  x86-64-v3',
      ],
      fortuneQuotes: [
        'Source is law. — unknown maintainer',
        'A well-compiled package is its own reward.',
        'USE flags: a prayer to the compiler.',
        'The only thing a bento and gentoo have in common: discipline.',
        '<span class="pink">静かに煮込み中</span> — simmering, quietly.',
        'Do not emerge --depclean on a Friday.',
      ],
      bananaLines: [
        '      <span class="yel">___</span>',
        "    <span class=\"yel\">.-'   \\</span>",
        '    <span class="yel">|  .-. )</span>',
        '    <span class="yel">| |  | |</span>   <span class="cyan">🍌 banana loaded.</span>',
        "    <span class=\"yel\">| \\`-' |</span>",
        '     <span class="yel">\\___/</span>',
        '<span class="pink">nano banana approves.</span>',
      ],
      exitMsg:
        '<span class="pink">this is a webpage. you cannot exit. you can only close the tab.</span>',
      shutdownMsg: 'Permission denied. Nice try.',
      formatMsg: 'Format what? This is a webpage.',
      delMsg: 'Are you serious? This is a webpage.',
      fileNotFoundPrefix: 'File not found - ',
      badCommand: 'Bad command or file name.',
    },
  },
  pt: {
    title: 'bentoo — install.exe',
    description:
      'Bentoo é um Stage5 amigável do Gentoo Linux — uma distribuição desktop que vem pré-compilada, pré-configurada e pronta para bootar.',
    fileMenuLetter: 'A',
    fileMenuLabel: 'rquivo',
    editMenuLetter: 'E',
    editMenuLabel: 'ditar',
    viewMenuLetter: 'V',
    viewMenuLabel: 'isualizar',
    helpMenuLetter: 'A',
    helpMenuLabel: 'juda',
    fileNew: 'Nova instalação...',
    fileOpen: 'Abrir ISO...',
    fileSave: 'Salvar progresso',
    filePrint: 'Imprimir manual',
    fileExit: 'Sair',
    editUndo: 'Desfazer',
    editRedo: 'Refazer',
    editCopy: 'Copiar',
    editPaste: 'Colar',
    editFind: 'Localizar...',
    viewInstall: 'Assistente de instalação',
    viewProgress: 'Progresso',
    viewZoomIn: 'Aumentar zoom',
    viewZoomOut: 'Diminuir zoom',
    helpTopics: 'Tópicos de ajuda',
    helpTips: 'Dicas e truques',
    helpDocs: 'Docs online',
    helpAbout: 'Sobre o bentoo...',
    navBack: 'Voltar ao rotator',
    navHub: 'Hub de variações',
    jokes: {
      new: 'Nova instalação — você já está instalando. Paciência.',
      open: 'Abrir ISO — tente emerge em vez disso. É o nosso jeito.',
      save: 'Progresso salvo em ~/.bentoo/state.ini (na verdade, não).',
      print:
        'Nenhuma impressora encontrada. Imprimir em arquivo? Fax? Windows 95? Nada funciona.',
      exit: 'Isto é uma página web. Você não pode sair. Só pode fechar a aba.',
      undo: 'Desfazer o quê, exatamente? A existência?',
      redo: 'Não há refazer. Só emerge --resume.',
      copy: 'Copiado: `Um Stage5 amigável do Gentoo Linux.`',
      paste: 'Colado nada. (Nada para colar.)',
      find:
        'Localizar o quê? Ainda estamos procurando a data certa de lançamento.',
      'view-install': 'Você está olhando para ele.',
      'view-progress': 'Progresso: 47%. Sempre 47%. É uma filosofia.',
      'view-terminal': 'O terminal está bem ali. ↓',
      'zoom-in':
        'Zoom com Ctrl+= no seu navegador. Isto é uma página web, lembra?',
      'zoom-out': 'Zoom com Ctrl+- no seu navegador.',
      'help-topics': 'Digite HELP no terminal para comandos reais.',
      tips: 'Dica: experimente BANANA no terminal.',
    },
    aboutTitle: 'Sobre o bentoo — install.exe',
    aboutCloseAria: 'fechar',
    aboutVersionLineHtml: 'Versão <b>0.1.0-alpha</b> · build 2026.04',
    aboutDescriptionHtml:
      'Um <em>Stage5 amigável</em> do Gentoo Linux — um desktop baseado em código-fonte que vem pré-compilado, pré-configurado e pronto para bootar.',
    aboutCopyrightHtml:
      'Copyright © 2018 – 2026 projeto <b>bentoo</b>.<br />Licenciado sob GPL-2.0-or-later.',
    aboutFooterMsg:
      'Este programa foi escrito com carinho, longas sessões de emerge e uma quantidade irracional de chá.',
    winMenuFile: 'A',
    winMenuEdit: 'E',
    winMenuOptions: 'O',
    winMenuHelp: 'A',
    wizWelcomeHtml:
      '<em>Bem-vindo ao</em> Assistente de Instalação do Bentoo',
    taglineHtml: 'Um <em>Stage5</em> amigável do Gentoo Linux.',
    ledeHtml:
      'Este programa vai instalar um <b>desktop Linux baseado em código-fonte</b> — um <em>Stage5</em> do Gentoo — na sua máquina. Cada pacote pré-compilado, cada padrão deliberado. Por favor, feche todos os outros aplicativos antes de continuar.',
    specs: [
      { k: 'Versão:', v: '0.1.0-alpha · rolling', t: 'AINDA NÃO COMPILADO' },
      { k: 'Kernel:', v: '6.19.12-LTS · MGLRU', t: 'LINUX' },
      { k: 'Portage:', v: '3.0.65 · overlay ::bentoo', t: 'FONTE' },
      { k: 'Arch:', v: 'x86-64-v3 · -O2 -pipe', t: 'RÁPIDO' },
      { k: 'Licença:', v: 'GPL-2.0-or-later', t: 'LIVRE' },
    ],
    progressTopLabelHtml: 'Compilando <em>world</em> — ETA: final de 2026',
    progressText: '47% · 321 / 680 pacotes · zero falhas',
    pingLabelHtml:
      '<b>[ ! ]</b> <span>DISPARO ÚNICO · SEM NEWSLETTER · UNSUBSCRIBE EMBUTIDO</span>',
    btnContact: 'Contato',
    btnCancel: 'Cancelar',
    msdosTitle: 'Microsoft(R) MS-DOS(R) Versão 6.22',
    msdosHelpHint:
      'Digite <span class="yel">HELP</span> para uma lista de comandos.',
    inputAriaLabel: 'entrada do terminal',
    statusReady: 'Pronto',
    startBtn: 'Iniciar',
    shell: {
      helpLines: [
        'BENTOO DOS — comandos disponíveis',
        '',
        '  <span class="yel">HELP</span>          mostra esta lista',
        '  <span class="yel">DIR</span>           lista arquivos',
        '  <span class="yel">CD</span>            muda de diretório',
        '  <span class="yel">TYPE</span> &lt;arq&gt;   imprime um arquivo de texto',
        '  <span class="yel">VER</span>           mostra a versão',
        '  <span class="yel">TIME</span>          mostra a hora atual',
        '  <span class="yel">DATE</span>          mostra a data atual',
        '  <span class="yel">EMERGE --INFO</span> mostra config do portage',
        '  <span class="yel">NEOFETCH</span>      resumo do sistema',
        '  <span class="yel">WHOAMI</span>        usuário atual',
        '  <span class="yel">FORTUNE</span>       sabedoria aleatória do gentoo',
        '  <span class="yel">BANANA</span>        🍌',
        '  <span class="yel">CLS</span>           limpa a tela',
        '  <span class="yel">EXIT</span>          tente',
        '',
        '<span class="pink">dica: SETAS navegam histórico · CTRL+L limpa</span>',
      ],
      dirLines: [
        ' Volume no drive C é BENTOO',
        ' Diretório de C:\\BENTOO',
        '',
        'BOOT         &lt;DIR&gt;    20-04-26  15:23',
        'ETC          &lt;DIR&gt;    20-04-26  15:23',
        'USR          &lt;DIR&gt;    20-04-26  15:23',
        'VAR          &lt;DIR&gt;    20-04-26  15:23',
        'README   TXT     1.248  20-04-26  15:23',
        'RELEASE  INI       512  20-04-26  15:23',
        'MAKE     CONF    2.048  20-04-26  15:23',
        '        7 Arquivo(s)   3.808 bytes',
        '                 bytes nunca suficientes livres',
      ],
      ver: 'Bentoo DOS Stage5 Extensions, Versão 0.1.0-alpha',
      cd: 'C:\\BENTOO',
      timePrefix: 'Hora atual: ',
      datePrefix: 'Data atual: ',
      whoami: 'BENTOO\\ROOT',
      readmeLines: [
        '=== README.TXT ==================================================',
        '',
        '  BENTOO — um Stage5 amigável do Gentoo Linux',
        '',
        '  Bentoo é um desktop Linux baseado em código-fonte que leva a',
        '  filosofia de instalação em estágios do Gentoo à sua conclusão',
        '  natural: um sistema pré-compilado, pré-configurado, utilizável',
        '  no dia a dia.',
        '',
        '  - Portage, inalterado',
        '  - USE flags, inalteradas',
        '  - Rolling release',
        '  - -march=x86-64-v3',
        '  - Desktop pronto desde o primeiro boot',
        '',
        '  Até o final de 2026.',
        '',
        '=================================================================',
      ],
      releaseLines: [
        '[bentoo]',
        'version=0.1.0-alpha',
        'codename=kitchen-is-open',
        'channel=rolling',
        'arch=x86-64-v3',
        'license=GPL-2.0-or-later',
        'home=https://obentoo.org/',
      ],
      makeConfLines: [
        'CFLAGS="-march=x86-64-v3 -O2 -pipe -fno-plt"',
        'CXXFLAGS="${CFLAGS}"',
        'CHOST="x86_64-pc-linux-gnu"',
        'MAKEOPTS="-j12"',
        'USE="wayland pipewire vulkan X dbus elogind"',
        'ACCEPT_LICENSE="-* @FREE @BINARY-REDISTRIBUTABLE"',
        'PORTDIR_OVERLAY="/var/db/repos/bentoo"',
      ],
      emergeInfoLines: [
        'Portage 3.0.65 (python 3.13.2, default/linux/amd64/17.1/desktop/bentoo, gcc-14.2)',
        'CFLAGS="-march=x86-64-v3 -O2 -pipe -fno-plt"',
        'USE="wayland pipewire vulkan X dbus elogind"',
        'FEATURES="parallel-fetch ebuild-locks sandbox"',
        'desktop Linux baseado em código-fonte · Stage5 · pronto para bootar',
      ],
      neofetchLines: [
        '   <span class="cyan">___           __             </span>   <span class="yel">BENTOO.EXE</span>',
        '  <span class="cyan">/ _ )___ ___  / /____  ___    </span>   ----------',
        ' <span class="cyan">/ _  / -_) _ \\/ __/ _ \\/ _ \\  </span>   OS:   bentoo 0.1.0-alpha',
        '<span class="cyan">/____/\\__/_//_/\\__/\\___/\\___/  </span>   KERN: 6.19.12-LTS',
        '',
        '<span class="pink">弁当 · ベントー</span>             SHELL: bash 5.2',
        '<span class="yel">Stage5 · baseado em código-fonte</span> ARCH:  x86-64-v3',
      ],
      fortuneQuotes: [
        'Código-fonte é lei. — mantenedor desconhecido',
        'Um pacote bem compilado é sua própria recompensa.',
        'USE flags: uma prece ao compilador.',
        'A única coisa que um bento e o gentoo têm em comum: disciplina.',
        '<span class="pink">静かに煮込み中</span> — cozinhando em fogo baixo, silenciosamente.',
        'Não use emerge --depclean numa sexta-feira.',
      ],
      bananaLines: [
        '      <span class="yel">___</span>',
        "    <span class=\"yel\">.-'   \\</span>",
        '    <span class="yel">|  .-. )</span>',
        '    <span class="yel">| |  | |</span>   <span class="cyan">🍌 banana carregada.</span>',
        "    <span class=\"yel\">| \\`-' |</span>",
        '     <span class="yel">\\___/</span>',
        '<span class="pink">nano banana aprova.</span>',
      ],
      exitMsg:
        '<span class="pink">isto é uma página web. você não pode sair. só pode fechar a aba.</span>',
      shutdownMsg: 'Permissão negada. Boa tentativa.',
      formatMsg: 'Formatar o quê? Isto é uma página web.',
      delMsg: 'Você tá falando sério? Isto é uma página web.',
      fileNotFoundPrefix: 'Arquivo não encontrado - ',
      badCommand: 'Comando ou nome de arquivo inválido.',
    },
  },
  es: {
    title: 'bentoo — install.exe',
    description:
      'Bentoo es un Stage5 fácil de usar de Gentoo Linux — una distribución de escritorio que viene precompilada, preconfigurada y lista para arrancar.',
    fileMenuLetter: 'A',
    fileMenuLabel: 'rchivo',
    editMenuLetter: 'E',
    editMenuLabel: 'ditar',
    viewMenuLetter: 'V',
    viewMenuLabel: 'er',
    helpMenuLetter: 'A',
    helpMenuLabel: 'yuda',
    fileNew: 'Nueva instalación...',
    fileOpen: 'Abrir ISO...',
    fileSave: 'Guardar progreso',
    filePrint: 'Imprimir manual',
    fileExit: 'Salir',
    editUndo: 'Deshacer',
    editRedo: 'Rehacer',
    editCopy: 'Copiar',
    editPaste: 'Pegar',
    editFind: 'Buscar...',
    viewInstall: 'Asistente de instalación',
    viewProgress: 'Progreso',
    viewZoomIn: 'Acercar',
    viewZoomOut: 'Alejar',
    helpTopics: 'Temas de ayuda',
    helpTips: 'Consejos y trucos',
    helpDocs: 'Docs online',
    helpAbout: 'Acerca de bentoo...',
    navBack: 'Volver al rotador',
    navHub: 'Hub de variantes',
    jokes: {
      new: 'Nueva instalación — ya estás instalando. Paciencia.',
      open: 'Abrir ISO — prueba emerge en su lugar. Es nuestra forma.',
      save: 'Progreso guardado en ~/.bentoo/state.ini (en realidad no).',
      print:
        'No se encontró impresora. ¿Imprimir a archivo? ¿Fax? ¿Windows 95? Nada funciona.',
      exit:
        'Esto es una página web. No puedes salir. Solo puedes cerrar la pestaña.',
      undo: '¿Deshacer qué, exactamente? ¿La existencia?',
      redo: 'No hay rehacer. Solo emerge --resume.',
      copy: 'Copiado: `Un Stage5 fácil de usar de Gentoo Linux.`',
      paste: 'Pegado nada. (Nada para pegar.)',
      find: 'Buscar qué? Aún estamos buscando la fecha correcta de lanzamiento.',
      'view-install': 'Lo estás mirando.',
      'view-progress': 'Progreso: 47%. Siempre 47%. Es una filosofía.',
      'view-terminal': 'El terminal está justo ahí. ↓',
      'zoom-in':
        'Zoom con Ctrl+= en tu navegador. Esto es una página web, ¿recuerdas?',
      'zoom-out': 'Zoom con Ctrl+- en tu navegador.',
      'help-topics': 'Escribe HELP en el terminal para comandos reales.',
      tips: 'Consejo: prueba BANANA en el terminal.',
    },
    aboutTitle: 'Acerca de bentoo — install.exe',
    aboutCloseAria: 'cerrar',
    aboutVersionLineHtml: 'Versión <b>0.1.0-alpha</b> · build 2026.04',
    aboutDescriptionHtml:
      'Un <em>Stage5 fácil de usar</em> de Gentoo Linux — un escritorio basado en código fuente que viene precompilado, preconfigurado y listo para arrancar.',
    aboutCopyrightHtml:
      'Copyright © 2018 – 2026 proyecto <b>bentoo</b>.<br />Licenciado bajo GPL-2.0-or-later.',
    aboutFooterMsg:
      'Este programa fue escrito con cariño, largas sesiones de emerge y una cantidad irrazonable de té.',
    winMenuFile: 'A',
    winMenuEdit: 'E',
    winMenuOptions: 'O',
    winMenuHelp: 'A',
    wizWelcomeHtml:
      '<em>Bienvenido al</em> Asistente de Instalación de Bentoo',
    taglineHtml: 'Un <em>Stage5</em> fácil de usar de Gentoo Linux.',
    ledeHtml:
      'Este programa instalará un <b>escritorio Linux basado en código fuente</b> — un <em>Stage5</em> de Gentoo — en tu máquina. Cada paquete precompilado, cada predeterminado deliberado. Por favor, cierra todas las demás aplicaciones antes de continuar.',
    specs: [
      { k: 'Versión:', v: '0.1.0-alpha · rolling', t: 'AÚN NO COMPILADO' },
      { k: 'Kernel:', v: '6.19.12-LTS · MGLRU', t: 'LINUX' },
      { k: 'Portage:', v: '3.0.65 · overlay ::bentoo', t: 'CÓDIGO' },
      { k: 'Arch:', v: 'x86-64-v3 · -O2 -pipe', t: 'RÁPIDO' },
      { k: 'Licencia:', v: 'GPL-2.0-or-later', t: 'LIBRE' },
    ],
    progressTopLabelHtml: 'Compilando <em>world</em> — ETA: finales de 2026',
    progressText: '47% · 321 / 680 paquetes · cero fallos',
    pingLabelHtml:
      '<b>[ ! ]</b> <span>DISPARO ÚNICO · SIN BOLETÍN · BAJA INTEGRADA</span>',
    btnContact: 'Contacto',
    btnCancel: 'Cancelar',
    msdosTitle: 'Microsoft(R) MS-DOS(R) Versión 6.22',
    msdosHelpHint:
      'Escribe <span class="yel">HELP</span> para una lista de comandos.',
    inputAriaLabel: 'entrada del terminal',
    statusReady: 'Listo',
    startBtn: 'Inicio',
    shell: {
      helpLines: [
        'BENTOO DOS — comandos disponibles',
        '',
        '  <span class="yel">HELP</span>          muestra esta lista',
        '  <span class="yel">DIR</span>           lista archivos',
        '  <span class="yel">CD</span>            cambia de directorio',
        '  <span class="yel">TYPE</span> &lt;arch&gt;  imprime un archivo de texto',
        '  <span class="yel">VER</span>           muestra la versión',
        '  <span class="yel">TIME</span>          muestra la hora actual',
        '  <span class="yel">DATE</span>          muestra la fecha actual',
        '  <span class="yel">EMERGE --INFO</span> muestra config de portage',
        '  <span class="yel">NEOFETCH</span>      resumen del sistema',
        '  <span class="yel">WHOAMI</span>        usuario actual',
        '  <span class="yel">FORTUNE</span>       sabiduría aleatoria de gentoo',
        '  <span class="yel">BANANA</span>        🍌',
        '  <span class="yel">CLS</span>           limpia la pantalla',
        '  <span class="yel">EXIT</span>          inténtalo',
        '',
        '<span class="pink">pista: FLECHAS navegan historial · CTRL+L limpia</span>',
      ],
      dirLines: [
        ' Volumen en unidad C es BENTOO',
        ' Directorio de C:\\BENTOO',
        '',
        'BOOT         &lt;DIR&gt;    20-04-26  15:23',
        'ETC          &lt;DIR&gt;    20-04-26  15:23',
        'USR          &lt;DIR&gt;    20-04-26  15:23',
        'VAR          &lt;DIR&gt;    20-04-26  15:23',
        'README   TXT     1.248  20-04-26  15:23',
        'RELEASE  INI       512  20-04-26  15:23',
        'MAKE     CONF    2.048  20-04-26  15:23',
        '        7 Archivo(s)   3.808 bytes',
        '                 bytes nunca suficientes libres',
      ],
      ver: 'Bentoo DOS Stage5 Extensions, Versión 0.1.0-alpha',
      cd: 'C:\\BENTOO',
      timePrefix: 'Hora actual: ',
      datePrefix: 'Fecha actual: ',
      whoami: 'BENTOO\\ROOT',
      readmeLines: [
        '=== README.TXT ==================================================',
        '',
        '  BENTOO — un Stage5 fácil de usar de Gentoo Linux',
        '',
        '  Bentoo es un escritorio Linux basado en código fuente que lleva',
        '  la filosofía de instalación por etapas de Gentoo a su conclusión',
        '  natural: un sistema precompilado, preconfigurado, listo para',
        '  uso diario.',
        '',
        '  - Portage, sin cambios',
        '  - USE flags, sin cambios',
        '  - Rolling release',
        '  - -march=x86-64-v3',
        '  - Escritorio listo desde el primer arranque',
        '',
        '  Hasta finales de 2026.',
        '',
        '=================================================================',
      ],
      releaseLines: [
        '[bentoo]',
        'version=0.1.0-alpha',
        'codename=kitchen-is-open',
        'channel=rolling',
        'arch=x86-64-v3',
        'license=GPL-2.0-or-later',
        'home=https://obentoo.org/',
      ],
      makeConfLines: [
        'CFLAGS="-march=x86-64-v3 -O2 -pipe -fno-plt"',
        'CXXFLAGS="${CFLAGS}"',
        'CHOST="x86_64-pc-linux-gnu"',
        'MAKEOPTS="-j12"',
        'USE="wayland pipewire vulkan X dbus elogind"',
        'ACCEPT_LICENSE="-* @FREE @BINARY-REDISTRIBUTABLE"',
        'PORTDIR_OVERLAY="/var/db/repos/bentoo"',
      ],
      emergeInfoLines: [
        'Portage 3.0.65 (python 3.13.2, default/linux/amd64/17.1/desktop/bentoo, gcc-14.2)',
        'CFLAGS="-march=x86-64-v3 -O2 -pipe -fno-plt"',
        'USE="wayland pipewire vulkan X dbus elogind"',
        'FEATURES="parallel-fetch ebuild-locks sandbox"',
        'escritorio Linux basado en código fuente · Stage5 · listo para arrancar',
      ],
      neofetchLines: [
        '   <span class="cyan">___           __             </span>   <span class="yel">BENTOO.EXE</span>',
        '  <span class="cyan">/ _ )___ ___  / /____  ___    </span>   ----------',
        ' <span class="cyan">/ _  / -_) _ \\/ __/ _ \\/ _ \\  </span>   OS:   bentoo 0.1.0-alpha',
        '<span class="cyan">/____/\\__/_//_/\\__/\\___/\\___/  </span>   KERN: 6.19.12-LTS',
        '',
        '<span class="pink">弁当 · ベントー</span>             SHELL: bash 5.2',
        '<span class="yel">Stage5 · basado en código fuente</span> ARCH:  x86-64-v3',
      ],
      fortuneQuotes: [
        'El código fuente es ley. — mantenedor desconocido',
        'Un paquete bien compilado es su propia recompensa.',
        'USE flags: una plegaria al compilador.',
        'Lo único que un bento y gentoo tienen en común: disciplina.',
        '<span class="pink">静かに煮込み中</span> — cocinando a fuego lento, silenciosamente.',
        'No hagas emerge --depclean en viernes.',
      ],
      bananaLines: [
        '      <span class="yel">___</span>',
        "    <span class=\"yel\">.-'   \\</span>",
        '    <span class="yel">|  .-. )</span>',
        '    <span class="yel">| |  | |</span>   <span class="cyan">🍌 banana cargada.</span>',
        "    <span class=\"yel\">| \\`-' |</span>",
        '     <span class="yel">\\___/</span>',
        '<span class="pink">nano banana aprueba.</span>',
      ],
      exitMsg:
        '<span class="pink">esto es una página web. no puedes salir. solo puedes cerrar la pestaña.</span>',
      shutdownMsg: 'Permiso denegado. Buen intento.',
      formatMsg: '¿Formatear qué? Esto es una página web.',
      delMsg: '¿Hablas en serio? Esto es una página web.',
      fileNotFoundPrefix: 'Archivo no encontrado - ',
      badCommand: 'Comando o nombre de archivo inválido.',
    },
  },
};
