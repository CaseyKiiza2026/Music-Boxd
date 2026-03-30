/**
 * Index Page - Featured Albums
 */

import { getFeaturedAlbums } from './api.js';

/**
 * Render featured albums to the grid
 */
async function renderFeaturedAlbums() {
  const grid = document.querySelector('.albums-grid');
  if (!grid) return;

  // Show loading state
  grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--muted); padding: 40px;">Loading albums...</p>';

  try {
    const albums = await getFeaturedAlbums();

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
    grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--error);">Error loading albums.</p>';
  }
}

/**
 * Render recent reviews (placeholder - can be enhanced later)
 */
function renderRecentReviews() {
  // Reviews will be fetched from backend in production
  // For now, keeping the static reviews from HTML
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  renderFeaturedAlbums();
  renderRecentReviews();
});
