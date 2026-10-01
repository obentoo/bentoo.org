import { test, expect, type Page } from '@playwright/test';
import { VARIANTS, type VariantSlug } from '../../src/data/variants';

/**
 * R1.5 — WHEN a variant renders content injected with `set:html` THEN THE
 * SYSTEM SHALL style the injected elements with that variant's own rules.
 *
 * Why it breaks: Astro's scoped CSS adds the component's `data-astro-cid-*`
 * attribute to every compound of a selector (`.lede[cid] em[cid]`) and to every
 * element of the component's template. Markup injected with `set:html` never
 * carries that attribute, so a scoped rule written for it silently stops
 * matching (4aa9130 moved ledes, labels, footers and taglines to `set:html`).
 *
 * The oracle (the same method as the task 3.1 discovery), per page:
 *  1. Read the page's server HTML (`fetch(location.href)` parsed with
 *     DOMParser). The server HTML is the build output, so the cid-less
 *     elements inside a scope are exactly the `set:html` content — DOM that
 *     V3i/V3j scripts add at runtime is not part of this requirement.
 *  2. Injected element = an element without any `data-astro-cid-*` whose
 *     nearest ancestor carrying one belongs to the variant or VariantLayout.
 *  3. Collect every CSSStyleRule of the page's stylesheets, including rules
 *     nested in @media/@supports/@layer/@container, and split selector lists.
 *  4. For every injected element, list the scoped selectors (those naming a
 *     `data-astro-cid-*` attribute) that match it now; then give every injected
 *     element its own scope's attribute(s) — as the template markup had before
 *     4aa9130 — list again, and remove the attributes. A selector that matches
 *     only with the attribute is a rule the injected element no longer gets.
 *     Pseudo-elements (`::before`, `:after`) and user-action pseudo-classes
 *     (`:hover`, `:focus…`, `:active`, `:visited`, `:target`) are stripped for
 *     matching, identically in both passes, so `.btn:hover .arr[cid]` counts
 *     as a rule for `.arr`.
 *     A flagged selector is satisfied when the element already takes the same
 *     styles another way: a selector of the same sheet, in the same
 *     @media/@supports context, with the same stripped pseudo-classes and
 *     pseudo-elements and the same declarations, matches it as rendered (e.g.
 *     the reset `*,::before,::after` kept as is plus an added
 *     `.root :global(*), …::before, …::after` with the same body).
 *  5. Leak check: a look-alike of each `set:html` host (its ancestor chain and
 *     injected markup, with every scope attribute removed) is appended to
 *     <body>. No rule of a scoped stylesheet may match the look-alike's
 *     injected-like elements: a fix that drops the scoped ancestor
 *     (`:global(.lede em)`, `:global(em)`) would make it match.
 *
 * Nothing is excluded silently: non-rendered elements (script, style,
 * template, …) are not candidates and are counted in an annotation;
 * cross-origin sheets (Google Fonts, @font-face only) are listed in an
 * annotation; a same-origin sheet that cannot be read, a nested style rule,
 * an @scope rule or a scoped selector the browser cannot evaluate fails the
 * page's guard step.
 */

const LOCALES = [
  { lang: 'en', path: (slug: string) => `/v/${slug}/` },
  { lang: 'pt', path: (slug: string) => `/pt/v/${slug}/` },
] as const;

const ROUTES: readonly { slug: VariantSlug; lang: string; route: string }[] = VARIANTS.flatMap((slug) =>
  LOCALES.map(({ lang, path }) => ({ slug, lang, route: path(slug) })),
);

/**
 * The 14 tagline rules task 3.1 fixed with `:global(em)`: the oracle must see
 * them reach the injected <em> and must not flag them (regression guard for
 * the oracle itself, not only for the CSS).
 */
