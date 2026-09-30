const subscribers = new Set();

function currentRoute() {
  return (location.hash.replace(/^#\/?/, '') || 'home').split('/')[0];
}

export function onRouteChange(fn) {
  subscribers.add(fn);
  return () => subscribers.delete(fn);
}

export function navigate(route) {
  location.hash = `/${route}`;
}

window.addEventListener('hashchange', () => {
  const route = currentRoute();
  subscribers.forEach((fn) => fn(route));
});

export function getRoute() {
  return currentRoute();
}
