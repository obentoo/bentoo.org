# Security Policy

bentoo.org is the static website served at `obentoo.org` and `www.obentoo.org`
(Astro, deployed as Cloudflare Workers static assets). This policy covers the
site and the code in this repository.

## Scope

**In scope — report it here:**

- Anything that lets an attacker run script or inject content on
  `obentoo.org` (XSS, a Content-Security-Policy bypass, an open redirect in
  `public/_redirects`).
- A response header in `public/_headers` that weakens the site's protection.
- The CI and deploy workflows in `.github/workflows/` — for example a way to
  run untrusted code with the deploy credentials.
- A compromised or unexpected dependency in `pnpm-lock.yaml`.

**Out of scope — report it elsewhere:**

- The newsletter form posts to Buttondown; issues in Buttondown itself go to
  [Buttondown](https://buttondown.com/).
- The Cloudflare platform: [Cloudflare](https://www.cloudflare.com/disclosure/).
- Bentoo itself, its packages and tools: the matching repository —
  [bentoo](https://github.com/obentoo/bentoo),
  [bentoolkit](https://github.com/obentoo/bentoolkit),
  [shidashi](https://github.com/obentoo/shidashi).
- Volumetric denial of service, and scanner output with no demonstrated
  impact.

## Reporting

Use GitHub's private vulnerability reporting:
**[Security → Report a vulnerability](https://github.com/obentoo/bentoo.org/security/advisories/new)**.

Please do not open a public issue for anything exploitable before a fix is
deployed. Include the affected URL or file, the steps to reproduce, and what
an attacker gains.

## Supported versions

Only what is deployed from the `main` branch is supported. There are no
release branches.

## Response

The site is maintained on a best-effort basis. Expect an acknowledgment within
7 days. Once a fix is deployed, the advisory is published with credit to the
reporter, unless you prefer to stay anonymous.
