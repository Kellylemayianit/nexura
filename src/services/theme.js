// Light / dark. Follows the device until the user picks; the choice is remembered. (index.html applies it before first paint.)
import { storage } from './storage.js';
const mq = window.matchMedia('(prefers-color-scheme: dark)');
const subs = new Set();
const current = () => storage.get('theme') || (mq.matches ? 'dark' : 'light');

function apply(animate) {
  const t = current(), root = document.documentElement;
  if (animate) { root.classList.add('theme-anim'); setTimeout(() => root.classList.remove('theme-anim'), 400); }
  root.dataset.theme = t;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', t === 'dark' ? '#0C0A1D' : '#FAFAFD');
  subs.forEach((f) => f(t));
}
export const theme = {
  init() { mq.addEventListener('change', () => { if (!storage.get('theme')) apply(true); }); apply(false); },
  current,
  set(t) { storage.set('theme', t); apply(true); },
  toggle() { theme.set(current() === 'dark' ? 'light' : 'dark'); },
  subscribe(f) { subs.add(f); return () => subs.delete(f); },
};
