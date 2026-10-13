import { el, toast, copyText } from '../utilities/helpers.js';
import { icons } from '../utilities/icons.js';
import { dataLoader } from '../services/dataLoader.js';
import { QrPlaceholder } from '../components/qrPlaceholder.js';

export async function MorePage() {
  const profile = await dataLoader.getProfile();
  const tools = dataLoader.getPayTools();
  const link = tools.find((t) => t.id === 'link').sub;
  const page = el('div', '', `<h1>More ways to get paid</h1><p class="lede">Let anyone pay you, even if they don't have Nexura.</p>`);

  const qr = el('div', 'panel qr-card', `
    <div class="qr-box">${QrPlaceholder(link)}</div>
    <div><b>Your payment QR</b></div>
    <p class="hint" style="margin:4px 0 0">Anyone can scan it to pay ${profile.name.split(' ')[0]}. Amount optional.</p>
    <div class="row2"><button class="btn btn-ghost" data-a="amount">Add amount</button><button class="btn btn-primary" data-a="share">Share QR</button></div>
  `);
  qr.querySelector('[data-a="amount"]').onclick = () => toast('Amount on QR: demo only');
  qr.querySelector('[data-a="share"]').onclick = () => copyText(link, 'Link copied');
  page.appendChild(qr);

  const grid = el('div', 'tiles');
  tools.forEach((t) => {
    const tile = el('button', 'tile', `<div class="ti">${icons[t.icon]}</div><b>${t.label}</b><span>${t.sub}</span>`);
    tile.type = 'button';
    tile.onclick = () => t.id === 'link' ? copyText(link, 'Link copied') : toast(`${t.label}: demo only`);
    grid.appendChild(tile);
  });
  page.appendChild(grid);
  return page;
}
