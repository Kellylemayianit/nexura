import { getRoute, onRouteChange, navigate } from './router.js';
import { mountBottomNav } from './components/bottomNav.js';
import { SendPage } from './pages/send.js';
import { LipaPage } from './pages/lipa.js';
import { AirtimePage } from './pages/airtime.js';
import { MorePage } from './pages/more.js';
import { ProfilePage } from './pages/profile.js';
import { InvestPage } from './pages/invest.js';
import { AuthPage } from './pages/auth.js';
import { ProcessingPage } from './pages/processing.js';
import { ReceiptPage } from './pages/receipt.js';

// Tab routes show the tab bar on phones. The sign-and-send flow is a focused task, so phones hide it there
// (desktop keeps the sidebar everywhere).
const TAB_ROUTES = new Set(['send', 'lipa', 'airtime', 'more', 'profile', 'invest']);

const routes = {
  home: SendPage, send: SendPage, lipa: LipaPage, airtime: AirtimePage, more: MorePage,
  profile: ProfilePage, invest: InvestPage,
  auth: AuthPage, processing: ProcessingPage, receipt: ReceiptPage,
};

const appRoot = document.getElementById('app');
const frame = document.getElementById('frame');

async function render() {
  const route = getRoute();
  const page = routes[route] || routes.send;
  appRoot.replaceChildren(await page());
  frame.classList.toggle('flow', !TAB_ROUTES.has(route));
  appRoot.scrollTop = 0; window.scrollTo(0, 0);
  mountBottomNav();
}

onRouteChange(render);
if (!location.hash) navigate('send');
render();
