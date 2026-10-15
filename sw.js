// Не Заяц — Service Worker
const CACHE_NAME = 'nezayac-v1';
const CORE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/535AC982-E720-4BE0-B005-04BCB460C40B.png'
];

// Установка: кэшируем основные файлы
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(CORE_ASSETS).catch(() => {});
    }).then(() => self.skipWaiting())
  );
});

// Активация: чистим старые кэши
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(names => {
      return Promise.all(
        names.filter(n => n !== CACHE_NAME).map(n => caches.delete(n))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: стратегия «сеть в первую очередь, кэш если нет сети»
self.addEventListener('fetch', event => {
  const req = event.request;
  // Только GET
  if (req.method !== 'GET') return;
  // Не кэшируем API-запросы (Firebase, Worker)
  const url = req.url;
  if (url.includes('firebaseio.com') || url.includes('workers.dev') || url.includes('googleapis.com') || url.includes('gstatic.com')) {
    return;
  }
  event.respondWith(
    fetch(req).then(res => {
      // Успешный ответ — кладём в кэш
      if (res && res.status === 200 && res.type === 'basic') {
        const clone = res.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(req, clone)).catch(() => {});
      }
      return res;
    }).catch(() => {
      // Сети нет — из кэша
      return caches.match(req).then(cached => {
        if (cached) return cached;
        // Если HTML-запрос и ничего нет — отдаём index.html
        if (req.mode === 'navigate') {
          return caches.match('/index.html');
        }
      });
    })
  );
});

// Обновление версии при новом SW
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
