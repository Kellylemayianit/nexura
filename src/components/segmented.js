import { el } from '../utilities/helpers.js';

function choiceRow(wrapClass, btnClass, options, activeId, onChange) {
  const wrap = el('div', wrapClass);
  options.forEach((o) => {
    const b = el('button', `${btnClass}${o.id === activeId ? ' on' : ''}`, o.label);
    b.type = 'button';
    b.setAttribute('aria-pressed', o.id === activeId);
    b.onclick = () => {
      [...wrap.children].forEach((c) => { c.classList.remove('on'); c.setAttribute('aria-pressed', false); });
      b.classList.add('on'); b.setAttribute('aria-pressed', true);
      onChange(o.id);
    };
    wrap.appendChild(b);
  });
  return wrap;
}

// Segmented: full-width tab switcher. Chips: compact single-choice pills.
export const Segmented = (options, activeId, onChange) => choiceRow('seg', 'seg-btn', options, activeId, onChange);
export const Chips = (options, activeId, onChange) => choiceRow('chips', 'chip', options, activeId, onChange);
