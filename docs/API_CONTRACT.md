# Nexura API contract (Kenya)

The front end calls these through `src/services/api.js`. `src/services/mock.js` implements the same methods and shapes,
so connecting a backend means: set `USE_MOCK: false` and `API_BASE` in `config/runtime.js` (or open the app with `?api`).

## Conventions
- JSON everywhere. Auth: `Authorization: Bearer <token>` (stored via `tokenStore` in `services/http.js`).
- Money in responses is a number in the unit named by its key (`...Kes`, or asset units). Use a decimal library server-side.
- Errors: HTTP 4xx/5xx with `{ "code": "insufficient_funds", "message": "Human readable", "details": {} }`. A `401` fires a `nexura:unauthorized` event.
- `POST /payments` requires an `Idempotency-Key` header. Retrying with the same key must return the same payment.
- Enable CORS for the app origin and allow the `Authorization` and `Idempotency-Key` headers.

## Endpoints
| Method | Path | Returns |
|---|---|---|
| GET | `/me` | `{ name, phone }` |
| GET | `/wallet/assets` | `[{ id, symbol, name, balance, decimals, rateKes, rateIsDemo?, color }]` |
| GET | `/contacts` | `[{ id, name, phone, rail: "mpesa"\|"airtel", network, registered, color }]` |
| GET | `/lipa/saved` | `[{ label, number, account }]` |
| GET | `/airtime/bundles?provider=safaricom` | `[{ id, label, priceKes, priceIsDemo? }]` |
| GET | `/receive` | `[{ k, v, copy }]` deposit and share details |
| GET | `/pay-tools` | `[{ id, label, sub, action }]` |
| POST | `/auth/pin` | body `{ pin }` -> `{ ok: boolean }` |
| POST | `/quotes` | body `{ kind: "send"\|"lipa"\|"airtime", assetId, amountKes, payee }` -> quote |
| POST | `/payments` | body `{ quoteId, kind, payee: { name, ref, rail }, signature }` + `Idempotency-Key` -> payment |
| GET | `/payments/:id` | payment |

### Quote
`{ id, kind, assetId, amountKes, rate, rateIsDemo?, fees: { routePct, routeKes, partnerKes|null }, youPay, expiresAt }`
`expiresAt` is epoch milliseconds. `youPay` is in units of the chosen asset. The UI refuses to submit an expired or unaffordable quote.

### Payment
`{ id, reference, kind, createdAt, status }` where `status` is one of
`created -> signed -> partner_received -> converting -> paid_out -> completed` (or `failed`).
The processing screen polls `GET /payments/:id` every 700 ms (`services/payments.js`). Replace with SSE or a WebSocket later; the callback contract is unchanged.

## Signing
`services/signer.js` is the only place a signature is produced. Today it returns a mock; the real build calls the phone's secure hardware
and the backend verifies `signature` against the user's registered public key before accepting the payment.

## Adding a country
Add an entry to `src/config/market.js` (currency, dial code, networks, airtime providers, Lipa-style modes) and set `MARKET` in `config/runtime.js`.