const FIXED_TAGLINE_RULES: readonly { slug: VariantSlug; container: '.tagline' | '.sub' }[] = [
  { slug: 'v3', container: '.tagline' },
  { slug: 'v3a', container: '.tagline' },
  { slug: 'v3b', container: '.tagline' },
  { slug: 'v3c', container: '.sub' },
  { slug: 'v3e', container: '.tagline' },
  { slug: 'v3f', container: '.sub' },
  { slug: 'v3h', container: '.tagline' },
  { slug: 'v3i', container: '.tagline' },
  { slug: 'v3j', container: '.tagline' },
  { slug: 'v3-vaporwave', container: '.tagline' },
  { slug: 'v4', container: '.tagline' },
  { slug: 'beos', container: '.tagline' },
  { slug: 'synthwave', container: '.tagline' },
  { slug: 'death-stranding-v3', container: '.tagline' },
];

// ---------------------------------------------------------------------------
// Oracle (runs inside the page; must be self-contained for page.evaluate)
// ---------------------------------------------------------------------------

interface OracleArgs {
  /** Extra CSS for self-checks; `%NAME%` becomes the scope attribute selector of `cidOf[NAME]`. */
  extraCss: string | null;
  /** Extra markup for self-checks, inserted (placeholders filled) at the end of `into`. */
  extraHtml: { into: string; html: string } | null;
  /** Placeholder name → selector of an element whose single scope attribute it stands for. */
  cidOf: Record<string, string>;
  /** Name → selector; each injected element reports which probes it matches. */
  probes: Record<string, string>;
}

interface Finding {
  selector: string;
  rule: string;
  sheet: string;
  count: number;
  paths: string[];
}

interface ElementReport {
  path: string;
  scope: string[];
  probes: string[];
  reachable: string[];
  unreachable: string[];
  /** Flagged-shape selectors satisfied by an equivalent rule: `selector => equivalent`. */
  covered: string[];
}

interface OracleResult {
  /** Scope attribute name per placeholder, resolved in the server HTML. */
  placeholders: Record<string, string>;
  ruleCount: number;
  scopedSelectorCount: number;
  injectedCount: number;
  excludedNotRendered: Record<string, number>;
  crossOrigin: string[];
  unreadable: string[];
  unsupported: string[];
  unmatchable: string[];
  findings: Finding[];
  leaks: Finding[];
  elements: ElementReport[];
}

