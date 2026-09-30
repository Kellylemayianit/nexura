import { el } from '../utilities/helpers.js';
import { navigate, getRoute } from '../router.js';
import { MoreServicesSheet } from './moreServicesSheet.js';

const ITEMS = [
  { route:'home', icon:'🏠' },
  { route:'invest', icon:'📈' },
  { route:'__scan', icon:'▣', scan:true },
  { route:'paybill', icon:'🛡️' },
  { route:'profile', icon:'👤' },
];

export function BottomNav() {
  const active = getRoute();
  const nav = el('div', 'bottom-nav');
  ITEMS.forEach((item) => {
    const btn = el('button', item.scan ? 'nav-scan' : `nav-item${item.route === active ? ' active' : ''}`, item.icon);
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
