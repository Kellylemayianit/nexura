import { el, esc } from '../utilities/helpers.js';
import { splitWords } from '../utilities/motion.js';

// Gradient headline band used at the top of each tab. Words rise in one by one.
export function SlimHero(eyebrow, line) {
  const h = el('section', 'hero slim', `<div><p class="eyebrow">${esc(eyebrow)}</p><h2 class="hero-line">${esc(line)}</h2></div>`);
  splitWords(h.querySelector('.hero-line'));
  return h;
}
