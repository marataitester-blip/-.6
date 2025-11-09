
const CACHE_NAME = 'astral-hero-tarot-v1';
const CDN_BASE_URL = 'https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/';

// Список всех ресурсов для кэширования
const URLS_TO_CACHE = [
  '/',
  '/index.html',
  '/index.tsx',
  '/App.tsx',
  '/components/CardSelector.tsx',
  '/components/TarotCardDisplay.tsx',
  '/constants.ts',
  '/types.ts',
  'https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700&family=Cormorant+Garamond:wght@400;500;600&display=swap',
  'https://code.responsivevoice.org/responsivevoice.js?key=YOUR_KEY',
  `${CDN_BASE_URL}00_fool_anim.mp4`,
  `${CDN_BASE_URL}01_magician_anim.mp4`,
  `${CDN_BASE_URL}02_high_priestess_anim.mp4`,
  `${CDN_BASE_URL}03_empress_anim.mp4`,
  `${CDN_BASE_URL}04_emperor_anim.mp4`,
  `${CDN_BASE_URL}05_hierophant_anim.mp4`,
  `${CDN_BASE_URL}06_lovers_anim.mp4`,
  `${CDN_BASE_URL}07_chariot_anim.mp4`,
  `${CDN_BASE_URL}08_strength_anim.mp4`,
  `${CDN_BASE_URL}09_hermit_anim.mp4`,
  `${CDN_BASE_URL}10_wheel_of_fortune_anim.mp4`,
  `${CDN_BASE_URL}11_justice_anim.mp4`,
  `${CDN_BASE_URL}12_hanged_man_anim.mp4`,
  `${CDN_BASE_URL}13_death_anim.mp4`,
  `${CDN_BASE_URL}14_temperance_anim.mp4`,
  `${CDN_BASE_URL}15_devil_anim.mp4`,
  `${CDN_BASE_URL}16_tower_anim.mp4`,
  `${CDN_BASE_URL}17_star_anim.mp4`,
  `${CDN_BASE_URL}18_moon_anim.mp4`,
  `${CDN_BASE_URL}19_sun_anim.mp4`,
  `${CDN_BASE_URL}20_judgement_anim.mp4`,
  `${CDN_BASE_URL}21_world_anim.mp4`,
  `${CDN_BASE_URL}wands_01_ace.png`,
  `${CDN_BASE_URL}wands_02_two.png`,
  `${CDN_BASE_URL}wands_03_three.png`,
  `${CDN_BASE_URL}wands_04_four.png`,
  `${CDN_BASE_URL}wands_05_five.png`,
  `${CDN_BASE_URL}wands_06_six.png`,
  `${CDN_BASE_URL}wands_07_seven.png`,
  `${CDN_BASE_URL}wands_08_eight.png`,
  `${CDN_BASE_URL}wands_09_nine.png`,
  `${CDN_BASE_URL}wands_10_ten.png`,
  `${CDN_BASE_URL}wands_11_page.png`,
  `${CDN_BASE_URL}wands_12_knight.png`,
  `${CDN_BASE_URL}wands_13_queen.png`,
  `${CDN_BASE_URL}wands_14_king.png`,
  `${CDN_BASE_URL}cups_01_ace.png`,
  `${CDN_BASE_URL}cups_02_two.png`,
  `${CDN_BASE_URL}cups_03_three.png`,
  `${CDN_BASE_URL}cups_04_four.png`,
  `${CDN_BASE_URL}cups_05_five.png`,
  `${CDN_BASE_URL}cups_06_six.png`,
  `${CDN_BASE_URL}cups_07_seven.png`,
  `${CDN_BASE_URL}cups_08_eight.png`,
  `${CDN_BASE_URL}cups_09_nine.png`,
  `${CDN_BASE_URL}cups_10_ten.png`,
  `${CDN_BASE_URL}cups_11_page.png`,
  `${CDN_BASE_URL}cups_12_knight.png`,
  `${CDN_BASE_URL}cups_13_queen.png`,
  `${CDN_BASE_URL}cups_14_king.png`,
  `${CDN_BASE_URL}swords_01_ace.png`,
  `${CDN_BASE_URL}swords_02_two.png`,
  `${CDN_BASE_URL}swords_03_three.png`,
  `${CDN_BASE_URL}swords_04_four.png`,
  `${CDN_BASE_URL}swords_05_five.png`,
  `${CDN_BASE_URL}swords_06_six.png`,
  `${CDN_BASE_URL}swords_07_seven.png`,
  `${CDN_BASE_URL}swords_08_eight.png`,
  `${CDN_BASE_URL}swords_09_nine.png`,
  `${CDN_BASE_URL}swords_10_ten.png`,
  `${CDN_BASE_URL}swords_11_page.png`,
  `${CDN_BASE_URL}swords_12_knight.png`,
  `${CDN_BASE_URL}swords_13_queen.png`,
  `${CDN_BASE_URL}swords_14_king.png`,
  `${CDN_BASE_URL}pentacles_01_ace.png`,
  `${CDN_BASE_URL}pentacles_02_two.png`,
  `${CDN_BASE_URL}pentacles_03_three.png`,
  `${CDN_BASE_URL}pentacles_04_four.png`,
  `${CDN_BASE_URL}pentacles_05_five.png`,
  `${CDN_BASE_URL}pentacles_06_six.png`,
  `${CDN_BASE_URL}pentacles_07_seven.png`,
  `${CDN_BASE_URL}pentacles_08_eight.png`,
  `${CDN_BASE_URL}pentacles_09_nine.png`,
  `${CDN_BASE_URL}pentacles_10_ten.png`,
  `${CDN_BASE_URL}pentacles_11_page.png`,
  `${CDN_BASE_URL}pentacles_12_knight.png`,
  `${CDN_BASE_URL}pentacles_13_queen.png`,
  `${CDN_BASE_URL}pentacles_14_king.png`,
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
            // Для кросс-доменных запросов создаем новый объект Request
            const request = (url.startsWith('http')) ? new Request(url, { mode: 'no-cors' }) : url;
            return cache.add(request).catch(err => {
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
