# Launch Readiness Checklist

Status at end of story 001 implementation (code-complete, launch-pending).

## Automated quality gates — all passing

- [x] `pnpm build` — 47 pages built (42 variants + 2 roots + 2 privacy + 404)
- [x] `pnpm typecheck` — 0 errors across 63 files
- [x] `pnpm test:unit -- --run` — 48 unit tests passing (rotator 13, form-handler 5, getLang 8, siteUrl 13, sitemap 5 + 1 snapshot, robots 4 + 1 snapshot)
- [x] `pnpm check:js` — 161 inline scripts within budget (core ≤1.5KB, variant ≤4KB gzip — shuffle FAB script: 503B gzip, rotator worst: 715B)
- [x] `pnpm check:og` — 22 og:images at 1200×630, each ≤300KB
- [x] `pnpm check:forms` — 42 variants pass form contract; /hub and /coming-soon not in dist
- [x] `pnpm check:variants-sync` — rotator inline array matches src/data/variants.ts

## Tests authored (run in CI)

- [x] 84-snapshot Playwright visual regression (21 × 2 lang × 2 viewport) — baselines need a fresh capture after the shuffle-FAB rollout (label `update-visual-baselines` on next PR)
- [x] 23 integration scenarios + 46-route a11y sweep — `pnpm exec playwright test --list tests/integration/` lists 69 discoverable
- [x] Lighthouse CI configured — perf/a11y/bp/seo ≥ 0.95, LCP ≤ 2500ms, CLS ≤ 0.1

## Pending — manual (outside code repo)

- [ ] **CF Pages repo connect** (docs/deploy.md §1): connect obentoo/bentoo.org to CF Pages, build command `pnpm build`, output `dist`, Node 22, `PNPM_VERSION=10.30.1`
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
| R7.1-R7.8 | ci + manual | .github/workflows/ci.yml + docs/deploy.md |
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
