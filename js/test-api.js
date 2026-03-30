/**
 * API Test Examples
 * 
 * Copy and paste these examples into the browser console to test the API
 * Run from any page that has the module loaded
 */

// Test 1: Search for an album
// Paste this in browser console:
/*
import { searchAlbums, formatAlbum } from './js/api.js';

searchAlbums('Frank Ocean', 'Blonde').then(albums => {
  if (albums.length > 0) {
    console.log('Found album:', formatAlbum(albums[0]));
  }
});
*/

// Test 2: Get featured albums
// Paste this in browser console:
/*
import { getFeaturedAlbums } from './js/api.js';

getFeaturedAlbums().then(albums => {
  console.log('Featured albums:', albums);
});
*/

// Test 3: Search by track
// Paste this in browser console:
/*
import { searchByTrack } from './js/api.js';

searchByTrack('Self Control').then(tracks => {
  console.log('Tracks found:', tracks.length);
  if (tracks.length > 0) {
    console.log('First track:', tracks[0]);
  }
});
*/

// Test 4: Get artist info
// Paste this in browser console:
/*
import { getArtist } from './js/api.js';

getArtist('Frank Ocean').then(artist => {
  console.log('Artist:', artist);
});
*/

// Test 5: Get album by ID
// Paste this in browser console:
/*
import { getAlbumDetails, formatAlbum } from './js/api.js';

// First, get the album ID from a search
import { searchAlbums } from './js/api.js';

searchAlbums('Frank Ocean', 'Blonde').then(albums => {
  if (albums.length > 0) {
    const albumId = albums[0].idAlbum;
    console.log('Album ID:', albumId);
    
    // Now get full details
    return getAlbumDetails(albumId);
  }
}).then(album => {
  console.log('Full album details:', formatAlbum(album));
});
*/

export {};
