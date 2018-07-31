<<<<<<< HEAD
var staticCacheName = 'allen-cache-v1';
=======
var staticCacheName = 'allen-anothercache-v65d';
>>>>>>> b8384da40d9daa6d917e1044e36a8875f8e111c4

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
                '/js/swcontroller.js',
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

self.addEventListener('fetch', function(event) {
    console.log('Peticiòn: ' + event.request.url);
<<<<<<< HEAD
    if (event.request.url.indexOf('maps')!=-1) {
        event.respondWith(fetch(event.request).then(function(response){
            return response;
        }));
    }else{
        event.respondWith(caches.match(event.request).then(function (response) {
        // caches.match() always resolves
        // but in case of success response will have value
        if (response !== undefined) {
            console.log('Encontrado en el cache ' + event.request.url);
            return response;
        } else {
            console.log(`NO cache. Tratando de obtener el recurso de la red: ${event.request.url}`);
            return fetch(event.request).then(function (response) {
            // response may be used only once
            // we need to save clone to put one copy in cache
            // and serve second one
            if (response == undefined){
                console.log('Fetch llegó undefined');
            }
            if (response == undefined && response.status === 404) {
                console.log('No se encontró en la red');
                return caches.match('/offline.jpg');
            } else {
                // let responseClone = response.clone();
    
                // caches.open(cacheName).then(function (cache) {
                //   cache.put(event.request, responseClone);
                // });
                return response;
            }
            }).catch(function () {
            console.log(`Error cargando la petición: ${event.request.url}`);
            return caches.match('/offline.jpg');
            });
        }
        })
        .catch(function (e){
            var resultadoError = {
                descripcion: e.toString()
            };     
            return new Response(JSON.stringify(resultadoError), {
                headers: {'Content-Type': 'application/json'}
            });
        }));
    }
}
);
=======
    if (event.request.url.indexOf('maps.googleapis.com') != -1) {
        event.respondWith(caches.match(event.request).then(function(response) {
            // caches.match() always resolves
            // but in case of success response will have value
            if (response !== undefined) {
                console.log('Encontrado en el cache ' + event.request.url);
                return response;
            } else {
                console.log('NO Encontrado en el cache. Tratando de obtener el recurso de la red');
                return fetch(event.request).then(function(response) {
                    // response may be used only once
                    // we need to save clone to put one copy in cache
                    // and serve second one
                    if (response.status === 404) {
                        console.log('No se encontró en la red');
                        return caches.match('/offline.jpg');
                    } else {
                        if (event.request.url.indexOf('maps.googleapis.com') == -1) {
                            console.log('No es google maps');
                            let responseClone = response.clone();

                            caches.open(cacheName).then(function(cache) {
                                cache.put(event.request, responseClone);
                            });
                        }
                        return response;
                    }
                }).catch(function() {
                    console.log('Error cargando el recurso: ' + event.request.url);
                    return caches.match('/offline.jpg').then(function(response) {
                        return response;
                    });
                });
            }
        }));
    } else {
        return fetch(event.request).then(function(event) {
            return response;
        });
    }
});
>>>>>>> b8384da40d9daa6d917e1044e36a8875f8e111c4
