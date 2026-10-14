// Single fetch wrapper for the real backend: base URL, bearer token, timeout, idempotency keys, normalised errors.
import { env } from '../config/env.js';
import { storage } from './storage.js';

export class ApiError extends Error {
  constructor(message, { status = 0, code = 'error', details = null } = {}) { super(message); this.name = 'ApiError'; this.status = status; this.code = code; this.details = details; }
}
export const tokenStore = { get: () => storage.get('token'), set: (t) => storage.set('token', t), clear: () => storage.remove('token') };

export async function http(path, { method = 'GET', body, idempotencyKey, timeout = env.REQUEST_TIMEOUT_MS } = {}) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeout);
  const token = tokenStore.get();
  try {
    const res = await fetch(env.API_BASE + path, {
      method, signal: ctrl.signal,
      headers: {
        Accept: 'application/json', 'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    const data = await res.json().catch(() => null);
    if (res.status === 401) window.dispatchEvent(new Event('nexura:unauthorized'));
    if (!res.ok) throw new ApiError(data?.message || `Request failed (${res.status})`, { status: res.status, code: data?.code, details: data?.details });
    return data;
  } catch (e) {
    if (e instanceof ApiError) throw e;
    throw new ApiError(e.name === 'AbortError' ? 'The request timed out' : 'Network error', { code: e.name === 'AbortError' ? 'timeout' : 'network' });
  } finally { clearTimeout(timer); }
}
