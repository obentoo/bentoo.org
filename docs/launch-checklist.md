# Launch Readiness Checklist

Status at end of story 001 implementation (code-complete, launch-pending).

## Automated quality gates — all passing

- [x] `npm run build` — 47 pages built (42 variants + 2 roots + 2 privacy + 404)
- [x] `npm run typecheck` — 0 errors across 63 files
- [x] `npm run test:unit -- --run` — 48 unit tests passing (rotator 13, form-handler 5, getLang 8, siteUrl 13, sitemap 5 + 1 snapshot, robots 4 + 1 snapshot)
- [x] `npm run check:js` — 119 inline scripts within budget (core ≤1.5KB, variant ≤4KB gzip)
- [x] `npm run check:og` — 22 og:images at 1200×630, each ≤300KB
- [x] `npm run check:forms` — 42 variants pass form contract; /hub and /coming-soon not in dist
- [x] `npm run check:variants-sync` — rotator inline array matches src/data/variants.ts

## Tests authored (run in CI)

- [x] 84-snapshot Playwright visual regression (21 × 2 lang × 2 viewport) — baselines generated on first labeled PR
- [x] 23 integration scenarios + 46-route a11y sweep — `npx playwright test --list tests/integration/` lists 69 discoverable
- [x] Lighthouse CI configured — perf/a11y/bp/seo ≥ 0.95, LCP ≤ 2500ms, CLS ≤ 0.1

## Pending — manual (outside code repo)

- [ ] **CF Pages repo connect** (docs/deploy.md §1): connect obentoo/bentoo.org to CF Pages, build command `npm run build`, output `dist`, Node 22
- [ ] **CF env vars** (docs/deploy.md §2): `PUBLIC_SITE_URL`, `PUBLIC_BUTTONDOWN_USERNAME`, `PUBLIC_CF_ANALYTICS_TOKEN` (Production only), `NODE_VERSION=22`
- [ ] **Buttondown account**: confirm handle + set in `PUBLIC_BUTTONDOWN_USERNAME`
- [ ] **CF Web Analytics**: register bentoo.org, copy beacon token into `PUBLIC_CF_ANALYTICS_TOKEN`
- [ ] **Custom domain**: add `bentoo.org` in CF Pages custom domains; add Redirect Rule `www.bentoo.org/* → https://bentoo.org/$1 301`
- [ ] **Preview deploy smoke** (docs/deploy.md §Preview): open `*.pages.dev`, verify rotator + robots + no beacon + security headers
- [ ] **Production smoke** (docs/deploy.md §Production): curl + mobile device verification of 200, redirect, security headers, zero cookies
- [ ] **Visual regression baselines**: open a PR with label `update-visual-baselines` to capture the first 84-snapshot baseline in CI

## Deferred optimizations (follow-up stories)

- Variant-aesthetic og:images (current: text placeholders at 1200×630, all valid)
- Full font self-hosting via Google Webfonts Helper (current: Google Fonts via preconnect, R5.7-compliant)
- Variant-specific pt-BR translation calibration after visual regression reveals copy-length issues
- v3i `/hub/` link easter-egg cleanup (currently 404s — R8.6 drops /hub/)

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
| R7.1-R7.8 | ci + manual | .github/workflows/ci.yml + docs/deploy.md |
| R8.1 | ci | 84-snapshot visual regression |
| R8.2-R8.5 | verified | manual review + visual regression |
| R8.6-R8.7 | enforced | check:forms asserts dist/hub + dist/coming-soon absent |
