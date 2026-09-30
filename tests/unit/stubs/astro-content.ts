// Stand-in for the `astro:content` virtual module, which only exists inside an
// Astro build. vitest.config.ts aliases `astro:content` here so modules that
// import it can load; tests replace it with `vi.mock('astro:content', ...)`.
export { z } from 'astro/zod';

export const defineCollection = <T>(config: T): T => config;

/** An empty collection unless a test mocks `astro:content`. */
export const getCollection = async (_name: string, _filter?: (entry: unknown) => boolean): Promise<unknown[]> => [];
