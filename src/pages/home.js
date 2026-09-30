import { el, formatAmount } from '../utilities/helpers.js';
import { dataLoader } from '../services/dataLoader.js';
import { navigate } from '../router.js';
import { MoreServicesSheet } from '../components/moreServicesSheet.js';

export async function HomePage() {
  const [account, txs] = await Promise.all([dataLoader.getAccount(), dataLoader.getTransactions()]);
  const page = el('div');

  const hero = el('div', 'home-hero', `
    <div class="asset-card">
      <div class="lbl">Total asset value</div>
      <div class="val">${formatAmount(account.balance, account.currency)}</div>
      <span class="chg">▲ 4.78% (+0.20%) vs last week</span>
      <div class="mini-icons"><span>🪙</span><span>💱</span><span>📈</span><span>🧾</span></div>
    </div>
  `);
  page.appendChild(hero);

  const body = el('div');
  const actions = el('div', 'action-row', `
    <div class="action-pill">⬆ Deposit</div>
    <div class="action-pill">⬇ Withdraw</div>
  `);
  actions.children[0].onclick = () => navigate('contacts');
  actions.children[1].onclick = () => MoreServicesSheet();
  body.appendChild(actions);

  body.appendChild(el('div', 'section-row', `<strong>Transactions</strong><span class="view-all">View all ↗</span>`));
  txs.forEach((t) => {
    body.appendChild(el('div', 'tx-row', `
      <div class="ic" style="background:${t.color}">${t.icon}</div>
      <div><div class="name">${t.label}</div><div class="sub">${t.sub}</div></div>
      <div class="amt" style="color:${t.amount < 0 ? 'var(--text)' : '#1E9E5A'}">${t.amount < 0 ? '-' : '+'}$${Math.abs(t.amount).toFixed(2)}</div>
    `));
  });
  page.appendChild(body);
  return page;
}
