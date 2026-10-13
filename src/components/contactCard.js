import { el, initials } from '../utilities/helpers.js';

export function ContactCard(contact, onSelect) {
  const row = el('button', 'contact', `
    <div class="avatar" style="background:${contact.color}">${initials(contact.name)}</div>
    <div class="meta"><div class="name">${contact.name}</div><div class="num">${contact.phone}<span class="net">${contact.network || ''}</span></div></div>
  `);
  row.type = 'button';
  row.style.cssText = 'width:100%;border:0;background:none;text-align:left;font-family:inherit;color:inherit';
  row.onclick = () => onSelect(contact);
  return row;
}
