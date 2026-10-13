import { getRoute, onRouteChange, navigate } from './router.js';
import { mountHeader } from './components/header.js';
import { mountBottomNav } from './components/bottomNav.js';
import { SendPage } from './pages/send.js';
import { LipaPage } from './pages/lipa.js';
import { MorePage } from './pages/more.js';
import { ProfilePage } from './pages/profile.js';
import { InvestPage } from './pages/invest.js';
import { AirtimePage } from './pages/airtime.js';
import { AmountPage } from './pages/amount.js';
import { AuthPage } from './pages/auth.js';
import { ProcessingPage } from './pages/processing.js';
import { ReceiptPage } from './pages/receipt.js';

// Routes that show the greeting header + bottom nav (the main tabs).
// The send-money flow is a focused task, so it hides both for less clutter.
const CHROME_ROUTES = new Set(['send', 'lipa', 'airtime', 'more', 'profile', 'invest']);

const routes = {
  home: SendPage,
  send: SendPage,
  lipa: LipaPage,
  more: MorePage,
  profile: ProfilePage,
  invest: InvestPage,
  airtime: AirtimePage,
  amount: AmountPage,
  auth: AuthPage,
  processing: ProcessingPage,
  receipt: ReceiptPage,
};

const appRoot = document.getElementById('app');
const headerRoot = document.getElementById('header-root');
const navRoot = document.getElementById('nav-root');

async function render() {
  const route = getRoute();
  const page = routes[route] || routes.home;
  appRoot.innerHTML = '';
  appRoot.appendChild(await page());

  const showChrome = CHROME_ROUTES.has(route);
  headerRoot.style.display = showChrome ? '' : 'none';
  navRoot.style.display = showChrome ? '' : 'none';
  if (showChrome) { await mountHeader(); mountBottomNav(); }
}

onRouteChange(render);
if (!location.hash) navigate('send');
render();
