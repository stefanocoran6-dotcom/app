const CACHE = 'finlearn-v32';
const SHELL = ['./', './index.html', './app.js', './manifest.webmanifest', './icon-180.png', './icon-192.png', './icon-512.png', './icon-512-maskable.png', './favicon.svg'];

// install: scarica il guscio saltando la cache HTTP del browser, così non si salva una versione vecchia
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL.map((u) => new Request(u, { cache: 'reload' })))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
// pagina e app.js: prima la rete (sempre l'ultima versione), la cache solo offline.
// Il resto (librerie CDN, icone, font): prima la cache.
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  const u = new URL(e.request.url);
  const same = u.origin === self.location.origin;
  const fresh = same && (e.request.mode === 'navigate' || /\/(app\.js|index\.html)?$/.test(u.pathname) || u.pathname.endsWith('/app.js'));
  if (fresh) {
    e.respondWith(fetch(e.request, { cache: 'no-cache' }).then((res) => {
      if (res.ok) { const clone = res.clone(); caches.open(CACHE).then((c) => c.put(e.request, clone)); }
      return res;
    }).catch(() => caches.match(e.request).then((hit) => hit || caches.match('./index.html'))));
    return;
  }
  const cacheable = same || /esm\.sh|cdnjs|jsdelivr|tailwindcss|fonts\.g/.test(e.request.url);
  e.respondWith(
    caches.match(e.request).then((hit) => hit || fetch(e.request).then((res) => {
      if (res.ok && cacheable) { const clone = res.clone(); caches.open(CACHE).then((c) => c.put(e.request, clone)); }
      return res;
    }).catch(() => caches.match('./index.html')))
  );
});