async function runOracle(args: OracleArgs): Promise<OracleResult> {
  const CID = 'data-astro-cid-';
  // Elements that never render a box: their style has no visible effect.
  const NOT_RENDERED = new Set(['script', 'style', 'template', 'noscript', 'link', 'meta', 'title', 'base']);
  const STRIP =
    /::[a-zA-Z-]+(?:\([^()]*\))?|:(?:before|after|first-line|first-letter|hover|focus-visible|focus-within|focus|active|visited|target)(?![\w-])/g;

  const cidAttrs = (el: Element): string[] => el.getAttributeNames().filter((n) => n.startsWith(CID));

  const res = await fetch(location.href, { cache: 'no-store' });
  const doc = new DOMParser().parseFromString(await res.text(), 'text/html');

  // --- placeholders + self-check markup --------------------------------------
  const placeholders: Record<string, string> = {};
  for (const [key, sel] of Object.entries(args.cidOf)) {
    const el = doc.querySelector(sel);
    const names = el ? cidAttrs(el) : [];
    if (names.length !== 1) throw new Error(`self-check: ${sel} must carry exactly one scope attribute, found ${names.length}`);
    placeholders[key] = names[0];
  }
  const fill = (s: string): string => s.replace(/%(\w+)%/g, (m, k: string) => (placeholders[k] ? `[${placeholders[k]}]` : m));
  const fillAttr = (s: string): string => s.replace(/%(\w+)%/g, (m, k: string) => placeholders[k] ?? m);
  if (args.extraHtml) {
    const into = doc.querySelector(args.extraHtml.into);
    if (!into) throw new Error(`self-check: no ${args.extraHtml.into} to insert markup into`);
    into.insertAdjacentHTML('beforeend', fillAttr(args.extraHtml.html));
  }

  // --- rules -------------------------------------------------------------------
  interface RawRule {
    rule: string;
    sheet: string;
    /** Enclosing @media/@supports/@layer/@container preludes. */
    context: string;
    declarations: string;
  }
  const raw: RawRule[] = [];
  const crossOrigin: string[] = [];
  const unreadable: string[] = [];
  const unsupported: string[] = [];

  const walk = (list: CSSRuleList, sheet: string, context = ''): void => {
    for (const r of Array.from(list)) {
      if (r instanceof CSSStyleRule) {
        if (r.cssRules && r.cssRules.length > 0) unsupported.push(`${sheet}: nested style rules under ${r.selectorText}`);
        raw.push({ rule: r.selectorText, sheet, context, declarations: r.style.cssText });
      } else if (r instanceof CSSImportRule) {
        if (r.styleSheet) walk(r.styleSheet.cssRules, sheet, context);
      } else if (typeof CSSScopeRule !== 'undefined' && r instanceof CSSScopeRule) {
        unsupported.push(`${sheet}: @scope rule (${r.cssText.slice(0, 60)})`);
      } else if (r instanceof CSSKeyframesRule) {
        // keyframe selectors are not element selectors
      } else if ('cssRules' in r && (r as CSSGroupingRule).cssRules) {
        const prelude = r.cssText.slice(0, r.cssText.indexOf('{')).trim();
        walk((r as CSSGroupingRule).cssRules, sheet, `${context}${prelude} `);
      }
    }
  };

  const sheets: { sheet: CSSStyleSheet; label: string }[] = Array.from(document.styleSheets).map((s) => ({
    sheet: s,
    label: s.href ? new URL(s.href).pathname : 'inline <style>',
  }));
  if (args.extraCss) {
    const extra = new CSSStyleSheet();
    extra.replaceSync(fill(args.extraCss));
    sheets.push({ sheet: extra, label: 'self-check' });
  }
  for (const { sheet, label } of sheets) {
    let rules: CSSRuleList;
    try {
      rules = sheet.cssRules;
    } catch {
      const sameOrigin = sheet.href !== null && new URL(sheet.href).origin === location.origin;
      (sameOrigin ? unreadable : crossOrigin).push(sheet.href ?? label);
      continue;
    }
    walk(rules, label);
  }

  // --- selectors ---------------------------------------------------------------
  const splitList = (sel: string): string[] => {
    const out: string[] = [];
    let depth = 0;
    let quote: string | null = null;
    let cur = '';
    for (const ch of sel) {
      if (quote) {
        cur += ch;
        if (ch === quote) quote = null;
        continue;
      }
      if (ch === '"' || ch === "'") quote = ch;
      else if (ch === '(' || ch === '[') depth++;
      else if (ch === ')' || ch === ']') depth--;
      else if (ch === ',' && depth === 0) {
        if (cur.trim()) out.push(cur.trim());
        cur = '';
        continue;
      }
      cur += ch;
    }
    if (cur.trim()) out.push(cur.trim());
    return out;
  };
  const strippedOf = (sel: string): string =>
    (sel.match(STRIP) ?? []).map((t) => (/^:(before|after|first-line|first-letter)$/.test(t) ? `:${t}` : t)).join('');
  const forMatching = (sel: string): string => {
    let s = sel.replace(STRIP, (m: string, offset: number, str: string) => {
      const before = offset === 0 ? '' : str[offset - 1];
      const after = str[offset + m.length] ?? '';
      const opens = before === '' || /[\s>+~(,]/.test(before);
      const closes = after === '' || /[\s>+~),]/.test(after);
      return opens && closes ? '*' : '';
    });
    if (s.trim() === '' || /[>+~]\s*$/.test(s)) s = `${s}*`;
    return s.trim();
  };

  interface Sel {
    text: string;
    match: string;
    rule: string;
    sheet: string;
    scoped: boolean;
    /** Same key = same styles for the same (pseudo-)element in the same context. */
    key: string;
  }
  const sels: Sel[] = [];
  const unmatchable: string[] = [];
  const probeEl = doc.documentElement;
  for (const { rule, sheet, context, declarations } of raw) {
    for (const text of splitList(rule)) {
      const scoped = text.includes(`[${CID}`);
      let match = forMatching(text);
      try {
        probeEl.matches(match);
      } catch {
        match = text;
        try {
          probeEl.matches(match);
        } catch {
          if (scoped) unmatchable.push(`${sheet}: ${text}`);
          continue;
        }
      }
      const key = `${sheet}\u0000${context}\u0000${strippedOf(text)}\u0000${declarations}`;
      sels.push({ text, match, rule, sheet, scoped, key });
    }
  }
  const scopedSheets = new Set(sels.filter((s) => s.scoped).map((s) => s.sheet));
  const scopedSels = sels.filter((s) => s.scoped);
  const leakSels = sels.filter((s) => scopedSheets.has(s.sheet));

  // --- injected elements -------------------------------------------------------
  const describe = (e: Element): string => {
    let s = e.localName;
    if (e.id) s += `#${e.id}`;
    for (const c of (e.getAttribute('class') ?? '').trim().split(/\s+/).filter(Boolean).slice(0, 3)) s += `.${c}`;
    const p = e.parentElement;
    if (p) {
      const same = Array.from(p.children).filter((c) => c.localName === e.localName);
      if (same.length > 1) s += `:nth-of-type(${same.indexOf(e) + 1})`;
    }
    return s;
  };
  const pathOf = (e: Element, host: Element): string => {
    const parts: string[] = [];
    for (let n: Element | null = e; n && n !== host; n = n.parentElement) parts.unshift(describe(n));
    parts.unshift(`${describe(host)}${cidAttrs(host).map((a) => `[${a}]`).join('')}`);
    const above = host.parentElement;
    if (above && above !== doc.body) parts.unshift(describe(above));
    return parts.join(' > ');
  };

  interface Injected {
    el: Element;
    host: Element;
    attrs: string[];
    path: string;
    probes: string[];
  }
  const injected: Injected[] = [];
  const excludedNotRendered: Record<string, number> = {};
  for (const el of Array.from(doc.body.querySelectorAll('*'))) {
    if (cidAttrs(el).length > 0) continue;
    let host = el.parentElement;
    while (host && cidAttrs(host).length === 0) host = host.parentElement;
    if (!host) continue;
    if (NOT_RENDERED.has(el.localName)) {
      excludedNotRendered[el.localName] = (excludedNotRendered[el.localName] ?? 0) + 1;
      continue;
    }
    const probes = Object.entries(args.probes)
      .filter(([, sel]) => el.matches(sel))
      .map(([name]) => name);
    injected.push({ el, host, attrs: cidAttrs(host), path: pathOf(el, host), probes });
  }

  // --- pass A (as rendered) / pass B (with the scope attribute) ----------------
  const matching = (el: Element): Set<number> => {
    const out = new Set<number>();
    scopedSels.forEach((s, i) => {
      if (el.matches(s.match)) out.add(i);
    });
    return out;
  };
  const before = injected.map((i) => matching(i.el));
  for (const i of injected) for (const a of i.attrs) i.el.setAttribute(a, '');
  const after = injected.map((i) => matching(i.el));
  for (const i of injected) for (const a of i.attrs) i.el.removeAttribute(a);

  const group = (into: Map<string, Finding>, s: Sel, path: string): void => {
    const key = `${s.sheet}\u0000${s.text}`;
    const f = into.get(key) ?? { selector: s.text, rule: s.rule, sheet: s.sheet, count: 0, paths: [] };
    f.count++;
    if (f.paths.length < 3) f.paths.push(path);
    into.set(key, f);
  };
  const equivalentNow = (el: Element, s: Sel): Sel | undefined =>
    sels.find((o) => o !== s && o.key === s.key && el.matches(o.match));
  const findingMap = new Map<string, Finding>();
  const elements: ElementReport[] = injected.map((i, k) => {
    const reachable = [...before[k]].map((idx) => scopedSels[idx].text);
    const unreachable: string[] = [];
    const covered: string[] = [];
    for (const idx of [...after[k]].filter((n) => !before[k].has(n))) {
      const s = scopedSels[idx];
      const eq = equivalentNow(i.el, s);
      if (eq) {
        covered.push(`${s.text} => ${eq.text}`);
        continue;
      }
      unreachable.push(s.text);
      group(findingMap, s, i.path);
    }
    return { path: i.path, scope: i.attrs, probes: i.probes, reachable, unreachable, covered };
  });

  // --- leak check: look-alike of each host outside every scope ------------------
  const stripScope = (root: Element): Element => {
    for (const e of [root, ...Array.from(root.querySelectorAll('*'))]) {
      for (const a of cidAttrs(e)) e.removeAttribute(a);
      e.removeAttribute('id');
    }
    return root;
  };
  const leakMap = new Map<string, Finding>();
  const hosts = [...new Set(injected.filter((i) => i.el.parentElement === i.host).map((i) => i.host))];
  for (const host of hosts) {
    const chain: Element[] = [];
    for (let n: Element | null = host; n && n !== doc.body; n = n.parentElement) chain.unshift(n);
    let top: Element | null = null;
    let cur: Element | null = null;
    for (const n of chain) {
      const c = stripScope(n.cloneNode(false) as Element);
      if (cur) cur.appendChild(c);
      else top = c;
      cur = c;
    }
    if (!top || !cur) continue;
    for (const child of Array.from(host.children)) {
      if (cidAttrs(child).length === 0 && !NOT_RENDERED.has(child.localName)) {
        cur.appendChild(stripScope(child.cloneNode(true) as Element));
      }
    }
    doc.body.appendChild(top);
    for (const e of Array.from(cur.querySelectorAll('*'))) {
      for (const s of leakSels) {
        if (e.matches(s.match)) group(leakMap, s, `look-alike outside every scope: ${chain.map(describe).join(' > ')} > … ${describe(e)}`);
      }
    }
    top.remove();
  }

  return {
    placeholders,
    ruleCount: raw.length,
    scopedSelectorCount: scopedSels.length,
    injectedCount: injected.length,
    excludedNotRendered,
    crossOrigin,
    unreadable,
    unsupported,
    unmatchable,
    findings: [...findingMap.values()],
    leaks: [...leakMap.values()],
    elements,
  };
}

