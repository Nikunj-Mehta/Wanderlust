//  Only run mapbox code if listing and map container exist
if (
  window.listing &&
  window.listing.geometry &&
  Array.isArray(window.listing.geometry.coordinates) &&
  window.listing.geometry.coordinates.length === 2 &&
  document.getElementById("map") // make sure map container exists
) {
  mapboxgl.accessToken = window.mapToken;

  const map = new mapboxgl.Map({
    container: 'map', // id of map container div
    style: "mapbox://styles/mapbox/streets-v12", // style URL replace streets-v12 by dark-v11
    center: window.listing.geometry.coordinates, //  use window.listing
    zoom: 9
  });

  // // Create a custom HTML element for the marker
  // const homeIcon = document.createElement('div');
  // homeIcon.innerHTML = `<i class="fa-solid fa-house fa-2x" style="color:red;"></i>`;

  // const marker = new mapboxgl.Marker({ element: homeIcon }) // we can add multiple markers.
  const marker = new mapboxgl.Marker({ color: "red"})  
    .setLngLat(window.listing.geometry.coordinates)
    .setPopup(
      new mapboxgl.Popup({ offset: 25 }).setHTML(
        `<h4>${window.listing.title}</h4><p>Exact Location will be provided after booking!</p>`
      )
    )
    .addTo(map);
}
