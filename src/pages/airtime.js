import { el, toast } from '../utilities/helpers.js';
import { dataLoader } from '../services/dataLoader.js';

export async function AirtimePage() {
  const [providers, presets] = await Promise.all([
    dataLoader.getAirtimeProviders(), dataLoader.getAirtimePresets(),
  ]);
  let chosenProvider = providers[0].id;
  let amount = presets[1];

  const page = el('div', '', `<h1>Buy Airtime</h1><p class="lede">Top up any local number, paid straight from your stablecoin balance.</p>`);

  const provGrid = el('div', 'cat-grid');
  providers.forEach((p) => {
    const item = el('div', '', `<div class="cat-ic" style="background:${p.color}22;color:${p.color}">${p.name[0]}</div><span>${p.name}</span>`);
    item.style.cursor = 'pointer';
    item.onclick = () => { chosenProvider = p.id; [...provGrid.children].forEach(c => c.style.opacity = .55); item.style.opacity = 1; };
    if (p.id === chosenProvider) item.style.opacity = 1; else item.style.opacity = .55;
    provGrid.appendChild(item);
  });
  page.appendChild(provGrid);

  const phone = el('input');
  phone.placeholder = 'Recipient phone number';
  phone.style.cssText = 'width:100%;padding:13px 14px;border:1px solid var(--line);border-radius:14px;margin:14px 0;font-size:14px;background:#fff;color:var(--text)';
  page.appendChild(phone);

  page.appendChild(el('div', '', `<strong style="font-size:13px">Amount (cKES)</strong>`));
  const presetRow = el('div', 'action-row');
  presets.forEach((val) => {
    const pill = el('div', 'action-pill', `${val}`);
    pill.style.cursor = 'pointer';
    pill.onclick = () => { amount = val; [...presetRow.children].forEach(c => c.style.background = '#fff'); pill.style.background = 'var(--accent)'; };
    if (val === amount) pill.style.background = 'var(--accent)';
    presetRow.appendChild(pill);
  });
  page.appendChild(presetRow);

  const btn = el('button', 'btn btn-primary', 'Buy Airtime');
  btn.onclick = () => {
    if (!phone.value.trim()) { toast('Enter a phone number'); return; }
    toast(`${amount} cKES airtime sent to ${phone.value} — demo only`);
  };
  page.appendChild(btn);
  return page;
}
