// The only data surface pages and components use. Picks the mock or real backend from config/runtime.js,
// adds a small TTL cache for reads, and never caches writes.
import { env } from '../config/env.js';
import { api } from './api.js';
import { mock } from './mock.js';

const backend = env.USE_MOCK ? mock : api;
const cache = new Map();
async function cached(key, fn, ttl = 30000) {
  const hit = cache.get(key);
  if (hit && Date.now() - hit.t < ttl) return hit.v;
  const v = await fn();
  cache.set(key, { v, t: Date.now() });
  return v;
}

export const dataLoader = {
  source: env.USE_MOCK ? 'mock' : 'api',
  getProfile:       () => cached('profile', () => backend.getProfile(), 300000),
  getAssets:        () => cached('assets', () => backend.getAssets(), 15000),
  getContacts:      () => cached('contacts', () => backend.getContacts(), 60000),
  getSavedPaybills: () => cached('paybills', () => backend.getSavedPaybills(), 60000),
  getDataBundles:   (p) => cached('bundles:' + p, () => backend.getDataBundles(p), 60000),
  getReceiveInfo:   () => cached('receive', () => backend.getReceiveInfo(), 300000),
  getPayTools:      () => cached('tools', () => backend.getPayTools(), 300000),
  verifyPin:        (pin) => backend.verifyPin(pin),
  createQuote:      (b) => backend.createQuote(b),
  createPayment:    (b, key) => backend.createPayment(b, key),
  getPayment:       (id) => backend.getPayment(id),
  invalidate:       (...keys) => (keys.length ? keys.forEach((k) => cache.delete(k)) : cache.clear()),
};
