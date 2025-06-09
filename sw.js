const CACHE_VERSION = 'v1';
const CACHE_NAME = `stella-cache-${CACHE_VERSION}`;
const urlsToCache = [
  "./",
  "./index.html",
  "./style.css",
  "./app.js",
  "./data.js",
  "./import.js",
  "./ai.js",
  "./UWLogoTP.png",
  "./manifest.json"
];

// Install event: Cache all files
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName.startsWith('stella-cache-') && cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch event: Serve from cache if offline
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request).then(response => {
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }

        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseToCache);
        });

        return response;
      });
    }).catch(() => {
      return new Response("You're offline and this resource isn't cached.");
    })
  );
});
