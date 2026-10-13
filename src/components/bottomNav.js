import { el } from '../utilities/helpers.js';
import { icons } from '../utilities/icons.js';
import { navigate, getRoute } from '../router.js';

const ITEMS = [
  { route:'send',    icon:icons.send,    label:'Send / Receive' },
  { route:'lipa',    icon:icons.lipa,    label:'Lipa na M-Pesa' },
  { route:'airtime', icon:icons.airtime, label:'Airtime & Data' },
  { route:'more',    icon:icons.more,    label:'More' },
];

export function BottomNav() {
  const active = getRoute();
  const nav = el('nav', 'bottom-nav');
  nav.setAttribute('aria-label', 'Main');
  ITEMS.forEach((item) => {
    const btn = el('button', `nav-item${item.route === active ? ' active' : ''}`, `${item.icon}<span class="label">${item.label}</span>`);
    if (item.route === active) btn.setAttribute('aria-current', 'page');
    btn.onclick = () => navigate(item.route);
    nav.appendChild(btn);
  });
  return nav;
}

export function mountBottomNav() {
  const root = document.getElementById('nav-root');
  root.innerHTML = '';
  root.appendChild(BottomNav());
}
