import { el, esc } from '../utilities/helpers.js';
import { icons } from '../utilities/icons.js';
import { sessionStore } from '../services/sessionStore.js';
import { auth } from '../utilities/auth.js';
import { ReceiptCard } from '../components/receiptCard.js';
import { countUp } from '../utilities/motion.js';
import { navigate } from '../router.js';

export async function ReceiptPage() {
  const s = sessionStore.get();
  if (!s.payment) { navigate('send'); return el('div'); }
  const title = s.payee.title || `Sent to ${s.payee.name.split(' ')[0]}`;
  const page = el('div', '', `<div class="success-icon">${icons.check}</div><h1 style="text-align:center">${esc(title)}</h1><div class="big-amt num" data-amt>KES 0.00</div>`);
  countUp(page.querySelector('[data-amt]'), s.quote.amountKes, { prefix: 'KES ' });
  const badge = el('div', 'center', s.payee.registered
    ? '<span class="badge reg">Instant on-chain credit</span>'
    : `<span class="badge unreg">Paid out via ${esc(s.payee.via || s.payee.network || 'mobile money')}, SMS sent</span>`);
  const done = el('button', 'btn btn-ghost', 'Done');
  done.onclick = () => { sessionStore.reset(); auth.clear(); navigate('send'); };
  page.append(badge, ReceiptCard(s), done);
  return page;
}
