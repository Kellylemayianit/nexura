import { el } from '../utilities/helpers.js';
import { sessionStore } from '../services/sessionStore.js';
import { dataLoader } from '../services/dataLoader.js';
import { RouteSteps } from '../components/routeStep.js';
import { navigate } from '../router.js';

export async function ProcessingPage() {
  const { recipient } = sessionStore.get();
  if (!recipient) { navigate('contacts'); return el('div'); }

  const page = el('div', '', `<h1>Routing transfer</h1><p class="lede">Kore protocol is signing and swapping on-chain.</p>`);
  const steps = dataLoader.getRoutingSteps(recipient.registered);
  page.appendChild(RouteSteps(steps, () => navigate('receipt')));
  return page;
}