// ---------------------------------------------------------------------------
// helpers
// ---------------------------------------------------------------------------

/** Wait until every bundled stylesheet has loaded (fonts are not needed). */
async function gotoStyled(page: Page, path: string): Promise<void> {
  await page.goto(path, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() =>
    Array.from(document.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"][href^="/_astro/"]')).every(
      (link) => link.sheet !== null,
    ),
  );
}

const NO_EXTRAS: OracleArgs = { extraCss: null, extraHtml: null, cidOf: {}, probes: {} };

function oracle(page: Page, args: OracleArgs = NO_EXTRAS): Promise<OracleResult> {
  return page.evaluate(runOracle, args);
}

function report(route: string, list: Finding[]): string {
  return list
    .map((f) => `  ${route} | ${f.selector}  (${f.sheet}; ${f.count} element(s), e.g. ${f.paths.join(' ; ')})`)
    .join('\n');
}

// ---------------------------------------------------------------------------
// guards
// ---------------------------------------------------------------------------

test('every variant in VARIANTS has an en and a pt route that renders without redirecting', async ({ request }) => {
  expect([...new Set(ROUTES.map((r) => r.slug))].sort()).toEqual([...VARIANTS].sort());
  for (const slug of VARIANTS) {
    expect(ROUTES.filter((r) => r.slug === slug).map((r) => r.lang), `${slug} locales`).toEqual(['en', 'pt']);
  }
  for (const { route } of ROUTES) {
    const res = await request.get(route, { maxRedirects: 0 });
    expect(res.status(), `${route} renders directly`).toBe(200);
  }
});

