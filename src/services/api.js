// The ONLY file that talks to the real backend. Shapes are documented in docs/API_CONTRACT.md;
// src/services/mock.js implements the same methods, so switching is a one-line env change.
import { http } from './http.js';

export const api = {
  getProfile:       () => http('/me'),
  getAssets:        () => http('/wallet/assets'),
  getContacts:      () => http('/contacts'),
  getSavedPaybills: () => http('/lipa/saved'),
  getDataBundles:   (provider) => http(`/airtime/bundles?provider=${encodeURIComponent(provider)}`),
  getReceiveInfo:   () => http('/receive'),
  getPayTools:      () => http('/pay-tools'),
  verifyPin:        (pin) => http('/auth/pin', { method: 'POST', body: { pin } }),
  createQuote:      (body) => http('/quotes', { method: 'POST', body }),
  createPayment:    (body, idempotencyKey) => http('/payments', { method: 'POST', body, idempotencyKey }),
  getPayment:       (id) => http(`/payments/${encodeURIComponent(id)}`),
};
