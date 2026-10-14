// Guided tour: dims the screen, spotlights one control at a time and explains it. Steps live in config/guide.js.
import { el, esc } from '../utilities/helpers.js';
import { GUIDE_STEPS as STEPS } from '../config/guide.js';
import { storage } from '../services/storage.js';
import { navigate, getRoute } from '../router.js';

const TAB_ROUTES = ['send', 'lipa', 'airtime', 'more'];
const visible = (sel) => [...document.querySelectorAll(sel)].find((e) => e.getClientRects().length > 0);
let open = false;

function run() {
  if (open) return;
  open = true;
  const returnTo = document.activeElement;
  let i = 0;
  const root = el('div', 'guide', `
    <div class="g-spot"></div>
    <div class="g-card" role="dialog" aria-modal="true" aria-labelledby="g-title" aria-describedby="g-body">
      <div class="g-eyebrow"></div><h3 id="g-title"></h3><p id="g-body"></p>
      <div class="g-foot"><div class="g-dots"></div>
        <div class="g-btns"><button class="g-skip">Skip</button><button class="g-back">Back</button><button class="g-next">Next</button></div></div>
    </div>`);
  document.body.appendChild(root);
  const spot = root.querySelector('.g-spot'), card = root.querySelector('.g-card');
  const [eyebrow, title, body] = [card.querySelector('.g-eyebrow'), card.querySelector('h3'), card.querySelector('p')];
  const dots = card.querySelector('.g-dots'), back = card.querySelector('.g-back'), next = card.querySelector('.g-next');
  STEPS.forEach(() => dots.appendChild(document.createElement('i')));

  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
  function show() {
    const s = STEPS[i], target = s.target && visible(s.target);
    eyebrow.textContent = `Step ${i + 1} of ${STEPS.length}`;
    title.textContent = s.title; body.textContent = s.body;
    [...dots.children].forEach((d, j) => d.classList.toggle('on', j === i));
    back.hidden = i === 0; next.textContent = i === STEPS.length - 1 ? 'Done' : 'Next';
    target?.scrollIntoView({ block: 'nearest' });
    const W = window.innerWidth, H = window.innerHeight, cw = card.offsetWidth, ch = card.offsetHeight;
    let top, left;
    if (target) {
      const r = target.getBoundingClientRect(), pad = 6;
      Object.assign(spot.style, { top: `${r.top - pad}px`, left: `${r.left - pad}px`, width: `${r.width + pad * 2}px`, height: `${r.height + pad * 2}px` });
      if (W >= 860 && r.left < 300) { left = r.right + 20; top = r.top + r.height / 2 - ch / 2; }
      else if (r.top > H / 2) { top = r.top - ch - 18; left = r.left + r.width / 2 - cw / 2; }
      else { top = r.bottom + 18; left = r.left + r.width / 2 - cw / 2; }
    } else {
      Object.assign(spot.style, { top: `${H / 2}px`, left: `${W / 2}px`, width: '0px', height: '0px' });
      top = H / 2 - ch / 2; left = W / 2 - cw / 2;
    }
    card.style.top = `${clamp(top, 12, H - ch - 12)}px`; card.style.left = `${clamp(left, 12, W - cw - 12)}px`;
    next.focus({ preventScroll: true });
  }
  function finish() {
    storage.set('guide.seen', true);
    window.removeEventListener('resize', show); document.removeEventListener('keydown', onKey, true);
    root.remove(); open = false; returnTo?.focus?.({ preventScroll: true });
  }
  function onKey(e) {
    if (e.key === 'Escape') { e.preventDefault(); finish(); }
    else if (e.key === 'ArrowRight') next.click();
    else if (e.key === 'ArrowLeft' && i > 0) back.click();
    else if (e.key === 'Tab') {
      const btns = [...card.querySelectorAll('button:not([hidden])')], first = btns[0], last = btns[btns.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  }
  next.onclick = () => { if (i === STEPS.length - 1) finish(); else { i++; show(); } };
  back.onclick = () => { i--; show(); };
  card.querySelector('.g-skip').onclick = finish;
  window.addEventListener('resize', show); document.addEventListener('keydown', onKey, true);
  requestAnimationFrame(show);
}

export const guide = {
  seen: () => !!storage.get('guide.seen'),
  maybeStart() { if (!guide.seen() && TAB_ROUTES.includes(getRoute())) setTimeout(run, 500); },
  start() {
    if (getRoute() !== 'send') { navigate('send'); setTimeout(run, 700); } else run();
  },
};
