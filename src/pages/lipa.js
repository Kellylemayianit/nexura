import { el, toast } from '../utilities/helpers.js';
import { dataLoader } from '../services/dataLoader.js';
import { sessionStore } from '../services/sessionStore.js';
import { PageHeader } from '../components/pageHeader.js';
import { Segmented } from '../components/segmented.js';
import { navigate } from '../router.js';

export async function LipaPage() {
  const modes = dataLoader.getLipaModes();
  const saved = await dataLoader.getSavedPaybills();
  let mode = modes.find((m) => m.id === 'paybill');
  const page = el('div');
  page.appendChild(await PageHeader('Lipa na M-Pesa'));
  const body = el('div');

  function form() {
    const colA = el('div'), colB = el('div'), inputs = {};
    colA.appendChild(el('p', 'hint', mode.hint));
    const box = el('div', 'panel');
    [...mode.fields, { id: 'amount', label: 'Amount (KES)', ph: '0', type: 'number' }].forEach((f, i) => {
      const lab = el('label', i ? 'field gap' : 'field', f.label); lab.htmlFor = `lipa-${f.id}`;
      const inp = el('input', 'input'); inp.id = `lipa-${f.id}`; inp.type = f.type; inp.placeholder = f.ph;
      if (f.type === 'number') inp.inputMode = 'decimal';
      inputs[f.id] = inp; box.append(lab, inp);
    });
    colA.append(box, el('p', 'hint', 'Paid in KES from your USDC at [live rate]. Safaricom sends the M-Pesa confirmation SMS.'));

    if (mode.id === 'paybill') {
      const list = el('div', 'panel', '<span class="field">Saved paybills</span>');
      saved.forEach((s) => {
        const kv = el('div', 'kv', `<div>${s.label}<span class="k">${s.account}</span></div>`);
        const use = el('button', 'link-btn', 'Use');
        use.onclick = () => { inputs.number.value = s.number; inputs.account.focus(); };
        kv.appendChild(use); list.appendChild(kv);
      });
      colB.appendChild(list);
    }

    const go = el('button', 'btn btn-primary', 'Review and sign with chip');
    go.onclick = () => {
      const a = parseFloat(inputs.amount.value);
      if (!inputs.number.value.trim() || !(a > 0)) { toast('Enter the number and an amount'); return; }
      const ref = mode.id === 'paybill' ? `Account ${inputs.account.value.trim() || 'n/a'}` : inputs.number.value.trim();
      sessionStore.begin({
        name: `${mode.label} ${inputs.number.value.trim()}`, phone: ref, network: 'M-Pesa Kenya', rail: 'mpesa',
        payout: 'KES', entry: 'KES', registered: false, title: 'Payment sent', settlement: `M-Pesa ${mode.label}`,
      }, String(a));
      navigate('auth');
    };
    const actions = el('div', 'actions-row'); actions.appendChild(go);
    const two = el('div', 'two'); two.append(colA, colB, actions);
    return two;
  }

  const show = (id) => { mode = modes.find((m) => m.id === id); body.replaceChildren(form()); };
  show(mode.id);
  const seg = Segmented(modes.map((m) => ({ id: m.id, label: m.label })), mode.id, show);
  seg.classList.add('desktop-seg');
  page.append(seg, body);
  return page;
}
