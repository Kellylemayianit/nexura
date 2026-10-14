// Mock backend: same method names and response shapes as api.js (see docs/API_CONTRACT.md).
// Payment status is derived from elapsed time, so the client polls exactly as it will against a real server.
import { env } from '../config/env.js';
import { STATUS_ORDER } from '../config/statuses.js';
import { ApiError } from './http.js';
import * as D from '../../data/demo.js';

const wait = (ms = env.MOCK_LATENCY_MS) => new Promise((r) => setTimeout(r, ms));
const uid = (p) => `${p}_${Math.random().toString(36).slice(2, 10)}`;
const STEP_MS = 900;
const quotes = new Map(), payments = new Map();
const assets = D.ASSETS.map((a) => ({ ...a }));

const publicPayment = (p) => ({
  id: p.id, reference: p.reference, kind: p.kind, createdAt: p.createdAt,
  status: STATUS_ORDER[Math.min(STATUS_ORDER.length - 1, Math.floor((Date.now() - p.createdAt) / STEP_MS))],
});

export const mock = {
  async getProfile() { await wait(80); return D.PROFILE; },
  async getAssets() { await wait(); return assets.map((a) => ({ ...a, rateIsDemo: true })); },
  async getContacts() { await wait(120); return D.CONTACTS; },
  async getSavedPaybills() { await wait(80); return D.SAVED_PAYBILLS; },
  async getDataBundles() { await wait(80); return D.DATA_BUNDLES.map((b) => ({ ...b, priceIsDemo: true })); },
  async getReceiveInfo() { await wait(60); return D.RECEIVE_INFO; },
  async getPayTools() { await wait(60); return D.PAY_TOOLS; },
  async verifyPin(pin) { await wait(150); return { ok: /^\d{4}$/.test(pin) }; },

  async createQuote({ kind, assetId, amountKes }) {
    await wait(200);
    const a = assets.find((x) => x.id === assetId);
    if (!a || !(amountKes > 0)) throw new ApiError('Invalid quote request', { status: 422, code: 'invalid_quote' });
    const routeKes = amountKes * D.ROUTE_FEE_PCT;
    const q = { id: uid('q'), kind, assetId, amountKes, rate: a.rateKes, rateIsDemo: true,
      fees: { routePct: D.ROUTE_FEE_PCT, routeKes, partnerKes: null }, youPay: (amountKes + routeKes) / a.rateKes, expiresAt: Date.now() + 60000 };
    quotes.set(q.id, q);
    return q;
  },

  async createPayment(body, idempotencyKey) {
    await wait(250);
    const dup = [...payments.values()].find((p) => p.key === idempotencyKey);
    if (dup) return publicPayment(dup);
    const q = quotes.get(body.quoteId);
    if (!q || q.expiresAt < Date.now()) throw new ApiError('Quote expired', { status: 409, code: 'quote_expired' });
    const a = assets.find((x) => x.id === q.assetId);
    if (a.balance < q.youPay) throw new ApiError('Insufficient balance', { status: 422, code: 'insufficient_funds' });
    a.balance -= q.youPay;
    const p = { id: uid('pay'), key: idempotencyKey, reference: 'NX-' + Math.random().toString(36).slice(2, 8).toUpperCase(), kind: body.kind, createdAt: Date.now() };
    payments.set(p.id, p);
    return publicPayment(p);
  },

  async getPayment(id) {
    await wait(60);
    const p = payments.get(id);
    if (!p) throw new ApiError('Payment not found', { status: 404, code: 'not_found' });
    return publicPayment(p);
  },
};
