// Steps for the guided tour. `target` is a CSS selector (first visible match is highlighted); no target = centred card.
export const GUIDE_STEPS = [
  { title: 'Welcome to Nexura', body: 'Spend your stablecoins across Kenya. This 30-second tour shows you around.' },
  { target: '[data-tour="send"]', title: 'Send / Receive', body: 'Pick who, choose which asset to pay with, set an amount. Your phone chip signs it.' },
  { target: '[data-tour="lipa"]', title: 'Lipa na M-Pesa', body: 'Pay Pochi la Biashara, Paybill or Till, funded from any asset in your wallet.' },
  { target: '[data-tour="airtime"]', title: 'Airtime & Data', body: 'Top up yourself or someone else in a few taps.' },
  { target: '[data-tour="more"]', title: 'More ways to get paid', body: 'Share a QR or payment link, send requests and invoices, or pay offline over Bluetooth.' },
  { target: '[data-tour="signer"]', title: 'Your chip signs everything', body: 'Your key stays in your phone\'s secure hardware. Nexura never holds it.' },
  { target: '[data-tour="theme"]', title: 'Light or dark', body: 'Switch any time. Nexura also follows your device setting until you choose.' },
];
