// Static demo dataset. Swap this for real API responses via services/api.js
// without touching any page or component: they only ever import dataLoader.js.
// Anything in [brackets] is a placeholder until a partner supplies the real value.
export const CONTACTS = [
  { id:'c1', name:'Amara Nwosu',  phone:'+234 802 114 5567', network:'MTN Nigeria',  rail:'mtn',   payout:'NGN', color:'#C9BFFF', registered:true },
  { id:'c2', name:'Chidi Okeke',  phone:'+234 706 220 9981', network:'MTN Nigeria',  rail:'mtn',   payout:'NGN', color:'#FFC9A0', registered:false },
  { id:'c3', name:'Brian Otieno', phone:'+254 712 334 210',  network:'M-Pesa Kenya', rail:'mpesa', payout:'KES', color:'#B5E3D0', registered:true },
  { id:'c4', name:'Tunde Bakare', phone:'+234 815 990 4423', network:'MTN Nigeria',  rail:'mtn',   payout:'NGN', color:'#F6C1D4', registered:false },
];

export const PAYOUT_NETWORKS = [
  { id:'mtn',   label:'MTN Nigeria',  payout:'NGN' },
  { id:'mpesa', label:'M-Pesa Kenya', payout:'KES' },
  { id:'airtel', label:'Airtel Money', payout:'KES' },
];

export const ACCOUNT = { balance: 1240.00, currency: 'USDC', offline: { left: 50, limit: 80 } };
export const ROUTE_FEE_PCT = 0.002; // 0.20% router fee, placeholder until partner fees are known
export const PROFILE = { name:'Wanjiku Mwangi', phone:'+254 712 334 210' };

// One routing story for every payment type. `r` is the recipient/payee handed to sessionStore.begin().
export const ROUTING_STEPS = (r) => {
  const payout = r.payout || 'NGN';
  return [
    { label:'Chip signs the transfer', sub:'Secure element · smart account' },
    { label:'Partner receives stablecoin', sub:'USDC · licensed on/off-ramp partner' },
    r.registered
      ? { label:'Credited to recipient wallet', sub:'On-chain · instant' }
      : { label:`Converting to ${payout}`, sub:`USDC to ${payout} at [live rate]` },
    r.registered
      ? { label:'Receipt ready', sub:'Recipient notified' }
      : { label: r.rail === 'airtime' ? 'Delivering airtime' : `Paying out via ${r.network || 'mobile money'}`, sub:'Confirmation by SMS' },
  ];
};

export const TRANSACTIONS = [
  { id:'t1', label:'Sent to Chidi O.',   sub:'MTN Nigeria',        amount:-149.66, color:'#14112B', icon:'↑' },
  { id:'t2', label:'Received from Brian O.', sub:'M-Pesa Kenya',   amount:100.78,  color:'#5B3DF5', icon:'↓' },
  { id:'t3', label:'Offline payment',    sub:'Bluetooth, settled later', amount:-12.00, color:'#B84E00', icon:'⇄' },
];

export const LIPA_MODES = [
  { id:'pochi',   label:'Pochi la Biashara', hint:'Pay a business using its phone number.',
    fields:[{ id:'number', label:'Business phone number', ph:'0712 345 678', type:'tel' }] },
  { id:'paybill', label:'Paybill', hint:'Pay a business with its business number and an account number.',
    fields:[{ id:'number', label:'Business number', ph:'e.g. 123456', type:'tel' }, { id:'account', label:'Account number', ph:'e.g. your meter or invoice number', type:'text' }] },
  { id:'till',    label:'Buy Goods Till', hint:'Pay a shop or merchant with its till number.',
    fields:[{ id:'number', label:'Till number', ph:'e.g. 654321', type:'tel' }] },
];
export const SAVED_PAYBILLS = [
  { label:'Electricity', number:'123456', account:'Meter number' },
  { label:'Water',       number:'234567', account:'Customer number' },
  { label:'Rent',        number:'345678', account:'Unit number' },
];

export const AIRTIME_PROVIDERS = [
  { id:'safaricom', name:'Safaricom' }, { id:'airtel', name:'Airtel' }, { id:'telkom', name:'Telkom' },
];
export const AIRTIME_PRESETS = [20, 50, 100, 250, 500]; // KES
export const DATA_BUNDLES = [
  { id:'d1', label:'1 GB, 24 hours', price:'[price]' },
  { id:'d2', label:'5 GB, 7 days',   price:'[price]' },
  { id:'d3', label:'20 GB, 30 days', price:'[price]' },
];

export const RECEIVE_INFO = [
  { k:'Your Nexura ID', v:'wanjiku@nexura', copy:true },
  { k:'Payment link',   v:'nexura.app/wanjiku', copy:true },
  { k:'Deposit from M-Pesa', v:'Paybill [number], account: your Nexura ID', copy:false },
];
export const PAY_TOOLS = [
  { id:'link',    icon:'link',    label:'Payment link',  sub:'nexura.app/wanjiku',               action:'Copy link' },
  { id:'request', icon:'request', label:'Request money', sub:'Send a request by SMS or WhatsApp', action:'Create request' },
  { id:'invoice', icon:'invoice', label:'Invoice',       sub:'Itemised, with a pay link',         action:'New invoice' },
  { id:'offline', icon:'bt',      label:'Offline pay',   sub:'Tap a nearby phone by Bluetooth',   action:'Start' },
];

export const HOLDINGS = [
  { symbol:'USDC', name:'USD Coin (wallet balance)', balance:'1,240.00', changePct:0.0, color:'#5E5A7A' },
];
