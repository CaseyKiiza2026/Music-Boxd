/**
 * Browse Page - Paginated Albums
 */

import { getBrowseAlbumsPage } from './api.js';

const PAGE_SIZE = 50;

let currentPage = 1;
let totalPages = 1;
let totalItems = 0;

/**
 * Build one album card for the browse grid.
 */
function buildAlbumCard(album) {
  return `
    <a href="album.html?id=${album.id}" class="album-card">
      <div class="album-art">
        ${
          album.covers.front
            ? `<img src="${album.covers.front}" alt="${album.name}" style="width: 100%; height: 100%; object-fit: cover;">`
            : `<div class="album-art-label"><div class="vinyl-icon"></div></div>`
        }
        <div class="album-overlay">View Album</div>
      </div>
      <div class="album-meta">
        <div class="title">${album.name}</div>
        <div class="artist">${album.artist}</div>
        <div class="stars">★★★★½</div>
      </div>
    </a>
  `;
}

/**
 * Render the current page of albums.
 */
async function renderBrowsePage(page = 1) {
  const grid = document.querySelector('.albums-grid');
  const resultCount = document.querySelector('.result-count');
  const pageStatus = document.querySelector('.page-status');
  const prevBtn = document.querySelector('[data-action="prev"]');
  const nextBtn = document.querySelector('[data-action="next"]');

  if (!grid || !resultCount || !pageStatus || !prevBtn || !nextBtn) return;

  grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--muted); padding: 44px;">Loading albums...</p>';

  const response = await getBrowseAlbumsPage(page, PAGE_SIZE);
  const albums = response.albums || [];

  currentPage = response.page;
  totalPages = response.totalPages;
  totalItems = response.totalItems;

  if (!albums.length) {
    grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--muted); padding: 44px;">No albums found.</p>';
  } else {
    grid.innerHTML = albums.map(buildAlbumCard).join('');
  }

  resultCount.textContent = `${totalItems} total albums`;
  pageStatus.textContent = `Page ${currentPage} of ${totalPages}`;
  prevBtn.disabled = currentPage <= 1;
  nextBtn.disabled = currentPage >= totalPages;
}

/**
 * Set up browse page interactions.
 */
function initBrowsePage() {
  const grid = document.querySelector('.albums-grid');
  if (!grid) return;

  const prevBtn = document.querySelector('[data-action="prev"]');
  const nextBtn = document.querySelector('[data-action="next"]');

  prevBtn?.addEventListener('click', () => {
    if (currentPage > 1) {
      renderBrowsePage(currentPage - 1);
    }
  });

  nextBtn?.addEventListener('click', () => {
    if (currentPage < totalPages) {
      renderBrowsePage(currentPage + 1);
    }
  });

  renderBrowsePage(1);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initBrowsePage);
} else {
  initBrowsePage();
}
