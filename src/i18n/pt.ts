import type { Strings } from './types';

export const strings = {
  subscribePlaceholder: 'seu@email.com',
  subscribeButton: 'me avise',
  successMsg: 'Verifique seu email para confirmar.',
  errorMsg: 'Tente novamente em instantes.',
  privacyConsent: 'Ao inscrever-se, você concorda com nossa política de privacidade',
  privacyLinkLabel: 'privacidade',
  languageToggleLabel: 'pt-BR',
  footerCopyright: 'feito à mão, código aberto · © 2026 bentoo.org',
  privacyPageTitle: 'Privacidade',
  privacyPageBody: `A Bentoo respeita sua privacidade e coleta apenas o mínimo de dados necessário para anunciar o lançamento.

O que coletamos. Se você enviar seu email pelo formulário de inscrição, esse email vai diretamente para o Buttondown, nosso provedor de lista. Também recebemos contagens anônimas e agregadas de pageviews do Cloudflare Web Analytics (sem armazenamento de IP, sem rastreamento entre sites, sem cookies).

Finalidade. Seu email serve apenas para notificá-lo do lançamento da Bentoo. As contagens anônimas nos ajudam a entender quais variantes funcionam melhor.

Retenção. O Buttondown mantém seu email até você se descadastrar pelo link de um clique presente em todo email enviado. O Cloudflare Web Analytics mantém apenas contadores agregados, nunca dados pessoais.

localStorage. Este site usa duas chaves de localStorage no seu dispositivo, nunca sincronizadas com um servidor: "bentoo-variant" (a variante visual atribuída à sua sessão, com TTL de 24 horas) e "bentoo-lang" (sua preferência de idioma, com TTL de 24 horas). Você pode limpar ambas a qualquer momento pelos controles de dados de site do seu navegador.

Contato. Para solicitações de acesso, exclusão ou qualquer questão de privacidade, escreva para founder@bentoo.org.`,
  notFoundTitle: 'Página não encontrada',
  notFoundBody: 'Esta página não existe — volte para a página inicial.',
  notFoundBackLabel: '← voltar para a página inicial',
  shuffleAria: 'trocar versão da home',
  shuffleTip: 'trocar visual',
  languageMenuLabel: 'trocar idioma',
  noscriptVariantsHint: 'JavaScript desativado. Visite uma das variantes:',
  loaderAriaLabel: 'carregando',
  indexTitle: 'bentoo — carregando',
  indexDescription:
    'Bentoo é um Gentoo Linux (Stage5) amigável para o usuário.',
  privacyPageDescription:
    'Como a Bentoo trata seus dados no site de pré-lançamento.',
  backLink: '← voltar',
} as const satisfies Strings;
