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
