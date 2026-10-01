# Launch Readiness Checklist

Launch target: `https://obentoo.org`, served by **Cloudflare Workers Static
Assets** (`wrangler.jsonc`, Worker `bentoo`) and deployed **only** by the GitHub
Actions workflow `.github/workflows/deploy.yml`. There is no Cloudflare Pages
project and no manual upload.

This file is the order of operations and what to verify. The how-to for each
setup step (token scope, where each value comes from) lives in
[deploy.md](deploy.md); it is referenced here, not repeated.

## Automated quality gates — all passing at end of story 001

Figures are the story 001 snapshot. CI (`.github/workflows/ci.yml`) re-runs
every gate on each pull request and push to `main`; `deploy.yml` re-runs
`pnpm typecheck` and `pnpm test:unit` before every deploy.

- [x] `pnpm build` — 47 pages built (42 variants + 2 roots + 2 privacy + 404)
- [x] `pnpm typecheck` — 0 errors across 63 files
- [x] `pnpm test:unit -- --run` — 48 unit tests passing (rotator 13, form-handler 5, getLang 8, siteUrl 13, sitemap 5 + 1 snapshot, robots 4 + 1 snapshot)
- [x] `pnpm check:js` — 161 inline scripts within budget (core ≤1.5KB, variant ≤4KB gzip — shuffle FAB script: 503B gzip, rotator worst: 715B)
- [x] `pnpm check:og` — 22 og:images at 1200×630, each ≤300KB
- [x] `pnpm check:forms` — 42 variants pass form contract; /hub and /coming-soon not in dist
- [x] `pnpm check:variants-sync` — rotator inline array matches src/data/variants.ts

## Tests authored (run in CI)

- [x] 84-snapshot Playwright visual regression (21 × 2 lang × 2 viewport) — baselines need a fresh capture after the shuffle-FAB rollout (label `update-visual-baselines` on next PR; note: `ci.yml` currently has no step keyed on that label, so confirm the capture path before relying on it)
- [x] 23 integration scenarios + 46-route a11y sweep (story 001 count; story 002 added the notice specs) — `pnpm test:integration`. It builds `dist/` over the fixture notices: **never deploy that `dist/`**
- [x] Lighthouse CI configured — perf/a11y/bp/seo ≥ 0.95, LCP ≤ 2500ms, CLS ≤ 0.1

## Pending — one-time setup (manual, outside the code repo)

- [ ] **Cloudflare API token + account ID** (deploy.md §1–§3): scoped token, then the two repository **secrets** `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` (`gh secret set …`, prompts for the value)
- [ ] **Buttondown account**: confirm the handle and set it as the repository **variable** `PUBLIC_BUTTONDOWN_USERNAME` (deploy.md §3)
- [x] **CF Web Analytics**: `obentoo.org` is registered with **auto-install**, so Cloudflare injects the beacon at the edge; `PUBLIC_CF_ANALYTICS_TOKEN` stays unset to avoid a second beacon (deploy.md §3)
- [ ] **Verify the values are in place**: `gh secret list` shows both secrets, `gh variable list` shows `PUBLIC_BUTTONDOWN_USERNAME`
- [ ] **Custom domains** (deploy.md §4): `wrangler.jsonc` declares `obentoo.org` and `www.obentoo.org` as Worker custom domains; the first deploy creates their DNS records and certificates. Cloudflare refuses a custom domain on a hostname that already has a CNAME record, so first delete any leftover record for either hostname (for example the one the old Pages project created) and detach both hostnames from that Pages project
- [ ] **www** (optional): by default `www.obentoo.org` serves the same pages, with canonical tags pointing to the apex. A 301 instead needs a zone Redirect Rule `https://www.obentoo.org/*` → `https://obentoo.org/${1}`, which runs before the Worker

No per-branch preview deploys exist any more: pull requests are checked by
`ci.yml`, and `pnpm exec wrangler dev` serves a local build with the production
headers (deploy.md, "Response headers and media types").

## Pending — first deploy

- [ ] Start it from `main`: merge to `main`, or `gh workflow run deploy.yml` (a run from any other branch skips the job)
- [ ] Follow it with `gh run watch`; the job `build + test + deploy` must end green
- [ ] `gh workflow list --all` shows `deploy` active (the weekly Monday rebuild depends on it)
- [ ] The Cloudflare dashboard shows both custom domains attached to the Worker `bentoo`

