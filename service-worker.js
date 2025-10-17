const CACHE_NAME = 'mnsf-cache-v2';
const FILES_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './logo-mnsf.png',
  'https://cdn.jsdelivr.net/npm/jsbarcode@3.11.5/dist/JsBarcode.all.min.js'
];

// Instalação: Adiciona os ficheiros do app ao cache
self.addEventListener('install', evt => {
  evt.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Pré-cache dos ficheiros do aplicativo');
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Ativação: Limpa caches antigos
self.addEventListener('activate', evt => {
  evt.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(keyList.map(key => {
        if (key !== CACHE_NAME) {
          console.log('Removendo cache antigo', key);
          return caches.delete(key);
        }
      }));
    })
  );
  self.clients.claim();
});

// Fetch: Tenta servir a partir da rede primeiro, depois do cache
self.addEventListener('fetch', evt => {
  // Ignora os pedidos para a API do Google Sheets para que sejam sempre feitos à rede
  if (evt.request.url.includes('script.google.com')) {
    evt.respondWith(fetch(evt.request));
    return;
  }

  evt.respondWith(
    fetch(evt.request).catch(() => {
      return caches.match(evt.request);
    })
  );
});
