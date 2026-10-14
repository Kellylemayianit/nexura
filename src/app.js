import { getRoute, onRouteChange, navigate } from './router.js';
import { theme } from './services/theme.js';
import { mountBottomNav } from './components/bottomNav.js';
import { Skeleton, ErrorState } from './components/skeleton.js';
import { hideBoot } from './components/loader.js';
import { guide } from './components/guide.js';
import { toast } from './utilities/helpers.js';
import { SendPage } from './pages/send.js';
import { LipaPage } from './pages/lipa.js';
import { AirtimePage } from './pages/airtime.js';
import { MorePage } from './pages/more.js';
import { ProfilePage } from './pages/profile.js';
import { InvestPage } from './pages/invest.js';
import { AuthPage } from './pages/auth.js';
import { ProcessingPage } from './pages/processing.js';
import { ReceiptPage } from './pages/receipt.js';

theme.init();

// Tab routes show the tab bar on phones. The sign-and-send flow is a focused task, so phones hide it there
// (desktop keeps the sidebar everywhere).
const TAB_ROUTES = new Set(['send', 'lipa', 'airtime', 'more', 'profile', 'invest']);
const routes = {
  home: SendPage, send: SendPage, lipa: LipaPage, airtime: AirtimePage, more: MorePage,
  profile: ProfilePage, invest: InvestPage, auth: AuthPage, processing: ProcessingPage, receipt: ReceiptPage,
};

const appRoot = document.getElementById('app');
const frame = document.getElementById('frame');
let renderId = 0, firstPaint = true;

async function render() {
  const mine = ++renderId, route = getRoute();
  frame.classList.toggle('flow', !TAB_ROUTES.has(route));
  mountBottomNav();
  appRoot.replaceChildren(Skeleton());
  try {
    const node = await (routes[route] || routes.send)();
    if (mine !== renderId) return;
    node.classList.add('page-enter');
    appRoot.replaceChildren(node);
  } catch (e) {
    if (mine !== renderId) return;
    appRoot.replaceChildren(ErrorState(e, render));
  }
  appRoot.scrollTop = 0; window.scrollTo(0, 0);
  if (firstPaint) { firstPaint = false; await hideBoot(); guide.maybeStart(); }
}

window.addEventListener('nexura:unauthorized', () => toast('Your session expired. Please sign in again.'));
onRouteChange(render);
if (!location.hash) navigate('send');
render();