// ---------------------------------------------------------------------------
// oracle self-checks — hostile halves of the oracle itself, durable after 3.2
// ---------------------------------------------------------------------------

test('oracle self-check (v4): reports a broken scoped rule, a bare global leak and the right scope; spares the :global() form', async ({
  page,
}) => {
  await gotoStyled(page, '/v/v4/');
  const r = await oracle(page, {
    cidOf: { V: 'p.lede', L: '.bd-lang-fab' },
    extraHtml: { into: 'p.lede', html: '<span class="set-html-probe-nest"><b><em>nested</em></b></span>' },
    extraCss: [
      // same shape as V4's broken `.lede em` (scope on both ends), nested in @media/@supports
      '@media (min-width: 1px) { @supports (display: block) { .lede%V% em%V% { --set-html-probe: broken; } } }',
      // nested injected markup: both the <b> and the <em> lack the scope attribute
      '.lede%V% .set-html-probe-nest b%V% em%V% { --set-html-probe: nested; }',
      // VariantLayout's shape: `.bd-lang-flag svg` under the layout scope
      '.bd-lang-flag%L% svg%L% { --set-html-probe: layout; }',
      // must never fire: the layout's injected svg belongs to the layout scope, not the variant's
      'svg%V% { --set-html-probe: wrong-scope; }',
      // the fix shape of task 3.1: scoped ancestor, global injected part
      '.lede%V% em { --set-html-probe: fixed; }',
      // a page-level bare global (what `:global(.lede em)` compiles to) in a scoped sheet
      '.lede em { --set-html-probe: bare-global; }',
      // equivalence — kept rule + added rule with the same body: covered
      '.desc%V% .lede%V% em%V% { --set-html-probe: added; }',
      '.desc%V% .lede%V% em { --set-html-probe: added; }',
      // equivalence must not collapse: other context, other pseudo-element, other body
      '.desc%V% p.lede%V% em%V% { --set-html-probe: context; }',
      '@media (min-width: 1px) { .desc%V% p.lede%V% em { --set-html-probe: context; } }',
      '.desc%V% .lede%V% > em%V%::before { --set-html-probe: pseudo; }',
      '.desc%V% .lede%V% > em { --set-html-probe: pseudo; }',
      'div.desc%V% .lede%V% em%V% { --set-html-probe: body-a; }',
      'div.desc%V% .lede%V% em { --set-html-probe: body-b; }',
    ].join('\n'),
    probes: {
      lede: 'p.lede > em',
      nested: '.set-html-probe-nest em',
      flag: '.bd-lang-trigger > .bd-lang-flag > svg',
    },
  });
  const V = `[${r.placeholders.V}]`;
  const L = `[${r.placeholders.L}]`;
  expect(r.placeholders.V, 'variant and layout scopes are distinct').not.toBe(r.placeholders.L);

  const self = (list: Finding[]) => list.filter((f) => f.sheet === 'self-check');
  const at = (probe: string) => r.elements.filter((e) => e.probes.includes(probe));
  for (const p of ['lede', 'nested', 'flag']) expect(at(p).length, `injected elements matching probe ${p}`).toBeGreaterThan(0);

  await test.step('hostile (wrong collapse): an injected element only takes its own scope attribute', () => {
    for (const e of at('flag')) expect(e.scope, e.path).toEqual([r.placeholders.L]);
    expect(self(r.findings).map((f) => f.selector)).not.toContain(`svg${V}`);
  });

  await test.step('hostile (wrong collapse): a bare global rule is caught by the leak check', () => {
    const leak = self(r.leaks).find((f) => f.selector === '.lede em');
    expect(leak, `leaks: ${JSON.stringify(r.leaks)}`).toBeDefined();
    expect(self(r.leaks).map((f) => f.selector), 'only the bare global leaks').toEqual(['.lede em']);
  });

  await test.step('hostile (wrong collapse): a rule in another context, for another pseudo-element or with another body is not an equivalent', () => {
    const flagged = self(r.findings).map((f) => f.selector);
    expect(flagged).toContain(`.desc${V} p.lede${V} em${V}`);
    expect(flagged).toContain(`.desc${V} .lede${V} > em${V}::before`);
    expect(flagged).toContain(`div.desc${V} .lede${V} em${V}`);
  });

  await test.step('hostile (wrong split): rules that match only with the scope attribute are reported', () => {
    const flagged = self(r.findings).map((f) => f.selector);
    expect(flagged).toContain(`.lede${V} em${V}`);
    expect(flagged).toContain(`.lede${V} .set-html-probe-nest b${V} em${V}`);
    expect(flagged).toContain(`.bd-lang-flag${L} svg${L}`);
    for (const e of at('lede')) expect(e.unreachable, e.path).toContain(`.lede${V} em${V}`);
    for (const e of at('nested')) expect(e.unreachable, e.path).toContain(`.lede${V} .set-html-probe-nest b${V} em${V}`);
  });

  await test.step('benign: the :global() fix shape is reachable and not reported', () => {
    expect(self(r.findings).map((f) => f.selector)).not.toContain(`.lede${V} em`);
    for (const e of at('lede')) expect(e.reachable, e.path).toContain(`.lede${V} em`);
  });

  await test.step('benign: a kept rule plus an added equivalent rule is covered, not reported', () => {
    expect(self(r.findings).map((f) => f.selector)).not.toContain(`.desc${V} .lede${V} em${V}`);
    for (const e of at('lede')) expect(e.covered, e.path).toContain(`.desc${V} .lede${V} em${V} => .desc${V} .lede${V} em`);
  });
});

