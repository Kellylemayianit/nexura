import { el, toast } from '../utilities/helpers.js';
import { dataLoader } from '../services/dataLoader.js';
import { sessionStore } from '../services/sessionStore.js';
import { PageHeader } from '../components/pageHeader.js';
import { Segmented, Chips } from '../components/segmented.js';
import { navigate } from '../router.js';

export async function AirtimePage() {
  const profile = await dataLoader.getProfile();
  const providers = dataLoader.getAirtimeProviders();
  const presets = dataLoader.getAirtimePresets();
  const bundles = dataLoader.getDataBundles();
  let kind = 'airtime', provider = providers[0], amount = presets[2], bundle = bundles[0], mine = true;

  const page = el('div');
  page.appendChild(await PageHeader('Airtime & Data'));
  const body = el('div');

  function form() {
    const colA = el('div'), colB = el('div');
    const phone = el('input', 'input'); phone.id = 'at-phone'; phone.type = 'tel'; phone.value = profile.phone;
    const lab = el('label', 'field gap', 'Phone number'); lab.htmlFor = 'at-phone';
    const top = el('div', 'panel');
    top.append(el('span', 'field', 'Network'),
      Chips(providers.map((p) => ({ id: p.id, label: p.name })), provider.id, (id) => { provider = providers.find((p) => p.id === id); }),
      el('span', 'field gap', 'Top up for'),
      Chips([{ id: 'me', label: 'My number' }, { id: 'other', label: 'Another number' }], 'me', (id) => {
        mine = id === 'me'; phone.value = mine ? profile.phone : ''; if (!mine) phone.focus();
      }), lab, phone);
    colA.appendChild(top);

    let go;
    if (kind === 'airtime') {
      const p = el('div', 'panel', '<span class="field">Amount (KES)</span>');
      p.appendChild(Chips(presets.map((v) => ({ id: String(v), label: String(v) })), String(amount), (id) => { amount = Number(id); go.textContent = `Buy KES ${amount} airtime`; }));
      colB.appendChild(p);
      go = el('button', 'btn btn-primary', `Buy KES ${amount} airtime`);
    } else {
      const p = el('div', 'panel', '<span class="field">Popular data bundles</span>');
      bundles.forEach((b) => {
        const r = el('button', `bundle${b.id === bundle.id ? ' on' : ''}`, `<span>${b.label}</span><b>${b.price}</b>`); r.type = 'button';
        r.onclick = () => { bundle = b; p.querySelectorAll('.bundle').forEach((x) => x.classList.remove('on')); r.classList.add('on'); go.textContent = `Buy ${b.label}`; };
        p.appendChild(r);
      });
      colB.appendChild(p);
      go = el('button', 'btn btn-primary', `Buy ${bundle.label}`);
    }
    go.onclick = () => {
      if (!phone.value.trim()) { toast('Enter a phone number'); return; }
      const isAir = kind === 'airtime';
      sessionStore.begin({
        name: `${provider.name} ${isAir ? 'airtime' : 'data'}`, phone: phone.value.trim(), network: provider.name, rail: 'airtime',
        payout: 'KES', entry: 'KES', registered: false, title: isAir ? 'Airtime sent' : 'Data bundle sent',
        settlement: `${provider.name} ${isAir ? 'airtime' : bundle.label}`,
      }, isAir ? String(amount) : '0.01'); // bundle prices are [price] in the demo, so a nominal amount stands in
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
