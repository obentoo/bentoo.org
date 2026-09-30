// Story 002, Task 2.2 review fixes — the project-owned notices loader (R2.1,
// R2.3, R2.9). It reads <noticesDir()>/*.yaml with js-yaml's CORE_SCHEMA, so an
// unquoted timestamp stays a string and meets the schema's offset and year
// checks instead of arriving as a Date the schema cannot question.
import { describe, it, expect, afterEach, beforeEach, vi } from 'vitest';
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { noticeSchema } from '~/content/noticeSchema';

type Entry = { id: string; data: Record<string, unknown>; filePath?: string; digest?: string };

const notice = (id: string, published: string) => `
id: ${id}
type: news
severity: info
title: Overlay news
summary: Something changed in the overlay.
body: Details.
published: ${published}
updated: "2026-10-02T14:00:00Z"
`;

let root: string;
let dir: string;

beforeEach(() => {
  root = mkdtempSync(path.join(tmpdir(), 'notices-loader-'));
  dir = path.join(root, 'notices');
  mkdirSync(dir);
});

afterEach(() => {
  rmSync(root, { recursive: true, force: true });
  vi.unstubAllEnvs();
});

const write = (file: string, text: string) => writeFileSync(path.join(dir, file), text);

/**
 * A LoaderContext whose parseData validates like Astro's: with noticeSchema,
 * throwing an error that names the entry, the file and every failing field.
 */
function contextFor(stale: string[] = []) {
  const calls: string[] = [];
  const entries = new Map<string, Entry>(stale.map((id) => [id, { id, data: {} }]));
  const raw = new Map<string, Record<string, unknown>>();
  const store = {
    clear: vi.fn(() => {
      calls.push('clear');
      entries.clear();
    }),
    set: vi.fn((e: Entry) => {
      calls.push(`set ${e.id}`);
      entries.set(e.id, e);
      return true;
    }),
    keys: () => [...entries.keys()],
    get: (id: string) => entries.get(id),
    delete: (id: string) => void entries.delete(id),
  };
  const context = {
    collection: 'notices',
    store,
    config: { root: pathToFileURL(root + path.sep) },
    logger: { warn: vi.fn(), info: vi.fn(), error: vi.fn(), debug: vi.fn() },
    generateDigest: (data: unknown) => `digest:${String(data).length}`,
    parseData: async ({ id, data, filePath }: { id: string; data: Record<string, unknown>; filePath?: string }) => {
      raw.set(id, data);
      const r = noticeSchema.safeParse(data);
      if (!r.success) {
        const fields = r.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ');
        throw new Error(`notices → ${id} (${filePath}) data does not match collection schema: ${fields}`);
      }
      return r.data;
    },
  };
  return { context, calls, entries, raw };
}

async function loader() {
  vi.resetModules();
  vi.stubEnv('PUBLIC_IS_PRODUCTION', '');
  vi.stubEnv('NOTICES_DIR', dir);
  const { collections } = await import('~/content.config');
  return (collections as Record<string, any>).notices.loader;
}

const QUOTED = '"2026-10-02T14:00:00Z"';

describe('the notices loader keeps the store honest (R2.3)', () => {
  it('clears the store before it sets any entry', async () => {
    write('2026-10-02-a.yaml', notice('2026-10-02-a', QUOTED));
    const { context, calls, entries } = contextFor(['2026-09-27-gui+tray']);

    await (await loader()).load(context);

    expect(calls[0]).toBe('clear');
    expect([...entries.keys()]).toEqual(['2026-10-02-a']);
  });

  it('an empty directory leaves an empty store, with a warning', async () => {
    const { context, entries } = contextFor(['2026-09-27-gui+tray', '2026-09-30-foo-cve']);

    await (await loader()).load(context);

    expect(context.store.clear).toHaveBeenCalled();
    expect(entries.size).toBe(0);
    expect(context.logger.warn).toHaveBeenCalled();
  });

  it('sets each entry under its file name verbatim, with a project-relative filePath and a digest', async () => {
    for (const id of ['2026-10-02-gtk+-fix', '2026-10-02-gtk_fix', '2026-10-02-gtk-fix']) {
      write(`${id}.yaml`, notice(id, QUOTED));
    }
    write('README.md', 'not a notice');
    const { context, entries } = contextFor();

    await (await loader()).load(context);

    expect([...entries.keys()].sort()).toEqual(['2026-10-02-gtk+-fix', '2026-10-02-gtk-fix', '2026-10-02-gtk_fix']);
    const e = entries.get('2026-10-02-gtk+-fix');
    expect(e?.filePath).toBe('notices/2026-10-02-gtk+-fix.yaml');
    expect(e?.digest).toMatch(/^digest:/);
    expect(e?.data.published).toBeInstanceOf(Date);
  });
});

