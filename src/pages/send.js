import { el, toast, copyText } from '../utilities/helpers.js';
import { dataLoader } from '../services/dataLoader.js';
import { sessionStore } from '../services/sessionStore.js';
import { ContactCard } from '../components/contactCard.js';
import { Segmented, Chips } from '../components/segmented.js';
import { navigate } from '../router.js';

const fmt = (n) => n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export async function SendPage() {
  const [account, contacts, txs] = await Promise.all([
    dataLoader.getAccount(), dataLoader.getContacts(), dataLoader.getTransactions(),
  ]);
  const networks = dataLoader.getPayoutNetworks();
  const page = el('div', '', `<h1 class="sr">Send / Receive</h1>`);

  const pct = Math.round((account.offline.left / account.offline.limit) * 100);
  page.appendChild(el('div', 'hero-balance', `
    <div class="lbl">Wallet balance</div>
    <div class="val">${fmt(account.balance)} <small>${account.currency}</small></div>
    <div class="meter" role="img" aria-label="Offline allowance ${pct}% left"><i style="width:${pct}%"></i></div>
    <div class="note">Offline allowance: ${fmt(account.offline.left)} of ${fmt(account.offline.limit)} ${account.currency}</div>
  `));

  const body = el('div');

  function sendPane() {
    const pane = el('div');
    let net = networks[0];
    const phone = el('input', 'input');
    phone.type = 'tel'; phone.id = 'to-phone'; phone.placeholder = '+234 802 000 0000';
    const lbl = el('label', 'field', 'Send to a new number'); lbl.htmlFor = 'to-phone';
    const go = el('button', 'btn btn-primary', 'Choose amount');
    go.onclick = () => {
      if (!phone.value.trim()) { toast('Enter a phone number'); return; }
      sessionStore.begin({ name: phone.value.trim(), phone: phone.value.trim(), network: net.label, rail: net.id, payout: net.payout, registered: false });
      navigate('amount');
    };
    const box = el('div', 'panel');
    box.append(lbl, phone, el('span', 'field gap', 'Pay out to'),
      Chips(networks.map((n) => ({ id: n.id, label: n.label })), net.id, (id) => { net = networks.find((n) => n.id === id); }), go);
    pane.appendChild(box);

    pane.appendChild(el('strong', 'sec-title', 'Recent'));
    contacts.forEach((c) => pane.appendChild(ContactCard(c, (contact) => {
      sessionStore.begin({ ...contact });
      navigate('amount');
    })));

    pane.appendChild(el('strong', 'sec-title', 'Activity'));
    txs.forEach((t) => pane.appendChild(el('div', 'tx-row', `
      <div class="ic" style="background:${t.color}" aria-hidden="true">${t.icon}</div>
      <div><div class="name">${t.label}</div><div class="sub">${t.sub}</div></div>
      <div class="amt" style="color:${t.amount < 0 ? 'var(--text)' : '#12704A'}">${t.amount < 0 ? '-' : '+'}${fmt(Math.abs(t.amount))}</div>
    `)));
    return pane;
  }

  function receivePane() {
    const box = el('div', 'panel');
    box.appendChild(el('p', 'hint', 'Share these details. Deposits from M-Pesa or MTN arrive in your wallet.'));
    dataLoader.getReceiveInfo().forEach((r) => {
      const row = el('div', 'kv', `<div><span class="k">${r.k}</span>${r.v}</div>`);
      if (r.copy) { const b = el('button', 'link-btn', 'Copy'); b.onclick = () => copyText(r.v); row.appendChild(b); }
      box.appendChild(row);
    });
    const qr = el('div', 'kv', `<div><span class="k">Payment QR</span>Let anyone scan to pay you</div>`);
    const open = el('button', 'link-btn', 'Open'); open.onclick = () => navigate('more');
    qr.appendChild(open); box.appendChild(qr);
    return box;
  }

  const show = (mode) => body.replaceChildren(mode === 'send' ? sendPane() : receivePane());
  show('send');
  page.append(Segmented([{ id: 'send', label: 'Send' }, { id: 'receive', label: 'Receive' }], 'send', show), body);
  return page;
}
