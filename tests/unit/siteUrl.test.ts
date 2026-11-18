import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  rootUrl,
  canonicalForVariant,
  localizedPath,
} from '../../src/utils/siteUrl';

describe('rootUrl', () => {
  beforeEach(() => {
    vi.stubEnv('PUBLIC_SITE_URL', 'https://obentoo.org');
  });
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('returns /  for en', () => {
    expect(rootUrl('en')).toBe('https://obentoo.org/');
  });

  it('returns /pt/ for pt', () => {
    expect(rootUrl('pt')).toBe('https://obentoo.org/pt/');
  });

  it('returns /es/ for es', () => {
    expect(rootUrl('es')).toBe('https://obentoo.org/es/');
  });

  it('falls back to https://obentoo.org when PUBLIC_SITE_URL is unset', () => {
    vi.stubEnv('PUBLIC_SITE_URL', '');
    expect(rootUrl('en')).toBe('https://obentoo.org/');
  });

  it('strips trailing slash from PUBLIC_SITE_URL', () => {
    vi.stubEnv('PUBLIC_SITE_URL', 'https://preview.obentoo.org/');
    expect(rootUrl('en')).toBe('https://preview.obentoo.org/');
    expect(rootUrl('pt')).toBe('https://preview.obentoo.org/pt/');
  });
});

describe('localizedPath', () => {
  it('default → pt: /v/mario/ → /pt/v/mario/', () => {
    expect(localizedPath('/v/mario/', 'pt')).toBe('/pt/v/mario/');
  });

  it('default → es: /v/mario/ → /es/v/mario/', () => {
    expect(localizedPath('/v/mario/', 'es')).toBe('/es/v/mario/');
  });

  it('pt → es: /pt/v/mario/ → /es/v/mario/', () => {
    expect(localizedPath('/pt/v/mario/', 'es')).toBe('/es/v/mario/');
  });

  it('es → pt: /es/privacy → /pt/privacy', () => {
    expect(localizedPath('/es/privacy', 'pt')).toBe('/pt/privacy');
  });

  it('pt → en (default): /pt/v/mario/ → /v/mario/', () => {
    expect(localizedPath('/pt/v/mario/', 'en')).toBe('/v/mario/');
  });

  it('default → default no-op: / → /', () => {
    expect(localizedPath('/', 'en')).toBe('/');
  });

  it('default → es root: / → /es/', () => {
    expect(localizedPath('/', 'es')).toBe('/es/');
  });

  it('handles /pt (no trailing slash) → /es/', () => {
    expect(localizedPath('/pt', 'es')).toBe('/es/');
  });
});

describe('canonicalForVariant', () => {
  beforeEach(() => {
    vi.stubEnv('PUBLIC_SITE_URL', 'https://obentoo.org');
  });
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('returns language root for en variant', () => {
    expect(canonicalForVariant('mario', 'en')).toBe('https://obentoo.org/');
  });

  it('returns language root for pt variant', () => {
    expect(canonicalForVariant('mario', 'pt')).toBe('https://obentoo.org/pt/');
  });

  it('returns language root for es variant', () => {
    expect(canonicalForVariant('mario', 'es')).toBe('https://obentoo.org/es/');
  });
});
