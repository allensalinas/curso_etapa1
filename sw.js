var staticCacheName = 'allen-entrega3-v3';

console.log('archivo SW');

self.addEventListener('install', function (event) {
    // TODO: cache /skeleton rather than the root page
    console.log('Instalando el sw: ' + new Date());

    event.waitUntil(
        caches.open(staticCacheName).then(function (cache) {
            return cache.addAll([
                './',
                './index.html',
                './js/swcontroller-min.js',
                './js/dbhelper-min.js',
                './js/main-min.js',
                './js/restaurant_info-min.js',
                './js/idb-min.js',
                './js/myIdbHelper-min.js',
                './css/all.min.css',
                './img/1.jpg',
                './img/2.jpg',
                './img/3.jpg',
                './img/4.jpg',
                './img/5.jpg',
                './img/6.jpg',
                './img/7.jpg',
                './img/8.jpg',
                './img/9.jpg',
                './img/10.jpg',
                './sw.js',
                './restaurant.html',
                './offline.jpg',
                './manifest.json'
            ]);
        }).catch(function (reason) { 'Error in install event: ' + console.log(reason); })
    );
});

self.addEventListener('activate', function (event) {
    console.log('evento activate ' + new Date());
    event.waitUntil(
        caches.keys().then(function (cacheNames) {
            return Promise.all(
                cacheNames.filter(function (cacheName) {
                    return cacheName.startsWith('allen-') &&
                        cacheName != staticCacheName;
                }).map(function (cacheName) {
                    console.log('deleting old cache');
                    return caches.delete(cacheName);
                })
            );
        })
    );
});

self.addEventListener('fetch', function (event) {
    // if (event.request.url.indexOf('restaurant.html')!=-1) {
    //     return caches.match('restaurant.html');
    // }else
    // {
    if (event.request.url.indexOf('google') != -1) {
        return;
        // event.respondWith(fetch(event.request)
        //     .then(
        //         function(response){return response;}
        //     )
        //     .catch(function(){
        //         return new Response()
        //         //return new Response('Hello from your friendly neighbourhood service worker!');
        //         // return Response('ups');
        //         }
        //     )
        // );
    } else {
        event.respondWith(
            caches.match(event.request, { ignoreSearch: true }).then(function (response) {
                if (response !== undefined) {
                    // if (event.request.url.indexOf('restaurant.html')) {
                    //     response.url = event.request.url;
                    // }
                    return response;
                } else {
                    return fetch(event.request).then(
                        function name(response) {
                            if (response.ok) {
                                console.log('Response ok');
                            } else {
                                console.log('Response false');
                            }
                            return response;
                        }
                    ).catch(function () {
                        return caches.match('offline.jpg');
                    });
                }
            }));
    }
});

// self.addEventListener('fetch', function(event) {
//     // console.log('Peticiòn: ' + event.request.url);
//     if ((event.request.url.indexOf('maps') != -1) || event.request.url.indexOf('normalize.css') != -1) {
//         event.respondWith(fetch(event.request).then(function(response) {
//             return response;
//         }).catch(function(error) {
//             return caches.match('offline.jpg');
//         }));
//     } else {
//         if (event.request.url.indexOf('restaurant.html') != -1) {
//             console.log('**** Voy a buscar restaurant.html en el cache')
//             event.respondWith(caches.match('restaurant.html').then(function name(response) {
//                 if (response !== undefined) {
//                     console.log('**** restaurant.html encontrado');
//                     return response;
//                 } else {
//                     console.log('**** restaurant.html NO encontrado');
//                     return fetch(event.request).then(function(response) {
//                         return response;
//                     })
//                 }
//             }));
//         } else {
//             event.respondWith(caches.match(event.request).then(function(response) {
//                     if (response !== undefined) {
//                         // console.log('Encontrado en el cache ' + event.request.url);
//                         return response;
//                     } else {
//                         // console.log(`NO cache. Tratando de obtener el recurso de la red: ${event.request.url}`);
//                         return fetch(event.request).then(function(response) {
//                             if (response == undefined) {
//                                 console.log('Fetch llegó undefined');
//                             }
//                             if (response == undefined && response.status === 404) {
//                                 console.log('No se encontró en la red');
//                                 return caches.match('offline.jpg');
//                             } else {
//                                 // let responseClone = response.clone();

//                                 // caches.open(cacheName).then(function (cache) {
//                                 //   cache.put(event.request, responseClone);
//                                 // });
//                                 return response;
//                             }
//                         }).catch(function() {
//                             console.log(`Error cargando la petición: ${event.request.url}`);
//                             return caches.match('offline.jpg');
//                         });
//                     }
//                 })
//                 .catch(function(e) {
//                     var resultadoError = {
//                         descripcion: e.toString()
//                     };
//                     return new Response(JSON.stringify(resultadoError), {
//                         headers: { 'Content-Type': 'application/json' }
//                     });
//                 }));
//         }
//     }
// });