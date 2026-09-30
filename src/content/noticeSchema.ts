// The notice schema (story 002, R2): the one contract every notice YAML file
// must satisfy. Kept apart from `src/content.config.ts` so unit tests can
// import it without the Astro loader.
import { z } from 'astro/zod';

export const NOTICE_TYPES = ['security', 'release', 'news', 'announcement'] as const;
export const SEVERITIES = ['info', 'warning', 'critical'] as const;
export const RANGE_OPS = ['<', '<=', '=', '>=', '>'] as const;

/** GLEP 42 news item name: `YYYY-MM-DD-<short-name>` (R2.2). */
export const ID_PATTERN = /^(\d{4})-(\d{2})-(\d{2})-([a-z0-9+_-]{1,20})$/;
/** Gentoo version syntax, PMS 3.2 (R2.6). */
export const VERSION_PATTERN = /^\d+(\.\d+)*[a-z]?((_alpha|_beta|_pre|_rc|_p)\d*)*(-r\d+)?$/;

const CP_PATTERN = /^[A-Za-z0-9+_.-]+\/[A-Za-z0-9+_-]+$/;
/** A slot never carries a subslot: the tray compares slots only (R2.6). */
const SLOT_PATTERN = /^[A-Za-z0-9+_.-]+$/;

// Characters XML 1.0 cannot carry: C0 controls except tab and line feed, and
// the noncharacters U+FFFE/U+FFFF (R2.10, R4.3).
const XML_UNSAFE = /[\u0000-\u0008\u000B-\u001F\uFFFE\uFFFF]/;
// Title and summary are single-line fields (R2.12).
const LINE_BREAKING = /[\t\n]/;

const MIN_YEAR = 1;
const MAX_YEAR = 9999;

/** Length in Unicode code points, not UTF-16 code units (R2.11). */
const codePoints = (s: string): number => [...s].length;

const isBetween = (n: number, min: number, max: number): boolean => n >= min && n <= max;

/** How YAML typed a value that should have been a string, for the error. */
function yamlReading(value: unknown): string {
  if (value === null) return 'null (an empty value)';
  if (value instanceof Date) return 'a date';
  if (Array.isArray(value)) return 'a list';
  if (typeof value === 'number') return `the number ${value}`;
  return `a ${typeof value}`;
}

/**
 * A string whose type error tells a YAML author to quote the value: unquoted,
 * `ver: 1.0` reaches the schema as the number 1 (R2.1). A missing field keeps
 * zod's own message.
 */
const quoted = () =>
  z.string({
    error: (issue) =>
      issue.input === undefined ? undefined : `must be a quoted string (YAML read it as ${yamlReading(issue.input)})`,
  });

/** Free text that an XML document can carry verbatim (R2.10). */
const text = () =>
  quoted()
    .refine((s) => !XML_UNSAFE.test(s), {
      message: 'must not contain C0 control characters (other than tab and line feed) or U+FFFE/U+FFFF',
    })
    // A lone surrogate has no UTF-8 encoding: the feeds could not carry it.
    .refine((s) => s.isWellFormed(), { message: 'must not contain a lone UTF-16 surrogate' });

/** Single-line text of 1 to `max` code points (R2.11, R2.12). */
const line = (max: number) =>
  text()
    .refine((s) => !LINE_BREAKING.test(s), { message: 'must be a single line (no tab or line feed)' })
    .refine((s) => isBetween(codePoints(s), 1, max), {
      message: `must be 1 to ${max} characters (Unicode code points)`,
    });

/** True when the date round-trips through Date.UTC unchanged (R2.2). */
function isCalendarDate(year: number, month: number, day: number): boolean {
  const d = new Date(Date.UTC(year, month - 1, day));
  // Date.UTC maps years 0-99 to 1900-1999; setUTCFullYear pins the real year.
  d.setUTCFullYear(year, month - 1, day);
  return d.getUTCFullYear() === year && d.getUTCMonth() === month - 1 && d.getUTCDate() === day;
}

