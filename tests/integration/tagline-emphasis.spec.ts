import { test, expect, type Page } from '@playwright/test';
import { VARIANTS, type VariantSlug } from '../../src/data/variants';

/**
 * R1.4 — WHEN a variant tagline contains an emphasised fragment THEN THE
 * SYSTEM SHALL render it with that variant's emphasis style.
 *
 * Since 4aa9130 the taglines are injected with `set:html`. Astro adds the
 * component's `data-astro-cid-*` attribute to both ends of a scoped selector
 * (`.tagline[cid] em[cid]`), and injected markup never carries that attribute,
 * so the rule stops matching and the fragment falls back to the browser
 * default (an `<em>` is just italic, inheriting the tagline's colour).
 *
 * How the expected value is derived: each row below carries the declarations
 * of the variant's own emphasis rule, copied verbatim from the component
 * (file, line and selector in `source`). In the page, those declarations are
 * applied inline to a probe placed next to the fragment, so `var(--…)` resolves
 * against the variant's own palette and the browser produces the computed value
 * the rule is meant to give. The real fragment must compute to exactly that.
 *
 * The "browser default" control is the same fragment rendered inside a shadow
 * root at the same position: inheritance still flows in, document rules do
 * not, so it is what the fragment looks like when no emphasis rule reaches it.
 */

type Fragment = 'em' | 'b';

interface EmphasisRule {
  slug: VariantSlug;
  component: string;
  /** Selector of the element holding the injected tagline (unique per page). */
  container: string;
  /** The emphasised element inside the injected tagline markup. */
  fragment: Fragment;
  /** Where the declarations come from: component file, line and rule selector. */
  source: string;
  /** Verbatim body of that rule. */
  declarations: string;
}

