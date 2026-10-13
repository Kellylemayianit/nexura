import { el, initials } from '../utilities/helpers.js';
import { icons } from '../utilities/icons.js';
import { dataLoader } from '../services/dataLoader.js';
import { navigate } from '../router.js';

export async function Header() {
  const profile = await dataLoader.getProfile();
  const first = profile.name.split(' ')[0];
  const bar = el('div', 'topbar', `
    <div class="greet">
      <div class="avatar-sm">${initials(profile.name)}</div>
      <div><div class="hi">Hi, ${first}</div><div class="sub">Chip signer on</div></div>
    </div>
    <div class="icons"><button class="icon-btn" aria-label="Profile">${icons.user}</button></div>
  `);
  bar.querySelector('.icon-btn').onclick = () => navigate('profile');
  return bar;
}

export async function mountHeader() {
  const root = document.getElementById('header-root');
  root.innerHTML = '';
  root.appendChild(await Header());
}
