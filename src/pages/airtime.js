import { el, toast } from '../utilities/helpers.js';
import { dataLoader } from '../services/dataLoader.js';
import { sessionStore } from '../services/sessionStore.js';
import { Segmented, Chips } from '../components/segmented.js';
import { navigate } from '../router.js';

export async function AirtimePage() {
  const profile = await dataLoader.getProfile();
  const providers = dataLoader.getAirtimeProviders();
  const presets = dataLoader.getAirtimePresets();
  const bundles = dataLoader.getDataBundles();
  let kind = 'airtime', provider = providers[0], amount = presets[2], bundle = bundles[0], mine = true;

  const page = el('div', '', `<h1>Airtime & Data</h1><p class="lede">Top up any local number, paid straight from your stablecoin balance.</p>`);
  const body = el('div');

  function form() {
    const wrap = el('div');
    const top = el('div', 'panel');
    const phone = el('input', 'input'); phone.id = 'at-phone'; phone.type = 'tel'; phone.value = profile.phone;
    const lab = el('label', 'field gap', 'Phone number'); lab.htmlFor = 'at-phone';
    top.append(el('span', 'field', 'Network'),
      Chips(providers.map((p) => ({ id: p.id, label: p.name })), provider.id, (id) => { provider = providers.find((p) => p.id === id); }),
      el('span', 'field gap', 'Top up for'),
      Chips([{ id: 'me', label: 'My number' }, { id: 'other', label: 'Another number' }], mine ? 'me' : 'other', (id) => {
        mine = id === 'me'; phone.value = mine ? profile.phone : ''; if (!mine) phone.focus();
      }), lab, phone);
    wrap.appendChild(top);

    let go;
    if (kind === 'airtime') {
      const amt = el('div', 'panel', `<span class="field">Amount (KES)</span>`);
      amt.appendChild(Chips(presets.map((v) => ({ id: String(v), label: String(v) })), String(amount), (id) => {
        amount = Number(id); go.textContent = `Buy KES ${amount} airtime`;
      }));
      wrap.appendChild(amt);
      go = el('button', 'btn btn-primary', `Buy KES ${amount} airtime`);
    } else {
      const list = el('div', 'panel', `<span class="field">Data bundles</span>`);
      bundles.forEach((b) => {
        const row = el('button', `bundle${b.id === bundle.id ? ' on' : ''}`, `<span>${b.label}</span><b>${b.price}</b>`);
        row.type = 'button';
        row.onclick = () => { bundle = b; [...list.querySelectorAll('.bundle')].forEach((r) => r.classList.remove('on')); row.classList.add('on'); go.textContent = `Buy ${b.label}`; };
        list.appendChild(row);
      });
      wrap.appendChild(list);
      go = el('button', 'btn btn-primary', `Buy ${bundle.label}`);
    }
    go.onclick = () => {
      if (!phone.value.trim()) { toast('Enter a phone number'); return; }
      const isAirtime = kind === 'airtime';
      sessionStore.begin({
        name: `${provider.name} ${isAirtime ? 'airtime' : 'data'}`, phone: phone.value.trim(), network: provider.name, rail: 'airtime',
        payout: 'KES', entry: 'KES', registered: false, title: isAirtime ? 'Airtime sent' : 'Data bundle sent',
        settlement: `${provider.name} ${isAirtime ? 'airtime' : bundle.label}`,
      }, isAirtime ? String(amount) : '0.01'); // data price is [price] in the demo, so a nominal amount stands in
      navigate('auth');
    };
    wrap.appendChild(go);
    return wrap;
  }

  const show = (id) => { kind = id; body.replaceChildren(form()); };
  show('airtime');
  page.append(Segmented([{ id: 'airtime', label: 'Airtime' }, { id: 'data', label: 'Data bundles' }], 'airtime', show), body);
  return page;
}
