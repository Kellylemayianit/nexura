import { el } from '../utilities/helpers.js';
import { dataLoader } from '../services/dataLoader.js';
import { toast } from '../utilities/helpers.js';

const GROUP_A = [
  { icon:'👤', label:'Personal Details' },
  { icon:'🔒', label:'Security' },
  { icon:'🔗', label:'Linked Accounts' },
];
const GROUP_B = [
  { icon:'🆔', label:'Smart Login' },
  { icon:'🌙', label:'Dark Mode', toggle:true },
];
const GROUP_C = [
  { icon:'❓', label:'FAQs' },
  { icon:'🎧', label:'Help Center' },
];
const GROUP_D = [
  { icon:'🌐', label:'Language' },
  { icon:'🛡️', label:'Privacy' },
];

function group(items) {
  const box = el('div', 'profile-group');
  items.forEach((it) => {
    const row = el('div', 'profile-row', it.toggle
      ? `<span class="ic">${it.icon}</span><span>${it.label}</span><span class="switch"></span>`
      : `<span class="ic">${it.icon}</span><span>${it.label}</span><span class="arrow">›</span>`);
    if (it.toggle) row.querySelector('.switch').onclick = (e) => { e.currentTarget.classList.toggle('on'); };
    else row.onclick = () => toast(`${it.label} — demo only`);
    box.appendChild(row);
  });
  return box;
}

export async function ProfilePage() {
  const profile = await dataLoader.getProfile();
  const page = el('div', '', `<h1>Profile</h1>`);
  page.appendChild(el('div', 'profile-head', `
    <div class="av"></div>
    <div><div class="name">${profile.name}</div><div class="phone">${profile.phone}</div></div>
  `));
  page.append(group(GROUP_A), group(GROUP_B), group(GROUP_C), group(GROUP_D));
  return page;
}
