self.addEventListener("install", e => {
  e.waitUntil(
    caches.open("charakterbogen-cache").then(cache => {
      return cache.addAll([
        "/",
        "/index.html",
        "/style.css",
        "/sections.js",
        "/translations.js",
        "/logic.js",
        "/manifest.json"
      ]);
    })
  );
});

self.addEventListener("fetch", e => {
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});