const noticeId = quoted()
  .regex(ID_PATTERN, { message: 'must be YYYY-MM-DD-<short-name>, short name 1-20 chars of [a-z0-9+_-]' })
  .refine(
    (id) => {
      const m = id.match(ID_PATTERN);
      return m !== null && isCalendarDate(Number(m[1]), Number(m[2]), Number(m[3]));
    },
    { message: 'must start with a valid calendar date' }
  );

const inYearRange = (year: number): boolean => isBetween(year, MIN_YEAR, MAX_YEAR);

const isDate = (value: unknown): value is Date => value instanceof Date && !Number.isNaN(value.getTime());

/**
 * An RFC 3339 timestamp with an explicit offset, coerced to a Date (R2.9).
 * The notices loader parses YAML with CORE_SCHEMA, so every timestamp arrives
 * as the string the author wrote; a Date is still accepted for callers that
 * build notices in code. An offset-less string is refused rather than read in
 * the build host's zone.
 */
const OFFSET_MESSAGE =
  'must be an RFC 3339 timestamp with an explicit offset (Z or ±hh:mm), e.g. "2026-09-30T10:00:00Z"';

const timestamp = z
  .union([z.date(), z.iso.datetime({ offset: true, error: OFFSET_MESSAGE })], {
    message: OFFSET_MESSAGE,
  })
  .transform((value, ctx) => {
    const date = typeof value === 'string' ? new Date(value) : value;
    // Both the written year and the instant's UTC year must stay in 0001-9999,
    // so the feeds never render an expanded (+010000) or year-0000 timestamp.
    const writtenYear = typeof value === 'string' ? Number(value.slice(0, 4)) : date.getUTCFullYear();
    if (Number.isNaN(date.getTime()) || !inYearRange(writtenYear) || !inYearRange(date.getUTCFullYear())) {
      ctx.addIssue({
        code: 'custom',
        input: value,
        message: `must have a year from 0001 to 9999, both as written and in UTC, got ${
          typeof value === 'string' ? value : value.toISOString()
        }`,
      });
      return z.NEVER;
    }
    return date;
  });

const rangeSchema = z.object({
  op: z.enum(RANGE_OPS),
  ver: quoted().regex(VERSION_PATTERN, { message: 'must be a Gentoo version (PMS 3.2)' }),
});

const affectsEntrySchema = z.object({
  cp: quoted().regex(CP_PATTERN, { message: 'must be category/package' }),
  slot: quoted().regex(SLOT_PATTERN, { message: 'must be a slot without a subslot' }).optional(),
  ranges: z.array(rangeSchema),
});

const affectsSchema = z.array(affectsEntrySchema).default([]);

/** Types that must name what they affect (R2.8). */
const NEEDS_AFFECTS: ReadonlySet<string> = new Set<(typeof NOTICE_TYPES)[number]>(['security', 'release']);

export const noticeSchema = z
  .object({
    id: noticeId,
    type: z.enum(NOTICE_TYPES),
    severity: z.enum(SEVERITIES),
    title: line(50),
    summary: line(300),
    body: text().min(1, { message: 'must not be empty' }),
    affects: affectsSchema,
    published: timestamp,
    updated: timestamp,
  })
  .superRefine((notice, ctx) => {
    // Zod 4 still runs this refinement when a field failed with a non-aborting
    // issue, so each check first confirms the values it reads were parsed.
    const { published, updated } = notice;
    // Compare instants, never strings: offsets make text order meaningless (R2.7).
    if (isDate(published) && isDate(updated) && updated.getTime() < published.getTime()) {
      ctx.addIssue({
        code: 'custom',
        path: ['updated'],
        message: `updated (${updated.toISOString()}) is earlier than published (${published.toISOString()})`,
      });
    }
    if (NEEDS_AFFECTS.has(notice.type) && Array.isArray(notice.affects) && notice.affects.length === 0) {
      ctx.addIssue({
        code: 'custom',
        path: ['affects'],
        message: `a ${notice.type} notice must list at least one affected package`,
      });
    }
  });

export type Notice = z.infer<typeof noticeSchema>;
/** The validated `affects` list of a notice. */
export type Affects = z.infer<typeof affectsSchema>;
