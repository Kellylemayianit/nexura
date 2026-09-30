// The only data import surface pages/components should use.
// Today it reads the static demo dataset with a simulated delay so
// loading states are visible; swap the bodies for `api.js` calls later
// and nothing upstream has to change.
import {
  CONTACTS, ACCOUNT, ROUTE_FEE_PCT, ROUTING_STEPS, PROFILE, TRANSACTIONS,
  QUICK_SERVICES, BILL_CATEGORIES, UNPAID_BILL, NEARBY_FRIENDS, BILL_HISTORY, HOLDINGS,
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
  getAccount:  () => cached('account',  async () => { await delay(80);  return ACCOUNT; }),
  getProfile:  () => cached('profile',  async () => { await delay(60);  return PROFILE; }),
  getTransactions: () => cached('tx', async () => { await delay(100); return TRANSACTIONS; }),
  getQuickServices: () => QUICK_SERVICES,
  getBillCategories: () => BILL_CATEGORIES,
  getUnpaidBill: () => cached('bill', async () => { await delay(80); return UNPAID_BILL; }),
  getNearbyFriends: () => NEARBY_FRIENDS,
  getBillHistory: () => cached('billhist', async () => { await delay(80); return BILL_HISTORY; }),
  getHoldings: () => cached('holdings', async () => { await delay(100); return HOLDINGS; }),
  getRouteFeePct: () => ROUTE_FEE_PCT,
  getRoutingSteps: (registered) => ROUTING_STEPS(registered),
  clearCache: () => cache.clear(),
};
