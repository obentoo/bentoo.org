import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  rootUrl,
  siblingPath,
  canonicalForVariant,
  localizedPath,
} from '../../src/utils/siteUrl';

describe('rootUrl', () => {
  beforeEach(() => {
    vi.stubEnv('PUBLIC_SITE_URL', 'https://bentoo.org');
  });
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('returns /  for en', () => {
    expect(rootUrl('en')).toBe('https://bentoo.org/');
  });

  it('returns /pt/ for pt', () => {
    expect(rootUrl('pt')).toBe('https://bentoo.org/pt/');
  });

  it('returns /es/ for es', () => {
    expect(rootUrl('es')).toBe('https://bentoo.org/es/');
  });

  it('falls back to https://bentoo.org when PUBLIC_SITE_URL is unset', () => {
    vi.stubEnv('PUBLIC_SITE_URL', '');
    expect(rootUrl('en')).toBe('https://bentoo.org/');
  });

  it('strips trailing slash from PUBLIC_SITE_URL', () => {
    vi.stubEnv('PUBLIC_SITE_URL', 'https://preview.bentoo.org/');
    expect(rootUrl('en')).toBe('https://preview.bentoo.org/');
    expect(rootUrl('pt')).toBe('https://preview.bentoo.org/pt/');
  });
});

describe('siblingPath', () => {
  it('maps /v/mario/ → /pt/v/mario/', () => {
    expect(siblingPath('/v/mario/')).toBe('/pt/v/mario/');
  });

  it('maps /pt/v/mario/ → /v/mario/', () => {
    expect(siblingPath('/pt/v/mario/')).toBe('/v/mario/');
  });

  it('maps / → /pt/', () => {
    expect(siblingPath('/')).toBe('/pt/');
  });

  it('maps /pt/ → /', () => {
    expect(siblingPath('/pt/')).toBe('/');
  });

  it('maps /pt → / (no trailing slash variant)', () => {
    expect(siblingPath('/pt')).toBe('/');
  });

  it('maps /privacy → /pt/privacy', () => {
    expect(siblingPath('/privacy')).toBe('/pt/privacy');
  });

  it('maps /pt/privacy → /privacy', () => {
    expect(siblingPath('/pt/privacy')).toBe('/privacy');
  });

  it('maps /es/v/mario/ → /v/mario/ (back to default)', () => {
    expect(siblingPath('/es/v/mario/')).toBe('/v/mario/');
  });

  it('maps /es/ → / (back to default)', () => {
    expect(siblingPath('/es/')).toBe('/');
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
    vi.stubEnv('PUBLIC_SITE_URL', 'https://bentoo.org');
  });
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('returns language root for en variant', () => {
    expect(canonicalForVariant('mario', 'en')).toBe('https://bentoo.org/');
  });

  it('returns language root for pt variant', () => {
    expect(canonicalForVariant('mario', 'pt')).toBe('https://bentoo.org/pt/');
  });

  it('returns language root for es variant', () => {
    expect(canonicalForVariant('mario', 'es')).toBe('https://bentoo.org/es/');
  });
});
