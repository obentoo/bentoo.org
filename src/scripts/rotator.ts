import { VARIANTS, DEFAULT_VARIANT, isVariant } from '~/data/variants';
import { DEFAULT_LOCALE, LOCALES, type Lang } from '~/utils/getLang';

const TTL_MS = 24 * 60 * 60 * 1000;
const VARIANT_KEY = 'bentoo-variant';
const VARIANT_EXP_KEY = 'bentoo-variant-expires';
const LANG_KEY = 'bentoo-lang';
const LANG_EXP_KEY = 'bentoo-lang-expires';

const NON_DEFAULT_LOCALES: Lang[] = LOCALES.filter((l) => l !== DEFAULT_LOCALE);

function safeGet(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSet(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // private mode — ignore
  }
}

function readStored(key: string, expKey: string): string | null {
  const val = safeGet(key);
  const exp = safeGet(expKey);
  if (!val || !exp) return null;
  const expNum = Number(exp);
  if (!Number.isFinite(expNum) || expNum <= Date.now()) return null;
  return val;
}

function persistVariant(slug: string): void {
  safeSet(VARIANT_KEY, slug);
  safeSet(VARIANT_EXP_KEY, String(Date.now() + TTL_MS));
}

function pickRandom(): string {
  const idx = Math.floor(Math.random() * VARIANTS.length);
  return VARIANTS[idx] ?? DEFAULT_VARIANT;
}

function preservedSearch(url: URL): string {
  const params = new URLSearchParams(url.searchParams);
  params.delete('v');
  const qs = params.toString();
  return qs ? `?${qs}` : '';
}

function detectPrefix(pathname: string): string {
  for (const lang of NON_DEFAULT_LOCALES) {
    const px = `/${lang}`;
    if (pathname === px || pathname.startsWith(`${px}/`)) return px;
  }
  return '';
}

function pickRedirectLocale(stored: string | null, navLang: string): Lang | null {
  for (const lang of NON_DEFAULT_LOCALES) {
    if (stored === lang) return lang;
  }
  if (stored) return null;
  for (const lang of NON_DEFAULT_LOCALES) {
    if (navLang.startsWith(lang)) return lang;
  }
  return null;
}

export function runRotator(): void {
  try {
    const url = new URL(window.location.href);
    const prefix = detectPrefix(url.pathname);
    const isDefaultTree = prefix === '';

    // (1) ?v=<slug> override
    const vParam = url.searchParams.get('v');
    if (vParam && isVariant(vParam)) {
      persistVariant(vParam);
      window.location.replace(`${prefix}/v/${vParam}/${preservedSearch(url)}`);
      return;
    }

    // (4) Default tree (/): redirect to /<lang>/ if stored bentoo-lang or
    // navigator.language matches a non-default locale.
    if (isDefaultTree) {
      const storedLang = readStored(LANG_KEY, LANG_EXP_KEY);
      const navLang = (window.navigator.language || '').toLowerCase();
      const target = pickRedirectLocale(storedLang, navLang);
      if (target) {
        window.location.replace(`/${target}/${url.search || ''}`);
        return;
      }
    }

    // (3) Stored variant or random
    const stored = readStored(VARIANT_KEY, VARIANT_EXP_KEY);
    let slug: string;
    if (stored && isVariant(stored)) {
      slug = stored;
    } else {
      slug = pickRandom();
      persistVariant(slug);
    }

    window.location.replace(`${prefix}/v/${slug}/${preservedSearch(url)}`);
  } catch {
    // (6) outer catch — deterministic fallback; wrapped in a second try so
    // even a broken window.location can never escape the rotator.
    try {
      const prefix = detectPrefix(window.location.pathname);
      window.location.replace(`${prefix}/v/${DEFAULT_VARIANT}/`);
    } catch {
      /* swallow */
    }
  }
}
