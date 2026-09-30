import { el } from '../utilities/helpers.js';
import { dataLoader } from '../services/dataLoader.js';
import { sessionStore } from '../services/sessionStore.js';
import { ContactCard } from '../components/contactCard.js';
import { navigate } from '../router.js';

export async function ContactsPage() {
  const page = el('div', '', `<h1>Send money</h1><p class="lede">Pick anyone from your phone contacts — they don't need Nexura installed.</p>`);
  const contacts = await dataLoader.getContacts();
  const list = el('div');
  contacts.forEach((c) => {
    list.appendChild(ContactCard(c, (contact) => {
      sessionStore.setRecipient(contact);
      navigate('amount');
    }));
  });
  page.appendChild(list);
  return page;
}
