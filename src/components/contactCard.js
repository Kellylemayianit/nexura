import { el, initials } from '../utilities/helpers.js';

export function ContactCard(contact, onSelect) {
  const row = el('div', 'contact', `
    <div class="avatar" style="background:${contact.color}">${initials(contact.name)}</div>
    <div class="meta"><div class="name">${contact.name}</div><div class="num">${contact.phone}</div></div>
  `);
  row.onclick = () => onSelect(contact);
  return row;
}
