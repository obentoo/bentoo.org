const TIMEOUT_MS = 10_000;

function showSuccess(form: HTMLFormElement, msg: string): void {
  const p = document.createElement('p');
  p.className = 'bentoo-form-success';
  p.setAttribute('role', 'status');
  p.textContent = msg;
  form.replaceWith(p);
}

function showError(form: HTMLFormElement, msg: string): void {
  const existing = form.nextElementSibling;
  if (existing && existing.classList.contains('bentoo-form-error')) {
    existing.textContent = msg;
    return;
  }
  const p = document.createElement('p');
  p.className = 'bentoo-form-error';
  p.setAttribute('role', 'alert');
  p.textContent = msg;
  form.insertAdjacentElement('afterend', p);
}

export function initForms(): void {
  const iframe = document.querySelector<HTMLIFrameElement>(
    'iframe[name="bd-sink"]'
  );
  if (!iframe) return;

  const forms = document.querySelectorAll<HTMLFormElement>(
    'form[data-bentoo-subscribe]'
  );
  forms.forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const successMsg = form.dataset.successMsg ?? '';
      const errorMsg = form.dataset.errorMsg ?? '';
      if (!successMsg || !errorMsg) {
        // eslint-disable-next-line no-console
        console.warn(
          'bentoo: data-success-msg / data-error-msg missing on subscribe form'
        );
      }
      form.target = 'bd-sink';
      const timer = window.setTimeout(() => {
        showError(form, errorMsg);
      }, TIMEOUT_MS);
      const onLoad = () => {
        window.clearTimeout(timer);
        showSuccess(form, successMsg);
      };
      iframe.addEventListener('load', onLoad, { once: true });
      form.submit();
    });
  });
}
