// Static demo dataset. Swap this for real API responses via services/api.js
// without touching any page or component — they only ever import dataLoader.js.
export const CONTACTS = [
  { id:'c1', name:'Amara Nwosu',    phone:'+234 802 114 5567', color:'#3ECF8E', registered:true },
  { id:'c2', name:'Chidi Okeke',    phone:'+234 706 220 9981', color:'#E8A33D', registered:false },
  { id:'c3', name:'Wanjiku Mwangi', phone:'+254 712 334 210',  color:'#6EA8FE', registered:true },
  { id:'c4', name:'Tunde Bakare',   phone:'+234 815 990 4423', color:'#D97757', registered:false },
];

export const ACCOUNT = { balance: 1240.00, currency: 'cKES' };

export const ROUTE_FEE_PCT = 0.002; // 0.20% integrator/router fee

export const ROUTING_STEPS = (registered) => [
  { label:'Secure element signs payload', sub:'eSIM · ERC-4337 smart account' },
  { label:'Gas abstracted in cKES', sub:'stablecoin execution spread' },
  { label:'AMM route executes swap', sub:'Mento FPMM · cKES → USDC' },
  registered
    ? { label:'Credited to recipient wallet', sub:'on-chain · hardware cold storage' }
    : { label:'Routed to off-ramp partner', sub:'Kotani Pay / Yellow Card API' },
];

export const PROFILE = { name:'Andreas Christensen', phone:'(+1) 567 564 6752' };

export const TRANSACTIONS = [
  { id:'t1', label:'AMD → USDC swap',  sub:'Advanced Micro Devices', amount:-72.21, color:'#1E9E5A', icon:'↗' },
  { id:'t2', label:'Sent to Chidi O.', sub:'Off-ramp · Mobile money', amount:-149.66, color:'#0E2C27', icon:'↑' },
  { id:'t3', label:'Received cKES',    sub:'From Wanjiku M.',        amount:100.78, color:'#3ECF8E', icon:'↓' },
  { id:'t4', label:'Yield payout',     sub:'Liquidity staking pool', amount:14.32,  color:'#E8A33D', icon:'★' },
];

export const QUICK_SERVICES = [
  { id:'send', label:'Send Money', icon:'➤' },
  { id:'paybill', label:'Pay Bill', icon:'🧾' },
  { id:'withdraw', label:'Withdraw', icon:'⬇' },
  { id:'bundles', label:'Buy Bundles', icon:'📶' },
  { id:'intl', label:"Int'l Transfer", icon:'🌍' },
  { id:'mobile', label:'Airtime Top Up', icon:'📞' },
  { id:'rewards', label:'Rewards', icon:'🎁' },
  { id:'internet', label:'Home Internet', icon:'🏠' },
];

export const FINANCIAL_SERVICES = [
  { label:'Overdraft', icon:'💳' },
  { label:'Savings Pool', icon:'🏦' },
  { label:'Micro-Loan', icon:'🪙' },
];

export const WALLETS = [
  { label:'Business Wallet', icon:'💼' },
  { label:'Family Wallet', icon:'👨‍👩‍👧' },
];

export const FREQUENTS = [
  { name:'Amara Nwosu', action:'Send money', color:'#3ECF8E' },
  { name:'Chidi Okeke', action:'Send money', color:'#E8A33D' },
  { name:'KPLC', action:'Pay bill', color:'#6EA8FE' },
  { name:'Safaricom', action:'Buy airtime', color:'#E15B5B' },
];


export const BILL_CATEGORIES = [
  { id:'elec', label:'Electricity', icon:'⚡' },
  { id:'water', label:'Water', icon:'💧' },
  { id:'internet', label:'Internet', icon:'📶' },
  { id:'tv', label:'Television', icon:'📺' },
];

export const UNPAID_BILL = { amount: 20.00, currency:'cKES' };

export const NEARBY_FRIENDS = [
  { name:'Carla Bator', color:'#E091A8' },
  { name:'Emery Geidt', color:'#6EA8FE' },
  { name:'Lisa Wesley', color:'#B79BE0' },
];

export const BILL_HISTORY = [
  { label:'Electricity', ref:'E-438582', date:'Sep 1, 2026', amount:-20.00, icon:'⚡' },
  { label:'Water', ref:'W-346961', date:'Sep 1, 2026', amount:-50.00, icon:'💧' },
];

export const HOLDINGS = [
  { symbol:'cKES', name:'Kenyan Shilling stable', balance:'842.10', changePct:0.8, color:'#1E9E5A' },
  { symbol:'cNGN', name:'Naira stable',            balance:'1,205.40', changePct:1.4, color:'#1E9E5A' },
  { symbol:'USDC', name:'USD Coin',                balance:'320.00', changePct:0.0, color:'#7C8680' },
  { symbol:'LP',   name:'Mento FPMM pool share',   balance:'96.30',  changePct:-0.3, color:'#E15B5B' },
];

export const AIRTIME_PROVIDERS = [
  { id:'safaricom', name:'Safaricom', color:'#1E9E5A' },
  { id:'mtn', name:'MTN', color:'#E8A33D' },
  { id:'airtel', name:'Airtel', color:'#E15B5B' },
  { id:'glo', name:'Globacom', color:'#3ECF8E' },
];
export const AIRTIME_PRESETS = [1, 2, 5, 10, 20];
