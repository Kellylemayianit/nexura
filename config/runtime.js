// Loaded before the app. Change these per environment (dev / staging / prod) without touching source.
// Open the app with ?api to force the real backend even while USE_MOCK is true.
window.NEXURA_ENV = {
  API_BASE: '/api',          // your Worker / API gateway
  USE_MOCK: true,            // true = built-in mock backend (src/services/mock.js). false = real API
  MARKET: 'KE',              // Kenya first. New markets are added in src/config/market.js
  REQUEST_TIMEOUT_MS: 12000,
  MOCK_LATENCY_MS: 250,
};
