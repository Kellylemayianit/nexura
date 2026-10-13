import { el, toast } from '../utilities/helpers.js';
import { dataLoader } from '../services/dataLoader.js';
import { sessionStore } from '../services/sessionStore.js';
import { Segmented } from '../components/segmented.js';
import { navigate } from '../router.js';

export async function LipaPage() {
  const modes = dataLoader.getLipaModes();
  const saved = await dataLoader.getSavedPaybills();
  let mode = modes.find((m) => m.id === 'paybill');
  const page = el('div', '', `<h1>Lipa na M-Pesa</h1>`);
  const body = el('div');

  function form() {
    const wrap = el('div');
    wrap.appendChild(el('p', 'hint', mode.hint));
    const box = el('div', 'panel');
    const inputs = {};
    [...mode.fields, { id: 'amount', label: 'Amount (KES)', ph: '0', type: 'number' }].forEach((f, i) => {
      const id = `lipa-${f.id}`;
      const lab = el('label', i ? 'field gap' : 'field', f.label); lab.htmlFor = id;
      const inp = el('input', 'input'); inp.id = id; inp.type = f.type; inp.placeholder = f.ph;
      if (f.type === 'number') inp.inputMode = 'decimal';
      inputs[f.id] = inp; box.append(lab, inp);
    });
    wrap.appendChild(box);
    wrap.appendChild(el('p', 'hint', 'Paid in KES from your USDC at [live rate]. Safaricom sends the M-Pesa confirmation SMS.'));

    if (mode.id === 'paybill') {
      const list = el('div', 'panel', `<span class="field">Saved paybills</span>`);
      saved.forEach((s) => {
        const row = el('div', 'kv', `<div>${s.label}<span class="k">${s.account}</span></div>`);
        const use = el('button', 'link-btn', 'Use');
        use.onclick = () => { inputs.number.value = s.number; inputs.account.focus(); };
        row.appendChild(use); list.appendChild(row);
      });
      wrap.appendChild(list);
    }

    const go = el('button', 'btn btn-primary', 'Review and sign');
    go.onclick = () => {
      const amt = parseFloat(inputs.amount.value);
      if (!inputs.number.value.trim() || !(amt > 0)) { toast('Enter the number and an amount'); return; }
      const ref = mode.id === 'paybill' ? `Account ${inputs.account.value.trim() || 'n/a'}` : inputs.number.value.trim();
      sessionStore.begin({
        name: `${mode.label} ${inputs.number.value.trim()}`, phone: ref, network: 'M-Pesa Kenya', rail: 'mpesa',
        payout: 'KES', entry: 'KES', registered: false, title: 'Payment sent', settlement: `M-Pesa ${mode.label}`,
      }, String(amt));
      navigate('auth');
    };
    wrap.appendChild(go);
    return wrap;
  }

  const show = (id) => { mode = modes.find((m) => m.id === id); body.replaceChildren(form()); };
  show(mode.id);
  page.append(Segmented(modes.map((m) => ({ id: m.id, label: m.label })), mode.id, show), body);
  return page;
}
