import { el, esc, toast, copyText } from '../utilities/helpers.js';
import { dataLoader } from '../services/dataLoader.js';
import { PageHeader } from '../components/pageHeader.js';
import { SlimHero } from '../components/hero.js';
import { QrPlaceholder } from '../components/qrPlaceholder.js';
import { stagger } from '../utilities/motion.js';

export async function MorePage() {
  const [profile, tools] = await Promise.all([dataLoader.getProfile(), dataLoader.getPayTools()]);
  const link = tools.find((t) => t.id === 'link').sub;
  const page = el('div');
  page.appendChild(await PageHeader('More ways to get paid'));
  page.appendChild(SlimHero('Get paid', 'Share a QR, a link or a request. No app needed to pay you.'));

  const qr = el('div', 'panel qr-card', `
    <div class="qr-box">${QrPlaceholder(link)}</div>
    <div><b>Your payment QR</b></div>
    <p class="hint" style="margin:4px 0 0">Anyone can scan it to pay ${esc(profile.name.split(' ')[0])}. Amount optional.</p>
    <div class="actions"><button class="btn btn-ghost" data-a="amount">Add amount</button><button class="btn btn-primary" data-a="share">Share QR</button></div>`);
  qr.querySelector('[data-a="amount"]').onclick = () => toast('Amount on QR: coming with the backend');
  qr.querySelector('[data-a="share"]').onclick = () => copyText(link, 'Link copied');

  const grid = el('div', 'tiles');
  tools.forEach((t) => {
    const tile = el('button', 'tile', `<b>${esc(t.label)}</b><span>${esc(t.sub)}</span><span class="go">${esc(t.action)}</span>`);
    tile.type = 'button';
    tile.onclick = () => (t.id === 'link' ? copyText(link, 'Link copied') : toast(`${t.label}: coming with the backend`));
    grid.appendChild(tile);
  });
  stagger(grid, 70);
  const two = el('div', 'two'); two.append(qr, grid);
  page.appendChild(two);
  return page;
}
