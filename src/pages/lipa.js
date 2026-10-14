import { el, esc, toast } from '../utilities/helpers.js';
import { dataLoader } from '../services/dataLoader.js';
import { sessionStore } from '../services/sessionStore.js';
import { market } from '../config/market.js';
import { PageHeader } from '../components/pageHeader.js';
import { SlimHero } from '../components/hero.js';
import { Segmented } from '../components/segmented.js';
import { QuoteBox } from '../components/quoteBox.js';
import { navigate } from '../router.js';

const FULL = { pochi: 'Pochi la Biashara', paybill: 'Paybill', till: 'Buy Goods Till' };

export async function LipaPage() {
  const [assets, saved] = await Promise.all([dataLoader.getAssets(), dataLoader.getSavedPaybills()]);
  let mode = market.lipaModes.find((m) => m.id === 'paybill');
  const page = el('div');
  page.appendChild(await PageHeader('Lipa na M-Pesa'));
  page.appendChild(SlimHero('Pay it your way', 'Bills, shops and businesses, paid from your stablecoins.'));
  const body = el('div');

  function form() {
    const inputs = {}, go = el('button', 'btn btn-primary', 'Review and sign with chip');
    go.disabled = true;
    const qb = QuoteBox(assets, { kind: 'lipa', onChange: (q) => { go.disabled = !(q && qb.isAffordable()); } });
    const colA = el('div'), colB = el('div');
    colA.appendChild(el('p', 'hint', esc(mode.hint)));
    const box = el('div', 'panel');
    [...mode.fields, { id: 'amount', label: 'Amount (KES)', ph: '0', type: 'text' }].forEach((f, i) => {
      const lab = el('label', i ? 'field gap' : 'field', esc(f.label)); lab.htmlFor = `lipa-${f.id}`;
      const inp = el('input', 'input'); inp.id = `lipa-${f.id}`; inp.type = f.type; inp.placeholder = f.ph;
      if (f.id === 'amount') { inp.inputMode = 'decimal'; inp.oninput = () => qb.setAmount(parseFloat(inp.value) || 0, { rail: 'mpesa' }); }
      inputs[f.id] = inp; box.append(lab, inp);
    });
    const pay = el('div', 'panel'); pay.append(el('span', 'field', 'Pay with'), qb);
    colA.append(box, pay);

    if (mode.id === 'paybill') {
      const list = el('div', 'panel', '<span class="field">Saved paybills</span>');
      saved.forEach((s) => {
        const kv = el('div', 'kv', `<div>${esc(s.label)}<span class="k">${esc(s.account)}</span></div>`);
        const use = el('button', 'link-btn', 'Use');
        use.onclick = () => { inputs.number.value = s.number; inputs.account.focus(); };
        kv.appendChild(use); list.appendChild(kv);
      });
      colB.appendChild(list);
    }
    go.onclick = () => {
      const q = qb.getQuote();
      if (!inputs.number.value.trim()) { toast(`Enter the ${mode.fields[0].label.toLowerCase()}`); return; }
      if (mode.id === 'paybill' && !inputs.account.value.trim()) { toast('Enter the account number'); return; }
      const ref = mode.id === 'paybill' ? `Account ${inputs.account.value.trim()}` : inputs.number.value.trim();
      sessionStore.begin({ kind: 'lipa', asset: qb.getAsset(), quote: q, payee: {
        name: `${FULL[mode.id]} ${inputs.number.value.trim()}`, phone: ref, network: 'M-Pesa', rail: 'mpesa', registered: false,
        kind: 'lipa', title: 'Payment sent', via: `M-Pesa ${FULL[mode.id]}` } });
      navigate('auth');
    };
    const actions = el('div', 'actions-row'); actions.appendChild(go);
    const two = el('div', 'two'); two.append(colA, colB, actions);
    return two;
  }

  const show = (id) => { mode = market.lipaModes.find((m) => m.id === id); body.replaceChildren(form()); };
  show(mode.id);
  const seg = Segmented(market.lipaModes.map((m) => ({ id: m.id, label: m.label })), mode.id, show);
  seg.classList.add('desktop-seg');
  page.append(seg, body);
  return page;
}
