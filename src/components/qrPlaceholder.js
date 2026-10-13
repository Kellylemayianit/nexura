// Demo-only QR look-alike drawn from a seed string. NOT scannable:
// a real build swaps this for a QR library encoding the payment link.
export function QrPlaceholder(seed, size = 168) {
  const n = 21, c = size / n;
  let h = 0; for (const ch of seed) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  const rnd = () => { h = (h * 1664525 + 1013904223) >>> 0; return h / 4294967296; };
  const finder = (x, y) => (x < 7 && y < 7) || (x >= n - 7 && y < 7) || (x < 7 && y >= n - 7);
  let cells = '';
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
    if (!finder(x, y) && rnd() > 0.52) cells += `<rect x="${x * c}" y="${y * c}" width="${c}" height="${c}"/>`;
  }
  const eye = (x, y) => `<rect x="${x * c}" y="${y * c}" width="${7 * c}" height="${7 * c}"/><rect x="${(x + 1) * c}" y="${(y + 1) * c}" width="${5 * c}" height="${5 * c}" fill="#fff"/><rect x="${(x + 2) * c}" y="${(y + 2) * c}" width="${3 * c}" height="${3 * c}" fill="#5B3DF5"/>`;
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" role="img" aria-label="Payment QR code (demo)"><g fill="#14112B">${cells}${eye(0, 0)}${eye(n - 7, 0)}${eye(0, n - 7)}</g></svg>`;
}
