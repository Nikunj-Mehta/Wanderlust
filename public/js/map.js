if (
  window.listing &&
  window.listing.geometry &&
  Array.isArray(window.listing.geometry.coordinates) &&
  window.listing.geometry.coordinates.length === 2
) {
  mapboxgl.accessToken = window.mapToken;

  const map = new mapboxgl.Map({
    container: 'map',
    style: "mapbox://styles/mapbox/streets-v12", // style URL replace streets-v12 by dark-v11
    center: listing.geometry.coordinates,
    zoom: 9
  });

  // // Create a custom HTML element for the marker
  // const homeIcon = document.createElement('div');
  // homeIcon.innerHTML = `<i class="fa-solid fa-house fa-2x" style="color:red;"></i>`;

  // const marker = new mapboxgl.Marker({ element: homeIcon }) // we can add multiple markers.
  const marker = new mapboxgl.Marker({ color: "red"})  
    .setLngLat(listing.geometry.coordinates)
    .setPopup(
      new mapboxgl.Popup({ offset: 25 }).setHTML(
        `<h4>${listing.title}</h4><p>Exact Location will be provided after booking!</p>`
      )
    )
    .addTo(map);
}