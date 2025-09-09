const CACHE_NAME = "charakterbogen-cache-v2";
const ASSETS = [
  "/",              // Root
  "/index.html",         // Hauptdokument
  "/css/style-mobile.css",  // Styles Mobile
  "/css/style-desktop.css", // Styles Desktop
  "/js/sections.js",     // Struktur
  "/js/translations.js", // Übersetzungen
  "/js/logic.js",        // Logik
  "/manifest.json",      // PWA Manifest
  "/img/appicon.png",    // App-Icon
  "/img/splash.png"      // Splashscreen
];

self.addEventListener("install", e => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clientsClaim();
});

self.addEventListener("fetch", e => {
  e.respondWith(
    fetch(e.request)
      .then(res => {
        const resClone = res.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(e.request, resClone));
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});

self.addEventListener("message", e => {
  if (e.data && e.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
