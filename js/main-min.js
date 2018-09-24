let restaurants,neighborhoods,cuisines;var map,markers=[];function online(e){console.log("Cambio de estado: "+e.type);var t=document.getElementById("snackbar");t.className="show",t.innerText=e.type,setTimeout(function(){t.className=t.className.replace("show","")},3e3),"online"==e.type&&(DBHelper.sincroPendingReviews(),DBHelper.sincroPendingFavorite())}function getFavoriteSymbol(e){return e?"♥":"♡"}document.addEventListener("DOMContentLoaded",e=>{fetchReviews(),fetchNeighborhoods(),fetchCuisines(),updateRestaurants()}),fetchNeighborhoods=(()=>{DBHelper.fetchNeighborhoods((e,t)=>{e?console.error(e):(self.neighborhoods=t,fillNeighborhoodsHTML())})}),fetchReviews=(()=>{DBHelper.fetchReviews((e,t)=>{e?console.error("Error en main.js fetchReviews: "+e):(self.reviews=t,window.addEventListener("online",online),window.addEventListener("offline",online))})}),fillNeighborhoodsHTML=((e=self.neighborhoods)=>{const t=document.getElementById("neighborhoods-select");e.forEach(e=>{const n=document.createElement("option");n.innerHTML=e,n.value=e,t.append(n)})}),fetchCuisines=(()=>{DBHelper.fetchCuisines((e,t)=>{e?console.error(e):(self.cuisines=t,fillCuisinesHTML())})}),fillCuisinesHTML=((e=self.cuisines)=>{const t=document.getElementById("cuisines-select");e.forEach(e=>{const n=document.createElement("option");n.innerHTML=e,n.value=e,t.append(n)})}),updateRestaurants=(()=>{const e=document.getElementById("cuisines-select"),t=document.getElementById("neighborhoods-select"),n=e.selectedIndex,s=t.selectedIndex,o=e[n].value,a=t[s].value;DBHelper.fetchRestaurantByCuisineAndNeighborhood(o,a,(e,t)=>{e?console.error(e):(resetRestaurants(t),fillRestaurantsHTML(t))})}),resetRestaurants=(e=>{self.restaurants=[],document.getElementById("restaurants-list").innerHTML="",self.markers.forEach(e=>e.setMap(null)),self.markers=[],self.restaurants=e}),fillRestaurantsHTML=(e=>{const t=document.getElementById("restaurants-list");e.forEach(e=>{t.append(createRestaurantHTML(e))}),addMarkersToMap()}),createRestaurantHTML=(e=>{const t=document.createElement("li");if(void 0!==e.photograph){const n=document.createElement("img");n.className="restaurant-img",n.src=DBHelper.imageUrlForRestaurant(e),n.alt="Picture of "+e.name,t.append(n)}else console.log("El restaurante "+e.name+" no tiene imagen");const n=document.createElement("h2");n.innerHTML=e.name,t.append(n);const s=document.createElement("button");s.className="favorite",e.is_favorite&&s.classList.add("favorite-star"),s.innerText=getFavoriteSymbol(e.is_favorite),s.addEventListener("click",function(){console.log(e.id),this.classList.toggle("favorite-star"),this.innerText=getFavoriteSymbol(this.classList.contains("favorite-star")),e.is_favorite=this.classList.contains("favorite-star"),DBHelper.changeFavoriteStatus(e,(e,t)=>{e?console.error(e):t||alert("We couldn`t update the restaurant preference")})}),t.append(s);const o=document.createElement("p");o.innerHTML=e.neighborhood,t.append(o);const a=document.createElement("p");a.innerHTML=e.address,t.append(a);const r=document.createElement("a");return r.innerHTML="View Details",r.setAttribute("aria-label","View "+e.name+" details"),r.setAttribute("role","button"),r.href=DBHelper.urlForRestaurant(e),t.append(r),t}),addMarkersToMap=((e=self.restaurants)=>{let t=[];e.forEach(e=>{t.push(`${e.latlng.lat},${e.latlng.lng}`)});let n=`https://maps.googleapis.com/maps/api/staticmap?center=New+York,NY&zoom=10&size=600x300&maptype=roadmap&markers=color:blue|${t.join("|")}&key=AIzaSyDAqo8LahB9tPG57aPOO9ylY-uX_dfYNBw`;console.log("url: "+n),document.getElementById("map").setAttribute("src",n)});