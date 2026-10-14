# Nexura — Frontend Demo

Vanilla JS SPA, no build step. Demo data lives in `data/demo.js`; swap
`services/api.js` in for `services/dataLoader.js`'s bodies when a real
backend exists — nothing in `pages/` or `components/` has to change.

## Run locally
Any static server works (ES modules need http://, not file://):
```
npx serve .
# or
python3 -m http.server 8080
```

## Deploy — GitHub + Cloudflare Pages
1. Push this folder as a repo to GitHub.
2. Cloudflare dashboard → Workers & Pages → Create → Pages → Connect to Git → pick the repo.
3. Build settings: **Framework preset:** None · **Build command:** (leave blank) · **Output directory:** `/`
4. Deploy. Every push to the connected branch redeploys automatically.

## Structure
- `index.html` — SPA shell, loads all stylesheets + `src/app.js` as a module
- `src/app.js` — kernel: route table + render loop
- `src/router.js` — hash parsing + change subscription
- `src/pages/*` — one file per route, composes components + calls `dataLoader`
- `src/components/*` — pure render functions
- `src/services/api.js` — the only file that would talk to a real backend
- `src/services/dataLoader.js` — the only data import surface pages use (adds caching)
- `src/services/sessionStore.js` — in-progress transfer state + subscribers
- `src/utilities/*` — DOM helpers, mock auth, icons

Note: the booking/WhatsApp-link, map/compare workspace, and admin
dashboard folders from the original template were left out — they
belong to a different (marketplace/booking) app and don't apply here.


## Run
`python3 -m http.server` then open http://localhost:8000 (no build step).

## Layout
- `config/runtime.js`: per-environment switches (`USE_MOCK`, `API_BASE`, `MARKET`).
- `src/config/`: `market.js` (Kenya, add countries here), `statuses.js`, `guide.js` (tour steps).
- `src/services/`: `api.js` (real backend), `mock.js` (same shapes), `dataLoader.js` (the only thing pages import), `payments.js` (quote, sign, create, watch), `signer.js`, `theme.js`, `http.js`.
- `src/components/`: reusable UI (asset picker, quote box, stepper, guide, header, nav, skeleton).
- `src/pages/`: one file per screen. `docs/API_CONTRACT.md` lists every endpoint and payload.

## Product (Kenya first)
- **Send / Receive**: four-step flow (who, asset, amount, review) with a live summary, then PIN, signing, status and receipt.
- **Lipa na M-Pesa**: Pochi la Biashara, Paybill, Buy Goods Till. **Airtime & Data**: Safaricom, Airtel, Telkom. **More**: QR, link, request, invoice, offline pay.
- Light and dark themes (follows the device until you choose), a boot loader, a guided tour (Profile > Take the tour), and reduced-motion support.
- Rates and bundle prices are flagged demo values until a partner supplies real ones.
