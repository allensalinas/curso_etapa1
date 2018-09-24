// import idb from 'idb'

var dbPromise = idb.open('allenbd-entrega3', 1, function(upgradeDb) {
    switch (upgradeDb.oldVersion) {
        case 0:
            var store = upgradeDb.createObjectStore('restaurants');
            var reviews = upgradeDb.createObjectStore('reviews');
            break;
        default:
            break;
    }
});

function crearRestaurante(restaurante) {
    dbPromise.then(function(db) {
        var tx = db.transaction('restaurants', 'readwrite');
        var store = tx.objectStore('restaurants');
        store.put(restaurante, restaurante.id);
        return tx.complete;
    });
}

function crearReview(review) {
    console.log('creando review...' + review);
    dbPromise.then(function(db) {
        var tx = db.transaction('reviews', 'readwrite');
        var store = tx.objectStore('reviews');
        store.put(review, review.id);
        return tx.complete;
    });
}

function cargarRestaurantes() {
    return dbPromise.then(function(db) {
        var tx = db.transaction('restaurants');
        var store = tx.objectStore('restaurants');

        return store.getAll();
    }).then(function(restaurants) {
        // console.log('Esto es lo que encontré: ' + restaurants);
        return restaurants;
    });
}

function cargarReviews() {
    return dbPromise.then(function(db) {
        var tx = db.transaction('reviews');
        var store = tx.objectStore('reviews');

        return store.getAll();
    }).then(function(reviews) {
        // console.log('Esto es lo que encontré: ' + restaurants);
        return reviews;
    });
}