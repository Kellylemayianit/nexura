const svg = (d, w = 22) => `<svg width="${w}" height="${w}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
export const icons = {
  check: svg('<path d="M4 12l5 5L20 6"/>', 24),
  back: svg('<path d="M15 18l-6-6 6-6"/>', 20),
};
