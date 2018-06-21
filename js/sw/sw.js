var staticCacheName = 'allen-restaurant-v3';
console.log('archivo SW');
self.addEventListener('install', function(event) {
    // TODO: cache /skeleton rather than the root page
    console.log('installing sw');
    event.waitUntil(
        caches.open(staticCacheName).then(function(cache) {
            return cache.addAll([
                '/',
                '/js/dbhelper.js',
                '/js/main.js',
                '/js/restaurant_info.js',
                '/css/styles.css',
            ]);
        }).catch(function(reason) { 'Error in install event: ' + console.log(reason); })
    );
});

self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.filter(function(cacheName) {
                    return cacheName.startsWith('allen-') &&
                        cacheName != staticCacheName;
                }).map(function(cacheName) {
                    console.log('deleting old cache');
                    return caches.delete(cacheName);
                })
            );
        })
    );
});

self.addEventListener('fetch', function(event) {
    // TODO: respond to requests for the root page with
    // the page skeleton from the cache

    event.respondWith(
        caches.match(event.request).then(function(response) {
            return response || fetch(event.request);
        })
    );
});

// self.addEventListener('message', function(event) {
//     if (event.data.action === 'skipWaiting') {
//         self.skipWaiting();
//     }
// });