const EMPHASIS_RULES: readonly EmphasisRule[] = [
  // --- scoped <style> rules: broken by 4aa9130 ---------------------------
  {
    slug: 'v3',
    component: 'V3',
    container: '.tagline',
    fragment: 'em',
    source: 'src/components/variants/V3.astro:126 `.tagline em`',
    declarations: 'font-style:normal;background:var(--yellow);padding:2px 10px;color:var(--ink)',
  },
  {
    slug: 'v3a',
    component: 'V3a',
    container: '.tagline',
    fragment: 'em',
    source: 'src/components/variants/V3a.astro:112 `.hero .tagline em`',
    declarations: 'font-style:normal;color:var(--magenta);font-weight:400',
  },
  {
    slug: 'v3b',
    component: 'V3b',
    container: '.tagline',
    fragment: 'em',
    source: 'src/components/variants/V3b.astro:116 `.hero .tagline em`',
    declarations:
      'font-style:normal;color:var(--ink);background:var(--yellow);padding:2px 8px;margin:0 3px;font-weight:400',
  },
  {
    // V3c's tagline is the `.sub` line of the hero heading (content key
    // `subTaglineHtml`), injected with set:html exactly like the others.
    slug: 'v3c',
    component: 'V3c',
    container: '.sub',
    fragment: 'em',
    source: 'src/components/variants/V3c.astro:157 `.hero h1 .sub em`',
    declarations: 'color:var(--red);font-style:normal',
  },
  {
    slug: 'v3e',
    component: 'V3e',
    container: '.tagline',
    fragment: 'em',
    source: 'src/components/variants/V3e.astro:123 `.cart-body .tagline em`',
    declarations: 'font-style:normal;color:var(--vermillion);background:var(--mustard);padding:2px 10px',
  },
  {
    // Same shape as V3c: the tagline is the heading's `.sub` line.
    slug: 'v3f',
    component: 'V3f',
    container: '.sub',
    fragment: 'em',
    source: 'src/components/variants/V3f.astro:123 `.box-body h1 .sub em`',
    declarations: 'color:var(--red);background:var(--cream-2);padding:0 8px',
  },
  {
    slug: 'v3h',
    component: 'V3h',
    container: '.tagline',
    fragment: 'em',
    source: 'src/components/variants/V3h.astro:120 `.tagline em`',
    declarations: 'font-style:normal;color:var(--cyan);font-weight:400',
  },
  {
    slug: 'v3i',
    component: 'V3i',
    container: '.tagline',
    fragment: 'em',
    source: 'src/components/variants/V3i.astro:370 `.install-win .tagline em`',
    declarations: 'font-style:normal;color:var(--title);font-weight:700',
  },
  {
    slug: 'v3j',
    component: 'V3j',
    container: '.tagline',
    fragment: 'em',
    source: 'src/components/variants/V3j.astro:276 `.pkg-win .tagline em`',
    declarations: 'font-style:italic;font-weight:600;color:var(--teal-2)',
  },
  {
    slug: 'v3-vaporwave',
    component: 'V3Vaporwave',
    container: '.tagline',
    fragment: 'em',
    source: 'src/components/variants/V3Vaporwave.astro:121 `.tagline em`',
    declarations: 'color:var(--hot);font-style:normal;font-weight:400',
  },
  {
    slug: 'v4',
    component: 'V4',
    container: '.tagline',
    fragment: 'em',
    source: 'src/components/variants/V4.astro:258 `.tagline em`',
    declarations:
      'font-style:normal;font-weight:700;color:var(--ink);' +
      'background:linear-gradient(180deg, transparent 62%, rgba(95, 95, 211, 0.14) 62%);padding:0 3px',
  },
  {
    slug: 'beos',
    component: 'Beos',
    container: '.tagline',
    fragment: 'em',
    source: 'src/components/variants/Beos.astro:138 `.win-body .tagline em`',
    declarations: 'font-style:italic;font-weight:700;color:var(--blue);background:var(--yellow);padding:1px 6px',
  },
  {
    slug: 'synthwave',
    component: 'Synthwave',
    container: '.tagline',
    fragment: 'em',
    source: 'src/components/variants/Synthwave.astro:128 `.tagline em`',
    declarations: 'color:var(--cyan);font-style:normal;font-weight:400',
  },
  {
    // The em sits one level deeper: `.tagline > span[set:html] > em`.
    slug: 'death-stranding-v3',
    component: 'DeathStrandingV3',
    container: '.tagline',
    fragment: 'em',
    source: 'src/components/variants/DeathStrandingV3.astro:281 `.tagline em`',
    declarations: 'font-style:normal;color:var(--amber);text-shadow:0 0 10px rgba(247,180,99,.4)',
  },

  // --- `<style is:global>` rules: still reach set:html content today. -----
  // They are regression guards for R1.4: a fix must not break them.
  {
    slug: 'castlevania',
    component: 'Castlevania',
    container: '.tagline',
    fragment: 'em',
    source: 'src/components/variants/Castlevania.astro:317 `.v-castlevania .tagline em` (is:global)',
    declarations: 'font-style:normal;font-weight:700;color:var(--gold)',
  },
  {
    slug: 'breaking-bad',
    component: 'BreakingBad',
    container: '.tagline',
    fragment: 'b',
    source: 'src/components/variants/BreakingBad.astro:342 `.v-breaking-bad .tagline b` (is:global)',
    declarations: 'color:var(--hazmat)',
  },
  {
    slug: 'minecraft',
    component: 'Minecraft',
    container: '.tagline',
    fragment: 'b',
    source: 'src/components/variants/Minecraft.astro:258 `.v-minecraft .tagline b` (is:global)',
    declarations: 'color:var(--gold);text-shadow:3px 3px 0 #000',
  },
  {
    slug: 'severance-v2',
    component: 'SeveranceV2',
    container: '.tagline',
    fragment: 'b',
    source: 'src/components/variants/SeveranceV2.astro:472 `.v-severance-v2 .tagline b` (is:global)',
    declarations: 'color:var(--crt-glow);font-weight:700',
  },
  {
    slug: '2001',
    component: 'V2001',
    container: '.sub',
    fragment: 'b',
    source: 'src/components/variants/V2001.astro:238 `.v-2001 .sub b` (is:global)',
    declarations: 'color:var(--red-g);font-weight:700;text-shadow:0 0 10px rgba(255,40,60,.4)',
  },
];

/** Variants whose tagline has no emphasised fragment: nothing to assert. */
const NO_TAGLINE_EMPHASIS: Readonly<Partial<Record<VariantSlug, string>>> = {
  matrix: 'no tagline element; its `.desc em` rule styles the description, not a tagline',
  mario: 'tagline is plain text (`taglineUpper`), no emphasised fragment',
};

const LOCALES = [
  { lang: 'en', path: (slug: string) => `/v/${slug}/` },
  { lang: 'pt', path: (slug: string) => `/pt/v/${slug}/` },
] as const;

type Computed = Record<string, string>;

interface Measurement {
  /** Longhand properties set by the rule's declarations. */
  props: string[];
  /** The rule's declarations, resolved by the browser at the fragment's position. */
  expected: Computed;
  /** The real fragment inside the injected tagline. */
  actual: Computed;
  /** Same fragment at the same position with no document rule reaching it. */
  browserDefault: Computed;
  /** A fragment in a plain element next to the tagline (same component scope). */
  sibling: Computed;
  /** A fragment inside a look-alike tagline outside the variant's markup. */
  foreign: Computed;
}

/** Wait until every bundled stylesheet has loaded (fonts are not needed). */
async function gotoStyled(page: Page, path: string): Promise<void> {
  await page.goto(path, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() =>
    Array.from(document.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"][href^="/_astro/"]')).every(
      (link) => link.sheet !== null,
    ),
  );
}

