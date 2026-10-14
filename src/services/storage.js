// Safe localStorage wrapper (private mode / blocked storage must never break the app).
const P = 'nexura.';
export const storage = {
  get: (k, fallback = null) => { try { const v = localStorage.getItem(P + k); return v == null ? fallback : JSON.parse(v); } catch { return fallback; } },
  set: (k, v) => { try { localStorage.setItem(P + k, JSON.stringify(v)); } catch {} },
  remove: (k) => { try { localStorage.removeItem(P + k); } catch {} },
};
