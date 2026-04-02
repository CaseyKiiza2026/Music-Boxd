/**
 * TheAudioDB API Integration
 * Free API: https://www.theaudiodb.com/free_music_api
 */

const API_BASE = 'https://www.theaudiodb.com/api/v1/json/2';
let cachedTrendingAlbumIds = null;
let cachedBrowseAlbumIds = null;

const BROWSE_COUNTRIES = ['us', 'gb', 'ca', 'au', 'de', 'fr', 'jp'];
const BROWSE_TYPES = ['itunes', 'applemusic', 'spotify', 'deezer'];

/**
 * Safely parse JSON responses that may return an empty or invalid body.
 * @param {Response} response - Fetch response
 * @param {string} context - Request context for logging
 * @returns {Promise<Object|null>} Parsed JSON object or null
 */
async function safeParseJson(response, context) {
  const rawBody = await response.text();

  if (!rawBody || !rawBody.trim()) {
    return null;
  }

  try {
    return JSON.parse(rawBody);
  } catch (error) {
    console.warn(`Invalid JSON returned for ${context}:`, error);
    return null;
  }
}

/**
 * Search albums by artist and album name
 * @param {string} artistName - Artist name
 * @param {string} albumName - Album name (optional)
 * @returns {Promise<Array>} Array of album objects
 */
async function searchAlbums(artistName, albumName = '') {
  try {
    const endpoint = albumName
      ? `${API_BASE}/album.php?a=${encodeURIComponent(artistName)}&b=${encodeURIComponent(albumName)}`
      : `${API_BASE}/album.php?a=${encodeURIComponent(artistName)}`;

    const response = await fetch(endpoint);
    if (!response.ok) throw new Error('API request failed');

    const data = await safeParseJson(response, 'album search');
    return data?.album || [];
  } catch (error) {
    console.error('Error searching albums:', error);
    return [];
  }
}

/**
 * Get artist information by artist name
 * @param {string} artistName - Artist name
 * @returns {Promise<Object|null>} Artist object or null
 */
async function getArtist(artistName) {
  try {
    const endpoint = `${API_BASE}/artist.php?s=${encodeURIComponent(artistName)}`;
    const response = await fetch(endpoint);
    if (!response.ok) throw new Error('API request failed');

    const data = await safeParseJson(response, 'artist lookup');
    return data?.artists ? data.artists[0] : null;
  } catch (error) {
    console.error('Error fetching artist:', error);
    return null;
  }
}

/**
 * Search all albums by a track name
 * @param {string} trackName - Track name
 * @returns {Promise<Array>} Array of album objects containing the track
 */
async function searchByTrack(trackName) {
  try {
    const endpoint = `${API_BASE}/track.php?t=${encodeURIComponent(trackName)}`;
    const response = await fetch(endpoint);
    if (!response.ok) throw new Error('API request failed');

    const data = await safeParseJson(response, 'track search');
    return data?.track || [];
  } catch (error) {
    console.error('Error searching by track:', error);
    return [];
  }
}

/**
 * Get album details by album ID
 * @param {string} albumId - TheAudioDB album ID
 * @returns {Promise<Object|null>} Album object with full details
 */
async function getAlbumDetails(albumId) {
  try {
    const endpoint = `${API_BASE}/album.php?m=${albumId}`;
    const response = await fetch(endpoint);
    if (!response.ok) throw new Error('API request failed');

    const data = await safeParseJson(response, 'album details');
    return data?.album ? data.album[0] : null;
  } catch (error) {
    console.error('Error fetching album details:', error);
    return null;
  }
}

/**
 * Format album data for display
 * @param {Object} album - Album object from API
 * @returns {Object} Formatted album data
 */
function formatAlbum(album) {
  return {
    id: album.idAlbum,
    name: album.strAlbum,
    artist: album.strArtist,
    year: album.intYearReleased,
    genre: album.strGenre,
    style: album.strStyle,
    covers: {
      front: album.strAlbumThumb,
      back: album.strAlbumThumbBack,
      cd: album.strAlbumCdArt,
      spine: album.strAlbumSpineThumb
    },
    description: album.strDescription,
    review: album.strReview,
    sales: album.intSales,
    score: album.intScore,
    strRealeaseDate: album.strReleaseDate,
    label: album.strLabel
  };
}

