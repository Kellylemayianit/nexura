import { el, esc, fmt } from '../utilities/helpers.js';
import { dataLoader } from '../services/dataLoader.js';
import { AssetPicker } from './assetPicker.js';
import { bump } from '../utilities/motion.js';

// "You pay" box shared by Send, Lipa and Airtime: optional asset picker + a live, debounced quote from the backend.
export function QuoteBox(assets, { kind, picker = true, onChange } = {}) {
  let assetId = assets[0].id, amountKes = 0, payee = null, quote = null, seq = 0, timer = null;
  const root = el('div', 'quotebox');
  const line = el('div', 'quote-line'); line.setAttribute('aria-live', 'polite');
  const asset = () => assets.find((a) => a.id === assetId);

  const paint = () => {
    if (!(amountKes > 0)) { line.innerHTML = '<span class="mut">Enter an amount to see what you pay.</span>'; return; }
    if (!quote) return;
    const a = asset(), short = quote.youPay > a.balance;
    line.innerHTML = `<span>You pay <b class="num">${fmt(quote.youPay, a.decimals)} ${esc(a.symbol)}</b></span>
      <span class="mut">1 ${esc(a.symbol)} = KES ${fmt(quote.rate)}${quote.rateIsDemo ? ' (demo rate)' : ''}</span>
      ${short ? `<span class="err">Not enough ${esc(a.symbol)}</span>` : ''}`;
    bump(line.querySelector('b'));
  };

  const refresh = () => {
    clearTimeout(timer); quote = null; onChange?.(null);
    const mine = ++seq;
    if (!(amountKes > 0)) return paint();
    line.innerHTML = '<span class="skel skel-line"></span>';
    timer = setTimeout(async () => {
      try {
        const q = await dataLoader.createQuote({ kind, assetId, amountKes, payee });
        if (mine !== seq) return;
        quote = q; paint(); onChange?.(q);
      } catch (e) {
        if (mine !== seq) return;
        line.innerHTML = `<span class="err">${esc(e.message)}.</span>`;
        const retry = el('button', 'link-btn', 'Retry'); retry.onclick = refresh; line.appendChild(retry);
      }
    }, 250);
  };

  if (picker) root.appendChild(AssetPicker(assets, assetId, (id) => { assetId = id; refresh(); }, { compact: true }));
  root.appendChild(line); paint();
  return Object.assign(root, {
    setAmount(kes, p) { amountKes = kes; payee = p; refresh(); },
    setAsset(id) { assetId = id; refresh(); },
    getQuote: () => quote,
    getAsset: asset,
    isAffordable: () => !!quote && quote.youPay <= asset().balance,
  });
}
