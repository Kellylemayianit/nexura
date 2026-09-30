import { el } from '../utilities/helpers.js';
import { dataLoader } from '../services/dataLoader.js';
import { navigate } from '../router.js';

export async function Header() {
  const profile = await dataLoader.getProfile();
  const first = profile.name.split(' ')[0];
  const bar = el('div', 'topbar', `
    <div class="greet">
      <div class="avatar-sm"></div>
      <div><div class="hi">Hi, ${first} 👋</div><div class="sub">Welcome back to Nexura</div></div>
    </div>
    <div class="icons">
      <div class="icon-btn">🔔</div>
      <div class="icon-btn">⚙️</div>
    </div>
  `);
  bar.querySelectorAll('.icon-btn')[1].onclick = () => navigate('profile');
  return bar;
}

export async function mountHeader() {
  const root = document.getElementById('header-root');
  root.innerHTML = '';
  root.appendChild(await Header());
}
