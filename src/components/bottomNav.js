import { el } from '../utilities/helpers.js';
import { navigate, getRoute } from '../router.js';
import { MoreServicesSheet } from './moreServicesSheet.js';

const ITEMS = [
  { route:'home', icon:'🏠', label:'Home' },
  { route:'invest', icon:'📈', label:'Invest' },
  { route:'__scan', icon:'▣', label:'Scan & Pay', scan:true },
  { route:'paybill', icon:'🧾', label:'Pay Bill' },
  { route:'profile', icon:'👤', label:'Profile' },
];

export function BottomNav() {
  const active = getRoute();
  const nav = el('div', 'bottom-nav');
  ITEMS.forEach((item) => {
    const btn = el('button', item.scan ? 'nav-scan' : `nav-item${item.route === active ? ' active' : ''}`,
      `${item.icon}<span class="label">${item.label}</span>`);
    btn.onclick = () => item.scan ? MoreServicesSheet() : navigate(item.route);
    nav.appendChild(btn);
  });
  return nav;
}

export function mountBottomNav() {
  const root = document.getElementById('nav-root');
  root.innerHTML = '';
  root.appendChild(BottomNav());
}
