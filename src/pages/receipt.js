import { el } from '../utilities/helpers.js';
import { sessionStore } from '../services/sessionStore.js';
import { dataLoader } from '../services/dataLoader.js';
import { ReceiptCard } from '../components/receiptCard.js';
import { navigate } from '../router.js';

export async function ReceiptPage() {
  const { recipient, amount } = sessionStore.get();
  if (!recipient) { navigate('contacts'); return el('div'); }

  const page = el('div', '', `<div class="success-icon">✓</div><h1 style="text-align:center">Sent to ${recipient.name.split(' ')[0]}</h1>`);
  const badge = el('div', '', recipient.registered
    ? `<span class="badge reg">Instant on-chain credit</span>`
    : `<span class="badge unreg">Off-ramped to mobile money · SMS sent</span>`);
  badge.style.textAlign = 'center';

  const feePct = dataLoader.getRouteFeePct();
  const receipt = ReceiptCard({ amount, feePct, recipient, registered: recipient.registered });

  const again = el('button', 'btn btn-ghost', 'New transfer');
  again.onclick = () => { sessionStore.reset(); navigate('contacts'); };

  page.append(badge, receipt, again);
  return page;
}
