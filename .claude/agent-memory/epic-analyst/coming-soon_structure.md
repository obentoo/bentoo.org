---
name: coming-soon structure
description: Layout of the pre-Astro coming-soon variants and shared conventions
type: project
---

Fact: 21 variant directories under `coming-soon/<slug>/index.html`, plus `coming-soon/index.html` (rotator) and `coming-soon/hub/index.html` (to drop). Every variant is a complete standalone HTML doc with `<html lang="en">`, `<meta viewport>`, inline `<style>`, inline `<script>` form handler (onsubmit fakes success), Google Fonts via `<link>`, and `<link rel="icon">` pointing to `../../bentoo-logo.svg`. Canonical logo lives only at `old/bentoo-logo.svg` today. Rotator uses localStorage keys `bentoo-variant` and `bentoo-variant-expires` (24h TTL), supports `?v=` override.

Why: Informs Astro migration — each variant maps cleanly to `src/pages/v/<slug>.astro` preserving inline styles/scripts; shared pieces (favicon, fonts preconnect, viewport) are the only safe candidates for the Base layout.

How to apply: Do not try to extract CSS variables or shared components from variants — each variant has its own `:root` tokens and overlapping class names (e.g. `.notify`, `.brand`, `.logo`) that would collide if unscoped. Astro's per-component style scoping handles this automatically; keep styles inline in each `.astro`.
