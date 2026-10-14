import { el, initials } from '../utilities/helpers.js';
import { dataLoader } from '../services/dataLoader.js';
import { navigate } from '../router.js';

const fmt = (n) => n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// Title row shared by every tab: phones show the signer status, desktop shows the balance.
export async function PageHeader(title) {
  const [account, profile] = await Promise.all([dataLoader.getAccount(), dataLoader.getProfile()]);
  const bar = el('div', 'page-head', `
    <h1>${title}</h1>
    <div class="head-right">
      <span class="pill p-mobile">Chip signer on</span>
      <span class="pill p-desktop">Balance ${fmt(account.balance)} ${account.currency}</span>
      <button class="avatar-btn" aria-label="Profile">${initials(profile.name)}</button>
    </div>`);
  bar.querySelector('.avatar-btn').onclick = () => navigate('profile');
  return bar;
}
