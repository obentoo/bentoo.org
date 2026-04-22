# bentoo.org — Deploy Runbook

## One-time Cloudflare Pages setup

### 1. Connect GitHub repo
1. Sign in to [Cloudflare dashboard](https://dash.cloudflare.com) → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
2. Pick `obentoo/bentoo.org` (install the Cloudflare GitHub app on the org if prompted; scope to this repo only).
3. Build settings:
   - **Framework preset**: Astro
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Root directory**: `/`

### 2. Environment variables
In **Settings → Environment variables**, set the same keys in **Production** and **Preview** unless noted:

| Variable | Production | Preview |
|---|---|---|
| `NODE_VERSION` | `22` | `22` |
| `PUBLIC_SITE_URL` | `https://bentoo.org` | leave unset (CF injects `CF_PAGES_URL`) |
| `PUBLIC_BUTTONDOWN_USERNAME` | `<Buttondown handle>` | same |
| `PUBLIC_CF_ANALYTICS_TOKEN` | `<token from Web Analytics dashboard>` | **leave unset** |

`PUBLIC_IS_PRODUCTION` is derived at build time from `CF_PAGES_BRANCH === 'main'` (see `astro.config.mjs`). Do not set it manually.

### 3. Custom domain (apex + www)
1. **Pages project → Custom domains → Add**: `bentoo.org`. CF creates the CNAME automatically (DNS must be on Cloudflare — it is).
2. **Rules → Redirect Rules → Create rule**:
   - Incoming hostname: `www.bentoo.org`
   - Path: `/*`
   - Destination: `https://bentoo.org/$1`
   - Status: `301`

Apex `bentoo.org` serves Pages; `www.bentoo.org` 301 → apex.

### 4. Cloudflare Web Analytics (cookie-less)
1. **Web Analytics → Add a site → `bentoo.org`**. CF generates a beacon token.
2. Copy the token into `PUBLIC_CF_ANALYTICS_TOKEN` (Production env only).
3. The beacon is only emitted when `PUBLIC_IS_PRODUCTION=true` AND `PUBLIC_CF_ANALYTICS_TOKEN` is set (see `BaseLayout.astro`).

## Preview deploy smoke checklist
Open the `*.pages.dev` URL from the PR comment and verify:
- [ ] `/` redirects to `/v/<slug>/`
- [ ] Variant page renders
- [ ] `/robots.txt` returns `User-agent: *\nDisallow: /`
- [ ] HTML `<meta name="robots" content="noindex,nofollow">` on every page
- [ ] No CF Analytics beacon `<script>` (token unset in Preview)
- [ ] `curl -I <preview-url>/ | grep -i 'content-security-policy'` returns the CSP header
- [ ] `curl -sL <preview-url>/hub/foo` lands at `/` with a 301 hop

## Production smoke checklist (post-DNS)
- [ ] `curl -sI https://bentoo.org/` returns `HTTP/2 200`
- [ ] `curl -sI https://www.bentoo.org/` returns `301` → `https://bentoo.org`
- [ ] `curl -s https://bentoo.org/robots.txt | head -5` matches production template (Allow: /, Disallow: /v/, Sitemap: line)
- [ ] `curl -s https://bentoo.org/sitemap.xml | xmllint --noout -` succeeds
- [ ] `curl -sI https://bentoo.org/ | grep -iE 'x-content-type|x-frame|referrer-policy|content-security'` returns all 4 security headers
- [ ] CF Analytics beacon script present on rendered `/`
- [ ] JSON-LD `SoftwareApplication` present on `/`
- [ ] DevTools Console on real mobile: `document.cookie === ''` (R6.1/R6.2/R6.7)

## Rollback (one-click, R7.6)
Pages keeps every deployment. To roll back:
1. **Pages project → Deployments**
2. Find the last known-good deploy
3. **⋯ → Rollback to this deployment**
No custom script, no blue/green routing — just a single dashboard action.

## Local dev
```
npm run dev        # astro dev on http://localhost:4321 (Node 22+ required)
npm run build      # emits dist/
npm run preview    # serves dist/ via astro preview (what CI tests against)
```

## CI
Every PR runs (.github/workflows/ci.yml):
- typecheck (astro check + tsc --noEmit)
- unit tests (Vitest)
- build
- integrity gates: `check:js`, `check:og`, `check:forms`, `check:variants-sync`
- visual regression (Playwright, 84 snapshots) — baselines updated via PR labeled `update-visual-baselines`
- integration tests (Playwright)
- a11y audit (@axe-core/playwright)
- Lighthouse CI on `/` and `/pt/`

## Fonts
Fonts are loaded from Google Fonts with `preconnect` hints (R5.7 preconnect pattern). Full self-hosting via
Google Webfonts Helper is tracked as a follow-up performance optimization.