describe('an unquoted timestamp meets the schema as written (R2.9)', () => {
  it('CORE_SCHEMA hands an unquoted timestamp to parseData as a string', async () => {
    write('2026-10-02-a.yaml', notice('2026-10-02-a', '2026-10-02T14:00:00Z'));
    const { context, raw } = contextFor();

    await (await loader()).load(context);

    expect(raw.get('2026-10-02-a')?.published).toBe('2026-10-02T14:00:00Z');
  });

  // Hostile half: the default YAML schema turns these into Dates the schema
  // cannot question — the first read as UTC, the second as the year 1900.
  it.each([
    ['an offset-less timestamp', '2026-09-30 10:00:00'],
    ['a year-0000 timestamp', '0000-12-31T00:00:00Z'],
  ])('%s written unquoted is refused, naming the file and published', async (_label, published) => {
    write('2026-10-02-bad.yaml', notice('2026-10-02-bad', published));
    const { context } = contextFor();

    const load = (await loader()).load(context);

    await expect(load).rejects.toThrow(/2026-10-02-bad\.yaml/);
    await expect(load).rejects.toThrow(/published/);
  });

  // Year 0050 is inside 0001-9999 (R2.9), so it is valid: the default schema's
  // fault was reading it as 1950 (Date.UTC maps years 0-99 to 1900-1999).
  it.each(['0050-01-01T00:00:00Z', "'0050-01-01T00:00:00Z'"])(
    'a year-0050 timestamp (%s) keeps the year 50',
    async (published) => {
      write('2026-10-02-old.yaml', notice('2026-10-02-old', published));
      const { context, entries } = contextFor();

      await (await loader()).load(context);

      expect((entries.get('2026-10-02-old')?.data.published as Date).getUTCFullYear()).toBe(50);
    }
  );

  it.each(['"2026-09-30T10:00:00Z"', '"2026-09-30T10:00:00+02:00"'])(
    'a quoted valid timestamp %s is accepted',
    async (published) => {
      write('2026-10-02-q.yaml', notice('2026-10-02-q', published));
      const { context, entries } = contextFor();

      await (await loader()).load(context);

      expect(entries.get('2026-10-02-q')?.data.published).toBeInstanceOf(Date);
    }
  );

  it('a quoted offset-less timestamp is refused, naming published', async () => {
    write('2026-10-02-q.yaml', notice('2026-10-02-q', '"2026-09-30T10:00:00"'));
    const { context } = contextFor();

    await expect((await loader()).load(context)).rejects.toThrow(/published/);
  });
});

describe('a notice file that is not a YAML mapping fails naming the file', () => {
  it('a YAML syntax error names the file', async () => {
    write('2026-10-02-broken.yaml', 'id: [unclosed\ntitle: x\n');
    const { context } = contextFor();

    await expect((await loader()).load(context)).rejects.toThrow(/2026-10-02-broken\.yaml/);
  });

  it.each([
    ['an empty file', ''],
    ['a list', '- a\n- b\n'],
  ])('%s names the file', async (_label, text) => {
    write('2026-10-02-empty.yaml', text);
    const { context } = contextFor();

    await expect((await loader()).load(context)).rejects.toThrow(/2026-10-02-empty\.yaml/);
  });
});

describe('a YAML merge key fails naming the file', () => {
  // CORE_SCHEMA has no merge type: `<<: *common` becomes a literal "<<" key,
  // which z.object strips — so a slot supplied through the anchor would vanish
  // and the notice would silently apply to every slot.
  it('refuses "<<" anywhere in the document, naming the file', async () => {
    write(
      '2026-10-02-merge.yaml',
      notice('2026-10-02-merge', QUOTED).replace('type: news', 'type: security') +
        'common: &c\n  slot: "1"\naffects:\n  - <<: *c\n    cp: dev-libs/foo\n    ranges: []\n',
    );
    const { context } = contextFor();

    await expect((await loader()).load(context)).rejects.toThrow(/2026-10-02-merge\.yaml.*merge key/);
  });
});
