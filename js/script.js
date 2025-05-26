const map = L.map("map").setView([20, 0], 2);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap contributors",
}).addTo(map);

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
