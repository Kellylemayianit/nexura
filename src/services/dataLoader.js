// The only data import surface pages/components should use.
// Today it reads the static demo dataset with a simulated delay so
// loading states are visible; swap the bodies for `api.js` calls later
// and nothing upstream has to change.
import {
  CONTACTS, PAYOUT_NETWORKS, ACCOUNT, ROUTE_FEE_PCT, ROUTING_STEPS, PROFILE, TRANSACTIONS,
  LIPA_MODES, SAVED_PAYBILLS, AIRTIME_PROVIDERS, AIRTIME_PRESETS, DATA_BUNDLES,
  RECEIVE_INFO, PAY_TOOLS, HOLDINGS,
} from '../../data/demo.js';

const cache = new Map();
const delay = (ms) => new Promise(r => setTimeout(r, ms));

async function cached(key, fn) {
  if (cache.has(key)) return cache.get(key);
  const value = await fn();
  cache.set(key, value);
  return value;
}

export const dataLoader = {
  getContacts: () => cached('contacts', async () => { await delay(120); return CONTACTS; }),
  getPayoutNetworks: () => PAYOUT_NETWORKS,
  getAccount:  () => cached('account',  async () => { await delay(80);  return ACCOUNT; }),
  getProfile:  () => cached('profile',  async () => { await delay(60);  return PROFILE; }),
  getTransactions: () => cached('tx', async () => { await delay(100); return TRANSACTIONS; }),
  getLipaModes: () => LIPA_MODES,
  getSavedPaybills: () => cached('paybills', async () => { await delay(80); return SAVED_PAYBILLS; }),
  getAirtimeProviders: () => AIRTIME_PROVIDERS,
  getAirtimePresets: () => AIRTIME_PRESETS,
  getDataBundles: () => DATA_BUNDLES,
  getReceiveInfo: () => RECEIVE_INFO,
  getPayTools: () => PAY_TOOLS,
  getHoldings: () => cached('holdings', async () => { await delay(100); return HOLDINGS; }),
  getRouteFeePct: () => ROUTE_FEE_PCT,
  getRoutingSteps: (recipient) => ROUTING_STEPS(recipient),
  clearCache: () => cache.clear(),
};
