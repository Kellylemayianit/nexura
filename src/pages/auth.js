import { el, esc, fmt } from '../utilities/helpers.js';
import { sessionStore } from '../services/sessionStore.js';
import { auth } from '../utilities/auth.js';
import { Keypad } from '../components/keypad.js';
import { toast } from '../utilities/helpers.js';
import { navigate } from '../router.js';

export async function AuthPage() {
  const s = sessionStore.get();
  if (!s.payee || !s.quote) { navigate('send'); return el('div'); }
  sessionStore.clearPin(); auth.clear();
  const page = el('div', '', `<h1>Confirm with PIN</h1><p class="lede">Unlocks the secure chip in your phone to sign this payment.</p>`);
  page.appendChild(el('div', 'receipt', `
    <div class="receipt-row"><span class="k">To</span><span>${esc(s.payee.name)}</span></div>
    <div class="receipt-row"><span class="k">They receive</span><span>KES ${fmt(s.quote.amountKes)}</span></div>
    <div class="receipt-row"><span class="k">You pay</span><span>${fmt(s.quote.youPay, s.asset.decimals)} ${esc(s.asset.symbol)}</span></div>`));
  const dots = el('div', 'pin-dots');
  for (let i = 0; i < 4; i++) dots.appendChild(el('div', 'pin-dot'));
  const paint = () => [...dots.children].forEach((d, i) => d.classList.toggle('filled', i < sessionStore.get().pin.length));

  const pad = Keypad(['1','2','3','4','5','6','7','8','9','','0','⌫'], async (k) => {
    if (k === '⌫') sessionStore.backspacePin(); else sessionStore.appendPinDigit(k);
    paint();
    const pin = sessionStore.get().pin;
    if (pin.length < 4) return;
    if (await auth.verifyPin(pin)) { navigate('processing'); return; }
    dots.classList.add('shake'); toast('That PIN did not work');
    setTimeout(() => { dots.classList.remove('shake'); sessionStore.clearPin(); paint(); }, 450);
  });
  const cancel = el('button', 'btn btn-ghost', 'Cancel'); cancel.onclick = () => { sessionStore.reset(); navigate('send'); };
  page.append(dots, pad, cancel);
  return page;
}
