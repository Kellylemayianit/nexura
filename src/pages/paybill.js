import { el, formatAmount } from '../utilities/helpers.js';
import { dataLoader } from '../services/dataLoader.js';
import { toast } from '../utilities/helpers.js';

export async function PayBillPage() {
  const [bill, cats, friends, history] = await Promise.all([
    dataLoader.getUnpaidBill(), dataLoader.getBillCategories(),
    dataLoader.getNearbyFriends(), dataLoader.getBillHistory(),
  ]);

  const page = el('div', '', `<h1>Bill Pay</h1>`);

  const reminder = el('div', 'reminder', `
    <div class="top"><span>Reminder</span><span>Today</span></div>
    <div class="inner">
      <div class="row1"><span>You have unpaid bill</span><span style="color:var(--header)">Edit</span></div>
      <div class="amt">${formatAmount(bill.amount, bill.currency)}</div>
      <button class="btn btn-primary" style="margin:0;background:var(--accent);color:var(--accent-ink)">Pay now</button>
    </div>
  `);
  reminder.querySelector('button').onclick = () => toast('Demo only — payment not wired up yet');
  page.appendChild(reminder);

  const cat = el('div', 'cat-grid');
  cats.forEach((c) => cat.appendChild(el('div', '', `<div class="cat-ic">${c.icon}</div><span>${c.label}</span>`)));
  page.appendChild(cat);

  page.appendChild(el('div', 'section-row', `<strong>Nearby Friends</strong><span class="view-all">View all</span>`));
  const friendsRow = el('div', 'friend-row');
  friendsRow.appendChild(el('div', 'friend', `<div class="av add">＋</div><span>Add New</span>`));
  friends.forEach((f) => friendsRow.appendChild(el('div', 'friend', `<div class="av" style="background:${f.color}"></div><span>${f.name.split(' ')[0]}</span>`)));
  page.appendChild(friendsRow);

  page.appendChild(el('div', 'section-row', `<strong style="margin-top:18px">This Month</strong>`));
  history.forEach((h) => {
    page.appendChild(el('div', 'tx-row', `
      <div class="ic" style="background:rgba(159,232,59,.3);color:var(--header)">${h.icon}</div>
      <div><div class="name">${h.label}</div><div class="sub">${h.ref} · ${h.date}</div></div>
      <div class="amt">-$${Math.abs(h.amount).toFixed(2)}</div>
    `));
  });
  return page;
}
