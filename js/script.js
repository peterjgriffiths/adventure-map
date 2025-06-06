const satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
  attribution: 'Tiles © Esri',
  maxZoom: 19,
});

const labels = L.tileLayer('https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}', {
  attribution: 'Labels © Esri',
  maxZoom: 19,
});

const map = L.map('map', {
  center: [20, 0],
  zoom: 2,
  layers: [satellite, labels]  // show satellite + labels
});

const baseMaps = {
  "Satellite with labels": L.layerGroup([satellite, labels]),
  "Street Map": L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: "© OpenStreetMap contributors",
    maxZoom: 19,
  }),
};

L.control.layers(baseMaps).addTo(map);




locations.forEach(loc => {
  const marker = L.marker([loc.lat, loc.lng]).addTo(map);

  // Stable group name for Lightbox2 based on lat/lng
  const lightboxGroup = `group-${loc.lat.toFixed(5)}-${loc.lng.toFixed(5)}`;

  let photoHTML = `
    <div style="
      display: flex;
      overflow-x: auto;
      gap: 8px;
      padding: 4px 0;
      max-width: 300px;
    ">
  `;

  loc.photos.forEach(photo => {
    photoHTML += `
      <div style="flex: 0 0 auto; text-align: center;">
        <a href="${photo.file}" data-lightbox="${lightboxGroup}" data-title="${photo.caption}">
          <img src="${photo.file}" alt="${photo.caption}" style="width: 100px; height: auto; border-radius: 6px;" />
        </a><br>
        <small>${photo.caption}</small>
      </div>
    `;
  });

  photoHTML += `</div>`;

  const popupContent = `
    <strong>${loc.person}</strong><br>
    ${loc.name}<br>
    ${loc.country}<br>
    ${photoHTML}
  `;

  marker.bindPopup(popupContent).on("popupopen", function () {
    if (window.lightbox && typeof lightbox.init === "function") {
      lightbox.init(); // ⬅️ This makes Lightbox recognize the popup photos
    }
  });

    // 🔄 Reinitialize Lightbox when popup opens
    marker.on('popupopen', () => {
      if (window.lightbox) {
        lightbox.option({
          resizeDuration: 200,
          wrapAround: true
        });
      }
    });
});
