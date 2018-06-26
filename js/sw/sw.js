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
                '/css/styles.css'
            ]);
        }).catch(function(reason) { 'Error in install event: ' + console.log(reason); })
    );
});

self.addEventListener('activate', function(event) {
    console.log('evento activate');
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
    console.log('Evento fetch');
    // var requestUrl = new URL(event.request.url);
    // if (requestUrl.origin === location.origin) {
    //     if (requestUrl.pathname === '/') {
    //         event.respondWith(caches.match('/offline.html'));
    //         return;
    //     }
    // }

    // if (event.request.mode === 'navigate' ||
    //     (event.request.method === 'GET' &&
    //         event.request.headers.get('accept').includes('text/html'))) {
    //     console.log('Handling fetch event for', event.request.url);
    //     event.respondWith(
    //         fetch(event.request).catch(error => {
    //             // The catch is only triggered if fetch() throws an exception, which will most likely
    //             // happen due to the server being unreachable.
    //             // If fetch() returns a valid HTTP response with an response code in the 4xx or 5xx
    //             // range, the catch() will NOT be called. If you need custom handling for 4xx or 5xx
    //             // errors, see https://github.com/GoogleChrome/samples/tree/gh-pages/service-worker/fallback-response
    //             console.log('Fetch failed; returning offline page instead.', error);
    //             // return caches.match('/offline.html');
    //         })
    //     );
    // }

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