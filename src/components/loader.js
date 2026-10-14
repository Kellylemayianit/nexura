// Boot splash lives in index.html (so it shows before any JS). This just fades it out once the first screen is ready,
// keeping it up long enough for the logo animation to play.
export function hideBoot(minMs = 1500) {
  const boot = document.getElementById('boot');
  if (!boot) return Promise.resolve();
  return new Promise((resolve) => {
    setTimeout(() => {
      boot.classList.add('done');
      setTimeout(() => { boot.remove(); resolve(); }, 600);
    }, Math.max(0, minMs - performance.now()));
  });
}
