import { el } from '../utilities/helpers.js';
import { icons } from '../utilities/icons.js';
import { theme } from '../services/theme.js';

export function ThemeToggle() {
  const b = el('button', 'icon-btn theme-toggle');
  b.type = 'button'; b.dataset.tour = 'theme';
  const paint = (t) => {
    b.innerHTML = t === 'dark' ? icons.sun : icons.moon;
    b.setAttribute('aria-label', t === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    b.setAttribute('aria-pressed', String(t === 'dark'));
  };
  paint(theme.current());
  b.onclick = () => theme.toggle();
  const off = theme.subscribe((t) => { if (!b.isConnected) return off(); paint(t); });
  return b;
}
