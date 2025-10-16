const CACHE_NAME = 'mnsf-cache-v1';
const FILES_TO_CACHE = [
  '/Buscar-codigos-mnsf/index.html',
  '/Buscar-codigos-mnsf/manifest.json',
  '/Buscar-codigos-mnsf/logo-mnsf.png'
];

// install
self.addEventListener('install', evt => {
  evt.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting();
});

// activate
self.addEventListener('activate', evt => {
  evt.waitUntil(self.clients.claim());
});

// fetch
self.addEventListener('fetch', evt => {
  evt.respondWith(
    caches.match(evt.request).then(resp => resp || fetch(evt.request))
  );
});
