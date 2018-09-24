let restaurant;var map;function getFavoriteSymbol(e){return e?"♥":"♡"}function getReviews(){DBHelper.fetchReviewsByRestaurant(self.restaurant.id,(e,t)=>{self.restaurant.reviews=t,fillReviewsHTML()})}document.addEventListener("DOMContentLoaded",e=>{btnPostReview.addEventListener("click",postReview)}),window.initMap=(()=>{fetchRestaurantFromURL((e,t)=>{e?console.error(e):(self.map=new google.maps.Map(document.getElementById("map"),{zoom:16,center:t.latlng,scrollwheel:!1}),fillBreadcrumb(),DBHelper.mapMarkerForRestaurant(self.restaurant,self.map))})}),postReview=function(){console.log("postreview..."+(new Date).toDateString());let e=document.getElementById("input-review").value,t=document.getElementById("input-username").value;if(""===e)return void alert("please give us some comment...");""===t&&(t="Anonymous");let n={id:(new Date).getTime(),restaurant_id:self.restaurant.id,name:t,createdAt:0,rating:document.getElementById("list-rating").value,updatedAt:0,comments:e};DBHelper.postReview(n,(e,t)=>{if(!t)return console.log("no se pudo obtener una respuesta exitosa"),void alert(e);getReviews()})},fetchRestaurantFromURL=(e=>{if(self.restaurant)return void e(null,self.restaurant);const t=getParameterByName("id");t?DBHelper.fetchRestaurantById(t,(t,n)=>{self.restaurant=n,n?(fillRestaurantHTML(),getReviews(),e(null,n)):console.log("No encontré el restaurante: "+t)}):(error="No restaurant id in URL",e(error,null))}),fillRestaurantHTML=((e=self.restaurant)=>{document.getElementById("restaurant-name").innerHTML=e.name,document.getElementById("restaurant-address").innerHTML=e.address;const t=document.getElementById("restaurant-img");t.className="restaurant-img",t.src=DBHelper.imageUrlForRestaurant(e),t.alt="Picture of "+e.name,document.getElementById("restaurant-cuisine").innerHTML=e.cuisine_type,e.operating_hours&&fillRestaurantHoursHTML(),btnFavorite.innerText=getFavoriteSymbol(e.is_favorite),e.is_favorite&&btnFavorite.classList.add("favorite-star"),btnFavorite.addEventListener("click",function(){var e=self.restaurant;console.log("Event listener on: "+e.id),this.classList.toggle("favorite-star"),this.innerText=getFavoriteSymbol(this.classList.contains("favorite-star")),e.is_favorite=this.classList.contains("favorite-star"),DBHelper.changeFavoriteStatus(e,(e,t)=>{e?console.error(e):t||alert("We couldn`t update the restaurant preference")})})}),fillRestaurantHoursHTML=((e=self.restaurant.operating_hours)=>{const t=document.getElementById("restaurant-hours");for(let n in e){const r=document.createElement("tr"),a=document.createElement("td");a.innerHTML=n,r.appendChild(a);const s=document.createElement("td");s.innerHTML=e[n],r.appendChild(s),t.appendChild(r)}}),fillReviewsHTML=((e=self.restaurant.reviews)=>{const t=document.getElementById("reviews-container");if(!e){const e=document.createElement("p");return e.innerHTML="No reviews yet!",void t.appendChild(e)}const n=document.getElementById("reviews-list");e.forEach(e=>{n.appendChild(createReviewHTML(e))}),t.appendChild(n)}),createReviewHTML=(e=>{const t=document.createElement("li"),n=document.createElement("p");n.innerHTML=e.name,t.appendChild(n);const r=document.createElement("p");r.innerHTML=new Date(e.createdAt).toDateString(),t.appendChild(r);const a=document.createElement("p");a.innerHTML=`Rating: ${e.rating}`,t.appendChild(a);const s=document.createElement("p");if(s.innerHTML=e.comments,t.appendChild(s),"true"===e.pending){const e=document.createElement("small");e.innerText="Pending to synchronize",t.appendChild(e)}return t}),fillBreadcrumb=((e=self.restaurant)=>{}),getParameterByName=((e,t)=>{t||(t=window.location.href),e=e.replace(/[\[\]]/g,"\\$&");const n=new RegExp(`[?&]${e}(=([^&#]*)|&|#|$)`).exec(t);return n?n[2]?decodeURIComponent(n[2].replace(/\+/g," ")):"":null});