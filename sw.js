const CACHE_NAME = "stella-cache-v1";
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
