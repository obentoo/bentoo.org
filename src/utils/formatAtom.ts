// Human-readable package atoms for the notice pages (story 002, R5.1).
import type { Affects } from '~/content/noticeSchema';

type AffectsEntry = Affects[number];

/** One entry as a line: `>=dev-libs/foo-1.2 and <dev-libs/foo-2 (slot 1)`. */
function formatEntry({ cp, slot, ranges }: AffectsEntry): string {
  const versions =
    ranges.length === 0 ? `${cp} (any version)` : ranges.map(({ op, ver }) => `${op}${cp}-${ver}`).join(' and ');
  return slot === undefined ? versions : `${versions} (slot ${slot})`;
}

/**
 * One human-readable line per `affects` entry, in order. Entries are never
 * merged: the same package in two slots stays two lines.
 */
export function formatAtom(affects: Affects): string[] {
  return affects.map(formatEntry);
}
