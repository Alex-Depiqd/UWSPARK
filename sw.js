const CACHE_NAME = "spark-cache-__BUILD_HASH__";
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
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Fetch event: Serve from cache if offline
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    }).catch(() => {
      return new Response("You're offline and this resource isn't cached.");
    })
  );
});

self.addEventListener('activate', event => {
  clients.claim();
});

// Notify clients when a new SW is waiting
self.addEventListener('controllerchange', () => {
  // This event is fired in the page, not in the SW
});

self.addEventListener('message', event => {
  if (event.data === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
