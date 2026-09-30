import { el } from '../utilities/helpers.js';
import { dataLoader } from '../services/dataLoader.js';

export async function InvestPage() {
  const holdings = await dataLoader.getHoldings();
  const page = el('div', '', `<h1>Investments</h1><p class="lede">Your stablecoin and liquidity-pool holdings across local markets.</p>`);
  holdings.forEach((h) => {
    const sign = h.changePct > 0 ? '+' : '';
    const cls = h.changePct > 0 ? 'up' : h.changePct < 0 ? 'down' : 'sub';
    page.appendChild(el('div', 'holding-row', `
      <div class="sym">${h.symbol}</div>
      <div><div class="name">${h.name}</div><div class="${cls}">${sign}${h.changePct}% today</div></div>
      <div class="amt">${h.balance}</div>
    `));
  });
  return page;
}