for (const { slug, container } of FIXED_TAGLINE_RULES) {
  test(`oracle self-check (${slug}): the tagline rule fixed by 3.1 reaches the injected <em> and is not flagged`, async ({
    page,
  }) => {
    await gotoStyled(page, `/v/${slug}/`);
    const r = await oracle(page, { ...NO_EXTRAS, probes: { tagline: `${container} em` } });
    const ems = r.elements.filter((e) => e.probes.includes('tagline'));
    expect(ems.length, `${slug}: injected <em> inside ${container}`).toBeGreaterThan(0);
    const taglineRule = new RegExp(`\\${container}\\[data-astro-cid-[a-z0-9]+\\] em$`);
    for (const e of ems) {
      expect(e.reachable.filter((s) => taglineRule.test(s)), `${e.path}: reachable tagline rule`).not.toEqual([]);
      expect(
        e.unreachable.filter((s) => s.includes(container) && /\bem\[data-astro-cid-[a-z0-9]+\]$/.test(s)),
        `${e.path}: tagline emphasis rule flagged as unreachable`,
      ).toEqual([]);
    }
  });
}

test('oracle self-check (castlevania): an unscoped variant contributes no injected elements', async ({ page }) => {
  await gotoStyled(page, '/v/castlevania/');
  const r = await oracle(page, { ...NO_EXTRAS, cidOf: { L: '.bd-lang-fab' } });
  expect(r.injectedCount, 'the layout picker icons are injected').toBeGreaterThan(0);
  const foreign = r.elements.filter((e) => e.scope.join() !== r.placeholders.L);
  expect(foreign.map((e) => e.path), 'injected elements outside the VariantLayout scope').toEqual([]);
});

