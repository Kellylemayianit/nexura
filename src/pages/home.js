import { el, formatAmount, toast } from '../utilities/helpers.js';
import { dataLoader } from '../services/dataLoader.js';
import { navigate } from '../router.js';

const ROUTES = { send:'contacts', paybill:'paybill', mobile:'airtime' };

export async function HomePage() {
  const [account, txs, services, freqs, fin, wallets] = await Promise.all([
    dataLoader.getAccount(), dataLoader.getTransactions(), dataLoader.getQuickServices(),
    dataLoader.getFrequents(), dataLoader.getFinancialServices(), dataLoader.getWallets(),
  ]);
  const page = el('div');

  page.appendChild(el('div', 'home-hero', `
    <div class="asset-card">
      <div class="lbl">Total asset value</div>
      <div class="val">${formatAmount(account.balance, account.currency)}</div>
      <span class="chg">▲ 4.78% (+0.20%) vs last week</span>
      <div class="mini-icons"><span>🪙</span><span>💱</span><span>📈</span><span>🧾</span></div>
    </div>
    <button class="btn btn-ghost" style="background:#fff">View statements</button>
  `));

  // Quick Actions — room for every service line, not just the ones already built
  page.appendChild(el('div', 'section-row', `<strong style="margin-top:18px">Quick Actions</strong><span class="view-all">View all ↗</span>`));
  const grid = el('div', 'cat-grid');
  services.forEach((s) => {
    const item = el('div', '', `<div class="cat-ic">${s.icon}</div><span>${s.label}</span>`);
    item.style.cursor = 'pointer';
    item.onclick = () => ROUTES[s.id] ? navigate(ROUTES[s.id]) : toast(`${s.label} — coming soon`);
    grid.appendChild(item);
  });
  page.appendChild(grid);

  // Frequents
  page.appendChild(el('div', 'section-row', `<strong>Frequents</strong>`));
  const freqRow = el('div', 'friend-row');
  freqs.forEach((f) => freqRow.appendChild(el('div', 'friend', `<div class="av" style="background:${f.color}"></div><span>${f.name.split(' ')[0]}</span>`)));
  page.appendChild(freqRow);

  // Financial Services
  page.appendChild(el('div', 'section-row', `<strong style="margin-top:18px">Financial Services</strong>`));
  const finGrid = el('div', 'cat-grid');
  finGrid.style.gridTemplateColumns = `repeat(${fin.length},1fr)`;
  fin.forEach((f) => {
    const cell = el('div');
    cell.style.textAlign = 'center';
    cell.innerHTML = `<div class="cat-ic">${f.icon}</div><span>${f.label}</span>`;
    cell.onclick = () => toast(`${f.label} — coming soon`);
    cell.style.cursor = 'pointer';
    finGrid.appendChild(cell);
  });
  page.appendChild(finGrid);

  // Wallets
  page.appendChild(el('div', 'section-row', `<strong style="margin-top:18px">Wallets</strong>`));
  const walletGrid = el('div', 'cat-grid');
  walletGrid.style.gridTemplateColumns = `repeat(${wallets.length},1fr)`;
  wallets.forEach((w) => {
    const cell = el('div');
    cell.style.cssText = 'text-align:center;cursor:pointer';
    cell.innerHTML = `<div class="cat-ic">${w.icon}</div><span>${w.label}</span>`;
    cell.onclick = () => toast(`${w.label} — coming soon`);
    walletGrid.appendChild(cell);
  });
  page.appendChild(walletGrid);

  // Transactions
  page.appendChild(el('div', 'section-row', `<strong style="margin-top:18px">Transactions</strong><span class="view-all">View all ↗</span>`));
  txs.forEach((t) => {
    page.appendChild(el('div', 'tx-row', `
      <div class="ic" style="background:${t.color}">${t.icon}</div>
      <div><div class="name">${t.label}</div><div class="sub">${t.sub}</div></div>
      <div class="amt" style="color:${t.amount < 0 ? 'var(--text)' : '#1E9E5A'}">${t.amount < 0 ? '-' : '+'}$${Math.abs(t.amount).toFixed(2)}</div>
    `));
  });
  return page;
}
