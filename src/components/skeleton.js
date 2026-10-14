import { el, esc } from '../utilities/helpers.js';

export function Skeleton() {
  const w = el('div', 'skeleton', '<div class="skel s-title"></div><div class="skel s-hero"></div><div class="skel s-row"></div><div class="skel s-row"></div><div class="skel s-row"></div>');
  w.setAttribute('role', 'status'); w.setAttribute('aria-label', 'Loading');
  return w;
}
export function ErrorState(err, onRetry) {
  const w = el('div', 'error-state', `<h2>Something went wrong</h2><p>${esc(err?.message || 'Please try again.')}</p>`);
  const b = el('button', 'btn btn-primary', 'Try again'); b.onclick = onRetry;
  w.appendChild(b);
  return w;
}
