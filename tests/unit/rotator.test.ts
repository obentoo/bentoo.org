import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { runRotator } from '../../src/scripts/rotator';
import { VARIANTS } from '../../src/data/variants';

type LocationLike = {
  href: string;
  pathname: string;
  search: string;
  replace: ReturnType<typeof vi.fn>;
};

function setLocation(href: string): LocationLike {
  const u = new URL(href);
  const loc: LocationLike = {
    href,
    pathname: u.pathname,
    search: u.search,
    replace: vi.fn(),
  };
  Object.defineProperty(window, 'location', {
    value: loc,
    writable: true,
    configurable: true,
  });
  return loc;
}

function setNavLang(lang: string) {
  Object.defineProperty(window.navigator, 'language', {
    value: lang,
    configurable: true,
  });
}

describe('rotator', () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.restoreAllMocks();
    vi.spyOn(Math, 'random').mockReturnValue(0); // deterministic: picks VARIANTS[0]
    setNavLang('en-US');
  });

  afterEach(() => {
    window.localStorage.clear();
  });

  it('(1) first visit: random pick, persists variant + TTL, redirects to /v/<slug>/', () => {
    const loc = setLocation('https://bentoo.org/');
    runRotator();
    const slug = VARIANTS[0];
    expect(loc.replace).toHaveBeenCalledWith(`/v/${slug}/`);
    expect(window.localStorage.getItem('bentoo-variant')).toBe(slug);
    const exp = Number(window.localStorage.getItem('bentoo-variant-expires'));
    expect(exp).toBeGreaterThan(Date.now());
    expect(exp).toBeLessThanOrEqual(Date.now() + 24 * 60 * 60 * 1000 + 1000);
  });

  it('(2) sticky revisit: stored slug reused without re-roll', () => {
    window.localStorage.setItem('bentoo-variant', 'mario');
    window.localStorage.setItem(
      'bentoo-variant-expires',
      String(Date.now() + 10_000)
    );
    const loc = setLocation('https://bentoo.org/');
    runRotator();
    expect(loc.replace).toHaveBeenCalledWith('/v/mario/');
    expect(window.localStorage.getItem('bentoo-variant')).toBe('mario');
  });

  it('(3) expired TTL: re-rolls + persists new', () => {
    window.localStorage.setItem('bentoo-variant', 'mario');
    window.localStorage.setItem(
      'bentoo-variant-expires',
      String(Date.now() - 10_000)
    );
    const loc = setLocation('https://bentoo.org/');
    runRotator();
    const slug = VARIANTS[0];
    expect(loc.replace).toHaveBeenCalledWith(`/v/${slug}/`);
    expect(window.localStorage.getItem('bentoo-variant')).toBe(slug);
  });

  it('(4) ?v=mario override: persists + redirects to variant', () => {
    const loc = setLocation('https://bentoo.org/?v=mario');
    runRotator();
    expect(loc.replace).toHaveBeenCalledWith('/v/mario/');
    expect(window.localStorage.getItem('bentoo-variant')).toBe('mario');
  });

  it('(5) ?v=unknown: silently ignored, falls through to random', () => {
    const loc = setLocation('https://bentoo.org/?v=nonexistent');
    runRotator();
    const slug = VARIANTS[0];
    expect(loc.replace).toHaveBeenCalledWith(`/v/${slug}/`);
    expect(window.localStorage.getItem('bentoo-variant')).toBe(slug);
  });

  it('(6) localStorage.setItem throw: falls through to random without persistence', () => {
    const origSet = Storage.prototype.setItem;
    Storage.prototype.setItem = () => {
      throw new Error('private mode');
    };
    const loc = setLocation('https://bentoo.org/');
    runRotator();
    const slug = VARIANTS[0];
    expect(loc.replace).toHaveBeenCalledWith(`/v/${slug}/`);
    Storage.prototype.setItem = origSet;
  });

  it('(7) root / with navigator.language=pt and no bentoo-lang → redirects to /pt/', () => {
    setNavLang('pt-BR');
    const loc = setLocation('https://bentoo.org/');
    runRotator();
    expect(loc.replace).toHaveBeenCalledWith('/pt/');
  });

  it('(8) root / with bentoo-lang=en stays in en tree despite navigator.language=pt', () => {
    setNavLang('pt-BR');
    window.localStorage.setItem('bentoo-lang', 'en');
    window.localStorage.setItem(
      'bentoo-lang-expires',
      String(Date.now() + 10_000)
    );
    const loc = setLocation('https://bentoo.org/');
    runRotator();
    const slug = VARIANTS[0];
    expect(loc.replace).toHaveBeenCalledWith(`/v/${slug}/`);
  });

  it('(9) outer catch: redirect to /v/v4/ or /pt/v/v4/ based on path prefix', () => {
    Object.defineProperty(window, 'location', {
      get() {
        throw new Error('location broken');
      },
      configurable: true,
    });
    expect(() => runRotator()).not.toThrow();
  });

  it('(9b) explicit pt prefix on exception: redirects to /pt/v/v4/', () => {
    const origURL = global.URL;
    const loc: LocationLike = {
      href: 'https://bentoo.org/pt/',
      pathname: '/pt/',
      search: '',
      replace: vi.fn(),
    };
    Object.defineProperty(window, 'location', {
      value: loc,
      configurable: true,
      writable: true,
    });
    global.URL = (() => {
      throw new Error('boom');
    }) as unknown as typeof URL;
    runRotator();
    expect(loc.replace).toHaveBeenCalledWith('/pt/v/v4/');
    global.URL = origURL;
  });

  it('(10) query string preservation: ?utm_source=x&v=mario → /v/mario/?utm_source=x (v stripped)', () => {
    const loc = setLocation('https://bentoo.org/?utm_source=x&v=mario');
    runRotator();
    expect(loc.replace).toHaveBeenCalledWith('/v/mario/?utm_source=x');
  });

  it('(10b) query string preservation on random path: ?utm_source=x → /v/<slug>/?utm_source=x', () => {
    const loc = setLocation('https://bentoo.org/?utm_source=x');
    runRotator();
    const slug = VARIANTS[0];
    expect(loc.replace).toHaveBeenCalledWith(`/v/${slug}/?utm_source=x`);
  });

  it('(11) pt tree: /pt/ first visit → /pt/v/<slug>/', () => {
    const loc = setLocation('https://bentoo.org/pt/');
    runRotator();
    const slug = VARIANTS[0];
    expect(loc.replace).toHaveBeenCalledWith(`/pt/v/${slug}/`);
  });
});
