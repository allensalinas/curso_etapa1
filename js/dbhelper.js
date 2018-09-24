/**
 * Common database helper functions.
 */
class DBHelper {

    /**
     * Database URL.
     * Change this to restaurants.json file location on your server.
     */
    static get DATABASE_URL() {
        const port = 1337 // Change this to your server port
        //return `http://127.0.0.1:${port}/data/restaurants.json`;
        return `http://localhost:${port}/restaurants`;
    }

    static get RESTAURANT_REVIEW_URL() {
        const port = 1337 // Change this to your server port
        //return `http://127.0.0.1:${port}/data/restaurants.json`;
        return `http://localhost:${port}/reviews`;
    }

    static getChangeFavoriteURL(restaurant_id, is_favorite){
        const port = 1337;
        return `http://localhost:${port}/restaurants/${restaurant_id}/?is_favorite=${is_favorite}`;
    }

    // static get POST_REVIEW_URL(){
    //     const port = 1337 // Change this to your server port
    //     //return `http://127.0.0.1:${port}/data/restaurants.json`;
    //     return `http://localhost:${port}/reviews`;
    // }

    /**
     * Fetch all restaurants.
     */
    static fetchRestaurants(callback) {
        //1ro: Verifico que no estén guardados en la bd
        cargarRestaurantes().then(function (restaurantesGuardados) {
            if (restaurantesGuardados.length > 0) {
                console.log('Ya están registrados, por lo tanto no necesito consultarlos en la bd');
                callback(null, restaurantesGuardados);
            } else {
                let respuesta = fetch(DBHelper.DATABASE_URL)
                    .then(function (response) {
                        return response.json();
                    })
                    .then(function (respuestaJson) {
                        console.log(respuestaJson);
                        respuestaJson.forEach(element => {
                            console.log('Creando restaurante en la bd...' + element.id);
                            crearRestaurante(element);
                        });
                        callback(null, respuestaJson);
                    });
            }
        });
    }

    /**
 * Fetch all restaurants.
 */
    static fetchReviews(callback) {
        //1ro: Verifico que no estén guardados en la bd
        cargarReviews().then(function (reviewsGuardados) {
            if (reviewsGuardados.length > 0) {
                console.log('Ya están registrados, por lo tanto no necesito consultarlos en la bd');
                callback(null, reviewsGuardados);
            } else {
                let respuesta = fetch(DBHelper.RESTAURANT_REVIEW_URL)
                    .then(function (response) {
                        return response.json();
                    })
                    .then(function (respuestaJson) {
                        console.log(respuestaJson);
                        respuestaJson.forEach(element => {
                            console.log('Creando review en la bd...' + element.id);
                            crearReview(element);
                        });
                        callback(null, respuestaJson);
                    });
            }
        });
    }

    /**
     * Fetch a restaurant by its ID.
     */
    static fetchRestaurantById(id, callback) {
        // fetch all restaurants with proper error handling.
        DBHelper.fetchRestaurants((error, restaurants) => {
            if (error) {
                console.log('error consultando el restaurante');
                callback(error, null);
            } else {
                const restaurant = restaurants.find(r => r.id == id);
                if (restaurant) { // Got the restaurant
                    // DBHelper.fetchReviewsByRestaurant((errorrvs, reviews)=>{
                    //     if (errorrvs) {
                    //         callback(errorrvs, null);
                    //     }else
                    //     {
                    //         restaurant.reviews = reviews;
                    //     }
                    // })
                    callback(null, restaurant);
                } else { // Restaurant does not exist in the database
                    callback('Restaurant does not exist', null);
                }
            }
        });
    }

    /**
     * Fetch restaurants by a cuisine type with proper error handling.
     */
    static fetchRestaurantByCuisine(cuisine, callback) {
        // Fetch all restaurants  with proper error handling
        DBHelper.fetchRestaurants((error, restaurants) => {
            if (error) {
                callback(error, null);
            } else {
                // Filter restaurants to have only given cuisine type
                const results = restaurants.filter(r => r.cuisine_type == cuisine);
                callback(null, results);
            }
        });
    }

    /**
     * Fetch restaurants by a neighborhood with proper error handling.
     */
    static fetchRestaurantByNeighborhood(neighborhood, callback) {
        // Fetch all restaurants
        DBHelper.fetchRestaurants((error, restaurants) => {
            if (error) {
                callback(error, null);
            } else {
                // Filter restaurants to have only given neighborhood
                const results = restaurants.filter(r => r.neighborhood == neighborhood);
                callback(null, results);
            }
        });
    }

