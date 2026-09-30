import { el } from '../utilities/helpers.js';

// keys: array of 12 labels ('' renders a hidden spacer key).
// onPress(label) is called on tap.
export function Keypad(keys, onPress) {
  const pad = el('div', 'keypad');
  keys.forEach((k) => {
    const b = el('button', 'key', k);
    if (!k) b.style.visibility = 'hidden';
    b.onclick = () => onPress(k);
    pad.appendChild(b);
  });
  return pad;
}
