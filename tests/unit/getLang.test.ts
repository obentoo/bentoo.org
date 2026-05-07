import { describe, it, expect } from 'vitest';
import { getLang } from '../../src/utils/getLang';

describe('getLang', () => {
  it('returns en for /', () => {
    expect(getLang('/')).toBe('en');
  });

  it('returns pt for /pt (no trailing slash)', () => {
    expect(getLang('/pt')).toBe('pt');
  });

  it('returns pt for /pt/', () => {
    expect(getLang('/pt/')).toBe('pt');
  });

  it('returns en for /v/mario/', () => {
    expect(getLang('/v/mario/')).toBe('en');
  });

  it('returns pt for /pt/v/mario/', () => {
    expect(getLang('/pt/v/mario/')).toBe('pt');
  });

  it('returns en for /privacy', () => {
    expect(getLang('/privacy')).toBe('en');
  });

  it('returns pt for /pt/privacy', () => {
    expect(getLang('/pt/privacy')).toBe('pt');
  });

  it('does not match /ptx (only /pt or /pt/ prefix)', () => {
    expect(getLang('/ptx/something')).toBe('en');
  });

  it('returns es for /es', () => {
    expect(getLang('/es')).toBe('es');
  });

  it('returns es for /es/', () => {
    expect(getLang('/es/')).toBe('es');
  });

  it('returns es for /es/v/mario/', () => {
    expect(getLang('/es/v/mario/')).toBe('es');
  });

  it('returns es for /es/privacy', () => {
    expect(getLang('/es/privacy')).toBe('es');
  });

  it('does not match /espanol (only /es or /es/ prefix)', () => {
    expect(getLang('/espanol/something')).toBe('en');
  });
});
