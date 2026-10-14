import { el } from '../utilities/helpers.js';
import { navigate, getRoute } from '../router.js';

const ITEMS = [
  { route:'send',    label:'Send / Receive' },
  { route:'lipa',    label:'Lipa na M-Pesa' },
  { route:'airtime', label:'Airtime & Data' },
  { route:'more',    label:'More' },
  { route:'profile', label:'Profile', extra:true }, // desktop sidebar only; phones use the header avatar
];

// One component, two looks: a flat bottom tab bar on phones, the dark sidebar on desktop (see bottom-nav.css).
export function BottomNav() {
  const active = getRoute();
  const nav = el('nav', 'bottom-nav');
  nav.setAttribute('aria-label', 'Main');
  ITEMS.forEach((item) => {
    const btn = el('button', `nav-item${item.extra ? ' nav-extra' : ''}${item.route === active ? ' active' : ''}`, item.label);
    if (item.route === active) btn.setAttribute('aria-current', 'page');
    btn.onclick = () => navigate(item.route);
    nav.appendChild(btn);
  });
  nav.appendChild(el('div', 'signer', '<b>Chip signer connected</b>Your key never leaves this phone.'));
  return nav;
}

export function mountBottomNav() {
  const root = document.getElementById('nav-root');
  root.innerHTML = '';
  root.appendChild(BottomNav());
}
