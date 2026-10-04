// security.txt (RFC 9116) points researchers at the private reporting form.
import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const SECURITY_TXT = path.join(ROOT, 'public/.well-known/security.txt');

/** Field name -> values, as RFC 9116 section 2.4 parses them. */
function fields(text: string): Map<string, string[]> {
  const out = new Map<string, string[]>();
  for (const line of text.split(/\r?\n/)) {
    const m = line.match(/^([A-Za-z-]+):\s*(.+)$/);
    if (!m) continue;
    const name = m[1].toLowerCase();
    out.set(name, [...(out.get(name) ?? []), m[2].trim()]);
  }
  return out;
}

describe('public/.well-known/security.txt (RFC 9116)', () => {
  const text = (): string => readFileSync(SECURITY_TXT, 'utf8');

  it('exists', () => {
    expect(existsSync(SECURITY_TXT)).toBe(true);
  });

  it('names an https Contact', () => {
    const contact = fields(text()).get('contact') ?? [];
    expect(contact.length).toBeGreaterThan(0);
    for (const c of contact) expect(c.startsWith('https://') || c.startsWith('mailto:'), c).toBe(true);
  });

  // Hostile: an expired file tells researchers the contact is stale. When this fails, renew Expires.
  it('has exactly one Expires, in the future and at most a year ahead', () => {
    const expires = fields(text()).get('expires') ?? [];
    expect(expires).toHaveLength(1);
    const when = Date.parse(expires[0]);
    expect(Number.isNaN(when), expires[0]).toBe(false);
    expect(when, `Expires ${expires[0]} has passed`).toBeGreaterThan(Date.now());
    expect(when - Date.now()).toBeLessThanOrEqual(366 * 24 * 60 * 60 * 1000);
  });

  it('Canonical is the file\'s own production URL', () => {
    expect(fields(text()).get('canonical')).toEqual(['https://obentoo.org/.well-known/security.txt']);
  });
});
