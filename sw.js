const CACHE = 'gdfg-static-v13';
const SHELL = [
  './', './index.html', './offline.html', './manifest.webmanifest',
  './assets/site.css', './assets/favicon.svg', './assets/search-index.json',
  './assets/site.js', './assets/nav.js', './assets/calculator-core.js', './assets/finance.js',
  './assets/finance-simulator.js', './assets/records-core.js', './assets/records.js',
  './assets/market-core.js', './assets/market-tool.js', './assets/register-sw.js',
  './assets/health-triage-core.js', './assets/health-triage.js',
  './assets/purchase-compare-core.js', './assets/purchase-compare.js',
  './assets/breed-data.js',
  './assets/one-acre-zones.svg', './pages/getting-started.html', './pages/breeds.html',
  './assets/shed-plan.svg', './assets/shed-ventilation.svg', './assets/farm-water-flow.svg',
  './pages/buying.html', './pages/layout.html', './pages/feeding.html', './pages/operations.html',
  './pages/milking.html', './pages/health.html', './pages/seasons.html', './pages/breeding-calves.html',
  './pages/market.html', './pages/buyer-comparison.html', './pages/finance.html',
  './pages/finance-studio.html', './pages/records.html', './pages/research.html',
  './pages/vaccination.html', './pages/staff.html', './pages/legal.html', './pages/pests.html',
  './pages/local-research.html', './pages/emergency.html'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(
    keys.filter(key => key.startsWith('gdfg-static-') && key !== CACHE).map(key => caches.delete(key))
  )).then(() => self.clients.claim()));
});

self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const response = await fetch(request);
        if (response.ok) await (await caches.open(CACHE)).put(request, response.clone());
        return response;
      } catch {
        const cachedPage = await caches.match(request);
        if (cachedPage) return cachedPage;
        const fallback = await caches.match(new URL('./offline.html', self.registration.scope).href);
        if (!fallback) return new Response('Offline page unavailable', { status: 504, statusText: 'Offline page unavailable' });
        return fallback;
      }
    })());
    return;
  }

  event.respondWith((async () => {
    const cached = await caches.match(request);
    if (cached) return cached;
    try {
      const response = await fetch(request);
      if (response.ok && response.type === 'basic') await (await caches.open(CACHE)).put(request, response.clone());
      return response;
    } catch {
      return new Response('', { status: 504, statusText: 'Offline resource unavailable' });
    }
  })());
});
