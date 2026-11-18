import type { Strings } from './types';

export const strings = {
  subscribePlaceholder: 'ваш@email.com',
  subscribeButton: 'уведомить меня',
  successMsg: 'Проверьте почту, чтобы подтвердить подписку.',
  errorMsg: 'Повторите попытку чуть позже.',
  privacyConsent: 'Подписываясь, вы соглашаетесь с нашей политикой конфиденциальности',
  privacyLinkLabel: 'конфиденциальность',
  languageToggleLabel: 'ru',
  footerCopyright: 'ручная работа, исходный код прежде всего · © 2026 obentoo.org',
  privacyPageTitle: 'Конфиденциальность',
  privacyPageBody: `Bentoo уважает вашу конфиденциальность и собирает только минимум данных, необходимых, чтобы сообщить о запуске.

Что мы собираем. Если вы отправите свой адрес электронной почты через форму подписки, он передаётся напрямую в Buttondown — сервис, через который мы ведём список рассылки. Мы также получаем анонимную агрегированную статистику просмотров страниц от Cloudflare Web Analytics (без хранения IP-адресов, без межсайтового отслеживания, без cookie).

Цель. Ваш адрес электронной почты используется только для того, чтобы уведомить вас о запуске Bentoo. Анонимная статистика просмотров помогает нам понять, какие варианты оформления находят отклик.

Хранение. Buttondown хранит ваш адрес, пока вы не отпишетесь по ссылке отписки в один клик, которая есть в каждом письме. Cloudflare Web Analytics хранит только агрегированные счётчики и никогда — персональные данные.

localStorage. Этот сайт хранит на вашем устройстве два ключа localStorage, которые никогда не синхронизируются с сервером: "bentoo-variant" (визуальный вариант, назначенный вашему сеансу, с TTL 24 часа) и "bentoo-lang" (выбранный вами язык, с TTL 24 часа). Вы можете удалить их в любой момент в настройках данных сайтов вашего браузера.

Контакты. С запросами на доступ к данным, их удаление или любыми другими вопросами о конфиденциальности пишите на contact@obentoo.org.`,
  notFoundTitle: 'Страница не найдена',
  notFoundBody: 'Такой страницы нет — вернитесь на главную.',
  notFoundBackLabel: '← на главную',
  shuffleAria: 'сменить вариант главной страницы',
  shuffleTip: 'сменить тему',
  languageMenuLabel: 'сменить язык',
  noscriptVariantsHint: 'JavaScript отключён. Откройте один из вариантов:',
  loaderAriaLabel: 'загрузка',
  indexTitle: 'bentoo — загрузка',
  indexDescription: 'Bentoo — удобный Stage5 Gentoo Linux.',
  privacyPageDescription: 'Как Bentoo обращается с вашими данными на сайте до запуска.',
  backLink: '← назад',
  noticesTitle: 'Уведомления',
  noticesIntro: 'Бюллетени безопасности, релизы и новости Bentoo; сначала недавно обновлённые. Текст уведомлений публикуется на английском языке.',
  noticeType_security: 'Безопасность',
  noticeType_release: 'Релиз',
  noticeType_news: 'Новости',
  noticeType_announcement: 'Объявление',
  noticeSeverity_info: 'Информация',
  noticeSeverity_warning: 'Предупреждение',
  noticeSeverity_critical: 'Критично',
  noticeAffects: 'Затронутые пакеты',
  noticePublished: 'Опубликовано',
  noticeUpdated: 'Обновлено',
  noticesEmpty: 'Уведомлений пока нет.',
  noticesFeedLinks: 'Подпишитесь на ленту уведомлений:',
} as const satisfies Strings;
