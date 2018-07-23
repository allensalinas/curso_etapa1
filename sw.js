var staticCacheName = 'allen-anothercache-v4';

console.log('archivo SW');

self.addEventListener('install', function(event) {
    // TODO: cache /skeleton rather than the root page
    console.log('Instalando el sw: ' + new Date());
    
    event.waitUntil(
        caches.open(staticCacheName).then(function(cache) {
            return cache.addAll([
                '/',
                '/index.html',
                '/data/restaurants.json',
                '/js/dbhelper.js',
                '/js/main.js',
                '/js/restaurant_info.js',
                '/css/styles.css',
                '/img/1.jpg',
                '/img/2.jpg',
                '/img/3.jpg',
                '/img/4.jpg',
                '/img/5.jpg',
                '/img/6.jpg',
                '/img/7.jpg',
                '/img/8.jpg',
                '/img/9.jpg',
                '/img/10.jpg',
                '/sw.js',
                '/restaurant.html',
                '/offline.html'
            ]);
        }).catch(function(reason) { 'Error in install event: ' + console.log(reason); })
    );
});

self.addEventListener('activate', function(event) {
    console.log('evento activate ' + new Date());
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

self.addEventListener('fetch', function (event) {
    console.log('Peticiòn: ' + event.request.url);
    event.respondWith(caches.match(event.request).then(function (response) {
      // caches.match() always resolves
      // but in case of success response will have value
      if (response !== undefined) {
        console.log('Encontrado en el cache ' + event.request.url);
        return response;
      } else {
        console.log('NO Encontrado en el cache. Tratando de obtener el recurso de la red');
        return fetch(event.request).then(function (response) {
          // response may be used only once
          // we need to save clone to put one copy in cache
          // and serve second one
          if (response.status === 404) {
            console.log('No se encontró en la red');
            return caches.match('/offline.jpg');
          } else {
            let responseClone = response.clone();
  
            caches.open(cacheName).then(function (cache) {
              cache.put(event.request, responseClone);
            });
            return response;
          }
        }).catch(function () {
          console.log('Error cargando ' + event.request);
          return caches.match('/offline.jpg');
        });
      }
    }));
  });