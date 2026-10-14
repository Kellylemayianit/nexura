import { el, esc, fmt } from '../utilities/helpers.js';
import { icons } from '../utilities/icons.js';

// Choose which asset pays. Real radio inputs underneath, so keyboard and screen readers work for free.
export function AssetPicker(assets, selectedId, onChange, { compact = false } = {}) {
  const wrap = el('div', `assets${compact ? ' compact' : ''}`);
  wrap.setAttribute('role', 'radiogroup'); wrap.setAttribute('aria-label', 'Pay with');
  const group = 'asset-' + Math.random().toString(36).slice(2, 6);
  assets.forEach((a, i) => {
    const label = el('label', 'asset rise');
    label.style.setProperty('--c', a.color); label.style.setProperty('--d', `${i * 70}ms`);
    label.innerHTML = `
      <input type="radio" class="sr" name="${group}" value="${esc(a.id)}" ${a.id === selectedId ? 'checked' : ''}>
      <span class="a-card">
        <span class="a-badge" aria-hidden="true">${esc(a.symbol[0])}</span>
        <span class="a-main"><b>${esc(a.symbol)}</b>${compact ? '' : `<span class="a-name">${esc(a.name)}</span>`}</span>
        <span class="a-bal"><b class="num">${fmt(a.balance, a.decimals)}</b>${compact ? '' : `<span class="a-kes">≈ KES ${fmt(a.balance * a.rateKes, 0)}${a.rateIsDemo ? ' · demo rate' : ''}</span>`}</span>
        <span class="a-check">${icons.check}</span>
      </span>`;
    label.querySelector('input').onchange = () => {
      if (wrap.scrollWidth > wrap.clientWidth) wrap.scrollTo({ left: label.offsetLeft - (wrap.clientWidth - label.offsetWidth) / 2, behavior: 'smooth' });
      onChange(a.id);
    };
    wrap.appendChild(label);
  });
  return wrap;
}
