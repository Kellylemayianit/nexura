import { el } from '../utilities/helpers.js';
import { sessionStore } from '../services/sessionStore.js';
import { dataLoader } from '../services/dataLoader.js';
import { Keypad } from '../components/keypad.js';
import { navigate } from '../router.js';

export async function AmountPage() {
  const { recipient } = sessionStore.get();
  if (!recipient) { navigate('send'); return el('div'); }
  const cur = recipient.entry || 'USDC';

  const page = el('div', '', `<h1>To ${recipient.name.split(' ')[0]}</h1><p class="lede">${recipient.phone}${recipient.network ? ', ' + recipient.network : ''}</p>`);
  const disp = el('div', 'amount-display');
  const sub = el('div', 'amount-sub');
  const feePct = dataLoader.getRouteFeePct();

  const refresh = () => {
    const amount = sessionStore.get().amount;
    disp.textContent = `${amount || '0'} ${cur}`;
    sub.textContent = amount
      ? `${(parseFloat(amount) * (1 - feePct)).toFixed(2)} ${cur} after the ${(feePct * 100).toFixed(2)}% route fee`
      : 'Enter an amount to send';
  };
  refresh();

  const pad = Keypad(['1','2','3','4','5','6','7','8','9','.','0','⌫'], (k) => {
    const cur2 = sessionStore.get().amount;
    if (k === '⌫') sessionStore.setAmount(cur2.slice(0, -1));
    else if (cur2.length < 8) sessionStore.setAmount(cur2 + k);
    refresh();
  });

  const btn = el('button', 'btn btn-primary', 'Continue to sign');
  btn.style.marginTop = '18px';
  btn.onclick = () => { if (parseFloat(sessionStore.get().amount) > 0) navigate('auth'); };

  page.append(disp, sub, pad, btn);
  return page;
}
