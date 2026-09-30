import { el } from '../utilities/helpers.js';
import { sessionStore } from '../services/sessionStore.js';
import { auth } from '../utilities/auth.js';
import { Keypad } from '../components/keypad.js';
import { navigate } from '../router.js';

export async function AuthPage() {
  sessionStore.clearPin(); // keep recipient/amount, clear any stale pin
  const page = el('div', '', `<h1>Confirm with PIN</h1><p class="lede">Unlocks the secure element in your Kore hardware key to sign this transfer.</p>`);
  const dots = el('div', 'pin-dots');
  for (let i = 0; i < 4; i++) dots.appendChild(el('div', 'pin-dot'));

  const refreshDots = () => {
    const pin = sessionStore.get().pin;
    [...dots.children].forEach((d, i) => d.classList.toggle('filled', i < pin.length));
  };

  const pad = Keypad(['1','2','3','4','5','6','7','8','9','','0','⌫'], async (k) => {
    if (k === '⌫') sessionStore.backspacePin();
    else sessionStore.appendPinDigit(k);
    refreshDots();
    const pin = sessionStore.get().pin;
    if (pin.length === 4) {
      const ok = await auth.verifyPin(pin);
      if (ok) setTimeout(() => navigate('processing'), 300);
    }
  });

  page.append(dots, pad);
  return page;
}
