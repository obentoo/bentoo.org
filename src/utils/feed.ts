// Feed builders (story 002, R3, R4): pure rendering of validated notices.
import type { Notice } from '../content/noticeSchema';

export type { Notice };

/**
 * Fails the build when a notice's `id` differs from its file name (R2.3) or two
 * notices share an `id` (R2.4). `entries` are collection entries, whose `id` is
 * the file name without `.yaml`. Ids are compared verbatim: "+", "-" and "_"
 * are significant.
 */
export function assertIdentity(entries: { id: string; data: Notice }[]): void {
  const fileById = new Map<string, string>();
  for (const { id: fileId, data } of entries) {
    if (data.id !== fileId) {
      throw new Error(`notice ${fileId}.yaml: id "${data.id}" differs from file name "${fileId}"`);
    }
    const first = fileById.get(data.id);
    if (first !== undefined) {
      throw new Error(`notices ${first}.yaml and ${fileId}.yaml share id "${data.id}"`);
    }
    fileById.set(data.id, fileId);
  }
}
