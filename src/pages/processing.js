import { el } from '../utilities/helpers.js';
import { sessionStore } from '../services/sessionStore.js';
import { dataLoader } from '../services/dataLoader.js';
import { RouteSteps } from '../components/routeStep.js';
import { navigate } from '../router.js';

export async function ProcessingPage() {
  const { recipient } = sessionStore.get();
  if (!recipient) { navigate('send'); return el('div'); }

  const page = el('div', '', `<h1>Routing transfer</h1><p class="lede">Your chip has signed it. Your partner is moving the money.</p>`);
  const steps = dataLoader.getRoutingSteps(recipient);
  page.appendChild(RouteSteps(steps, () => navigate('receipt')));
  return page;
}
