import { el, esc, fmt, initials } from '../utilities/helpers.js';
import { icons } from '../utilities/icons.js';
import { dataLoader } from '../services/dataLoader.js';
import { ThemeToggle } from './themeToggle.js';
import { navigate } from '../router.js';

// Phones: sticky app bar (brand, signer status, theme, profile) then a large page title. Desktop: title + total (tools live in the sidebar).
export async function PageHeader(title, sub) {
  const [assets, profile] = await Promise.all([dataLoader.getAssets(), dataLoader.getProfile()]);
  const total = assets.reduce((s, a) => s + a.balance * a.rateKes, 0);
  const head = el('header', 'page-head', `
    <div class="appbar mobile-only">
      <span class="brand"><span class="mark">${icons.logo}</span>Nexura</span>
      <div class="head-right">
        <span class="signer-chip" data-tour="signer">Signer on</span>
        <button class="avatar-btn" data-act="profile" aria-label="Profile">${esc(initials(profile.name))}</button>
      </div>
    </div>
    <div class="title-row"><h1>${esc(title)}</h1><span class="pill p-desktop">Total KES ${fmt(total, 0)}</span></div>
    ${sub ? `<p class="page-sub">${esc(sub)}</p>` : ''}`);
  const right = head.querySelector('.head-right');
  right.insertBefore(ThemeToggle(), right.querySelector('.avatar-btn'));
  head.querySelector('[data-act="profile"]').onclick = () => navigate('profile');
  return head;
}
