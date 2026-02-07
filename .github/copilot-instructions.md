## Purpose
This file gives focused, actionable guidance for AI coding agents working on the Adventure Map static site. Keep entries concrete and tied to existing files so suggestions are immediately implementable.

## Big picture
- This is a small static website (no build step). Main pages: `index.html` (map), `leaderboard.html`.
- Styling: `css/style.css`. Static assets: `photos/`.
- App logic is plain browser JavaScript in `js/`:
  - `js/photos.js` — canonical data: the `locations` array (person, name, country, lat, lng, photos[]).
  - `js/players.js` — `players` array used by the leaderboard.
  - `js/script.js` — map startup and UI glue: Leaflet initialization, tile layers, markers/popups, Lightbox integration.

## Quick start (developer workflows)
- No build: serve the project root over HTTP. Example (macOS/Linux):

  python3 -m http.server 8000

  Then open http://localhost:8000/index.html
- Alternatively use VS Code Live Server.
- For debugging: use the browser DevTools Console and Network tabs; missing tiles/photos typically mean incorrect relative paths or offline network access.

## Data shape & how to add content
- Locations live in `js/photos.js`. Each item must include:
  - `person` (string)
  - `name` (string)
  - `country` (string)
  - `lat`, `lng` (numbers)
  - `photos`: array of { file: "photos/xxx.jpg", caption: "..." }
- When adding a location:
  1. Add images to `photos/` and reference them with the relative path `photos/<filename>`.
  2. Add an entry to `js/photos.js` following the existing objects.
  3. No further wiring required — `js/script.js` reads the global `locations` array at runtime.

## Important code patterns & conventions
- Global data variables are used (e.g., `locations`, `players`). Scripts expect these globals to exist before `js/script.js` runs — maintain script order in `index.html` (`photos.js` before `script.js`).
- Map initialization (`js/script.js`):
  - Uses Leaflet tile layers and a `layerGroup` for combined satellite+labels.
  - Markers created by iterating `locations.forEach(loc => { ... })`; popups are HTML strings that include photo galleries.
- Lightbox handling: popups contain <a> links with `data-lightbox` attributes; `script.js` re-initializes Lightbox when popups open by calling `lightbox.init()` and `lightbox.option({...})`. Keep this when adjusting popup HTML.
- Stable Lightbox group naming uses lat/lng rounding (`group-${loc.lat.toFixed(5)}-${loc.lng.toFixed(5)}`) — preserve this pattern to avoid grouping unrelated photo galleries.

## External dependencies / integration points
- CDN libraries used in `index.html`:
  - Leaflet (map)
  - jQuery (small usage)
  - Lightbox2 (photo gallery)
  - Google Fonts
- Tile providers configured in `js/script.js`: Esri World Imagery & Esri reference labels and OpenStreetMap tiles. No API keys stored in repo — if a tile provider is changed to require auth, add keys to a local config and never commit secrets.

## Where to look for common edits
- Add a new photo or change captions: `photos/` and `js/photos.js`.
- Change map options, tile providers, or popup layout: `js/script.js`.
- Styling/layout: `css/style.css` and `index.html` header/nav.

## Rules for AI-generated changes
- Preserve script order in `index.html` and the global variable names (`locations`, `players`).
- When editing popups, ensure any inserted text is escaped (popups are raw HTML strings). Prefer to add safe strings, or sanitize input server-side (this repo is static — avoid inserting untrusted user input).
- Keep Lightbox usage intact: links must include `data-lightbox` and image `href` should point to full-size `photos/` file.

## Minimal examples to reference
- Map initialization (in `js/script.js`): creates `L.map('map', { center: [20, 0], zoom: 2, layers: [satellite, labels] })`.
- Location object example (from `js/photos.js`): { person: "Aaron", name: "Sydney Opera House", country: "Australia", lat: -33.85, lng: 151.22, photos: [{file: "photos/aaron.jpg", caption: "Original"}] }

If anything here is unclear or you want the instructions expanded (for example, a suggested testing/snippet harness or preferred code style rules), say which parts and I will iterate.
