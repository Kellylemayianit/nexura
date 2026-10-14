import { el } from '../utilities/helpers.js';
import { sessionStore } from '../services/sessionStore.js';
import { payments } from '../services/payments.js';
import { auth } from '../utilities/auth.js';
import { RouteSteps } from '../components/routeStep.js';
import { navigate, onRouteChange } from '../router.js';

export async function ProcessingPage() {
  const s = sessionStore.get();
  if (!s.payee || !s.quote) { navigate('send'); return el('div'); }
  if (!auth.isAuthed()) { navigate('auth'); return el('div'); }

  const page = el('div', '', '<h1>Sending your payment</h1>');
  const lede = el('p', 'lede', 'Your chip has signed it. Your partner is moving the money.');
  const steps = payments.steps(s), route = RouteSteps(steps);
  page.append(lede, route);

  let stop = () => {};
  const off = onRouteChange(() => { stop(); off(); });
  const fail = (msg) => {
    lede.textContent = msg;
    const b = el('button', 'btn btn-primary', 'Back to payment'); b.onclick = () => { sessionStore.reset(); navigate('send'); };
    page.appendChild(b);
  };
  (async () => {
    try {
      let p = s.payment;                       // a revisit never creates a second payment
      if (!p) { p = await payments.submit(s); sessionStore.setPayment(p); }
      stop = payments.watch(p.id, (u) => {
        if (u.status === 'error') return;      // transient poll failure: keep polling
        if (u.status === 'failed') return fail('The payment failed. You have not been charged.');
        const done = payments.progress(u.status);
        route.setProgress(steps.filter((st) => payments.progress(st.done) <= done).length);
        if (u.status === 'completed') { stop(); setTimeout(() => navigate('receipt'), 700); }
      });
    } catch (e) { fail(e.message || 'Could not start the payment.'); }
  })();
  return page;
}
