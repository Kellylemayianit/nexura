// Payment orchestration: quote -> sign -> create (idempotent) -> watch status. Pages never call fetch themselves.
import { dataLoader } from './dataLoader.js';
import { signer } from './signer.js';
import { STATUS_ORDER, TERMINAL } from '../config/statuses.js';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export const payments = {
  async submit({ kind, payee, quote }) {
    const payload = { quoteId: quote.id, kind, payee: { name: payee.name, ref: payee.phone || payee.ref, rail: payee.rail } };
    const signature = await signer.sign(payload);
    const idempotencyKey = crypto.randomUUID();
    const payment = await dataLoader.createPayment({ ...payload, signature }, idempotencyKey);
    dataLoader.invalidate('assets'); // balances changed
    return payment;
  },

  // Polling for now. Swap this body for SSE / WebSocket later; the callback contract stays the same.
  watch(id, onUpdate, interval = 700) {
    let stop = false;
    (async () => {
      while (!stop) {
        try {
          const p = await dataLoader.getPayment(id);
          if (stop) return;
          onUpdate(p);
          if (TERMINAL.has(p.status)) return;
        } catch (error) { if (!stop) onUpdate({ id, status: 'error', error }); }
        await sleep(interval);
      }
    })();
    return () => { stop = true; };
  },

  // The four visible steps and which backend status completes each one.
  steps({ payee, asset, quote }) {
    const airtime = payee.kind === 'airtime';
    return [
      { done: 'signed', label: 'Chip signs the payment', sub: 'Secure element · smart account' },
      { done: 'partner_received', label: 'Partner receives your stablecoin', sub: `${asset.symbol} · licensed partner` },
      payee.registered
        ? { done: 'converting', label: 'Crediting recipient wallet', sub: 'On-chain · instant' }
        : { done: 'converting', label: 'Converting to KES', sub: `${asset.symbol} to KES at ${quote.rate.toFixed(2)}${quote.rateIsDemo ? ' (demo)' : ''}` },
      { done: 'paid_out', label: airtime ? 'Delivering airtime' : `Paying out via ${payee.network || 'mobile money'}`, sub: 'Confirmation by SMS' },
    ];
  },
  progress: (status) => STATUS_ORDER.indexOf(status),
};
