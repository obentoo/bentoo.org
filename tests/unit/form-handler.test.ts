import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { initForms } from '../../src/scripts/form-handler';

function clearBody(): void {
  while (document.body.firstChild) {
    document.body.removeChild(document.body.firstChild);
  }
}

function makeFixture(opts: {
  withIframe?: boolean;
  forms?: number;
  successMsg?: string;
  errorMsg?: string;
  missingDataAttrs?: boolean;
}): void {
  const {
    withIframe = true,
    forms = 1,
    successMsg = 'OK',
    errorMsg = 'NOPE',
    missingDataAttrs = false,
  } = opts;
  clearBody();
  if (withIframe) {
    const iframe = document.createElement('iframe');
    iframe.setAttribute('name', 'bd-sink');
    iframe.hidden = true;
    document.body.appendChild(iframe);
  }
  for (let i = 0; i < forms; i++) {
    const form = document.createElement('form');
    form.setAttribute('data-bentoo-subscribe', '');
    form.setAttribute('action', 'https://buttondown.com/api/emails/embed-subscribe/test');
    form.setAttribute('method', 'post');
    form.id = `f${i}`;
    if (!missingDataAttrs) {
      form.dataset.successMsg = successMsg;
      form.dataset.errorMsg = errorMsg;
    }
    const input = document.createElement('input');
    input.type = 'email';
    input.name = 'email';
    form.appendChild(input);
    const submit = document.createElement('button');
    submit.type = 'submit';
    submit.textContent = 'go';
    form.appendChild(submit);
    document.body.appendChild(form);
  }
}

describe('form-handler', () => {
  let submitSpy: ReturnType<typeof vi.spyOn> | null = null;

  beforeEach(() => {
    clearBody();
    submitSpy = vi
      .spyOn(HTMLFormElement.prototype, 'submit')
      .mockImplementation(() => {});
  });

  afterEach(() => {
    submitSpy?.mockRestore();
    vi.useRealTimers();
  });

  it('(1) happy path: preventDefault + target=bd-sink + iframe load replaces form with success', () => {
    makeFixture({ successMsg: 'OK' });
    initForms();
    const form = document.querySelector<HTMLFormElement>('form')!;
    const event = new Event('submit', { cancelable: true, bubbles: true });
    const preventSpy = vi.spyOn(event, 'preventDefault');
    form.dispatchEvent(event);

    expect(preventSpy).toHaveBeenCalled();
    expect(form.target).toBe('bd-sink');
    expect(submitSpy).toHaveBeenCalled();

    const iframe = document.querySelector<HTMLIFrameElement>('iframe[name="bd-sink"]')!;
    iframe.dispatchEvent(new Event('load'));

    const replaced = document.querySelector('.bentoo-form-success');
    expect(replaced).not.toBeNull();
    expect(replaced!.textContent).toBe('OK');
    expect(document.querySelector('form')).toBeNull();
  });

  it('(2) timeout: no iframe load within 10s shows error, form and email value preserved', () => {
    vi.useFakeTimers();
    makeFixture({ errorMsg: 'NOPE' });
    initForms();
    const form = document.querySelector<HTMLFormElement>('form')!;
    const input = form.querySelector<HTMLInputElement>('input[type="email"]')!;
    input.value = 'visitor@example.com';

    form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));

    vi.advanceTimersByTime(10_000);

    expect(document.querySelector('form')).not.toBeNull();
    expect(input.value).toBe('visitor@example.com');
    const err = document.querySelector('.bentoo-form-error');
    expect(err).not.toBeNull();
    expect(err!.textContent).toBe('NOPE');
    expect(err!.previousElementSibling).toBe(form);
  });

  it('(3) two forms on same page handle submissions independently', () => {
    makeFixture({ forms: 2, successMsg: 'OK' });
    initForms();
    const [f0, f1] = Array.from(document.querySelectorAll<HTMLFormElement>('form'));
    f0.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    f1.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));

    const iframe = document.querySelector<HTMLIFrameElement>('iframe[name="bd-sink"]')!;
    iframe.dispatchEvent(new Event('load'));

    expect(document.querySelectorAll('.bentoo-form-success').length).toBeGreaterThanOrEqual(1);
  });

  it('(4) missing iframe in DOM: initForms returns early, no handlers attached', () => {
    makeFixture({ withIframe: false });
    initForms();
    const form = document.querySelector<HTMLFormElement>('form')!;
    const event = new Event('submit', { cancelable: true, bubbles: true });
    const preventSpy = vi.spyOn(event, 'preventDefault');
    form.dispatchEvent(event);
    expect(preventSpy).not.toHaveBeenCalled();
  });

  it('(5) missing data-attrs: handler still works but emits console.warn', () => {
    makeFixture({ missingDataAttrs: true });
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    initForms();
    const form = document.querySelector<HTMLFormElement>('form')!;
    form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });
});