    /**
     * Fetch restaurants by a cuisine and a neighborhood with proper error handling.
     */
    static fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, callback) {
        // Fetch all restaurants
        DBHelper.fetchRestaurants((error, restaurants) => {
            if (error) {
                callback(error, null);
            } else {
                let results = restaurants
                if (cuisine != 'all') { // filter by cuisine
                    results = results.filter(r => r.cuisine_type == cuisine);
                }
                if (neighborhood != 'all') { // filter by neighborhood
                    results = results.filter(r => r.neighborhood == neighborhood);
                }
                callback(null, results);
            }
        });
    }

    /**
     * Fetch all neighborhoods with proper error handling.
     */
    static fetchNeighborhoods(callback) {
        // Fetch all restaurants
        DBHelper.fetchRestaurants((error, restaurants) => {
            if (error) {
                callback(error, null);
            } else {
                // Get all neighborhoods from all restaurants
                const neighborhoods = restaurants.map((v, i) => restaurants[i].neighborhood)
                // Remove duplicates from neighborhoods
                const uniqueNeighborhoods = neighborhoods.filter((v, i) => neighborhoods.indexOf(v) == i)
                callback(null, uniqueNeighborhoods);
            }
        });
    }

    /**
     * Fetch all cuisines with proper error handling.
     */
    static fetchCuisines(callback) {
        // Fetch all restaurants
        DBHelper.fetchRestaurants((error, restaurants) => {
            if (error) {
                callback(error, null);
            } else {
                // Get all cuisines from all restaurants
                const cuisines = restaurants.map((v, i) => restaurants[i].cuisine_type)
                // Remove duplicates from cuisines
                const uniqueCuisines = cuisines.filter((v, i) => cuisines.indexOf(v) == i)
                callback(null, uniqueCuisines);
            }
        });
    }

    static fetchReviewsByRestaurant(restaurant_id, callback) {
        // fetch all restaurants with proper error handling.
        DBHelper.fetchReviews((error, reviews) => {
            if (error) {
                console.log('error consultando las reviews del restaurante: ' + restaurant_id);
                callback(error, null);
            } else {
                // const result = reviews.find() .find(r => r.id == id);
                const result = reviews.filter(r => r.restaurant_id == restaurant_id);
                if (result) { // Got the reviews
                    callback(null, result);
                } else { // Restaurant does not exist in the database
                    callback('No se encontraron reviews', null);
                }
            }
        });
    }

    static postReview(review, callback) {
        fetch(this.RESTAURANT_REVIEW_URL, {
            method: 'post',
            body: {
                "restaurant_id": review.restaurant_id,
                "name": review.name,
                "rating": review.rating,
                "comments": review.comments
            }
            //body: JSON.stringify(review)
        }).then(function (response) {
            if (response.statusText== "Created") { //Creado
                return true;
                // callback(null, 'OK');
            } else {
                // review.pending = true;
                return false;
            }
            // console.log('respuesta del servidor: ' + response.json());            
        }).then(function (sincronizado) {
            review.createdAt = review.id;
            if (!sincronizado) {
                review.pending = true;
            }
            crearReview(review);
            callback(null, review);
        })
        .catch(function (errorResponse) {
            let error = 'Error ejecutando la petición: ' + errorResponse;
            console.log(error);
            callback(error, null);
        })
    }

    static changeFavoriteStatus(restaurant, callback) {
        fetch(this.getChangeFavoriteURL(restaurant.id, restaurant.is_favorite), {
            method: 'put'
        }).then(function (response) {
            if (response.ok) { //Creado
                callback(null, true);
                // return true;
                // callback(null, 'OK');
            } else {
                // review.pending = true;
                // return false;
                callback(null, false);
            }
            // console.log('respuesta del servidor: ' + response.json());
        })
        // .then(function (actualizadoServicio) {
        //     restaurant.is.createdAt = review.id;
        //     if (!sincronizado) {
        //         review.pending = true;
        //     }
        //     crearReview(review);
        //     callback(null, review);
        // })
        .catch(function (errorResponse) {
            let error = 'Error ejecutando la petición: ' + errorResponse;
            console.log(error);
            callback(error, null);
        })
    }

    /**
     * Restaurant page URL.
     */
    static urlForRestaurant(restaurant) {
        return (`./restaurant.html?id=${restaurant.id}`);
    }

    /**
     * Restaurant image URL.
     */
    static imageUrlForRestaurant(restaurant) {
        if (restaurant === undefined) {
            return null;
        }
        return (`img/${restaurant.photograph}.jpg`);
    }

    /**
     * Map marker for a restaurant.
     */
    static mapMarkerForRestaurant(restaurant, map) {
        if (google) {

            const marker = new google.maps.Marker({
                position: restaurant.latlng,
                title: restaurant.name,
                url: DBHelper.urlForRestaurant(restaurant),
                map: map,
                animation: google.maps.Animation.DROP
            });
            return marker;
        } else {
            return null;
        }
    }
}