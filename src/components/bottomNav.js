import { el } from '../utilities/helpers.js';
import { icons } from '../utilities/icons.js';
import { navigate, getRoute } from '../router.js';
import { ThemeToggle } from './themeToggle.js';
import { guide } from './guide.js';

const ITEMS = [
  { route: 'send',    short: 'Send',    long: 'Send / Receive',  icon: icons.nSend },
  { route: 'lipa',    short: 'Lipa',    long: 'Lipa na M-Pesa',  icon: icons.nLipa },
  { route: 'airtime', short: 'Airtime', long: 'Airtime & Data',  icon: icons.nAirtime },
  { route: 'more',    short: 'More',    long: 'More',            icon: icons.nMore },
  { route: 'profile', short: 'Profile', long: 'Profile', extra: true }, // desktop sidebar only; phones use the header avatar
];

// One component, two looks: a floating icon dock on phones, the dark sidebar on desktop (bottom-nav.css).
export function BottomNav() {
  const active = getRoute();
  const nav = el('nav', 'bottom-nav');
  nav.setAttribute('aria-label', 'Main');
  ITEMS.forEach((it) => {
    const btn = el('button', `nav-item${it.extra ? ' nav-extra' : ''}${it.route === active ? ' active' : ''}`,
      `<span class="ico">${it.icon || ''}</span><span class="lbl-short">${it.short}</span><span class="lbl-long">${it.long}</span>`);
    btn.dataset.tour = it.route; btn.setAttribute('aria-label', it.long);
    if (it.route === active) btn.setAttribute('aria-current', 'page');
    btn.onclick = () => navigate(it.route);
    nav.appendChild(btn);
  });
  const tools = el('div', 'nav-tools');
  const tour = el('button', 'nav-link', 'Take the tour'); tour.onclick = () => guide.start();
  tools.append(tour, ThemeToggle());
  const signer = el('div', 'signer', '<b>Chip signer connected</b>Your key never leaves this phone.');
  signer.dataset.tour = 'signer';
  nav.append(tools, signer);
  return nav;
}

export function mountBottomNav() {
  const root = document.getElementById('nav-root');
  root.innerHTML = '';
  root.appendChild(BottomNav());
}
