import { el, esc } from '../utilities/helpers.js';

// Desktop: numbered circles. Phones: "Step 2 of 4 · Asset" with a segmented progress bar (see wizard.css).
export function Stepper(labels) {
  const list = el('ol', 'stepper');
  labels.forEach((l, i) => list.appendChild(el('li', 'st', `<span class="st-dot">${i + 1}</span><span>${esc(l)}</span>`)));
  const bar = el('div', 'st-bar', '<i></i>');
  const meta = el('div', 'st-meta'), segs = el('div', 'st-segs');
  labels.forEach(() => segs.appendChild(document.createElement('i')));
  const wrap = el('div', 'stepper-wrap'); wrap.append(list, bar, meta, segs);
  wrap.set = (i) => {
    [...list.children].forEach((li, j) => {
      li.classList.toggle('done', j < i); li.classList.toggle('on', j === i);
      if (j === i) li.setAttribute('aria-current', 'step'); else li.removeAttribute('aria-current');
    });
    bar.firstChild.style.width = `${(i / (labels.length - 1)) * 100}%`;
    meta.innerHTML = `<b>Step ${i + 1} of ${labels.length}</b><span>${esc(labels[i])}</span>`;
    [...segs.children].forEach((s, j) => s.classList.toggle('on', j <= i));
  };
  return wrap;
}
