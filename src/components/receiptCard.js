import { el, formatAmount } from '../utilities/helpers.js';

export function ReceiptCard({ amount, feePct, recipient, registered }) {
  const fee = (parseFloat(amount) || 0) * feePct;
  return el('div', 'receipt', `
    <div class="receipt-row"><span class="k">Amount</span><span>${formatAmount(amount)}</span></div>
    <div class="receipt-row"><span class="k">Route fee (${(feePct * 100).toFixed(2)}%)</span><span>${formatAmount(fee)}</span></div>
    <div class="receipt-row"><span class="k">Recipient</span><span>${recipient.phone}</span></div>
    <div class="receipt-row"><span class="k">Settlement</span><span>${registered ? 'cNGN / USDC wallet' : 'Local bank / mobile money'}</span></div>
  `);
}
