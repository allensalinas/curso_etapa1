let restaurant;
var map;

document.addEventListener('DOMContentLoaded', (event) => {
    btnPostReview.addEventListener('click', postReview);
});

function getFavoriteSymbol(is_favorite) {
    if (is_favorite) {
        return "♥";
    } else {
        return "♡";
    }
}

/**
 * Initialize Google map, called from HTML.
 */
window.initMap = () => {
    fetchRestaurantFromURL((error, restaurant) => {
        if (error) { // Got an error!
            console.error(error);
        } else {
            self.map = new google.maps.Map(document.getElementById('map'), {
                zoom: 16,
                center: restaurant.latlng,
                scrollwheel: false
            });
            fillBreadcrumb();
            DBHelper.mapMarkerForRestaurant(self.restaurant, self.map);
        }
    });
}

postReview = function () {
    console.log('postreview...' + new Date().toDateString());
    let comment = document.getElementById('input-review').value;
    let username = document.getElementById('input-username').value;
    if (comment === '') {
        alert('please give us some comment...');
        return;
    }
    if (username==='') {
        username = 'Anonymous';
    }
    let newReview = {
        id: new Date().getTime(),
        restaurant_id: self.restaurant.id,
        name: username,
        createdAt: 0,
        rating: document.getElementById('list-rating').value,
        updatedAt: 0,
        comments: comment
    };
    DBHelper.postReview(newReview, (error, respuesta) => {
        if (!respuesta) {
            console.log('no se pudo obtener una respuesta exitosa');
            alert(error);
            return;
        }
        getReviews();
        // if (respuesta.status == 201) { //Creado

        // }
    }
    )
    // crearReview(newReview);
}

/**
 * Get current restaurant from page URL.
 */
fetchRestaurantFromURL = (callback) => {
    if (self.restaurant) { // restaurant already fetched!
        callback(null, self.restaurant)
        return;
    }
    const id = getParameterByName('id');
    if (!id) { // no id found in URL
        error = 'No restaurant id in URL'
        callback(error, null);
    } else {
        DBHelper.fetchRestaurantById(id, (error, restaurant) => {
            self.restaurant = restaurant;
            if (!restaurant) {
                console.log('No encontré el restaurante: ' + error);
                // console.error(error);
                return;
            }
            fillRestaurantHTML();
            getReviews();
            callback(null, restaurant)
        });
    }
}

function getReviews() {
    DBHelper.fetchReviewsByRestaurant(self.restaurant.id, (error, reviews) => {
        self.restaurant.reviews = reviews;
        fillReviewsHTML();
    }
    );
}

/**
 * Create restaurant HTML and add it to the webpage
 */
fillRestaurantHTML = (restaurant = self.restaurant) => {
    const name = document.getElementById('restaurant-name');
    name.innerHTML = restaurant.name;

    const address = document.getElementById('restaurant-address');
    address.innerHTML = restaurant.address;

    const image = document.getElementById('restaurant-img');
    image.className = 'restaurant-img';
    image.src = DBHelper.imageUrlForRestaurant(restaurant);
    image.alt = "Picture of " + restaurant.name;

    const cuisine = document.getElementById('restaurant-cuisine');
    cuisine.innerHTML = restaurant.cuisine_type;

    // fill operating hours
    if (restaurant.operating_hours) {
        fillRestaurantHoursHTML();
    }
    // fill reviews
    // fillReviewsHTML();
    btnFavorite.innerText = getFavoriteSymbol(restaurant.is_favorite);
    if (restaurant.is_favorite) {
        btnFavorite.classList.add('favorite-star');
    }
    
    btnFavorite.addEventListener('click', function () {
        var nr = self.restaurant;
        console.log('Event listener on: ' + nr.id);
        this.classList.toggle('favorite-star');
        this.innerText = getFavoriteSymbol(this.classList.contains('favorite-star'));
        nr.is_favorite = this.classList.contains('favorite-star');
        DBHelper.changeFavoriteStatus(nr, (error, resultado) => {
            if (error) { // Got an error!
                console.error(error);
                // alert(error);
            } else {
                if (!resultado) {
                    alert('We couldn`t update the restaurant preference');
                }
            }
        })
    });
}

/**
 * Create restaurant operating hours HTML table and add it to the webpage.
 */
fillRestaurantHoursHTML = (operatingHours = self.restaurant.operating_hours) => {
    const hours = document.getElementById('restaurant-hours');
    for (let key in operatingHours) {
        const row = document.createElement('tr');

        const day = document.createElement('td');
        day.innerHTML = key;
        row.appendChild(day);

        const time = document.createElement('td');
        time.innerHTML = operatingHours[key];
        row.appendChild(time);

        hours.appendChild(row);
    }
}

/**
 * Create all reviews HTML and add them to the webpage.
 */
fillReviewsHTML = (reviews = self.restaurant.reviews) => {
    const container = document.getElementById('reviews-container');
    // const title = document.createElement('h3');
    // title.innerHTML = 'Reviews';
    // container.appendChild(title);

    if (!reviews) {
        const noReviews = document.createElement('p');
        noReviews.innerHTML = 'No reviews yet!';
        container.appendChild(noReviews);
        return;
    }
    const ul = document.getElementById('reviews-list');
    reviews.forEach(review => {
        ul.appendChild(createReviewHTML(review));
    });
    container.appendChild(ul);
}

/**
 * Create review HTML and add it to the webpage.
 */
createReviewHTML = (review) => {
    const li = document.createElement('li');
    const name = document.createElement('p');
    name.innerHTML = review.name;
    li.appendChild(name);

    const date = document.createElement('p');
    date.innerHTML = new Date(review.createdAt).toDateString();
    li.appendChild(date);

    const rating = document.createElement('p');
    rating.innerHTML = `Rating: ${review.rating}`;
    li.appendChild(rating);

    const comments = document.createElement('p');
    comments.innerHTML = review.comments;
    li.appendChild(comments);

    if (review.pending === 'true') {
        const small = document.createElement('small');
        small.innerText = "Pending to synchronize";
        li.appendChild(small);
    }

    return li;
}

/**
 * Add restaurant name to the breadcrumb navigation menu
 */
fillBreadcrumb = (restaurant = self.restaurant) => {
    // const breadcrumb = document.getElementById('breadcrumb');
    // const li = document.createElement('li');
    // li.innerHTML = restaurant.name;
    // breadcrumb.appendChild(li);
}

/**
 * Get a parameter by name from page URL.
 */
getParameterByName = (name, url) => {
    if (!url)
        url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`),
        results = regex.exec(url);
    if (!results)
        return null;
    if (!results[2])
        return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}