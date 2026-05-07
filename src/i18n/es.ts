import type { Strings } from './types';

export const strings = {
  subscribePlaceholder: 'tu@email.com',
  subscribeButton: 'avísame',
  successMsg: 'Revisa tu correo electrónico para confirmarlo.',
  errorMsg: 'Inténtalo de nuevo en unos instantes.',
  privacyConsent: 'al suscribirte, aceptas nuestra política de privacidad',
  privacyLinkLabel: 'privacidad',
  languageToggleLabel: 'es',
  footerCopyright: 'hecho a mano, código abierto · © 2026 bentoo.org',
  privacyPageTitle: 'Privacidad',
  privacyPageBody: `Bentoo respeta tu privacidad y recopila únicamente los datos mínimos necesarios para anunciar el lanzamiento.

Qué recopilamos. Si envías tu correo electrónico a través del formulario de suscripción, ese correo se envía directamente a Buttondown, nuestro proveedor de listas. También recibimos recuentos anónimos y agregados de páginas vistas de Cloudflare Web Analytics (sin almacenamiento de IP, sin seguimiento entre sitios, sin cookies).

Finalidad. Tu correo electrónico solo se utilizará para notificarte el lanzamiento de Bentoo. Los recuentos anónimos nos ayudan a saber qué variantes funcionan mejor.

Conservación. Buttondown conserva tu correo electrónico hasta que te das de baja a través del enlace de un clic que aparece en todos los correos que enviamos. Cloudflare Web Analytics solo conserva recuentos agregados, nunca datos personales.

localStorage. Este sitio web utiliza dos claves de localStorage en tu dispositivo, que nunca se sincronizan con ningún servidor: "bentoo-variant" (la variante visual asignada a tu sesión, con un TTL de 24 horas) y "bentoo-lang" (tu preferencia de idioma, con un TTL de 24 horas). Puedes borrarlas en cualquier momento a través de los controles de datos del sitio de tu navegador.

Contacto. Para solicitudes de acceso, supresión o cualquier cuestión de privacidad, escribe a founder@bentoo.org.`,
  notFoundTitle: 'Página no encontrada',
  notFoundBody: 'Esta página no existe — vuelve a la página de inicio.',
  notFoundBackLabel: '← volver a la página de inicio',
  shuffleAria: 'cambiar variante de página',
  shuffleTip: 'cambiar tema',
  languageMenuLabel: 'cambiar idioma',
  noscriptVariantsHint: 'JavaScript deshabilitado. Visita una de estas variantes:',
  loaderAriaLabel: 'cargando',
  indexTitle: 'bentoo — cargando',
  indexDescription: 'Bentoo es un Stage5 fácil de usar de Gentoo Linux.',
  privacyPageDescription:
    'Cómo Bentoo trata tus datos en el sitio de pre-lanzamiento.',
  backLink: '← volver',
} as const satisfies Strings;
