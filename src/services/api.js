// The ONLY file that is allowed to call a real backend.
// Everything else (pages, components) goes through dataLoader.js instead.
// Point BASE_URL at your Cloudflare Worker / API gateway when it exists.
const BASE_URL = '/api';

async function request(path, opts = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...opts,
  });
  if (!res.ok) throw new Error(`API ${path} failed: ${res.status}`);
  return res.json();
}

export const api = {
  getContacts: () => request('/contacts'),
  getAccount:  () => request('/account'),
  sendTransfer: (payload) => request('/transfers', { method:'POST', body: JSON.stringify(payload) }),
};
