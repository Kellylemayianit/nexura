import { el, esc, fmt } from '../utilities/helpers.js';

export function ReceiptCard({ payee, asset, quote, payment }) {
  const rows = [
    ['They receive', `KES ${fmt(quote.amountKes)}`],
    ['You paid', `${fmt(quote.youPay, asset.decimals)} ${asset.symbol}`],
    ['Rate', `1 ${asset.symbol} = KES ${fmt(quote.rate)}${quote.rateIsDemo ? ' (demo)' : ''}`],
    ['Route fee', `KES ${fmt(quote.fees.routeKes)}`],
    ['To', payee.phone || payee.ref || payee.name],
    ['Via', payee.via || payee.network || 'Mobile money'],
    ['Reference', payment.reference],
  ];
  return el('div', 'receipt', rows.map(([k, v]) => `<div class="receipt-row"><span class="k">${esc(k)}</span><span>${esc(v)}</span></div>`).join(''));
}
