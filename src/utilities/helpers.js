export const qs = (sel, root = document) => root.querySelector(sel);
export const el = (tag, className, html) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (html != null) node.innerHTML = html;
  return node;
};
export const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
export const initials = (name) => String(name).replace(/[^\p{L}\p{N} ]/gu, '').trim().split(/\s+/).map(w => w[0]).slice(0, 2).join('');
export const fmt = (n, d = 2) => (Number(n) || 0).toLocaleString('en-KE', { minimumFractionDigits: d, maximumFractionDigits: d });
export const formatAmount = (n, currency = 'KES') => `${currency} ${fmt(n)}`;

let toastTimer = null;
export function toast(message, ms = 2200) {
  clearTimeout(toastTimer);
  document.querySelector('.toast')?.remove();
  const node = el('div', 'toast', message);
  document.body.appendChild(node);
  toastTimer = setTimeout(() => node.remove(), ms);
}

export async function copyText(text, label = 'Copied') {
  try { await navigator.clipboard.writeText(text); toast(label); }
  catch { toast('Copy not available here'); }
}
