import { el, toast, copyText } from '../utilities/helpers.js';
import { dataLoader } from '../services/dataLoader.js';
import { sessionStore } from '../services/sessionStore.js';
import { PageHeader } from '../components/pageHeader.js';
import { Segmented, Chips } from '../components/segmented.js';
import { navigate } from '../router.js';
import { initials } from '../utilities/helpers.js';

export async function SendPage() {
  const contacts = await dataLoader.getContacts();
  const networks = dataLoader.getPayoutNetworks();
  const feePct = dataLoader.getRouteFeePct();
  const page = el('div');
  page.appendChild(await PageHeader('Send / Receive'));

  // ----- Send pane -----
  let net = networks[0], picked = null;
  const to = el('input', 'input'); to.id = 'send-to'; to.placeholder = 'Name or phone number';
  const amt = el('input', 'input'); amt.id = 'send-amt'; amt.inputMode = 'decimal'; amt.placeholder = '0.00';
  const gets = el('b'), fees = el('b');
  const refresh = () => {
    const a = parseFloat(amt.value) || 0;
    gets.textContent = `${net.payout} [live rate]`;
    fees.textContent = a > 0 ? `${(a * feePct).toFixed(2)} USDC + [partner fee]` : '[partner fee + route fee]';
  };
  const chips = Chips(networks.map((n) => ({ id: n.id, label: n.label })), net.id, (id) => { net = networks.find((n) => n.id === id); refresh(); });
  const setNet = (id) => { chips.querySelectorAll('.chip').forEach((c, i) => { const on = networks[i].id === id; c.classList.toggle('on', on); c.setAttribute('aria-pressed', on); }); net = networks.find((n) => n.id === id); };
  to.oninput = () => { picked = null; }; amt.oninput = refresh;

  const recent = el('div', 'recent');
  recent.appendChild(el('span', 'field', 'Recent'));
  const row = el('div', 'chips');
  contacts.forEach((c) => {
    const b = el('button', 'av-btn', initials(c.name)); b.type = 'button'; b.setAttribute('aria-label', c.name);
    b.onclick = () => { picked = c; to.value = `${c.name}, ${c.phone}`; setNet(c.rail); refresh(); amt.focus(); };
    row.appendChild(b);
  });
  const add = el('button', 'av-btn', '+'); add.type = 'button'; add.setAttribute('aria-label', 'New recipient');
  add.onclick = () => { picked = null; to.value = ''; to.focus(); };
  row.appendChild(add); recent.appendChild(row);

  const go = el('button', 'btn btn-primary', 'Review and sign with chip');
  go.onclick = () => {
    const a = parseFloat(amt.value);
    if (!to.value.trim() || !(a > 0)) { toast('Enter who to pay and an amount'); return; }
    const who = picked || { name: to.value.trim(), phone: to.value.trim(), registered: false };
    sessionStore.begin({ ...who, network: net.label, rail: net.id, payout: net.payout }, String(a));
    navigate('auth');
  };

  const pTo = el('div', 'panel');
  const lt = el('label', 'field', 'To'); lt.htmlFor = 'send-to';
  pTo.append(lt, to, el('span', 'field gap', 'Pay out to'), chips);
  const pAmt = el('div', 'panel');
  const la = el('label', 'field', 'Amount (USDC)'); la.htmlFor = 'send-amt';
  const r1 = el('div', 'row', '<span class="k">Recipient gets</span>'); r1.appendChild(gets);
  const r2 = el('div', 'row', '<span class="k">Fees</span>'); r2.appendChild(fees);
  pAmt.append(la, amt, r1, r2);
  refresh();

  const send = el('section', 'pane-send');
  send.append(el('h2', 'card-title', 'Send money'), pTo, recent, pAmt, go);

  // ----- Receive pane -----
  const rec = el('section', 'pane-receive');
  rec.appendChild(el('h2', 'card-title', 'Receive money'));
  rec.appendChild(el('p', 'hint', 'Share these details. Deposits from M-Pesa or MTN arrive in your wallet.'));
  const box = el('div', 'panel');
  dataLoader.getReceiveInfo().forEach((r) => {
    const kv = el('div', 'kv', `<div><span class="k">${r.k}</span>${r.v}</div>`);
    if (r.copy) { const b = el('button', 'link-btn', 'Copy'); b.onclick = () => copyText(r.v); kv.appendChild(b); }
    box.appendChild(kv);
  });
  const qr = el('div', 'kv', '<div><span class="k">Payment QR</span>Let anyone scan to pay you</div>');
  const open = el('button', 'link-btn', 'Open'); open.onclick = () => navigate('more');
  qr.appendChild(open); box.appendChild(qr); rec.appendChild(box);

  const two = el('div', 'two'); two.dataset.mode = 'send';
  two.append(send, rec);
  const seg = Segmented([{ id: 'send', label: 'Send' }, { id: 'receive', label: 'Receive' }], 'send', (m) => { two.dataset.mode = m; });
  seg.classList.add('mobile-only');
  page.append(seg, two);
  return page;
}
