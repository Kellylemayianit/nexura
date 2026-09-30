import { el } from '../utilities/helpers.js';

export function RouteSteps(steps, onComplete) {
  const list = el('div');
  const rows = steps.map((s) => {
    const row = el('div', 'route-step', `<div class="dot"></div><div><div class="label">${s.label}</div><div class="sub">${s.sub}</div></div>`);
    list.appendChild(row);
    return row.querySelector('.dot');
  });

  let i = 0;
  const tick = () => {
    if (i > 0) rows[i - 1].classList.replace('active', 'done');
    if (i < rows.length) { rows[i].classList.add('active'); i++; setTimeout(tick, 550); }
    else setTimeout(onComplete, 500);
  };
  setTimeout(tick, 200);

  return list;
}
