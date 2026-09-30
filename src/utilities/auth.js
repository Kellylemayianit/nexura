// Mock authentication for the demo. A real build verifies the PIN
// against the secure-element signature server-side, not in the client.
let sessionAuthed = false;

export const auth = {
  isAuthed: () => sessionAuthed,
  verifyPin: async (pin) => {
    await new Promise(r => setTimeout(r, 150));
    sessionAuthed = pin.length === 4; // any 4-digit PIN passes in this demo
    return sessionAuthed;
  },
  clear: () => { sessionAuthed = false; },
};
