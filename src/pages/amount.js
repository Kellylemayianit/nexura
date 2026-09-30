import { el } from '../utilities/helpers.js';
import { sessionStore } from '../services/sessionStore.js';
import { dataLoader } from '../services/dataLoader.js';
import { Keypad } from '../components/keypad.js';
import { navigate } from '../router.js';

export async function AmountPage() {
  const { recipient } = sessionStore.get();
  if (!recipient) { navigate('contacts'); return el('div'); }

  const page = el('div', '', `<h1>To ${recipient.name.split(' ')[0]}</h1><p class="lede">${recipient.phone}</p>`);
  const disp = el('div', 'amount-display');
  const sub = el('div', 'amount-sub');
  const feePct = dataLoader.getRouteFeePct();

  const refresh = () => {
    const amount = sessionStore.get().amount;
    disp.textContent = `${amount || '0'} cKES`;
    sub.textContent = amount
      ? `≈ ${(parseFloat(amount) * (1 - feePct)).toFixed(2)} USDC after ${(feePct * 100).toFixed(2)}% route fee`
      : 'Enter an amount to send';
  };
  refresh();

  const pad = Keypad(['1','2','3','4','5','6','7','8','9','.','0','⌫'], (k) => {
    const cur = sessionStore.get().amount;
    if (k === '⌫') sessionStore.setAmount(cur.slice(0, -1));
    else if (cur.length < 8) sessionStore.setAmount(cur + k);
    refresh();
  });

  const btn = el('button', 'btn btn-primary', 'Continue');
  btn.style.marginTop = '18px';
  btn.onclick = () => { if (parseFloat(sessionStore.get().amount) > 0) navigate('auth'); };

  page.append(disp, sub, pad, btn);
  return page;
}