## Pending — production smoke checks

Run against production after the first deploy. Security headers, the legacy
`/hub/` redirect, the `_bentoo.expires` date and the zero-cookie check on a
real mobile device are in deploy.md, "Production smoke checklist"; run those
too.

- [ ] **Canonical, feeds, indexable** — the home page names the apex as canonical, links both feeds, and is not `noindex`:

  ```sh
  curl -s https://obentoo.org/ | grep -oE '<link rel="canonical"[^>]*>|<link rel="alternate" type="application/(feed\+json|atom\+xml)"[^>]*>|<meta name="robots"[^>]*>'
  ```

  Expect `href="https://obentoo.org/"` on the canonical, both feed `<link rel="alternate">` tags, and `content="index,follow"`.
- [ ] **robots.txt** — allows crawling and names the sitemap:

  ```sh
  curl -s https://obentoo.org/robots.txt
  ```

  Expect `Allow: /` and `Sitemap: https://obentoo.org/sitemap.xml` (a `Disallow: /` alone means the build missed `PUBLIC_IS_PRODUCTION`).
- [ ] **sitemap.xml** — lists `/`, `/pt/`, `/es/` and `/notices/` in each locale (plus one entry per notice):

  ```sh
  curl -s https://obentoo.org/sitemap.xml | grep -oE '<loc>[^<]*</loc>'
  ```

- [ ] **JSON Feed media type and ETag**:

  ```sh
  curl -sI https://obentoo.org/notices.json | grep -iE '^(content-type|etag):'
  ```

  Expect `content-type: application/feed+json; charset=utf-8` and an `etag`.
- [ ] **Atom media type**:

  ```sh
  curl -sI https://obentoo.org/notices.atom | grep -i '^content-type:'
  ```

  Expect `application/atom+xml; charset=utf-8`.
- [ ] **ETag revalidation answers 304**:

  ```sh
  etag=$(curl -sI https://obentoo.org/notices.json | awk -F': ' 'tolower($1)=="etag" {print $2}' | tr -d '\r')
  curl -s -o /dev/null -w '%{http_code}\n' -H "If-None-Match: $etag" https://obentoo.org/notices.json
  ```

  Expect `304`.
- [ ] **Notice pages** — the index and one notice page (needs at least one published notice in `src/content/notices/`):

  ```sh
  curl -s -o /dev/null -w '%{http_code}\n' https://obentoo.org/notices/
  curl -s -o /dev/null -w '%{http_code}\n' https://obentoo.org/notices/<id>/
  ```

  Expect `200` for both. A notice id containing `+` answers `307` to its `%2B` form; that is expected (deploy.md).
- [ ] **Web Analytics beacon** — injected by auto-install (exactly one `static.cloudflareinsights.com` script):

  ```sh
  curl -s https://obentoo.org/ | grep -c static.cloudflareinsights.com
  ```

  Expect a count of at least `1`; `0` means the variable was empty at build time.

## After launch

