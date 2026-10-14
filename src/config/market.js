// Everything country-specific lives here. Kenya first; to add a market, add an entry and set MARKET.
import { env } from './env.js';

export const MARKETS = {
  KE: {
    id: 'KE', name: 'Kenya', currency: 'KES', dial: '+254',
    payoutNetworks: [{ id: 'mpesa', label: 'M-Pesa' }, { id: 'airtel', label: 'Airtel Money' }],
    airtimeProviders: [{ id: 'safaricom', name: 'Safaricom' }, { id: 'airtel', name: 'Airtel' }, { id: 'telkom', name: 'Telkom' }],
    airtimePresets: [20, 50, 100, 250, 500],
    sendPresets: [500, 1000, 2500, 5000],
    lipaModes: [
      { id: 'pochi', label: 'Pochi', hint: 'Pochi la Biashara: pay a business using its phone number.',
        fields: [{ id: 'number', label: 'Business phone number', ph: '0712 345 678', type: 'tel' }] },
      { id: 'paybill', label: 'Paybill', hint: 'Paybill: pay a business with its business number and an account number.',
        fields: [{ id: 'number', label: 'Business number', ph: 'e.g. 123456', type: 'tel' }, { id: 'account', label: 'Account number', ph: 'Meter, invoice or customer number', type: 'text' }] },
      { id: 'till', label: 'Till', hint: 'Buy Goods Till: pay a shop or merchant with its till number.',
        fields: [{ id: 'number', label: 'Till number', ph: 'e.g. 654321', type: 'tel' }] },
    ],
  },
};
export const market = MARKETS[env.MARKET] || MARKETS.KE;

// Kenyan mobile numbers: 07xx / 01xx / 2547xx / +2547xx  ->  +254XXXXXXXXX (or null)
export function normalizePhone(input) {
  let d = String(input || '').replace(/\D/g, '');
  if (d.startsWith('254')) d = d.slice(3); else if (d.startsWith('0')) d = d.slice(1);
  return /^[71]\d{8}$/.test(d) ? `+254${d}` : null;
}
export const formatPhone = (e164) => e164.replace(/^(\+254)(\d{3})(\d{3})(\d{3})$/, '$1 $2 $3 $4');
