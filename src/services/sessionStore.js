// State for the payment in progress (a cart, essentially). Holds nothing persistent and never the PIN beyond entry.
const blank = () => ({ kind: null, payee: null, asset: null, quote: null, payment: null, pin: '' });
let state = blank();
const subs = new Set();
const notify = () => subs.forEach((fn) => fn(state));

export const sessionStore = {
  get: () => state,
  begin: ({ kind, payee, asset, quote }) => { state = { ...blank(), kind, payee, asset, quote }; notify(); },
  setPayment: (payment) => { state.payment = payment; notify(); },
  appendPinDigit: (d) => { if (state.pin.length < 4) { state.pin += d; notify(); } },
  backspacePin: () => { state.pin = state.pin.slice(0, -1); notify(); },
  clearPin: () => { state.pin = ''; notify(); },
  reset: () => { state = blank(); notify(); },
  subscribe: (fn) => { subs.add(fn); return () => subs.delete(fn); },
};
