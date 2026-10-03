// The notices loader (story 002, R2.1, R2.3, R2.9): reads <base>/*.yaml with
// js-yaml's CORE_SCHEMA. Astro's own glob() parses YAML with the default schema,
// where an unquoted `2026-09-30 10:00:00` becomes a Date read as UTC and
// `0050-01-01T00:00:00Z` a Date in 1950 — values the schema can no longer tell
// from a valid timestamp. CORE_SCHEMA has no timestamp type, so both stay the
// strings the author wrote and meet noticeSchema's offset and year checks.
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Loader, LoaderContext } from 'astro/loaders';
import * as yaml from 'js-yaml';

export interface NoticesLoaderOptions {
  /** The notices directory, relative to the project root or absolute. */
  base: string;
  /** Which files are notices; informational, the loader reads `*.yaml`. */
  pattern: '*.yaml';
  /** The collection id of a file (`entry` is its name, e.g. `2026-10-02-foo.yaml`). */
  generateId: (options: { entry: string; base?: URL; data?: Record<string, unknown> }) => string;
}

export type NoticesLoader = Loader & { options: NoticesLoaderOptions };

/** `*.yaml` as a glob reads it: a regular, non-hidden file ending in `.yaml`. */
const isNoticeFile = (name: string): boolean => name.endsWith('.yaml') && !name.startsWith('.');

const isMapping = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

/** A path as an author finds it: project-relative inside the project, else absolute. */
function shownPath(root: string, file: string): string {
  const rel = path.relative(root, file);
  return rel === '' ? '.' : rel.startsWith('..') || path.isAbsolute(rel) ? file : rel.split(path.sep).join('/');
}

/** Whether a "<<" key appears anywhere in a parsed YAML value. */
function hasMergeKey(value: unknown): boolean {
  if (Array.isArray(value)) return value.some(hasMergeKey);
  if (value !== null && typeof value === 'object') {
    return Object.entries(value).some(([key, v]) => key === '<<' || hasMergeKey(v));
  }
  return false;
}

/** What YAML made of a document that should be a mapping, for the error. */
const reading = (value: unknown): string =>
  value === undefined || value === null ? 'nothing (an empty document)' : Array.isArray(value) ? 'a list' : `a ${typeof value}`;

export function noticesLoader(options: NoticesLoaderOptions): NoticesLoader {
  async function loadAll(context: LoaderContext, dir: string, root: string): Promise<void> {
    const { store, logger, parseData, generateDigest } = context;
    // Start from an empty store on every load: ids whose files are gone (a
    // deleted notice, the fixtures of an earlier NOTICES_DIR build) must never
    // stay published, and an empty directory must leave an empty collection.
    store.clear();

    const shown = shownPath(root, dir);
    let names: string[];
    try {
      const dirents = await readdir(dir, { withFileTypes: true });
      names = dirents.filter((d) => d.isFile() && isNoticeFile(d.name)).map((d) => d.name);
    } catch (err) {
      if ((err as NodeJS.ErrnoException).code !== 'ENOENT') {
        throw new Error(`cannot read the notices directory ${shown}`, { cause: err });
      }
      logger.warn(`The notices directory "${shown}" does not exist.`);
      return;
    }
    if (names.length === 0) {
      logger.warn(`No files found matching "${options.pattern}" in directory "${shown}"`);
      return;
    }

    for (const entry of names.sort()) {
      const filePath = path.join(dir, entry);
      // The store keeps the project-relative path, as Astro's glob() does.
      const relativePath = path.relative(root, filePath).split(path.sep).join('/');
      const shownFile = shownPath(root, filePath);
      const contents = await readFile(filePath, 'utf8');

      let data: unknown;
      try {
        data = yaml.load(contents, { schema: yaml.CORE_SCHEMA, filename: shownFile });
      } catch (err) {
        // js-yaml's message carries the line, the column and a code frame.
        throw new Error(`notice ${shownFile}: invalid YAML: ${(err as Error).message}`, { cause: err });
      }
      if (!isMapping(data)) {
        throw new Error(`notice ${shownFile}: must be a YAML mapping of notice fields, YAML read ${reading(data)}`);
      }

      // CORE_SCHEMA has no merge type, so `<<: *anchor` would reach the schema
      // as a literal "<<" key that z.object strips, silently dropping what the
      // anchor supplied (a slot, say).
      if (hasMergeKey(data)) {
        throw new Error(`notice ${shownFile}: YAML merge key "<<" is not supported; write the fields out`);
      }

      const id = options.generateId({ entry, data });
      // parseData runs the collection schema and, on failure, throws Astro's
      // InvalidContentEntryDataError naming the entry, the file and the field.
      const parsed = await parseData({ id, data, filePath });
      store.set({ id, data: parsed, filePath: relativePath, digest: generateDigest(contents) });
    }
  }

  return {
    name: 'notices-yaml',
    options,
    load: async (context) => {
      const root = fileURLToPath(context.config.root);
      const dir = path.resolve(root, options.base);
      await loadAll(context, dir, root);

      // `astro dev`: reload the whole directory when a notice file changes.
      const { watcher, logger } = context;
      if (!watcher) return;
      watcher.add(dir);
      const reload = async (changed: string) => {
        if (path.dirname(changed) !== dir || !isNoticeFile(path.basename(changed))) return;
        try {
          await loadAll(context, dir, root);
          logger.info(`Reloaded notices after a change to ${shownPath(root, changed)}`);
        } catch (err) {
          logger.error(`Failed to reload notices: ${(err as Error).message}`);
        }
      };
      watcher.on('add', reload);
      watcher.on('change', reload);
      watcher.on('unlink', reload);
    },
  };
}
