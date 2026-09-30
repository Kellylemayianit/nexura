// Client-side state for the transfer in progress — the payments-app
// equivalent of a cart store. Holds nothing persistent; a real build
// would sync `pin` verification server-side rather than storing it.
const state = { recipient: null, amount: '', pin: '' };
const subscribers = new Set();

function notify() { subscribers.forEach(fn => fn(state)); }

export const sessionStore = {
  get: () => state,
  setRecipient: (c) => { state.recipient = c; notify(); },
  setAmount: (a) => { state.amount = a; notify(); },
  appendPinDigit: (d) => { if (state.pin.length < 4) { state.pin += d; notify(); } },
  backspacePin: () => { state.pin = state.pin.slice(0, -1); notify(); },
  clearPin: () => { state.pin = ''; notify(); },
  reset: () => { state.recipient = null; state.amount = ''; state.pin = ''; notify(); },
  subscribe: (fn) => { subscribers.add(fn); return () => subscribers.delete(fn); },
};
