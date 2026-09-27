const CACHE_NAME = 'aura-estetik-v2';
const STATIC_ASSETS = [
  '/manifest.json',
  '/gemini-svg.svg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => caches.delete(cache))
      );
    }).then(() => self.clients.claim())
  );
});

// Network-First for page requests and JS bundles, Cache-Only fallback for static icons
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  
  const url = new URL(event.request.url);

  // Never intercept or cache Next.js internal static chunks, webpack, or dev server requests
  if (url.pathname.startsWith('/_next/') || url.pathname.includes('webpack')) {
    return;
  }

  // For static icons & manifest, try cache first then network
  if (STATIC_ASSETS.includes(url.pathname)) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        return cached || fetch(event.request);
      })
    );
    return;
  }

  // Network first for HTML pages and all other assets
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        return response;
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});

