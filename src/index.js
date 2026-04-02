/**
 * Index Page - Featured Albums
 */

import { getFeaturedAlbums } from './api.js';

/**
 * Run homepage features only on index route.
 */
function isHomePage() {
  const path = window.location.pathname.toLowerCase();
  return path.endsWith('/index.html') || path === '/' || path === '';
}

/**
 * Render featured albums to the grid
 */
async function renderFeaturedAlbums() {
  if (!isHomePage()) {
    return;
  }

  console.log('renderFeaturedAlbums called');
  const grid = document.querySelector('.albums-grid');
  console.log('Grid element:', grid);
  if (!grid) {
    console.log('Albums grid not found - not on index page');
    return; // Not on index page
  }

  // Show loading state
  grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #FFF; padding: 40px; font-size: 14px; font-family: system-ui; background: #1a1a1a;">Loading albums...</p>';

  try {
    console.log('Fetching albums from API...');
    const albums = await getFeaturedAlbums();
    console.log('Albums fetched:', albums);

    if (albums.length === 0) {
      grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--muted);">No albums found.</p>';
      return;
    }

    grid.innerHTML = albums
      .map(
        (album) => `
      <a href="album.html?id=${album.id}" class="album-card">
        <div class="album-art">
          ${
            album.covers.front
              ? `<img src="${album.covers.front}" alt="${album.name}" style="width: 100%; height: 100%; object-fit: cover;">`
              : `<div class="album-art-label">
            <div class="vinyl-icon"></div>
          </div>`
          }
          <div class="album-overlay">View Album</div>
        </div>
        <div class="album-meta">
          <div class="title">${album.name}</div>
          <div class="artist">${album.artist}</div>
          <div class="stars">★★★★½</div>
        </div>
      </a>
    `
      )
      .join('');
  } catch (error) {
    console.error('Error rendering featured albums:', error);
    grid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #ff6b6b; padding: 40px; font-size: 14px; font-family: system-ui; background: #1a1a1a;">Error loading albums: ${error.message}</p>`;
  }
}

// Initialize on page load
if (isHomePage()) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderFeaturedAlbums);
  } else {
    renderFeaturedAlbums();
  }
}
