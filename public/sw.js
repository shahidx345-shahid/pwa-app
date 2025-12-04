const CACHE_NAME = 'appflow-v1';

// Install event - skip waiting
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  self.skipWaiting();
});

// Activate event - claim clients
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  // Don't cache non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Don't cache chrome-extension or other non-http(s) requests
  if (!event.request.url.startsWith('http://') && !event.request.url.startsWith('https://')) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Only cache successful responses
        if (response && response.status === 200 && response.type === 'basic') {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache).catch((error) => {
              console.warn('Cache put failed:', error);
            });
          });
        }
        return response;
      })
      .catch(() => {
        // Return cached response if offline
        return caches.match(event.request).then((cachedResponse) => {
          return cachedResponse || new Response('Offline - content not available', { status: 503 });
        });
      })
  );
});


