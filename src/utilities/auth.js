// PIN gate for signing. The backend decides; the client only asks. A real build ties this to the secure element.
import { dataLoader } from '../services/dataLoader.js';
let authed = false;
export const auth = {
  isAuthed: () => authed,
  verifyPin: async (pin) => { try { authed = !!(await dataLoader.verifyPin(pin)).ok; } catch { authed = false; } return authed; },
  clear: () => { authed = false; },
};
