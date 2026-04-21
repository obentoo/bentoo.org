import { VARIANTS, DEFAULT_VARIANT, isVariant } from '~/data/variants';

const TTL_MS = 24 * 60 * 60 * 1000;
const VARIANT_KEY = 'bentoo-variant';
const VARIANT_EXP_KEY = 'bentoo-variant-expires';
const LANG_KEY = 'bentoo-lang';
const LANG_EXP_KEY = 'bentoo-lang-expires';

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

export function runRotator(): void {
  try {
    const url = new URL(window.location.href);
    const isPtTree = url.pathname === '/pt' || url.pathname.startsWith('/pt/');
    const prefix = isPtTree ? '/pt' : '';

    // (1) ?v=<slug> override
    const vParam = url.searchParams.get('v');
    if (vParam && isVariant(vParam)) {
      persistVariant(vParam);
      window.location.replace(`${prefix}/v/${vParam}/${preservedSearch(url)}`);
      return;
    }

    // (4) Root /: navigator.language or stored bentoo-lang pt → redirect to /pt/
    if (!isPtTree) {
      const storedLang = readStored(LANG_KEY, LANG_EXP_KEY);
      const navLang = (window.navigator.language || '').toLowerCase();
      const shouldRedirectPt =
        storedLang === 'pt' ||
        (!storedLang && navLang.startsWith('pt'));
      if (shouldRedirectPt) {
        window.location.replace(`/pt/${url.search || ''}`);
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
      const isPtTree =
        window.location.pathname === '/pt' ||
        window.location.pathname.startsWith('/pt/');
      const prefix = isPtTree ? '/pt' : '';
      window.location.replace(`${prefix}/v/${DEFAULT_VARIANT}/`);
    } catch {
      /* swallow */
    }
  }
}
