/**
 * Search Results Page - Paginated Search Results
 */

import { formatAlbum, searchBrowseAlbums } from './api.js';

const PAGE_SIZE = 50;

let currentPage = 1;
let totalPages = 1;
let totalItems = 0;
let currentQuery = '';
let searchCache = null;

/**
 * Run search features only on search route.
 */
function isSearchPage() {
  const path = window.location.pathname.toLowerCase();
  return path.endsWith('/search.html');
}

/**
 * Build one album card for the search grid.
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
 * Read the current search query from the URL.
 */
function getQueryFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return (params.get('q') || '').trim();
}

/**
 * Update the URL without triggering a reload.
 */
function syncUrl(query, page) {
  const url = new URL(window.location.href);

  if (query) {
    url.searchParams.set('q', query);
  } else {
    url.searchParams.delete('q');
  }

  if (page > 1) {
    url.searchParams.set('page', String(page));
  } else {
    url.searchParams.delete('page');
  }

  window.history.replaceState({}, '', url);
}

/**
 * Bind the shared top navigation search to stay on search page.
 */
function bindTopNavSearch() {
  const searchForm = document.querySelector('.nav-search-form');
  const searchInput = document.querySelector('.nav-search-input');

  if (!searchForm || !searchInput) {
    return;
  }

  const handleSearchSubmit = (event) => {
    event.preventDefault();

    const query = searchInput.value.trim();
    const targetUrl = new URL('search.html', window.location.href);

    if (query) {
      targetUrl.searchParams.set('q', query);
    } else {
      targetUrl.searchParams.delete('q');
    }

    window.location.href = targetUrl.toString();
  };

  if (window.location.pathname.endsWith('search.html')) {
    searchInput.value = getQueryFromUrl();
  }

  searchForm.addEventListener('submit', handleSearchSubmit);
}

/**
 * Load and cache search results for the active query.
 */
async function getSearchResults(query) {
  const normalizedQuery = query.trim();

  if (!normalizedQuery) {
    return [];
  }

  if (searchCache && searchCache.query === normalizedQuery) {
    return searchCache.albums;
  }

  const albums = (await searchBrowseAlbums(normalizedQuery)).map(formatAlbum);
  searchCache = { query: normalizedQuery, albums };
  return albums;
}

/**
 * Update the page heading and count copy based on the search.
 */
function updateSearchMeta(query, total) {
  const title = document.querySelector('.search-title');
  const resultCount = document.querySelector('.result-count');

  if (title) {
    title.textContent = `Search Results for "${query}"`;
  }

  if (resultCount) {
    resultCount.textContent = total ? `${total} results` : 'No results found';
  }
}

/**
 * Render the current page of search results.
 */
async function renderSearchPage(page = 1, query = currentQuery) {
  const grid = document.querySelector('.albums-grid');
  const resultCount = document.querySelector('.result-count');
  const pageStatus = document.querySelector('.page-status');
  const prevBtn = document.querySelector('[data-action="prev"]');
  const nextBtn = document.querySelector('[data-action="next"]');

  if (!grid || !resultCount || !pageStatus || !prevBtn || !nextBtn) return;

  grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--muted); padding: 44px;">Loading results...</p>';

  currentQuery = query.trim();

  if (!currentQuery) {
    grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--muted); padding: 44px;">No search query provided.</p>';
    updateSearchMeta('', 0);
    return;
  }

  const allResults = await getSearchResults(currentQuery);
  totalItems = allResults.length;
  totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
  currentPage = Math.min(Math.max(1, page), totalPages);

  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const albums = allResults.slice(startIndex, startIndex + PAGE_SIZE);

  if (!albums.length) {
    grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--muted); padding: 44px;">No albums found.</p>';
  } else {
    grid.innerHTML = albums.map(buildAlbumCard).join('');
  }

  updateSearchMeta(currentQuery, totalItems);
  pageStatus.textContent = `Page ${currentPage} of ${totalPages}`;
  prevBtn.disabled = currentPage <= 1;
  nextBtn.disabled = currentPage >= totalPages;

  syncUrl(currentQuery, currentPage);
}

/**
 * Set up search page interactions.
 */
function initSearchPage() {
  if (!isSearchPage()) return;

  const grid = document.querySelector('.albums-grid');
  if (!grid) return;

  const prevBtn = document.querySelector('[data-action="prev"]');
  const nextBtn = document.querySelector('[data-action="next"]');

  currentQuery = getQueryFromUrl();

  prevBtn?.addEventListener('click', () => {
    if (currentPage > 1) {
      renderSearchPage(currentPage - 1, currentQuery);
    }
  });

  nextBtn?.addEventListener('click', () => {
    if (currentPage < totalPages) {
      renderSearchPage(currentPage + 1, currentQuery);
    }
  });

  const initialPage = Math.max(1, Number(new URLSearchParams(window.location.search).get('page')) || 1);

  renderSearchPage(initialPage, currentQuery);
}

function initSearchModule() {
  if (!isSearchPage()) return;

  bindTopNavSearch();
  initSearchPage();
}

if (isSearchPage()) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSearchModule);
  } else {
    initSearchModule();
  }
}
