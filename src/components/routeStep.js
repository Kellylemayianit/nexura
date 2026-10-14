import { el, esc } from '../utilities/helpers.js';
import { icons } from '../utilities/icons.js';

// Steps are driven by real payment status (see pages/processing.js): setProgress(n) = n steps finished.
export function RouteSteps(steps) {
  const list = el('ol', 'route');
  const rows = steps.map((s, i) => {
    const row = el('li', 'route-step rise', `<span class="dot">${icons.check}</span><div><div class="label">${esc(s.label)}</div><div class="sub">${esc(s.sub)}</div></div>`);
    row.style.setProperty('--d', `${i * 90}ms`);
    list.appendChild(row);
    return row;
  });
  list.setProgress = (n) => rows.forEach((r, i) => { r.classList.toggle('done', i < n); r.classList.toggle('active', i === n); });
  list.setProgress(0);
  return list;
}
