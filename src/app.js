import { getRoute, onRouteChange, navigate } from './router.js';
import { mountHeader } from './components/header.js';
import { mountBottomNav } from './components/bottomNav.js';
import { HomePage } from './pages/home.js';
import { PayBillPage } from './pages/paybill.js';
import { ProfilePage } from './pages/profile.js';
import { InvestPage } from './pages/invest.js';
import { AirtimePage } from './pages/airtime.js';
import { ContactsPage } from './pages/contacts.js';
import { AmountPage } from './pages/amount.js';
import { AuthPage } from './pages/auth.js';
import { ProcessingPage } from './pages/processing.js';
import { ReceiptPage } from './pages/receipt.js';

// Routes that show the greeting header + bottom nav (the main tabs).
// The send-money flow is a focused task, so it hides both for less clutter.
const CHROME_ROUTES = new Set(['home', 'paybill', 'profile', 'invest', 'airtime']);

const routes = {
  home: HomePage,
  paybill: PayBillPage,
  profile: ProfilePage,
  invest: InvestPage,
  airtime: AirtimePage,
  contacts: ContactsPage,
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
if (!location.hash) navigate('home');
render();
