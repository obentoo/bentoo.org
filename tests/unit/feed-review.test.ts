// Story 002, Task 3 review fixes: what the feed prints must agree with what a
// client can decode and re-derive (R3.4, R3.5).
import { describe, it, expect, afterEach, vi } from 'vitest';
import { sortNotices, type Notice } from '~/utils/feed';

afterEach(() => vi.unstubAllEnvs());

const at = (id: string, iso: string) =>
  ({ id, updated: new Date(iso), published: new Date(iso) }) as unknown as Notice;

describe('sortNotices orders by the second the feed prints (R3.5)', () => {
  it('breaks a same-second tie by id even when milliseconds differ', () => {
    const order = sortNotices([
      at('2026-09-30-a', '2026-09-30T10:00:00.100Z'),
      at('2026-09-30-z', '2026-09-30T10:00:00.900Z'),
    ]).map((n) => n.id);
    expect(order).toEqual(['2026-09-30-a', '2026-09-30-z']);
  });
});

describe('BUILD_TIME keeps expires inside RFC 3339 years (R3.4)', () => {
  const load = async (seconds: string) => {
    vi.resetModules();
    vi.stubEnv('NOTICES_BUILD_TIME', seconds);
    return import('~/utils/buildTime');
  };

  it('refuses a build time whose expires falls after 9999-12-31T23:59:59Z', async () => {
    await expect(load('300000000000')).rejects.toThrow(/NOTICES_BUILD_TIME/);
  });

  it('accepts the last build time whose expires is still in year 9999', async () => {
    const last = Date.UTC(9999, 11, 31, 23, 59, 59) / 1000 - 30 * 86400;
    const { BUILD_TIME } = await load(String(last));
    expect(BUILD_TIME.getTime()).toBe(last * 1000);
  });
});
