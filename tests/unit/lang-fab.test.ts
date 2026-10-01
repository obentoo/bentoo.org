// @vitest-environment jsdom
// Story 004, Task 1.1 — choosing a locale in the floating language picker persists
// it in localStorage (`bentoo-lang` + `bentoo-lang-expires`) and still navigates (R2.2).
import { describe, it, expect, beforeAll, beforeEach, afterEach, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

const SOURCE_FILE = path.resolve(process.cwd(), 'src/scripts/lang-fab.inline.ts');
const NOW = 1_800_000_000_000;
const TTL_MS = 86_400_000;

let LANG_FAB_JS: string;

beforeAll(async () => {
  const mod = (await import(pathToFileURL(SOURCE_FILE).href)) as { LANG_FAB_JS: string };
  LANG_FAB_JS = mod.LANG_FAB_JS;
});

// ---------------------------------------------------------------------------
// Fixture: the FAB markup emitted by src/layouts/VariantLayout.astro for an
// English variant page (/v/v4/): the menu lists the OTHER locales (pt, es),
// each item wraps a flag span and a label span, and the trigger shows the
// current locale. Static test markup, parsed with DOMParser.
// ---------------------------------------------------------------------------
const FAB_MARKUP = `
  <main id="outside"><p id="outside-text">variant body</p></main>
  <div class="bd-lang-fab" data-bd-lang-fab>
    <ul class="bd-lang-menu" role="menu" aria-label="Language">
      <li role="none" style="--i:0">
        <a class="bd-lang-item" href="/pt/v/v4/" role="menuitem" rel="alternate"
           hreflang="pt-BR" data-bentoo-lang-toggle data-target-lang="pt" aria-label="português">
          <span class="bd-lang-flag" aria-hidden="true"><svg viewBox="0 0 60 60"><circle cx="30" cy="30" r="30"/></svg></span>
          <span class="bd-lang-label" aria-hidden="true">português</span>
        </a>
      </li>
      <li role="none" style="--i:1">
        <a class="bd-lang-item" href="/es/v/v4/" role="menuitem" rel="alternate"
           hreflang="es" data-bentoo-lang-toggle data-target-lang="es" aria-label="español">
          <span class="bd-lang-flag" aria-hidden="true"><svg viewBox="0 0 60 60"><circle cx="30" cy="30" r="30"/></svg></span>
          <span class="bd-lang-label" aria-hidden="true">español</span>
        </a>
      </li>
    </ul>
    <button type="button" class="bd-lang-trigger" data-bd-lang-trigger
            aria-haspopup="menu" aria-expanded="false" aria-label="Language">
      <span class="bd-lang-flag" aria-hidden="true"></span>
      <span class="bd-lang-globe" aria-hidden="true"></span>
      <span class="bd-lang-tip" aria-hidden="true">english</span>
    </button>
  </div>`;

function mountFab(): void {
  document.documentElement.lang = 'en';
  const parsed = new DOMParser().parseFromString(`<body>${FAB_MARKUP}</body>`, 'text/html');
  document.body.replaceChildren(...Array.from(parsed.body.childNodes).map((n) => document.importNode(n, true)));
}

// Listeners the script attaches to document/window are tracked so each case
// starts from a clean slate (element listeners die with the replaced DOM).
type Tracked = { target: EventTarget; type: string; fn: EventListenerOrEventListenerObject; opts?: unknown };
let tracked: Tracked[] = [];

// LANG_FAB_JS is an inline <script> body; the page runs it in global scope.
// Indirect eval reproduces that in the test realm (same document, Date, Storage).
const runGlobal: (src: string) => unknown = globalThis.eval;

function runScript(): void {
  const origDoc = document.addEventListener.bind(document);
  const origWin = window.addEventListener.bind(window);
  const docSpy = vi.spyOn(document, 'addEventListener').mockImplementation((type, fn, opts) => {
    tracked.push({ target: document, type, fn: fn as EventListenerOrEventListenerObject, opts });
    origDoc(type, fn as EventListenerOrEventListenerObject, opts as AddEventListenerOptions);
  });
  const winSpy = vi.spyOn(window, 'addEventListener').mockImplementation((type, fn, opts) => {
    tracked.push({ target: window, type, fn: fn as EventListenerOrEventListenerObject, opts });
    origWin(type, fn as EventListenerOrEventListenerObject, opts as AddEventListenerOptions);
  });
  try {
    runGlobal(LANG_FAB_JS);
  } finally {
    docSpy.mockRestore();
    winSpy.mockRestore();
  }
}

/**
 * Clicks `el` like a user would. Returns whether the default action (the
 * link navigation) was prevented by the page's own handlers. A window-level
 * listener, attached after the script ran, observes the final state and then
 * cancels the event only so jsdom does not attempt a real navigation.
 */
function click(el: Element): { prevented: boolean } {
  let observed: boolean | undefined;
  const observer = (e: Event) => {
    observed = e.defaultPrevented;
    e.preventDefault();
  };
  window.addEventListener('click', observer);
  const notCancelled = el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
  window.removeEventListener('click', observer);
  return { prevented: observed ?? !notCancelled };
}

const fab = () => document.querySelector('[data-bd-lang-fab]') as HTMLElement;
const trigger = () => document.querySelector('[data-bd-lang-trigger]') as HTMLButtonElement;
const item = (lang: string) => document.querySelector(`a.bd-lang-item[data-target-lang="${lang}"]`) as HTMLAnchorElement;
const outside = () => document.getElementById('outside-text') as HTMLElement;
const menu = () => document.querySelector('.bd-lang-menu') as HTMLElement;
const isOpen = () => fab().classList.contains('is-open');
const pressEscape = () => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));

