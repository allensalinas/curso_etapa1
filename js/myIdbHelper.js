// import idb from 'idb'

var dbPromise = idb.open('allenbd', 1, function(upgradeDb) {
    switch (upgradeDb.oldVersion) {
        case 0:
            var store = upgradeDb.createObjectStore('restaurants');
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