import { el } from '../utilities/helpers.js';
import { dataLoader } from '../services/dataLoader.js';
import { navigate } from '../router.js';

// Where each quick-service tile leads. Anything not mapped just closes the sheet (demo stub).
const ROUTES = { send:'contacts', paybill:'paybill', mobile:'airtime' };
// bundles, intl, rewards, internet, withdraw: not built yet — tapping just closes the sheet for now.

export function MoreServicesSheet() {
  const overlay = el('div', 'sheet-overlay');
  overlay.onclick = (e) => { if (e.target === overlay) overlay.remove(); };

  const sheet = el('div', 'sheet', `<div class="grabber"></div><h2>More Services</h2>`);
  const grid = el('div', 'sheet-grid');
  dataLoader.getQuickServices().forEach((s) => {
    const item = el('button', 'sheet-item', `<div class="ic">${s.icon}</div><span>${s.label}</span>`);
    item.onclick = () => { overlay.remove(); if (ROUTES[s.id]) navigate(ROUTES[s.id]); };
    grid.appendChild(item);
  });
  sheet.appendChild(grid);
  overlay.appendChild(sheet);
  document.querySelector('.frame').appendChild(overlay);
  return overlay;
}
