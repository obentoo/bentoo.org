import type { Lang } from '~/utils/getLang';

export interface MinecraftContent {
  title: string;
  description: string;
  tabHome: string;
  tabForum: string;
  fpsStableLabel: string;
  blockLabel: string;
  biomeLabel: string;
  biomeValue: string;
  biomeStatus: string;
  lightLabel: string;
  lightValue: string;
  taglineHtml: string;
  btnContact: string;
  btnNotify: string;
  chatNotchHtml: string;
  chatSteveHtml: string;
  chatCreeperHtml: string;
  chatServerHtml: string;
  craftingTitle: string;
  bestiaryTitle: string;
  mobZombie: string;
  mobSkeleton: string;
  mobVillager: string;
  levelLineHtml: string;
}

export const minecraft: Record<Lang, MinecraftContent> = {
  en: {
    title: 'bentoo — singleplayer · new world (stage5)',
    description:
      'Bentoo — a user-friendly Stage5 of Gentoo Linux. Mine. Craft. Compile.',
    tabHome: '◉ BENTOO | Home',
    tabForum: 'Forum',
    fpsStableLabel: 'T: stable',
    blockLabel: 'Block',
    biomeLabel: 'Biome',
    biomeValue: 'forest',
    biomeStatus: 'peaceful',
    lightLabel: 'Light',
    lightValue: '15 (sky 15, block 0)',
    taglineHtml: 'A USER-FRIENDLY <b>STAGE5</b> OF GENTOO LINUX',
    btnContact: 'CONTACT · MULTIPLAYER',
    btnNotify: 'NOTIFY ME · REDSTONE',
    chatNotchHtml:
      '<span class="you">&lt;<b>Notch</b>&gt;</span> &gt; Welcome to Bentoo! Press F3 for debug.',
    chatSteveHtml:
      '<span class="steve">&lt;<b>Steve</b>&gt;</span> &gt; I have found diamonds at Y=11. Yeah, <b>science</b>.',
    chatCreeperHtml:
      '<span class="creeper">&lt;<b>Creeper</b>&gt;</span> &gt; <em>sssSSSSSSS...</em> BOOM!',
    chatServerHtml:
      '<span style="color:#ff6a6a">[server]</span> &gt; <em>Herobrine joined the game</em>',
    craftingTitle: '◆ CRAFTING · DIAMOND PICKAXE',
    bestiaryTitle: '◉ MOB BESTIARY',
    mobZombie: 'Zombie',
    mobSkeleton: 'Skeleton',
    mobVillager: 'Villager',
    levelLineHtml:
      'LEVEL <b>42</b> · XP <b>820 / 1000</b> · <span style="color:var(--diamond)">▲ stage5</span>',
  },
  pt: {
    title: 'bentoo — singleplayer · novo mundo (stage5)',
    description:
      'Bentoo — um Stage5 amigável do Gentoo Linux. Minere. Crafte. Compile.',
    tabHome: '◉ BENTOO | Início',
    tabForum: 'Fórum',
    fpsStableLabel: 'T: estável',
    blockLabel: 'Bloco',
    biomeLabel: 'Bioma',
    biomeValue: 'floresta',
    biomeStatus: 'pacífico',
    lightLabel: 'Luz',
    lightValue: '15 (céu 15, bloco 0)',
    taglineHtml: 'UM <b>STAGE5</b> AMIGÁVEL DO GENTOO LINUX',
    btnContact: 'CONTATO · MULTIPLAYER',
    btnNotify: 'ME AVISE · REDSTONE',
    chatNotchHtml:
      '<span class="you">&lt;<b>Notch</b>&gt;</span> &gt; Bem-vindo ao Bentoo! Aperte F3 para debug.',
    chatSteveHtml:
      '<span class="steve">&lt;<b>Steve</b>&gt;</span> &gt; Achei diamantes em Y=11. É, <b>ciência</b>.',
    chatCreeperHtml:
      '<span class="creeper">&lt;<b>Creeper</b>&gt;</span> &gt; <em>sssSSSSSSS...</em> BUM!',
    chatServerHtml:
      '<span style="color:#ff6a6a">[servidor]</span> &gt; <em>Herobrine entrou no jogo</em>',
    craftingTitle: '◆ CRAFT · PICARETA DE DIAMANTE',
    bestiaryTitle: '◉ BESTIÁRIO DE MOBS',
    mobZombie: 'Zumbi',
    mobSkeleton: 'Esqueleto',
    mobVillager: 'Aldeão',
    levelLineHtml:
      'NÍVEL <b>42</b> · XP <b>820 / 1000</b> · <span style="color:var(--diamond)">▲ stage5</span>',
  },
  es: {
    title: 'bentoo — un jugador · mundo nuevo (stage5)',
    description:
      'Bentoo — un Stage5 fácil de usar de Gentoo Linux. Mina. Craftea. Compila.',
    tabHome: '◉ BENTOO | Inicio',
    tabForum: 'Foro',
    fpsStableLabel: 'T: estable',
    blockLabel: 'Bloque',
    biomeLabel: 'Bioma',
    biomeValue: 'bosque',
    biomeStatus: 'pacífico',
    lightLabel: 'Luz',
    lightValue: '15 (cielo 15, bloque 0)',
    taglineHtml: 'UN <b>STAGE5</b> FÁCIL DE USAR DE GENTOO LINUX',
    btnContact: 'CONTACTO · MULTIJUGADOR',
    btnNotify: 'AVÍSAME · REDSTONE',
    chatNotchHtml:
      '<span class="you">&lt;<b>Notch</b>&gt;</span> &gt; ¡Bienvenido a Bentoo! Pulsa F3 para debug.',
    chatSteveHtml:
      '<span class="steve">&lt;<b>Steve</b>&gt;</span> &gt; Encontré diamantes en Y=11. Sí, <b>ciencia</b>.',
    chatCreeperHtml:
      '<span class="creeper">&lt;<b>Creeper</b>&gt;</span> &gt; <em>sssSSSSSSS...</em> ¡BOOM!',
    chatServerHtml:
      '<span style="color:#ff6a6a">[servidor]</span> &gt; <em>Herobrine se ha unido a la partida</em>',
    craftingTitle: '◆ CRAFTEO · PICO DE DIAMANTE',
    bestiaryTitle: '◉ BESTIARIO DE MOBS',
    mobZombie: 'Zombi',
    mobSkeleton: 'Esqueleto',
    mobVillager: 'Aldeano',
    levelLineHtml:
      'NIVEL <b>42</b> · XP <b>820 / 1000</b> · <span style="color:var(--diamond)">▲ stage5</span>',
  },
  ru: {
    title: 'bentoo — одиночная игра · новый мир (stage5)',
    description: 'Bentoo — удобный Stage5 Gentoo Linux. Добывай. Крафти. Компилируй.',
    tabHome: '◉ BENTOO | Главная',
    tabForum: 'Форум',
    fpsStableLabel: 'T: стабильно',
    blockLabel: 'Блок',
    biomeLabel: 'Биом',
    biomeValue: 'лес',
    biomeStatus: 'мирный',
    lightLabel: 'Свет',
    lightValue: '15 (небо 15, блок 0)',
    taglineHtml: 'УДОБНЫЙ <b>STAGE5</b> GENTOO LINUX',
    btnContact: 'КОНТАКТЫ · СЕТЕВАЯ ИГРА',
    btnNotify: 'УВЕДОМИТЬ МЕНЯ · РЕДСТОУН',
    chatNotchHtml: '<span class="you">&lt;<b>Notch</b>&gt;</span> &gt; Добро пожаловать в Bentoo! Нажмите F3 для отладки.',
    chatSteveHtml: '<span class="steve">&lt;<b>Steve</b>&gt;</span> &gt; Нашёл алмазы на Y=11. Да, <b>наука</b>.',
    chatCreeperHtml: '<span class="creeper">&lt;<b>Creeper</b>&gt;</span> &gt; <em>шшшШШШШШШ...</em> БУМ!',
    chatServerHtml: '<span style="color:#ff6a6a">[сервер]</span> &gt; <em>Herobrine присоединился к игре</em>',
    craftingTitle: '◆ КРАФТ · АЛМАЗНАЯ КИРКА',
    bestiaryTitle: '◉ БЕСТИАРИЙ МОБОВ',
    mobZombie: 'Зомби',
    mobSkeleton: 'Скелет',
    mobVillager: 'Житель',
    levelLineHtml: 'УРОВЕНЬ <b>42</b> · ОПЫТ <b>820 / 1000</b> · <span style="color:var(--diamond)">▲ stage5</span>',
  },
  zh: {
    title: 'bentoo — 单人游戏 · 新的世界（stage5）',
    description: 'Bentoo —— 易于上手的 Gentoo Linux Stage5。挖掘。合成。编译。',
    tabHome: '◉ BENTOO | 首页',
    tabForum: '论坛',
    fpsStableLabel: 'T：稳定',
    blockLabel: '方块',
    biomeLabel: '生物群系',
    biomeValue: '森林',
    biomeStatus: '和平',
    lightLabel: '光照',
    lightValue: '15（天空 15，方块 0）',
    taglineHtml: '易于上手的 GENTOO LINUX <b>STAGE5</b>',
    btnContact: '联系 · 多人游戏',
    btnNotify: '通知我 · 红石',
    chatNotchHtml: '<span class="you">&lt;<b>Notch</b>&gt;</span> &gt; 欢迎来到 Bentoo！按 F3 打开调试界面。',
    chatSteveHtml: '<span class="steve">&lt;<b>Steve</b>&gt;</span> &gt; 我在 Y=11 找到了钻石。耶，<b>科学</b>。',
    chatCreeperHtml: '<span class="creeper">&lt;<b>Creeper</b>&gt;</span> &gt; <em>嘶嘶嘶嘶嘶……</em> 轰！',
    chatServerHtml: '<span style="color:#ff6a6a">[服务器]</span> &gt; <em>Herobrine 加入了游戏</em>',
    craftingTitle: '◆ 合成 · 钻石镐',
    bestiaryTitle: '◉ 生物图鉴',
    mobZombie: '僵尸',
    mobSkeleton: '骷髅',
    mobVillager: '村民',
    levelLineHtml: '等级 <b>42</b> · 经验 <b>820 / 1000</b> · <span style="color:var(--diamond)">▲ stage5</span>',
  },
};