// ---------------------------------------------------------------------------
// R1.5 — every variant × en/pt
// ---------------------------------------------------------------------------

for (const { slug, route } of ROUTES) {
  test(`set:html content takes its scope's rules — ${slug} (${route})`, async ({ page }) => {
    await gotoStyled(page, route);
    const r = await oracle(page);

    test.info().annotations.push({
      type: 'oracle',
      description:
        `${route}: ${r.ruleCount} style rules, ${r.scopedSelectorCount} scoped selectors, ${r.injectedCount} injected elements; ` +
        `not rendered (not candidates): ${JSON.stringify(r.excludedNotRendered)}; cross-origin sheets: ${r.crossOrigin.length}`,
    });

    await test.step('guard: the page has injected content and readable scoped rules', () => {
      expect(r.unreadable, `${route}: same-origin stylesheets the oracle cannot read`).toEqual([]);
      expect(r.unsupported, `${route}: CSS the oracle does not evaluate`).toEqual([]);
      expect(r.unmatchable, `${route}: scoped selectors the browser cannot evaluate`).toEqual([]);
      expect(r.scopedSelectorCount, `${route}: scoped selectors`).toBeGreaterThan(0);
      expect(r.injectedCount, `${route}: injected elements (at least the language picker icons)`).toBeGreaterThan(0);
    });

    await test.step('hostile (wrong collapse): injected-like markup outside every scope takes no variant rule', () => {
      expect(r.leaks, `${route}: scoped-sheet rules reaching a look-alike outside the scope\n${report(route, r.leaks)}`).toEqual(
        [],
      );
    });

    await test.step('hostile (wrong split): every scoped rule reaches the injected element it targets', () => {
      expect(
        r.findings,
        `${route}: rules that match an injected element only with its scope attribute\n${report(route, r.findings)}`,
      ).toEqual([]);
    });
  });
}
