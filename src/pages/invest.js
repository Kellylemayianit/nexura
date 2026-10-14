import { el, esc, fmt } from '../utilities/helpers.js';
import { dataLoader } from '../services/dataLoader.js';
import { PageHeader } from '../components/pageHeader.js';
import { stagger } from '../utilities/motion.js';

export async function InvestPage() {
  const assets = await dataLoader.getAssets();
  const page = el('div');
  page.appendChild(await PageHeader('Assets'));
  page.appendChild(el('p', 'lede', 'What is in your wallet and what it is worth in KES.'));
  const list = el('div');
  assets.forEach((a) => {
    const row = el('div', 'holding-row', `<div class="sym" style="--c:${esc(a.color)}">${esc(a.symbol[0])}</div>
      <div><div class="name">${esc(a.symbol)}</div><div class="sub">${esc(a.name)}</div></div>
      <div class="amt"><div class="num">${fmt(a.balance, a.decimals)}</div><div class="sub num">≈ KES ${fmt(a.balance * a.rateKes, 0)}${a.rateIsDemo ? ' (demo)' : ''}</div></div>`);
    list.appendChild(row);
  });
  page.appendChild(stagger(list, 70));
  return page;
}