let uncaught: unknown[] = [];
const onError = (e: ErrorEvent) => {
  uncaught.push(e.error ?? e.message);
  e.preventDefault();
};

beforeEach(() => {
  window.localStorage.clear();
  vi.spyOn(Date, 'now').mockReturnValue(NOW);
  uncaught = [];
  window.addEventListener('error', onError);
  mountFab();
  runScript();
});

afterEach(() => {
  for (const t of tracked) t.target.removeEventListener(t.type, t.fn, t.opts as EventListenerOptions);
  tracked = [];
  window.removeEventListener('error', onError);
  vi.restoreAllMocks();
  window.localStorage.clear();
  document.body.replaceChildren();
});

describe('lang-fab — hostile: interactions that are NOT a locale choice write nothing', () => {
  it('clicking the trigger (open, then close) writes no storage key', () => {
    const setItem = vi.spyOn(Storage.prototype, 'setItem');
    click(trigger());
    click(trigger());
    expect(setItem).not.toHaveBeenCalled();
    expect(window.localStorage.getItem('bentoo-lang')).toBeNull();
    expect(window.localStorage.getItem('bentoo-lang-expires')).toBeNull();
  });

  it('clicking inside the open menu but not on an item (list, list entry) writes nothing', () => {
    click(trigger());
    const setItem = vi.spyOn(Storage.prototype, 'setItem');
    click(menu());
    click(document.querySelector('.bd-lang-menu li') as Element);
    expect(setItem).not.toHaveBeenCalled();
  });

  it('outside click and Escape close the menu and write nothing', () => {
    const setItem = vi.spyOn(Storage.prototype, 'setItem');
    click(trigger());
    click(outside());
    click(trigger());
    pressEscape();
    expect(setItem).not.toHaveBeenCalled();
  });
});

