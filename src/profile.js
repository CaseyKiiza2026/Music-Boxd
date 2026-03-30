/**
 * Profile Page - User's Album Collection
 */

import { searchAlbums, formatAlbum } from './api.js';

/**
 * Render user's reviewed albums
 */
async function renderReviewedAlbums() {
  const grid = document.querySelector('.album-grid');
  if (!grid) return;

  // Featured albums the profile user has reviewed
  const reviewedAlbums = [
    { artist: 'Frank Ocean', album: 'Blonde', rating: '★★★★★' },
    { artist: 'Tame Impala', album: 'Currents', rating: '★★★★½' },
    { artist: 'Radiohead', album: 'In Rainbows', rating: '★★★★★' },
    { artist: 'Fleetwood Mac', album: 'Rumours', rating: '★★★★' },
    { artist: 'Kendrick Lamar', album: 'To Pimp a Butterfly', rating: '★★★★★' },
    { artist: 'Clairo', album: 'Immunity', rating: '★★★½' },
    { artist: 'Lana Del Rey', album: 'Norman F***ing Rockwell!', rating: '★★★★' },
    { artist: 'Jay-Z', album: '4:44', rating: '★★★★½' }
  ];

  try {
    grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--muted); padding: 20px;">Loading albums...</p>';

    const albums = [];

    for (const reviewed of reviewedAlbums) {
      try {
        const results = await searchAlbums(reviewed.artist, reviewed.album);
        if (results.length > 0) {
          const album = formatAlbum(results[0]);
          albums.push({ ...album, rating: reviewed.rating });
        }
      } catch (error) {
        console.error(`Error fetching ${reviewed.album}:`, error);
      }
    }

    if (albums.length === 0) {
      grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--muted);">No albums found.</p>';
      return;
    }

    grid.innerHTML = albums
      .map(
        (album) => `
      <a href="album.html?id=${album.id}" class="album-tile">
        <div class="tile-art">
          ${
            album.covers.front
              ? `<img src="${album.covers.front}" alt="${album.name}" style="width: 100%; height: 100%; object-fit: cover;">`
              : `<div class="tile-vinyl"></div>`
          }
          <div class="tile-overlay"><span class="user-rating">${album.rating}</span></div>
        </div>
        <div class="tile-meta">
          <div class="t-title">${album.name}</div>
          <div class="t-artist">${album.artist}</div>
        </div>
      </a>
    `
      )
      .join('');
  } catch (error) {
    console.error('Error rendering reviewed albums:', error);
    grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--error);">Error loading albums.</p>';
  }
}

// Initialize on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    renderReviewedAlbums();
  });
} else {
  renderReviewedAlbums();
}
