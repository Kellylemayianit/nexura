const rt = (typeof window !== 'undefined' && window.NEXURA_ENV) || {};
const forceApi = new URLSearchParams(location.search).has('api');
export const env = {
  API_BASE: rt.API_BASE ?? '/api',
  USE_MOCK: forceApi ? false : (rt.USE_MOCK ?? true),
  MARKET: rt.MARKET ?? 'KE',
  REQUEST_TIMEOUT_MS: rt.REQUEST_TIMEOUT_MS ?? 12000,
  MOCK_LATENCY_MS: rt.MOCK_LATENCY_MS ?? 250,
};
