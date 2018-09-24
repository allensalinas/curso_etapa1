// import idb from 'idb'

var dbPromise = idb.open('allenbd-entrega3-sinc1', 2, function(upgradeDb) {
    switch (upgradeDb.oldVersion) {
        case 0:
            var store = upgradeDb.createObjectStore('restaurants');
            var reviews = upgradeDb.createObjectStore('reviews');
        case 1:
            var reviewStore = upgradeDb.transaction.objectStore('reviews');
            reviewStore.createIndex('pending', 'pending');
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

function cargarReviewsPendientes(){
    return dbPromise.then(function(db) {
        var tx = db.transaction('reviews');
        var store = tx.objectStore('reviews');
        var pendingIndex = store.index('pending');
      
        return pendingIndex.getAll('true');
      }).then(function(reviews) {
        console.log('Reviews pendientes:', reviews);
        return reviews;
      });
}

function updatePendingReview(review){
    console.log('tratando de actualizar el review: ' + review.id);
    dbPromise.then(function(db) {
        var tx = db.transaction('reviews', 'readwrite');
        var store = tx.objectStore('reviews');
        // var item = {
        //   name: 'sandwich',
        //   price: 99.99,
        //   description: 'A very tasty, but quite expensive, sandwich',
        //   created: new Date().getTime()
        // };
        store.put(review, review.id);
        return tx.complete;
      }).then(function() {
        console.log('item updated!');
      });      
}