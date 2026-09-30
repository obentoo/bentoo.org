// Story 002, Task 2.2 — the collection and the identity check (R2.1, R2.3, R2.4).
import { describe, it, expect, afterEach, vi } from 'vitest';
import path from 'node:path';
import { noticeSchema } from '~/content/noticeSchema';
import { assertIdentity, type Notice } from '~/utils/feed';

// The collection definition is inspected, not run: defineCollection is the
// identity and glob() returns the options it was given.
vi.mock('astro:content', async () => ({
  defineCollection: (c: unknown) => c,
  z: (await import('astro/zod')).z,
}));
vi.mock('astro/loaders', () => ({
  glob: (options: unknown) => ({ name: 'glob', options }),
}));

function notice(id: string): Notice {
  return noticeSchema.parse({
    id,
    type: 'news',
    severity: 'info',
    title: `title of ${id}`,
    summary: 'summary',
    body: 'body',
    published: '2026-10-02T14:00:00Z',
    updated: '2026-10-02T14:00:00Z',
  });
}

/** An entry as the collection yields it: `id` comes from the file name. */
const entry = (fileId: string, dataId: string = fileId) => ({ id: fileId, data: notice(dataId) });

function thrown(fn: () => void): Error {
  try {
    fn();
  } catch (e) {
    return e as Error;
  }
  throw new Error('expected a throw, got none');
}

describe('an id must equal its file name (R2.3)', () => {
  // Hostile half first: ids that a normalising comparison would wrongly match.
  it.each([
    ['2026-10-02-gtk-fix', '2026-10-02-gtk+-fix'],
    ['2026-10-02-foo-bar', '2026-10-02-foo_bar'],
    ['2026-10-02-foo', '2026-10-03-foo'],
  ])('file %s holding id %s fails naming both', (fileId, dataId) => {
    const err = thrown(() => assertIdentity([entry(fileId, dataId)]));
    expect(err.message).toContain(fileId);
    expect(err.message).toContain(dataId);
  });

  it('a mismatch is caught wherever it sits in the collection', () => {
    const err = thrown(() =>
      assertIdentity([
        entry('2026-10-01-a'),
        entry('2026-10-02-b'),
        entry('2026-10-03-gtk-fix', '2026-10-03-gtk+-fix'),
      ])
    );
    expect(err.message).toContain('2026-10-03-gtk-fix');
    expect(err.message).toContain('2026-10-03-gtk+-fix');
  });

  it.each(['2026-10-02-gtk+-fix', '2026-10-02-a_b', '2026-10-02-plain'])(
    'file %s holding the same id passes',
    (id) => {
      expect(() => assertIdentity([entry(id)])).not.toThrow();
    }
  );

  it('an empty collection passes', () => {
    expect(() => assertIdentity([])).not.toThrow();
  });
});

describe('no two notices share an id (R2.4)', () => {
  // Hostile half first: distinct ids differing only in "+", "-", "_" or a
  // missing separator must not be taken for duplicates.
  it('ids that differ only in punctuation are distinct', () => {
    expect(() =>
      assertIdentity([
        entry('2026-10-02-gtk+-fix'),
        entry('2026-10-02-gtk-fix'),
        entry('2026-10-02-gtk_fix'),
        entry('2026-10-02-gtkfix'),
      ])
    ).not.toThrow();
  });

  it('two entries carrying the same id fail naming the id', () => {
    const err = thrown(() =>
      assertIdentity([entry('2026-10-02-dup'), entry('2026-10-02-other'), entry('2026-10-02-dup')])
    );
    expect(err.message).toContain('2026-10-02-dup');
  });
});

describe('the notices collection (R2.1, R2.3)', () => {
  // noticesDir() is read when content.config is evaluated, so every case
  // re-imports it under its own environment.
  async function notices(env: Record<string, string> = {}) {
    vi.resetModules();
    vi.stubEnv('NOTICES_DIR', '');
    vi.stubEnv('PUBLIC_IS_PRODUCTION', '');
    for (const [k, v] of Object.entries(env)) vi.stubEnv(k, v);
    const { collections } = await import('~/content.config');
    return (collections as Record<string, any>).notices;
  }
  const baseOf = async (env?: Record<string, string>) =>
    path.resolve(String((await notices(env)).loader.options.base));

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  // Any existing directory other than src/content/notices will do.
  const FIXTURE_DIR = path.resolve('src/utils');
  const REAL_DIR = path.resolve('src/content/notices');

  it('NOTICES_DIR redirects the loader outside production', async () => {
    expect(await baseOf({ NOTICES_DIR: FIXTURE_DIR })).toBe(FIXTURE_DIR);
  });

  // Hostile half: fixture ids must never reach a production build, since
  // published ids are permanent.
  it('NOTICES_DIR is ignored when PUBLIC_IS_PRODUCTION=true', async () => {
    expect(await baseOf({ NOTICES_DIR: FIXTURE_DIR, PUBLIC_IS_PRODUCTION: 'true' })).toBe(REAL_DIR);
  });

  it('a NOTICES_DIR naming a missing directory fails, naming it', async () => {
    const missing = path.resolve('no-such-notices-dir-002');
    await expect(notices({ NOTICES_DIR: missing })).rejects.toThrow(missing);
  });

  it('validates every entry with noticeSchema', async () => {
    expect((await notices()).schema).toBe(noticeSchema);
  });

  it('loads YAML files from src/content/notices', async () => {
    const { options } = (await notices()).loader;
    expect(String(options.base).replace(/\/$/, '')).toMatch(/(^|\/)src\/content\/notices$/);
    expect(String(options.pattern)).toMatch(/\.yaml/);
  });

  // The default id generator slugifies file names and drops "+", which would
  // merge 2026-10-02-gtk+-fix into 2026-10-02-gtk-fix.
  it('uses the file name verbatim as the collection id', async () => {
    const { generateId } = (await notices()).loader.options;
    expect(typeof generateId).toBe('function');
    const idOf = (entryName: string): string =>
      generateId({ entry: entryName, base: new URL('file:///site/src/content/notices/'), data: {} });

    const names = [
      '2026-10-02-gtk+-fix.yaml',
      '2026-10-02-gtk-fix.yaml',
      '2026-10-02-gtk_fix.yaml',
      '2026-10-02-gtkfix.yaml',
    ];
    expect(names.map(idOf)).toEqual([
      '2026-10-02-gtk+-fix',
      '2026-10-02-gtk-fix',
      '2026-10-02-gtk_fix',
      '2026-10-02-gtkfix',
    ]);
    expect(idOf('2026-10-02-foo.yaml')).toBe('2026-10-02-foo');
  });
});
