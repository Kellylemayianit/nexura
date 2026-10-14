import { el, esc, fmt, initials, toast, copyText } from '../utilities/helpers.js';
import { dataLoader } from '../services/dataLoader.js';
import { sessionStore } from '../services/sessionStore.js';
import { market, normalizePhone, formatPhone } from '../config/market.js';
import { PageHeader } from '../components/pageHeader.js';
import { Segmented, Chips } from '../components/segmented.js';
import { Stepper } from '../components/stepper.js';
import { AssetPicker } from '../components/assetPicker.js';
import { QuoteBox } from '../components/quoteBox.js';
import { splitWords, countUp, bump, stagger } from '../utilities/motion.js';
import { navigate } from '../router.js';

const STEPS = ['Who', 'Asset', 'Amount', 'Review'];

export async function SendPage() {
  const [assets, contacts, receive, profile] = await Promise.all([dataLoader.getAssets(), dataLoader.getContacts(), dataLoader.getReceiveInfo(), dataLoader.getProfile()]);
  const draft = { payee: null, assetId: assets[0].id, amountKes: 0, quote: null };
  let step = 0, dir = 'fwd', ticker = null;
  const asset = () => assets.find((a) => a.id === draft.assetId);

  const page = el('div', 'send-page');
  page.dataset.step = '0';
  page.appendChild(await PageHeader('Send / Receive', `Hi ${profile.name.split(' ')[0]}, who are we paying today?`));

  // ----- hero -----
  const total = assets.reduce((s, a) => s + a.balance * a.rateKes, 0);
  const hero = el('section', 'hero', `
    <div><p class="eyebrow">${esc(market.name)}</p><h2 class="hero-line">Pay anyone on M-Pesa or Airtel Money, straight from your stablecoins.</h2></div>
    <div class="hero-stat"><span class="k">Total balance</span><b class="num" data-total>KES 0</b><span class="m">${assets.length} assets${assets[0].rateIsDemo ? ' · demo rates' : ''}</span>
      <div class="hero-assets">${assets.map((a) => `<span>${esc(a.symbol)} ${fmt(a.balance, 0)}</span>`).join('')}</div></div>`);
  splitWords(hero.querySelector('.hero-line'));
  countUp(hero.querySelector('[data-total]'), total, { prefix: 'KES ', decimals: 0 });
  page.appendChild(hero);

  // ----- shared pieces -----
  const qb = QuoteBox(assets, { kind: 'send', picker: false, onChange: (q) => {
    draft.quote = q; renderSummary(); validate();
    if (q && step === 3) render(false); // fresh quote while reviewing: refresh the rows
  } });
  const summary = el('section', 'summary');
  function renderSummary() {
    const a = asset(), q = draft.quote, p = draft.payee;
    const rows = [['To', p ? esc(p.name) : '—'], ['Pay out via', p ? esc(p.network) : '—'], ['Asset', esc(a.symbol)], ['They receive', draft.amountKes > 0 ? `KES ${fmt(draft.amountKes)}` : '—']];
    summary.innerHTML = '<h2>Payment summary</h2>' + rows.map(([k, v]) => `<div class="sum-row"><span class="k">${k}</span><span class="v">${v}</span></div>`).join('')
      + `<div class="sum-row total"><span class="k">You pay</span><span class="v">${q ? `${fmt(q.youPay, a.decimals)} ${esc(a.symbol)}` : '—'}</span></div>`;
    if (q) bump(summary.querySelector('.total .v'));
  }

  // ----- steps -----
  const heading = (title, sub) => { const w = el('div'); const h = el('h3', 'step-title', esc(title)); h.tabIndex = -1; w.append(h, el('p', 'step-sub', esc(sub))); return w; };

  function stepWho() {
    const w = heading('Who are you paying?', 'Pick someone you have paid before, or type a Kenyan number.');
    const input = el('input', 'input'); input.id = 'who'; input.placeholder = 'Search a name or enter 07xx / 01xx'; input.autocomplete = 'off';
    const lab = el('label', 'sr', 'Search a name or enter a number'); lab.htmlFor = 'who';
    const list = el('div', 'contact-list'); list.setAttribute('role', 'radiogroup'); list.setAttribute('aria-label', 'Recipients');
    const group = 'who-' + Math.random().toString(36).slice(2, 6);

    const pickRow = (c) => {
      const row = el('label', 'pick', `<input type="radio" class="sr" name="${group}" ${draft.payee?.id === c.id ? 'checked' : ''}>
        <span class="avatar" style="background:${esc(c.color)}">${esc(initials(c.name))}</span>
        <span class="meta"><div class="name">${esc(c.name)}</div><div class="sub">${esc(c.phone)}</div></span><span class="net-pill">${esc(c.network)}</span>`);
      row.querySelector('input').onchange = () => { draft.payee = { ...c }; renderSummary(); validate(); };
      return row;
    };
    const newNumber = (phone) => {
      const c = { id: 'new:' + phone, name: formatPhone(phone), phone: formatPhone(phone), rail: 'mpesa', network: 'M-Pesa', registered: false, color: '#E6E3F7' };
      const row = pickRow(c), wrap = el('div');
      const chips = Chips(market.payoutNetworks.map((n) => ({ id: n.id, label: n.label })), c.rail, (id) => {
        const n = market.payoutNetworks.find((x) => x.id === id);
        c.rail = id; c.network = n.label; row.querySelector('.net-pill').textContent = n.label;
        if (draft.payee?.id === c.id) { draft.payee = { ...c }; renderSummary(); }
      });
      chips.classList.add('new-net'); wrap.append(row, chips);
      row.querySelector('input').checked = true; draft.payee = { ...c };
      return wrap;
    };
    const paint = (animate) => {
      const q = input.value.trim().toLowerCase(), phone = normalizePhone(input.value);
      list.replaceChildren();
      if (phone && !contacts.some((c) => normalizePhone(c.phone) === phone)) list.appendChild(newNumber(phone));
      contacts.filter((c) => !q || c.name.toLowerCase().includes(q) || c.phone.replace(/\s/g, '').includes(q.replace(/\s/g, ''))).forEach((c) => list.appendChild(pickRow(c)));
      if (!list.children.length) list.appendChild(el('p', 'hint', 'No match yet. Enter a full Kenyan number to pay someone new.'));
      if (animate) stagger(list, 45);
      renderSummary(); validate();
    };
    input.oninput = () => paint(false);
    paint(true);
    w.append(lab, input, list);
    return w;
  }

  function stepAsset() {
    const w = heading('Pay with which asset?', 'Pick the stablecoin you want to spend. We convert it to KES for you.');
    w.appendChild(AssetPicker(assets, draft.assetId, (id) => { draft.assetId = id; qb.setAsset(id); renderSummary(); validate(); }));
    return w;
  }

  function stepAmount() {
    const a = asset();
    const w = heading('How much should they receive?', `Paying with ${a.symbol}. Balance ${fmt(a.balance, a.decimals)} ${a.symbol}.`);
    const wrap = el('div', 'amount-wrap'), inp = el('input', 'input amount-input');
    inp.id = 'amt'; inp.inputMode = 'decimal'; inp.placeholder = '0'; inp.value = draft.amountKes || '';
    const lab = el('label', 'sr', 'Amount in KES'); lab.htmlFor = 'amt';
    const handle = () => { draft.amountKes = parseFloat(inp.value) || 0; qb.setAmount(draft.amountKes, draft.payee); renderSummary(); validate(); };
    inp.oninput = () => { chips.querySelectorAll('.chip').forEach((c) => c.classList.remove('on')); handle(); };
    const chips = Chips(market.sendPresets.map((v) => ({ id: String(v), label: fmt(v, 0) })), '', (id) => { inp.value = id; handle(); });
    chips.style.marginTop = '12px';
    chips.querySelectorAll('.chip').forEach((c, i) => { c.disabled = market.sendPresets[i] > a.balance * a.rateKes * 0.99; });
    wrap.append(inp); w.append(lab, wrap, chips, qb);
    return w;
  }

  function stepReview() {
    const q = draft.quote, a = asset(), p = draft.payee;
    const w = heading('Check and sign', 'Your phone chip signs this payment next.');
    if (!q) { w.appendChild(el('div', 'quote-line', '<span class="skel skel-line"></span>')); return w; }
    const row = (k, v, go) => `<div class="sum-row"><span class="k">${k}</span><span class="v">${v}${go != null ? `<button class="link-btn edit" data-go="${go}">Edit</button>` : ''}</span></div>`;
    const rev = el('div', 'review', [
      row('To', `${esc(p.name)}<br><span class="mut">${esc(p.phone)}</span>`, 0), row('Pay out via', esc(p.network)),
      row('Asset', esc(a.symbol), 1), row('They receive', `KES ${fmt(q.amountKes)}`, 2),
      row('Rate', `1 ${esc(a.symbol)} = KES ${fmt(q.rate)}${q.rateIsDemo ? ' (demo)' : ''}`),
      row('Route fee', `KES ${fmt(q.fees.routeKes)} (${(q.fees.routePct * 100).toFixed(2)}%)`),
      row('Partner fee', q.fees.partnerKes == null ? 'Set by your partner' : `KES ${fmt(q.fees.partnerKes)}`),
      `<div class="sum-row total"><span class="k">You pay</span><span class="v">${fmt(q.youPay, a.decimals)} ${esc(a.symbol)}</span></div>`,
      `<div class="sum-row"><span class="k">Rate locked for</span><span class="v num" data-timer>1:00</span></div>`,
    ].join(''));
    rev.querySelectorAll('[data-go]').forEach((b) => { b.onclick = () => go(Number(b.dataset.go)); });
    const timer = rev.querySelector('[data-timer]');
    const tick = () => {
      const s = Math.max(0, Math.round((q.expiresAt - Date.now()) / 1000));
      timer.textContent = `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
      if (s === 0) { clearInterval(ticker); toast('Rate expired. Refreshing…'); qb.setAmount(draft.amountKes, draft.payee); }
    };
    tick(); ticker = setInterval(tick, 1000);
    w.appendChild(rev);
    return w;
  }

  // ----- wizard shell -----
  const stepper = Stepper(STEPS), body = el('div', 'step-body');
  const back = el('button', 'btn btn-ghost', 'Back'), next = el('button', 'btn btn-primary', 'Continue');
  back.type = next.type = 'button';
  const nav = el('div', 'wizard-nav'); nav.append(back, next);
  const wizard = el('section', 'wizard pane-send'); wizard.append(stepper, body, nav);

  function validate() {
    const ok = [!!draft.payee, !!draft.assetId, draft.amountKes >= 10 && !!draft.quote && qb.isAffordable(),
      !!draft.quote && draft.quote.expiresAt > Date.now() && qb.isAffordable()][step];
    next.disabled = !ok;
  }
  function render(focus = true) {
    clearInterval(ticker);
    const view = [stepWho, stepAsset, stepAmount, stepReview][step]();
    view.classList.add(dir === 'fwd' ? 'step-fwd' : 'step-back');
    body.replaceChildren(view);
    stepper.set(step); nav.classList.toggle('first', step === 0);
    next.textContent = step === 3 ? 'Sign with chip' : 'Continue';
    renderSummary(); validate();
    if (focus) view.querySelector('.step-title')?.focus({ preventScroll: true });
  }
  function go(n) {
    dir = n > step ? 'fwd' : 'back'; step = n; page.dataset.step = String(n); render();
    if (matchMedia('(max-width:859px)').matches) window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  back.onclick = () => go(step - 1);
  next.onclick = () => {
    if (step < 3) return go(step + 1);
    if (!draft.quote || draft.quote.expiresAt <= Date.now()) { toast('Rate expired. Refreshing…'); qb.setAmount(draft.amountKes, draft.payee); return; }
    sessionStore.begin({ kind: 'send', payee: { ...draft.payee, kind: 'send' }, asset: asset(), quote: draft.quote });
    clearInterval(ticker);
    navigate('auth');
  };
  const stop = () => clearInterval(ticker);
  window.addEventListener('hashchange', stop, { once: true });
  render(false);

  // ----- receive -----
  const rec = el('section', 'pane-receive panel');
  rec.append(el('h2', 'step-title', 'Receive money'), el('p', 'hint', 'Share these details. Deposits from M-Pesa arrive in your wallet.'));
  receive.forEach((r) => {
    const kv = el('div', 'kv', `<div><span class="k">${esc(r.k)}</span>${esc(r.v)}</div>`);
    if (r.copy) { const b = el('button', 'link-btn', 'Copy'); b.onclick = () => copyText(r.v); kv.appendChild(b); }
    rec.appendChild(kv);
  });
  const qrRow = el('div', 'kv', '<div><span class="k">Payment QR</span>Let anyone scan to pay you</div>');
  const open = el('button', 'link-btn', 'Open'); open.onclick = () => navigate('more'); qrRow.appendChild(open); rec.appendChild(qrRow);

  const side = el('div', 'pane-side'); side.append(summary, rec);
  const two = el('div', 'two split'); two.dataset.mode = 'send'; two.append(wizard, side);
  const seg = Segmented([{ id: 'send', label: 'Send' }, { id: 'receive', label: 'Receive' }], 'send', (m) => { two.dataset.mode = m; });
  seg.classList.add('mobile-only');
  page.append(seg, two);
  return page;
}
