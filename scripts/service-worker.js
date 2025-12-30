// Service Worker for offline functionality
const CACHE_NAME = 'kohalpur-gpt-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/chat.html',
    '/complaint.html',
    '/emergency.html',
    '/directory.html',
    '/offline-faq.html',
    '/styles/main.css',
    '/styles/chat.css',
    '/styles/complaint.css',
    '/scripts/main.js',
    '/scripts/chat.js',
    '/scripts/complaint.js',
    '/kohalpur_faq_100.json'
];

// Install event
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

// Activate event
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Fetch event
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Cache hit - return response
                if (response) {
                    return response;
                }

                // Clone the request
                const fetchRequest = event.request.clone();

                return fetch(fetchRequest).then(response => {
                    // Check if valid response
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }

                    // Clone the response
                    const responseToCache = response.clone();

                    caches.open(CACHE_NAME)
                        .then(cache => {
                            cache.put(event.request, responseToCache);
                        });

                    return response;
                });
            }).catch(() => {
                // If both cache and network fail, show offline page
                if (event.request.url.includes('.html')) {
                    return caches.match('/offline-faq.html');
                }
            })
    );
});