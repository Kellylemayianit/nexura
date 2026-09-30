export const qs = (sel, root = document) => root.querySelector(sel);
export const el = (tag, className, html) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (html != null) node.innerHTML = html;
  return node;
};
export const initials = (name) => name.split(' ').map(w => w[0]).slice(0, 2).join('');
export const formatAmount = (n, currency = 'cKES') => `${(parseFloat(n) || 0).toFixed(2)} ${currency}`;

let toastTimer = null;
export function toast(message, ms = 2200) {
  clearTimeout(toastTimer);
  document.querySelector('.toast')?.remove();
  const node = el('div', 'toast', message);
  document.body.appendChild(node);
  toastTimer = setTimeout(() => node.remove(), ms);
}