describe('lang-fab — hostile: the persisted locale is the CHOSEN item, not another one', () => {
  it('clicking the es item on an English page persists es — not the page locale, not the other item', () => {
    click(trigger());
    click(item('es'));
    expect(window.localStorage.getItem('bentoo-lang')).toBe('es');
  });

  it('converse: clicking the pt item persists pt — each item carries its own locale', () => {
    click(trigger());
    click(item('pt'));
    expect(window.localStorage.getItem('bentoo-lang')).toBe('pt');
  });

  it('a click that lands on the flag or label inside an item persists that item locale', () => {
    click(trigger());
    click(item('es').querySelector('.bd-lang-flag') as Element);
    expect(window.localStorage.getItem('bentoo-lang')).toBe('es');
    click(item('pt').querySelector('.bd-lang-label') as Element);
    expect(window.localStorage.getItem('bentoo-lang')).toBe('pt');
  });

  it('a later choice overwrites an earlier stored locale and refreshes its expiry', () => {
    window.localStorage.setItem('bentoo-lang', 'pt');
    window.localStorage.setItem('bentoo-lang-expires', '1');
    click(trigger());
    click(item('es'));
    expect(window.localStorage.getItem('bentoo-lang')).toBe('es');
    expect(window.localStorage.getItem('bentoo-lang-expires')).toBe(String(NOW + TTL_MS));
  });
});

describe('lang-fab — choosing a locale persists it and navigates', () => {
  it('writes bentoo-lang-expires = String(Date.now() + 86400000)', () => {
    click(trigger());
    click(item('pt'));
    expect(window.localStorage.getItem('bentoo-lang-expires')).toBe(String(NOW + TTL_MS));
  });

  it('persists the choice without preventing the link navigation', () => {
    click(trigger());
    const { prevented } = click(item('es'));
    expect(window.localStorage.getItem('bentoo-lang')).toBe('es');
    expect(prevented).toBe(false);
    expect(item('es').getAttribute('href')).toBe('/es/v/v4/');
  });
});

describe('lang-fab — hostile: storage that throws', () => {
  const throwingStorage = () =>
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('storage disabled', 'SecurityError');
    });

  it('a throwing setItem does not escape the handler and does not block navigation', () => {
    const setItem = throwingStorage();
    click(trigger());
    const { prevented } = click(item('es'));
    // The write was attempted (the handler exists) ...
    expect(setItem).toHaveBeenCalledWith('bentoo-lang', 'es');
    // ... yet nothing escaped and the link still navigates.
    expect(uncaught).toEqual([]);
    expect(prevented).toBe(false);
  });

  it('after a throwing storage, the menu still opens and closes', () => {
    throwingStorage();
    click(trigger());
    click(item('pt'));
    click(outside());
    expect(isOpen()).toBe(false);
    click(trigger());
    expect(isOpen()).toBe(true);
    expect(uncaught).toEqual([]);
  });
});

describe('lang-fab — converse: open/close behaviour keeps working', () => {
  it('trigger click toggles is-open and aria-expanded', () => {
    expect(isOpen()).toBe(false);
    click(trigger());
    expect(isOpen()).toBe(true);
    expect(trigger().getAttribute('aria-expanded')).toBe('true');
    click(trigger());
    expect(isOpen()).toBe(false);
    expect(trigger().getAttribute('aria-expanded')).toBe('false');
  });

  it('an outside click closes the open menu', () => {
    click(trigger());
    click(outside());
    expect(isOpen()).toBe(false);
    expect(trigger().getAttribute('aria-expanded')).toBe('false');
  });

  it('Escape closes the open menu', () => {
    click(trigger());
    pressEscape();
    expect(isOpen()).toBe(false);
    expect(trigger().getAttribute('aria-expanded')).toBe('false');
  });

  it('a click inside the FAB that is not the trigger does not close the open menu', () => {
    click(trigger());
    click(menu());
    expect(isOpen()).toBe(true);
  });
});

describe('lang-fab — stays in the variant budget tier', () => {
  it('the emitted script does not contain the literal bentoo-lang-toggle', () => {
    expect(LANG_FAB_JS).not.toContain('bentoo-lang-toggle');
  });

  it('the source file does not contain the literal bentoo-lang-toggle anywhere', () => {
    expect(readFileSync(SOURCE_FILE, 'utf8')).not.toContain('bentoo-lang-toggle');
  });
});
