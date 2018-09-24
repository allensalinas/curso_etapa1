let restaurants,
    neighborhoods,
    cuisines
var map
var markers = []

/**
 * Fetch neighborhoods and cuisines as soon as the page is loaded.
 */
document.addEventListener('DOMContentLoaded', (event) => {
    fetchReviews();
    fetchNeighborhoods();
    fetchCuisines();
    // addEvent(window, 'online', online);
    // addEvent(window, 'offline', online);
    // updateRestaurants();
});

function online(event){
    console.log('Cambio de estado: ' + event.type);
    if (event.type == 'online') {
        DBHelper.sincroPendingReviews();
    }
}

/**
 * Fetch all neighborhoods and set their HTML.
 */
fetchNeighborhoods = () => {
    DBHelper.fetchNeighborhoods((error, neighborhoods) => {
        if (error) { // Got an error
            console.error(error);
        } else {
            self.neighborhoods = neighborhoods;
            fillNeighborhoodsHTML();
        }
    });
}

fetchReviews = () => {
    DBHelper.fetchReviews((error, reviews) => {
        if (error) { // Got an error
            console.error('Error en main.js fetchReviews: ' + error);
        } else {
            self.reviews = reviews;
            window.addEventListener('online', online);
            window.addEventListener('offline', online);
        }
    });
}

/**
 * Set neighborhoods HTML.
 */
fillNeighborhoodsHTML = (neighborhoods = self.neighborhoods) => {
    const select = document.getElementById('neighborhoods-select');
    neighborhoods.forEach(neighborhood => {
        const option = document.createElement('option');
        option.innerHTML = neighborhood;
        option.value = neighborhood;
        select.append(option);
    });
}

/**
 * Fetch all cuisines and set their HTML.
 */
fetchCuisines = () => {
    DBHelper.fetchCuisines((error, cuisines) => {
        if (error) { // Got an error!
            console.error(error);
        } else {
            self.cuisines = cuisines;
            fillCuisinesHTML();
        }
    });
}

/**
 * Set cuisines HTML.
 */
fillCuisinesHTML = (cuisines = self.cuisines) => {
    const select = document.getElementById('cuisines-select');

    cuisines.forEach(cuisine => {
        const option = document.createElement('option');
        option.innerHTML = cuisine;
        option.value = cuisine;
        select.append(option);
    });
}

/**
 * Initialize Google map, called from HTML.
 */
window.initMap =()=>{
    console.log('init map');
    let loc = {
        lat: 40.722216,
        lng: -73.987501
    };
    self.map = new google.maps.Map(document.getElementById('map'), {
        zoom: 12,
        center: loc,
        scrollwheel: false
    });
    updateRestaurants();
    // fillRestaurantsHTML();
    // addMarkersToMap();
}
// function initMap(){
//     let loc = {
//         lat: 40.722216,
//         lng: -73.987501
//     };
//     self.map = new google.maps.Map(document.getElementById('map'), {
//         zoom: 12,
//         center: loc,
//         scrollwheel: false
//     });
//     // fillRestaurantsHTML();
//     addMarkersToMap();
// }

/**
 * Update page and map for current restaurants.
 */
updateRestaurants = () => {
    const cSelect = document.getElementById('cuisines-select');
    const nSelect = document.getElementById('neighborhoods-select');

    const cIndex = cSelect.selectedIndex;
    const nIndex = nSelect.selectedIndex;

    const cuisine = cSelect[cIndex].value;
    const neighborhood = nSelect[nIndex].value;

    DBHelper.fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, (error, restaurants) => {
        if (error) { // Got an error!
            console.error(error);
        } else {
            resetRestaurants(restaurants);
            fillRestaurantsHTML(restaurants);
        }
    })
}

/**
 * Clear current restaurants, their HTML and remove their map markers.
 */
resetRestaurants = (restaurants) => {
    // Remove all restaurants
    self.restaurants = [];
    const ul = document.getElementById('restaurants-list');
    ul.innerHTML = '';

    // Remove all map markers
    self.markers.forEach(m => m.setMap(null));
    self.markers = [];
    self.restaurants = restaurants;
}

/**
 * Create all restaurants HTML and add them to the webpage.
 */
fillRestaurantsHTML = (restaurants) => {
    const ul = document.getElementById('restaurants-list');
    restaurants.forEach(restaurant => {
        ul.append(createRestaurantHTML(restaurant));
    });
    addMarkersToMap();
}

/**
 * Create restaurant HTML.
 */
createRestaurantHTML = (restaurant) => {
    const li = document.createElement('li');

    if (restaurant.photograph !== undefined) {
        const image = document.createElement('img');
        image.className = 'restaurant-img';
        image.src = DBHelper.imageUrlForRestaurant(restaurant);
        image.alt = restaurant.name;
        li.append(image);
    } else {
        console.log('El restaurante ' + restaurant.name + ' no tiene imagen');
    }

    const name = document.createElement('h2');
    name.innerHTML = restaurant.name;
    li.append(name);

    // if (!restaurant.is_favorite) {
    //     const favorito = document.createElement('button');
    //     favorito.className = 'favorite-star';
    //     favorito.innerText = '★';
    //     li.append(favorito);
    // }
    const favorito = document.createElement('button');
        favorito.className = 'favorite';
        if (restaurant.is_favorite){
            favorito.classList.add('favorite-star');
        }
        favorito.innerText = getFavoriteSymbol(restaurant.is_favorite);
        favorito.addEventListener('click', function(){
            console.log(restaurant.id);
            this.classList.toggle('favorite-star');
            this.innerText=getFavoriteSymbol(this.classList.contains('favorite-star'));
            restaurant.is_favorite = this.classList.contains('favorite-star');
            DBHelper.changeFavoriteStatus(restaurant, (error, resultado) => {
                if (error) { // Got an error!
                    console.error(error);
                    alert(error);
                } else {
                    if (!resultado) {
                        alert('We couldn`t update the restaurant preference');
                    }
                }
            })
        });
        li.append(favorito);

    const neighborhood = document.createElement('p');
    neighborhood.innerHTML = restaurant.neighborhood;
    li.append(neighborhood);

    const address = document.createElement('p');
    address.innerHTML = restaurant.address;
    li.append(address);

    const more = document.createElement('a');
    more.innerHTML = 'View Details';
    more.setAttribute('aria-label', 'View ' + restaurant.name + ' details');
    more.setAttribute('role', 'button');
    more.href = DBHelper.urlForRestaurant(restaurant);
    li.append(more);

    return li;
}

function getFavoriteSymbol(is_favorite){
    if(is_favorite){
        return "♥";
    }else{
        return "♡";
    }
}

/**
 * Add markers for current restaurants to the map.
 */
addMarkersToMap = (restaurants = self.restaurants) => {
    if (google) {
        restaurants.forEach(restaurant => {
            // Add marker to the map
            const marker = DBHelper.mapMarkerForRestaurant(restaurant, self.map);
            google.maps.event.addListener(marker, 'click', () => {
                window.location.href = marker.url
            });
            self.markers.push(marker);
        });
    } else {
        console.log('google no está definido');
    }
}