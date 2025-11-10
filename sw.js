const CACHE_NAME = 'astral-hero-tarot-v5';
const CDN_BASE_URL = 'https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/';

// Список ключевых ресурсов для кэширования (app shell)
const URLS_TO_CACHE = [
  '/',
  '/index.html',
  'https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700&family=Cormorant+Garamond:wght@400;500;600&display=swap',
  'https://www.script-tutorials.com/demos/360/images/stars.png',
  `${CDN_BASE_URL}keyword_reveal.mp3`,
  'https://cdn.pixabay.com/audio/2022/03/15/audio_2491a5499d.mp3',
  `${CDN_BASE_URL}icon-192x192.png`,
  `${CDN_BASE_URL}icon-512x512.png`,
  `${CDN_BASE_URL}rubashka.png`
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        // Используем более надежный способ кэширования, чтобы одна ошибка не сломала все
        return Promise.all(
          URLS_TO_CACHE.map(url => {
            // cache.add handles cross-origin requests with CORS by default
            return cache.add(url).catch(err => {
              console.warn(`Failed to cache ${url}:`, err);
            });
          })
        );
      })
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(event.request).then(
          response => {
            if (!response || response.status !== 200 && response.status !== 0 || response.type === 'error') {
              return response;
            }

            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
  );
});