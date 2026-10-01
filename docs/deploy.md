# obentoo.org — Deploy Runbook

The site is a static Astro build served by **Cloudflare Workers Static Assets**
(`wrangler.jsonc`) and deployed **only** by the GitHub Actions workflow
`.github/workflows/deploy.yml`. There is no Cloudflare Pages project and no
manual deploy step.

> **Never deploy a local `dist/` by hand.** `pnpm test:integration` builds the
> site in production mode over the test fixtures (`NOTICES_DIR=tests/fixtures/notices`,
> `NOTICES_INTEGRATION_BUILD=true`, see `playwright.config.ts`). After any
> integration run, the local `dist/` holds fixture notices whose ids would become
> permanent the moment they were published. Production deploys come only from
> the workflow, which builds from a clean checkout.

## How a deploy runs

`deploy.yml` runs on:

| Trigger | When | Why |
|---|---|---|
| `push` to `main` | every merge | ship the change |
| `schedule` `17 6 * * 1` | Mondays 06:17 UTC | rebuild so the feed's `_bentoo.expires` (build time + 30 days) never lapses |
| `workflow_dispatch` | on demand | manual redeploy: `gh workflow run deploy.yml` |

The single job (`build + test + deploy`) runs only when `github.ref` is
`refs/heads/main`: a manual dispatch from another branch skips it. Steps:

1. checkout (`persist-credentials: false`), pnpm (version from `packageManager`), Node 22 with the pnpm cache
2. `pnpm install --frozen-lockfile`
3. `pnpm typecheck`
4. `pnpm test:unit`
5. `pnpm build` with the production env (below)
6. `pnpm exec wrangler deploy` — wrangler is pinned in the lockfile (devDependency), never downloaded unpinned

Guard rails: the workflow token has `permissions: contents: read` only, every
`uses:` is pinned to a commit SHA, and `concurrency: deploy-production` with
`cancel-in-progress: false` lets at most one deploy run at a time without ever
cancelling one in progress.

`wrangler.jsonc` defines the Worker `bentoo`: assets from `./dist`,
`not_found_handling: "404-page"`, custom domains `obentoo.org` and
`www.obentoo.org` (both serve the same assets; canonical tags point to the
apex), and `workers_dev: true` (the `*.workers.dev` URL also answers).

## Production build env

Set in `deploy.yml` on the `pnpm build` step; nothing is configured in the
Cloudflare dashboard.

| Variable | Value | Effect |
|---|---|---|
| `PUBLIC_IS_PRODUCTION` | `true` | indexable pages and the production `robots.txt`; without it the build ships `noindex` and a disallow-all `robots.txt` |
| `PUBLIC_SITE_URL` | `https://obentoo.org` | origin of every absolute URL: canonical tags, sitemap, feed ids and links |
| `PUBLIC_CF_ANALYTICS_TOKEN` | `${{ vars.PUBLIC_CF_ANALYTICS_TOKEN }}` | **left unset on purpose**: `obentoo.org` uses Web Analytics **auto-install**, so Cloudflare injects the beacon at the edge; setting this too would add a second beacon and count every visit twice |
| `PUBLIC_BUTTONDOWN_USERNAME` | `${{ vars.PUBLIC_BUTTONDOWN_USERNAME }}` | the Buttondown account the newsletter form posts to; empty falls back to `bentoo` |

The last two are **repository variables, not secrets**: both values end up in the
public HTML. An unset variable resolves to an empty string, so the build quietly
uses the fallbacks above. `PUBLIC_BUTTONDOWN_USERNAME` is set (`bentoo`);
`PUBLIC_CF_ANALYTICS_TOKEN` stays unset while auto-install is on — set it only
after turning auto-install off for the site (dashboard → Analytics & Logs → Web
Analytics → `obentoo.org`).

Never set here:

- `NOTICES_DIR` / `NOTICES_INTEGRATION_BUILD` — test-only; must never be set here.

`CF_PAGES_BRANCH` belonged to the retired Pages flow; the code still treats
`CF_PAGES_BRANCH=main` as production, but nothing sets it any more.

