import type { Lang } from '~/utils/getLang';

export interface V3jShell {
  welcomeBanner: string;
  hintComment: string;
  helpLines: string[];
  whoami: string;
  unameLong: string;
  unameShort: string;
  emergeUsage: string;
  emergeInfoLines: string[];
  osReleaseLines: string[];
  neofetchLines: string[];
  fortuneQuotes: string[];
  bananaLines: string[];
  exitMsg: string;
  logoutMsg: string;
  sudoRmMsg: string;
  forkBombMsg: string;
  commandNotFoundSuffix: string;
  inputAriaLabel: string;
}

export interface V3jSpecRow {
  k: string;
  v: string;
}

export interface V3jContent {
  title: string;
  description: string;
  pkgWinTitle: string;
  releasePillHtml: string;
  taglineHtml: string;
  descHtml: string;
  specs: V3jSpecRow[];
  btnGitHub: string;
  btnContact: string;
  btnNotify: string;
  notifyWinTitle: string;
  notifyNoteHtml: string;
  xtermWinTitle: string;
  statusFootCopy: string;
  shell: V3jShell;
}

export const v3j: Record<Lang, V3jContent> = {
  en: {
    title: 'bentoo — IRIX 6.5 Workstation',
    description:
      'Bentoo is a user-friendly Stage5 of Gentoo Linux — a desktop distribution that ships pre-compiled, pre-configured, and ready to boot.',
    pkgWinTitle: 'bentoo-package-manager — coming-soon',
    releasePillHtml:
      '<b>Stage5</b> · source-based · <em>pre-release 0.1.0-alpha</em>',
    taglineHtml: 'A user-friendly <em>Stage5</em> of Gentoo Linux.',
    descHtml:
      "Bentoo is a <em>source-based</em> Linux desktop that extends Gentoo's staged-install philosophy to its natural conclusion: <b>Stage5</b> — a pre-compiled, pre-configured, daily-usable system. It keeps the power of Portage and the rigor of source builds, while shipping you a complete desktop on day one.",
    specs: [
      { k: 'Release', v: '<em>0.1.0</em> · alpha' },
      { k: 'Window', v: 'late <em>2026</em>' },
      { k: 'Base', v: 'gentoo · source-first' },
      { k: 'Arch', v: '<em>x86-64-v3</em> · -O2' },
      { k: 'License', v: 'GPL-2.0' },
      { k: 'Kitchen', v: 'Brazil &nbsp;⇄&nbsp; 東京' },
    ],
    btnGitHub: 'View on GitHub',
    btnContact: 'Contact',
    btnNotify: 'Notify me',
    notifyWinTitle: 'release-ping — subscribe',
    notifyNoteHtml:
      'one-shot release ping · <b>no newsletter</b> · unsubscribe built-in',
    xtermWinTitle: 'xterm — emerge --info bentoo',
    statusFootCopy: '© 2018 – 2026 bentoo · handcrafted, source-first',
    shell: {
      welcomeBanner: 'Welcome to obentoo — IRIX 6.5 / xterm',
      hintComment: '# type <span class="kw">help</span> to see available commands',
      helpLines: [
        '<span class="cmt"># available commands</span>',
        '<span class="ok">help</span>         show this list',
        '<span class="ok">ls</span>           list files',
        '<span class="ok">pwd</span>          current directory',
        '<span class="ok">whoami</span>       current user',
        '<span class="ok">uname -a</span>     kernel info',
        '<span class="ok">date</span>         current date/time',
        '<span class="ok">emerge --info</span> portage config',
        '<span class="ok">cat /etc/os-release</span> distro info',
        '<span class="ok">neofetch</span>     system summary (ASCII art)',
        '<span class="ok">fortune</span>      random gentoo wisdom',
        '<span class="ok">cowsay &lt;msg&gt;</span> let the cow speak',
        '<span class="ok">banana</span>       🍌',
        '<span class="ok">clear</span>        wipe the screen',
        '<span class="cmt"># hint: try something weird</span>',
      ],
      whoami: 'root',
      unameLong:
        'Linux obentoo 6.19.12-LTS-bentoo #1 SMP PREEMPT x86_64 GNU/Linux',
      unameShort: 'Linux',
      emergeUsage:
        '<span class="ps">usage: emerge [options] [action] &lt;package&gt;</span>',
      emergeInfoLines: [
        '<span class="cmt"># Portage 3.0.65 (python 3.13.2, default/linux/amd64/17.1/desktop/bentoo, gcc-14.2)</span>',
        '<span class="ok">CFLAGS</span>=<span class="str">"-march=x86-64-v3 -O2 -pipe -fno-plt"</span>',
        '<span class="ok">CHOST</span>=<span class="str">"x86_64-pc-linux-gnu"</span>',
        '<span class="ok">USE</span>=<span class="str">"wayland pipewire vulkan X dbus elogind"</span>',
        '<span class="ok">FEATURES</span>=<span class="str">"parallel-fetch ebuild-locks sandbox"</span>',
        '<span class="ok">MAKEOPTS</span>=<span class="str">"-j12"</span>',
        '<span class="ok">ACCEPT_LICENSE</span>=<span class="str">"-* @FREE @BINARY-REDISTRIBUTABLE"</span>',
      ],
      osReleaseLines: [
        'NAME="<span class="str">bentoo</span>"',
        'PRETTY_NAME="<span class="str">bentoo · a user-friendly Stage5 of Gentoo Linux</span>"',
        'ID=bentoo',
        'ID_LIKE=gentoo',
        'VERSION="0.1.0-alpha"',
        'HOME_URL="<span class="kw">https://obentoo.org/</span>"',
        'SUPPORT_URL="<span class="kw">https://github.com/obentoo</span>"',
      ],
      neofetchLines: [
        '<span class="ascii">   ___           __              </span>',
        '<span class="ascii">  / _ )___ ___  / /____  ___     </span>',
        '<span class="ascii"> / _  / -_) _ \\/ __/ _ \\/ _ \\   </span>  <span class="ok">root</span>@<span class="ok">obentoo</span>',
        '<span class="ascii">/____/\\__/_//_/\\__/\\___/\\___/   </span>  ---------------',
        '                                  <span class="kw">OS</span>: bentoo 0.1.0-alpha',
        '<span class="str">弁当 · ベントー</span>                  <span class="kw">Kernel</span>: 6.19.12-LTS',
        '<span class="ok">Stage5 · source-based</span>             <span class="kw">Shell</span>: bash 5.2',
        '                                  <span class="kw">Arch</span>: x86-64-v3',
        '                                  <span class="kw">Packages</span>: 30,412 (portage)',
      ],
      fortuneQuotes: [
        'The only thing gentoo and a bento have in common: both take discipline.',
        '<span class="str">source is law.</span> — unknown maintainer',
        'A well-compiled package is its own reward.',
        '<span class="kw">emerge --sync</span> is self-care.',
        'USE flags: a prayer to the compiler.',
        'A Stage5 in hand is worth two Stage3s in the wiki.',
        '<span class="ok">静かに煮込み中</span> — simmering, quietly.',
      ],
      bananaLines: [
        '<span class="str">      ___</span>',
        "<span class=\"str\">    .-'   \\</span>",
        '<span class="str">    |  .-. )</span>',
        '<span class="str">    | |  | |</span>  <span class="ok">🍌 banana!</span>',
        "<span class=\"str\">    | \\`-' |</span>",
        '<span class="str">     \\___/</span>',
        '<span class="cmt"># nano banana approves</span>',
      ],
      exitMsg:
        '<span class="cmt"># nice try — this shell has no exit.</span>',
      logoutMsg: '<span class="cmt"># nope.</span>',
      sudoRmMsg:
        "<span class=\"ps\">rm: cannot remove '/': Operation not permitted (this is a webpage, relax)</span>",
      forkBombMsg:
        '<span class="ps">fork bomb detected. not today, hacker.</span>',
      commandNotFoundSuffix:
        ': command not found. type <span class="kw">help</span>.',
      inputAriaLabel: 'terminal input',
    },
  },
  pt: {
    title: 'bentoo — IRIX 6.5 Workstation',
    description:
      'Bentoo é um Stage5 amigável do Gentoo Linux — uma distribuição desktop que vem pré-compilada, pré-configurada e pronta para bootar.',
    pkgWinTitle: 'bentoo-package-manager — coming-soon',
    releasePillHtml:
      '<b>Stage5</b> · baseado em código-fonte · <em>pré-release 0.1.0-alpha</em>',
    taglineHtml: 'Um <em>Stage5</em> amigável do Gentoo Linux.',
    descHtml:
      'Bentoo é um desktop Linux <em>baseado em código-fonte</em> que leva a filosofia de instalação em estágios do Gentoo à sua conclusão natural: <b>Stage5</b> — um sistema pré-compilado, pré-configurado e utilizável no dia a dia. Mantém o poder do Portage e o rigor das builds de código-fonte, enquanto entrega a você um desktop completo desde o primeiro dia.',
    specs: [
      { k: 'Release', v: '<em>0.1.0</em> · alpha' },
      { k: 'Janela', v: 'final de <em>2026</em>' },
      { k: 'Base', v: 'gentoo · código-fonte primeiro' },
      { k: 'Arch', v: '<em>x86-64-v3</em> · -O2' },
      { k: 'Licença', v: 'GPL-2.0' },
      { k: 'Cozinha', v: 'Brasil &nbsp;⇄&nbsp; 東京' },
    ],
    btnGitHub: 'Ver no GitHub',
    btnContact: 'Contato',
    btnNotify: 'Me avise',
    notifyWinTitle: 'ping-de-lancamento — inscreva-se',
    notifyNoteHtml:
      'ping único de lançamento · <b>sem newsletter</b> · descadastro embutido',
    xtermWinTitle: 'xterm — emerge --info bentoo',
    statusFootCopy: '© 2018 – 2026 bentoo · feito à mão, código-fonte primeiro',
    shell: {
      welcomeBanner: 'Bem-vindo ao obentoo — IRIX 6.5 / xterm',
      hintComment:
        '# digite <span class="kw">help</span> para ver os comandos disponíveis',
      helpLines: [
        '<span class="cmt"># comandos disponíveis</span>',
        '<span class="ok">help</span>         mostra esta lista',
        '<span class="ok">ls</span>           lista arquivos',
        '<span class="ok">pwd</span>          diretório atual',
        '<span class="ok">whoami</span>       usuário atual',
        '<span class="ok">uname -a</span>     info do kernel',
        '<span class="ok">date</span>         data/hora atual',
        '<span class="ok">emerge --info</span> config do portage',
        '<span class="ok">cat /etc/os-release</span> info da distro',
        '<span class="ok">neofetch</span>     resumo do sistema (arte ASCII)',
        '<span class="ok">fortune</span>      sabedoria aleatória do gentoo',
        '<span class="ok">cowsay &lt;msg&gt;</span> deixe a vaca falar',
        '<span class="ok">banana</span>       🍌',
        '<span class="ok">clear</span>        limpa a tela',
        '<span class="cmt"># dica: tente algo estranho</span>',
      ],
      whoami: 'root',
      unameLong:
        'Linux obentoo 6.19.12-LTS-bentoo #1 SMP PREEMPT x86_64 GNU/Linux',
      unameShort: 'Linux',
      emergeUsage:
        '<span class="ps">uso: emerge [opções] [ação] &lt;pacote&gt;</span>',
      emergeInfoLines: [
        '<span class="cmt"># Portage 3.0.65 (python 3.13.2, default/linux/amd64/17.1/desktop/bentoo, gcc-14.2)</span>',
        '<span class="ok">CFLAGS</span>=<span class="str">"-march=x86-64-v3 -O2 -pipe -fno-plt"</span>',
        '<span class="ok">CHOST</span>=<span class="str">"x86_64-pc-linux-gnu"</span>',
        '<span class="ok">USE</span>=<span class="str">"wayland pipewire vulkan X dbus elogind"</span>',
        '<span class="ok">FEATURES</span>=<span class="str">"parallel-fetch ebuild-locks sandbox"</span>',
        '<span class="ok">MAKEOPTS</span>=<span class="str">"-j12"</span>',
        '<span class="ok">ACCEPT_LICENSE</span>=<span class="str">"-* @FREE @BINARY-REDISTRIBUTABLE"</span>',
      ],
      osReleaseLines: [
        'NAME="<span class="str">bentoo</span>"',
        'PRETTY_NAME="<span class="str">bentoo · um Stage5 amigável do Gentoo Linux</span>"',
        'ID=bentoo',
        'ID_LIKE=gentoo',
        'VERSION="0.1.0-alpha"',
        'HOME_URL="<span class="kw">https://obentoo.org/</span>"',
        'SUPPORT_URL="<span class="kw">https://github.com/obentoo</span>"',
      ],
      neofetchLines: [
        '<span class="ascii">   ___           __              </span>',
        '<span class="ascii">  / _ )___ ___  / /____  ___     </span>',
        '<span class="ascii"> / _  / -_) _ \\/ __/ _ \\/ _ \\   </span>  <span class="ok">root</span>@<span class="ok">obentoo</span>',
        '<span class="ascii">/____/\\__/_//_/\\__/\\___/\\___/   </span>  ---------------',
        '                                  <span class="kw">OS</span>: bentoo 0.1.0-alpha',
        '<span class="str">弁当 · ベントー</span>                  <span class="kw">Kernel</span>: 6.19.12-LTS',
        '<span class="ok">Stage5 · baseado em código-fonte</span>    <span class="kw">Shell</span>: bash 5.2',
        '                                  <span class="kw">Arch</span>: x86-64-v3',
        '                                  <span class="kw">Pacotes</span>: 30.412 (portage)',
      ],
      fortuneQuotes: [
        'A única coisa que o gentoo e um bento têm em comum: ambos exigem disciplina.',
        '<span class="str">código-fonte é lei.</span> — mantenedor desconhecido',
        'Um pacote bem compilado é sua própria recompensa.',
        '<span class="kw">emerge --sync</span> é autocuidado.',
        'USE flags: uma prece ao compilador.',
        'Um Stage5 na mão vale dois Stage3s na wiki.',
        '<span class="ok">静かに煮込み中</span> — cozinhando em fogo baixo, silenciosamente.',
      ],
      bananaLines: [
        '<span class="str">      ___</span>',
        "<span class=\"str\">    .-'   \\</span>",
        '<span class="str">    |  .-. )</span>',
        '<span class="str">    | |  | |</span>  <span class="ok">🍌 banana!</span>',
        "<span class=\"str\">    | \\`-' |</span>",
        '<span class="str">     \\___/</span>',
        '<span class="cmt"># nano banana aprova</span>',
      ],
      exitMsg:
        '<span class="cmt"># boa tentativa — este shell não tem saída.</span>',
      logoutMsg: '<span class="cmt"># não.</span>',
      sudoRmMsg:
        "<span class=\"ps\">rm: não é possível remover '/': Operação não permitida (isto é uma página web, relaxa)</span>",
      forkBombMsg:
        '<span class="ps">fork bomb detectada. hoje não, hacker.</span>',
      commandNotFoundSuffix:
        ': comando não encontrado. digite <span class="kw">help</span>.',
      inputAriaLabel: 'entrada do terminal',
    },
  },
  es: {
    title: 'bentoo — IRIX 6.5 Workstation',
    description:
      'Bentoo es un Stage5 fácil de usar de Gentoo Linux — una distribución de escritorio que viene precompilada, preconfigurada y lista para arrancar.',
    pkgWinTitle: 'bentoo-package-manager — coming-soon',
    releasePillHtml:
      '<b>Stage5</b> · basado en código fuente · <em>pre-release 0.1.0-alpha</em>',
    taglineHtml: 'Un <em>Stage5</em> fácil de usar de Gentoo Linux.',
    descHtml:
      'Bentoo es un escritorio Linux <em>basado en código fuente</em> que lleva la filosofía de instalación por etapas de Gentoo a su conclusión natural: <b>Stage5</b> — un sistema precompilado, preconfigurado y listo para usar a diario. Conserva la potencia de Portage y el rigor de las compilaciones de código fuente, a la vez que te ofrece un escritorio completo desde el primer día.',
    specs: [
      { k: 'Release', v: '<em>0.1.0</em> · alpha' },
      { k: 'Ventana', v: 'finales de <em>2026</em>' },
      { k: 'Base', v: 'gentoo · código fuente primero' },
      { k: 'Arch', v: '<em>x86-64-v3</em> · -O2' },
      { k: 'Licencia', v: 'GPL-2.0' },
      { k: 'Cocina', v: 'Brasil &nbsp;⇄&nbsp; 東京' },
    ],
    btnGitHub: 'Ver en GitHub',
    btnContact: 'Contacto',
    btnNotify: 'Avísame',
    notifyWinTitle: 'release-ping — suscríbete',
    notifyNoteHtml:
      'ping único de lanzamiento · <b>sin boletín</b> · cancelación de suscripción integrada',
    xtermWinTitle: 'xterm — emerge --info bentoo',
    statusFootCopy: '© 2018 – 2026 bentoo · hecho a mano, código fuente primero',
    shell: {
      welcomeBanner: 'Bienvenido a obentoo — IRIX 6.5 / xterm',
      hintComment:
        '# escribe <span class="kw">help</span> para ver los comandos disponibles',
      helpLines: [
        '<span class="cmt"># comandos disponibles</span>',
        '<span class="ok">help</span>         muestra esta lista',
        '<span class="ok">ls</span>           lista archivos',
        '<span class="ok">pwd</span>          directorio actual',
        '<span class="ok">whoami</span>       usuario actual',
        '<span class="ok">uname -a</span>     info del kernel',
        '<span class="ok">date</span>         fecha/hora actual',
        '<span class="ok">emerge --info</span> config de portage',
        '<span class="ok">cat /etc/os-release</span> info de la distro',
        '<span class="ok">neofetch</span>     resumen del sistema (arte ASCII)',
        '<span class="ok">fortune</span>      sabiduría aleatoria de gentoo',
        '<span class="ok">cowsay &lt;msg&gt;</span> deja hablar a la vaca',
        '<span class="ok">banana</span>       🍌',
        '<span class="ok">clear</span>        limpia la pantalla',
        '<span class="cmt"># pista: prueba algo raro</span>',
      ],
      whoami: 'root',
      unameLong:
        'Linux obentoo 6.19.12-LTS-bentoo #1 SMP PREEMPT x86_64 GNU/Linux',
      unameShort: 'Linux',
      emergeUsage:
        '<span class="ps">uso: emerge [opciones] [acción] &lt;paquete&gt;</span>',
      emergeInfoLines: [
        '<span class="cmt"># Portage 3.0.65 (python 3.13.2, default/linux/amd64/17.1/desktop/bentoo, gcc-14.2)</span>',
        '<span class="ok">CFLAGS</span>=<span class="str">"-march=x86-64-v3 -O2 -pipe -fno-plt"</span>',
        '<span class="ok">CHOST</span>=<span class="str">"x86_64-pc-linux-gnu"</span>',
        '<span class="ok">USE</span>=<span class="str">"wayland pipewire vulkan X dbus elogind"</span>',
        '<span class="ok">FEATURES</span>=<span class="str">"parallel-fetch ebuild-locks sandbox"</span>',
        '<span class="ok">MAKEOPTS</span>=<span class="str">"-j12"</span>',
        '<span class="ok">ACCEPT_LICENSE</span>=<span class="str">"-* @FREE @BINARY-REDISTRIBUTABLE"</span>',
      ],
      osReleaseLines: [
        'NAME="<span class="str">bentoo</span>"',
        'PRETTY_NAME="<span class="str">bentoo · un Stage5 fácil de usar de Gentoo Linux</span>"',
        'ID=bentoo',
        'ID_LIKE=gentoo',
        'VERSION="0.1.0-alpha"',
        'HOME_URL="<span class="kw">https://obentoo.org/</span>"',
        'SUPPORT_URL="<span class="kw">https://github.com/obentoo</span>"',
      ],
      neofetchLines: [
        '<span class="ascii">   ___           __              </span>',
        '<span class="ascii">  / _ )___ ___  / /____  ___     </span>',
        '<span class="ascii"> / _  / -_) _ \\/ __/ _ \\/ _ \\   </span>  <span class="ok">root</span>@<span class="ok">obentoo</span>',
        '<span class="ascii">/____/\\__/_//_/\\__/\\___/\\___/   </span>  ---------------',
        '                                  <span class="kw">OS</span>: bentoo 0.1.0-alpha',
        '<span class="str">弁当 · ベントー</span>                  <span class="kw">Kernel</span>: 6.19.12-LTS',
        '<span class="ok">Stage5 · basado en código fuente</span>   <span class="kw">Shell</span>: bash 5.2',
        '                                  <span class="kw">Arch</span>: x86-64-v3',
        '                                  <span class="kw">Paquetes</span>: 30.412 (portage)',
      ],
      fortuneQuotes: [
        'Lo único que gentoo y un bento tienen en común: ambos requieren disciplina.',
        '<span class="str">el código fuente es ley.</span> — mantenedor desconocido',
        'Un paquete bien compilado es su propia recompensa.',
        '<span class="kw">emerge --sync</span> es autocuidado.',
        'USE flags: una plegaria al compilador.',
        'Un Stage5 en mano vale dos Stage3s en la wiki.',
        '<span class="ok">静かに煮込み中</span> — cocinando a fuego lento, silenciosamente.',
      ],
      bananaLines: [
        '<span class="str">      ___</span>',
        "<span class=\"str\">    .-'   \\</span>",
        '<span class="str">    |  .-. )</span>',
        '<span class="str">    | |  | |</span>  <span class="ok">🍌 banana!</span>',
        "<span class=\"str\">    | \\`-' |</span>",
        '<span class="str">     \\___/</span>',
        '<span class="cmt"># nano banana aprueba</span>',
      ],
      exitMsg:
        '<span class="cmt"># buen intento — este shell no tiene salida.</span>',
      logoutMsg: '<span class="cmt"># no.</span>',
      sudoRmMsg:
        "<span class=\"ps\">rm: no se puede eliminar '/': Operación no permitida (esto es una página web, relájate)</span>",
      forkBombMsg:
        '<span class="ps">fork bomb detectada. hoy no, hacker.</span>',
      commandNotFoundSuffix:
        ': comando no encontrado. escribe <span class="kw">help</span>.',
      inputAriaLabel: 'entrada del terminal',
    },
  },
};
