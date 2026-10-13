import { el, formatAmount } from '../utilities/helpers.js';

export function ReceiptCard({ amount, feePct, recipient, registered }) {
  const cur = recipient.entry || 'USDC';
  const fee = (parseFloat(amount) || 0) * feePct;
  const payout = recipient.settlement || (registered ? 'Nexura wallet (USDC)' : `Partner payout to ${recipient.network || 'mobile money'}`);
  return el('div', 'receipt', `
    <div class="receipt-row"><span class="k">Amount</span><span>${formatAmount(amount, cur)}</span></div>
    <div class="receipt-row"><span class="k">Route fee (${(feePct * 100).toFixed(2)}%)</span><span>${formatAmount(fee, cur)}</span></div>
    <div class="receipt-row"><span class="k">To</span><span>${recipient.phone}</span></div>
    <div class="receipt-row"><span class="k">Settlement</span><span>${payout}</span></div>
  `);
}
