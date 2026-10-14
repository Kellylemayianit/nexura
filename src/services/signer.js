// Hardware signer boundary. Today: a mock. Later: the phone's secure element / eSIM applet behind the same call.
// The private key never crosses this boundary; only the payload goes in and a signature comes out.
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
export const signer = {
  kind: 'mock',
  async sign(payload) {
    await sleep(300);
    return { alg: 'mock', signature: btoa(JSON.stringify(payload)).slice(0, 40), signedAt: Date.now() };
  },
};
