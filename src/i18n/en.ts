import type { Strings } from './types';

export const strings = {
  subscribePlaceholder: 'your@email.com',
  subscribeButton: 'notify me',
  successMsg: 'Check your inbox to confirm.',
  errorMsg: 'Please try again in a moment.',
  privacyConsent: 'By subscribing you agree to our privacy policy',
  privacyLinkLabel: 'privacy',
  languageToggleLabel: 'en',
  footerCopyright: 'handcrafted, source-first · © 2026 bentoo.org',
  privacyPageTitle: 'Privacy',
  privacyPageBody: `Bentoo respects your privacy and collects only the minimum data needed to announce the launch.

What we collect. If you submit your email via the subscribe form, that email is sent directly to Buttondown, our email list provider. We also receive anonymous, aggregated pageview counts from Cloudflare Web Analytics (no IP storage, no cross-site tracking, no cookies).

Purpose. Your email is used solely to notify you when Bentoo launches. Anonymous pageview counts help us understand which variants resonate.

Retention. Buttondown retains your email until you unsubscribe via the one-click link in every email. Cloudflare Web Analytics retains only aggregated counters, never personal data.

localStorage. This site uses two localStorage keys on your device, never synced to a server: "bentoo-variant" (the visual variant assigned to your session, with a 24-hour TTL) and "bentoo-lang" (your language preference, with a 24-hour TTL). You can clear them at any time via your browser's site-data controls.

Contact. For data access, deletion, or any privacy request, write to founder@bentoo.org.`,
  notFoundTitle: 'Not found',
  notFoundBody: 'This page does not exist — return to the landing.',
  notFoundBackLabel: '← back to the landing',
  shuffleAria: 'shuffle homepage variant',
  shuffleTip: 'shuffle theme',
  languageMenuLabel: 'switch language',
  noscriptVariantsHint: 'JavaScript disabled. Please visit one of:',
  loaderAriaLabel: 'loading',
  indexTitle: 'bentoo — loading',
  indexDescription: 'Bentoo is a user-friendly Stage5 of Gentoo Linux.',
  privacyPageDescription:
    'How Bentoo handles your data on the pre-launch site.',
  backLink: '← back',
} as const satisfies Strings;
