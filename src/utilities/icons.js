const svg = (d, w = 22) => `<svg width="${w}" height="${w}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
export const icons = {
  check: svg('<path d="M4 12l5 5L20 6"/>', 24),
  back: svg('<path d="M15 18l-6-6 6-6"/>', 20),
  send: svg('<path d="M4 12l16-8-6 16-3-7z"/>'),
  lipa: svg('<rect x="3" y="6" width="18" height="12" rx="2"/><path d="M3 10h18M7 15h3"/>'),
  airtime: svg('<rect x="7" y="2.5" width="10" height="19" rx="2"/><path d="M11 18.5h2"/>'),
  more: svg('<rect x="3.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.5"/><path d="M14 14h3v3h-3zM19 19h1.5"/>'),
  user: svg('<circle cx="12" cy="8" r="4"/><path d="M4 21c1-4 4-6 8-6s7 2 8 6"/>', 18),
  link: svg('<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>'),
  request: svg('<path d="M18 6L6 18M6 8v10h10"/>'),
  invoice: svg('<path d="M6 3h9l3 3v15H6z"/><path d="M9 11h6M9 15h6"/>'),
  bt: svg('<path d="M7 7l10 10-5 4V3l5 4L7 17"/>'),
};
