import { el, esc, initials, toast } from '../utilities/helpers.js';
import { dataLoader } from '../services/dataLoader.js';
import { theme } from '../services/theme.js';
import { guide } from '../components/guide.js';
import { navigate } from '../router.js';
import { PageHeader } from '../components/pageHeader.js';

const GROUPS = [
  [{ label: 'Assets', route: 'invest' }, { label: 'Personal details' }, { label: 'Security' }, { label: 'Linked accounts' }],
  [{ label: 'Smart login' }, { label: 'Dark mode', switch: true }],
  [{ label: 'Take the tour', action: () => guide.start() }, { label: 'FAQs' }, { label: 'Help centre' }],
  [{ label: 'Privacy' }],
];

function group(items) {
  const box = el('div', 'profile-group');
  items.forEach((it) => {
    const row = el('button', 'profile-row', it.switch ? `<span>${esc(it.label)}</span><span class="switch" aria-hidden="true"></span>` : `<span>${esc(it.label)}</span><span class="arrow">›</span>`);
    row.type = 'button';
    if (it.switch) {
      const sw = row.querySelector('.switch');
      row.setAttribute('role', 'switch');
      const paint = (t) => { sw.classList.toggle('on', t === 'dark'); row.setAttribute('aria-checked', String(t === 'dark')); };
      paint(theme.current());
      const off = theme.subscribe((t) => { if (!row.isConnected) return off(); paint(t); });
      row.onclick = () => theme.toggle();
    } else row.onclick = () => (it.action ? it.action() : it.route ? navigate(it.route) : toast(`${it.label}: coming with the backend`));
    box.appendChild(row);
  });
  return box;
}

export async function ProfilePage() {
  const profile = await dataLoader.getProfile();
  const page = el('div');
  page.appendChild(await PageHeader('Profile'));
  page.appendChild(el('div', 'profile-head', `<div class="av">${esc(initials(profile.name))}</div><div><div class="name">${esc(profile.name)}</div><div class="phone">${esc(profile.phone)}</div></div>`));
  GROUPS.forEach((g) => page.appendChild(group(g)));
  return page;
}