async function measure(page: Page, rule: EmphasisRule): Promise<Measurement | null> {
  return page.evaluate(({ container, fragment, declarations }) => {
    const host = document.querySelector(container);
    const frag = host?.querySelector(fragment);
    const parent = frag?.parentElement;
    if (!host || !frag || !parent) return null;

    const probe = document.createElement('span');
    probe.setAttribute('style', declarations);
    const props: string[] = [];
    for (let i = 0; i < probe.style.length; i++) props.push(probe.style.item(i));

    const read = (el: Element): Record<string, string> => {
      const cs = getComputedStyle(el);
      const out: Record<string, string> = {};
      for (const p of props) out[p] = cs.getPropertyValue(p);
      return out;
    };
    const text = frag.textContent ?? '';
    const makeFragment = (): HTMLElement => {
      const el = document.createElement(fragment);
      el.textContent = text;
      return el;
    };

    // Expected: the rule's own declarations, applied where the fragment sits.
    parent.appendChild(probe);
    const expected = read(probe);
    probe.remove();

    const actual = read(frag);

    // Browser default: shadow DOM lets inheritance in and keeps document rules out.
    const shadowHost = document.createElement('span');
    const control = makeFragment();
    shadowHost.attachShadow({ mode: 'open' }).appendChild(control);
    parent.appendChild(shadowHost);
    const browserDefault = read(control);
    shadowHost.remove();

    // Same scope, outside the tagline: a plain block right after it.
    const siblingBox = document.createElement('div');
    const siblingFrag = makeFragment();
    siblingBox.appendChild(siblingFrag);
    host.after(siblingBox);
    const sibling = read(siblingFrag);
    siblingBox.remove();

    // Look-alike tagline outside the variant's markup (direct child of <body>).
    const foreignBox = document.createElement('div');
    foreignBox.className = host.className;
    const foreignFrag = makeFragment();
    foreignBox.appendChild(foreignFrag);
    document.body.appendChild(foreignBox);
    const foreign = read(foreignFrag);
    foreignBox.remove();

    return { props, expected, actual, browserDefault, sibling, foreign };
  }, rule);
}

function differs(m: Measurement, a: Computed, b: Computed): boolean {
  return m.props.some((p) => a[p] !== b[p]);
}

test('every variant is either in the emphasis table or explicitly excluded', () => {
  const tabled = EMPHASIS_RULES.map((r) => r.slug);
  const excluded = Object.keys(NO_TAGLINE_EMPHASIS);
  expect(tabled.filter((s) => excluded.includes(s)), 'a slug is both tabled and excluded').toEqual([]);
  expect(new Set(tabled).size, 'a slug is tabled twice').toBe(tabled.length);
  expect([...tabled, ...excluded].sort()).toEqual([...VARIANTS].sort());
});

for (const rule of EMPHASIS_RULES) {
  for (const { lang, path } of LOCALES) {
    const route = path(rule.slug);

    test(`tagline emphasis ${rule.component} ${lang} (${route})`, async ({ page }) => {
      await gotoStyled(page, route);

      await expect(
        page.locator(`${rule.container} ${rule.fragment}`),
        `${route}: the tagline (${rule.container}) has exactly one <${rule.fragment}>`,
      ).toHaveCount(1);

      const m = await measure(page, rule);
      expect(m, `${route}: <${rule.fragment}> inside ${rule.container}`).not.toBeNull();
      if (!m) return;
      const ctx = `${route} — rule ${rule.source}`;

      await test.step('table guard: the rule is distinguishable from the browser default', () => {
        expect(m.props.length, `${ctx}: declarations parse to no property`).toBeGreaterThan(0);
        expect(
          differs(m, m.expected, m.browserDefault),
          `${ctx}: expected ${JSON.stringify(m.expected)} equals the browser default, so this row proves nothing`,
        ).toBe(true);
      });

      await test.step('hostile (wrong collapse): a fragment outside the tagline, same scope, is not emphasised', () => {
        expect(
          differs(m, m.sibling, m.expected),
          `${ctx}: a <${rule.fragment}> next to the tagline took the tagline emphasis — the rule leaks beyond the tagline`,
        ).toBe(true);
      });

      await test.step('hostile (wrong collapse): a look-alike tagline outside the variant is not emphasised', () => {
        expect(
          differs(m, m.foreign, m.expected),
          `${ctx}: a <${rule.fragment}> in a ${rule.container} outside the variant took the emphasis — the rule lost its scoped ancestor`,
        ).toBe(true);
      });

      await test.step('hostile (wrong split): the injected fragment is not left at the browser default', () => {
        expect(
          m.actual,
          `${ctx}: <${rule.fragment}> renders as the browser default; expected ${JSON.stringify(m.expected)}`,
        ).not.toEqual(m.browserDefault);
      });

      await test.step('the injected fragment renders with the variant emphasis rule', () => {
        expect(m.actual, `${ctx}: computed style of the tagline <${rule.fragment}>`).toEqual(m.expected);
      });
    });
  }
}
