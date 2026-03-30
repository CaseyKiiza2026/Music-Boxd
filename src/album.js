/**
 * Album Page - Album Details
 */

import { getAlbumDetails, searchAlbums, formatAlbum } from './api.js';

/**
 * Get album ID from URL parameters
 */
function getAlbumIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id');
}

/**
 * Get album name/artist from URL parameters (fallback)
 */
function getAlbumInfoFromURL() {
  const params = new URLSearchParams(window.location.search);
  return {
    name: params.get('name'),
    artist: params.get('artist')
  };
}

/**
 * Render album hero section
 */
function renderAlbumHero(album) {
  const heroSection = document.querySelector('.album-hero');
  if (!heroSection) return;

  const heroInner = heroSection.querySelector('.album-hero-inner');
  if (!heroInner) return;

  const albumCover = heroInner.querySelector('.album-cover');
  const albumInfo = heroInner.querySelector('.album-info');

  if (albumCover && album.covers.front) {
    albumCover.innerHTML = `<img src="${album.covers.front}" alt="${album.name}" style="width: 100%; height: 100%; object-fit: cover;">`;
  }

  if (albumInfo) {
    const genreStyle = album.style ? `${album.genre} · ${album.style}` : album.genre || '';
    const yearInfo = album.year ? ` · ${album.year}` : '';

    albumInfo.innerHTML = `
      <span class="genre-tag">${genreStyle}${yearInfo}</span>
      <h1>${album.name}</h1>
      <p class="artist-line">by <a href="#">${album.artist}</a></p>

      <div class="rating-display">
        <span class="stars-large">★★★★½</span>
        <span class="count">4.8 · 142,308 ratings</span>
      </div>

      <div class="album-actions">
        <span class="badge active">✓ Listened</span>
        <span class="badge">♡ Like</span>
        <span class="badge">+ Wishlist</span>
        <span class="badge">↗ Share</span>
      </div>
    `;
  }
}

/**
 * Render album description in the main content
 */
function renderAlbumDescription(album) {
  const mainCol = document.querySelector('.album-body .main-col');
  if (!mainCol) return;

  const formCard = mainCol.querySelector('.form-card');
  if (!formCard || !album.description) return;

  // Insert album description before form card
  const descDiv = document.createElement('div');
  descDiv.className = 'album-description';
  descDiv.style.cssText = `
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 28px;
    margin-bottom: 40px;
    font-size: 14px;
    line-height: 1.7;
    color: #c0bdb9;
  `;
  descDiv.textContent = album.description;

  formCard.parentNode.insertBefore(descDiv, formCard);
}

/**
 * Render tracklist in sidebar
 */
function renderTracklist(album) {
  // Note: TheAudioDB API doesn't provide detailed tracklist in this endpoint
  // You would need to fetch tracks separately if available
  const tracklistCard = document.querySelector('.sidebar-card:has(.tracklist)');
  if (!tracklistCard || !album.id) return;

  // Placeholder - in production, fetch actual tracklist from API
}

/**
 * Fetch and render album details
 */
async function loadAlbumDetails() {
  let album = null;
  const albumId = getAlbumIdFromURL();
  const albumInfo = getAlbumInfoFromURL();

  try {
    // Try fetching by ID first
    if (albumId) {
      album = await getAlbumDetails(albumId);
      if (album) {
        album = formatAlbum(album);
      }
    }

    // Fallback: search by name/artist
    if (!album && albumInfo.name && albumInfo.artist) {
      const results = await searchAlbums(albumInfo.artist, albumInfo.name);
      if (results.length > 0) {
        album = formatAlbum(results[0]);
      }
    }

    if (!album) {
      console.warn('Album not found, using placeholder data');
      return; // Keep placeholder data
    }

    // Render album data
    renderAlbumHero(album);
    renderAlbumDescription(album);
    renderTracklist(album);

    console.log('Album loaded:', album);
  } catch (error) {
    console.error('Error loading album details:', error);
  }
}

// Initialize on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadAlbumDetails);
} else {
  loadAlbumDetails();
}
