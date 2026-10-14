import { el, esc, fmt, toast } from '../utilities/helpers.js';
import { dataLoader } from '../services/dataLoader.js';
import { sessionStore } from '../services/sessionStore.js';
import { market } from '../config/market.js';
import { PageHeader } from '../components/pageHeader.js';
import { SlimHero } from '../components/hero.js';
import { Segmented, Chips } from '../components/segmented.js';
import { QuoteBox } from '../components/quoteBox.js';
import { navigate } from '../router.js';

export async function AirtimePage() {
  const [assets, profile] = await Promise.all([dataLoader.getAssets(), dataLoader.getProfile()]);
  const providers = market.airtimeProviders;
  let kind = 'airtime', provider = providers[0], amount = market.airtimePresets[2], bundle = null, mine = true;
  let bundles = await dataLoader.getDataBundles(provider.id);
  bundle = bundles[0];

  const page = el('div');
  page.appendChild(await PageHeader('Airtime & Data'));
  page.appendChild(SlimHero('Stay connected', 'Top up airtime or buy a data bundle in a few taps.'));
  const body = el('div');

  function form() {
    const go = el('button', 'btn btn-primary', ''); go.disabled = true;
    const qb = QuoteBox(assets, { kind: 'airtime', onChange: (q) => { go.disabled = !(q && qb.isAffordable()); } });
    const payee = () => ({ rail: 'airtime' });
    const colA = el('div'), colB = el('div');
    const phone = el('input', 'input'); phone.id = 'at-phone'; phone.type = 'tel'; phone.value = profile.phone;
    const lab = el('label', 'field gap', 'Phone number'); lab.htmlFor = 'at-phone';
    const top = el('div', 'panel');
    top.append(el('span', 'field', 'Network'),
      Chips(providers.map((p) => ({ id: p.id, label: p.name })), provider.id, async (id) => {
        provider = providers.find((p) => p.id === id);
        bundles = await dataLoader.getDataBundles(provider.id); bundle = bundles[0];
        if (kind === 'data') show('data');
      }),
      el('span', 'field gap', 'Top up for'),
      Chips([{ id: 'me', label: 'My number' }, { id: 'other', label: 'Another number' }], 'me', (id) => { mine = id === 'me'; phone.value = mine ? profile.phone : ''; if (!mine) phone.focus(); }),
      lab, phone);
    colA.appendChild(top);

    const setGo = (text, kes) => { go.textContent = text; qb.setAmount(kes, payee()); };
    const sel = el('div', 'panel');
    if (kind === 'airtime') {
      sel.appendChild(el('span', 'field', 'Amount (KES)'));
      sel.appendChild(Chips(market.airtimePresets.map((v) => ({ id: String(v), label: String(v) })), String(amount), (id) => { amount = Number(id); setGo(`Buy KES ${amount} airtime`, amount); }));
      setGo(`Buy KES ${amount} airtime`, amount);
    } else {
      sel.appendChild(el('span', 'field', 'Popular data bundles'));
      bundles.forEach((b) => {
        const r = el('button', `bundle${b.id === bundle.id ? ' on' : ''}`, `<span>${esc(b.label)}</span><b>KES ${fmt(b.priceKes, 0)}${b.priceIsDemo ? ' (demo)' : ''}</b>`);
        r.type = 'button';
        r.onclick = () => { bundle = b; sel.querySelectorAll('.bundle').forEach((x) => x.classList.remove('on')); r.classList.add('on'); setGo(`Buy ${b.label}`, b.priceKes); };
        sel.appendChild(r);
      });
      setGo(`Buy ${bundle.label}`, bundle.priceKes);
    }
    colB.append(sel);
    const pay = el('div', 'panel'); pay.append(el('span', 'field', 'Pay with'), qb);
    colB.appendChild(pay);

    go.onclick = () => {
      if (!phone.value.trim()) { toast('Enter a phone number'); return; }
      const air = kind === 'airtime';
      sessionStore.begin({ kind: 'airtime', asset: qb.getAsset(), quote: qb.getQuote(), payee: {
        name: `${provider.name} ${air ? 'airtime' : 'data'}`, phone: phone.value.trim(), network: provider.name, rail: 'airtime', registered: false,
        kind: 'airtime', title: air ? 'Airtime sent' : 'Data bundle sent', via: `${provider.name} ${air ? 'airtime' : bundle.label}` } });
      navigate('auth');
    };
    const actions = el('div', 'actions-row'); actions.appendChild(go);
    const two = el('div', 'two'); two.append(colA, colB, actions);
    return two;
  }

  const show = (id) => { kind = id; body.replaceChildren(form()); };
  show('airtime');
  const seg = Segmented([{ id: 'airtime', label: 'Airtime' }, { id: 'data', label: 'Data bundles' }], 'airtime', show);
  seg.classList.add('desktop-seg');
  page.append(seg, body);
  return page;
}