/**
 * Get top 10 rated albums from current trending album results.
 * @returns {Promise<Array>} Array of featured albums
 */
async function getFeaturedAlbums() {
  try {
    const endpoint = `${API_BASE}/trending.php?country=us&type=itunes&format=albums`;
    const response = await fetch(endpoint);
    if (!response.ok) throw new Error('API request failed');

    const data = await safeParseJson(response, 'trending albums');
    const trendingAlbums = data?.trending || [];

    if (!trendingAlbums.length) {
      return [];
    }

    const albumIds = [...new Set(trendingAlbums.map((album) => album.idAlbum).filter(Boolean))];
    const albumDetails = await Promise.all(albumIds.map((albumId) => getAlbumDetails(albumId)));

    return albumDetails
      .filter(Boolean)
      .sort((a, b) => (Number(b.intScore) || 0) - (Number(a.intScore) || 0))
      .slice(0, 10)
      .map(formatAlbum);
  } catch (error) {
    console.error('Error fetching featured albums:', error);
    return [];
  }
}

/**
 * Build a broad album ID list by aggregating multiple chart feeds.
 * This avoids relying only on iTunes US trending for browse data.
 * @returns {Promise<Array<string>>} Unique album IDs
 */
async function getBrowseAlbumIds() {
  if (cachedBrowseAlbumIds) {
    return cachedBrowseAlbumIds;
  }

  const requests = [];
  for (const country of BROWSE_COUNTRIES) {
    for (const type of BROWSE_TYPES) {
      requests.push(
        fetch(`${API_BASE}/trending.php?country=${country}&type=${type}&format=albums`)
          .then((response) => (response.ok ? safeParseJson(response, `browse trending ${country}/${type}`) : null))
          .catch(() => null)
      );
    }
  }

  const results = await Promise.all(requests);
  const uniqueIds = new Set();

  results.forEach((data) => {
    (data?.trending || []).forEach((album) => {
      if (album?.idAlbum) {
        uniqueIds.add(album.idAlbum);
      }
    });
  });

  cachedBrowseAlbumIds = [...uniqueIds];
  return cachedBrowseAlbumIds;
}

/**
 * Get paginated albums from a broad aggregated chart catalog.
 * Only loads album details for the requested page.
 * @param {number} page - Current page number (1-based)
 * @param {number} pageSize - Number of albums per page
 * @returns {Promise<{albums: Array, page: number, totalPages: number, totalItems: number}>}
 */
async function getBrowseAlbumsPage(page = 1, pageSize = 12) {
  try {
    const browseAlbumIds = await getBrowseAlbumIds();

    // Fallback to iTunes-US trending if aggregate feeds are unavailable.
    if (!browseAlbumIds.length) {
      if (!cachedTrendingAlbumIds) {
        const endpoint = `${API_BASE}/trending.php?country=us&type=itunes&format=albums`;
        const response = await fetch(endpoint);
        if (!response.ok) throw new Error('API request failed');

        const data = await safeParseJson(response, 'trending albums for browse fallback');
        const trendingAlbums = data?.trending || [];
        cachedTrendingAlbumIds = [
          ...new Set(trendingAlbums.map((album) => album.idAlbum).filter(Boolean))
        ];
      }
    }

    const allAlbumIds = browseAlbumIds.length ? browseAlbumIds : cachedTrendingAlbumIds || [];

    const totalItems = allAlbumIds.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
    const safePage = Math.min(Math.max(1, Number(page) || 1), totalPages);
    const startIndex = (safePage - 1) * pageSize;
    const pageIds = allAlbumIds.slice(startIndex, startIndex + pageSize);

    const albumDetails = await Promise.all(pageIds.map((albumId) => getAlbumDetails(albumId)));
    const albums = albumDetails.filter(Boolean).map(formatAlbum);

    return {
      albums,
      page: safePage,
      totalPages,
      totalItems
    };
  } catch (error) {
    console.error('Error fetching paginated browse albums:', error);
    return {
      albums: [],
      page: 1,
      totalPages: 1,
      totalItems: 0
    };
  }
}

export {
  searchAlbums,
  getArtist,
  searchByTrack,
  getAlbumDetails,
  formatAlbum,
  getFeaturedAlbums,
  getBrowseAlbumsPage
};
