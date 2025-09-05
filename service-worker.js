self.addEventListener("install", e => {
  // Beim Installieren alle notwendigen Dateien cachen
  e.waitUntil(
    caches.open("charakterbogen-cache").then(cache => {
      return cache.addAll([
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
      ]);
    })
  );
});

self.addEventListener("fetch", e => {
  // Versuche zuerst aus dem Cache zu antworten, ansonsten aus dem Netz
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});