## One-time setup

### 1. Cloudflare API token (scoped)

Following Cloudflare's GitHub Actions guide
(<https://developers.cloudflare.com/workers/ci-cd/external-cicd/github-actions/>):

1. Cloudflare dashboard → **Account API tokens** → **Create Token**.
2. Under **Permission policies**, pick the template **Edit Cloudflare Workers**.
   It grants (per <https://developers.cloudflare.com/fundamentals/api/reference/template/>)
   Account: Workers Scripts Write, Workers KV Storage Write, Workers R2 Storage
   Write, Account Settings Read, User Details Read, User Memberships Read;
   Zone: Workers Routes Write.
3. Scope it: **Account resources** → only the account that owns the Worker;
   **Zone resources** → only the zone `obentoo.org`. Add a TTL if you rotate
   tokens on a schedule.
4. Copy the token once; Cloudflare does not show it again.

### 2. Account ID

Follow "Find account and zone IDs"
(<https://developers.cloudflare.com/fundamentals/account/find-account-and-zone-ids/>).

### 3. GitHub secrets and variables

Repository `obentoo/bentoo.org` → **Settings → Secrets and variables → Actions**:

| Secret | Value |
|---|---|
| `CLOUDFLARE_API_TOKEN` | the token from step 1 |
| `CLOUDFLARE_ACCOUNT_ID` | the ID from step 2 |

Or from a shell: `gh secret set CLOUDFLARE_API_TOKEN` and
`gh secret set CLOUDFLARE_ACCOUNT_ID` (each prompts for the value, so it never
lands in shell history). Never commit either value, and never put them in `.env`.

Same page, **Variables** tab — public values the build embeds in the HTML:

| Variable | Value |
|---|---|
| `PUBLIC_CF_ANALYTICS_TOKEN` | not set — Web Analytics auto-install injects the beacon (see above); only if auto-install is turned off: the site's JS snippet `token` |
| `PUBLIC_BUTTONDOWN_USERNAME` | the Buttondown username (`bentoo`) |

Or: `gh variable set PUBLIC_BUTTONDOWN_USERNAME --body bentoo`.

### 4. Custom domains

The first `wrangler deploy` creates the custom domains listed in
`wrangler.jsonc` (DNS records included). Cloudflare refuses a custom domain on a
hostname that already has a CNAME record: delete any leftover record for
`obentoo.org` / `www.obentoo.org` (for example from the old Pages project) first.

## The 60-day schedule caveat

GitHub **disables scheduled workflows in public repositories after 60 days
without repository activity**, and the deploy workflow's own scheduled runs do
**not** count as activity. If nothing is pushed for 60 days, the Monday rebuild
stops silently and the feed's `expires` lapses 30 days after the last build.

- Re-enable it with `gh workflow enable deploy.yml`, then redeploy at once with
  `gh workflow run deploy.yml`.
- Check its state with `gh workflow list --all` (the list hides disabled
  workflows without `--all`).

## Manual deploy

```sh
gh workflow run deploy.yml            # runs on main (the default branch)
gh run watch                          # follow the run
```

`gh workflow run deploy.yml --ref <branch>` starts a run that skips the job:
only `main` reaches production.

## Response headers and media types

`public/_headers` sets the security headers on every path and the feed media
types: `/notices.json` → `application/feed+json; charset=utf-8`,
`/notices.atom` → `application/atom+xml; charset=utf-8` (each `! Content-Type`
first removes the default). `public/_redirects` holds the legacy 301s.

`astro preview` ignores `_headers`, so verify headers locally with the Workers
runtime itself:

```sh
pnpm build
pnpm exec wrangler dev                # serves ./dist as production would
curl -sI http://localhost:8787/notices.json | grep -i content-type
```

Revalidation is by `ETag` (Workers static assets send no `Last-Modified`).

Notice ids may contain `+`. Workers static assets serve such a page at the
`%2B` form of the URL; the literal `+` URL answers `307` to it. This is an
accepted trade-off (decided 2026-09-29).

## Rollback

Cloudflare keeps previous Worker versions:

- Dashboard: **Workers & Pages** → `bentoo` → **Deployments** → `⋯` next to the
  known-good version → **Rollback**.
- CLI: `pnpm exec wrangler rollback` (needs Cloudflare credentials: `wrangler login`
  or a token in `CLOUDFLARE_API_TOKEN`).

A rollback is temporary: the next push to `main` or the Monday run redeploys
`main`. Make it permanent by reverting the bad commit on `main`.

## Production smoke checklist

- [ ] `curl -sI https://obentoo.org/` returns `200`
- [ ] `curl -sI https://www.obentoo.org/` returns `200` with the same page (canonical → apex)
- [ ] `curl -s https://obentoo.org/robots.txt` is the production template (`Allow: /`, `Sitemap:` line)
- [ ] `curl -s https://obentoo.org/sitemap.xml | xmllint --noout -` succeeds
- [ ] `curl -sI https://obentoo.org/ | grep -iE 'x-content-type|x-frame|referrer-policy|content-security'` shows all 4 security headers
- [ ] `curl -sI https://obentoo.org/notices.json | grep -i content-type` → `application/feed+json; charset=utf-8`
- [ ] `curl -sI https://obentoo.org/notices.atom | grep -i content-type` → `application/atom+xml; charset=utf-8`
- [ ] `curl -s https://obentoo.org/notices.json | jq ._bentoo.expires` is about 30 days after the last deploy
- [ ] `curl -sL https://obentoo.org/hub/foo` lands on `/` after a 301
- [ ] DevTools Console on a real mobile device: `document.cookie === ''`

## Dependency policy

**Minimum release age.** `pnpm-workspace.yaml` sets `minimumReleaseAge: 10080`
(the unit is minutes: 7 days). pnpm refuses to resolve any version published
less than seven days ago — locally and in CI — and fails with
`ERR_PNPM_NO_MATURE_MATCHING_VERSION`, naming the package and its age. That is
the intended stop: wait until the release is old enough. `minimumReleaseAgeExclude`
is empty by policy; an entry needs its own comment naming the advisory or
reason that justifies it. pnpm 10.16.0 is the first release that honours the
setting, hence `engines.pnpm: >=10.16.0`.

**Overrides.** When a vulnerable package is pinned by a dependency we do not
control, `pnpm-workspace.yaml` `overrides` replaces it — scoped to the
vulnerable major (`undici@7`, never a bare `undici`) and pinned to the lowest
patched release that is at least seven days old. Each override carries a
comment listing the GHSA ids it closes and the parent that pins the package.
Prefer bumping a direct dependency when that fixes it; drop an override once
every parent has moved past the vulnerable range.

**Exceptions.** An advisory with no patched release old enough is recorded
where the scanners read it, with an expiry, so the scan fails again on the
date the fix becomes eligible:

- `osv-scanner.toml` — an `[[IgnoredVulns]]` entry with `id`, `ignoreUntil`
  (the eligibility date) and `reason` (package and parent);
- `.trivyignore.yaml` — the same id with `expired_at` and a `statement`
  (trivy reads it only with `--ignorefile .trivyignore.yaml`).

None exists today.

**Local scans.**

```sh
osv-scanner scan source --lockfile pnpm-lock.yaml
trivy fs --scanners vuln --severity HIGH,CRITICAL --exit-code 1 .
```

**Renovate.** `renovate.json` opens update PRs only for releases at least seven
days old (`minimumReleaseAge: "7 days"`, `internalChecksFilter: "strict"`), pins
GitHub Action digests and devDependencies, and refreshes the lockfile weekly.
It takes effect only after the Renovate GitHub App is installed on
`obentoo/bentoo.org` (github.com/apps/renovate → Configure → select the
repository) — a one-time step for the repository owner.

## CI (pull requests)

`.github/workflows/ci.yml` runs on every pull request and push to `main`:
typecheck, unit tests, build, the integrity gates (`check:js`, `check:og`,
`check:forms`, `check:variants-sync`), Playwright visual and integration
suites, the axe accessibility audit and Lighthouse CI. It never deploys.
Local commands are in the [README](../README.md).
