import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { rootUrl, siblingPath, canonicalForVariant } from '../../src/utils/siteUrl';

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
});
