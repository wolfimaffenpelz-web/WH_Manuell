const CACHE_PREFIX = 'charakterbogen-cache-';
const CACHE_NAME = CACHE_PREFIX + 'v5';
const ASSETS = [
  "./",
  "./index.html",
  "./css/style-mobile.css",
  "./css/style-desktop.css",
  "./css/management.css",
  "./js/translations.js",
  "./js/sections.js",
  "./js/character-store.js",
  "./js/rules.js",
  "./js/logic.js",
  "./js/edition-ui.js",
  "./js/offline.js",
  "./manifest.json",
  "./img/ablaze.png",
  "./img/appicon.png",
  "./img/bleeding.png",
  "./img/blinded.png",
  "./img/broken.png",
  "./img/create_char.png",
  "./img/customizing.png",
  "./img/deafened.png",
  "./img/delete_char.png",
  "./img/entangled.png",
  "./img/exhausted.png",
  "./img/export_char.png",
  "./img/import_char.png",
  "./img/poisoned.png",
  "./img/prone.png",
  "./img/select_char.png",
  "./img/shield.svg",
  "./img/silhouette.svg",
  "./img/splash.png",
  "./img/state-bleeding.svg",
  "./img/state-blinded.svg",
  "./img/state-broken.svg",
  "./img/state-burning.svg",
  "./img/state-deafened.svg",
  "./img/state-entangled.svg",
  "./img/state-fatigued.svg",
  "./img/state-poisoned.svg",
  "./img/state-prone.svg",
  "./img/state-stunned.svg",
  "./img/state-surprised.svg",
  "./img/state-unconscious.svg",
  "./img/stunned.png",
  "./img/surpised.png",
  "./img/unconcious.png"
];

self.addEventListener('install', event => {
  // Keep updates waiting until the user has saved and confirmed in the app.
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)));
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME).map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET' || new URL(event.request.url).origin !== self.location.origin) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    // A version's application files stay together until an approved update.
    const cached = await cache.match(event.request);
    if (cached) return cached;
    const response = await fetch(event.request);
    if (response.ok) await cache.put(event.request, response.clone());
    return response;
  })());
});

self.addEventListener('message', event => {
  if (event.data?.type === 'SKIP_WAITING') self.skipWaiting();
});
