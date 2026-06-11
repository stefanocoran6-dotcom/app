const CACHE = 'finlearn-v15';
const SHELL = ['./', './index.html', './app.js', './manifest.webmanifest', './icon-180.png', './icon-192.png', './icon-512.png'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
// cache-first: dopo il primo avvio l'app (incluse le dipendenze CDN) funziona offline
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  const u = e.request.url;
  const cacheable = u.startsWith(self.location.origin) || /esm\.sh|cdnjs|jsdelivr|tailwindcss|fonts\.g/.test(u);
  e.respondWith(
    caches.match(e.request).then((hit) => hit || fetch(e.request).then((res) => {
      if (res.ok && cacheable) { const clone = res.clone(); caches.open(CACHE).then((c) => c.put(e.request, clone)); }
      return res;
    }).catch(() => caches.match('./index.html')))
  );
});
