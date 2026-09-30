// Build clock (story 002, R3.4): the one build time both feeds render from.
// Two endpoints calling `new Date()` separately could disagree by a second, so
// `/notices.json` and `/notices.atom` must both import this `BUILD_TIME`.

/** Whole, non-negative Unix seconds: no sign, fraction, exponent or blanks. */
const UNIX_SECONDS = /^\d+$/;

/**
 * The latest build time whose `expires` (+30 days) still prints as a four-digit
 * RFC 3339 year; later ones print `+0YYYYY`, which RFC 3339 clients reject.
 */
const LAST_BUILD_SECONDS = Date.UTC(9999, 11, 31, 23, 59, 59) / 1000 - 30 * 86400;

/**
 * `NOTICES_BUILD_TIME` (Unix seconds) when set, for tests and reproducible
 * builds; else the current time. Either way truncated to whole seconds.
 */
function resolveBuildTime(raw: string | undefined): Date {
  if (raw === undefined) {
    return new Date(Math.floor(Date.now() / 1000) * 1000);
  }
  const seconds = Number(raw);
  const date = new Date(seconds * 1000);
  if (!UNIX_SECONDS.test(raw) || !Number.isSafeInteger(seconds) || seconds > LAST_BUILD_SECONDS || Number.isNaN(date.getTime())) {
    throw new Error(`NOTICES_BUILD_TIME must be Unix seconds: ${raw}`);
  }
  return date;
}

export const BUILD_TIME: Date = resolveBuildTime(process.env.NOTICES_BUILD_TIME);
