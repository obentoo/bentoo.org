# obentoo.org

The bentoo website: a static [Astro](https://astro.build) site served from
Cloudflare Workers Static Assets at <https://obentoo.org>. Besides the landing
pages it publishes the bentoo **notices** (security issues, releases, news,
announcements) as a JSON Feed, an Atom feed and one page per notice.

## Requirements

- Node.js **>= 22.18.0** — the unit tests and the golden-fixture script load
  `src/content/noticeSchema.ts` through Node's native TypeScript type stripping,
  which older Node versions lack.
- pnpm **>= 10** (the exact version is pinned in `package.json` `packageManager`).

## Install

```sh
pnpm install --frozen-lockfile
```

## Run

```sh
pnpm dev          # dev server on http://localhost:4321
pnpm build        # static build into dist/
pnpm preview      # serve dist/ (ignores public/_headers, see docs/deploy.md)
```

## Test

```sh
pnpm typecheck          # astro check + tsc --noEmit
pnpm test:unit          # Vitest unit tests
pnpm test:integration   # Playwright integration tests (builds the site itself)
pnpm test:visual        # Playwright visual regression
pnpm check:js           # inline-script size budget (needs a build)
pnpm check:og           # og:image sizes (needs a build)
pnpm check:forms        # newsletter form contract (needs a build)
pnpm check:variants-sync
```

The Playwright suites need a browser: `pnpm exec playwright install chromium`
once.

`pnpm test:integration` builds the site in production mode over the fixture
notices in `tests/fixtures/notices/`. **Afterwards `dist/` contains fixture
notices — never deploy it.** Deploys come only from the GitHub Actions
workflow (see below).

## Authoring a notice

Each notice is one YAML file, `src/content/notices/<id>.yaml`, whose file name
is its id: `YYYY-MM-DD-<short-name>` (for example `2026-10-02-foo-cve`). Ids
are permanent once published — they are the feed item ids and page URLs.

Write notices with bentoolkit rather than by hand:

```sh
bentoo notice new
```

It writes a valid site file (and the matching GLEP 42 news item for the
overlay) under one id; its options are in bentoolkit's README ("Notice
Commands"). The contract every file must meet is
`src/content/noticeSchema.ts`. When editing a file by hand:

- Write timestamps (`published`, `updated`) as **quoted** RFC 3339 strings with
  an explicit offset: `published: "2026-10-02T00:00:00Z"`. The loader
  (`src/content/noticesLoader.ts`) parses YAML with js-yaml's `CORE_SCHEMA`,
  which has no timestamp type, so a timestamp reaches the schema as the text
  you wrote; one without an offset (`2026-10-02 10:00:00`) is refused rather
  than read in the build host's time zone.
- Quote every value YAML would read as a number or boolean: an unquoted
  `ver: 1.0` or `slot: 1` fails with "must be a quoted string (YAML read it
  as the number 1)".
- YAML merge keys (`<<`) are refused.

The notices are published at:

| URL | What |
|---|---|
| `/notices.json` | JSON Feed 1.1 with a `_bentoo` extension (`serial`, `expires`) |
| `/notices.atom` | Atom feed |
| `/notices/`, `/notices/<id>/` | index and one page per notice (also under `/pt/` and `/es/`) |

The JSON contract is pinned by the golden fixture
`tests/fixtures/notices.golden.json`, which bentoolkit also tests against. It
changes only with the contract; regenerate it with:

```sh
node scripts/generate-notices-golden.mjs
```

## Deploy

Production is deployed by `.github/workflows/deploy.yml` — build, typecheck,
unit tests, then a wrangler deploy to Cloudflare Workers Static Assets
(`wrangler.jsonc`). It runs:

- on every push to `main`;
- every Monday at 06:17 UTC, which keeps the feed's `expires` fresh;
- on demand:

```sh
gh workflow run deploy.yml
```

GitHub disables the weekly schedule after 60 days without repository activity,
and the workflow's own runs do not count: see the 60-day caveat in
[docs/deploy.md](docs/deploy.md) for how to re-enable it.

Secrets, token scope, production env vars, headers and rollback:
[docs/deploy.md](docs/deploy.md). Local env vars: [.env.example](.env.example).