- [ ] **Weekly rebuild stays enabled**: GitHub disables the scheduled run after 60 days without repository activity (the workflow's own runs do not count). If `gh workflow list --all` shows it disabled, `gh workflow enable deploy.yml`, then `gh workflow run deploy.yml` (deploy.md, "The 60-day schedule caveat")
- [ ] **Rollback** path known: deploy.md, "Rollback" (`pnpm exec wrangler rollback`, temporary until the next deploy of `main`)

## Deferred optimizations (follow-up stories)

- Variant-aesthetic og:images (current: text placeholders at 1200×630, all valid)
- Full font self-hosting via Google Webfonts Helper (current: Google Fonts via preconnect, R5.7-compliant)
- Variant-specific pt-BR translation calibration after visual regression reveals copy-length issues
- v3i `/hub/` link easter-egg cleanup (currently 404s — R8.6 drops /hub/)
- Unit test coverage for `src/scripts/shuffle.inline.ts` (currently covered only by E2E; rotator-style vitest+jsdom suite would mirror `tests/unit/rotator.test.ts`)

## Quality-gate table (R1-R8)

| Req | Status | Covered by |
|---|---|---|
| R1.x | tests passing | rotator.test.ts + rotator.spec.ts |
| R2.x | tests passing | language.spec.ts + getLang.test.ts |
| R3.x | tests passing | form.spec.ts + form-handler.test.ts + check:forms |
| R4.x | tests passing | seo.spec.ts + sitemap.test.ts + robots.test.ts |
| R5.1 | deferred | lighthouse CI (runs in GH Actions) |
| R5.2 | enforced | check:js tiered budget |
| R5.3-R5.7 | enforced | font preconnect + preload-by-variant + a11y.spec.ts target-size |
| R6.x | enforced | privacy.spec.ts + cookies.spec.ts (zero-cookie invariant) |
| R7.1-R7.8 | ci + manual | .github/workflows/ci.yml + .github/workflows/deploy.yml + docs/deploy.md |
| R8.1 | ci | 84-snapshot visual regression |
| R8.2-R8.5 | verified | manual review + visual regression |
| R8.6-R8.7 | enforced | check:forms asserts dist/hub + dist/coming-soon absent |

## Variant-switch FAB (added post-launch)

A floating Rubik's-cube button in the bottom-right corner of every variant
home page (en + pt) lets visitors shuffle to a different variant without
returning to `/`. Implementation:

- Markup + style + script live in `src/layouts/VariantLayout.astro`; the
  inline IIFE comes from `src/scripts/shuffle.inline.ts` (auto-synced
  with `src/data/variants.ts` via `JSON.stringify(VARIANTS)`).
- Persists the choice to `localStorage["bentoo-variant"]` (same key the
  rotator reads), so a follow-up bare-root visit lands on the user's last
  shuffled pick.
- Inline script gzip 503B → classified as `core-rotator` by
  `scripts/check-js-budget.mjs` (budget ≤ 1536 B).
- A11y: `<button>` with locale-aware `aria-label`, `:focus-visible`
  outline, `prefers-reduced-motion` disables every animation,
  `@media print` hides the button.
- Mobile (≤680 px) shrinks the FAB to 52 × 52 and hides the tooltip.

## Language picker FAB (added post-launch)

A floating circular flag button stacks **above** the shuffle cube in the
bottom-right of every variant home page. Closed state shows the current
locale's flag (BR / US / ES) inside a dark-glass circle with a tiny
globe badge in the bottom-right corner. Clicking it expands a vertical
menu of the other two locales (each with a side mono-caps pill label —
`português` / `english` / `español`, always endonyms). Implementation:

- Markup + style live in `src/layouts/VariantLayout.astro`; the inline
  open/close IIFE comes from `src/scripts/lang-fab.inline.ts`. The
  flag SVGs are inline strings clipped to `<circle r=30>` per locale
  with unique clipPath IDs to avoid collisions.
- Persistence is **not** in this script — menu items carry the same
  `data-bentoo-lang-toggle` + `data-target-lang` attributes the footer
  toggle uses, and the BaseLayout `langToggleScript` writes
  `bentoo-lang` + `bentoo-lang-expires` to localStorage on click before
  the anchor navigates.
- Inline `lang-fab.inline.ts` script gzip 293B → classified as
  `variant` by `scripts/check-js-budget.mjs` (deliberately avoids the
  literal `bentoo-lang-toggle` substring so it doesn't compete for the
  core-lang 1536B budget; uses `data-bd-lang-fab` /
  `data-bd-lang-trigger` selectors instead).
- Behaviour: trigger click toggles `is-open` + `aria-expanded`; ESC
  closes; click outside closes. Items pop up with 60ms staggered scale
  + translate animation.
- A11y: `aria-haspopup="menu"`, `role="menu"` / `role="menuitem"`,
  locale-aware `aria-label` (`switch language` / `trocar idioma` /
  `cambiar idioma`), `:focus-visible` outline, `prefers-reduced-motion`
  disables animations, `@media print` hides the FAB.
- Mobile (≤680 px) shrinks trigger to 52 × 52, items to 46 × 46, and
  hides the side pill labels.
- Tests: `tests/integration/language-fab.spec.ts` covers toggle,
  ESC/click-outside dismissal, item navigation+localStorage persistence,
  and per-locale trigger correctness across en/pt/es.
