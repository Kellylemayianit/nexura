// Small text/number animation helpers. All of them degrade to instant when the user prefers reduced motion.
import { fmt } from './helpers.js';
export const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Words rise into place one after another. Screen readers get the original sentence.
export function splitWords(node) {
  const text = node.textContent.trim();
  if (reduceMotion()) return node;
  node.setAttribute('aria-label', text);
  node.replaceChildren();
  text.split(/\s+/).forEach((w, i) => {
    const s = document.createElement('span'); s.className = 'w'; s.style.setProperty('--i', i); s.setAttribute('aria-hidden', 'true');
    s.innerHTML = '<span></span>'; s.firstChild.textContent = w;
    node.append(s, ' ');
  });
  node.classList.add('split');
  return node;
}

// Count a number up to its value. prefix/suffix are fixed text around it.
export function countUp(node, to, { from = 0, decimals = 2, duration = 900, prefix = '', suffix = '' } = {}) {
  const set = (v) => { node.textContent = `${prefix}${fmt(v, decimals)}${suffix}`; };
  if (reduceMotion() || from === to) return set(to);
  const t0 = performance.now();
  const tick = (now) => {
    const p = Math.min(1, (now - t0) / duration);
    set(from + (to - from) * (1 - Math.pow(1 - p, 3)));
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

// Children fade up in sequence.
export function stagger(container, step = 60) {
  [...container.children].forEach((c, i) => { c.style.setProperty('--d', `${i * step}ms`); c.classList.add('rise'); });
  return container;
}

// Briefly pulse an element whose value just changed.
export function bump(node) {
  if (reduceMotion()) return;
  node.classList.remove('bump'); void node.offsetWidth; node.classList.add('bump');
}
