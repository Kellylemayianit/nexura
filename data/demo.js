// Mock dataset (Kenya). Only src/services/mock.js reads this file.
// Rates and bundle prices are DEMO values, flagged as such in the UI, until a partner supplies real ones.
export const PROFILE = { name: 'Wanjiku Mwangi', phone: '+254 712 334 210' };
export const ROUTE_FEE_PCT = 0.002;

export const ASSETS = [
  { id: 'usdc', symbol: 'USDC', name: 'USD Coin',             balance: 1240.00, decimals: 2, rateKes: 129.0, color: '#2775CA' },
  { id: 'usdt', symbol: 'USDT', name: 'Tether',               balance: 310.50,  decimals: 2, rateKes: 128.9, color: '#26A17B' },
  { id: 'kesm', symbol: 'KESm', name: 'Mento Kenyan Shilling', balance: 8500.00, decimals: 2, rateKes: 1.0,   color: '#FF7A1A' },
];

export const CONTACTS = [
  { id: 'c1', name: 'Brian Otieno',  phone: '+254 722 000 101', rail: 'mpesa',  network: 'M-Pesa',       registered: true,  color: '#C9BFFF' },
  { id: 'c2', name: 'Grace Wanjiru', phone: '+254 733 000 202', rail: 'mpesa',  network: 'M-Pesa',       registered: false, color: '#FFC9A0' },
  { id: 'c3', name: 'Kevin Mutua',   phone: '+254 700 000 303', rail: 'airtel', network: 'Airtel Money', registered: false, color: '#B5E3D0' },
  { id: 'c4', name: 'Faith Achieng', phone: '+254 110 000 404', rail: 'airtel', network: 'Airtel Money', registered: true,  color: '#F6C1D4' },
];

export const SAVED_PAYBILLS = [
  { label: 'Electricity', number: '123456', account: 'Meter number' },
  { label: 'Water',       number: '234567', account: 'Customer number' },
  { label: 'Rent',        number: '345678', account: 'Unit number' },
];
export const DATA_BUNDLES = [
  { id: 'd1', label: '1 GB, 24 hours', priceKes: 50 },
  { id: 'd2', label: '5 GB, 7 days',   priceKes: 250 },
  { id: 'd3', label: '20 GB, 30 days', priceKes: 1000 },
];
export const RECEIVE_INFO = [
  { k: 'Your Nexura ID', v: 'wanjiku@nexura', copy: true },
  { k: 'Payment link', v: 'nexura.app/wanjiku', copy: true },
  { k: 'Deposit from M-Pesa', v: 'Paybill and account set by your partner', copy: false },
];
export const PAY_TOOLS = [
  { id: 'link', label: 'Payment link', sub: 'nexura.app/wanjiku', action: 'Copy link' },
  { id: 'request', label: 'Request money', sub: 'Send a request by SMS or WhatsApp', action: 'Create request' },
  { id: 'invoice', label: 'Invoice', sub: 'Itemised, with a pay link', action: 'New invoice' },
  { id: 'offline', label: 'Offline pay', sub: 'Tap a nearby phone by Bluetooth', action: 'Start' },
];
